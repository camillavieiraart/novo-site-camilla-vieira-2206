import { useState, useEffect, useMemo } from "react";
import { useSEO } from "@/hooks/useSEO";
import { StructuredData, buildProduct, buildBreadcrumb, buildItemList } from "@/components/StructuredData";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BrushCorner } from "@/components/BrushStroke";
import { trpc } from "@/lib/trpc";
import { ShoppingBag, Package, Camera, Palette, BookOpen, Download, ArrowRight, Star, Search, X, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

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
  buyUrl?: string | null;
}

// ─── Category config ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all", label: "Tudo" },
  { id: "ensaio", label: "Ensaios", icon: Camera },
  { id: "obra_arte", label: "Obras de Arte", icon: Palette },
  { id: "ceramica", label: "Cerâmica", icon: Package },
  { id: "print", label: "Fotos Avulsas", icon: Download },
  { id: "mentoria", label: "Mentorias", icon: BookOpen },
];

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, visible, delay }: { product: Product; visible: boolean; delay: number }) {
  const hasDiscount = product.compareAtPriceInCents && product.compareAtPriceInCents > product.priceInCents;
  const isOutOfStock = product.stock !== null && product.stock <= 0;

  const handleBuy = (e: React.MouseEvent) => {
    if (product.buyUrl) {
      e.preventDefault();
      e.stopPropagation();
      window.open(product.buyUrl, "_blank");
    }
  };

  return (
    <div
      className={`group transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${delay}ms` }}>
      <div className="overflow-hidden transition-all hover:shadow-lg flex flex-col h-full"
        style={{ border: "1px solid var(--brand-sand)", backgroundColor: "var(--brand-bege)" }}>
        {/* Image */}
        <Link href={`/loja/${product.slug}`} className="block no-underline">
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
        </Link>

        {/* Info */}
        <div className="p-5 flex flex-col flex-1">
          <Link href={`/loja/${product.slug}`} className="no-underline flex-1">
            <h3 className="font-serif text-lg font-medium mb-2 leading-tight"
              style={{ color: "var(--brand-marrom-deep)" }}>
              {product.name}
            </h3>
            {product.shortDescription && (
              <p className="text-sm leading-relaxed mb-3 line-clamp-2"
                style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                {product.shortDescription}
              </p>
            )}
          </Link>

          {/* Price + Buy button */}
          <div className="mt-auto pt-3" style={{ borderTop: "1px solid var(--brand-sand)" }}>
            <div className="flex items-center justify-between gap-3">
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

              {/* Buy button */}
              {!isOutOfStock && (
                product.buyUrl ? (
                  <button
                    onClick={handleBuy}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium tracking-wide transition-opacity hover:opacity-80 border-none cursor-pointer"
                    style={{ backgroundColor: "var(--brand-terracota)", color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
                    Comprar <ExternalLink size={11} />
                  </button>
                ) : (
                  <Link href={`/loja/${product.slug}`}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium tracking-wide no-underline transition-opacity hover:opacity-80"
                    style={{ backgroundColor: "var(--brand-terracota)", color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
                    Comprar <ArrowRight size={11} />
                  </Link>
                )
              )}
              {isOutOfStock && (
                <span className="text-xs" style={{ color: "rgba(92,64,51,0.5)", fontFamily: "'Inter', sans-serif" }}>
                  Indisponível
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ hasSearch }: { hasSearch?: boolean }) {
  return (
    <div className="col-span-full text-center py-20">
      <div className="text-5xl mb-6">✦</div>
      <h3 className="font-serif text-2xl font-medium mb-3" style={{ color: "var(--brand-marrom-deep)" }}>
        {hasSearch ? "Nenhum resultado encontrado" : "Em breve"}
      </h3>
      <p className="text-sm max-w-sm mx-auto" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
        {hasSearch
          ? "Tente outra palavra-chave ou explore as categorias."
          : "Novos produtos chegando em breve. Assine a newsletter para ser a primeira a saber."}
      </p>
      {!hasSearch && (
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-newsletter'))}
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 text-sm font-medium cursor-pointer border-none"
          style={{ backgroundColor: "var(--brand-terracota)", color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
          Assinar newsletter <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}

// ─── Main Loja Page ───────────────────────────────────────────────────────────
export default function Loja() {
  useSEO({
    title: "Loja",
    description: "Adquira ensaios fotográficos, obras de arte originais, cerâmica artesanal, fotos avulsas e mentorias criativas de Camilla Vieira.",
    keywords: "loja Camilla Vieira, ensaios fotográficos, obras de arte, cerâmica, fotos avulsas, mentoria criativa",
    canonical: "/loja",
  });

  const [visible, setVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);

  const { data: allProducts, isLoading } = trpc.shop.listProducts.useQuery(undefined);

  // Filtro local por categoria + busca
  const products = useMemo(() => {
    if (!allProducts) return [];
    let result = allProducts;
    if (activeCategory !== "all") {
      result = result.filter(p => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.shortDescription || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [allProducts, activeCategory, searchQuery]);

  const featured = products.filter(p => p.isFeatured);
  const regular = products.filter(p => !p.isFeatured);
  const showFeatured = featured.length > 0 && activeCategory === "all" && !searchQuery;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--brand-bege-light)" }}>
      <Navigation />

      {/* Hero */}
      <section className="relative pt-24 pb-16 overflow-hidden" style={{ backgroundColor: "var(--brand-marrom-deep)" }}>
        <BrushCorner position="tl" color="#F5E6D3" delay={400} />
        <BrushCorner position="br" color="#F5E6D3" delay={700} />
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center relative z-10">
          <div className={`transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="section-eyebrow block mb-4" style={{ color: "rgba(201,112,100,0.9)" }}>Loja</span>
            <h1 className="font-serif text-5xl md:text-6xl font-medium mb-6" style={{ color: "var(--brand-bege)" }}>
              Arte para Levar
            </h1>
            <div className="mb-6 mx-auto" style={{ width: "48px", height: "1px", backgroundColor: "var(--brand-sand)" }} />
            <p className="text-base leading-relaxed max-w-xl mx-auto mb-8" style={{ color: "rgba(245,230,211,0.75)", fontFamily: "'Inter', sans-serif" }}>
              Ensaios, obras originais, cerâmica artesanal, fotos avulsas e mentorias — cada peça carrega uma intenção.
            </p>
            {/* Search bar */}
            <div className="relative max-w-md mx-auto">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "rgba(245,230,211,0.5)" }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar produto..."
                className="w-full pl-11 pr-10 py-3 text-sm bg-transparent outline-none"
                style={{
                  border: "1px solid rgba(245,230,211,0.25)",
                  color: "var(--brand-bege)",
                  fontFamily: "'Inter', sans-serif",
                  backgroundColor: "rgba(255,255,255,0.08)",
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer"
                  style={{ color: "rgba(245,230,211,0.5)" }}>
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <section className="sticky top-0 z-30 py-3 shadow-sm" style={{ backgroundColor: "var(--brand-bege)" }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className="px-4 py-2 text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 tracking-wide"
                style={{
                  backgroundColor: activeCategory === id ? "var(--brand-terracota)" : "transparent",
                  color: activeCategory === id ? "var(--brand-bege)" : "var(--brand-marrom)",
                  border: `1px solid ${activeCategory === id ? "var(--brand-terracota)" : "var(--brand-sand)"}`,
                  fontFamily: "'Inter', sans-serif",
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          {/* Results count */}
          {!isLoading && allProducts && (
            <p className="text-xs mb-8" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.6 }}>
              {products.length === 0
                ? "Nenhum produto encontrado"
                : `Exibindo ${products.length} produto${products.length !== 1 ? "s" : ""}${searchQuery ? ` para "${searchQuery}"` : ""}`}
            </p>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] mb-4" style={{ backgroundColor: "var(--brand-sand)" }} />
                  <div className="h-4 mb-2" style={{ backgroundColor: "var(--brand-sand)", width: "60%" }} />
                  <div className="h-6 mb-2" style={{ backgroundColor: "var(--brand-sand)", width: "80%" }} />
                  <div className="h-4" style={{ backgroundColor: "var(--brand-sand)", width: "40%" }} />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState hasSearch={!!searchQuery} />
          ) : (
            <>
              {/* Featured products */}
              {showFeatured && (
                <div className="mb-12">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="section-eyebrow">Em Destaque</span>
                    <div className="flex-1 h-px" style={{ backgroundColor: "var(--brand-sand)" }} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {featured.map((product, i) => (
                      <ProductCard key={product.id} product={product as Product} visible={visible} delay={i * 80} />
                    ))}
                  </div>
                </div>
              )}
              {/* All products */}
              {(showFeatured ? regular : products).length > 0 && (
                <div>
                  {showFeatured && (
                    <div className="flex items-center gap-4 mb-6">
                      <span className="section-eyebrow">Todos os Produtos</span>
                      <div className="flex-1 h-px" style={{ backgroundColor: "var(--brand-sand)" }} />
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {(showFeatured ? regular : products).map((product, i) => (
                      <ProductCard key={product.id} product={product as Product} visible={visible} delay={i * 60} />
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
          (allProducts || []).map(p => ({ name: p.name, url: `/loja/${p.slug}`, image: p.imageUrl ?? undefined }))
        ),
        ...(allProducts || []).map(p => buildProduct(p)),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ], [JSON.stringify(allProducts)])} />
      <Footer />
    </div>
  );
}
