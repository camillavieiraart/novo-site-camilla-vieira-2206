import { z } from "zod";
import { router, publicProcedure, protectedProcedure, adminProcedure } from "./_core/trpc";
import { eq, desc, asc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { products, orders } from "../drizzle/schema";
import Stripe from "stripe";
import { notifyOwner } from "./_core/notification";

let _db: ReturnType<typeof drizzle> | null = null;
function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); }
    catch (e) { console.warn("[Shop-DB] Failed to connect:", e); _db = null; }
  }
  if (!_db) throw new Error("Database not available");
  return _db;
}

function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY not set");
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-02-25.clover" });
}

// ─── PUBLIC: List active products ─────────────────────────────────────────────
const listProducts = publicProcedure
  .input(z.object({
    category: z.enum(["ensaio", "obra_arte", "ceramica", "print", "mentoria"]).optional(),
  }).optional())
  .query(async ({ input }) => {
    const db = getDb();
    const rows = await db
      .select()
      .from(products)
      .where(eq(products.isActive, true))
      .orderBy(asc(products.order), desc(products.createdAt));

    if (input?.category) {
      return rows.filter(r => r.category === input.category);
    }
    return rows;
  });

// ─── PUBLIC: Get product by slug ──────────────────────────────────────────────
const getProduct = publicProcedure
  .input(z.object({ slug: z.string() }))
  .query(async ({ input }) => {
    const db = getDb();
    const [product] = await db
      .select()
      .from(products)
      .where(and(eq(products.slug, input.slug), eq(products.isActive, true)))
      .limit(1);
    return product || null;
  });

// ─── PUBLIC: Create Stripe Checkout Session ───────────────────────────────────
const createCheckoutSession = publicProcedure
  .input(z.object({
    productId: z.number(),
    customerEmail: z.string().email().optional(),
    successUrl: z.string().url(),
    cancelUrl: z.string().url(),
    shippingAddress: z.object({
      name: z.string(),
      line1: z.string(),
      line2: z.string().optional(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      country: z.string().default("BR"),
    }).optional(),
  }))
  .mutation(async ({ input }) => {
    const db = getDb();
    const stripe = getStripe();

    // Fetch product
    const [product] = await db
      .select()
      .from(products)
      .where(and(eq(products.id, input.productId), eq(products.isActive, true)))
      .limit(1);

    if (!product) throw new Error("Produto não encontrado");
    if (product.stock !== null && product.stock <= 0) throw new Error("Produto esgotado");

    // Build line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [{
      price_data: {
        currency: "brl",
        unit_amount: product.priceInCents,
        product_data: {
          name: product.name,
          description: product.shortDescription || undefined,
          images: product.imageUrl ? [product.imageUrl] : [],
          metadata: {
            productId: String(product.id),
            category: product.category,
            deliveryType: product.deliveryType,
          },
        },
      },
      quantity: 1,
    }];

    // Determine if we need shipping
    const needsShipping = product.deliveryType === "envio_fisico";

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      line_items: lineItems,
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      customer_email: input.customerEmail,
      locale: "pt-BR",
      payment_method_types: ["card"],
      metadata: {
        productId: String(product.id),
        productName: product.name,
        productCategory: product.category,
        deliveryType: product.deliveryType,
      },
      billing_address_collection: "required",
    };

    if (needsShipping) {
      sessionParams.shipping_address_collection = {
        allowed_countries: ["BR"],
      };
      sessionParams.shipping_options = [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 2500, currency: "brl" },
            display_name: "Correios PAC",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 7 },
              maximum: { unit: "business_day", value: 14 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 4500, currency: "brl" },
            display_name: "Correios SEDEX",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 2 },
              maximum: { unit: "business_day", value: 5 },
            },
          },
        },
      ];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    // Create pending order in DB
    await db.insert(orders).values({
      stripeCheckoutSessionId: session.id,
      customerEmail: input.customerEmail || "unknown@pending.com",
      productId: product.id,
      productName: product.name,
      productCategory: product.category,
      amountInCents: product.priceInCents,
      status: "pending",
      deliveryType: product.deliveryType,
    });

    return { sessionUrl: session.url, sessionId: session.id };
  });

