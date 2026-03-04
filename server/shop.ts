/**
 * Shop — Camilla Vieira Ateliê Digital
 *
 * Integração com Stripe para venda de:
 * - Ensaios fotográficos (agendamento)
 * - Obras de arte (envio físico)
 * - Cerâmicas (envio físico)
 * - Prints (envio físico ou download)
 * - Mentorias (agendamento)
 */

import Stripe from "stripe";
import { getDb } from "./db";
import { products, orders } from "../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";
import { notifyOwner } from "./_core/notification";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Produtos ─────────────────────────────────────────────────────────────────

export async function getAllProducts(category?: string) {
  const db = await getDb();
  if (!db) return [];
  const query = db
    .select()
    .from(products)
    .orderBy(products.order, products.createdAt);
  if (category) {
    return db
      .select()
      .from(products)
      .where(and(eq(products.isActive, true), eq(products.category, category as any)))
      .orderBy(products.order);
  }
  return db.select().from(products).where(eq(products.isActive, true)).orderBy(products.order);
}

export async function getAllProductsAdmin() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).orderBy(products.order, products.createdAt);
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function upsertProduct(data: {
  id?: number;
  slug: string;
  name: string;
  description?: string;
  shortDescription?: string;
  category: "ensaio" | "obra_arte" | "ceramica" | "print" | "mentoria";
  priceInCents: number;
  compareAtPriceInCents?: number;
  imageUrl?: string;
  images?: string;
  deliveryType: "agendamento" | "envio_fisico" | "download" | "acesso_online";
  stock?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  order?: number;
  metadata?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  if (data.id) {
    await db.update(products).set({ ...data, updatedAt: new Date() }).where(eq(products.id, data.id));
    return data.id;
  } else {
    const result = await db.insert(products).values({
      ...data,
      isActive: data.isActive ?? true,
      isFeatured: data.isFeatured ?? false,
      order: data.order ?? 0,
    });
    return (result as any).insertId as number;
  }
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.delete(products).where(eq(products.id, id));
}

// ─── Pedidos ──────────────────────────────────────────────────────────────────

export async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function updateOrderStatus(id: number, data: {
  status?: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  trackingCode?: string;
  scheduledAt?: Date;
  adminNotes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.update(orders).set({ ...data, updatedAt: new Date() }).where(eq(orders.id, id));
}

// ─── Checkout Stripe ──────────────────────────────────────────────────────────

export async function createCheckoutSession(params: {
  productId: number;
  customerEmail?: string;
  customerName?: string;
  userId?: number;
  origin: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");

  const product = await getProductBySlug("");
  const rows = await db.select().from(products).where(eq(products.id, params.productId)).limit(1);
  const prod = rows[0];
  if (!prod) throw new Error("Produto não encontrado");
  if (!prod.isActive) throw new Error("Produto indisponível");

  // Criar sessão de checkout no Stripe
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: params.customerEmail,
    allow_promotion_codes: true,
    line_items: [
      {
        price_data: {
          currency: "brl",
          unit_amount: prod.priceInCents,
          product_data: {
            name: prod.name,
            description: prod.shortDescription ?? undefined,
            images: prod.imageUrl ? [prod.imageUrl] : [],
          },
        },
        quantity: 1,
      },
    ],
    client_reference_id: params.userId?.toString(),
    metadata: {
      product_id: prod.id.toString(),
      product_name: prod.name,
      product_category: prod.category,
      delivery_type: prod.deliveryType,
      user_id: params.userId?.toString() ?? "",
      customer_email: params.customerEmail ?? "",
      customer_name: params.customerName ?? "",
    },
    success_url: `${params.origin}/loja/confirmacao?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${params.origin}/loja`,
  });

  // Criar pedido pendente no banco
  await db.insert(orders).values({
    stripeCheckoutSessionId: session.id,
    customerEmail: params.customerEmail ?? "desconhecido@email.com",
    customerName: params.customerName ?? null,
    userId: params.userId ?? null,
    productId: prod.id,
    productName: prod.name,
    productCategory: prod.category,
    amountInCents: prod.priceInCents,
    deliveryType: prod.deliveryType,
    status: "pending",
  });

  return { url: session.url!, sessionId: session.id };
}

// ─── Webhook Stripe ───────────────────────────────────────────────────────────

export async function handleStripeWebhook(rawBody: Buffer, signature: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET não configurado");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    throw new Error(`Webhook signature inválida: ${err}`);
  }

  // Eventos de teste — retornar verificação
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Evento de teste detectado.");
    return { verified: true };
  }

  const db = await getDb();
  if (!db) throw new Error("DB unavailable");

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const meta = session.metadata ?? {};

      // Atualizar pedido para "paid"
      if (session.id) {
        await db
          .update(orders)
          .set({
            status: "paid",
            stripePaymentIntentId: session.payment_intent as string ?? null,
            updatedAt: new Date(),
          })
          .where(eq(orders.stripeCheckoutSessionId, session.id));
      }

      // Notificar Camilla
      await notifyOwner({
        title: `Nova venda: ${meta.product_name}`,
        content: `${meta.customer_name || meta.customer_email} comprou ${meta.product_name} (${meta.product_category}). Valor: R$ ${((session.amount_total ?? 0) / 100).toFixed(2)}.`,
      });

      // Email de confirmação para o cliente
      if (session.customer_email) {
        await sendOrderConfirmationEmail({
          customerEmail: session.customer_email,
          customerName: meta.customer_name || "cliente",
          productName: meta.product_name,
          productCategory: meta.product_category,
          deliveryType: meta.delivery_type,
          amountInCents: session.amount_total ?? 0,
        });
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const pi = event.data.object as Stripe.PaymentIntent;
      if (pi.id) {
        await db
          .update(orders)
          .set({ status: "cancelled", updatedAt: new Date() })
          .where(eq(orders.stripePaymentIntentId, pi.id));
      }
      break;
    }
  }

  return { received: true };
}

