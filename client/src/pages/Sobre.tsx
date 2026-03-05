import { useEffect, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { StructuredData, buildBreadcrumb, CAMILLA_PERSON_SCHEMA } from "@/components/StructuredData";
import { Link } from "wouter";
import { ArrowRight, Star, Send, Phone, Mail, Instagram } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BrushCorner } from "@/components/BrushStroke";
import { GalleryImage } from "@/components/GalleryImage";
import { trpc } from "@/lib/trpc";

// Fallback images (Unsplash) — used only when admin hasn't uploaded photos yet
const PORTRAIT_FALLBACK = "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80&auto=format&fit=crop";
const SECONDARY_FALLBACK = "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&q=80&auto=format&fit=crop";

// ─── Hook: load all site settings into a lookup map ──────────────────────────
function useSettings() {
  const { data: settings } = trpc.settings.getAll.useQuery();
  const s = (key: string, fallback = "") => {
    if (!settings) return fallback;
    return settings.find((x: { key: string; value: string | null }) => x.key === key)?.value || fallback;
  };
  return { s, ready: !!settings };
}

// ─── Testimonials Section ─────────────────────────────────────────────────────
function TestimonialsSection({ visible }: { visible: boolean }) {
  const { data: testimonials, isLoading } = trpc.testimonials.getPublished.useQuery();

  if (isLoading) return null;
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-20 relative overflow-hidden" style={{ backgroundColor: "var(--brand-bege)" }}>
      <BrushCorner position="tl" color="#8B6F47" delay={300} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className={`text-center mb-14 transition-all duration-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <span className="section-eyebrow block mb-4">Depoimentos</span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>
            O que dizem sobre meu trabalho
          </h2>
          <div className="divider-terracota mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className={`p-7 flex flex-col transition-all duration-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{
                transitionDelay: `${300 + i * 120}ms`,
                backgroundColor: "var(--brand-bege-light)",
                border: "1px solid var(--brand-sand)",
              }}
            >
              {t.rating && (
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star
                      key={si}
                      size={14}
                      fill={si < t.rating! ? "var(--brand-terracota)" : "transparent"}
                      style={{ color: "var(--brand-terracota)" }}
                    />
                  ))}
                </div>
              )}
              <p className="text-sm leading-relaxed flex-1 mb-6 italic"
                style={{ color: "var(--brand-marrom)", fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", lineHeight: "1.8" }}>
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                {t.avatarUrl ? (
                  <img src={t.avatarUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover"
                    style={{ border: "1px solid var(--brand-sand)" }} />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
                    style={{ backgroundColor: "var(--brand-sand)", color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>
                    {t.name}
                  </p>
                  {t.role && (
                    <p className="text-xs" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                      {t.role}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Quick Contact Form ───────────────────────────────────────────────────────
function QuickContactSection({ visible }: { visible: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = trpc.contact.send.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setName(""); setEmail(""); setMessage("");
    },
    onError: (err) => {
      setError(err.message || "Erro ao enviar mensagem. Tente novamente.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !message) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    sendMessage.mutate({ name, email, message, subject: "Contato via página Sobre" });
  };

  return (
    <section className="py-20 relative overflow-hidden" style={{ backgroundColor: "var(--brand-marrom-deep)" }}>
      <BrushCorner position="tr" color="#F5E6D3" delay={400} />
      <BrushCorner position="bl" color="#F5E6D3" delay={700} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className={`transition-all duration-1000 delay-200 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <span className="section-eyebrow block mb-4" style={{ color: "rgba(201,112,100,0.9)" }}>Contato Rápido</span>
            <h2 className="font-serif text-4xl md:text-5xl font-medium mb-6" style={{ color: "var(--brand-bege)" }}>
              Vamos conversar?
            </h2>
            <div className="mb-8" style={{ width: "48px", height: "1px", backgroundColor: "rgba(201,112,100,0.6)" }} />
            <p className="text-sm leading-relaxed mb-10" style={{ color: "rgba(245,230,211,0.7)", fontFamily: "'Inter', sans-serif", lineHeight: "1.9" }}>
              Seja para um ensaio fotográfico, uma obra da Série Fio, uma mentoria ou apenas para trocar uma ideia — estou aqui.
            </p>
            <div className="space-y-4">
              {[
                { icon: <Mail size={16} />, label: "contato@camillavieira.art", href: "mailto:contato@camillavieira.art" },
                { icon: <Phone size={16} />, label: "WhatsApp", href: "https://wa.me/5561991087909" },
                { icon: <Instagram size={16} />, label: "@camillavieira.art", href: "https://instagram.com/camillavieira.art" },
              ].map(({ icon, label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm no-underline transition-all duration-200 hover:opacity-80"
                  style={{ color: "rgba(245,230,211,0.65)", fontFamily: "'Inter', sans-serif" }}>
                  <span style={{ color: "var(--brand-terracota)" }}>{icon}</span>
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div className={`transition-all duration-1000 delay-400 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: "rgba(201,112,100,0.15)", border: "1px solid rgba(201,112,100,0.4)" }}>
                  <Send size={22} style={{ color: "var(--brand-terracota)" }} />
                </div>
                <h3 className="font-serif text-2xl font-medium mb-3" style={{ color: "var(--brand-bege)" }}>
                  Mensagem enviada!
                </h3>
                <p className="text-sm" style={{ color: "rgba(245,230,211,0.65)", fontFamily: "'Inter', sans-serif" }}>
                  Obrigada pelo contato. Responderei em breve.
                </p>
                <button onClick={() => setSubmitted(false)}
                  className="mt-6 text-xs tracking-widest uppercase underline cursor-pointer bg-transparent border-none"
                  style={{ color: "rgba(245,230,211,0.5)", fontFamily: "'Inter', sans-serif" }}>
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { id: "name", label: "Nome *", type: "text", value: name, setter: setName, placeholder: "Seu nome" },
                  { id: "email", label: "E-mail *", type: "email", value: email, setter: setEmail, placeholder: "seu@email.com" },
                ].map(({ id, label, type, value, setter, placeholder }) => (
                  <div key={id}>
                    <label htmlFor={id} className="block text-xs tracking-widest uppercase mb-2"
                      style={{ color: "rgba(245,230,211,0.5)", fontFamily: "'Inter', sans-serif" }}>
                      {label}
                    </label>
                    <input id={id} type={type} value={value} onChange={(e) => setter(e.target.value)}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 text-sm outline-none transition-all duration-200"
                      style={{ background: "rgba(245,230,211,0.06)", border: "1px solid rgba(245,230,211,0.15)", color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}
                      onFocus={(e) => { e.target.style.borderColor = "rgba(201,112,100,0.5)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "rgba(245,230,211,0.15)"; }}
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor="msg" className="block text-xs tracking-widest uppercase mb-2"
                    style={{ color: "rgba(245,230,211,0.5)", fontFamily: "'Inter', sans-serif" }}>
                    Mensagem *
                  </label>
                  <textarea id="msg" rows={4} value={message} onChange={(e) => setMessage(e.target.value)}
                    placeholder="Como posso te ajudar?"
                    className="w-full px-4 py-3 text-sm outline-none transition-all duration-200 resize-none"
                    style={{ background: "rgba(245,230,211,0.06)", border: "1px solid rgba(245,230,211,0.15)", color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(201,112,100,0.5)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(245,230,211,0.15)"; }}
                  />
                </div>
                {error && (
                  <p className="text-xs" style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>{error}</p>
                )}
                <button type="submit" disabled={sendMessage.isPending}
                  className="w-full py-3 text-xs tracking-widest uppercase font-medium transition-all duration-200 cursor-pointer border-none"
                  style={{ backgroundColor: "var(--brand-terracota)", color: "var(--brand-bege-light)", fontFamily: "'Inter', sans-serif", opacity: sendMessage.isPending ? 0.7 : 1 }}>
                  {sendMessage.isPending ? "Enviando..." : "Enviar Mensagem"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Sobre() {
  const { s } = useSettings();

  useSEO({
    title: "Sobre Camilla Vieira",
    description: "Conheça Camilla Vieira, fotógrafa artística e artista visual. Sua filosofia: fotografia é arte — não apenas registro, mas presença e linguagem da alma. Criadora da Série Fio e de cerâmica artística.",
    keywords: "sobre Camilla Vieira, fotógrafa artística, artista visual, manifesto, série fio, Brasília",
    canonical: "/sobre",
  });

  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);

  // Schema Person (JSON-LD)
  useEffect(() => {
    const siteUrl = window.location.origin;
    const schema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Camilla Vieira",
      "url": siteUrl,
      "description": "Fotógrafa artística, artista visual e ceramista. Criadora da Série Fio. Baseada em Brasília, Brasil.",
      "jobTitle": "Fotógrafa Artística e Artista Visual",
      "email": "contato@camillavieira.art",
      "telephone": "+55-61-99108-7909",
      "worksFor": { "@type": "Organization", "name": "Camilla Vieira — Ateliê Digital", "url": siteUrl },
      "address": { "@type": "PostalAddress", "addressLocality": "Brasília", "addressRegion": "DF", "addressCountry": "BR" },
      "sameAs": ["https://www.instagram.com/camillavieira.art", "https://camillavieira.art"],
      "knowsAbout": ["Fotografia Artística", "Arte Visual", "Cerâmica", "Bordado", "Mentoria Criativa", "Marca Pessoal"],
    };
    let el = document.getElementById("schema-person");
    if (!el) {
      el = document.createElement("script");
      el.id = "schema-person";
      (el as HTMLScriptElement).type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(schema);
    return () => { document.getElementById("schema-person")?.remove(); };
  }, []);

  // Dynamic values with fallbacks
  const fotoPerfil    = s("sobre_foto_perfil", PORTRAIT_FALLBACK);
  const fotoSecundaria = s("sobre_foto_secundaria", SECONDARY_FALLBACK);
  const heroTitulo    = s("sobre_titulo", "Fotógrafa, artista visual e criadora do Ateliê Digital — um espaço onde fotografia e arte se encontram.");
  const bioP1         = s("sobre_bio_p1", "Comecei a fotografar por necessidade de guardar o que o tempo insiste em levar. A câmera chegou antes da técnica — chegou como extensão do olhar, como forma de dizer o que as palavras não alcançavam.");
  const bioP2         = s("sobre_bio_p2", "Ao longo dos anos, meu trabalho foi se tornando cada vez mais autoral. Os ensaios ganharam alma. A cerâmica entrou como linguagem paralela — a argila como metáfora do que a fotografia não consegue tocar. E então surgiu a série Fio: costura sobre fotografia, o visível e o invisível costurados em uma só imagem.");
  const bioP3         = s("sobre_bio_p3", "Hoje, o Ateliê Digital é o espaço onde tudo se encontra: fotografia, arte, cerâmica e mentoria. Um lugar construído com intenção, para quem acredita que imagem é mais do que registro — é presença.");
  const manifesto1    = s("sobre_manifesto_1", "Acredito que fotografia é arte. Não apenas registro — é presença. É o instante que se recusa a desaparecer.");
  const manifesto2    = s("sobre_manifesto_2", "Cada imagem nasce de um olhar que sente antes de apertar o obturador. Um olhar que percebe a luz não como técnica, mas como linguagem.");
  const manifesto3    = s("sobre_manifesto_3", "Na série Fio, a agulha se torna extensão do olhar. A costura sobre a fotografia cria uma nova camada de significado — o visível e o invisível, o que foi capturado e o que ainda está sendo construído.");
  const ctaText       = s("sobre_cta_text", "Agendar Ensaio");
  const ctaLink       = s("sobre_cta_link", "/contato");

  // Build manifesto paragraphs — only show non-empty ones
  const manifestoParagraphs = [
    manifesto1,
    manifesto2,
    manifesto3,
    "Meu trabalho transita entre o ensaio fotográfico e a obra de arte. Entre o retrato que revela e a imagem que questiona. Entre o belo e o verdadeiro.",
    "Sou Criadora, Maga e Sábia. Crio porque preciso. Transformo porque é minha natureza. Compartilho porque acredito que arte só existe no encontro.",
    "Este ateliê digital é um convite. Para olhar com mais cuidado. Para sentir com mais profundidade. Para reconhecer que beleza não é superfície — é essência.",
  ].filter(Boolean);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--brand-bege-light)" }}>
      <Navigation />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-20 overflow-hidden" style={{ backgroundColor: "var(--brand-marrom-deep)" }}>
        <BrushCorner position="tl" color="#F5E6D3" delay={400} />
        <BrushCorner position="br" color="#F5E6D3" delay={700} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div>
              <span className="section-eyebrow block mb-4" style={{ color: "rgba(201,112,100,0.9)" }}>Sobre</span>
              <h1 className="font-serif text-5xl md:text-6xl font-medium mb-6" style={{ color: "var(--brand-bege)" }}>
                Camilla Vieira
              </h1>
              <div className="mb-6" style={{ width: "48px", height: "1px", backgroundColor: "var(--brand-sand)" }} />
              <p className="font-display text-xl italic leading-relaxed" style={{ color: "rgba(245,230,211,0.8)", fontFamily: "'Cormorant Garamond', serif" }}>
                {heroTitulo}
              </p>
            </div>
            <div className={`transition-all duration-1000 delay-300 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
              <div className="overflow-hidden" style={{ border: "1px solid rgba(217,204,180,0.2)" }}>
                <GalleryImage src={fotoPerfil} alt="Camilla Vieira" className="w-full" style={{ filter: "grayscale(20%)" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOBRE MIM ─────────────────────────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: "var(--brand-bege-light)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {/* Foto secundária */}
            <div className="relative">
              <div className="overflow-hidden" style={{ border: "1px solid var(--brand-sand)", aspectRatio: "4/5" }}>
                <GalleryImage
                  src={fotoSecundaria}
                  alt="Camilla Vieira - Sobre Mim"
                  className="w-full h-full"
                  style={{ objectFit: "cover", filter: "sepia(8%)" }}
                />
              </div>
              <div className="absolute -bottom-4 -right-4 px-5 py-3 hidden sm:block"
                style={{ backgroundColor: "var(--brand-terracota-dark)", color: "var(--brand-bege-light)" }}>
                <span className="text-xs tracking-widest uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>Fotógrafa & Artista</span>
              </div>
            </div>

            {/* Texto da biografia */}
            <div className={`transition-all duration-1000 delay-300 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
              <span className="section-eyebrow block mb-4">Sobre Mim</span>
              <h2 className="font-serif text-4xl md:text-5xl font-medium mb-6" style={{ color: "var(--brand-marrom-deep)" }}>
                Minha Jornada
              </h2>
              <div className="divider-terracota mb-8" />
              <div className="space-y-5">
                {bioP1 && (
                  <p className="text-sm sm:text-base prose-body" style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif", lineHeight: "1.9" }}>
                    {bioP1}
                  </p>
                )}
                {bioP2 && (
                  <p className="text-sm sm:text-base prose-body" style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif", lineHeight: "1.9" }}>
                    {bioP2}
                  </p>
                )}
                {bioP3 && (
                  <p className="text-sm sm:text-base prose-body" style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif", lineHeight: "1.9" }}>
                    {bioP3}
                  </p>
                )}
              </div>
              <div className="mt-10 flex flex-wrap gap-3">
                {["Fotografia Autoral", "Série Fio", "Cerâmica", "Mentorias"].map(tag => (
                  <span key={tag} className="text-xs tracking-widest uppercase px-4 py-2"
                    style={{ border: "1px solid var(--brand-sand)", color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                    {tag}
                  </span>
                ))}
              </div>
              {ctaText && ctaLink && (
                <div className="mt-8">
                  <Link href={ctaLink} className="btn-outline-dark inline-flex items-center gap-2">
                    {ctaText} <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── MANIFESTO ─────────────────────────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: "var(--brand-bege)" }}>
        <BrushCorner position="tr" color="#8B6F47" delay={300} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className={`text-center mb-16 transition-all duration-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <span className="section-eyebrow block mb-4">Manifesto</span>
            <h2 className="font-serif text-4xl md:text-5xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>
              Fotografia é Arte
            </h2>
            <div className="divider-terracota mx-auto mt-6" />
          </div>

          <div className={`space-y-6 transition-all duration-1000 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {manifestoParagraphs.map((para, i) => (
              <p key={i} className="text-sm sm:text-base prose-body"
                style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif", lineHeight: "2", maxWidth: "100%" }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARQUÉTIPOS ────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ backgroundColor: "var(--brand-bege-light)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className={`text-center mb-16 transition-all duration-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <span className="section-eyebrow block mb-4">Arquétipos</span>
            <h2 className="font-serif text-4xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>
              Três Forças que me Movem
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "A Criadora",
                icon: "✦",
                desc: "Cria porque precisa. Transforma matéria em significado. Cada imagem é um ato de criação — não de reprodução.",
              },
              {
                title: "A Maga",
                icon: "◈",
                desc: "Transforma o ordinário em extraordinário. Vê o que outros não veem. A câmera é sua varinha — a luz, sua magia.",
              },
              {
                title: "A Sábia",
                icon: "◎",
                desc: "Compartilha conhecimento com generosidade. Acredita que arte e técnica se ensinam. Mentora porque sabe que o crescimento é coletivo.",
              },
            ].map(({ title, icon, desc }, i) => (
              <div key={title}
                className={`p-8 text-center transition-all duration-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${400 + i * 150}ms`, backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
                <div className="text-3xl mb-4" style={{ color: "var(--brand-terracota)" }}>{icon}</div>
                <h3 className="font-serif text-2xl font-medium mb-4" style={{ color: "var(--brand-marrom-deep)" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <TestimonialsSection visible={visible} />

      {/* ── QUICK CONTACT ─────────────────────────────────────────────────── */}
      <QuickContactSection visible={visible} />

      {/* ── CTA FINAL ─────────────────────────────────────────────────────── */}
      <section className="py-16 relative overflow-hidden" style={{ backgroundColor: "var(--brand-bege-light)" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center relative z-10">
          <div className={`transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <h2 className="font-serif text-3xl md:text-4xl font-medium mb-6" style={{ color: "var(--brand-marrom-deep)" }}>
              Explore o Ateliê
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/portfolio" className="btn-outline-dark">
                Ver Portfólio <ArrowRight size={14} />
              </Link>
              <Link href="/obras" className="btn-outline-dark">
                Obras de Arte <ArrowRight size={14} />
              </Link>
              <Link href="/mentorias" className="btn-outline-dark">
                Mentorias <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <StructuredData schemas={[
        buildBreadcrumb([{ name: "Sobre", url: "/sobre" }]),
        CAMILLA_PERSON_SCHEMA,
      ]} />
      <Footer />
    </div>
  );
}
