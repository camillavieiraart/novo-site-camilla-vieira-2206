/**
 * Newsletter Agent — Camilla Vieira Ateliê Digital
 *
 * Estratégia de envio:
 * - Frequência: semanal
 * - Dias: rotação entre terça, quarta e quinta (A/B testing de engajamento)
 * - Horário: entre 9h e 15h (pico de abertura no Brasil: 11h-14h)
 * - Monitoramento de unsubscribe: alerta se taxa > 0.5% por envio
 * - Frequência informada no cadastro para gerenciar expectativas
 */

import { getDb } from "./db";
import {
  newsletterSubscribers,
  newslettersSent,
  emailEvents,
} from "../drizzle/schema";
import { eq, and, isNotNull, desc } from "drizzle-orm";
import { invokeLLM } from "./_core/llm";
import { Resend } from "resend";
import * as crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface NewsletterContent {
  subject: string;
  previewText: string;
  topic: string;
  headline: string;
  intro: string;
  body: string;
  quote: string;
  quoteAuthor: string;
  ctaText: string;
  ctaUrl: string;
  closingThought: string;
}

interface SendResult {
  success: boolean;
  newsletterId?: number;
  recipientCount?: number;
  scheduledDay?: string;
  scheduledHour?: number;
  testEmail?: string;
  error?: string;
}

// ─── Agendamento rotativo ─────────────────────────────────────────────────────

const SEND_DAYS = ["terca", "quarta", "quinta"] as const;
type SendDay = (typeof SEND_DAYS)[number];

const DAY_NAMES: Record<SendDay, string> = {
  terca: "Terça-feira",
  quarta: "Quarta-feira",
  quinta: "Quinta-feira",
};

/**
 * Determina qual dia da semana enviar com base no histórico.
 * Rotaciona entre terça, quarta e quinta para A/B testing de engajamento.
 */
export async function getNextSendDay(): Promise<SendDay> {
  const db = await getDb();
  if (!db) return "terca";

  const lastSent = await db
    .select({ scheduledDay: newslettersSent.scheduledDay })
    .from(newslettersSent)
    .orderBy(desc(newslettersSent.sentAt))
    .limit(1);

  if (!lastSent.length || !lastSent[0].scheduledDay) {
    return "terca";
  }

  const lastDay = lastSent[0].scheduledDay as SendDay;
  const currentIndex = SEND_DAYS.indexOf(lastDay);
  const nextIndex = (currentIndex + 1) % SEND_DAYS.length;
  return SEND_DAYS[nextIndex];
}

/**
 * Determina o horário ideal de envio.
 * Pico de engajamento no Brasil: 11h-14h (período de trabalho/almoço).
 */
export function getOptimalSendHour(): number {
  const hours = [11, 12, 13, 14];
  return hours[Math.floor(Math.random() * hours.length)];
}

// ─── Pesquisa e geração de conteúdo ──────────────────────────────────────────

const CONTENT_TOPICS = [
  "fotografia de luz natural e composição visual",
  "processo criativo na arte contemporânea brasileira",
  "cinema e linguagem visual — referências para fotógrafos",
  "cerâmica artesanal e a relação com o tempo",
  "maternidade e o olhar fotográfico",
  "cor, textura e memória na fotografia autoral",
  "bastidores de um ensaio fotográfico — do conceito à entrega",
  "arte como forma de presença e escuta",
  "fotografia e narrativa — contar histórias sem palavras",
  "o feminino na arte visual brasileira contemporânea",
];

/**
 * Gera o conteúdo completo da newsletter usando LLM,
 * pesquisando tendências e adaptando à voz da Camilla.
 */