// ─── Email de confirmação ─────────────────────────────────────────────────────

async function sendOrderConfirmationEmail(params: {
  customerEmail: string;
  customerName: string;
  productName: string;
  productCategory: string;
  deliveryType: string;
  amountInCents: number;
}) {
  const deliveryMessages: Record<string, string> = {
    agendamento: "Em breve entraremos em contato para agendar a data do seu ensaio ou mentoria.",
    envio_fisico: "Seu pedido será preparado com cuidado e enviado pelos Correios. Você receberá o código de rastreamento em breve.",
    download: "Seu arquivo estará disponível para download em breve.",
    acesso_online: "Você receberá o link de acesso ao conteúdo em breve.",
  };

  const deliveryMsg = deliveryMessages[params.deliveryType] ?? "Entraremos em contato em breve com os próximos passos.";
  const amount = (params.amountInCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  await resend.emails.send({
    from: "Camilla Vieira <ola@camillavieira.art>",
    to: params.customerEmail,
    subject: `Pedido confirmado — ${params.productName}`,
    html: `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="background:#F5F0E8;font-family:Georgia,serif;margin:0;padding:40px 20px;">
  <div style="max-width:560px;margin:0 auto;background:#FDFAF5;">
    <div style="background:#2C2416;padding:36px 48px;text-align:center;">
      <p style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:#8B7355;margin:0 0 10px;">Camilla Vieira</p>
      <h1 style="font-family:Georgia,serif;font-size:22px;color:#F5F0E8;margin:0;font-weight:400;">Pedido confirmado</h1>
    </div>
    <div style="padding:40px 48px;">
      <p style="font-size:16px;color:#3D3020;line-height:1.8;">Olá, <strong>${params.customerName}</strong>,</p>
      <p style="font-size:15px;color:#4A3D2E;line-height:1.9;">Recebi seu pedido com muito carinho. Obrigada por confiar no meu trabalho.</p>
      <div style="background:#F5F0E8;padding:20px 24px;margin:24px 0;border-left:3px solid #C4956A;">
        <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:#8B7355;">Resumo do pedido</p>
        <p style="margin:0 0 4px;font-size:16px;color:#2C2416;font-weight:bold;">${params.productName}</p>
        <p style="margin:0;font-size:14px;color:#6B5744;">${amount}</p>
      </div>
      <p style="font-size:15px;color:#4A3D2E;line-height:1.9;">${deliveryMsg}</p>
      <p style="font-size:15px;font-style:italic;color:#6B5744;line-height:1.8;margin-top:32px;padding-top:24px;border-top:1px solid #E8E0D0;">Com afeto,<br><strong style="font-style:normal;color:#2C2416;">Camilla Vieira</strong></p>
    </div>
    <div style="background:#2C2416;padding:24px 48px;text-align:center;">
      <p style="font-family:Arial,sans-serif;font-size:11px;color:#8B7355;margin:0;">camillavieira.art · contato@camillavieira.art</p>
    </div>
  </div>
</body>
</html>`,
  });
}
