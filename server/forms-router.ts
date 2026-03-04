import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { leads, leadForms, testimonials } from "../drizzle/schema";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";

let _db: ReturnType<typeof drizzle> | null = null;
function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); }
    catch (e) { console.warn("[Forms-DB] Failed to connect:", e); _db = null; }
  }
  if (!_db) throw new Error("Database not available");
  return _db;
}

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// ─── ADMIN: Generate form links for leads ────────────────────────────────────
const generateFormLinks = protectedProcedure
  .input(z.object({
    leadIds: z.array(z.number()),
    formType: z.enum(["onboarding", "satisfacao"]),
  }))
  .mutation(async ({ input, ctx }) => {
    if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    const db = getDb();
    const results: { leadId: number; name: string; token: string; url: string }[] = [];

    for (const leadId of input.leadIds) {
      const [lead] = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
      if (!lead) continue;

      // Check if form already exists
      const [existing] = await db.select({ token: leadForms.token })
        .from(leadForms)
        .where(and(eq(leadForms.leadId, leadId), eq(leadForms.formType, input.formType)))
        .limit(1);

      let token: string;
      if (existing) {
        token = existing.token;
      } else {
        token = generateToken();
        await db.insert(leadForms).values({
          token,
          leadId,
          leadName: lead.name,
          formType: input.formType,
        });
      }

      const path = input.formType === "onboarding" ? "onboarding" : "satisfacao";
      const baseUrl = process.env.VITE_APP_URL || "https://camillavieira.art";
      results.push({ leadId, name: lead.name, token, url: `${baseUrl}/formulario/${path}/${token}` });
    }
    return results;
  });

// ─── ADMIN: List all forms ────────────────────────────────────────────────────
const listForms = protectedProcedure
  .input(z.object({ formType: z.enum(["onboarding", "satisfacao"]).optional() }))
  .query(async ({ input, ctx }) => {
    if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    const db = getDb();
    const query = db.select().from(leadForms).orderBy(desc(leadForms.createdAt));
    if (input.formType) {
      return db.select().from(leadForms).where(eq(leadForms.formType, input.formType)).orderBy(desc(leadForms.createdAt));
    }
    return query;
  });

// ─── PUBLIC: Get form by token ────────────────────────────────────────────────
const getFormByToken = publicProcedure
  .input(z.object({ token: z.string().min(10) }))
  .query(async ({ input }) => {
    const db = getDb();
    const [form] = await db.select().from(leadForms).where(eq(leadForms.token, input.token)).limit(1);
    if (!form) throw new TRPCError({ code: "NOT_FOUND", message: "Formulário não encontrado." });

    // Mark as opened if first time
    if (!form.openedAt) {
      await db.update(leadForms).set({ openedAt: Date.now() }).where(eq(leadForms.token, input.token));
    }

    return {
      leadName: form.leadName,
      formType: form.formType,
      status: form.status,
    };
  });

// ─── PUBLIC: Submit onboarding form ──────────────────────────────────────────
const submitOnboarding = publicProcedure
  .input(z.object({
    token: z.string().min(10),
    fullName: z.string().min(2),
    email: z.string().email(),
    whatsapp: z.string().min(8),
    city: z.string().optional(),
    instagram: z.string().optional(),
    profession: z.string().optional(),
    workContext: z.string().optional(),
    serviceType: z.string(),
    serviceDetails: z.string().optional(),
    budgetRange: z.string().optional(),
    preferredDate: z.string().optional(),
    howFoundUs: z.string().optional(),
    expectations: z.string().optional(),
  }))
  .mutation(async ({ input }) => {
    const db = getDb();
    const [form] = await db.select().from(leadForms)
      .where(and(eq(leadForms.token, input.token), eq(leadForms.formType, "onboarding")))
      .limit(1);
    if (!form) throw new TRPCError({ code: "NOT_FOUND", message: "Formulário não encontrado." });
    if (form.status === "filled") throw new TRPCError({ code: "BAD_REQUEST", message: "Este formulário já foi preenchido." });

    const { token, ...responses } = input;
    await db.update(leadForms).set({
      status: "filled",
      responses,
      filledAt: Date.now(),
    }).where(eq(leadForms.token, token));

    // Update lead with new data
    const lead = await db.select().from(leads).where(eq(leads.id, form.leadId)).limit(1);
    if (lead[0]) {
      const currentNotes = lead[0].notes || "";
      const newNote = `\n\n[Onboarding preenchido]\nExpectativas: ${input.expectations || "(não informado)"}`;
      await db.update(leads).set({
        name: input.fullName,
        phone: input.whatsapp,
        email: input.email,
        city: input.city || null,
        notes: currentNotes + newNote,
        stage: lead[0].stage === "lead_frio" ? "lead_quente" : lead[0].stage,
      }).where(eq(leads.id, form.leadId));
    }

    return { success: true, message: "Obrigada! Seus dados foram recebidos com sucesso." };
  });