export async function generateNewsletterContent(
  topic?: string
): Promise<NewsletterContent> {
  const selectedTopic =
    topic ||
    CONTENT_TOPICS[Math.floor(Math.random() * CONTENT_TOPICS.length)];

  const prompt = `Você é Camilla Vieira, fotógrafa e artista visual brasileira. 
Seu ateliê digital é um espaço de arte, sensibilidade e processo criativo.
Você escreve uma newsletter semanal chamada "Do Ateliê" para pessoas que amam fotografia, arte e criação.

Seu tom de voz é:
- Poético mas acessível, como uma conversa íntima
- Reflexivo, com profundidade sem ser hermético
- Caloroso, como uma carta de uma amiga artista
- Nunca comercial ou genérico — sempre pessoal e autêntico
- Usa metáforas visuais e referências ao processo criativo

Gere uma newsletter completa sobre o tema: "${selectedTopic}"

Retorne um JSON com exatamente estes campos:
{
  "subject": "Assunto do email (máx 50 chars, curioso e pessoal, sem clickbait)",
  "previewText": "Texto de preview (máx 90 chars, complementa o assunto)",
  "headline": "Título principal da newsletter (poético, 8-12 palavras)",
  "intro": "Parágrafo de abertura (3-4 frases, pessoal, como se fosse uma carta)",
  "body": "Corpo principal em HTML (3-4 parágrafos com tags p, pode incluir strong e em, 400-600 palavras, reflexivo e rico em imagens mentais)",
  "quote": "Uma citação relevante sobre o tema (de fotógrafo, artista, cineasta ou escritor)",
  "quoteAuthor": "Autor da citação",
  "ctaText": "Texto do botão de call-to-action (ex: Ver o ensaio completo, Ler no blog)",
  "ctaUrl": "URL relativa do CTA (ex: /blog, /obras, /portfolio)",
  "closingThought": "Pensamento de encerramento (1-2 frases, quente e pessoal, como uma despedida)"
}`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "Você é Camilla Vieira, fotógrafa e artista visual. Responda sempre em JSON válido.",
      },
      { role: "user", content: prompt },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "newsletter_content",
        strict: true,
        schema: {
          type: "object",
          properties: {
            subject: { type: "string" },
            previewText: { type: "string" },
            headline: { type: "string" },
            intro: { type: "string" },
            body: { type: "string" },
            quote: { type: "string" },
            quoteAuthor: { type: "string" },
            ctaText: { type: "string" },
            ctaUrl: { type: "string" },
            closingThought: { type: "string" },
          },
          required: [
            "subject",
            "previewText",
            "headline",
            "intro",
            "body",
            "quote",
            "quoteAuthor",
            "ctaText",
            "ctaUrl",
            "closingThought",
          ],
          additionalProperties: false,
        },
      },
    },
  });

  const content = JSON.parse(
    response.choices[0].message.content as string
  ) as NewsletterContent;
  content.topic = selectedTopic;
  return content;
}

// ─── Template HTML da newsletter ─────────────────────────────────────────────

/**
 * Gera o HTML completo do email com a identidade visual da Camilla Vieira.
 * Paleta terrosa: #2C2416 (fundo escuro), #F5F0E8 (creme), #C4956A (terracota), #8B7355 (dourado).
 */
