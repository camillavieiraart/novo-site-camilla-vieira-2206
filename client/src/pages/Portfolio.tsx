import { useEffect, useRef, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import AdminFloatingButton from "@/components/AdminFloatingButton";
import { StructuredData, buildBreadcrumb, buildItemList, BASE_URL } from "@/components/StructuredData";
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
function Lightbox({ src, alt, caption, onClose }: { src: string; alt?: string; caption?: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="lightbox-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={alt || caption || "Foto ampliada"}>
      <button className="absolute top-6 right-6 text-white bg-transparent border-none cursor-pointer z-10" onClick={onClose} aria-label="Fechar">
        <X size={28} />
      </button>
      <figure className="flex flex-col items-center" onClick={e => e.stopPropagation()}>
        <img src={src} alt={alt || caption || "Fotografia artística por Camilla Vieira"} className="lightbox-img" />
        {caption && (
          <figcaption className="mt-3 text-center text-xs tracking-widest uppercase max-w-md" style={{ color: "rgba(250,247,242,0.7)", fontFamily: "'Inter', sans-serif" }}>
            {caption}
          </figcaption>
        )}
      </figure>
    </div>
  );
}

// Portfolio overview – all categories
function PortfolioOverview() {
  useSEO({
    title: "Portfólio",
    description: "Portfólio de Camilla Vieira: ensaios femininos, gestante e profissionais com olhar artístico. Fotografia única em Brasília, DF.",
    descriptionEn: "Photography portfolio by Camilla Vieira: feminine, maternity and professional portraits with an artistic, personalized vision. Fine art photography in Brasília, Brazil.",
    descriptionFr: "Portfolio photographique de Camilla Vieira: portraits féminins, maternité et professionnels avec une vision artistique et personnalisée. Photographie artistique à Brasília, Brésil.",
    keywords: "portfólio fotografia Brasília, ensaio feminino Brasília, ensaio gestante Brasília, fotografia artística, Camilla Vieira fotógrafa, ensaio profissional Brasília",
    canonical: "/portfolio",
    enableHreflang: true,
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
                <figure className="img-hover aspect-[4/5] mb-5" style={{ border: "1px solid var(--brand-sand)" }}>
                  <GalleryImage
                    src={cat.coverImageUrl || PLACEHOLDER_IMGS[i % PLACEHOLDER_IMGS.length]}
                    alt={`Ensaio ${cat.name} por Camilla Vieira — fotógrafa artística em Brasília`}
                    title={cat.name}
                    style={{ filter: "grayscale(20%)", width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div className="img-hover-overlay" />
                  <div className="absolute bottom-4 left-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs tracking-[0.15em] uppercase" style={{ color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
                      Ver Ensaios →
                    </span>
                  </div>
                  <figcaption className="sr-only">{cat.name} — {cat.description}</figcaption>
                </figure>
                <h2 className="font-serif text-2xl font-medium mb-2" style={{ color: "var(--brand-marrom-deep)" }}>{cat.name}</h2>
                <p className="text-xs leading-relaxed" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
        <StructuredData schemas={[
        buildBreadcrumb([{ name: "Portfólio", url: "/portfolio" }]),
        buildItemList(
          "Portfólio de Ensaios Fotográficos — Camilla Vieira",
          "/portfolio",
          (categories || []).map(c => ({ name: c.name, url: `/portfolio/${c.slug}`, image: c.coverImageUrl ?? undefined }))
        ),
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Ensaios Fotográficos — Camilla Vieira",
          description: "Ensaios fotográficos artísticos com direção sensível e estética autoral. Ensaios femininos, gestante e profissionais em Brasília e São Paulo.",
          url: `${BASE_URL}/portfolio`,
          provider: { "@id": `${BASE_URL}/#person` },
          areaServed: [
            { "@type": "City", name: "Brasília" },
            { "@type": "City", name: "São Paulo" },
            { "@type": "Country", name: "Brasil" },
            { "@type": "Country", name: "France" },
            { "@type": "Country", name: "United States" },
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          "@id": `${BASE_URL}/portfolio#gallery`,
          name: "Portfólio de Ensaios Fotográficos — Camilla Vieira",
          description: "Galeria de ensaios fotográficos femininos, gestante e profissionais por Camilla Vieira, fotógrafa artística em Brasília.",
          url: `${BASE_URL}/portfolio`,
          creator: { "@id": `${BASE_URL}/#person` },
          inLanguage: ["pt-BR", "en", "fr"],
          image: (categories || []).filter(c => c.coverImageUrl).map(c => ({
            "@type": "ImageObject",
            url: c.coverImageUrl,
            name: `Ensaio ${c.name} por Camilla Vieira`,
            description: c.description || `Ensaio fotográfico ${c.name} por Camilla Vieira, fotógrafa artística em Brasília`,
            author: { "@id": `${BASE_URL}/#person` },
            contentUrl: c.coverImageUrl,
            thumbnailUrl: c.coverImageUrl,
          })),
        },
      ]} />
      <AdminFloatingButton href="/admin/portfolio" label="Gerenciar Portfólio" />
      <Footer />
    </div>
  );
}

// CTA config por categoria
const CATEGORY_CTA: Record<string, { headline: string; sub: string; btn: string; href: string; color: string }> = {
  "ensaios-femininos": {
    headline: "Pronta para o seu ensaio feminino?",
    sub: "Retratos que celebram quem você é — com leveza, autenticidade e beleza autoral.",
    btn: "Ver pacotes e agendar",
    href: "/ensaio-feminino",
    color: "var(--brand-terracota)",
  },
  "gestante": {
    headline: "Registre esse momento único",
    sub: "Ensaios de gestante com olhar sensível e íntimo. Memórias que duram para sempre.",
    btn: "Ver pacotes e agendar",
    href: "/ensaio-gestante",
    color: "var(--brand-terracota)",
  },
  "familia": {
    headline: "Momentos que viram memória",
    sub: "Ensaios familiares com luz natural e emoções genuínas. Cada família tem sua história.",
    btn: "Quero agendar meu ensaio",
    href: "/ensaio-feminino",
    color: "var(--brand-terracota)",
  },
  "profissional": {
    headline: "Sua imagem profissional merece arte",
    sub: "Retratos corporativos com identidade visual marcante e olhar autoral. Veja os pacotes e agende seu ensaio.",
    btn: "Ver pacotes e agendar",
    href: "/ensaio-profissional",
    color: "var(--brand-marrom-deep)",
  },
};

function CategoryCTA({ slug, position }: { slug: string; position: "top" | "mid" | "bottom" }) {
  const cta = CATEGORY_CTA[slug];
  if (!cta) return null;

  if (position === "top") {
    return (
      <div className="mb-10 px-5 py-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        style={{ backgroundColor: "rgba(139,111,71,0.08)", border: "1px solid rgba(139,111,71,0.18)" }}>
        <p className="text-sm font-medium" style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>
          ✦ Gostou do que viu? {cta.headline}
        </p>
        <Link href={cta.href}
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs tracking-widest uppercase font-medium no-underline transition-opacity hover:opacity-80"
          style={{ backgroundColor: cta.color, color: "#FAF7F2", fontFamily: "'Inter', sans-serif" }}>
          {cta.btn}
        </Link>
      </div>
    );
  }

  if (position === "mid") {
    return (
      <div className="my-10 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, var(--brand-marrom-deep) 0%, #3D2B1F 100%)" }}>
        <div className="px-8 py-10 text-center">
          <span className="text-xs tracking-[0.3em] uppercase block mb-3" style={{ color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>Ateliê Digital</span>
          <h3 className="font-serif text-2xl md:text-3xl mb-3" style={{ color: "#FAF7F2" }}>{cta.headline}</h3>
          <p className="text-sm leading-relaxed mb-6 max-w-md mx-auto" style={{ color: "rgba(250,247,242,0.7)", fontFamily: "'Inter', sans-serif" }}>{cta.sub}</p>
          <Link href={cta.href}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-xs tracking-widest uppercase font-medium no-underline transition-opacity hover:opacity-80"
            style={{ backgroundColor: "var(--brand-terracota)", color: "#FAF7F2", fontFamily: "'Inter', sans-serif" }}>
            {cta.btn} →
          </Link>
        </div>
      </div>
    );
  }

  // bottom
  return (
    <div className="mt-16 pt-12" style={{ borderTop: "1px solid var(--brand-sand)" }}>
      <div className="text-center max-w-lg mx-auto">
        <span className="text-xs tracking-[0.3em] uppercase block mb-4" style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>Próximo passo</span>
        <h3 className="font-serif text-3xl md:text-4xl mb-4" style={{ color: "var(--brand-marrom-deep)" }}>{cta.headline}</h3>
        <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{cta.sub}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={cta.href}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-xs tracking-widest uppercase font-medium no-underline transition-opacity hover:opacity-80"
            style={{ backgroundColor: "var(--brand-terracota)", color: "#FAF7F2", fontFamily: "'Inter', sans-serif" }}>
            {cta.btn} →
          </Link>
          <a href="https://wa.me/5511910868299?text=Ol%C3%A1%20Camilla!%20Vi%20seu%20portf%C3%B3lio%20e%20quero%20saber%20mais%20sobre%20os%20ensaios."
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-xs tracking-widest uppercase font-medium no-underline transition-opacity hover:opacity-80"
            style={{ border: "1px solid var(--brand-terracota)", color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

// Portfolio category detail
function PortfolioCategory({ slug }: { slug: string }) {
  const [lightboxSrc, setLightboxSrc] = useState<{ src: string; alt?: string; caption?: string } | null>(null);
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
      {lightboxSrc && <Lightbox src={lightboxSrc.src} alt={lightboxSrc.alt} caption={lightboxSrc.caption} onClose={() => setLightboxSrc(null)} />}
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase no-underline mb-10 transition-opacity hover:opacity-100 opacity-60"
            style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
            <ArrowLeft size={14} /> Portfólio
          </Link>
          {/* CTA topo */}
          <CategoryCTA slug={slug} position="top" />

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
              {images.map((img, i) => {
                // CTA meio: inserir após a 6ª imagem
                const showMidCTA = i === 6;
                const altText = img.caption
                  ? `${img.caption} — ${displayName} por Camilla Vieira`
                  : `Foto ${i + 1} do ensaio ${displayName} por Camilla Vieira, fotógrafa artística em Brasília`;
                return (
                  <>
                  {showMidCTA && (
                    <div key={`cta-mid-${i}`} className="break-inside-avoid">
                      <CategoryCTA slug={slug} position="mid" />
                    </div>
                  )}
                  <figure key={img.id}
                    className={`break-inside-avoid cursor-pointer transition-all duration-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                    style={{ transitionDelay: `${i * 60}ms`, margin: 0 }}
                    onClick={() => setLightboxSrc({ src: img.imageUrl, alt: altText, caption: img.caption || undefined })}>
                    <div className="img-hover overflow-hidden" style={{ border: "1px solid var(--brand-sand)" }}>
                      <GalleryImage
                        src={img.imageUrl}
                        alt={altText}
                        title={img.caption || `${displayName} — Camilla Vieira`}
                        className="w-full"
                        style={{ filter: "grayscale(15%)" }}
                        loading={i < 6 ? "eager" : "lazy"}
                      />
                      <div className="img-hover-overlay" />
                    </div>
                    {img.caption && (
                      <figcaption className="mt-2 text-xs leading-relaxed px-1" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.75 }}>
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                  </>);
              })}
            </div>
          )}
          {/* CTA final */}
          <CategoryCTA slug={slug} position="bottom" />
        </div>
      </div>
      <StructuredData schemas={[
        buildBreadcrumb([{ name: "Portfólio", url: "/portfolio" }, { name: displayName, url: `/portfolio/${slug}` }]),
        {
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          "@id": `${BASE_URL}/portfolio/${slug}#gallery`,
          name: `${displayName} — Portfólio Camilla Vieira`,
          description: description || `Ensaios fotográficos de ${displayName} por Camilla Vieira, fotógrafa artística em Brasília.`,
          url: `${BASE_URL}/portfolio/${slug}`,
          creator: { "@id": `${BASE_URL}/#person` },
          numberOfItems: allImages.length,
          inLanguage: ["pt-BR", "en", "fr"],
          image: allImages.map((img, i) => ({
            "@type": "ImageObject",
            "@id": `${BASE_URL}/portfolio/${slug}#img-${img.id}`,
            url: img.imageUrl,
            contentUrl: img.imageUrl,
            name: img.caption
              ? `${img.caption} — ${displayName} por Camilla Vieira`
              : `${displayName} foto ${i + 1} por Camilla Vieira`,
            description: img.caption
              ? `${img.caption}. Ensaio ${displayName} por Camilla Vieira, fotógrafa artística em Brasília.`
              : `Foto ${i + 1} do ensaio ${displayName} por Camilla Vieira, fotógrafa artística em Brasília.`,
            author: { "@id": `${BASE_URL}/#person` },
            copyrightHolder: { "@id": `${BASE_URL}/#person` },
            license: `${BASE_URL}/termos`,
            acquireLicensePage: `${BASE_URL}/contato`,
          })),
        },
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: `Ensaio ${displayName} — Camilla Vieira`,
          description: description || `Ensaio fotográfico ${displayName} com olhar artístico e personalizado por Camilla Vieira.`,
          url: `${BASE_URL}/portfolio/${slug}`,
          provider: { "@id": `${BASE_URL}/#person` },
          areaServed: [
            { "@type": "City", name: "Brasília" },
            { "@type": "City", name: "São Paulo" },
            { "@type": "Country", name: "Brasil" },
          ],
        },
      ]} />
      <AdminFloatingButton href="/admin/portfolio" label="Gerenciar Portfólio" />
      <Footer />
    </div>
  );
}

export default function Portfolio() {
  const params = useParams<{ slug?: string; category?: string }>();
  const slug = params.slug || params.category;
  if (slug) return <PortfolioCategory slug={slug} />;
  return <PortfolioOverview />;
}
