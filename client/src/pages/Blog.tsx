import { useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

// ─── SEO Head helper ──────────────────────────────────────────────────────────
function useSeoHead({
  title,
  description,
  canonical,
  ogImage,
  type = "website",
}: {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  type?: string;
}) {
  useEffect(() => {
    document.title = title;
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.content = content;
    };
    setMeta("description", description);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:type", type, true);
    if (canonical) setMeta("og:url", canonical, true);
    if (ogImage) setMeta("og:image", ogImage, true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    if (ogImage) setMeta("twitter:image", ogImage);
    // Canonical link
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
      link.href = canonical;
    }
  }, [title, description, canonical, ogImage, type]);
}

// ─── Blog listing page ────────────────────────────────────────────────────────
export default function Blog() {
  const { data: posts, isLoading } = trpc.blog.getAll.useQuery({ limit: 20, offset: 0 });

  const siteUrl = window.location.origin;
  useSeoHead({
    title: "Blog — Camilla Vieira | Fotografia, Arte e Processo Criativo",
    description: "Reflexões sobre fotografia como linguagem, bordado, cinema, maternidade e processo criativo. Por Camilla Vieira, fotógrafa e artista visual em Brasília.",
    canonical: `${siteUrl}/blog`,
    ogImage: posts?.[0]?.coverImageUrl ?? undefined,
    type: "website",
  });

  // Schema.org Blog structured data
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
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 max-w-5xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "#C9A96E" }}>
          Reflexões & Processo
        </p>
        <h1 className="font-serif text-5xl md:text-7xl mb-6" style={{ color: "#2C2C2C" }}>
          Blog
        </h1>
        <p className="text-lg max-w-xl leading-relaxed" style={{ color: "#6B6B6B" }}>
          Fotografia como linguagem. Bordado como resistência. Cinema como luz. Maternidade como processo.
        </p>
      </section>

      {/* Posts grid */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] rounded-lg mb-4" style={{ backgroundColor: "#E8E0D5" }} />
                <div className="h-4 rounded mb-2" style={{ backgroundColor: "#E8E0D5", width: "60%" }} />
                <div className="h-6 rounded mb-2" style={{ backgroundColor: "#E8E0D5" }} />
                <div className="h-4 rounded" style={{ backgroundColor: "#E8E0D5", width: "80%" }} />
              </div>
            ))}
          </div>
        )}

        {!isLoading && (!posts || posts.length === 0) && (
          <div className="text-center py-24">
            <p className="text-2xl font-serif mb-4" style={{ color: "#2C2C2C" }}>Em breve.</p>
            <p style={{ color: "#6B6B6B" }}>Os primeiros textos estão a caminho.</p>
          </div>
        )}

        {!isLoading && posts && posts.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <article key={post.id} className={i === 0 ? "md:col-span-2 lg:col-span-2" : ""}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  {/* Cover image */}
                  <div className={`overflow-hidden rounded-lg mb-4 ${i === 0 ? "aspect-[16/9]" : "aspect-[4/3]"}`}
                    style={{ backgroundColor: "#E8E0D5" }}>
                    {post.coverImageUrl ? (
                      <img
                        src={post.coverImageUrl}
                        alt={post.coverImageAlt ?? post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading={i < 3 ? "eager" : "lazy"}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-serif text-4xl" style={{ color: "#C9A96E" }}>C</span>
                      </div>
                    )}
                  </div>
                  {/* Meta */}
                  <div className="flex items-center gap-3 mb-2">
                    {post.category && (
                      <span className="text-xs tracking-widest uppercase" style={{ color: "#C9A96E" }}>
                        {categoryLabel[post.category] ?? post.category}
                      </span>
                    )}
                    <span className="text-xs" style={{ color: "#9B9B9B" }}>
                      {post.readingTimeMinutes ? `${post.readingTimeMinutes} min` : ""}
                    </span>
                  </div>
                  {/* Title */}
                  <h2 className={`font-serif leading-tight mb-2 group-hover:opacity-70 transition-opacity ${i === 0 ? "text-3xl md:text-4xl" : "text-xl"}`}
                    style={{ color: "#2C2C2C" }}>
                    {post.title}
                  </h2>
                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "#6B6B6B" }}>
                      {post.excerpt}
                    </p>
                  )}
                  {/* Date */}
                  <p className="text-xs mt-3" style={{ color: "#9B9B9B" }}>
                    {formatDate(post.publishedAt)}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ─── Blog post detail page ────────────────────────────────────────────────────
