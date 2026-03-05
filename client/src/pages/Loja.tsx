import { useState, useEffect, useMemo } from "react";
import { useSEO } from "@/hooks/useSEO";
import { StructuredData, buildProduct, buildBreadcrumb, buildItemList } from "@/components/StructuredData";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BrushCorner } from "@/components/BrushStroke";
import { trpc } from "@/lib/trpc";
import { ShoppingBag, Package, Camera, Palette, BookOpen, Download, ArrowRight, Star } from "lucide-react";
import { Link } from "wouter";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  shortDescription: string | null;
  category: string;
  priceInCents: number;
  compareAtPriceInCents: number | null;
  imageUrl: string | null;
  deliveryType: string;
  stock: number | null;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
}

// ─── Category config ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all", label: "Tudo", icon: ShoppingBag },
  { id: "ensaio", label: "Ensaios", icon: Camera },
  { id: "obra_arte", label: "Obras de Arte", icon: Palette },
  { id: "ceramica", label: "Cerâmica", icon: Package },
  { id: "print", label: "Prints", icon: Download },
  { id: "mentoria", label: "Mentorias", icon: BookOpen },
];

const DELIVERY_LABELS: Record<string, { label: string; icon: string }> = {
  agendamento: { label: "Agendamento", icon: "📅" },
  envio_fisico: { label: "Envio pelos Correios", icon: "📦" },
  download: { label: "Download digital", icon: "⬇️" },
  acesso_online: { label: "Acesso online", icon: "💻" },
};

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, visible, delay }: { product: Product; visible: boolean; delay: number }) {
  const delivery = DELIVERY_LABELS[product.deliveryType] || { label: product.deliveryType, icon: "📦" };
  const hasDiscount = product.compareAtPriceInCents && product.compareAtPriceInCents > product.priceInCents;
  const isOutOfStock = product.stock !== null && product.stock <= 0;

  return (
    <Link href={`/loja/${product.slug}`}
      className={`group block no-underline transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${delay}ms` }}>
      <div className="overflow-hidden transition-all hover:shadow-lg"
        style={{ border: "1px solid var(--brand-sand)" }}>
        {/* Image */}
        <div className="relative overflow-hidden aspect-[4/3]"
          style={{ backgroundColor: "var(--brand-bege)" }}>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag size={40} style={{ color: "var(--brand-sand)" }} />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.isFeatured && (
              <span className="text-xs px-2 py-1 flex items-center gap-1"
                style={{ backgroundColor: "var(--brand-terracota)", color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
                <Star size={10} fill="currentColor" /> Destaque
              </span>
            )}
            {isOutOfStock && (
              <span className="text-xs px-2 py-1"
                style={{ backgroundColor: "rgba(0,0,0,0.7)", color: "white", fontFamily: "'Inter', sans-serif" }}>
                Esgotado
              </span>
            )}
            {hasDiscount && !isOutOfStock && (
              <span className="text-xs px-2 py-1"
                style={{ backgroundColor: "#059669", color: "white", fontFamily: "'Inter', sans-serif" }}>
                Promoção
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-5" style={{ backgroundColor: "var(--brand-bege)" }}>
          <p className="text-xs tracking-widest uppercase mb-2"
            style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>
            {delivery.icon} {delivery.label}
          </p>
          <h3 className="font-serif text-lg font-medium mb-2 leading-tight"
            style={{ color: "var(--brand-marrom-deep)" }}>
            {product.name}
          </h3>
          {product.shortDescription && (
            <p className="text-sm leading-relaxed mb-4 line-clamp-2"
              style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
              {product.shortDescription}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              {hasDiscount && (
                <p className="text-xs line-through mb-0.5"
                  style={{ color: "rgba(92,64,51,0.4)", fontFamily: "'Inter', sans-serif" }}>
                  {formatPrice(product.compareAtPriceInCents!)}
                </p>
              )}
              <p className="font-serif text-xl font-medium"
                style={{ color: isOutOfStock ? "rgba(92,64,51,0.4)" : "var(--brand-marrom-deep)" }}>
                {formatPrice(product.priceInCents)}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-medium transition-all group-hover:gap-2"
              style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>
              {isOutOfStock ? "Indisponível" : "Ver mais"}
              <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="col-span-full text-center py-20">
      <div className="text-5xl mb-6">✦</div>
      <h3 className="font-serif text-2xl font-medium mb-3" style={{ color: "var(--brand-marrom-deep)" }}>
        Em breve
      </h3>
      <p className="text-sm max-w-sm mx-auto" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
        Novos produtos chegando em breve. Assine a newsletter para ser a primeira a saber.
      </p>
      <Link href="/#newsletter"
        className="inline-flex items-center gap-2 mt-6 px-6 py-3 text-sm font-medium no-underline"
        style={{ backgroundColor: "var(--brand-terracota)", color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
        Assinar newsletter <ArrowRight size={14} />
      </Link>
    </div>
  );
}

// ─── Main Loja Page ───────────────────────────────────────────────────────────
export default function Loja() {
  useSEO({
    title: "Loja",
    description: "Adquira ensaios fotográficos, obras de arte originais, cerâmica artesanal, prints e mentorias criativas de Camilla Vieira.",
    keywords: "loja Camilla Vieira, ensaios fotográficos, obras de arte, cerâmica, prints, mentoria criativa",
    canonical: "/loja",
  });

  const [visible, setVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);

  const { data: products, isLoading } = trpc.shop.listProducts.useQuery(
    activeCategory !== "all" ? { category: activeCategory as any } : undefined
  );

  const featured = products?.filter(p => p.isFeatured) || [];
  const regular = products?.filter(p => !p.isFeatured) || [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--brand-bege-light)" }}>
      <Navigation />

      {/* Hero */}
      <section className="relative pt-24 pb-20 overflow-hidden" style={{ backgroundColor: "var(--brand-marrom-deep)" }}>
        <BrushCorner position="tl" color="#F5E6D3" delay={400} />
        <BrushCorner position="br" color="#F5E6D3" delay={700} />
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center relative z-10">
          <div className={`transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="section-eyebrow block mb-4" style={{ color: "rgba(201,112,100,0.9)" }}>Loja</span>
            <h1 className="font-serif text-5xl md:text-6xl font-medium mb-6" style={{ color: "var(--brand-bege)" }}>
              Arte para Levar
            </h1>
            <div className="mb-6 mx-auto" style={{ width: "48px", height: "1px", backgroundColor: "var(--brand-sand)" }} />
            <p className="text-base leading-relaxed max-w-xl mx-auto" style={{ color: "rgba(245,230,211,0.75)", fontFamily: "'Inter', sans-serif" }}>
              Ensaios, obras originais, cerâmica artesanal, prints e mentorias — cada peça carrega uma intenção.
            </p>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <section className="sticky top-0 z-30 py-4 shadow-sm" style={{ backgroundColor: "var(--brand-bege)" }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition-all flex-shrink-0"
                style={{
                  backgroundColor: activeCategory === id ? "var(--brand-terracota)" : "transparent",
                  color: activeCategory === id ? "var(--brand-bege)" : "var(--brand-marrom)",
                  border: `1px solid ${activeCategory === id ? "var(--brand-terracota)" : "var(--brand-sand)"}`,
                  fontFamily: "'Inter', sans-serif",
                }}>
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] mb-4" style={{ backgroundColor: "var(--brand-sand)" }} />
                  <div className="h-4 mb-2" style={{ backgroundColor: "var(--brand-sand)", width: "60%" }} />
                  <div className="h-6 mb-2" style={{ backgroundColor: "var(--brand-sand)", width: "80%" }} />
                  <div className="h-4" style={{ backgroundColor: "var(--brand-sand)", width: "40%" }} />
                </div>
              ))}
            </div>
          ) : !products || products.length === 0 ? (
            <div className="grid grid-cols-1">
              <EmptyState />
            </div>
          ) : (
            <>
              {/* Featured products */}
              {featured.length > 0 && activeCategory === "all" && (
                <div className="mb-12">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="section-eyebrow">Em Destaque</span>
                    <div className="flex-1 h-px" style={{ backgroundColor: "var(--brand-sand)" }} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featured.map((product, i) => (
                      <ProductCard key={product.id} product={product} visible={visible} delay={i * 100} />
                    ))}
                  </div>
                </div>
              )}

              {/* Regular products */}
              {regular.length > 0 && (
                <div>
                  {featured.length > 0 && activeCategory === "all" && (
                    <div className="flex items-center gap-4 mb-6">
                      <span className="section-eyebrow">Todos os Produtos</span>
                      <div className="flex-1 h-px" style={{ backgroundColor: "var(--brand-sand)" }} />
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(activeCategory === "all" ? regular : products).map((product, i) => (
                      <ProductCard key={product.id} product={product} visible={visible} delay={i * 100} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA — custom order */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: "var(--brand-bege)" }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center">
          <div className={`transition-all duration-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <span className="section-eyebrow block mb-4">Encomendas</span>
            <h2 className="font-serif text-4xl font-medium mb-6" style={{ color: "var(--brand-marrom-deep)" }}>
              Não encontrou o que procura?
            </h2>
            <p className="text-sm leading-relaxed mb-8 max-w-md mx-auto"
              style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
              Trabalho com encomendas personalizadas — obras, cerâmicas e ensaios sob medida para o que você imagina.
            </p>
            <Link href="/contato"
              className="inline-flex items-center gap-2 px-8 py-4 text-sm font-medium no-underline"
              style={{ backgroundColor: "var(--brand-marrom-deep)", color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
              Falar com Camilla <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <StructuredData schemas={useMemo(() => [
        buildBreadcrumb([{ name: "Loja", url: "/loja" }]),
        buildItemList(
          "Loja — Camilla Vieira",
          "/loja",
          (products || []).map(p => ({ name: p.name, url: `/loja/${p.slug}`, image: p.imageUrl ?? undefined }))
        ),
        ...(products || []).map(p => buildProduct(p)),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ], [JSON.stringify(products)])} />
      <Footer />
    </div>
  );
}
