import { z } from "zod";
import { router, adminProcedure } from "./_core/trpc";
import { eq, desc, asc, and, or, like, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { leads, leadForms } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;
function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); }
    catch (e) { console.warn("[Leads-DB] Failed to connect:", e); _db = null; }
  }
  if (!_db) throw new Error("Database not available");
  return _db;
}

const STAGES = ["lead_frio", "lead_quente", "negociando", "fechado", "perdido"] as const;

// ─── List all leads with optional filters ─────────────────────────────────────
const listLeads = adminProcedure
  .input(z.object({
    stage: z.enum(STAGES).optional(),
    search: z.string().optional(),
  }).optional())
  .query(async ({ input }) => {
    const db = getDb();
    const rows = await db
      .select({
        id: leads.id,
        name: leads.name,
        phone: leads.phone,
        email: leads.email,
        city: leads.city,
        instagram: leads.instagram,
        serviceInterest: leads.serviceInterest,
        stage: leads.stage,
        source: leads.source,
        notes: leads.notes,
        lastContact: leads.lastContact,
        createdAt: leads.createdAt,
        updatedAt: leads.updatedAt,
      })
      .from(leads)
      .orderBy(asc(leads.stage), desc(leads.createdAt));

    // Filter by stage if provided
    let filtered = rows;
    if (input?.stage) {
      filtered = filtered.filter(r => r.stage === input.stage);
    }
    if (input?.search) {
      const q = input.search.toLowerCase();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(q) ||
        (r.phone && r.phone.includes(q)) ||
        (r.email && r.email.toLowerCase().includes(q)) ||
        (r.city && r.city.toLowerCase().includes(q))
      );
    }
    return filtered;
  });

// ─── Get leads grouped by stage (for Kanban) ──────────────────────────────────
const getKanban = adminProcedure.query(async () => {
  const db = getDb();
  const rows = await db
    .select()
    .from(leads)
    .orderBy(desc(leads.createdAt));

  // Attach form links
  const formRows = await db
    .select({
      leadId: leadForms.leadId,
      formType: leadForms.formType,
      token: leadForms.token,
      status: leadForms.status,
    })
    .from(leadForms);

  const formsByLead: Record<number, typeof formRows> = {};
  for (const f of formRows) {
    if (!formsByLead[f.leadId]) formsByLead[f.leadId] = [];
    formsByLead[f.leadId].push(f);
  }

  const grouped: Record<string, Array<typeof rows[0] & { forms: typeof formRows }>> = {
    lead_frio: [],
    lead_quente: [],
    negociando: [],
    fechado: [],
    perdido: [],
  };

  for (const lead of rows) {
    const stage = lead.stage as string;
    if (grouped[stage]) {
      grouped[stage].push({ ...lead, forms: formsByLead[lead.id] || [] });
    }
  }

  return grouped;
});

// ─── Get single lead ──────────────────────────────────────────────────────────
const getLead = adminProcedure
  .input(z.object({ id: z.number() }))
  .query(async ({ input }) => {
    const db = getDb();
    const [lead] = await db.select().from(leads).where(eq(leads.id, input.id)).limit(1);
    if (!lead) return null;

    const forms = await db.select().from(leadForms).where(eq(leadForms.leadId, input.id));
    return { ...lead, forms };
  });

// ─── Create lead ──────────────────────────────────────────────────────────────
const createLead = adminProcedure
  .input(z.object({
    name: z.string().min(1),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    city: z.string().optional(),
    instagram: z.string().optional(),
    serviceInterest: z.string().default("ensaio"),
    stage: z.enum(STAGES).default("lead_frio"),
    source: z.string().default("manual"),
    notes: z.string().optional(),
  }))
  .mutation(async ({ input }) => {
    const db = getDb();
    const result = await db.insert(leads).values({
      name: input.name,
      phone: input.phone || null,
      email: input.email || null,
      city: input.city || null,
      instagram: input.instagram || null,
      serviceInterest: input.serviceInterest,
      stage: input.stage,
      source: input.source,
      notes: input.notes || null,
    });
    return { success: true, id: Number((result as any).insertId) };
  });

// ─── Update lead ──────────────────────────────────────────────────────────────
const updateLead = adminProcedure
  .input(z.object({
    id: z.number(),
    name: z.string().min(1).optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    city: z.string().optional(),
    instagram: z.string().optional(),
    serviceInterest: z.string().optional(),
    stage: z.enum(STAGES).optional(),
    source: z.string().optional(),
    notes: z.string().optional(),
    lastContact: z.number().optional(),
  }))
  .mutation(async ({ input }) => {
    const db = getDb();
    const { id, ...data } = input;
    const updateData: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data)) {
      if (v !== undefined) updateData[k] = v;
    }
    await db.update(leads).set(updateData).where(eq(leads.id, id));
    return { success: true };
  });

// ─── Move lead stage (Kanban drag) ────────────────────────────────────────────
const moveStage = adminProcedure
  .input(z.object({
    id: z.number(),
    stage: z.enum(STAGES),
  }))
  .mutation(async ({ input }) => {
    const db = getDb();
    await db.update(leads)
      .set({ stage: input.stage })
      .where(eq(leads.id, input.id));
    return { success: true };
  });

// ─── Delete lead ──────────────────────────────────────────────────────────────
const deleteLead = adminProcedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ input }) => {
    const db = getDb();
    await db.delete(leadForms).where(eq(leadForms.leadId, input.id));
    await db.delete(leads).where(eq(leads.id, input.id));
    return { success: true };
  });

// ─── Stats ────────────────────────────────────────────────────────────────────
const getStats = adminProcedure.query(async () => {
  const db = getDb();
  const rows = await db
    .select({
      stage: leads.stage,
      count: sql<number>`COUNT(*)`,
    })
    .from(leads)
    .groupBy(leads.stage);

  const stats: Record<string, number> = {};
  for (const r of rows) {
    stats[r.stage] = Number(r.count);
  }

  const formStats = await db
    .select({
      formType: leadForms.formType,
      status: leadForms.status,
      count: sql<number>`COUNT(*)`,
    })
    .from(leadForms)
    .groupBy(leadForms.formType, leadForms.status);

  return { byStage: stats, forms: formStats };
});

export const leadsRouter = router({
  listLeads,
  getKanban,
  getLead,
  createLead,
  updateLead,
  moveStage,
  deleteLead,
  getStats,
});
