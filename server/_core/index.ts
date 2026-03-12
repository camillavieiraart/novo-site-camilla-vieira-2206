import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { startScheduler } from "../scheduler";
import { handleStripeWebhook } from "../shop-router";
import { getBlogSitemapData, getRssFeedData } from "../db";
import { notifyOwner } from "./notification";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Stripe webhook — MUST be before express.json() to receive raw body as Buffer
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    // Handle Manus/Stripe test events before signature verification
    try {
      const body = JSON.parse((req.body as Buffer).toString());
      if (body?.id?.startsWith('evt_test_')) {
        console.log("[Webhook] Test event detected, returning verification response");
        return res.json({ verified: true });
      }
    } catch { /* not JSON or not a test event, continue */ }

    const sig = req.headers["stripe-signature"] as string;
    if (!sig) { res.status(400).send("Missing stripe-signature header"); return; }
    try {
      await handleStripeWebhook(req.body as Buffer, sig);
      res.json({ received: true });
    } catch (e: any) {
      console.error("[Stripe Webhook] Error:", e.message);
      res.status(400).send(`Webhook Error: ${e.message}`);
    }
  });

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
      onError({ error, path }) {
        // Log unexpected server-side errors (skip auth/permission/not-found noise)
        if (error.code !== "UNAUTHORIZED" && error.code !== "FORBIDDEN" && error.code !== "NOT_FOUND") {
          console.error(`[tRPC Error] ${path ?? "unknown"}: ${error.message}`);
        }
      },
    })
  );
  // ── Endpoint público: recebe eventos do funil do agente de vendas externo ──
  app.post("/api/funnel-event", async (req, res) => {
    try {
      // CORS — permite o domínio do agente de vendas
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");

      const {
        step,          // 'visualizou_pacote' | 'preencheu_dados' | 'escolheu_datas' | 'iniciou_pagamento' | 'pagou' | 'agendou_call'
        name,
        email,
        phone,
        city,
        packageName,
        packageType,
        packagePrice,   // valor em centavos
        preferredDates,
        period,
        expectations,
        stripePaymentIntentId,
      } = req.body;

      if (!step || !email) {
        return res.status(400).json({ error: "step and email are required" });
      }

      const { drizzle } = await import("drizzle-orm/mysql2");
      const { leads } = await import("../../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      const db = drizzle(process.env.DATABASE_URL!);

      // Upsert: se já existe lead com esse email, atualiza; senão cria
      const existing = await db.select({ id: leads.id, funnelStep: leads.funnelStep })
        .from(leads)
        .where(eq(leads.email, email))
        .limit(1);

      const now = new Date();
      const stepOrder = [
        'visualizou_pacote', 'preencheu_dados', 'escolheu_datas',
        'iniciou_pagamento', 'pagou', 'agendou_call'
      ];
      const newStepIdx = stepOrder.indexOf(step);

      const updatePayload: Record<string, unknown> = {
        funnelStep: step,
        funnelLastEventAt: now,
      };
      if (packageName)  updatePayload.funnelPackage = packageName;
      if (packageType)  updatePayload.funnelPackageType = packageType;
      if (packagePrice) updatePayload.funnelPackagePrice = packagePrice;
      if (preferredDates) updatePayload.funnelPreferredDates = preferredDates;
      if (period)       updatePayload.funnelPeriod = period;
      if (expectations) updatePayload.funnelExpectations = expectations;
      if (stripePaymentIntentId) updatePayload.funnelStripePaymentIntentId = stripePaymentIntentId;
      if (step === 'pagou') updatePayload.funnelPaidAt = now;
      if (step === 'agendou_call') updatePayload.funnelCallScheduledAt = now;

      // Avança o stage do CRM automaticamente
      if (step === 'pagou' || step === 'agendou_call') {
        updatePayload.stage = 'lead_quente';
      }

      if (existing.length > 0) {
        // Só atualiza se o novo step for igual ou mais avançado
        const existingIdx = stepOrder.indexOf(existing[0].funnelStep || '');
        if (newStepIdx >= existingIdx) {
          await db.update(leads).set(updatePayload).where(eq(leads.id, existing[0].id));
        }
        return res.json({ success: true, leadId: existing[0].id, action: 'updated' });
      } else {
        // Cria novo lead
        const insertPayload: Record<string, unknown> = {
          name: name || email.split('@')[0],
          email,
          phone: phone || null,
          city: city || null,
          serviceInterest: packageType || 'ensaio',
          stage: (step === 'pagou' || step === 'agendou_call') ? 'lead_quente' : 'lead_frio',
          source: 'agente_vendas',
          ...updatePayload,
        };
        const result = await db.insert(leads).values(insertPayload as any);
        const leadId = Number((result as any).insertId);

        // Notifica a Camilla quando o cliente paga
        if (step === 'pagou') {
          await notifyOwner({
            title: `💰 Novo pagamento: ${name || email}`,
            content: `Pacote: ${packageName} | Datas: ${preferredDates} | WhatsApp: ${phone} | Email: ${email}`,
          }).catch(() => {});
        }

        return res.json({ success: true, leadId, action: 'created' });
      }
    } catch (err: any) {
      console.error("[Funnel Event] Error:", err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // CORS preflight para o endpoint do funil
  app.options("/api/funnel-event", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.sendStatus(204);
  });

  // Dynamic sitemap.xml — includes all published blog posts from the database
  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const BASE = "https://camillavieira.art";
      const today = new Date().toISOString().split("T")[0];

      // Static pages
      const staticPages = [
        { loc: "/", changefreq: "weekly", priority: "1.0", lastmod: today },
        { loc: "/portfolio", changefreq: "weekly", priority: "0.9", lastmod: today },
        { loc: "/portfolio/ensaios-femininos", changefreq: "monthly", priority: "0.8", lastmod: today },
        { loc: "/portfolio/gestante", changefreq: "monthly", priority: "0.8", lastmod: today },
        { loc: "/portfolio/profissional", changefreq: "monthly", priority: "0.8", lastmod: today },
        { loc: "/portfolio/fotografia-autoral", changefreq: "monthly", priority: "0.8", lastmod: today },
        { loc: "/portfolio/ceramica", changefreq: "monthly", priority: "0.7", lastmod: today },
        { loc: "/portfolio/projetos-especiais", changefreq: "monthly", priority: "0.7", lastmod: today },
        { loc: "/portfolio/familia", changefreq: "monthly", priority: "0.7", lastmod: today },
        { loc: "/portfolio/casamentos", changefreq: "monthly", priority: "0.7", lastmod: today },
        { loc: "/portfolio/editoriais", changefreq: "monthly", priority: "0.7", lastmod: today },
        { loc: "/obras", changefreq: "monthly", priority: "0.9", lastmod: today },
        { loc: "/fotografia", changefreq: "monthly", priority: "0.8", lastmod: today },
        { loc: "/ceramica", changefreq: "monthly", priority: "0.7", lastmod: today },
        { loc: "/projetos", changefreq: "monthly", priority: "0.7", lastmod: today },
        { loc: "/sobre", changefreq: "monthly", priority: "0.8", lastmod: today },
        { loc: "/mentorias", changefreq: "monthly", priority: "0.8", lastmod: today },
        { loc: "/ensaio-feminino", changefreq: "monthly", priority: "0.9", lastmod: today },
        { loc: "/ensaio-gestante", changefreq: "monthly", priority: "0.9", lastmod: today },
        { loc: "/loja", changefreq: "weekly", priority: "0.8", lastmod: today },
        { loc: "/blog", changefreq: "daily", priority: "0.9", lastmod: today },
        { loc: "/contato", changefreq: "yearly", priority: "0.6", lastmod: today },
      ];

      // Dynamic blog posts from database
      const posts = await getBlogSitemapData();

      const staticXml = staticPages.map(p => `
  <url>
    <loc>${BASE}${p.loc}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join("");

      const blogXml = posts.map((p: { slug: string; updatedAt: Date | null; publishedAt: Date | null }) => {
        const lastmod = (p.updatedAt || p.publishedAt || new Date()).toISOString().split("T")[0];
        return `
  <url>
    <loc>${BASE}/blog/${p.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
      }).join("");

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${staticXml}${blogXml}
</urlset>`;

      res.setHeader("Content-Type", "application/xml");
      res.setHeader("Cache-Control", "public, max-age=3600"); // cache 1h
      res.send(xml);
    } catch (err) {
      console.error("[Sitemap] Error generating sitemap:", err);
      res.status(500).send("Error generating sitemap");
    }
  });

  // RSS feed — /feed.xml with the 20 most recent published blog posts
  app.get("/feed.xml", async (_req, res) => {
    try {
      const BASE = "https://camillavieira.art";
      const posts = await getRssFeedData(20);
      const buildDate = new Date().toUTCString();
      const lastBuildDate = posts.length > 0
        ? (posts[0].publishedAt || new Date()).toUTCString()
        : buildDate;

      const escapeXml = (str: string) =>
        str
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&apos;");

      const items = posts.map((p: {
        slug: string;
        title: string;
        excerpt: string | null;
        author: string | null;
        category: string | null;
        coverImageUrl: string | null;
        publishedAt: Date | null;
        updatedAt: Date | null;
      }) => {
        const pubDate = (p.publishedAt || p.updatedAt || new Date()).toUTCString();
        const link = `${BASE}/blog/${p.slug}`;
        const description = escapeXml(p.excerpt || p.title);
        const title = escapeXml(p.title);
        const author = escapeXml(p.author || "Camilla Vieira");
        const category = escapeXml(p.category || "fotografia");
        const imageTag = p.coverImageUrl
          ? `\n      <enclosure url="${p.coverImageUrl}" type="image/jpeg" length="0" />`
          : "";
        return `
    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${description}</description>
      <author>contato@camillavieira.art (${author})</author>
      <category>${category}</category>
      <pubDate>${pubDate}</pubDate>${imageTag}
    </item>`;
      }).join("");

      const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Camilla Vieira — Fotografia é Arte</title>
    <link>${BASE}/blog</link>
    <description>Ensaios, obras, cerâmica e processo criativo. Cartas de artista da fotógrafa Camilla Vieira, em Brasília.</description>
    <language>pt-BR</language>
    <copyright>© ${new Date().getFullYear()} Camilla Vieira. Todos os direitos reservados.</copyright>
    <managingEditor>contato@camillavieira.art (Camilla Vieira)</managingEditor>
    <webMaster>contato@camillavieira.art (Camilla Vieira)</webMaster>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <pubDate>${buildDate}</pubDate>
    <ttl>60</ttl>
    <image>
      <url>${BASE}/og-image.jpg</url>
      <title>Camilla Vieira — Fotografia é Arte</title>
      <link>${BASE}/blog</link>
    </image>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

      res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=3600"); // cache 1h
      res.send(rss);
    } catch (err) {
      console.error("[RSS] Error generating feed:", err);
      res.status(500).send("Error generating RSS feed");
    }
  });

  // ── OCTALK WEBHOOK: recebe leads capturados pela Camélia ──────────────────
  app.options("/api/webhook/octalk", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(204);
  });

  app.post("/api/webhook/octalk", async (req, res) => {
    try {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

      // Octalk envia dados do lead capturado pela Camélia
      // Campos esperados (podem variar conforme configuração do Octalk):
      const {
        name, email, phone, instagram,
        service, message, source,
        // campos alternativos que o Octalk pode enviar
        contact_name, contact_email, contact_phone,
        lead_name, lead_email, lead_phone,
      } = req.body;

      // Normaliza campos (Octalk pode usar diferentes nomes)
      const leadName = name || contact_name || lead_name || "Lead Camélia";
      const leadEmail = email || contact_email || lead_email || null;
      const leadPhone = phone || contact_phone || lead_phone || null;
      const leadService = service || message || null;

      console.log("[Octalk Webhook] Lead recebido:", { leadName, leadEmail, leadPhone, leadService });

      const { drizzle } = await import("drizzle-orm/mysql2");
      const { leads } = await import("../../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      const db = drizzle(process.env.DATABASE_URL!);

      // Verifica se já existe lead com esse telefone ou email
      let existing = null;
      if (leadEmail) {
        const rows = await db.select({ id: leads.id }).from(leads).where(eq(leads.email, leadEmail)).limit(1);
        if (rows.length > 0) existing = rows[0];
      }
      if (!existing && leadPhone) {
        const rows = await db.select({ id: leads.id }).from(leads).where(eq(leads.phone, leadPhone)).limit(1);
        if (rows.length > 0) existing = rows[0];
      }

      if (existing) {
        // Atualiza lead existente
        await db.update(leads).set({
          source: "carmelia_whatsapp",
          notes: leadService ? `[Camélia] ${leadService}` : undefined,
          updatedAt: new Date(),
        } as any).where(eq(leads.id, existing.id));
        console.log("[Octalk Webhook] Lead atualizado:", existing.id);
        return res.json({ success: true, action: "updated", leadId: existing.id });
      } else {
        // Cria novo lead
        const result = await db.insert(leads).values({
          name: leadName,
          email: leadEmail,
          phone: leadPhone,
          instagram: instagram || null,
          serviceInterest: leadService || "ensaio",
          stage: "lead_frio",
          source: "carmelia_whatsapp",
          notes: leadService ? `[Camélia] ${leadService}` : null,
        } as any);
        const leadId = Number((result as any).insertId);
        console.log("[Octalk Webhook] Novo lead criado:", leadId);

        // Notifica a Camilla
        await notifyOwner({
          title: `Nova lead via Camélia: ${leadName}`,
          content: `Telefone: ${leadPhone || "não informado"} | Email: ${leadEmail || "não informado"} | Interesse: ${leadService || "não informado"}`,
        }).catch(() => {});

        return res.json({ success: true, action: "created", leadId });
      }
    } catch (err: any) {
      console.error("[Octalk Webhook] Erro:", err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    // Start scheduled tasks (blog agent, etc.)
    startScheduler();
  });
}

startServer().catch(console.error);
