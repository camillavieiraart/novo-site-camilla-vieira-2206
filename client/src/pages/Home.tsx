import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ChevronDown, ArrowRight, Play } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { BrushCorner, BrushStroke } from "@/components/BrushStroke";
import { Typewriter, TypewriterLines } from "@/components/Typewriter";
import { Footer } from "@/components/Footer";
import { trpc } from "@/lib/trpc";

// ─── Placeholder images (Unsplash – art/photography theme) ──────────────────
const HERO_BG = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80&auto=format&fit=crop";
const PHOTO1   = "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80&auto=format&fit=crop";
const PHOTO2   = "https://images.unsplash.com/photo-1509460913899-515f1df34fea?w=800&q=80&auto=format&fit=crop";
const PHOTO3   = "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&q=80&auto=format&fit=crop";
const OBRA1    = "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80&auto=format&fit=crop";
const OBRA2    = "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80&auto=format&fit=crop";

// ─── Section 1: Hero ─────────────────────────────────────────────────────────
function HeroSection({ onScrollNext }: { onScrollNext: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 2800);
    const t3 = setTimeout(() => setPhase(3), 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <section className="snap-section relative flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--brand-marrom-deep)" }}>
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img src={HERO_BG} alt="" className="w-full h-full object-cover opacity-30" style={{ filter: "grayscale(60%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(76,48,34,0.5) 0%, rgba(76,48,34,0.75) 100%)" }} />
      </div>

      {/* Brush decorations */}
      <BrushCorner position="tl" color="#F5E6D3" delay={1200} />
      <BrushCorner position="br" color="#F5E6D3" delay={1600} />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* Eyebrow */}
        <div className={`mb-6 transition-all duration-700 ${phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <span className="section-eyebrow" style={{ color: "rgba(245,230,211,0.7)" }}>
            Ateliê Digital
          </span>
        </div>

        {/* Main title – typewriter */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium leading-tight mb-6"
          style={{ color: "var(--brand-bege)" }}>
          {phase >= 1 && (
            <Typewriter
              text="Fotografia é Arte"
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
            Cada imagem carrega alma, intenção e beleza autoral
          </p>
        </div>

        {/* CTA buttons */}
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-[3500ms] ${phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <Link href="/portfolio" className="btn-outline-light">
            Explorar Portfólio <ArrowRight size={14} />
          </Link>
          <Link href="/obras" className="btn-outline-light">
            Obras de Arte <ArrowRight size={14} />
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
function getVideoEmbed(url: string): { type: "native" | "youtube" | "vimeo" | "none"; src: string } {
  if (!url) return { type: "none", src: "" };
  // Native video file (S3 or direct)
  if (url.match(/\.(mp4|webm|mov)$/i)) return { type: "native", src: url };
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/);
  if (ytMatch) return { type: "youtube", src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0` };
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch) return { type: "vimeo", src: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
  // Already an embed URL
  if (url.includes("embed") || url.includes("player")) return { type: "youtube", src: url };
  return { type: "none", src: url };
}

