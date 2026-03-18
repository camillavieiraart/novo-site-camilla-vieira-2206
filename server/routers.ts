import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { formsRouter } from "./forms-router";
import { leadsRouter } from "./leads-router";
import { shopRouter } from "./shop-router";
import { tagsRouter } from "./tags-router";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getSiteSettings, upsertSiteSetting,
  getHomeSections, getAllHomeSections, upsertHomeSection, deleteHomeSection,
  getPortfolioCategories, getAllPortfolioCategories, upsertPortfolioCategory, deletePortfolioCategory,
  getPortfolioCategoryBySlug, getShootsByCategorySlug,
  getShootsByCategory, getShootBySlug, getAllShoots, upsertShoot, deleteShoot,
  getImagesByShoot, addPortfolioImage, deletePortfolioImage,
  getImagesByCategory, getOrCreateDefaultShoot, updatePortfolioImageOrder, updatePortfolioImageCaption,
  getArtworks, getAllArtworks, getArtworkBySlug, upsertArtwork, deleteArtwork,
  getCeramics, getAllCeramics, upsertCeramic, deleteCeramic,
  getSpecialProjects, getAllSpecialProjects, upsertSpecialProject, deleteSpecialProject,
  getVideos, getAllVideos, upsertVideo, deleteVideo,
  getMentorships, getAllMentorships, upsertMentorship, deleteMentorship,
  createBooking, getAllBookings,
  createContactMessage, getAllContactMessages, markMessageRead,
  getPublishedTestimonials, getAllTestimonials, getPendingTestimonials, submitTestimonialForm, approveTestimonial, upsertTestimonial, deleteTestimonial,
  subscribeNewsletter, getAllNewsletterSubscribers, unsubscribeNewsletter, deleteNewsletterSubscriber,
  subscribeNewsletterWithPreferences, getNewsletterCampaigns, getNewsletterCampaignById, updateNewsletterSubscriber,
  getPublishedBlogPosts, getBlogPostBySlug, getAllBlogPosts, getBlogPostById, upsertBlogPost, deleteBlogPost, getBlogSitemapData,
} from "./db";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";
import { notifyOwner } from "./_core/notification";