export function buildEmailHTML(
  content: NewsletterContent,
  subscriberEmail: string,
  newsletterId: number,
  baseUrl: string,
  unsubscribeToken: string
): string {
  const trackOpenUrl = `${baseUrl}/api/newsletter/track?type=open&nid=${newsletterId}&email=${encodeURIComponent(subscriberEmail)}`;
  const trackClickUrl = `${baseUrl}/api/newsletter/track?type=click&nid=${newsletterId}&email=${encodeURIComponent(subscriberEmail)}&url=`;
  const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?token=${unsubscribeToken}&email=${encodeURIComponent(subscriberEmail)}`;
  const ctaFullUrl = content.ctaUrl.startsWith("http")
    ? content.ctaUrl
    : `${baseUrl}${content.ctaUrl}`;
  const trackedCtaUrl = `${trackClickUrl}${encodeURIComponent(ctaFullUrl)}`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <title>${content.subject}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background-color: #F5F0E8; font-family: Georgia, 'Times New Roman', serif; }
    .email-wrapper { background-color: #F5F0E8; padding: 40px 20px; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #FDFAF5; border-radius: 2px; overflow: hidden; }
    .header { background-color: #2C2416; padding: 40px 48px 32px; text-align: center; }
    .header-label { font-family: Arial, sans-serif; font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: #8B7355; margin-bottom: 12px; }
    .header-title { font-family: Georgia, serif; font-size: 28px; font-weight: 400; color: #F5F0E8; letter-spacing: 0.02em; line-height: 1.3; }
    .header-divider { width: 40px; height: 1px; background-color: #C4956A; margin: 20px auto 0; }
    .content { padding: 48px 48px 40px; }
    .headline { font-family: Georgia, serif; font-size: 22px; font-weight: 400; color: #2C2416; line-height: 1.5; margin-bottom: 24px; font-style: italic; }
    .intro { font-family: Georgia, serif; font-size: 16px; color: #3D3020; line-height: 1.8; margin-bottom: 28px; }
    .body-text { font-family: Arial, sans-serif; font-size: 15px; color: #4A3D2E; line-height: 1.9; margin-bottom: 28px; }
    .body-text p { margin-bottom: 20px; }
    .body-text strong { color: #2C2416; font-weight: 600; }
    .body-text em { font-style: italic; color: #6B5744; }
    .quote-block { border-left: 3px solid #C4956A; padding: 20px 24px; margin: 32px 0; background-color: #F5F0E8; }
    .quote-text { font-family: Georgia, serif; font-size: 17px; font-style: italic; color: #2C2416; line-height: 1.7; margin-bottom: 10px; }
    .quote-author { font-family: Arial, sans-serif; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: #8B7355; }
    .cta-wrapper { text-align: center; margin: 36px 0; }
    .cta-button { display: inline-block; background-color: #2C2416; color: #F5F0E8 !important; text-decoration: none; font-family: Arial, sans-serif; font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase; padding: 14px 36px; border-radius: 1px; }
    .closing { font-family: Georgia, serif; font-size: 15px; font-style: italic; color: #6B5744; line-height: 1.8; margin-top: 32px; padding-top: 28px; border-top: 1px solid #E8E0D0; }
    .signature { margin-top: 20px; font-family: Georgia, serif; font-size: 16px; color: #2C2416; }
    .frequency-note { font-family: Arial, sans-serif; font-size: 12px; color: #6B5744; background-color: #F5F0E8; padding: 12px 20px; text-align: center; border-top: 1px solid #E8E0D0; }
    .footer { background-color: #2C2416; padding: 32px 48px; text-align: center; }
    .footer-text { font-family: Arial, sans-serif; font-size: 11px; color: #8B7355; line-height: 1.8; }
    .footer-link { color: #C4956A !important; text-decoration: none; }
    .footer-divider { width: 30px; height: 1px; background-color: #8B7355; margin: 16px auto; }
    @media (max-width: 600px) {
      .content { padding: 32px 24px 28px; }
      .header { padding: 32px 24px 24px; }
      .header-title { font-size: 22px; }
      .headline { font-size: 19px; }
      .footer { padding: 24px; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <div class="header">
        <div class="header-label">Do Ateliê · Newsletter Semanal</div>
        <div class="header-title">Camilla Vieira</div>
        <div class="header-divider"></div>
      </div>
      <div class="content">
        <div class="headline">${content.headline}</div>
        <div class="intro">${content.intro}</div>
        <div class="body-text">${content.body}</div>
        <div class="quote-block">
          <div class="quote-text">"${content.quote}"</div>
          <div class="quote-author">— ${content.quoteAuthor}</div>
        </div>
        <div class="cta-wrapper">
          <a href="${trackedCtaUrl}" class="cta-button">${content.ctaText}</a>
        </div>
        <div class="closing">
          <p>${content.closingThought}</p>
          <div class="signature">Com afeto,<br><strong>Camilla</strong></div>
        </div>
      </div>
      <div class="frequency-note">
        Você recebe esta newsletter <strong>uma vez por semana</strong>, às terças, quartas ou quintas-feiras entre 9h e 15h.
      </div>
      <div class="footer">
        <div class="footer-text">
          Você está recebendo este email porque se inscreveu no ateliê digital da Camilla Vieira.
          <div class="footer-divider"></div>
          <a href="https://camillavieira.art" class="footer-link">camillavieira.art</a>
          &nbsp;·&nbsp;
          <a href="${unsubscribeUrl}" class="footer-link">Cancelar inscrição</a>
          &nbsp;·&nbsp;
          <a href="https://camillavieira.art/blog" class="footer-link">Ver no blog</a>
        </div>
      </div>
    </div>
  </div>
  <img src="${trackOpenUrl}" width="1" height="1" alt="" style="display:none;border:0;width:1px;height:1px;" />
</body>
</html>`;
}

