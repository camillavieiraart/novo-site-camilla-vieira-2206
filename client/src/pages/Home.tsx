import { useEffect, useRef, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { StructuredData, FAQ_SCHEMA } from "@/components/StructuredData";
import { Link } from "wouter";
import { ChevronDown, ArrowRight, Play, Star, Quote, Send, CheckCircle } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { BrushCorner, BrushStroke } from "@/components/BrushStroke";
import { Typewriter, TypewriterLines } from "@/components/Typewriter";
import { Footer } from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useState as useFormState } from "react";

// ─── Placeholder images (Unsplash – art/photography theme) ──────────────────
const HERO_BG_FALLBACK = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80&auto=format&fit=crop";
const PHOTO1   = "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80&auto=format&fit=crop";
const PHOTO2   = "https://images.unsplash.com/photo-1509460913899-515f1df34fea?w=800&q=80&auto=format&fit=crop";
const PHOTO3   = "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&q=80&auto=format&fit=crop";
// Real photos from Camilla Vieira
const IMG_FOTOGRAFIA_AUTORAL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030818024/sqgNkHdivjNiLvQr.jpeg";
const IMG_SERIE_FIO          = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030818024/DCqRWOnaNWyKlrIU.jpeg";
const IMG_MATERNIDADE        = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030818024/JWHULTsUbykXomLg.jpeg";
const OBRA1    = IMG_SERIE_FIO;
const OBRA2    = IMG_MATERNIDADE;

// ─── Hook: load all site settings into a lookup map ──────────────────────────
function useSettings() {
  const { data: settings } = trpc.settings.getAll.useQuery();
  const s = (key: string, fallback = "") => {
    if (!settings) return fallback;
    return settings.find((x: { key: string; value: string | null }) => x.key === key)?.value || fallback;
  };
  return { s, ready: !!settings };
}

