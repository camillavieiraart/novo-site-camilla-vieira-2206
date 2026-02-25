import { useEffect, useRef, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { Link, useParams } from "wouter";
import { ArrowLeft, X } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BrushCorner } from "@/components/BrushStroke";
import { trpc } from "@/lib/trpc";
import { GalleryImage } from "@/components/GalleryImage";

const PLACEHOLDER_IMGS = [
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509460913899-515f1df34fea?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80&auto=format&fit=crop",
];

// Lightbox
function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="lightbox-backdrop" onClick={onClose}>
      <button className="absolute top-6 right-6 text-white bg-transparent border-none cursor-pointer z-10" onClick={onClose}>
        <X size={28} />
      </button>
      <img src={src} alt="" className="lightbox-img" onClick={e => e.stopPropagation()} />
    </div>
  );
}

// Portfolio overview – all categories
function PortfolioOverview() {
  useSEO({
    title: "Portfólio",
    description: "Portfólio de ensaios fotográficos de Camilla Vieira: ensaios femininos, gestante, profissionais, fotografia autoral, cerâmica e projetos especiais. Fotografia artística em Belo Horizonte, MG.",
    keywords: "portfólio fotografia, ensaio feminino, ensaio gestante, ensaio profissional, fotografia autoral, Camilla Vieira",
    canonical: "/portfolio",
  });
  const { data: categories } = trpc.categories.getAll.useQuery();
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);

  const fallbackCategories = [
    { id: 1, slug: "ensaios-femininos", name: "Ensaios Femininos", description: "Retratos que celebram a autenticidade e a beleza feminina.", coverImageUrl: PLACEHOLDER_IMGS[0] },
    { id: 2, slug: "gestante", name: "Gestante", description: "Momentos íntimos que capturam a conexão entre mãe e bebê.", coverImageUrl: PLACEHOLDER_IMGS[1] },
    { id: 3, slug: "profissional", name: "Profissional", description: "Retratos corporativos e profissionais com olhar artístico e autoral.", coverImageUrl: PLACEHOLDER_IMGS[2] },
  ];

  const items = (categories && categories.length > 0) ? categories : fallbackCategories;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--brand-bege-light)" }}>
      <Navigation />
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {/* Header */}
          <div className={`mb-16 transition-all duration-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <span className="section-eyebrow block mb-3">Portfólio</span>
            <h1 className="font-serif text-5xl md:text-6xl font-medium mb-4" style={{ color: "var(--brand-marrom-deep)" }}>
              Ensaios Fotográficos
            </h1>
            <div className="divider-terracota" />
            <p className="mt-6 text-sm leading-relaxed max-w-xl" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
              Cada ensaio é uma jornada única de revelação e conexão. Explore as diferentes categorias e descubra histórias contadas através da luz e da emoção.
            </p>
          </div>

          {/* Categories grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((cat, i) => (
              <Link key={cat.id} href={`/portfolio/${cat.slug}`}
                className={`group block no-underline transition-all duration-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${200 + i * 120}ms` }}>
                <div className="img-hover aspect-[4/5] mb-5" style={{ border: "1px solid var(--brand-sand)" }}>
                  <GalleryImage src={cat.coverImageUrl || PLACEHOLDER_IMGS[i % PLACEHOLDER_IMGS.length]} alt={cat.name} style={{ filter: "grayscale(20%)", width: "100%", height: "100%", objectFit: "cover" }} />
                  <div className="img-hover-overlay" />
                  <div className="absolute bottom-4 left-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs tracking-[0.15em] uppercase" style={{ color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
                      Ver Ensaios →
                    </span>
                  </div>
                </div>
                <h2 className="font-serif text-2xl font-medium mb-2" style={{ color: "var(--brand-marrom-deep)" }}>{cat.name}</h2>
                <p className="text-xs leading-relaxed" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Portfolio category detail
function PortfolioCategory({ slug }: { slug: string }) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);

  // Fetch category and its shoots from the database
  const { data: category } = trpc.categories.getBySlug.useQuery({ slug });
  const { data: shoots, isLoading } = trpc.categories.getShootsBySlug.useQuery({ slug });

  // Collect all shoot IDs to fetch images
  const shootIds = shoots?.map(s => s.id) ?? [];

  // Fetch images for each shoot individually
  const shoot0 = trpc.portfolioImages.getByShoot.useQuery({ shootId: shootIds[0] ?? 0 }, { enabled: shootIds.length > 0 });
  const shoot1 = trpc.portfolioImages.getByShoot.useQuery({ shootId: shootIds[1] ?? 0 }, { enabled: shootIds.length > 1 });
  const shoot2 = trpc.portfolioImages.getByShoot.useQuery({ shootId: shootIds[2] ?? 0 }, { enabled: shootIds.length > 2 });

  const allImages = [
    ...(shoot0.data ?? []),
    ...(shoot1.data ?? []),
    ...(shoot2.data ?? []),
  ];

  const displayName = category?.name || slug.replace(/-/g, " ");
  const description = category?.description || "";

  // Use real images if available, otherwise placeholder
  const images = allImages.length > 0 ? allImages : PLACEHOLDER_IMGS.map((src, i) => ({
    id: i + 1, imageUrl: src, caption: `Foto ${i + 1}`, order: i, shootId: 1, isActive: true, createdAt: new Date(),
  }));

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--brand-bege-light)" }}>
      <Navigation />
      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase no-underline mb-10 transition-opacity hover:opacity-100 opacity-60"
            style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
            <ArrowLeft size={14} /> Portfólio
          </Link>
          <div className={`mb-12 transition-all duration-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <span className="section-eyebrow block mb-3">Portfólio</span>
            <h1 className="font-serif text-5xl md:text-6xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>{displayName}</h1>
            {description && (
              <p className="mt-4 text-sm leading-relaxed max-w-xl" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{description}</p>
            )}
            <div className="divider-terracota mt-4" />
          </div>
          {isLoading ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="break-inside-avoid" style={{ aspectRatio: "4/5", background: "var(--brand-sand)", border: "1px solid var(--brand-sand)", opacity: 0.4 }} />
              ))}
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {images.map((img, i) => (
                <div key={img.id}
                  className={`break-inside-avoid cursor-pointer transition-all duration-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                  style={{ transitionDelay: `${i * 60}ms` }}
                  onClick={() => setLightboxSrc(img.imageUrl)}>
                  <div className="img-hover overflow-hidden" style={{ border: "1px solid var(--brand-sand)" }}>
                    <GalleryImage src={img.imageUrl} alt={img.caption || ""} className="w-full" style={{ filter: "grayscale(15%)" }} />
                    <div className="img-hover-overlay" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function Portfolio() {
  const params = useParams<{ slug?: string }>();
  if (params.slug) return <PortfolioCategory slug={params.slug} />;
  return <PortfolioOverview />;
}