// ─── Envio da newsletter ──────────────────────────────────────────────────────

/**
 * Envia a newsletter para todos os assinantes ativos.
 * Respeita preferência de frequência e rotaciona dias para A/B testing.
 */
export async function sendNewsletter(
  topic?: string,
  testEmail?: string
): Promise<SendResult> {
  const db = await getDb();
  if (!db) return { success: false, error: "Banco de dados indisponível." };

  try {
    // 1. Gerar conteúdo com LLM
    const content = await generateNewsletterContent(topic);
    const sendDay = await getNextSendDay();
    const sendHour = getOptimalSendHour();

    // 2. Buscar assinantes ativos
    type Subscriber = { email: string; name: string | null; unsubscribeToken: string | null };
    let subscribers: Subscriber[];

    if (testEmail) {
      subscribers = [{ email: testEmail, name: "Teste", unsubscribeToken: "test-token" }];
    } else {
      subscribers = await db
        .select({
          email: newsletterSubscribers.email,
          name: newsletterSubscribers.name,
          unsubscribeToken: newsletterSubscribers.unsubscribeToken,
        })
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.isActive, true));
    }

    if (!subscribers.length) {
      return { success: false, error: "Nenhum assinante ativo encontrado." };
    }

    const baseUrl = "https://camillavieira.art";

    // 3. Registrar newsletter no banco
    await db.insert(newslettersSent).values({
      subject: content.subject,
      previewText: content.previewText,
      topic: content.topic,
      htmlContent: buildEmailHTML(content, "preview@camillavieira.art", 0, baseUrl, "preview"),
      recipientCount: subscribers.length,
      status: "sending",
      scheduledDay: sendDay,
      scheduledHour: sendHour,
    });

    // Buscar o ID do registro inserido
    const [newsletter] = await db
      .select()
      .from(newslettersSent)
      .orderBy(desc(newslettersSent.createdAt))
      .limit(1);

    const newsletterId = newsletter.id;

    // Atualizar com HTML correto usando o ID real
    const sampleHtml = buildEmailHTML(
      content,
      "preview@camillavieira.art",
      newsletterId,
      baseUrl,
      "preview"
    );
    await db
      .update(newslettersSent)
      .set({ htmlContent: sampleHtml })
      .where(eq(newslettersSent.id, newsletterId));

    // 4. Enviar em lotes de 50
    let successCount = 0;
    const batchSize = 50;

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);

      const emails = batch.map((sub: Subscriber) => {
        const token = sub.unsubscribeToken || crypto.randomBytes(32).toString("hex");
        const html = buildEmailHTML(content, sub.email, newsletterId, baseUrl, token);

        return {
          from: "Camilla Vieira <newsletter@camillavieira.art>",
          to: sub.email,
          subject: content.subject,
          html,
          headers: {
            "List-Unsubscribe": `<${baseUrl}/api/newsletter/unsubscribe?token=${token}&email=${encodeURIComponent(sub.email)}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
          tags: [
            { name: "newsletter_id", value: String(newsletterId) },
            { name: "send_day", value: sendDay },
          ],
        };
      });

      try {
        const { error } = await resend.batch.send(emails as Parameters<typeof resend.batch.send>[0]);
        if (!error) {
          successCount += batch.length;
        } else {
          console.error(`Erro no lote ${i / batchSize + 1}:`, error);
        }
      } catch (batchError) {
        console.error(`Exceção no lote ${i / batchSize + 1}:`, batchError);
      }
    }

    // 5. Atualizar status final
    await db
      .update(newslettersSent)
      .set({
        status: successCount > 0 ? "sent" : "failed",
        recipientCount: successCount,
      })
      .where(eq(newslettersSent.id, newsletterId));

    return {
      success: successCount > 0,
      newsletterId,
      recipientCount: successCount,
      scheduledDay: DAY_NAMES[sendDay],
      scheduledHour: sendHour,
    };
  } catch (error) {
    console.error("Erro ao enviar newsletter:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

// ─── Analytics e saúde do sistema ────────────────────────────────────────────

/**
 * Verifica métricas de engajamento e alerta se taxa de unsubscribe > 0.5%.
 * 69% dos usuários cancelam por excesso de emails — monitorar é crítico.
 */
export async function checkNewsletterHealth(): Promise<{
  avgOpenRate: number;
  avgClickRate: number;
  avgUnsubscribeRate: number;
  alert: string | null;
  recommendation: string;
  bestDay: string | null;
}> {
  const db = await getDb();
  if (!db) {
    return {
      avgOpenRate: 0,
      avgClickRate: 0,
      avgUnsubscribeRate: 0,
      alert: null,
      recommendation: "Banco de dados indisponível.",
      bestDay: null,
    };
  }

  const recent = await db
    .select({
      openRate: newslettersSent.openRate,
      clickRate: newslettersSent.clickRate,
      unsubscribeRate: newslettersSent.unsubscribeRate,
      scheduledDay: newslettersSent.scheduledDay,
    })
    .from(newslettersSent)
    .where(eq(newslettersSent.status, "sent"))
    .orderBy(desc(newslettersSent.sentAt))
    .limit(10);

  if (!recent.length) {
    return {
      avgOpenRate: 0,
      avgClickRate: 0,
      avgUnsubscribeRate: 0,
      alert: null,
      recommendation: "Nenhum envio ainda. Envie a primeira newsletter para começar a coletar dados.",
      bestDay: null,
    };
  }

  const avgOpenRate =
    recent.reduce((sum: number, r) => sum + Number(r.openRate || 0), 0) / recent.length;
  const avgClickRate =
    recent.reduce((sum: number, r) => sum + Number(r.clickRate || 0), 0) / recent.length;
  const avgUnsubscribeRate =
    recent.reduce((sum: number, r) => sum + Number(r.unsubscribeRate || 0), 0) / recent.length;

  // Alerta crítico: taxa de unsubscribe > 0.5%
  let alert: string | null = null;
  if (avgUnsubscribeRate > 0.5) {
    alert = `Taxa de cancelamento em ${avgUnsubscribeRate.toFixed(2)}% (acima do limite saudável de 0.5%). Considere reduzir a frequência ou revisar o conteúdo.`;
  }

  // Análise por dia da semana para identificar melhor dia
  const dayPerformance: Record<string, { opens: number; count: number }> = {};
  for (const r of recent) {
    const day = r.scheduledDay || "desconhecido";
    if (!dayPerformance[day]) dayPerformance[day] = { opens: 0, count: 0 };
    dayPerformance[day].opens += Number(r.openRate || 0);
    dayPerformance[day].count += 1;
  }

  const sortedDays = Object.entries(dayPerformance).sort(
    (a, b) => b[1].opens / b[1].count - a[1].opens / a[1].count
  );

  const bestDayKey = sortedDays[0]?.[0] as SendDay | undefined;
  const bestDay = bestDayKey ? (DAY_NAMES[bestDayKey] || bestDayKey) : null;

  const recommendation =
    avgOpenRate < 20
      ? "Taxa de abertura abaixo de 20%. Teste assuntos mais pessoais e diretos."
      : avgOpenRate > 40
      ? `Excelente engajamento! ${bestDay ? `${bestDay} tem o melhor desempenho.` : ""}`
      : `Engajamento saudável. ${bestDay ? `${bestDay} tem o melhor desempenho.` : "Continue testando dias diferentes."}`;

  return { avgOpenRate, avgClickRate, avgUnsubscribeRate, alert, recommendation, bestDay };
}

/**
 * Registra um evento de abertura ou clique no banco.
 * Chamado pelas rotas de tracking.
 */
export async function recordEmailEvent(
  newsletterId: number,
  subscriberEmail: string,
  eventType: "open" | "click" | "unsubscribe",
  linkUrl?: string,
  userAgent?: string,
  ipAddress?: string
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    await db.insert(emailEvents).values({
      newsletterId,
      subscriberEmail,
      eventType,
      linkUrl: linkUrl || null,
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
    });

    // Atualizar contadores agregados na newsletter
    if (eventType === "open") {
      const [nl] = await db
        .select({ openCount: newslettersSent.openCount, recipientCount: newslettersSent.recipientCount })
        .from(newslettersSent)
        .where(eq(newslettersSent.id, newsletterId));

      if (nl) {
        const newOpenCount = (nl.openCount || 0) + 1;
        const openRate = nl.recipientCount
          ? (newOpenCount / nl.recipientCount) * 100
          : 0;
        await db
          .update(newslettersSent)
          .set({ openCount: newOpenCount, openRate: openRate.toFixed(2) as unknown as string })
          .where(eq(newslettersSent.id, newsletterId));
      }

      // Atualizar engajamento do assinante
      const [sub] = await db
        .select({ totalOpens: newsletterSubscribers.totalOpens })
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.email, subscriberEmail));
      if (sub !== undefined) {
        await db
          .update(newsletterSubscribers)
          .set({
            totalOpens: (sub.totalOpens || 0) + 1,
            lastOpenedAt: new Date(),
          })
          .where(eq(newsletterSubscribers.email, subscriberEmail));
      }
    }

    if (eventType === "click") {
      const [nl] = await db
        .select({ clickCount: newslettersSent.clickCount, recipientCount: newslettersSent.recipientCount })
        .from(newslettersSent)
        .where(eq(newslettersSent.id, newsletterId));

      if (nl) {
        const newClickCount = (nl.clickCount || 0) + 1;
        const clickRate = nl.recipientCount
          ? (newClickCount / nl.recipientCount) * 100
          : 0;
        await db
          .update(newslettersSent)
          .set({ clickCount: newClickCount, clickRate: clickRate.toFixed(2) as unknown as string })
          .where(eq(newslettersSent.id, newsletterId));
      }

      await db
        .update(newsletterSubscribers)
        .set({ lastClickedAt: new Date() })
        .where(eq(newsletterSubscribers.email, subscriberEmail));
    }

    if (eventType === "unsubscribe") {
      const [nl] = await db
        .select({ unsubscribeCount: newslettersSent.unsubscribeCount, recipientCount: newslettersSent.recipientCount })
        .from(newslettersSent)
        .where(eq(newslettersSent.id, newsletterId));

      if (nl) {
        const newCount = (nl.unsubscribeCount || 0) + 1;
        const rate = nl.recipientCount ? (newCount / nl.recipientCount) * 100 : 0;
        await db
          .update(newslettersSent)
          .set({ unsubscribeCount: newCount, unsubscribeRate: rate.toFixed(2) as unknown as string })
          .where(eq(newslettersSent.id, newsletterId));
      }

      await db
        .update(newsletterSubscribers)
        .set({ isActive: false })
        .where(eq(newsletterSubscribers.email, subscriberEmail));
    }
  } catch (error) {
    console.error("[Newsletter] Erro ao registrar evento:", error);
  }
}
