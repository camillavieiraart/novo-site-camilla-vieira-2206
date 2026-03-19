import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { ShoppingBag, Check, ChevronDown, Loader2, X, ZoomIn } from "lucide-react";
import { GalleryImage } from "@/components/GalleryImage";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ArtworkVariant {
  id: number;
  artworkId: number;
  size: string;
  finish: "canvas" | "fine_art";
  priceInCents: number;
  isActive: boolean;
}

interface FineArtwork {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string;
  series: string | null;
  isAvailable: boolean | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatBRL(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

const SIZE_LABELS: Record<string, string> = {
  "30x45 cm": "Pequeno · 30×45 cm",
  "60x90 cm": "Médio · 60×90 cm",
  "90x120 cm": "Grande · 90×120 cm",
};

const FINISH_LABELS: Record<string, string> = {
  canvas: "Canvas",
  fine_art: "Fine Art com Moldura",
};

const FINISH_DESC: Record<string, string> = {
  canvas: "Impressão em tela tensionada sobre chassi de madeira. Sem necessidade de moldura.",
  fine_art: "Impressão em papel Fine Art 300g com moldura de madeira e vidro antirreflexo.",
};

// ─── Artwork Card ─────────────────────────────────────────────────────────────
function ArtworkCard({ artwork, index }: { artwork: FineArtwork; index: number }) {
  const [selectedSize, setSelectedSize] = useState<string>("60x90 cm");
  const [selectedFinish, setSelectedFinish] = useState<"canvas" | "fine_art">("fine_art");
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  const { data: variants = [] } = trpc.artworks.getVariants.useQuery(
    { artworkId: artwork.id },
    { staleTime: 1000 * 60 * 5 }
  );

  const createCheckout = trpc.artworks.createFineArtCheckout.useMutation();

  // Find selected variant
  const selectedVariant = variants.find(
    (v: ArtworkVariant) => v.size === selectedSize && v.finish === selectedFinish
  );

  // Available sizes
  const availableSizes = Array.from(new Set(variants.map((v: ArtworkVariant) => v.size)));
  const availableFinishes = Array.from(new Set(
    variants.filter((v: ArtworkVariant) => v.size === selectedSize).map((v: ArtworkVariant) => v.finish)
  ));

  const handleBuy = async () => {
    if (!selectedVariant) return;
    setLoadingCheckout(true);
    try {
      const result = await createCheckout.mutateAsync({
        artworkId: artwork.id,
        variantId: selectedVariant.id,
        origin: window.location.origin,
      });
      if (result?.url) window.location.href = result.url;
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setLoadingCheckout(false);
    }
  };

  return (
    <>
      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 text-white bg-transparent border-none cursor-pointer"
            onClick={() => setLightbox(false)}
            aria-label="Fechar"
          >
            <X size={28} />
          </button>
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div
        className="bg-white overflow-hidden transition-all duration-700"
        style={{
          border: "1px solid var(--brand-sand)",
          transitionDelay: `${index * 60}ms`,
        }}
      >
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden group cursor-pointer" onClick={() => setLightbox(true)}>
          <GalleryImage
            src={artwork.imageUrl}
            alt={artwork.title}
            loading={index < 4 ? "eager" : "lazy"}
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(5%)" }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          {/* Badge */}
          <div
            className="absolute top-3 left-3 px-2 py-1 text-xs tracking-widest uppercase"
            style={{ backgroundColor: "var(--brand-terracota)", color: "white", fontFamily: "'Inter', sans-serif" }}
          >
            Fine Art
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3
            className="font-serif text-base font-medium mb-1 leading-tight"
            style={{ color: "var(--brand-marrom-deep)" }}
          >
            {artwork.title}
          </h3>

          {/* Toggle description */}
          {artwork.description && (
            <div className="mb-3">
              <button
                className="flex items-center gap-1 text-xs tracking-wide"
                style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                onClick={() => setExpanded(!expanded)}
              >
                <ChevronDown size={12} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
                {expanded ? "Ocultar descrição" : "Ver descrição"}
              </button>
              {expanded && (
                <p
                  className="mt-2 text-xs leading-relaxed"
                  style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.85 }}
                >
                  {artwork.description}
                </p>
              )}
            </div>
          )}

          {/* Size selector */}
          <div className="mb-3">
            <p
              className="text-xs tracking-widest uppercase mb-2"
              style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.6 }}
            >
              Tamanho
            </p>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className="px-2 py-1 text-xs transition-all"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    border: selectedSize === size
                      ? "1px solid var(--brand-terracota)"
                      : "1px solid var(--brand-sand)",
                    backgroundColor: selectedSize === size
                      ? "var(--brand-terracota)"
                      : "transparent",
                    color: selectedSize === size ? "white" : "var(--brand-marrom)",
                    cursor: "pointer",
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Finish selector */}
          <div className="mb-4">
            <p
              className="text-xs tracking-widest uppercase mb-2"
              style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.6 }}
            >
              Acabamento
            </p>
            <div className="flex flex-col gap-2">
              {availableFinishes.map((finish) => {
                const v = variants.find(
                  (vv: ArtworkVariant) => vv.size === selectedSize && vv.finish === finish
                );
                return (
                  <button
                    key={finish}
                    onClick={() => setSelectedFinish(finish as "canvas" | "fine_art")}
                    className="flex items-start gap-2 p-2 text-left transition-all"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      border: selectedFinish === finish
                        ? "1px solid var(--brand-terracota)"
                        : "1px solid var(--brand-sand)",
                      backgroundColor: selectedFinish === finish
                        ? "rgba(201,112,100,0.05)"
                        : "transparent",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center"
                      style={{
                        border: selectedFinish === finish
                          ? "2px solid var(--brand-terracota)"
                          : "2px solid var(--brand-sand)",
                        backgroundColor: selectedFinish === finish ? "var(--brand-terracota)" : "transparent",
                      }}
                    >
                      {selectedFinish === finish && <Check size={8} color="white" />}
                    </div>
                    <div>
                      <p
                        className="text-xs font-medium"
                        style={{ color: "var(--brand-marrom-deep)" }}
                      >
                        {FINISH_LABELS[finish]}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "var(--brand-marrom)", opacity: 0.7 }}
                      >
                        {FINISH_DESC[finish]}
                      </p>
                      {v && (
                        <p
                          className="text-xs font-medium mt-1"
                          style={{ color: "var(--brand-terracota)" }}
                        >
                          {formatBRL(v.priceInCents)}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price + CTA */}
          {selectedVariant ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p
                    className="text-xs tracking-widest uppercase"
                    style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.6 }}
                  >
                    Total
                  </p>
                  <p
                    className="text-xl font-serif font-medium"
                    style={{ color: "var(--brand-marrom-deep)" }}
                  >
                    {formatBRL(selectedVariant.priceInCents)}
                  </p>
                </div>
                <p
                  className="text-xs text-right"
                  style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.6 }}
                >
                  Frete incluso<br />para todo Brasil
                </p>
              </div>
              <button
                onClick={handleBuy}
                disabled={loadingCheckout}
                className="flex items-center justify-center gap-2 w-full py-3 text-xs tracking-widest uppercase transition-all hover:opacity-80 disabled:opacity-50"
                style={{
                  backgroundColor: "var(--brand-marrom-deep)",
                  color: "var(--brand-bege-light)",
                  fontFamily: "'Inter', sans-serif",
                  border: "none",
                  cursor: loadingCheckout ? "not-allowed" : "pointer",
                }}
              >
                {loadingCheckout ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <ShoppingBag size={14} />
                )}
                {loadingCheckout ? "Aguarde..." : "Comprar Agora"}
              </button>
            </div>
          ) : (
            <div
              className="py-3 text-center text-xs tracking-widest uppercase"
              style={{ backgroundColor: "var(--brand-sand)", color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}
            >
              Selecione tamanho e acabamento
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Fine Art Shop Section ────────────────────────────────────────────────────
export function FineArtShop() {
  const { data: artworks = [], isLoading } = trpc.artworks.getFineArt.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin" style={{ color: "var(--brand-terracota)" }} />
      </div>
    );
  }

  if (!artworks || artworks.length === 0) return null;

  return (
    <section className="py-20" style={{ backgroundColor: "var(--brand-bege-light)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <span
            className="section-eyebrow block mb-3"
          >
            Coleção Fine Art
          </span>
          <h2
            className="font-serif text-4xl md:text-5xl font-medium mb-4"
            style={{ color: "var(--brand-marrom-deep)" }}
          >
            Impressões Fine Art
          </h2>
          <div className="divider-terracota mx-auto" />
          <p
            className="mt-6 text-sm leading-relaxed max-w-2xl mx-auto"
            style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}
          >
            Fotografias autorais de Camilla Vieira disponíveis em impressão Fine Art de alta qualidade.
            Cada obra acompanha certificado de autenticidade assinado pela artista.
            Escolha o tamanho e o acabamento ideal para o seu espaço.
          </p>
        </div>

        {/* Info strip */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 p-6"
          style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}
        >
          {[
            { label: "Papel Fine Art 300g", desc: "ou Canvas sobre chassi" },
            { label: "3 Tamanhos", desc: "30×45 · 60×90 · 90×120 cm" },
            { label: "Certificado de Autenticidade", desc: "Assinado pela artista" },
            { label: "Frete Incluso", desc: "Para todo o Brasil" },
          ].map(({ label, desc }) => (
            <div key={label} className="text-center">
              <p
                className="text-xs font-medium tracking-wide mb-1"
                style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}
              >
                {label}
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.7 }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artworks.map((artwork: FineArtwork, i: number) => (
            <ArtworkCard key={artwork.id} artwork={artwork} index={i} />
          ))}
        </div>

        {/* Footer note */}
        <div
          className="mt-12 p-6 text-center"
          style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}
        >
          <p
            className="text-xs leading-relaxed"
            style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}
          >
            Pagamento seguro via cartão de crédito, débito ou Pix.
            Impressão realizada por laboratório especializado em Fine Art.
            Prazo de entrega: 10 a 15 dias úteis após confirmação do pagamento.
            Dúvidas?{" "}
            <a
              href="https://wa.me/5511910868299?text=Ol%C3%A1%2C+Camilla!+Tenho+d%C3%BAvidas+sobre+as+impress%C3%B5es+Fine+Art."
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--brand-terracota)", textDecoration: "underline" }}
            >
              Fale pelo WhatsApp
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
