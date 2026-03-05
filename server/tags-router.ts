import { z } from "zod";
import { router, adminProcedure } from "./_core/trpc";
import { eq, and, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { crmTags, leadTags } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;
function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); }
    catch (e) { console.warn("[Tags-DB] Failed to connect:", e); _db = null; }
  }
  if (!_db) throw new Error("Database not available");
  return _db;
}

export const tagsRouter = router({
  // ─── List all tags ──────────────────────────────────────────────────────────
  getAll: adminProcedure.query(async () => {
    const db = getDb();
    const rows = await db.select().from(crmTags).orderBy(crmTags.name);
    return rows;
  }),

  // ─── Create a new tag ───────────────────────────────────────────────────────
  create: adminProcedure
    .input(z.object({
      name: z.string().min(1).max(50),
      color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#8B6F47"),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(crmTags).values({
        name: input.name,
        color: input.color,
      });
      return { id: (result as any).insertId, ...input };
    }),

  // ─── Update a tag ───────────────────────────────────────────────────────────
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).max(50).optional(),
      color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(crmTags).set(data).where(eq(crmTags.id, id));
      return { success: true };
    }),

  // ─── Delete a tag ───────────────────────────────────────────────────────────
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      // Remove all lead associations first
      await db.delete(leadTags).where(eq(leadTags.tagId, input.id));
      await db.delete(crmTags).where(eq(crmTags.id, input.id));
      return { success: true };
    }),

  // ─── Get tags for a specific lead ──────────────────────────────────────────
  getForLead: adminProcedure
    .input(z.object({ leadId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const rows = await db
        .select({ id: crmTags.id, name: crmTags.name, color: crmTags.color })
        .from(leadTags)
        .innerJoin(crmTags, eq(leadTags.tagId, crmTags.id))
        .where(eq(leadTags.leadId, input.leadId));
      return rows;
    }),

  // ─── Assign tag to lead ─────────────────────────────────────────────────────
  assignToLead: adminProcedure
    .input(z.object({ leadId: z.number(), tagId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      // Use INSERT IGNORE to avoid duplicate key errors
      await db.execute(
        `INSERT IGNORE INTO lead_tags (lead_id, tag_id) VALUES (${input.leadId}, ${input.tagId})`
      );
      return { success: true };
    }),

  // ─── Remove tag from lead ───────────────────────────────────────────────────
  removeFromLead: adminProcedure
    .input(z.object({ leadId: z.number(), tagId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .delete(leadTags)
        .where(and(eq(leadTags.leadId, input.leadId), eq(leadTags.tagId, input.tagId)));
      return { success: true };
    }),

  // ─── Get leads grouped by tag (for filtering) ──────────────────────────────
  getLeadIdsByTag: adminProcedure
    .input(z.object({ tagId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const rows = await db
        .select({ leadId: leadTags.leadId })
        .from(leadTags)
        .where(eq(leadTags.tagId, input.tagId));
      return rows.map(r => r.leadId);
    }),

  // ─── Get all lead-tag assignments (for bulk display in Kanban) ─────────────
  getAllLeadTags: adminProcedure.query(async () => {
    const db = getDb();
    const rows = await db
      .select({
        leadId: leadTags.leadId,
        tagId: crmTags.id,
        tagName: crmTags.name,
        tagColor: crmTags.color,
      })
      .from(leadTags)
      .innerJoin(crmTags, eq(leadTags.tagId, crmTags.id));
    return rows;
  }),
});
