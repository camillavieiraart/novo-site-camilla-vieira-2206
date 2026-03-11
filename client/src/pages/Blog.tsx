import { useEffect, useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useSEO } from "@/hooks/useSEO";
const LANG_OPTIONS = [
  { value: undefined, label: "Todos", flag: "🇳🇺" },
  { value: "pt", label: "Português", flag: "🇧🇷" },
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
];

export default function Blog() {
  const [selectedLang, setSelectedLang] = useState<string | undefined>(undefined);
  const { data: posts, isLoading } = trpc.blog.getAll.useQuery({ limit: 20, offset: 0, language: selectedLang });

  const siteUrl = window.location.origin;
  useSEO({
    fullTitle: "Blog — Camilla Vieira | Fotografia, Arte e Processo Criativo",
    description: "Reflexões sobre fotografia como linguagem, bordado, cinema, maternidade e processo criativo. Por Camilla Vieira, fotógrafa e artista visual em Brasília.",
    descriptionEn: "Reflections on photography as language, embroidery, cinema, maternity and creative process. By Camilla Vieira, fine art photographer and visual artist in Brasília, Brazil.",
    descriptionFr: "Réflexions sur la photographie comme langage, la broderie, le cinéma, la maternité et le processus créatif. Par Camilla Vieira, photographe artistique à Brasília, Brésil.",
    keywords: "blog fotografia, fotografia artística, processo criativo, bordado, Camilla Vieira, photography blog, fine art photography blog, blog photographie artistique",
    canonical: "/blog",
    ogImage: posts?.[0]?.coverImageUrl ?? undefined,
    enableHreflang: true,
  });

  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Blog — Camilla Vieira",
      "description": "Reflexões sobre fotografia como linguagem, bordado, cinema, maternidade e processo criativo.",
      "url": `${siteUrl}/blog`,
      "author": {
        "@type": "Person",
        "name": "Camilla Vieira",
        "url": siteUrl,
        "sameAs": ["https://www.instagram.com/camillavieira.art"],
      },
      "blogPost": posts?.slice(0, 10).map(p => ({
        "@type": "BlogPosting",
        "headline": p.title,
        "description": p.excerpt,
        "url": `${siteUrl}/blog/${p.slug}`,
        "datePublished": p.publishedAt,
        "image": p.coverImageUrl,
      })) ?? [],
    };
    let el = document.getElementById("schema-blog");
    if (!el) { el = document.createElement("script"); el.id = "schema-blog"; (el as HTMLScriptElement).type = "application/ld+json"; document.head.appendChild(el); }
    el.textContent = JSON.stringify(schema);
  }, [posts, siteUrl]);

  const formatDate = (d: Date | null | undefined) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  };

  const categoryLabel: Record<string, string> = {
    fotografia: "Fotografia",
    bordado: "Bordado & Têxtil",
    cinema: "Cinema",
    ia: "IA & Tecnologia",
    maternidade: "Maternidade",
    mentoria: "Mentoria",
    exposicoes: "Exposições",
    manifesto: "Manifesto",
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF7F2" }}>
      {/* ── HERO: cinematic full-bleed with first post image ── */}
      <section className="relative overflow-hidden" style={{ height: "65vh", minHeight: "420px", backgroundColor: "#1A1410" }}>
        {posts?.[0]?.coverImageUrl && (
          <div className="absolute inset-0">
            <img
              src={posts[0].coverImageUrl}
              alt={posts[0].coverImageAlt ?? posts[0].title}
              className="w-full h-full object-cover"
              style={{ filter: "sepia(20%)", opacity: 0.55 }}
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(26,20,16,0.2) 0%, rgba(26,20,16,0.9) 100%)" }} />
          </div>
        )}
        {!posts?.[0]?.coverImageUrl && (
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #2C1810 0%, #1A1410 100%)" }} />
        )}
        <div className="relative z-10 flex flex-col justify-end h-full px-6 md:px-12 lg:px-20 pb-14 pt-32">
          <p className="text-xs tracking-[0.35em] uppercase mb-4" style={{ color: "#C9A96E" }}>Reflexões & Processo</p>
          <h1 className="font-serif mb-4" style={{ color: "#FAF7F2", fontSize: "clamp(3rem, 8vw, 6rem)", lineHeight: 1.05 }}>Blog</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="text-base max-w-lg leading-relaxed" style={{ color: "rgba(250,247,242,0.65)" }}>
              Fotografia como linguagem. Bordado como resistência. Cinema como luz. Maternidade como processo.
            </p>
            <a
              href="/feed.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-widest uppercase font-medium transition-all duration-300 hover:opacity-80 shrink-0"
              style={{ backgroundColor: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.4)", color: "#C9A96E" }}
              title="Assinar feed RSS do blog"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
              </svg>
              RSS
            </a>
          </div>
        </div>
      </section>

      {/* ── LANGUAGE FILTER ── */}
      <div className="px-6 md:px-12 lg:px-20 pt-10 pb-2 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs tracking-widest uppercase" style={{ color: "#8B7355", fontFamily: "'Inter', sans-serif" }}>Idioma:</span>
          {LANG_OPTIONS.map(opt => (
            <button
              key={String(opt.value)}
              onClick={() => setSelectedLang(opt.value)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs tracking-wide font-medium transition-all duration-200 cursor-pointer border"
              style={{
                backgroundColor: selectedLang === opt.value ? "#8B7355" : "transparent",
                borderColor: selectedLang === opt.value ? "#8B7355" : "rgba(139,115,85,0.3)",
                color: selectedLang === opt.value ? "#FAF7F2" : "#8B7355",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <span>{opt.flag}</span> {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── POSTS ── */}
      <section className="px-6 md:px-12 lg:px-20 py-12 max-w-7xl mx-auto">
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] mb-4" style={{ backgroundColor: "#E8E0D5" }} />
                <div className="h-3 rounded mb-2" style={{ backgroundColor: "#E8E0D5", width: "40%" }} />
                <div className="h-6 rounded mb-2" style={{ backgroundColor: "#E8E0D5" }} />
                <div className="h-4 rounded" style={{ backgroundColor: "#E8E0D5", width: "80%" }} />
              </div>
            ))}
          </div>
        )}

        {!isLoading && (!posts || posts.length === 0) && (
          <div className="text-center py-32">
            <p className="font-serif text-3xl mb-4" style={{ color: "#2C2C2C" }}>Em breve.</p>
            <p style={{ color: "#6B6B6B" }}>Os primeiros textos estão a caminho.</p>
          </div>
        )}

        {!isLoading && posts && posts.length > 0 && (
          <>
            {/* Featured post — ultra-wide cinematic */}
            <article className="mb-20 group">
              <Link href={`/blog/${posts[0].slug}`} className="block">
                <div className="relative overflow-hidden mb-6" style={{ aspectRatio: "21/9", backgroundColor: "#2C2C2C" }}>
                  {posts[0].coverImageUrl ? (
                    <img
                      src={posts[0].coverImageUrl}
                      alt={posts[0].coverImageAlt ?? posts[0].title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                      loading="eager"
                      style={{ filter: "sepia(10%)" }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "#2C2C2C" }}>
                      <span className="font-serif text-8xl" style={{ color: "#C9A96E" }}>C</span>
                    </div>
                  )}
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(26,20,16,0.75) 0%, transparent 55%)" }} />
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    {posts[0].category && (
                      <span className="text-xs tracking-[0.3em] uppercase mb-3 block" style={{ color: "#C9A96E" }}>
                        {categoryLabel[posts[0].category] ?? posts[0].category}
                        {posts[0].readingTimeMinutes ? ` · ${posts[0].readingTimeMinutes} min` : ""}
                      </span>
                    )}
                    <h2 className="font-serif leading-tight mb-3 transition-opacity group-hover:opacity-80"
                      style={{ color: "#FAF7F2", fontSize: "clamp(1.75rem, 4vw, 3rem)", maxWidth: "700px" }}>
                      {posts[0].title}
                    </h2>
                    {posts[0].excerpt && (
                      <p className="text-sm leading-relaxed max-w-2xl line-clamp-2" style={{ color: "rgba(250,247,242,0.7)" }}>
                        {posts[0].excerpt}
                      </p>
                    )}
                    <p className="text-xs mt-4" style={{ color: "rgba(250,247,242,0.45)" }}>{formatDate(posts[0].publishedAt)}</p>
                  </div>
                </div>
              </Link>
            </article>

            {/* Grid — remaining posts */}
            {posts.length > 1 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {posts.slice(1).map((post) => (
                  <article key={post.id} className="group">
                    <Link href={`/blog/${post.slug}`} className="block">
                      <div className="overflow-hidden mb-5" style={{ aspectRatio: "4/3", backgroundColor: "#E8E0D5" }}>
                        {post.coverImageUrl ? (
                          <img
                            src={post.coverImageUrl}
                            alt={post.coverImageAlt ?? post.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                            style={{ filter: "sepia(8%)" }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "#2C2C2C" }}>
                            <span className="font-serif text-4xl" style={{ color: "#C9A96E" }}>C</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        {post.category && (
                          <span className="text-xs tracking-[0.25em] uppercase" style={{ color: "#C9A96E" }}>
                            {categoryLabel[post.category] ?? post.category}
                          </span>
                        )}
                        {post.readingTimeMinutes && (
                          <span className="text-xs" style={{ color: "#9B9B9B" }}>{post.readingTimeMinutes} min</span>
                        )}
                      </div>
                      <h2 className="font-serif text-xl leading-snug mb-2 transition-opacity group-hover:opacity-60"
                        style={{ color: "#2C2C2C" }}>
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "#6B6B6B" }}>
                          {post.excerpt}
                        </p>
                      )}
                      <p className="text-xs mt-3" style={{ color: "#9B9B9B" }}>{formatDate(post.publishedAt)}</p>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

// ─── CTA block: shown at the end of every post ──────────────────────────────
function PostCTA({ category, slug }: { category: string | null; slug: string }) {
  type CTAConfig = { headline: string; body: string; label: string; href: string; secondary?: { label: string; href: string } };

  const ctaMap: Record<string, CTAConfig> = {
    "Ensaio Feminino": {
      headline: "Pronta para o seu ensaio feminino?",
      body: "Cada ensaio é único — construído a partir de quem você é, não de um roteiro pronto. Vamos conversar sobre o que você quer sentir.",
      label: "Quero agendar meu ensaio",
      href: "/contato",
      secondary: { label: "Ver portfólio feminino", href: "/portfolio" },
    },
    "Ensaio Gestante": {
      headline: "Registre este momento que não volta.",
      body: "O ensaio gestante da Camilla Vieira é feito com luz natural, intenção e cuidado. Um presente para você e para quem está chegando.",
      label: "Agendar ensaio gestante",
      href: "/contato",
      secondary: { label: "Ver portfólio de gestantes", href: "/portfolio" },
    },
    "Mentoria": {
      headline: "Quer evoluir como fotógrafa?",
      body: "A mentoria individual da Camilla é para quem quer parar de fotografar no automático e começar a criar com intenção. Presencial em Brasília ou online.",
      label: "Conhecer as mentorias",
      href: "/mentorias",
    },
    "Marca Pessoal": {
      headline: "Sua marca precisa de imagens que te representam.",
      body: "Fotos de marca pessoal que comunicam quem você é antes mesmo de você falar. Para profissionais, empreendedoras e criadoras de conteúdo.",
      label: "Falar sobre minha marca",
      href: "/contato",
      secondary: { label: "Ver portfólio profissional", href: "/portfolio" },
    },
    "Cerâmica": {
      headline: "Conheça as peças do ateliê.",
      body: "Cerâmica feita à mão em Brasília — peças únicas que carregam a marca do processo. Cada obra é irrepetível.",
      label: "Ver obras de cerâmica",
      href: "/ceramica",
      secondary: { label: "Entrar em contato", href: "/contato" },
    },
    "Processo Criativo": {
      headline: "Arte que nasce do processo.",
      body: "Fotografia autoral, cerâmica e obras de intervenção — um ateliê onde cada peça conta uma história de criação.",
      label: "Ver portfólio completo",
      href: "/portfolio",
      secondary: { label: "Conhecer as mentorias", href: "/mentorias" },
    },
    "Arte e Fotografia": {
      headline: "Fotografia como linguagem, não como registro.",
      body: "Se este texto ressoou com você, talvez a mentoria seja o próximo passo. Trabalhar a fotografia como arte, com intenção e voz própria.",
      label: "Conhecer as mentorias",
      href: "/mentorias",
      secondary: { label: "Ver portfólio autoral", href: "/portfolio" },
    },
    "Guias": {
      headline: "Encontrou a fotógrafa certa?",
      body: "Baseada em Brasília, com atendimento em São Paulo e outros estados. Vamos conversar sobre o que você precisa.",
      label: "Entrar em contato",
      href: "/contato",
      secondary: { label: "Ver portfólio", href: "/portfolio" },
    },
  };

  const defaultCTA: CTAConfig = {
    headline: "Gostou do que leu?",
    body: "Explore o portfólio, conheça as mentorias ou entre em contato. A Camilla atende em Brasília e online.",
    label: "Ver portfólio",
    href: "/portfolio",
    secondary: { label: "Conhecer as mentorias", href: "/mentorias" },
  };

  const cta = (category && ctaMap[category]) ? ctaMap[category] : defaultCTA;

  return (
    <div
      className="my-16 rounded-2xl px-8 py-10 md:px-12 md:py-12"
      style={{
        background: "linear-gradient(135deg, #2C1810 0%, #3D2415 100%)",
        border: "1px solid rgba(201,169,110,0.2)",
      }}
    >
      <p className="text-xs tracking-[0.35em] uppercase mb-3" style={{ color: "#C9A96E" }}>Próximo passo</p>
      <h3 className="font-serif mb-3 leading-tight" style={{ color: "#FAF7F2", fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>
        {cta.headline}
      </h3>
      <p className="leading-relaxed mb-8 max-w-xl" style={{ color: "rgba(250,247,242,0.65)", fontSize: "0.9375rem" }}>
        {cta.body}
      </p>
      <div className="flex flex-wrap gap-4">
        <a
          href={cta.href}
          className="inline-block px-7 py-3 text-xs tracking-[0.12em] uppercase font-medium transition-all duration-300 hover:opacity-85"
          style={{ backgroundColor: "#C9A96E", color: "#1A1410" }}
        >
          {cta.label}
        </a>
        {cta.secondary && (
          <a
            href={cta.secondary.href}
            className="inline-block px-7 py-3 text-xs tracking-[0.12em] uppercase font-medium transition-all duration-300 hover:opacity-85"
            style={{ border: "1px solid rgba(201,169,110,0.5)", color: "#C9A96E", backgroundColor: "transparent" }}
          >
            {cta.secondary.label}
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Blog post detail page ────────────────────────────────────────────────────
export function BlogPost({ slug }: { slug: string }) {
  const { data: post, isLoading, error } = trpc.blog.getBySlug.useQuery({ slug });
  const siteUrl = window.location.origin;

  useSEO({
    fullTitle: post?.metaTitle ?? (post ? `${post.title} — Camilla Vieira` : "Blog — Camilla Vieira"),
    description: post?.metaDescription ?? post?.excerpt ?? "Reflexões sobre fotografia, arte e processo criativo por Camilla Vieira.",
    descriptionEn: post?.excerpt
      ? `${post.excerpt.slice(0, 120)} — By Camilla Vieira, Brazilian fine art photographer.`
      : "Reflections on photography, art and creative process by Camilla Vieira, Brazilian fine art photographer.",
    descriptionFr: post?.excerpt
      ? `${post.excerpt.slice(0, 120)} — Par Camilla Vieira, photographe artistique brésilienne.`
      : "Réflexions sur la photographie, l'art et le processus créatif par Camilla Vieira, photographe artistique brésilienne.",
    keywords: `${post?.keywords ?? ""}, fotografia artística, Camilla Vieira, fine art photography, photographie artistique`,
    canonical: post?.canonicalUrl ? post.canonicalUrl.replace(siteUrl, "") : `/blog/${slug}`,
    ogImage: post?.ogImageUrl ?? post?.coverImageUrl ?? undefined,
    enableHreflang: true,
  });

  useEffect(() => {
    if (!post) return;
    const wordCount = post.wordCount ?? 0;
    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt ?? post.metaDescription,
      "image": post.coverImageUrl ?? post.ogImageUrl,
      "url": `${siteUrl}/blog/${post.slug}`,
      "datePublished": post.publishedAt,
      "dateModified": post.updatedAt,
      "wordCount": wordCount,
      "timeRequired": `PT${post.readingTimeMinutes ?? 5}M`,
      "inLanguage": "pt-BR",
      "author": {
        "@type": "Person",
        "name": post.author ?? "Camilla Vieira",
        "url": siteUrl,
        "sameAs": ["https://www.instagram.com/camillavieira.art"],
      },
      "publisher": {
        "@type": "Organization",
        "name": "Camilla Vieira — Ateliê Digital",
        "url": siteUrl,
        "logo": { "@type": "ImageObject", "url": `${siteUrl}/logo.png` },
      },
      "mainEntityOfPage": { "@type": "WebPage", "@id": `${siteUrl}/blog/${post.slug}` },
      "keywords": post.keywords ?? "",
      "articleSection": post.category ?? "fotografia",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${siteUrl}/blog` },
          { "@type": "ListItem", "position": 3, "name": post.title, "item": `${siteUrl}/blog/${post.slug}` },
        ],
      },
    };
    let el = document.getElementById("schema-post");
    if (!el) { el = document.createElement("script"); el.id = "schema-post"; (el as HTMLScriptElement).type = "application/ld+json"; document.head.appendChild(el); }
    el.textContent = JSON.stringify(schema);
    return () => { document.getElementById("schema-post")?.remove(); };
  }, [post, siteUrl]);

  const formatDate = (d: Date | null | undefined) =>
    d ? new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }) : "";

  const categoryLabel: Record<string, string> = {
    fotografia: "Fotografia",
    bordado: "Bordado & Têxtil",
    cinema: "Cinema",
    ia: "IA & Tecnologia Criativa",
    maternidade: "Maternidade",
    mentoria: "Mentoria",
    exposicoes: "Exposições",
    manifesto: "Manifesto",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#FAF7F2" }}>
        <div className="pt-24 pb-0 px-6 max-w-2xl mx-auto animate-pulse">
          <div className="h-4 rounded mb-8" style={{ backgroundColor: "#E8E0D5", width: "40%" }} />
          <div className="h-4 rounded mb-3" style={{ backgroundColor: "#E8E0D5", width: "25%" }} />
          <div className="h-14 rounded mb-3" style={{ backgroundColor: "#E8E0D5" }} />
          <div className="h-14 rounded mb-6" style={{ backgroundColor: "#E8E0D5", width: "80%" }} />
          <div className="h-6 rounded mb-2" style={{ backgroundColor: "#E8E0D5" }} />
          <div className="h-6 rounded mb-8" style={{ backgroundColor: "#E8E0D5", width: "90%" }} />
          <div className="h-px mb-8" style={{ backgroundColor: "#E8E0D5" }} />
        </div>
        <div className="px-6 max-w-2xl mx-auto animate-pulse">
          <div className="aspect-[16/9] rounded-xl mb-12" style={{ backgroundColor: "#E8E0D5" }} />
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="mb-6">
              <div className="h-5 rounded mb-2" style={{ backgroundColor: "#E8E0D5" }} />
              <div className="h-5 rounded mb-2" style={{ backgroundColor: "#E8E0D5", width: "95%" }} />
              <div className="h-5 rounded" style={{ backgroundColor: "#E8E0D5", width: "85%" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-32 px-6 max-w-3xl mx-auto text-center" style={{ backgroundColor: "#FAF7F2" }}>
        <h1 className="font-serif text-4xl mb-4" style={{ color: "#2C2C2C" }}>Post não encontrado.</h1>
        <Link href="/blog" className="text-sm tracking-widest uppercase" style={{ color: "#C9A96E" }}>← Voltar ao Blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF7F2" }}>

      {/* ── HERO: cover image full-bleed with title overlay ── */}
      {post.coverImageUrl ? (
        <header className="relative overflow-hidden" style={{ height: "72vh", minHeight: "500px", backgroundColor: "#1A1410" }}>
          <img
            src={post.coverImageUrl}
            alt={post.coverImageAlt ?? post.title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "sepia(15%)", opacity: 0.7 }}
            loading="eager"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(26,20,16,0.1) 0%, rgba(26,20,16,0.7) 55%, rgba(26,20,16,0.97) 100%)" }} />

          {/* Breadcrumb */}
          <nav className="absolute top-0 left-0 right-0 pt-8 px-6 md:px-12 z-10" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs" style={{ color: "rgba(250,247,242,0.45)" }}>
              <li><Link href="/" className="hover:opacity-80 transition-opacity">Home</Link></li>
              <li>/</li>
              <li><Link href="/blog" className="hover:opacity-80 transition-opacity">Blog</Link></li>
              <li>/</li>
              <li className="truncate max-w-[200px]" style={{ color: "rgba(250,247,242,0.7)" }}>{post.title}</li>
            </ol>
          </nav>

          {/* Title block at bottom */}
          <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-14 z-10" style={{ maxWidth: "860px" }}>
            {post.category && (
              <span className="text-xs tracking-[0.35em] uppercase mb-4 block" style={{ color: "#C9A96E" }}>
                {categoryLabel[post.category] ?? post.category}
                {post.readingTimeMinutes ? ` · ${post.readingTimeMinutes} min de leitura` : ""}
              </span>
            )}
            <h1 className="font-serif leading-[1.1] mb-4" style={{ color: "#FAF7F2", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="leading-relaxed max-w-2xl mb-6" style={{ color: "rgba(250,247,242,0.7)", fontSize: "1.0625rem" }}>
                {post.excerpt}
              </p>
            )}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-serif flex-shrink-0"
                style={{ backgroundColor: "#C9A96E", color: "#FAF7F2" }}>C</div>
              <div>
                <p className="text-sm font-medium" style={{ color: "rgba(250,247,242,0.9)" }}>{post.author ?? "Camilla Vieira"}</p>
                <p className="text-xs" style={{ color: "rgba(250,247,242,0.45)" }}>{formatDate(post.publishedAt)}</p>
              </div>
            </div>
          </div>
        </header>
      ) : (
        /* Fallback: no cover image */
        <header className="pt-32 pb-10 px-6 max-w-2xl mx-auto">
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs" style={{ color: "#9B9B9B" }}>
              <li><Link href="/" className="hover:opacity-70 transition-opacity">Home</Link></li>
              <li>/</li>
              <li><Link href="/blog" className="hover:opacity-70 transition-opacity">Blog</Link></li>
              <li>/</li>
              <li className="truncate max-w-[200px]" style={{ color: "#2C2C2C" }}>{post.title}</li>
            </ol>
          </nav>
          {post.category && (
            <span className="text-xs tracking-[0.35em] uppercase mb-4 block" style={{ color: "#C9A96E" }}>
              {categoryLabel[post.category] ?? post.category}
              {post.readingTimeMinutes ? ` · ${post.readingTimeMinutes} min de leitura` : ""}
            </span>
          )}
          <h1 className="font-serif leading-[1.1] mb-4" style={{ color: "#2C2C2C", fontSize: "clamp(2rem, 5vw, 3rem)" }}>{post.title}</h1>
          {post.excerpt && (
            <p className="leading-relaxed mb-6" style={{ color: "#5A5A5A", fontSize: "1.125rem" }}>{post.excerpt}</p>
          )}
          <div className="flex items-center gap-4 pb-8 border-b" style={{ borderColor: "#E8E0D5" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-serif flex-shrink-0"
              style={{ backgroundColor: "#C9A96E", color: "#FAF7F2" }}>C</div>
            <div>
              <p className="text-sm font-medium" style={{ color: "#2C2C2C" }}>{post.author ?? "Camilla Vieira"}</p>
              <p className="text-xs" style={{ color: "#9B9B9B" }}>{formatDate(post.publishedAt)}</p>
            </div>
          </div>
        </header>
      )}

      {/* ── ARTICLE BODY ── */}
      <article
        className="px-6 md:px-0 pt-14 pb-12 blog-content"
        style={{ maxWidth: "720px", margin: "0 auto" }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* ── CTA block ── */}
      <div className="px-6 md:px-0" style={{ maxWidth: "720px", margin: "0 auto" }}>
        <PostCTA category={post.category} slug={post.slug} />
      </div>

      {/* Footer nav */}
      <div className="px-6 pb-28 border-t pt-10" style={{ borderColor: "#E8E0D5", maxWidth: "720px", margin: "0 auto" }}>
        <Link href="/blog"
          className="text-sm tracking-widest uppercase hover:opacity-70 transition-opacity"
          style={{ color: "#C9A96E" }}>
          ← Mais textos
        </Link>
      </div>
    </div>
  );
}
