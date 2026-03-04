/**
 * Stripe Checkout — Consultoria de Marca Pessoal
 * Camilla Vieira · camillavieira.art
 */

import Stripe from "stripe";
import { Resend } from "resend";
import { notifyOwner } from "./_core/notification";
import {
  createClient,
  getClientByEmail,
  updateClientStripeId,
  createProfessionalOrder,
  getProfessionalOrderByStripeSession,
  markOrderPaid,
} from "./crm-db";
import { MARCA_PESSOAL_PRODUCTS, calculateGroupPrice, type ProductType } from "./products-marca-pessoal";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

const resend = new Resend(process.env.RESEND_API_KEY);

// ─── CREATE CHECKOUT SESSION ──────────────────────────────────────────────────

export async function createMarcaPessoalCheckout(input: {
  productType: ProductType;
  numberOfPeople: number;
  name: string;
  email: string;
  whatsapp: string;
  city?: string;
  profession?: string;
  niche?: string;
  instagram?: string;
  linkedin?: string;
  shootingObjective?: string;
  howDidYouFindUs?: string;
  origin: string;
}) {
  const product = MARCA_PESSOAL_PRODUCTS[input.productType];
  if (!product) throw new Error(`Produto não encontrado: ${input.productType}`);

  const pricing = calculateGroupPrice(product, input.numberOfPeople);
  const isGroupQuote = input.numberOfPeople >= 6;

  // Criar ou recuperar cliente no CRM
  let clientId: number;
  const existing = await getClientByEmail(input.email);
  if (existing) {
    clientId = existing.id;
  } else {
    clientId = await createClient({
      name: input.name,
      email: input.email,
      whatsapp: input.whatsapp,
      city: input.city,
      profession: input.profession,
      niche: input.niche,
      instagram: input.instagram,
      linkedin: input.linkedin,
      shootingObjective: input.shootingObjective,
      numberOfPeople: input.numberOfPeople,
      howDidYouFindUs: input.howDidYouFindUs,
    });
  }

  // Orçamento personalizado para grupos 6+
  if (isGroupQuote) {
    const orderId = await createProfessionalOrder({
      clientId,
      productType: input.productType,
      numberOfPeople: input.numberOfPeople,
    });

    await notifyOwner({
      title: `🏢 Orçamento Grupo: ${input.name}`,
      content: `${input.name} (${input.email}) solicitou orçamento para ${input.numberOfPeople} pessoas no ${product.name}.\nWhatsApp: ${input.whatsapp}\nProfissão: ${input.profession ?? "—"}\nPedido CRM #${orderId}`,
    });

    return { checkoutUrl: null, isGroupQuote: true, orderId };
  }

  // Criar sessão Stripe
  let stripeCustomerId: string | undefined;
  if (existing?.stripeCustomerId) {
    stripeCustomerId = existing.stripeCustomerId;
  } else {
    const customer = await stripe.customers.create({
      name: input.name,
      email: input.email,
      phone: input.whatsapp,
      metadata: {
        clientId: String(clientId),
        profession: input.profession ?? "",
        niche: input.niche ?? "",
        instagram: input.instagram ?? "",
        linkedin: input.linkedin ?? "",
      },
    });
    stripeCustomerId = customer.id;
    await updateClientStripeId(clientId, stripeCustomerId);
  }

  // Criar pedido no CRM (pending)
  const orderId = await createProfessionalOrder({
    clientId,
    productType: input.productType,
    numberOfPeople: input.numberOfPeople,
  });

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "brl",
          unit_amount: pricing.totalPrice,
          product_data: {
            name: `${product.name} — Camilla Vieira`,
            description: product.tagline,
            images: ["https://camillavieira.art/og-image.jpg"],
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    allow_promotion_codes: true,
    success_url: `${input.origin}/mentorias/profissionais/obrigado?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${input.origin}/mentorias/profissionais`,
    client_reference_id: String(clientId),
    metadata: {
      clientId: String(clientId),
      orderId: String(orderId),
      productType: input.productType,
      numberOfPeople: String(input.numberOfPeople),
      customerEmail: input.email,
      customerName: input.name,
    },
  });

  // Atualizar pedido com session ID
  const { db: getDb } = await import("./crm-db").then(async (m) => {
    // Update session ID on the order
    const { drizzle } = await import("drizzle-orm/mysql2");
    const { professionalOrders } = await import("../drizzle/schema");
    const { eq } = await import("drizzle-orm");
    const _db = drizzle(process.env.DATABASE_URL!);
    await _db.update(professionalOrders)
      .set({ stripeCheckoutSessionId: session.id })
      .where(eq(professionalOrders.id, orderId));
    return { db: _db };
  });

  return { checkoutUrl: session.url, isGroupQuote: false, orderId, sessionId: session.id };
}