// ─── PUBLIC: Check order status ───────────────────────────────────────────────
const getOrderStatus = publicProcedure
  .input(z.object({ sessionId: z.string() }))
  .query(async ({ input }) => {
    const db = getDb();
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.stripeCheckoutSessionId, input.sessionId))
      .limit(1);
    return order || null;
  });

// ─── ADMIN: List all products ─────────────────────────────────────────────────
const adminListProducts = adminProcedure.query(async () => {
  const db = getDb();
  return db.select().from(products).orderBy(asc(products.order), desc(products.createdAt));
});

// ─── ADMIN: Upsert product ────────────────────────────────────────────────────
const upsertProduct = adminProcedure
  .input(z.object({
    id: z.number().optional(),
    slug: z.string(),
    name: z.string().min(1),
    description: z.string().optional(),
    shortDescription: z.string().max(300).optional(),
    category: z.enum(["ensaio", "obra_arte", "ceramica", "print", "mentoria"]),
    priceInCents: z.number().min(0),
    compareAtPriceInCents: z.number().optional(),
    imageUrl: z.string().optional(),
    images: z.string().optional(),
    deliveryType: z.enum(["agendamento", "envio_fisico", "download", "acesso_online"]),
    stock: z.number().optional(),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    order: z.number().default(0),
    metadata: z.string().optional(),
  }))
  .mutation(async ({ input }) => {
    const db = getDb();
    const stripe = getStripe();

    const { id, ...data } = input;

    // Sync with Stripe
    let stripeProductId: string | undefined;
    let stripePriceId: string | undefined;

    try {
      if (id) {
        // Check if product already has Stripe IDs
        const [existing] = await db.select().from(products).where(eq(products.id, id)).limit(1);
        if (existing?.stripeProductId) {
          // Update existing Stripe product
          await stripe.products.update(existing.stripeProductId, {
            name: data.name,
            description: data.description || undefined,
            images: data.imageUrl ? [data.imageUrl] : [],
            active: data.isActive,
          });
          stripeProductId = existing.stripeProductId;

          // Create new price (Stripe prices are immutable)
          if (data.priceInCents !== existing.priceInCents) {
            const price = await stripe.prices.create({
              product: stripeProductId,
              unit_amount: data.priceInCents,
              currency: "brl",
            });
            stripePriceId = price.id;
            // Archive old price
            if (existing.stripePriceId) {
              await stripe.prices.update(existing.stripePriceId, { active: false }).catch(() => {});
            }
          } else {
            stripePriceId = existing.stripePriceId || undefined;
          }
        }
      }

      if (!stripeProductId) {
        // Create new Stripe product + price
        const stripeProduct = await stripe.products.create({
          name: data.name,
          description: data.description || undefined,
          images: data.imageUrl ? [data.imageUrl] : [],
          metadata: { category: data.category, deliveryType: data.deliveryType },
        });
        stripeProductId = stripeProduct.id;

        const price = await stripe.prices.create({
          product: stripeProductId,
          unit_amount: data.priceInCents,
          currency: "brl",
        });
        stripePriceId = price.id;
      }
    } catch (e) {
      console.warn("[Shop] Stripe sync failed:", e);
      // Continue without Stripe IDs — can be synced later
    }

    const productData = {
      ...data,
      stripeProductId: stripeProductId || null,
      stripePriceId: stripePriceId || null,
    };

    if (id) {
      await db.update(products).set(productData).where(eq(products.id, id));
      return { success: true, id };
    } else {
      const result = await db.insert(products).values(productData);
      return { success: true, id: Number((result as any).insertId) };
    }
  });

// ─── ADMIN: Delete product ────────────────────────────────────────────────────
const deleteProduct = adminProcedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ input }) => {
    const db = getDb();
    const stripe = getStripe();

    const [product] = await db.select().from(products).where(eq(products.id, input.id)).limit(1);

    // Archive in Stripe instead of deleting
    if (product?.stripeProductId) {
      await stripe.products.update(product.stripeProductId, { active: false }).catch(() => {});
    }

    await db.delete(products).where(eq(products.id, input.id));
    return { success: true };
  });

