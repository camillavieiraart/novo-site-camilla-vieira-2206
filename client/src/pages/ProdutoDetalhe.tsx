import { useState, useEffect, useMemo } from "react";
import { useRoute, Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { StructuredData, buildProduct, buildBreadcrumb } from "@/components/StructuredData";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { ArrowLeft, ShoppingBag, Package, Camera, Palette, BookOpen, Download, Check, Star, ArrowRight } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

const DELIVERY_INFO: Record<string, { label: string; icon: string; description: string }> = {
  agendamento: {
    label: "Agendamento",
    icon: "📅",
    description: "Após a compra, você receberá um link para agendar sua sessão diretamente com Camilla.",
  },
  envio_fisico: {
    label: "Envio pelos Correios",
    icon: "📦",
    description: "A peça será embalada com cuidado e enviada pelos Correios. Prazo de 7 a 14 dias úteis.",
  },
  download: {
    label: "Download digital",
    icon: "⬇️",
    description: "Você receberá um link para download imediatamente após a confirmação do pagamento.",
  },
  acesso_online: {
    label: "Acesso online",
    icon: "💻",
    description: "Você terá acesso imediato ao conteúdo online após a confirmação do pagamento.",
  },
};

// ─── Checkout Modal ───────────────────────────────────────────────────────────
function CheckoutModal({
  product,
  onClose,
}: {
  product: { id: number; name: string; priceInCents: number; deliveryType: string };
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const createSession = trpc.shop.createCheckoutSession.useMutation({
    onSuccess: async ({ sessionUrl }) => {
      if (sessionUrl) {
        window.location.href = sessionUrl;
      }
    },
    onError: (e) => {
      toast.error(e.message || "Erro ao iniciar checkout");
      setLoading(false);
    },
  });

  const handleCheckout = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Por favor, insira um e-mail válido");
      return;
    }
    setLoading(true);
    const origin = window.location.origin;
    createSession.mutate({
      productId: product.id,
      customerEmail: email,
      successUrl: `${origin}/loja/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/loja`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
      <div className="w-full max-w-md shadow-2xl" style={{ backgroundColor: "var(--brand-bege-light)" }}>
        {/* Header */}
        <div className="px-6 py-5" style={{ backgroundColor: "var(--brand-marrom-deep)" }}>
          <h2 className="font-serif text-xl font-medium" style={{ color: "var(--brand-bege)" }}>
            Finalizar Compra
          </h2>
          <p className="text-sm mt-1" style={{ color: "rgba(245,230,211,0.6)", fontFamily: "'Inter', sans-serif" }}>
            {product.name}
          </p>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Price summary */}
          <div className="p-4 flex items-center justify-between"
            style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
            <span className="text-sm" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
              Total
            </span>
            <span className="font-serif text-2xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>
              {formatPrice(product.priceInCents)}
            </span>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs tracking-widest uppercase mb-2"
              style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
              Seu e-mail *
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 text-sm border outline-none"
              style={{
                borderColor: "var(--brand-sand)",
                backgroundColor: "var(--brand-bege)",
                color: "var(--brand-marrom-deep)",
                fontFamily: "'Inter', sans-serif",
              }}
            />
            <p className="text-xs mt-1" style={{ color: "rgba(92,64,51,0.5)", fontFamily: "'Inter', sans-serif" }}>
              Você receberá a confirmação e instruções neste e-mail.
            </p>
          </div>

          {/* Delivery info */}
          {DELIVERY_INFO[product.deliveryType] && (
            <div className="p-4" style={{ backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE" }}>
              <p className="text-xs font-medium mb-1" style={{ color: "#1D4ED8", fontFamily: "'Inter', sans-serif" }}>
                {DELIVERY_INFO[product.deliveryType].icon} {DELIVERY_INFO[product.deliveryType].label}
              </p>
              <p className="text-xs" style={{ color: "#1E40AF", fontFamily: "'Inter', sans-serif" }}>
                {DELIVERY_INFO[product.deliveryType].description}
              </p>
            </div>
          )}

          {/* Stripe note */}
          <p className="text-xs text-center" style={{ color: "rgba(92,64,51,0.4)", fontFamily: "'Inter', sans-serif" }}>
            🔒 Pagamento seguro via Stripe. Seus dados são protegidos.
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCheckout}
              disabled={loading || createSession.isPending}
              className="flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2"
              style={{
                backgroundColor: loading ? "rgba(201,125,96,0.5)" : "var(--brand-terracota)",
                color: "var(--brand-bege)",
                fontFamily: "'Inter', sans-serif",
              }}>
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--brand-bege)" }} />
                  Redirecionando...
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  Ir para pagamento
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 text-sm border"
              style={{ borderColor: "var(--brand-sand)", color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Product Detail Page ─────────────────────────────────────────────────
export default function ProdutoDetalhe() {
  const [, params] = useRoute("/loja/:slug");
  const slug = params?.slug || "";

  const [visible, setVisible] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading } = trpc.shop.getProduct.useQuery({ slug }, { enabled: !!slug });

  useSEO({
    title: product?.name || "Produto",
    description: product?.shortDescription || product?.description || "Produto de Camilla Vieira",
    keywords: `${product?.name}, Camilla Vieira, ${product?.category}`,
    canonical: `/loja/${slug}`,
  });

  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--brand-bege-light)" }}>
        <Navigation />
        <div className="flex items-center justify-center py-40">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: "var(--brand-terracota)" }} />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--brand-bege-light)" }}>
        <Navigation />
        <div className="flex flex-col items-center justify-center py-40 text-center px-6">
          <div className="text-5xl mb-6">✦</div>
          <h1 className="font-serif text-3xl font-medium mb-4" style={{ color: "var(--brand-marrom-deep)" }}>
            Produto não encontrado
          </h1>
          <Link href="/loja"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium no-underline mt-4"
            style={{ backgroundColor: "var(--brand-terracota)", color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
            <ArrowLeft size={14} /> Voltar à loja
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = (() => {
    const imgs: string[] = [];
    if (product.imageUrl) imgs.push(product.imageUrl);
    try {
      const extra = JSON.parse(product.images || "[]");
      if (Array.isArray(extra)) imgs.push(...extra);
    } catch {}
    return imgs;
  })();

  const isOutOfStock = product.stock !== null && product.stock <= 0;
  const hasDiscount = product.compareAtPriceInCents && product.compareAtPriceInCents > product.priceInCents;
  const delivery = DELIVERY_INFO[product.deliveryType] || { label: product.deliveryType, icon: "📦", description: "" };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--brand-bege-light)" }}>
      <Navigation />

      <div className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-xs" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
            <Link href="/loja" className="no-underline hover:underline" style={{ color: "var(--brand-terracota)" }}>Loja</Link>
            <span>/</span>
            <span>{product.name}</span>
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 transition-all duration-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {/* Images */}
            <div>
              {/* Main image */}
              <div className="aspect-square overflow-hidden mb-3"
                style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
                {images[selectedImage] ? (
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag size={60} style={{ color: "var(--brand-sand)" }} />
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className="flex-shrink-0 w-16 h-16 overflow-hidden transition-all"
                      style={{
                        border: `2px solid ${selectedImage === i ? "var(--brand-terracota)" : "var(--brand-sand)"}`,
                      }}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="flex flex-col">
              {/* Category + featured */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs tracking-widest uppercase"
                  style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>
                  {delivery.icon} {delivery.label}
                </span>
                {product.isFeatured && (
                  <span className="flex items-center gap-1 text-xs px-2 py-0.5"
                    style={{ backgroundColor: "var(--brand-terracota)", color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
                    <Star size={10} fill="currentColor" /> Destaque
                  </span>
                )}
              </div>

              {/* Name */}
              <h1 className="font-serif text-4xl md:text-5xl font-medium mb-4 leading-tight"
                style={{ color: "var(--brand-marrom-deep)" }}>
                {product.name}
              </h1>

              <div className="mb-6" style={{ width: "48px", height: "1px", backgroundColor: "var(--brand-sand)" }} />

              {/* Description */}
              {product.description && (
                <p className="text-sm leading-relaxed mb-6"
                  style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                  {product.description}
                </p>
              )}

              {/* Price */}
              <div className="mb-8">
                {hasDiscount && (
                  <p className="text-sm line-through mb-1"
                    style={{ color: "rgba(92,64,51,0.4)", fontFamily: "'Inter', sans-serif" }}>
                    {formatPrice(product.compareAtPriceInCents!)}
                  </p>
                )}
                <p className="font-serif text-4xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>
                  {formatPrice(product.priceInCents)}
                </p>
              </div>

              {/* Delivery info */}
              <div className="p-4 mb-6" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
                <p className="text-xs font-medium mb-1"
                  style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>
                  {delivery.icon} {delivery.label}
                </p>
                <p className="text-xs" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                  {delivery.description}
                </p>
              </div>

              {/* CTA */}
              {isOutOfStock ? (
                <div className="flex flex-col gap-3">
                  <button disabled
                    className="w-full py-4 text-sm font-medium"
                    style={{ backgroundColor: "rgba(92,64,51,0.2)", color: "rgba(92,64,51,0.4)", fontFamily: "'Inter', sans-serif" }}>
                    Produto Esgotado
                  </button>
                  <Link href="/contato"
                    className="w-full py-4 text-sm font-medium text-center no-underline border flex items-center justify-center gap-2"
                    style={{ borderColor: "var(--brand-sand)", color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                    Avisar quando disponível <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full py-4 text-sm font-medium flex items-center justify-center gap-2 transition-all hover:opacity-90"
                  style={{ backgroundColor: "var(--brand-terracota)", color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
                  <ShoppingBag size={18} />
                  Comprar agora
                </button>
              )}

              {/* Trust signals */}
              <div className="flex flex-col gap-2 mt-6 pt-6" style={{ borderTop: "1px solid var(--brand-sand)" }}>
                {[
                  "🔒 Pagamento seguro via Stripe",
                  "📧 Confirmação imediata por e-mail",
                  "💬 Suporte via WhatsApp",
                ].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <Check size={12} style={{ color: "#059669" }} />
                    <span className="text-xs" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout modal */}
      {showCheckout && (
        <CheckoutModal
          product={product}
          onClose={() => setShowCheckout(false)}
        />
      )}

      {product && <StructuredData schemas={useMemo(() => [
        buildBreadcrumb([{ name: "Loja", url: "/loja" }, { name: product.name, url: `/loja/${product.slug}` }]),
        buildProduct(product),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ], [product.id])} />}
      <Footer />
    </div>
  );
}