function ManifestoSection({ isActive }: { isActive: boolean }) {
  const { data: settings } = trpc.settings.getAll.useQuery();
  const videoUrl = settings?.find(s => s.key === "manifesto_video_url")?.value || "";
  const video = getVideoEmbed(videoUrl);

  const manifestoLines = [
    "Acredito que fotografia é arte.",
    "Não apenas registro — é presença.",
    "É o instante que se recusa a desaparecer.",
    "Cada imagem nasce de um olhar que sente",
    "antes de apertar o obturador.",
  ];

  return (
    <section className="snap-section relative flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--brand-bege-light)" }}>
      <BrushCorner position="tr" color="#8B6F47" delay={300} />
      <BrushCorner position="bl" color="#8B6F47" delay={600} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
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
                lineClassName="manifesto-line text-2xl md:text-3xl"
              />
            )}
          </div>
          <div className={`divider-terracota mb-6 transition-all duration-1000 delay-[3000ms] ${isActive ? "opacity-100" : "opacity-0"}`} />
          <p className={`text-sm leading-relaxed transition-all duration-1000 delay-[3200ms] ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
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
        <div className={`relative transition-all duration-1000 delay-[800ms] ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
          <div className="relative aspect-[9/16] max-h-[70vh] overflow-hidden"
            style={{ border: "1px solid var(--brand-sand)" }}>
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
              /* Placeholder when no video is set */
              <>
                <img src={PHOTO1} alt="Manifesto Visual" className="w-full h-full object-cover" style={{ filter: "grayscale(40%)" }} />
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
    <section className="snap-section relative overflow-hidden">
      {/* Triptych */}
      <div className="triptych">
        {[
          { src: PHOTO1, label: "Série Fio" },
          { src: PHOTO2, label: "Maternidade" },
          { src: PHOTO3, label: "Autoral" },
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
function EnsaiosSection({ isActive }: { isActive: boolean }) {
  const categories = [
    { label: "Ensaios Femininos", href: "/portfolio/ensaios-femininos", img: PHOTO2, desc: "Retratos que celebram a autenticidade e a beleza feminina." },
    { label: "Gestante", href: "/portfolio/gestante", img: PHOTO3, desc: "Momentos íntimos que capturam a conexão entre mãe e bebê." },
    { label: "Profissional", href: "/portfolio/profissional", img: PHOTO1, desc: "Retratos corporativos e profissionais com olhar artístico e autoral." },
  ];

  return (
    <section className="snap-section relative flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--brand-bege)" }}>
      <BrushCorner position="tl" color="#8B6F47" delay={400} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10">
        <div className={`text-center mb-12 transition-all duration-800 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <span className="section-eyebrow block mb-3">Portfólio</span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>
            Ensaios com Alma
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map(({ label, href, img, desc }, i) => (
            <Link key={href} href={href}
              className={`group block no-underline transition-all duration-800 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${300 + i * 150}ms` }}>
              <div className="img-hover aspect-[3/4] mb-4" style={{ border: "1px solid var(--brand-sand)" }}>
                <img src={img} alt={label} style={{ filter: "grayscale(30%)" }} />
                <div className="img-hover-overlay" />
              </div>
              <h3 className="font-serif text-xl font-medium mb-1" style={{ color: "var(--brand-marrom-deep)" }}>{label}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{desc}</p>
            </Link>
          ))}
        </div>

        <div className={`text-center mt-10 transition-all duration-800 delay-700 ${isActive ? "opacity-100" : "opacity-0"}`}>
          <Link href="/portfolio" className="btn-outline-dark">
            Ver Todo o Portfólio <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Section 5: Obras de Arte ─────────────────────────────────────────────────
function ObrasSection({ isActive }: { isActive: boolean }) {
  return (
    <section className="snap-section relative flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--brand-marrom-deep)" }}>
      <BrushCorner position="tr" color="#F5E6D3" delay={400} />
      <BrushCorner position="bl" color="#F5E6D3" delay={700} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className={`transition-all duration-1000 delay-200 ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <span className="section-eyebrow block mb-4" style={{ color: "rgba(201,112,100,0.9)" }}>Obras de Arte</span>
            <h2 className="font-serif text-4xl md:text-5xl font-medium mb-6" style={{ color: "var(--brand-bege)" }}>
              Série <em>Fio</em>
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(245,230,211,0.7)", fontFamily: "'Inter', sans-serif" }}>
              Costura sobre fotografia. Cada obra da série Fio é uma intervenção artística única: linhas de costura que atravessam a imagem fotográfica, criando uma nova camada de significado.
            </p>
            <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(245,230,211,0.55)", fontFamily: "'Inter', sans-serif" }}>
              A agulha como extensão do olhar. O fio como metáfora da conexão entre o visível e o invisível.
            </p>
            <div className="divider-sand mb-8" style={{ width: "48px", height: "1px", backgroundColor: "var(--brand-sand)" }} />
            <Link href="/obras" className="btn-outline-light">
              Explorar Obras <ArrowRight size={14} />
            </Link>
          </div>

          {/* Images */}
          <div className={`grid grid-cols-2 gap-3 transition-all duration-1000 delay-500 ${isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
            <div className="img-hover aspect-square" style={{ border: "1px solid rgba(217,204,180,0.2)" }}>
              <img src={OBRA1} alt="Série Fio" style={{ filter: "sepia(20%)" }} />
              <div className="img-hover-overlay" />
            </div>
            <div className="img-hover aspect-square mt-8" style={{ border: "1px solid rgba(217,204,180,0.2)" }}>
              <img src={OBRA2} alt="Série Fio" style={{ filter: "sepia(20%)" }} />
              <div className="img-hover-overlay" />
            </div>
            <div className="img-hover aspect-square" style={{ border: "1px solid rgba(217,204,180,0.2)" }}>
              <img src={PHOTO3} alt="Série Fio" style={{ filter: "sepia(20%)" }} />
              <div className="img-hover-overlay" />
            </div>
            <div className="img-hover aspect-square mt-8" style={{ border: "1px solid rgba(217,204,180,0.2)" }}>
              <img src={PHOTO1} alt="Série Fio" style={{ filter: "sepia(20%)" }} />
              <div className="img-hover-overlay" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Track which section is visible
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
      <Navigation transparent />

      {/* Scroll snap container */}
      <div ref={containerRef} className="snap-container">
        <HeroSection onScrollNext={() => scrollToSection(1)} />
        <ManifestoSection isActive={activeSection === 1} />
        <FotografiaSection isActive={activeSection === 2} />
        <EnsaiosSection isActive={activeSection === 3} />
        <ObrasSection isActive={activeSection === 4} />

        {/* Footer section */}
        <section className="snap-section overflow-y-auto" style={{ height: "auto", minHeight: "100dvh" }}>
          <Footer />
        </section>
      </div>

      {/* Section dots navigation */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2.5">
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
