import { useEffect, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { StructuredData, buildBreadcrumb, buildItemList, SERIE_FIO_SCHEMA, BASE_URL } from "@/components/StructuredData";
import { Link, useParams } from "wouter";
import { ArrowLeft, X } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BrushCorner } from "@/components/BrushStroke";

const SERIES = [
  {
    slug: "serie-fio",
    name: "Série Fio",
    description: "Costura sobre fotografia. Intervenção artística onde o fio atravessa a imagem criando novas camadas de significado.",
    coverUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop",
    ],
  },
  {
    slug: "maternidade",
    name: "Maternidade",
    description: "A maternidade como experiência artística — retratos que capturam a transformação profunda do tornar-se mãe.",
    coverUrl: "https://images.unsplash.com/photo-1509460913899-515f1df34fea?w=800&q=80&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1509460913899-515f1df34fea?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80&auto=format&fit=crop",
    ],
  },
];

const ALL_IMAGES = [
  "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509460913899-515f1df34fea?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&q=80&auto=format&fit=crop",
];

function FotografiaOverview() {
  const [visible, setVisible] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);

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
            <span className="section-eyebrow block mb-3">Fotografia Autoral</span>
            <h1 className="font-serif text-5xl md:text-6xl font-medium mb-4" style={{ color: "var(--brand-marrom-deep)" }}>
              Imagens que <em>Sentem</em>
            </h1>
            <div className="divider-terracota" />
            <p className="mt-6 text-sm leading-relaxed max-w-2xl" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
              Além dos ensaios, Camilla desenvolve séries fotográficas autorais — trabalhos artísticos que exploram temas como identidade, corpo, memória e tempo.
            </p>
          </div>

          {/* Series */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
            {SERIES.map((s, i) => (
              <Link key={s.slug} href={`/fotografia/${s.slug}`}
                className={`group block no-underline transition-all duration-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${200 + i * 150}ms` }}>
                <div className="img-hover aspect-[4/3] mb-5" style={{ border: "1px solid var(--brand-sand)" }}>
                  <img src={s.coverUrl} alt={s.name} style={{ filter: "grayscale(20%)" }} />
                  <div className="img-hover-overlay" />
                </div>
                <h2 className="font-serif text-2xl font-medium mb-2" style={{ color: "var(--brand-marrom-deep)" }}>{s.name}</h2>
                <p className="text-xs leading-relaxed" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{s.description}</p>
              </Link>
            ))}
          </div>

          {/* All images masonry */}
          <div className={`transition-all duration-800 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <h2 className="font-serif text-3xl font-medium mb-8" style={{ color: "var(--brand-marrom-deep)" }}>Galeria Autoral</h2>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {ALL_IMAGES.map((src, i) => (
                <div key={i} className="break-inside-avoid cursor-pointer" onClick={() => setLightboxSrc(src)}>
                  <div className="img-hover overflow-hidden" style={{ border: "1px solid var(--brand-sand)" }}>
                    <img src={src} alt="" className="w-full" style={{ filter: "grayscale(15%)" }} />
                    <div className="img-hover-overlay" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <StructuredData schemas={[
        buildBreadcrumb([{ name: "Fotografia Autoral", url: "/fotografia" }]),
        SERIE_FIO_SCHEMA,
        buildItemList(
          "Séries Fotográficas Autorais — Camilla Vieira",
          "/fotografia",
          SERIES.map(s => ({ name: s.name, url: `/fotografia/${s.slug}`, image: s.coverUrl }))
        ),
      ]} />
      <Footer />
    </div>
  );
}

function SeriesDetail({ slug }: { slug: string }) {
  const [visible, setVisible] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const series = SERIES.find(s => s.slug === slug) || SERIES[0];
  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);

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
          <Link href="/fotografia" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase no-underline mb-10 transition-opacity hover:opacity-100 opacity-60"
            style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
            <ArrowLeft size={14} /> Fotografia Autoral
          </Link>

          <div className={`mb-12 transition-all duration-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <span className="section-eyebrow block mb-3">Série</span>
            <h1 className="font-serif text-5xl md:text-6xl font-medium mb-4" style={{ color: "var(--brand-marrom-deep)" }}>{series.name}</h1>
            <div className="divider-terracota" />
            <p className="mt-6 text-sm leading-relaxed max-w-xl" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{series.description}</p>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {series.images.map((src, i) => (
              <div key={i} className="break-inside-avoid cursor-pointer" onClick={() => setLightboxSrc(src)}>
                <div className="img-hover overflow-hidden" style={{ border: "1px solid var(--brand-sand)" }}>
                  <img src={src} alt="" className="w-full" style={{ filter: "grayscale(15%)" }} />
                  <div className="img-hover-overlay" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <StructuredData schemas={[
        buildBreadcrumb([{ name: "Fotografia Autoral", url: "/fotografia" }, { name: series.name, url: `/fotografia/${series.slug}` }]),
        {
          "@context": "https://schema.org",
          "@type": "CreativeWorkSeries",
          name: series.name,
          description: series.description,
          url: `${BASE_URL}/fotografia/${series.slug}`,
          creator: { "@id": `${BASE_URL}/#person` },
          genre: "Fotografia Artística",
          inLanguage: "pt-BR",
        },
      ]} />
      <Footer />
    </div>
  );
}

export default function Fotografia() {
  const params = useParams<{ slug?: string }>();
  if (params.slug) return <SeriesDetail slug={params.slug} />;
  return <FotografiaOverview />;
}