// ─── WEBHOOK HANDLER ─────────────────────────────────────────────────────────

export async function handleStripeWebhook(payload: Buffer, signature: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    throw new Error(`Webhook signature verification failed: ${(err as Error).message}`);
  }

  // Test events
  if (event.id.startsWith("evt_test_")) {
    return { verified: true };
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (!orderId) return { received: true };

    const order = await getProfessionalOrderByStripeSession(session.id);
    if (!order) return { received: true };

    const paymentIntent = session.payment_intent as string | null;
    const paymentMethod = session.payment_method_types?.[0] === "pix" ? "pix" : "card";

    await markOrderPaid(order.id, {
      stripePaymentIntentId: paymentIntent ?? undefined,
      paymentMethod,
    });

    // Notificar Camilla
    const clientEmail = session.metadata?.customerEmail ?? "";
    const clientName = session.metadata?.customerName ?? "Cliente";
    const productType = session.metadata?.productType ?? "";
    const product = MARCA_PESSOAL_PRODUCTS[productType as ProductType];

    await notifyOwner({
      title: `💰 Novo Pedido Pago: ${clientName}`,
      content: `${clientName} (${clientEmail}) contratou ${product?.name ?? productType}.\nValor: R$ ${((session.amount_total ?? 0) / 100).toLocaleString("pt-BR")}\nPedido CRM #${order.id}`,
    });

    // Email de confirmação para o cliente
    if (clientEmail && resend) {
      await resend.emails.send({
        from: "Camilla Vieira <ola@camillavieira.art>",
        to: clientEmail,
        subject: `Confirmação de contratação — ${product?.name ?? "Consultoria de Marca Pessoal"}`,
        html: buildConfirmationEmail(clientName, product?.name ?? productType, order.id),
      });
    }
  }

  return { received: true };
}

function buildConfirmationEmail(name: string, productName: string, orderId: number): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#1a1410;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:0 auto;background:#1a1410;color:#f5e6d3;">
    <div style="padding:48px 40px 32px;border-bottom:1px solid #3d2b1f;">
      <p style="font-size:11px;letter-spacing:4px;color:#8b6f47;margin:0 0 16px;text-transform:uppercase;">Camilla Vieira</p>
      <h1 style="font-size:28px;font-weight:400;margin:0;color:#f5e6d3;line-height:1.3;">Contratação confirmada.</h1>
    </div>
    <div style="padding:32px 40px;">
      <p style="font-size:16px;line-height:1.7;color:#d4b896;">Olá, ${name},</p>
      <p style="font-size:16px;line-height:1.7;color:#d4b896;">
        Seu pagamento foi confirmado e sua contratação do <strong style="color:#f5e6d3;">${productName}</strong> está registrada.
      </p>
      <p style="font-size:16px;line-height:1.7;color:#d4b896;">
        Em breve entrarei em contato para agendar nossa consultoria inicial e alinhar todos os detalhes do seu projeto de marca pessoal.
      </p>
      <div style="margin:32px 0;padding:24px;background:#2a1f17;border-left:3px solid #8b6f47;border-radius:4px;">
        <p style="margin:0;font-size:13px;color:#8b6f47;letter-spacing:2px;text-transform:uppercase;">Pedido #${orderId}</p>
        <p style="margin:8px 0 0;font-size:18px;color:#f5e6d3;">${productName}</p>
      </div>
      <p style="font-size:16px;line-height:1.7;color:#d4b896;">
        Se tiver qualquer dúvida, pode me chamar no WhatsApp ou responder este email.
      </p>
      <p style="font-size:16px;line-height:1.7;color:#d4b896;margin-top:32px;">
        Com carinho,<br>
        <strong style="color:#f5e6d3;">Camilla Vieira</strong>
      </p>
    </div>
    <div style="padding:24px 40px;border-top:1px solid #3d2b1f;text-align:center;">
      <p style="font-size:11px;color:#5a4a3a;letter-spacing:2px;text-transform:uppercase;margin:0;">camillavieira.art · Brasília, DF</p>
    </div>
  </div>
</body>
</html>`;
}
