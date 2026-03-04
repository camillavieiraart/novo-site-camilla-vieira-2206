/**
 * CRM Database Helpers — Consultoria de Marca Pessoal
 * Acesso restrito: somente admin (Camilla Vieira)
 */

import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { clients, professionalOrders, deliverables, crmNotes } from "../drizzle/schema";
import { MARCA_PESSOAL_PRODUCTS, calculateGroupPrice, type ProductType } from "./products-marca-pessoal";

let _db: ReturnType<typeof drizzle> | null = null;
function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); }
    catch (e) { console.warn("[CRM-DB] Failed to connect:", e); _db = null; }
  }
  if (!_db) throw new Error("Database not available");
  return _db;
}

// ─── CLIENTS ─────────────────────────────────────────────────────────────────

export async function createClient(data: {
  name: string;
  email: string;
  whatsapp: string;
  city?: string;
  profession?: string;
  niche?: string;
  instagram?: string;
  linkedin?: string;
  shootingObjective?: string;
  numberOfPeople?: number;
  howDidYouFindUs?: string;
  stripeCustomerId?: string;
}) {
  const [result] = await getDb().insert(clients).values({
    ...data,
    numberOfPeople: data.numberOfPeople ?? 1,
  });
  return (result as any).insertId as number;
}

export async function getClientByEmail(email: string) {
  const [client] = await getDb().select().from(clients).where(eq(clients.email, email));
  return client ?? null;
}

export async function getAllClients() {
  return getDb().select().from(clients).orderBy(desc(clients.createdAt));
}

export async function updateClientStripeId(id: number, stripeCustomerId: string) {
  await getDb().update(clients).set({ stripeCustomerId }).where(eq(clients.id, id));
}

// ─── PROFESSIONAL ORDERS ─────────────────────────────────────────────────────

export async function createProfessionalOrder(data: {
  clientId: number;
  productType: ProductType;
  numberOfPeople: number;
  stripeCheckoutSessionId?: string;
}) {
  const product = MARCA_PESSOAL_PRODUCTS[data.productType];
  if (!product) throw new Error(`Produto não encontrado: ${data.productType}`);

  const pricing = calculateGroupPrice(product, data.numberOfPeople);

  const [result] = await getDb().insert(professionalOrders).values({
    clientId: data.clientId,
    productType: data.productType,
    productName: product.name,
    basePrice: pricing.basePrice,
    numberOfPeople: data.numberOfPeople,
    discountAmount: pricing.discountAmount,
    totalPrice: pricing.totalPrice,
    paymentStatus: "pending",
    stripeCheckoutSessionId: data.stripeCheckoutSessionId,
    crmStage: "novo_lead",
  });

  const orderId = (result as any).insertId as number;

  // Criar deliverables automaticamente
  if (product.deliverables.length > 0) {
    await getDb().insert(deliverables).values(
      product.deliverables.map((d) => ({
        orderId,
        itemName: d.itemName,
        itemType: d.itemType,
        deadlineDays: d.deadlineDays ?? null,
        status: "pending" as const,
      }))
    );
  }

  return orderId;
}

export async function getProfessionalOrderByStripeSession(sessionId: string) {
  const [order] = await getDb()
    .select()
    .from(professionalOrders)
    .where(eq(professionalOrders.stripeCheckoutSessionId, sessionId));
  return order ?? null;
}

export async function markOrderPaid(orderId: number, data: {
  stripePaymentIntentId?: string;
  paymentMethod?: "card" | "pix";
}) {
  await getDb().update(professionalOrders).set({
    paymentStatus: "paid",
    paidAt: new Date(),
    stripePaymentIntentId: data.stripePaymentIntentId,
    paymentMethod: data.paymentMethod,
  }).where(eq(professionalOrders.id, orderId));
}

export async function getAllProfessionalOrders() {
  const orders = await getDb()
    .select({
      order: professionalOrders,
      client: clients,
    })
    .from(professionalOrders)
    .leftJoin(clients, eq(professionalOrders.clientId, clients.id))
    .orderBy(desc(professionalOrders.createdAt));
  return orders;
}

export async function getProfessionalOrderById(id: number) {
  const [row] = await getDb()
    .select({
      order: professionalOrders,
      client: clients,
    })
    .from(professionalOrders)
    .leftJoin(clients, eq(professionalOrders.clientId, clients.id))
    .where(eq(professionalOrders.id, id));

  if (!row) return null;

  const orderDeliverables = await getDb()
    .select()
    .from(deliverables)
    .where(eq(deliverables.orderId, id))
    .orderBy(deliverables.id);

  const notes = await getDb()
    .select()
    .from(crmNotes)
    .where(eq(crmNotes.orderId, id))
    .orderBy(desc(crmNotes.createdAt));

  return { ...row, deliverables: orderDeliverables, notes };
}

export async function updateOrderCrmStage(orderId: number, stage: string, note?: string) {
  await getDb().update(professionalOrders)
    .set({ crmStage: stage as any })
    .where(eq(professionalOrders.id, orderId));

  // Registrar mudança no histórico
  await getDb().insert(crmNotes).values({
    orderId,
    content: note ?? `Etapa alterada para: ${stage}`,
    noteType: "stage_change",
  });
}

export async function updateOrderDates(orderId: number, data: {
  shootingDate?: Date;
  consultationDate?: Date;
  internalNotes?: string;
}) {
  await getDb().update(professionalOrders).set(data).where(eq(professionalOrders.id, orderId));

  // Recalcular prazos dos deliverables se data do ensaio foi definida
  if (data.shootingDate) {
    const orderDeliverables = await getDb()
      .select()
      .from(deliverables)
      .where(eq(deliverables.orderId, orderId));

    for (const d of orderDeliverables) {
      if (d.deadlineDays !== null) {
        const dueDate = new Date(data.shootingDate);
        dueDate.setDate(dueDate.getDate() + d.deadlineDays);
        await getDb().update(deliverables)
          .set({ dueDate })
          .where(eq(deliverables.id, d.id));
      }
    }
  }
}

// ─── DELIVERABLES ─────────────────────────────────────────────────────────────

export async function updateDeliverableStatus(id: number, status: "pending" | "in_progress" | "completed" | "delivered") {
  const now = new Date();
  await getDb().update(deliverables).set({
    status,
    completedAt: status === "completed" ? now : undefined,
    deliveredAt: status === "delivered" ? now : undefined,
  }).where(eq(deliverables.id, id));
}

// ─── CRM NOTES ────────────────────────────────────────────────────────────────

export async function addCrmNote(data: {
  orderId: number;
  content: string;
  noteType?: "note" | "call" | "email" | "whatsapp" | "meeting" | "stage_change";
}) {
  await getDb().insert(crmNotes).values({
    orderId: data.orderId,
    content: data.content,
    noteType: data.noteType ?? "note",
  });
}

// ─── STATS ────────────────────────────────────────────────────────────────────

export async function getCrmStats() {
  const allOrders = await getDb().select().from(professionalOrders);

  type POrder = typeof allOrders[number];

  const totalRevenue = allOrders
    .filter((o: POrder) => o.paymentStatus === "paid")
    .reduce((sum: number, o: POrder) => sum + o.totalPrice, 0);

  const byStage = allOrders.reduce((acc: Record<string, number>, o: POrder) => {
    acc[o.crmStage] = (acc[o.crmStage] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalOrders: allOrders.length,
    paidOrders: allOrders.filter((o: POrder) => o.paymentStatus === "paid").length,
    totalRevenue,
    byStage,
  };
}