// ─── PUBLIC: Submit satisfaction survey ──────────────────────────────────────
const submitSatisfacao = publicProcedure
  .input(z.object({
    token: z.string().min(10),
    npsScore: z.number().min(0).max(10),
    qualityRating: z.number().min(1).max(5),
    communicationRating: z.number().min(1).max(5),
    deliveryRating: z.number().min(1).max(5),
    overallRating: z.number().min(1).max(5),
    bestPart: z.string().optional(),
    improvementSuggestion: z.string().optional(),
    wouldReferFriend: z.boolean(),
    referralReason: z.string().optional(),
    allowTestimonial: z.boolean().default(false),
    testimonialText: z.string().optional(),
  }))
  .mutation(async ({ input }) => {
    const db = getDb();
    const [form] = await db.select().from(leadForms)
      .where(and(eq(leadForms.token, input.token), eq(leadForms.formType, "satisfacao")))
      .limit(1);
    if (!form) throw new TRPCError({ code: "NOT_FOUND", message: "Formulário não encontrado." });
    if (form.status === "filled") throw new TRPCError({ code: "BAD_REQUEST", message: "Esta pesquisa já foi respondida." });

    const { token, ...responses } = input;
    await db.update(leadForms).set({
      status: "filled",
      responses,
      filledAt: Date.now(),
    }).where(eq(leadForms.token, token));

    // If allowed testimonial, insert into testimonials table
    if (input.allowTestimonial && input.testimonialText) {
      const [lead] = await db.select({ name: leads.name }).from(leads).where(eq(leads.id, form.leadId)).limit(1);
      const firstName = lead?.name?.split(" ")[0] || "Cliente";
      await db.insert(testimonials).values({
        name: firstName,
        text: input.testimonialText,
        rating: input.overallRating,
        isPublished: false, // Admin reviews before publishing
      });
    }

    const msg = input.npsScore >= 9
      ? "Que alegria! Obrigada por compartilhar sua experiência."
      : input.npsScore >= 7
      ? "Obrigada pelo seu retorno! Vou usar isso para melhorar."
      : "Obrigada pela honestidade. Seu feedback é muito importante para mim.";

    return { success: true, npsScore: input.npsScore, message: msg };
  });

// ─── ADMIN: Get form responses ────────────────────────────────────────────────
const getFormResponses = protectedProcedure
  .input(z.object({
    leadId: z.number().optional(),
    formType: z.enum(["onboarding", "satisfacao"]).optional(),
  }))
  .query(async ({ input, ctx }) => {
    if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
    const db = getDb();
    const conditions = [eq(leadForms.status, "filled")];
    if (input.leadId) conditions.push(eq(leadForms.leadId, input.leadId));
    if (input.formType) conditions.push(eq(leadForms.formType, input.formType));
    return db.select().from(leadForms).where(and(...conditions)).orderBy(desc(leadForms.filledAt));
  });

// ─── ADMIN: NPS summary ───────────────────────────────────────────────────────
const getNpsSummary = protectedProcedure.query(async ({ ctx }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
  const db = getDb();
  const rows = await db.select({ responses: leadForms.responses })
    .from(leadForms)
    .where(and(eq(leadForms.formType, "satisfacao"), eq(leadForms.status, "filled")));

  if (!rows.length) return { total: 0, avgNps: 0, npsScore: 0, promoters: 0, passives: 0, detractors: 0, avgQuality: 0, avgComm: 0, avgDelivery: 0, avgOverall: 0 };

  const parsed = rows.map(r => r.responses as any);
  const total = parsed.length;
  const avg = (key: string) => Math.round((parsed.reduce((s, r) => s + (r[key] || 0), 0) / total) * 10) / 10;
  const promoters = parsed.filter(r => r.npsScore >= 9).length;
  const passives = parsed.filter(r => r.npsScore >= 7 && r.npsScore < 9).length;
  const detractors = parsed.filter(r => r.npsScore < 7).length;

  return {
    total,
    avgNps: avg("npsScore"),
    npsScore: Math.round(((promoters - detractors) / total) * 100),
    promoters, passives, detractors,
    avgQuality: avg("qualityRating"),
    avgComm: avg("communicationRating"),
    avgDelivery: avg("deliveryRating"),
    avgOverall: avg("overallRating"),
  };
});

export const formsRouter = router({
  generateFormLinks,
  listForms,
  getFormByToken,
  submitOnboarding,
  submitSatisfacao,
  getFormResponses,
  getNpsSummary,
});
