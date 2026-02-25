import { useEffect, useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BrushCorner } from "@/components/BrushStroke";
import { trpc } from "@/lib/trpc";

const CERAMICS_FALLBACK = [
  { id: 1, title: "Vaso Orgânico I", technique: "Argila modelada à mão", dimensions: "15 × 20 cm", imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80&auto=format&fit=crop", priceDisplay: "R$ 380", isAvailable: true },
  { id: 2, title: "Tigela Rústica", technique: "Torno + esmalte natural", dimensions: "12 × 8 cm", imageUrl: "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=600&q=80&auto=format&fit=crop", priceDisplay: "R$ 220", isAvailable: true },
  { id: 3, title: "Escultura Corpo", technique: "Argila esculpida", dimensions: "25 × 10 cm", imageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80&auto=format&fit=crop", priceDisplay: "R$ 650", isAvailable: false },
  { id: 4, title: "Prato Artístico", technique: "Torno + pintura manual", dimensions: "28 cm diâmetro", imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80&auto=format&fit=crop", priceDisplay: "R$ 290", isAvailable: true },
];

export default function Ceramica() {
  const [visible, setVisible] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const { data: ceramicsData } = trpc.ceramics.getAll.useQuery();
  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);

  const ceramics = (ceramicsData && ceramicsData.length > 0) ? ceramicsData : CERAMICS_FALLBACK;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--brand-bege-light)" }}>
      <Navigation />
      {lightboxSrc && (
        <div className="lightbox-backdrop" onClick={() => setLightboxSrc(null)}>
          <button className="absolute top-6 right-6 text-white bg-transparent border-none cursor-pointer z-10" onClick={() => setLightboxSrc(null)}>
            <X size={28} />
          </button>
          <img src={lightboxSrc} alt="" className="lightbox-img" onClick={e => e.stopPropagation()} />
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ceramics.map((item, i) => (
              <div key={item.id}
                className={`artwork-card transition-all duration-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${100 + i * 80}ms` }}>
                <div className="img-hover aspect-square cursor-pointer" style={{ border: "1px solid var(--brand-sand)" }}
                  onClick={() => setLightboxSrc(item.imageUrl)}>
                  <img src={item.imageUrl} alt={item.title} />
                  <div className="img-hover-overlay" />
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-base font-medium mb-1" style={{ color: "var(--brand-marrom-deep)" }}>{item.title}</h3>
                  <p className="text-xs mb-3" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                    {item.technique} · {item.dimensions}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>{item.priceDisplay}</span>
                    {item.isAvailable && (
                      <a href={`https://wa.me/5511999999999?text=Interesse%20em%20${encodeURIComponent(item.title)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs no-underline transition-opacity hover:opacity-100 opacity-70"
                        style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                        <MessageCircle size={12} /> Interesse
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