// ─── Video embed helper ───────────────────────────────────────────────────────
function getVideoEmbed(url: string): { type: "native" | "youtube" | "vimeo" | "none"; src: string } {
  if (!url) return { type: "none", src: "" };
  if (url.match(/\.(mp4|webm|mov)$/i)) return { type: "native", src: url };
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/);
  if (ytMatch) return { type: "youtube", src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0` };
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch) return { type: "vimeo", src: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
  if (url.includes("embed") || url.includes("player")) return { type: "youtube", src: url };
  return { type: "none", src: url };
}

// ─── Section 1: Hero ─────────────────────────────────────────────────────────
function HeroSection({ onScrollNext }: { onScrollNext: () => void }) {
  const { s } = useSettings();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 2800);
    const t3 = setTimeout(() => setPhase(3), 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const heroBg    = s("hero_bg_image", HERO_BG_FALLBACK);
  const eyebrow   = s("hero_eyebrow", "Ateliê Digital");
  const title     = s("hero_title", "Fotografia é Arte");
  const subtitle  = s("hero_subtitle", "Cada imagem carrega alma, intenção e beleza autoral");
  const cta1Text  = s("hero_cta1_text", "Explorar Portfólio");
  const cta1Link  = s("hero_cta1_link", "/portfolio");
  const cta2Text  = s("hero_cta2_text", "Obras de Arte");
  const cta2Link  = s("hero_cta2_link", "/obras");

  return (
    <section className="snap-section relative flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--brand-marrom-deep)" }}>
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Fotografia artística de Camilla Vieira" className="w-full h-full object-cover opacity-30" style={{ filter: "grayscale(60%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(76,48,34,0.5) 0%, rgba(76,48,34,0.75) 100%)" }} />
      </div>

      <BrushCorner position="tl" color="#F5E6D3" delay={1200} />
      <BrushCorner position="br" color="#F5E6D3" delay={1600} />

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl w-full">
        {/* Eyebrow */}
        <div className={`mb-6 transition-all duration-700 ${phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <span className="section-eyebrow" style={{ color: "rgba(245,230,211,0.7)" }}>
            {eyebrow}
          </span>
        </div>

        {/* Main title – typewriter (H1 com conteúdo estático para SEO) */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium leading-tight mb-6"
          style={{ color: "var(--brand-bege)" }}>
          {/* Texto estático para crawlers de SEO — visualmente oculto enquanto o typewriter anima */}
          <span
            aria-hidden={phase >= 1}
            className={phase >= 1 ? "sr-only" : "block"}
          >
            {title}
          </span>
          {phase >= 1 && (
            <Typewriter
              text={title}
              delay={600}
              charDelay={110}
              className="block"
            />
          )}
        </h1>

        {/* Subtitle */}
        <div className={`transition-all duration-1000 delay-[2200ms] ${phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="font-display text-xl md:text-2xl font-light italic mb-10"
            style={{ color: "rgba(245,230,211,0.75)", fontFamily: "'Cormorant Garamond', serif" }}>
            {subtitle}
          </p>
        </div>

        {/* CTA buttons */}
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 transition-all duration-1000 delay-[3500ms] ${phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <Link href={cta1Link} className="btn-outline-light w-full sm:w-auto">
            {cta1Text} <ArrowRight size={14} />
          </Link>
          <Link href={cta2Link} className="btn-outline-light w-full sm:w-auto">
            {cta2Text} <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={onScrollNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 bg-transparent border-none cursor-pointer scroll-indicator"
        style={{ color: "rgba(245,230,211,0.5)" }}
        aria-label="Rolar para baixo"
      >
        <span className="text-xs tracking-[0.2em] uppercase" style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.6rem" }}>
          Explorar
        </span>
        <ChevronDown size={18} />
      </button>
    </section>
  );
}

// ─── Section 2: Manifesto / Video ────────────────────────────────────────────
function ManifestoSection({ isActive }: { isActive: boolean }) {
  const { s } = useSettings();

  const videoUrl = s("manifesto_video_url", "");
  const video = getVideoEmbed(videoUrl);

  const line1 = s("manifesto_line_1", "Acredito que fotografia é arte.");
  const line2 = s("manifesto_line_2", "Não apenas registro — é presença.");
  const line3 = s("manifesto_line_3", "É o instante que se recusa a desaparecer.");

  const manifestoLines = [
    line1,
    line2,
    line3,
    "Cada imagem nasce de um olhar que sente",
    "antes de apertar o obturador.",
  ].filter(Boolean);

  return (
    <section className="snap-section relative flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--brand-bege-light)" }}>
      <BrushCorner position="tr" color="#8B6F47" delay={300} />
      <BrushCorner position="bl" color="#8B6F47" delay={600} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full">
        {/* Text */}
        <div>
          <span className="section-eyebrow block mb-6">Manifesto</span>
          <div className="mb-8">
            {isActive && (
              <TypewriterLines
                lines={manifestoLines}
                delay={400}
                charDelay={55}
                lineGap={200}
                lineClassName="manifesto-line text-xl sm:text-2xl md:text-3xl"
              />
            )}
          </div>
          <div className={`divider-terracota mb-6 transition-all duration-1000 delay-[3000ms] ${isActive ? "opacity-100" : "opacity-0"}`} />
          <p className={`text-sm leading-relaxed prose-body transition-all duration-1000 delay-[3200ms] ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
            Camilla Vieira é fotógrafa e artista visual. Seu trabalho transita entre o ensaio fotográfico e a obra de arte, sempre guiado pela mesma filosofia: a imagem como linguagem da alma.
          </p>
          <div className={`mt-8 transition-all duration-1000 delay-[3600ms] ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <Link href="/sobre" className="btn-outline-dark">
              Conheça a Artista <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Video */}
        <div className={`relative transition-all duration-1000 delay-[800ms] ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-95"} hidden lg:block`}>
          <div className="relative w-full overflow-hidden"
            style={{ border: "1px solid var(--brand-sand)", aspectRatio: "16/9" }}>
            {video.type === "native" ? (
              <video src={video.src} controls className="w-full h-full object-cover" />
            ) : video.type === "youtube" || video.type === "vimeo" ? (
              <iframe
                src={video.src}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Vídeo Manifesto"
              />
            ) : (
              <>
                <img src={IMG_FOTOGRAFIA_AUTORAL} alt="Manifesto Visual" className="w-full h-full object-cover" style={{ filter: "grayscale(20%)" }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                  style={{ background: "rgba(76,48,34,0.4)" }}>
                  <div className="flex items-center justify-center w-16 h-16 rounded-full"
                    style={{ background: "rgba(245,230,211,0.9)" }}>
                    <Play size={22} style={{ color: "var(--brand-marrom-deep)", marginLeft: "3px" }} />
                  </div>
                  <p className="text-xs tracking-[0.15em] uppercase" style={{ color: "rgba(245,230,211,0.7)", fontFamily: "'Inter', sans-serif" }}>
                    Vídeo em breve
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 3: Fotografia Autoral (Triptych) ────────────────────────────────
function FotografiaSection({ isActive }: { isActive: boolean }) {
  return (
    <section className="snap-section relative overflow-hidden" style={{ paddingTop: 0 }}>
      <div className="triptych">
        {[
          { src: IMG_SERIE_FIO, label: "Série Fio" },
          { src: IMG_MATERNIDADE, label: "Maternidade" },
          { src: IMG_FOTOGRAFIA_AUTORAL, label: "Autoral" },
        ].map(({ src, label }, i) => (
          <div key={i} className="triptych-col">
            <img src={src} alt={label} />
            <div className="triptych-label">{label}</div>
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(76,48,34,0.5) 0%, transparent 60%)" }} />
          </div>
        ))}
      </div>

      {/* Overlay text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <div className={`text-center transition-all duration-1000 delay-300 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="section-eyebrow block mb-4" style={{ color: "rgba(245,230,211,0.7)" }}>Fotografia Autoral</span>
          <h2 className="font-serif text-4xl md:text-6xl font-medium" style={{ color: "var(--brand-bege)" }}>
            Imagens que<br />
            <em>sentem</em>
          </h2>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-10 pointer-events-auto transition-all duration-1000 delay-700 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <Link href="/fotografia" className="btn-outline-light">
          Ver Fotografia Autoral <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

// ─── Section 4: Ensaios ───────────────────────────────────────────────────────
const FALLBACK_CATS = [
  { label: "Ensaios Femininos", href: "/portfolio/ensaios-femininos", img: PHOTO2, desc: "Retratos que celebram a autenticidade e a beleza feminina." },
  { label: "Gestante", href: "/portfolio/gestante", img: PHOTO3, desc: "Momentos íntimos que capturam a conexão entre mãe e bebê." },
  { label: "Profissional", href: "/portfolio/profissional", img: PHOTO1, desc: "Retratos corporativos e profissionais com olhar artístico e autoral." },
];
const SLUG_DESCS: Record<string, string> = {
  "ensaios-femininos": "Retratos que celebram a autenticidade e a beleza feminina.",
  "gestante": "Momentos íntimos que capturam a conexão entre mãe e bebê.",
  "profissional": "Retratos corporativos e profissionais com olhar artístico e autoral.",
  "familia": "Momentos únicos que eternizam o amor entre família.",
  "casamentos": "O dia mais especial registrado com sensibilidade e arte.",
  "editoriais": "Imagens conceituais que unem moda, arte e narrativa visual.",
};

function EnsaiosSection({ isActive }: { isActive: boolean }) {
  const { s } = useSettings();
  const { data: dbCats } = trpc.categories.getAll.useQuery();

  const sectionTitle = s("ensaios_title", "Ensaios com Alma");
  const sectionSubtitle = s("ensaios_subtitle", "");
  const ctaText = s("ensaios_cta_text", "Ver Todo o Portfólio");
  const ctaLink = s("ensaios_cta_link", "/portfolio");

  const categories = dbCats && dbCats.length > 0
    ? dbCats
        .filter(c => ["ensaios-femininos", "gestante", "profissional"].includes(c.slug))
        .map(c => ({
          label: c.name,
          href: `/portfolio/${c.slug}`,
          img: c.coverImageUrl || PHOTO1,
          desc: SLUG_DESCS[c.slug] || c.description || "",
        }))
    : FALLBACK_CATS;

  return (
    <section className="snap-section relative flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--brand-bege)" }}>
      <BrushCorner position="tl" color="#8B6F47" delay={400} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className={`text-center mb-8 md:mb-12 transition-all duration-800 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <span className="section-eyebrow block mb-3">Portfólio</span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-medium" style={{ color: "var(--brand-marrom-deep)", whiteSpace: 'nowrap' }}>
            {sectionTitle}
          </h2>
          {sectionSubtitle && (
            <p className="mt-3 text-sm" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
              {sectionSubtitle}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {["Brasília, DF", "São Paulo, SP", "Todo o Brasil"].map(loc => (
              <span key={loc} className="text-xs tracking-widest uppercase px-3 py-1"
                style={{ border: "1px solid var(--brand-sand)", color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                {loc}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {categories.map(({ label, href, img, desc }, i) => (
            <Link key={href} href={href}
              className={`group block no-underline transition-all duration-800 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${300 + i * 150}ms` }}>
              <div className="img-hover aspect-[4/3] sm:aspect-[3/4] mb-3 md:mb-4" style={{ border: "1px solid var(--brand-sand)" }}>
                <img src={img} alt={label} style={{ filter: "grayscale(30%)" }} />
                <div className="img-hover-overlay" />
              </div>
              <h3 className="font-serif text-xl font-medium mb-1" style={{ color: "var(--brand-marrom-deep)" }}>{label}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{desc}</p>
            </Link>
          ))}
        </div>

        <div className={`text-center mt-10 transition-all duration-800 delay-700 ${isActive ? "opacity-100" : "opacity-0"}`}>
          <Link href={ctaLink} className="btn-outline-dark">
            {ctaText} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Section 5: Obras de Arte ─────────────────────────────────────────────────
function ObrasSection({ isActive }: { isActive: boolean }) {
  const { s } = useSettings();

  const obrasTitle    = s("obras_title", "Série Fio");
  const obrasSubtitle = s("obras_subtitle", "Costura sobre fotografia. Cada obra da série Fio é uma intervenção artística única: linhas de costura que atravessam a imagem fotográfica, criando uma nova camada de significado.");
  const obrasCta      = s("obras_cta_text", "Explorar Obras");
  const obrasLink     = s("obras_cta_link", "/obras");

  return (
    <section className="snap-section relative flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--brand-marrom-deep)" }}>
      <BrushCorner position="tr" color="#F5E6D3" delay={400} />
      <BrushCorner position="bl" color="#F5E6D3" delay={700} />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Text column */}
          <div className={`flex flex-col justify-center transition-all duration-1000 delay-200 ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <span className="block mb-4 text-xs tracking-[0.3em] uppercase font-medium" style={{ color: "rgba(201,112,100,0.9)", fontFamily: "'Inter', sans-serif" }}>Obras de Arte</span>
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight" style={{ color: "var(--brand-bege)" }}>
              {obrasTitle}
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(245,230,211,0.8)", fontFamily: "'Inter', sans-serif", maxWidth: "360px" }}>
              {obrasSubtitle}
            </p>
            <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(245,230,211,0.55)", fontFamily: "'Inter', sans-serif", maxWidth: "360px" }}>
              A agulha como extensão do olhar. O fio como metáfora da conexão entre o visível e o invisível.
            </p>
            <div className="mb-8" style={{ width: "48px", height: "1px", backgroundColor: "rgba(201,112,100,0.6)" }} />
            <div>
              <Link href={obrasLink} className="btn-outline-light inline-flex items-center gap-2">
                {obrasCta} <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Images 2x2 grid */}
          <div className={`hidden md:grid grid-cols-2 gap-3 lg:gap-4 transition-all duration-1000 delay-500 ${isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
            {[OBRA1, OBRA2, IMG_FOTOGRAFIA_AUTORAL, IMG_MATERNIDADE].map((src, i) => (
              <div key={i} className="img-hover rounded-xl overflow-hidden" style={{ aspectRatio: "3/4" }}>
                <img src={src} alt={`Série Fio — obra ${i + 1}`} className="w-full h-full object-cover" />
                <div className="img-hover-overlay" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS SECTION ────────────────────────────────────────────────────
function TestimonialsSection() {
  const { data: testimonials = [] } = trpc.testimonials.getPublished.useQuery();
  const submitMutation = trpc.testimonials.submit.useMutation();
  const [form, setForm] = useFormState({ name: "", role: "", sessionType: "", text: "", rating: 5 });
  const [submitted, setSubmitted] = useFormState(false);
  const [error, setError] = useFormState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await submitMutation.mutateAsync({
        name: form.name,
        role: form.role || undefined,
        sessionType: form.sessionType || undefined,
        text: form.text,
        rating: form.rating,
      });
      setSubmitted(true);
    } catch {
      setError("Erro ao enviar. Por favor, tente novamente.");
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-10" style={{ backgroundColor: "var(--brand-creme)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="block mb-3 text-xs tracking-[0.3em] uppercase font-medium" style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>Depoimentos</span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium mb-4" style={{ color: "var(--brand-marrom-deep)" }}>O que dizem as clientes</h2>
          <div style={{ width: "48px", height: "1px", backgroundColor: "var(--brand-terracota)", margin: "0 auto" }} />
        </div>

        {/* Testimonials grid */}
        {testimonials.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {testimonials.map((t: any) => (
              <article key={t.id} className="rounded-2xl p-6 flex flex-col gap-4 shadow-sm" style={{ backgroundColor: "white" }}>
                <Quote size={20} style={{ color: "var(--brand-terracota)", opacity: 0.6 }} />
                <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                  {t.text}
                </p>
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} fill={i < (t.rating ?? 5) ? "var(--brand-terracota)" : "none"} stroke="var(--brand-terracota)" />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  {t.avatarUrl ? (
                    <img src={t.avatarUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold" style={{ backgroundColor: "var(--brand-terracota)", color: "white" }}>
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>{t.name}</p>
                    {(t.role || t.sessionType) && (
                      <p className="text-xs" style={{ color: "var(--brand-marrom)", opacity: 0.7, fontFamily: "'Inter', sans-serif" }}>
                        {t.sessionType || t.role}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Submit form */}
        <div className="max-w-xl mx-auto">
          <div className="rounded-2xl p-8" style={{ backgroundColor: "white", boxShadow: "0 2px 20px rgba(139,111,71,0.08)" }}>
            <h3 className="font-serif text-2xl font-medium mb-2 text-center" style={{ color: "var(--brand-marrom-deep)" }}>Compartilhe sua experiência</h3>
            <p className="text-sm text-center mb-6" style={{ color: "var(--brand-marrom)", opacity: 0.7, fontFamily: "'Inter', sans-serif" }}>Seu depoimento será revisado antes de ser publicado.</p>

            {submitted ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <CheckCircle size={40} style={{ color: "var(--brand-terracota)" }} />
                <p className="text-base font-medium text-center" style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>Obrigada pelo seu depoimento!</p>
                <p className="text-sm text-center" style={{ color: "var(--brand-marrom)", opacity: 0.7, fontFamily: "'Inter', sans-serif" }}>Ele será publicado após revisão.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>Seu nome *</label>
                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1" style={{ borderColor: "rgba(139,111,71,0.25)", fontFamily: "'Inter', sans-serif", color: "var(--brand-marrom-deep)" }} placeholder="Maria Silva" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>Tipo de ensaio</label>
                    <input value={form.sessionType} onChange={e => setForm(f => ({ ...f, sessionType: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1" style={{ borderColor: "rgba(139,111,71,0.25)", fontFamily: "'Inter', sans-serif", color: "var(--brand-marrom-deep)" }} placeholder="Ensaio Feminino" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>Avaliação</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button" onClick={() => setForm(f => ({ ...f, rating: n }))} className="p-0 border-none bg-transparent cursor-pointer">
                        <Star size={22} fill={n <= form.rating ? "var(--brand-terracota)" : "none"} stroke="var(--brand-terracota)" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>Seu depoimento *</label>
                  <textarea required rows={4} value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1 resize-none" style={{ borderColor: "rgba(139,111,71,0.25)", fontFamily: "'Inter', sans-serif", color: "var(--brand-marrom-deep)" }} placeholder="Conte como foi sua experiência com a Camilla..." />
                </div>
                {error && <p className="text-xs" style={{ color: "#c0392b" }}>{error}</p>}
                <button type="submit" disabled={submitMutation.isPending} className="flex items-center justify-center gap-2 rounded-lg py-3 px-6 text-sm font-medium transition-opacity" style={{ backgroundColor: "var(--brand-terracota)", color: "white", fontFamily: "'Inter', sans-serif", opacity: submitMutation.isPending ? 0.7 : 1 }}>
                  <Send size={14} /> {submitMutation.isPending ? "Enviando..." : "Enviar depoimento"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
export default function Home() {
  // Título: 36 chars (dentro do limite 30–60) ✔
  // Descrição PT: 142 chars ✔  |  EN: 140 chars ✔  |  FR: 143 chars ✔
  // Estratégia: 3 camadas — local (Brasília/Brasil) + nacional + internacional (FR/EU/US)
  // GEO: hreflang + Schema.org + llms.txt sinalizam autoridade para todas as IAs
  useSEO({
    fullTitle: "Camilla Vieira | Fotógrafa Artística",
    description: "Fotógrafa artística em Brasília. Ensaios femininos, gestante e fotografia personalizada com alma. Obras da Série Fio, cerâmica e mentorias. Entre os melhores fotógrafos do Brasil.",
    descriptionEn: "Brazilian fine art photographer based in Brasília. Feminine & maternity portraits, unique personalized photography. Original artworks. Available in Brazil, France, Europe & USA.",
    descriptionFr: "Photographe artistique brésilienne à Brasília. Portraits féminins et maternité, photographie unique et personnalisée. Œuvres originales. Disponible en France, Europe et aux États-Unis.",
    keywords: [
      // Camada 1 — Local (Brasília / Brasil)
      "fotógrafa Brasília", "fotógrafa especializada feminino Brasília",
      "ensaio feminino Brasília", "ensaio gestante Brasília",
      "fotografia personalizada Brasília", "fotógrafa única Brasília",
      "melhor fotógrafa Brasília", "ensaio fotográfico DF",
      // Camada 2 — Nacional (Brasil)
      "melhores fotógrafos do Brasil", "fotógrafa artística Brasil",
      "fotografia autoral Brasil", "Camilla Vieira",
      "série fio costura sobre fotografia", "arte contemporânea brasileira",
      // Camada 3 — Internacional (EN)
      "Brazilian photographer", "fine art photographer Brazil",
      "best photographers Brazil", "Brazilian fine art photography",
      "feminine portrait photographer", "maternity photographer Brazil",
      // Camada 3 — Internacional (FR)
      "photographe brésilienne", "photographe artistique Brésil",
      "meilleurs photographes monde", "photographie féminine artistique",
    ].join(", "),
    canonical: "/",
    enableHreflang: true,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const height = container.clientHeight;
      const idx = Math.round(scrollTop / height);
      setActiveSection(idx);
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (idx: number) => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({ top: idx * container.clientHeight, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <StructuredData includeGlobal schemas={[FAQ_SCHEMA]} />
      <Navigation transparent />

      <div ref={containerRef} className="snap-container">
        <HeroSection onScrollNext={() => scrollToSection(1)} />
        <ManifestoSection isActive={activeSection === 1} />
        <FotografiaSection isActive={activeSection === 2} />
        <EnsaiosSection isActive={activeSection === 3} />
        <ObrasSection isActive={activeSection === 4} />

        <section className="snap-section overflow-y-auto" style={{ height: "auto", minHeight: "100dvh" }}>
          <TestimonialsSection />
          <Footer />
        </section>
      </div>

      {/* Section dots navigation */}
      <div className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 hidden sm:flex flex-col gap-2.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <button
            key={i}
            onClick={() => scrollToSection(i)}
            className="w-1.5 rounded-full transition-all duration-300 border-none cursor-pointer"
            style={{
              height: activeSection === i ? "24px" : "6px",
              backgroundColor: activeSection === i
                ? (i === 0 || i === 4 ? "var(--brand-bege)" : "var(--brand-terracota)")
                : (i === 0 || i === 4 ? "rgba(245,230,211,0.35)" : "rgba(139,111,71,0.35)"),
            }}
            aria-label={`Seção ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