export function BlogPost({ slug }: { slug: string }) {
  const { data: post, isLoading, error } = trpc.blog.getBySlug.useQuery({ slug });
  const siteUrl = window.location.origin;

  useSeoHead({
    title: post?.metaTitle ?? (post ? `${post.title} — Camilla Vieira` : "Blog — Camilla Vieira"),
    description: post?.metaDescription ?? post?.excerpt ?? "Reflexões sobre fotografia, arte e processo criativo por Camilla Vieira.",
    canonical: post?.canonicalUrl ?? `${siteUrl}/blog/${slug}`,
    ogImage: post?.ogImageUrl ?? post?.coverImageUrl ?? undefined,
    type: "article",
  });

  // Schema.org BlogPosting structured data
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
      // GEO: breadcrumb for generative engines
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
    // Cleanup on unmount
    return () => { document.getElementById("schema-post")?.remove(); };
  }, [post, siteUrl]);

  const formatDate = (d: Date | null | undefined) =>
    d ? new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }) : "";

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 px-6 max-w-3xl mx-auto animate-pulse" style={{ backgroundColor: "#FAF7F2" }}>
        <div className="h-8 rounded mb-4" style={{ backgroundColor: "#E8E0D5", width: "30%" }} />
        <div className="h-12 rounded mb-6" style={{ backgroundColor: "#E8E0D5" }} />
        <div className="aspect-[16/9] rounded-lg mb-8" style={{ backgroundColor: "#E8E0D5" }} />
        {[1, 2, 3, 4].map(i => <div key={i} className="h-4 rounded mb-3" style={{ backgroundColor: "#E8E0D5", width: i % 2 === 0 ? "90%" : "100%" }} />)}
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
      {/* Breadcrumb */}
      <nav className="pt-24 pb-0 px-6 max-w-3xl mx-auto" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-xs" style={{ color: "#9B9B9B" }}>
          <li><Link href="/" className="hover:opacity-70">Home</Link></li>
          <li>/</li>
          <li><Link href="/blog" className="hover:opacity-70">Blog</Link></li>
          <li>/</li>
          <li className="truncate max-w-[200px]" style={{ color: "#2C2C2C" }}>{post.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="pt-8 pb-0 px-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          {post.category && (
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "#C9A96E" }}>
              {post.category}
            </span>
          )}
          {post.readingTimeMinutes && (
            <span className="text-xs" style={{ color: "#9B9B9B" }}>
              {post.readingTimeMinutes} min de leitura
            </span>
          )}
        </div>
        <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-4" style={{ color: "#2C2C2C" }}>
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-lg leading-relaxed mb-6" style={{ color: "#6B6B6B" }}>
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center gap-4 pb-8 border-b" style={{ borderColor: "#E8E0D5" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-serif"
            style={{ backgroundColor: "#C9A96E", color: "#FAF7F2" }}>C</div>
          <div>
            <p className="text-sm font-medium" style={{ color: "#2C2C2C" }}>{post.author ?? "Camilla Vieira"}</p>
            <p className="text-xs" style={{ color: "#9B9B9B" }}>{formatDate(post.publishedAt)}</p>
          </div>
        </div>
      </header>

      {/* Cover image */}
      {post.coverImageUrl && (
        <div className="px-6 pt-8 max-w-3xl mx-auto">
          <figure>
            <img
              src={post.coverImageUrl}
              alt={post.coverImageAlt ?? post.title}
              className="w-full rounded-lg"
              style={{ maxHeight: "480px", objectFit: "cover" }}
            />
          </figure>
        </div>
      )}

      {/* Content */}
      <article
        className="px-6 pt-8 pb-24 max-w-3xl mx-auto prose prose-lg"
        style={{
          color: "#2C2C2C",
          lineHeight: "1.9",
          fontSize: "1.05rem",
        }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Footer nav */}
      <div className="px-6 pb-24 max-w-3xl mx-auto border-t pt-8" style={{ borderColor: "#E8E0D5" }}>
        <Link href="/blog"
          className="text-sm tracking-widest uppercase hover:opacity-70 transition-opacity"
          style={{ color: "#C9A96E" }}>
          ← Mais textos
        </Link>
      </div>
    </div>
  );
}