// Admin guard middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Acesso restrito ao administrador." });
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── SITE SETTINGS ──────────────────────────────────────────────────────────
  settings: router({
    getAll: publicProcedure.query(() => getSiteSettings()),
    upsert: adminProcedure.input(z.object({ key: z.string(), value: z.string() }))
      .mutation(({ input }) => upsertSiteSetting(input.key, input.value)),
  }),

  // ─── HOME SECTIONS ──────────────────────────────────────────────────────────
  home: router({
    getSections: publicProcedure.query(() => getHomeSections()),
    getAllSections: adminProcedure.query(() => getAllHomeSections()),
    upsertSection: adminProcedure.input(z.object({
      id: z.number().optional(),
      slug: z.string(),
      title: z.string().optional(),
      subtitle: z.string().optional(),
      description: z.string().optional(),
      buttonText: z.string().optional(),
      buttonLink: z.string().optional(),
      imageUrl: z.string().optional(),
      videoUrl: z.string().optional(),
      bgColor: z.string().optional(),
      textColor: z.string().optional(),
      order: z.number().optional(),
      isActive: z.boolean().optional(),
    })).mutation(({ input }) => upsertHomeSection(input as any)),
    deleteSection: adminProcedure.input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteHomeSection(input.id)),
  }),

  // ─── PORTFOLIO CATEGORIES ───────────────────────────────────────────────────
  categories: router({
    getAll: publicProcedure.query(() => getPortfolioCategories()),
    getAllAdmin: adminProcedure.query(() => getAllPortfolioCategories()),
    getBySlug: publicProcedure.input(z.object({ slug: z.string() }))
      .query(({ input }) => getPortfolioCategoryBySlug(input.slug)),
    getShootsBySlug: publicProcedure.input(z.object({ slug: z.string() }))
      .query(({ input }) => getShootsByCategorySlug(input.slug)),
    upsert: adminProcedure.input(z.object({
      id: z.number().optional(),
      slug: z.string(),
      name: z.string(),
      description: z.string().optional(),
      coverImageUrl: z.string().optional(),
      type: z.enum(["ensaio", "fotografia_autoral", "ceramica", "projeto_especial"]).optional(),
      order: z.number().optional(),
      isActive: z.boolean().optional(),
    })).mutation(({ input }) => upsertPortfolioCategory(input as any)),
    delete: adminProcedure.input(z.object({ id: z.number() }))
      .mutation(({ input }) => deletePortfolioCategory(input.id)),
  }),

  // ─── PORTFOLIO SHOOTS ───────────────────────────────────────────────────────
  shoots: router({
    getByCategory: publicProcedure.input(z.object({ categoryId: z.number() }))
      .query(({ input }) => getShootsByCategory(input.categoryId)),
    getBySlug: publicProcedure.input(z.object({ slug: z.string() }))
      .query(({ input }) => getShootBySlug(input.slug)),
    getAll: adminProcedure.query(() => getAllShoots()),
    upsert: adminProcedure.input(z.object({
      id: z.number().optional(),
      categoryId: z.number(),
      title: z.string(),
      slug: z.string(),
      description: z.string().optional(),
      coverImageUrl: z.string().optional(),
      date: z.string().optional(),
      location: z.string().optional(),
      order: z.number().optional(),
      isActive: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
    })).mutation(({ input }) => upsertShoot(input as any)),
    delete: adminProcedure.input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteShoot(input.id)),
  }),

  // ─── PORTFOLIO IMAGES ───────────────────────────────────────────────────────
  portfolioImages: router({
    getByShoot: publicProcedure.input(z.object({ shootId: z.number() }))
      .query(({ input }) => getImagesByShoot(input.shootId)),
    getByCategory: publicProcedure.input(z.object({ categorySlug: z.string() }))
      .query(({ input }) => getImagesByCategory(input.categorySlug)),
    getOrCreateDefaultShoot: adminProcedure.input(z.object({ categorySlug: z.string() }))
      .mutation(({ input }) => getOrCreateDefaultShoot(input.categorySlug)),
    add: adminProcedure.input(z.object({
      shootId: z.number(),
      imageUrl: z.string(),
      caption: z.string().optional(),
      order: z.number().optional(),
    })).mutation(({ input }) => addPortfolioImage(input as any)),
    delete: adminProcedure.input(z.object({ id: z.number() }))
      .mutation(({ input }) => deletePortfolioImage(input.id)),
    updateOrder: adminProcedure.input(z.object({ id: z.number(), order: z.number() }))
      .mutation(({ input }) => updatePortfolioImageOrder(input.id, input.order)),
    updateCaption: adminProcedure.input(z.object({ id: z.number(), caption: z.string() }))
      .mutation(({ input }) => updatePortfolioImageCaption(input.id, input.caption)),
  }),

  // ─── ARTWORKS ───────────────────────────────────────────────────────────────
  artworks: router({
    getAll: publicProcedure.query(() => getArtworks()),
    getAllAdmin: adminProcedure.query(() => getAllArtworks()),
    getBySlug: publicProcedure.input(z.object({ slug: z.string() }))
      .query(({ input }) => getArtworkBySlug(input.slug)),
    upsert: adminProcedure.input(z.object({
      id: z.number().optional(),
      title: z.string(),
      slug: z.string(),
      series: z.string().optional(),
      year: z.string().optional(),
      technique: z.string().optional(),
      dimensions: z.string().optional(),
      description: z.string().optional(),
      poeticText: z.string().optional(),
      imageUrl: z.string(),
      additionalImages: z.string().optional(),
      audioUrl: z.string().optional(),
      videoUrl: z.string().optional(),
      buyUrl: z.string().optional(),
      price: z.string().optional(),
      priceDisplay: z.string().optional(),
      isAvailable: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      order: z.number().optional(),
      isActive: z.boolean().optional(),
    })).mutation(({ input }) => upsertArtwork(input as any)),
    delete: adminProcedure.input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteArtwork(input.id)),
  }),

  // ─── CERAMICS ───────────────────────────────────────────────────────────────
  ceramics: router({
    getAll: publicProcedure.query(() => getCeramics()),
    getAllAdmin: adminProcedure.query(() => getAllCeramics()),
    upsert: adminProcedure.input(z.object({
      id: z.number().optional(),
      title: z.string(),
      description: z.string().optional(),
      technique: z.string().optional(),
      dimensions: z.string().optional(),
      imageUrl: z.string(),
      additionalImages: z.string().optional(),
      price: z.string().optional(),
      priceDisplay: z.string().optional(),
      isAvailable: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      order: z.number().optional(),
      isActive: z.boolean().optional(),
    })).mutation(({ input }) => upsertCeramic(input as any)),
    delete: adminProcedure.input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteCeramic(input.id)),
  }),

  // ─── SPECIAL PROJECTS ───────────────────────────────────────────────────────
  specialProjects: router({
    getAll: publicProcedure.query(() => getSpecialProjects()),
    getAllAdmin: adminProcedure.query(() => getAllSpecialProjects()),
    upsert: adminProcedure.input(z.object({
      id: z.number().optional(),
      title: z.string(),
      slug: z.string(),
      type: z.enum(["colaboracao", "exposicao", "trabalho_unico", "outro"]).optional(),
      description: z.string().optional(),
      coverImageUrl: z.string().optional(),
      images: z.string().optional(),
      date: z.string().optional(),
      location: z.string().optional(),
      collaborators: z.string().optional(),
      order: z.number().optional(),
      isActive: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
    })).mutation(({ input }) => upsertSpecialProject(input as any)),
    delete: adminProcedure.input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteSpecialProject(input.id)),
  }),

  // ─── VIDEOS ─────────────────────────────────────────────────────────────────
  videos: router({
    getAll: publicProcedure.query(() => getVideos()),
    getAllAdmin: adminProcedure.query(() => getAllVideos()),
    upsert: adminProcedure.input(z.object({
      id: z.number().optional(),
      title: z.string(),
      description: z.string().optional(),
      videoUrl: z.string(),
      thumbnailUrl: z.string().optional(),
      type: z.enum(["manifesto", "bastidores", "processo", "depoimento", "outro"]).optional(),
      isActive: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      order: z.number().optional(),
    })).mutation(({ input }) => upsertVideo(input as any)),
    delete: adminProcedure.input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteVideo(input.id)),
  }),

  // ─── MENTORSHIPS ────────────────────────────────────────────────────────────
  mentorships: router({
    getAll: publicProcedure.query(() => getMentorships()),
    getAllAdmin: adminProcedure.query(() => getAllMentorships()),
    upsert: adminProcedure.input(z.object({
      id: z.number().optional(),
      title: z.string(),
      description: z.string().optional(),
      details: z.string().optional(),
      duration: z.string().optional(),
      modality: z.string().optional(),
      price: z.string().optional(),
      priceDisplay: z.string().optional(),
      isActive: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      order: z.number().optional(),
    })).mutation(({ input }) => upsertMentorship(input as any)),
    delete: adminProcedure.input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteMentorship(input.id)),
  }),

  // ─── BOOKINGS ───────────────────────────────────────────────────────────────
  bookings: router({
    create: publicProcedure.input(z.object({
      mentorshipId: z.number().optional(),
      name: z.string().min(2),
      email: z.string().email(),
      phone: z.string().optional(),
      message: z.string().optional(),
    })).mutation(async ({ input }) => {
      await createBooking(input as any);
      await notifyOwner({ title: "Novo agendamento de mentoria", content: `${input.name} (${input.email}) solicitou uma mentoria.` });
      return { success: true };
    }),
    getAll: adminProcedure.query(() => getAllBookings()),
  }),

  // ─── CONTACT ────────────────────────────────────────────────────────────────
  contact: router({
    send: publicProcedure.input(z.object({
      name: z.string().min(2),
      email: z.string().email(),
      phone: z.string().optional(),
      subject: z.string().optional(),
      message: z.string().min(10),
    })).mutation(async ({ input }) => {
      await createContactMessage(input as any);
      await notifyOwner({ title: "Nova mensagem de contato", content: `${input.name} (${input.email}): ${input.message.slice(0, 200)}` });
      // Send email notification via Resend to contato@camillavieira.art
      let emailSent = false;
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const subjectLine = input.subject
          ? `[Contato] ${input.subject}`
          : `[Contato] Nova mensagem de ${input.name}`;
        await resend.emails.send({
          from: "Site Camilla Vieira <ola@camillavieira.art>",
          to: "contato@camillavieira.art",
          replyTo: input.email,
          subject: subjectLine,
          html: `<!DOCTYPE html><html lang="pt-BR"><body style="font-family:Georgia,serif;background:#f5e6d3;margin:0;padding:0">
<div style="max-width:600px;margin:40px auto;background:#fff;border:1px solid #e8d5c0;padding:40px">
  <h1 style="font-family:Georgia,serif;color:#5c3d2e;font-size:22px;margin:0 0 8px">Nova mensagem de contato</h1>
  <p style="color:#8b6f47;font-size:13px;margin:0 0 32px;font-family:Inter,sans-serif">Recebida pelo formul\u00e1rio em camillavieira.art/contato</p>
  <table style="width:100%;border-collapse:collapse;font-family:Inter,sans-serif;font-size:14px">
    <tr><td style="padding:10px 0;border-bottom:1px solid #f0e0d0;color:#8b6f47;width:120px">Nome</td><td style="padding:10px 0;border-bottom:1px solid #f0e0d0;color:#3d2b1f">${input.name}</td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #f0e0d0;color:#8b6f47">E-mail</td><td style="padding:10px 0;border-bottom:1px solid #f0e0d0"><a href="mailto:${input.email}" style="color:#c97064">${input.email}</a></td></tr>
    ${input.phone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #f0e0d0;color:#8b6f47">Telefone</td><td style="padding:10px 0;border-bottom:1px solid #f0e0d0;color:#3d2b1f">${input.phone}</td></tr>` : ""}
    ${input.subject ? `<tr><td style="padding:10px 0;border-bottom:1px solid #f0e0d0;color:#8b6f47">Assunto</td><td style="padding:10px 0;border-bottom:1px solid #f0e0d0;color:#3d2b1f">${input.subject}</td></tr>` : ""}
  </table>
  <div style="margin-top:24px">
    <p style="color:#8b6f47;font-family:Inter,sans-serif;font-size:13px;margin:0 0 8px">Mensagem</p>
    <div style="background:#faf5ef;border-left:3px solid #c97064;padding:16px 20px;color:#3d2b1f;font-size:15px;line-height:1.7;white-space:pre-wrap">${input.message}</div>
  </div>
  <div style="margin-top:32px;padding-top:24px;border-top:1px solid #f0e0d0;text-align:center">
    <a href="mailto:${input.email}" style="display:inline-block;background:#c97064;color:#fff;padding:12px 28px;font-family:Inter,sans-serif;font-size:13px;letter-spacing:0.08em;text-decoration:none">RESPONDER</a>
  </div>
  <p style="margin-top:32px;font-size:11px;color:#b8a090;text-align:center;font-family:Inter,sans-serif">camillavieira.art</p>
</div></body></html>`,
        });
        console.log(`[contact.send] Email sent to contato@camillavieira.art (reply-to: ${input.email})`);
        emailSent = true;
      } catch (emailErr: any) {
        console.error("[contact.send] Resend email failed:", emailErr?.message || emailErr);
        // Don't throw — message was saved to DB, email is best-effort
      }
      return { success: true, emailSent };
    }),
    getAll: adminProcedure.query(() => getAllContactMessages()),
    getUnreadCount: adminProcedure.query(async () => {
      const msgs = await getAllContactMessages();
      return { count: (msgs ?? []).filter((m: any) => !m.isRead).length };
    }),
    markRead: adminProcedure.input(z.object({ id: z.number() }))
      .mutation(({ input }) => markMessageRead(input.id)),
  }),

  // ─── TESTIMONIALS ─────────────────────────────────────────────────────────
  testimonials: router({
    getPublished: publicProcedure.query(() => getPublishedTestimonials()),
    getAll: adminProcedure.query(() => getAllTestimonials()),
    getPending: adminProcedure.query(() => getPendingTestimonials()),
    // Público: enviar depoimento pelo formulário (fica pendente até moderação)
    submit: publicProcedure.input(z.object({
      name: z.string().min(2).max(200),
      role: z.string().max(200).optional(),
      sessionType: z.string().max(200).optional(),
      email: z.string().email().optional(),
      text: z.string().min(10).max(2000),
      rating: z.number().min(1).max(5).default(5),
    })).mutation(async ({ input }) => {
      await submitTestimonialForm(input);
      await notifyOwner({ title: "Novo depoimento recebido", content: `${input.name} enviou um depoimento: "${input.text.slice(0, 100)}..."` });
      return { success: true };
    }),
    // Admin: aprovar depoimento pendente
    approve: adminProcedure.input(z.object({ id: z.number() }))
      .mutation(({ input }) => approveTestimonial(input.id)),
    upsert: adminProcedure.input(z.object({
      id: z.number().optional(),
      name: z.string().min(2),
      role: z.string().optional(),
      text: z.string().min(10),
      avatarUrl: z.string().optional(),
      rating: z.number().min(1).max(5).optional(),
      isPublished: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      order: z.number().optional(),
    })).mutation(({ input }) => upsertTestimonial(input as any)),
    delete: adminProcedure.input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteTestimonial(input.id)),
  }),

    // ─── NEWSLETTER ───────────────────────────────────────────────────────
  newsletter: router({
    // Inscrição simples (compatível com popups existentes)
    subscribe: publicProcedure.input(z.object({
      email: z.string().email(),
      name: z.string().optional(),
      source: z.string().optional(),
    })).mutation(async ({ input }) => {
      const result = await subscribeNewsletter(input.email, input.name, input.source ?? "popup");
      if (result && !result.alreadyExists) {
        await notifyOwner({ title: "Nova inscrição na newsletter", content: `${input.name ?? ""} (${input.email}) se inscreveu na newsletter.` });
      }
      return result ?? { success: true, alreadyExists: false };
    }),
    // Inscrição com preferências de conteúdo e frequência
    subscribeWithPreferences: publicProcedure.input(z.object({
      email: z.string().email(),
      name: z.string().optional(),
      source: z.string().optional(),
      frequencyPreference: z.enum(["semanal", "quinzenal"]).default("semanal"),
      // "todos" | "ensaios" | "arte" | "mentoria" | "blog_alert"
      contentPreferences: z.array(z.string()).default(["todos"]),
    })).mutation(async ({ input }) => {
      const result = await subscribeNewsletterWithPreferences(
        input.email,
        input.name,
        input.source ?? "formulario",
        input.frequencyPreference,
        input.contentPreferences
      );
      if (result && !result.alreadyExists) {
        const prefs = input.contentPreferences.includes("todos") ? "todos os conteúdos" : input.contentPreferences.join(", ");
        await notifyOwner({
          title: "Nova inscrição na newsletter",
          content: `${input.name ?? ""} (${input.email}) se inscreveu. Preferências: ${prefs}. Frequência: ${input.frequencyPreference}.`,
        });
      }
      return result ?? { success: true, alreadyExists: false };
    }),
    getAll: adminProcedure.query(() => getAllNewsletterSubscribers()),
    unsubscribe: publicProcedure.input(z.object({ email: z.string().email() }))
      .mutation(({ input }) => unsubscribeNewsletter(input.email)),
    delete: adminProcedure.input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteNewsletterSubscriber(input.id)),
    updateSubscriber: adminProcedure.input(z.object({
      id: z.number(),
      isActive: z.boolean().optional(),
      frequencyPreference: z.enum(["semanal", "quinzenal"]).optional(),
      contentPreferences: z.string().optional(),
    })).mutation(({ input }) => updateNewsletterSubscriber(input.id, {
      isActive: input.isActive,
      frequencyPreference: input.frequencyPreference,
      contentPreferences: input.contentPreferences,
    })),
  }),

  // ─── NEWSLETTER CAMPAIGNS ───────────────────────────────────────────────────────
  newsletterCampaigns: router({
    getAll: adminProcedure.query(() => getNewsletterCampaigns()),
    getById: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return getNewsletterCampaignById(input.id);
    }),
    send: adminProcedure.input(z.object({
      topic: z.string().optional(),
      testEmail: z.string().email().optional(),
    })).mutation(async ({ input }) => {
      const { sendNewsletter } = await import("./newsletter-agent");
      const result = await sendNewsletter(input.topic, input.testEmail);
      if (result.success) {
        await notifyOwner({
          title: "Newsletter enviada",
          content: `Newsletter enviada para ${result.recipientCount} assinantes.`,
        });
      }
      return result;
    }),
    preview: adminProcedure.input(z.object({
      topic: z.string().optional(),
    })).mutation(async ({ input }) => {
      const { generateNewsletterContent, buildEmailHTML, getNextSendDay, getOptimalSendHour } = await import("./newsletter-agent");
      const content = await generateNewsletterContent(input.topic);
      const sendDay = await getNextSendDay();
      const sendHour = getOptimalSendHour();
      const html = buildEmailHTML(content, "preview@camillavieira.art", 0, "https://camillavieira.art", "preview");
      return { content, html, sendDay, sendHour };
    }),
    health: adminProcedure.query(async () => {
      const { checkNewsletterHealth } = await import("./newsletter-agent");
      return checkNewsletterHealth();
    }),
  }),

  // ─── FILE UPLOAD ────────────────────────────────────────────────────────────
  upload: router({
    getPresignedUrl: adminProcedure.input(z.object({
      filename: z.string(),
      contentType: z.string(),
      folder: z.string().default("uploads"),
    })).mutation(async ({ input }) => {
      const ext = input.filename.split(".").pop() || "jpg";
      const key = `${input.folder}/${nanoid()}.${ext}`;
      const { url } = await storagePut(key, Buffer.alloc(0), input.contentType);
      return { uploadUrl: url, key, publicUrl: url };
    }),
     uploadBase64: adminProcedure.input(z.object({
      base64: z.string(),
      filename: z.string(),
      contentType: z.string(),
      folder: z.string().default("uploads"),
    })).mutation(async ({ input }) => {
      const ext = input.filename.split(".").pop() || "jpg";
      const key = `${input.folder}/${nanoid()}.${ext}`;
      const buffer = Buffer.from(input.base64.replace(/^data:[^;]+;base64,/, ""), "base64");
      const { url } = await storagePut(key, buffer, input.contentType);
      return { url, key };
    }),
  }),
  // ─── BLOG ──────────────────────────────────────────────────────────────────
  blog: router({
    // Public: list published posts (with optional language filter)
    getAll: publicProcedure.input(z.object({
      limit: z.number().min(1).max(50).default(20),
      offset: z.number().min(0).default(0),
      language: z.string().max(10).optional(), // pt | en | fr
    }).optional()).query(async ({ input }) => {
      return getPublishedBlogPosts(input?.limit ?? 20, input?.offset ?? 0, input?.language);
    }),
    // Public: get single post by slug
    getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      const post = await getBlogPostBySlug(input.slug);
      if (!post) throw new TRPCError({ code: "NOT_FOUND", message: "Post n\u00e3o encontrado." });
      return post;
    }),
    // Public: sitemap data
    getSitemap: publicProcedure.query(async () => {
      return getBlogSitemapData();
    }),
    // Admin: list all posts (including drafts)
    adminGetAll: adminProcedure.query(async () => {
      return getAllBlogPosts();
    }),
    // Admin: get single post by id (for editing)
    adminGetById: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return getBlogPostById(input.id);
    }),
    // Admin: create or update post
    upsert: adminProcedure.input(z.object({
      id: z.number().optional(),
      title: z.string().min(1),
      slug: z.string().min(1),
      excerpt: z.string().optional(),
      content: z.string().min(1),
      coverImageUrl: z.string().optional(),
      coverImageAlt: z.string().optional(),
      category: z.string().optional(),
      tags: z.string().optional(), // JSON array string
      metaTitle: z.string().max(70).optional(),
      metaDescription: z.string().max(200).optional(),
      keywords: z.string().optional(),
      ogImageUrl: z.string().optional(),
      isPublished: z.boolean().default(false),
      publishedAt: z.date().optional(),
      readingTimeMinutes: z.number().optional(),
      wordCount: z.number().optional(),
      isAutoGenerated: z.boolean().default(false),
      agentTrendTopic: z.string().optional(),
      language: z.string().max(10).default("pt"),
      translationGroupId: z.string().optional(),
    })).mutation(async ({ input }) => {
      const data = {
        ...input,
        publishedAt: input.isPublished && !input.publishedAt ? new Date() : input.publishedAt,
      };
      const id = await upsertBlogPost(data);
      return { success: true, id };
    }),
    // Admin: delete post
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await deleteBlogPost(input.id);
      return { success: true };
    }),
  }),
  forms: formsRouter,
  leads: leadsRouter,
  shop: shopRouter,
  tags: tagsRouter,
});
export type AppRouter = typeof appRouter;