// ─── ADMIN: List orders ───────────────────────────────────────────────────────
const adminListOrders = adminProcedure
  .input(z.object({
    status: z.string().optional(),
    limit: z.number().default(50),
  }).optional())
  .query(async ({ input }) => {
    const db = getDb();
    const rows = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(input?.limit || 50);

    if (input?.status) {
      return rows.filter(r => r.status === input.status);
    }
    return rows;
  });

// ─── ADMIN: Update order status ───────────────────────────────────────────────
const updateOrderStatus = adminProcedure
  .input(z.object({
    id: z.number(),
    status: z.enum(["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"]),
    trackingCode: z.string().optional(),
    adminNotes: z.string().optional(),
    scheduledAt: z.date().optional(),
  }))
  .mutation(async ({ input }) => {
    const db = getDb();
    const { id, ...data } = input;
    const updateData: Record<string, unknown> = { status: data.status };
    if (data.trackingCode !== undefined) updateData.trackingCode = data.trackingCode;
    if (data.adminNotes !== undefined) updateData.adminNotes = data.adminNotes;
    if (data.scheduledAt !== undefined) updateData.scheduledAt = data.scheduledAt;

    await db.update(orders).set(updateData).where(eq(orders.id, id));
    return { success: true };
  });

// ─── ADMIN: Order stats ───────────────────────────────────────────────────────
const getOrderStats = adminProcedure.query(async () => {
  const db = getDb();
  const rows = await db
    .select({
      status: orders.status,
      count: sql<number>`COUNT(*)`,
      total: sql<number>`SUM(amountInCents)`,
    })
    .from(orders)
    .groupBy(orders.status);

  const stats: Record<string, { count: number; totalInCents: number }> = {};
  for (const r of rows) {
    stats[r.status] = { count: Number(r.count), totalInCents: Number(r.total) || 0 };
  }

  const totalRevenue = Object.values(stats)
    .filter((_, i) => !["cancelled", "refunded", "pending"].includes(Object.keys(stats)[i]))
    .reduce((sum, s) => sum + s.totalInCents, 0);

  return { byStatus: stats, totalRevenueInCents: totalRevenue };
});

// ─── Stripe Webhook Handler (called from Express, not tRPC) ───────────────────
export async function handleStripeWebhook(rawBody: Buffer, signature: string): Promise<void> {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) { console.warn("[Stripe] No webhook secret configured"); return; }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (e) {
    console.error("[Stripe] Webhook signature verification failed:", e);
    throw e;
  }

  const db = getDb();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const sessionId = session.id;

    // Update order status to paid
    await db.update(orders)
      .set({
        status: "paid",
        stripePaymentIntentId: session.payment_intent as string || null,
        customerEmail: session.customer_details?.email || "unknown@stripe.com",
        customerName: session.customer_details?.name || null,
        shippingAddress: (session as any).shipping_details
          ? JSON.stringify((session as any).shipping_details.address)
          : null,
      })
      .where(eq(orders.stripeCheckoutSessionId, sessionId));

    // Notify owner
    const [order] = await db.select().from(orders)
      .where(eq(orders.stripeCheckoutSessionId, sessionId))
      .limit(1);

    if (order) {
      await notifyOwner({
        title: `🛍️ Nova venda: ${order.productName}`,
        content: `Cliente: ${order.customerEmail}\nProduto: ${order.productName}\nValor: R$ ${(order.amountInCents / 100).toFixed(2)}\nEntrega: ${order.deliveryType}`,
      }).catch(() => {});
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    await db.update(orders)
      .set({ status: "cancelled" })
      .where(eq(orders.stripePaymentIntentId, intent.id));
  }
}

export const shopRouter = router({
  listProducts,
  getProduct,
  createCheckoutSession,
  getOrderStatus,
  adminListProducts,
  upsertProduct,
  deleteProduct,
  adminListOrders,
  updateOrderStatus,
  getOrderStats,
});
