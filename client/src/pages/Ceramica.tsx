import { useEffect, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import AdminFloatingButton from "@/components/AdminFloatingButton";
import { StructuredData, buildBreadcrumb, buildArtwork, BASE_URL } from "@/components/StructuredData";
import { X, MessageCircle } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GalleryImage } from "@/components/GalleryImage";
import { trpc } from "@/lib/trpc";

const CERAMICS_FALLBACK = [
  { id: 1, title: "Vaso Orgânico I", technique: "Argila modelada à mão", dimensions: "15 × 20 cm", description: "Vaso orgânico modelado à mão com argila natural, formas irregulares que celebram a imperfeição.", imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80&auto=format&fit=crop", priceDisplay: "R$ 380", isAvailable: true },
  { id: 2, title: "Tigela Rústica", technique: "Torno + esmalte natural", dimensions: "12 × 8 cm", description: "Tigela produzida no torno com esmalte natural, acabamento rústico e funcional.", imageUrl: "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=600&q=80&auto=format&fit=crop", priceDisplay: "R$ 220", isAvailable: true },
  { id: 3, title: "Escultura Corpo", technique: "Argila esculpida", dimensions: "25 × 10 cm", description: "Escultura figurativa que celebra o corpo feminino, modelada à mão em argila.", imageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80&auto=format&fit=crop", priceDisplay: "R$ 650", isAvailable: false },
  { id: 4, title: "Prato Artístico", technique: "Torno + pintura manual", dimensions: "28 cm diâmetro", description: "Prato produzido no torno com pintura manual, peça única de uso decorativo.", imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80&auto=format&fit=crop", priceDisplay: "R$ 290", isAvailable: true },
];

export default function Ceramica() {
  const [visible, setVisible] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<{ src: string; alt: string; caption?: string } | null>(null);
  const { data: ceramicsData } = trpc.ceramics.getAll.useQuery();
  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);

  const ceramics = (ceramicsData && ceramicsData.length > 0) ? ceramicsData : CERAMICS_FALLBACK;

  useSEO({
    title: "Cerâmica Artística",
    description: "Cerâmica artística de Camilla Vieira: peças únicas modeladas à mão em argila. Arte funcional e decorativa que habita o espaço com presença e intenção.",
    descriptionEn: "Artistic ceramics by Camilla Vieira: unique handmade clay pieces. Functional and decorative art that inhabits space with presence and intention.",
    descriptionFr: "Céramique artistique de Camilla Vieira: pièces uniques façonnées à la main en argile. Art fonctionnel et décoratif qui habite l'espace avec présence et intention.",
    keywords: "cerâmica artística, peças de cerâmica, argila, arte funcional, Camilla Vieira, handmade ceramics, artistic ceramics Brazil, céramique artistique",
    canonical: "/ceramica",
    enableHreflang: true,
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--brand-bege-light)" }}>
      <Navigation />

      {/* Lightbox acessível */}
      {lightboxItem && (
        <div
          className="lightbox-backdrop"
          onClick={() => setLightboxItem(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.alt}>
          <button
            className="absolute top-6 right-6 text-white bg-transparent border-none cursor-pointer z-10"
            onClick={() => setLightboxItem(null)}
            aria-label="Fechar">
            <X size={28} />
          </button>
          <figure className="flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <img src={lightboxItem.src} alt={lightboxItem.alt} className="lightbox-img" />
            {lightboxItem.caption && (
              <figcaption className="mt-3 text-center text-xs tracking-widest uppercase max-w-md" style={{ color: "rgba(250,247,242,0.7)", fontFamily: "'Inter', sans-serif" }}>
                {lightboxItem.caption}
              </figcaption>
            )}
          </figure>
        </div>
      )}

      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className={`mb-16 transition-all duration-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <span className="section-eyebrow block mb-3">Cerâmica</span>
            <h1 className="font-serif text-5xl md:text-6xl font-medium mb-4" style={{ color: "var(--brand-marrom-deep)" }}>
              Arte em Argila
            </h1>
            <div className="divider-terracota" />
            <p className="mt-6 text-sm leading-relaxed max-w-2xl" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
              A cerâmica como extensão da fotografia — ambas moldadas pelas mãos, ambas carregadas de intenção. Peças únicas que habitam o espaço com presença.
            </p>
          </div>

          {/* Gallery grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ceramics.map((item, i) => {
              const altText = `${item.title} — ${item.technique}${(item as any).dimensions ? `, ${(item as any).dimensions}` : ""}. Cerâmica artística por Camilla Vieira.`;
              const caption = `${item.title} · ${item.technique}${(item as any).dimensions ? ` · ${(item as any).dimensions}` : ""}`;
              return (
                <article key={item.id}
                  className={`artwork-card transition-all duration-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: `${100 + i * 80}ms` }}>
                  <figure
                    className="img-hover aspect-square cursor-pointer"
                    style={{ border: "1px solid var(--brand-sand)", margin: 0 }}
                    onClick={() => setLightboxItem({ src: item.imageUrl, alt: altText, caption })}>
                    <GalleryImage
                      src={item.imageUrl}
                      alt={altText}
                      title={`${item.title} — Camilla Vieira`}
                      loading={i < 4 ? "eager" : "lazy"}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div className="img-hover-overlay" />
                    <figcaption className="sr-only">
                      {item.title}. {item.technique}. {(item as any).dimensions}. {(item as any).description || ""}
                    </figcaption>
                  </figure>
                  <div className="p-4">
                    <h2 className="font-serif text-base font-medium mb-1" style={{ color: "var(--brand-marrom-deep)" }}>{item.title}</h2>
                    <p className="text-xs mb-1" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                      {item.technique}{(item as any).dimensions ? ` · ${(item as any).dimensions}` : ""}
                    </p>
                    {(item as any).description && (
                      <p className="text-xs mb-3 leading-relaxed" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.75 }}>
                        {(item as any).description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-medium" style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>{item.priceDisplay}</span>
                      {item.isAvailable ? (
                        <a href={`https://wa.me/5511910868299?text=Ol%C3%A1%2C+Camilla!+Tenho+interesse+na+pe%C3%A7a+de+cer%C3%A2mica+${encodeURIComponent(item.title)}.+Poderia+me+dar+mais+informa%C3%A7%C3%B5es%3F`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs no-underline transition-opacity hover:opacity-100 opacity-70"
                          style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                          <MessageCircle size={12} /> Interesse
                        </a>
                      ) : (
                        <span className="text-xs opacity-50" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>Vendida</span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <StructuredData schemas={[
        buildBreadcrumb([{ name: "Cerâmica", url: "/ceramica" }]),
        {
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          "@id": `${BASE_URL}/ceramica#gallery`,
          name: "Cerâmica Artística — Camilla Vieira",
          description: "Galeria de peças de cerâmica artística criadas por Camilla Vieira. Peças únicas modeladas à mão em argila.",
          url: `${BASE_URL}/ceramica`,
          creator: { "@id": `${BASE_URL}/#person` },
          inLanguage: ["pt-BR", "en", "fr"],
          image: ceramics.map(c => ({
            "@type": "ImageObject",
            url: c.imageUrl,
            contentUrl: c.imageUrl,
            name: `${c.title} — Cerâmica por Camilla Vieira`,
            description: `${c.title}. ${c.technique}. ${(c as any).dimensions || ""}. Peça de cerâmica artística por Camilla Vieira.`,
            author: { "@id": `${BASE_URL}/#person` },
            copyrightHolder: { "@id": `${BASE_URL}/#person` },
          })),
        },
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Cerâmica Artística — Camilla Vieira",
          description: "Peças de cerâmica artística criadas por Camilla Vieira. Cada peça é única, modelada à mão com argila e queimada em forno.",
          url: `${BASE_URL}/ceramica`,
          provider: { "@id": `${BASE_URL}/#person` },
          areaServed: [
            { "@type": "Country", name: "Brasil" },
            { "@type": "Country", name: "France" },
            { "@type": "Country", name: "United States" },
          ],
        },
        ...ceramics.map(c => buildArtwork({
          name: c.title,
          imageUrl: c.imageUrl,
          artMedium: c.technique,
        })),
      ]} />
      <AdminFloatingButton href="/admin/ceramica" label="Gerenciar Cerâmica" />
      <Footer />
    </div>
  );
}
