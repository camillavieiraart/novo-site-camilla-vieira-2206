import { useEffect, useRef, useState } from "react";
import AdminFloatingButton from "@/components/AdminFloatingButton";
import { useSEO } from "@/hooks/useSEO";
import { StructuredData, SERIE_FIO_SCHEMA } from "@/components/StructuredData";
import { Link, useParams } from "wouter";
import { ArrowLeft, X, MessageCircle, Headphones, Pause, Play, Package, Truck, Award, CreditCard, ShieldCheck } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { GalleryImage } from "@/components/GalleryImage";

const PLACEHOLDER_ARTWORKS = [
  { id: 1, title: "Fio I — Raízes", slug: "fio-i-raizes", series: "Fio", year: "2023", technique: "Costura sobre fotografia", dimensions: "40 × 50 cm", description: "Linhas de linho natural que atravessam a imagem como raízes invisíveis, conectando o que foi ao que é.", poeticText: "O fio não costura apenas o tecido — ele costura o tempo.", imageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80&auto=format&fit=crop", priceDisplay: "R$ 2.800", isAvailable: true, audioUrl: null, videoUrl: null },
  { id: 2, title: "Fio II — Presença", slug: "fio-ii-presenca", series: "Fio", year: "2023", technique: "Costura sobre fotografia", dimensions: "30 × 40 cm", description: "A presença que permanece mesmo quando o corpo já não está. Fios vermelhos sobre pele em preto e branco.", poeticText: "Presença é o que fica depois que tudo passa.", imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80&auto=format&fit=crop", priceDisplay: "R$ 2.400", isAvailable: true, audioUrl: null, videoUrl: null },
  { id: 3, title: "Fio III — Memória", slug: "fio-iii-memoria", series: "Fio", year: "2023", technique: "Costura sobre fotografia", dimensions: "50 × 60 cm", description: "Memória como tapeçaria — fragmentos costurados que formam o todo de quem somos.", poeticText: "Somos feitos dos fios que escolhemos guardar.", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop", priceDisplay: "R$ 3.200", isAvailable: false, audioUrl: null, videoUrl: null },
  { id: 4, title: "Fio IV — Vínculo", slug: "fio-iv-vinculo", series: "Fio", year: "2023", technique: "Costura sobre fotografia", dimensions: "40 × 50 cm", description: "O vínculo invisível que une dois corpos, duas almas, dois mundos.", poeticText: "Entre dois pontos, um fio. Entre duas almas, amor.", imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80&auto=format&fit=crop", priceDisplay: "R$ 2.800", isAvailable: true, audioUrl: null, videoUrl: null },
  { id: 5, title: "Fio V — Silêncio", slug: "fio-v-silencio", series: "Fio", year: "2024", technique: "Costura sobre fotografia", dimensions: "60 × 80 cm", description: "No silêncio entre as palavras, o fio encontra seu caminho.", poeticText: "O silêncio também tem textura.", imageUrl: "https://images.unsplash.com/photo-1509460913899-515f1df34fea?w=800&q=80&auto=format&fit=crop", priceDisplay: "R$ 4.500", isAvailable: true, audioUrl: null, videoUrl: null },
  { id: 6, title: "Fio VI — Origem", slug: "fio-vi-origem", series: "Fio", year: "2024", technique: "Costura sobre fotografia", dimensions: "40 × 50 cm", description: "Retorno à origem — o fio que nos conecta ao que sempre fomos.", poeticText: "A origem não é um lugar. É um fio.", imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&q=80&auto=format&fit=crop", priceDisplay: "R$ 2.800", isAvailable: true, audioUrl: null, videoUrl: null },
  { id: 7, title: "Fio VII — Corpo", slug: "fio-vii-corpo", series: "Fio", year: "2024", technique: "Costura sobre fotografia", dimensions: "50 × 70 cm", description: "O corpo como mapa — linhas que revelam o que a pele esconde.", poeticText: "Cada cicatriz é um fio que conta uma história.", imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80&auto=format&fit=crop", priceDisplay: "R$ 3.800", isAvailable: true, audioUrl: null, videoUrl: null },
  { id: 8, title: "Fio VIII — Tempo", slug: "fio-viii-tempo", series: "Fio", year: "2024", technique: "Costura sobre fotografia", dimensions: "40 × 50 cm", description: "O tempo como tecido — cada momento um ponto, cada vida uma tapeçaria.", poeticText: "O tempo não passa. Ele se acumula.", imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80&auto=format&fit=crop", priceDisplay: "R$ 2.800", isAvailable: false, audioUrl: null, videoUrl: null },
  { id: 9, title: "Fio IX — Luz", slug: "fio-ix-luz", series: "Fio", year: "2024", technique: "Costura sobre fotografia", dimensions: "30 × 40 cm", description: "Fios dourados que seguem a luz — onde a fotografia termina, a costura começa.", poeticText: "A luz não ilumina apenas o que está fora.", imageUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80&auto=format&fit=crop", priceDisplay: "R$ 2.200", isAvailable: true, audioUrl: null, videoUrl: null },
  { id: 10, title: "Fio X — Infinito", slug: "fio-x-infinito", series: "Fio", year: "2024", technique: "Costura sobre fotografia", dimensions: "60 × 80 cm", description: "O infinito como possibilidade — o fio que nunca termina, a história que continua.", poeticText: "Infinito não é tamanho. É intenção.", imageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80&auto=format&fit=crop", priceDisplay: "R$ 4.800", isAvailable: true, audioUrl: null, videoUrl: null },
];

// ─── Audio Player Component ───────────────────────────────────────────────────
function ArtworkAudioPlayer({ audioUrl, title }: { audioUrl: string; title: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
    setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    audioRef.current.currentTime = pct * duration;
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mt-5 p-5" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
      />
      <div className="flex items-center gap-3 mb-3">
        <Headphones size={14} style={{ color: "var(--brand-terracota)" }} />
        <p className="text-xs tracking-widest uppercase" style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>
          Narração da Artista
        </p>
      </div>
      <p className="text-sm mb-4" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
        Ouça Camilla falar sobre <em>{title}</em>
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all hover:scale-105"
          style={{ backgroundColor: "var(--brand-terracota)", color: "var(--brand-bege-light)" }}
          aria-label={playing ? "Pausar" : "Reproduzir"}>
          {playing ? <Pause size={13} /> : <Play size={13} />}
        </button>
        <div className="flex-1">
          {/* Progress bar */}
          <div
            className="h-1 rounded-full cursor-pointer mb-1"
            style={{ backgroundColor: "var(--brand-sand)" }}
            onClick={handleSeek}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, backgroundColor: "var(--brand-terracota)" }}
            />
          </div>
          <div className="flex justify-between text-xs" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.6 }}>
            <span>{fmt(currentTime)}</span>
            <span>{duration ? fmt(duration) : "--:--"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Artwork Detail ───────────────────────────────────────────────────────────
function ArtworkDetail({ slug }: { slug: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);

  const { data: artworkData } = trpc.artworks.getBySlug.useQuery({ slug });
  const artwork = artworkData || PLACEHOLDER_ARTWORKS.find(a => a.slug === slug) || PLACEHOLDER_ARTWORKS[0];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--brand-bege-light)" }}>
      <Navigation />
      <div className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <Link href="/obras" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase no-underline mb-10 transition-opacity hover:opacity-100 opacity-60"
            style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
            <ArrowLeft size={14} /> Obras de Arte
          </Link>

          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-start transition-all duration-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {/* Image + Audio */}
            <div>
              <div className="overflow-hidden" style={{ border: "1px solid var(--brand-sand)" }}>
                <GalleryImage src={artwork.imageUrl} alt={artwork.title} className="w-full" />
              </div>
              {/* Audio player — shown only when audioUrl exists */}
              {(artwork as any).audioUrl && (
                <ArtworkAudioPlayer audioUrl={(artwork as any).audioUrl} title={artwork.title} />
              )}
            </div>

            {/* Info */}
            <div className="lg:sticky lg:top-24">
              <span className="section-eyebrow block mb-3">Série {artwork.series}</span>
              <h1 className="font-serif text-4xl md:text-5xl font-medium mb-2" style={{ color: "var(--brand-marrom-deep)" }}>
                {artwork.title}
              </h1>
              <div className="divider-terracota mb-6" />

              {artwork.poeticText && (
                <blockquote className="font-display text-xl italic mb-8 pl-4"
                  style={{ color: "var(--brand-marrom)", borderLeft: "2px solid var(--brand-terracota)", fontFamily: "'Cormorant Garamond', serif" }}>
                  "{artwork.poeticText}"
                </blockquote>
              )}

              <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                {artwork.description}
              </p>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-5" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
                {[
                  { label: "Ano", value: artwork.year },
                  { label: "Técnica", value: artwork.technique },
                  { label: "Dimensões", value: artwork.dimensions },
                  { label: "Disponibilidade", value: artwork.isAvailable ? "Disponível" : "Vendida" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>{label}</p>
                    <p className="text-sm font-medium" style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>{value}</p>
                  </div>
                ))}
              </div>

              {artwork.isAvailable && (
                <div className="flex items-center justify-between mb-6">
                  <p className="font-serif text-3xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>{artwork.priceDisplay}</p>
                </div>
              )}
                <a href={`https://wa.me/5561991087909?text=Ol%3%A1!%20Tenho%20interesse%20na%20obra%20${encodeURIComponent(artwork.title)}`}
                className="btn-primary w-full justify-center"
                target="_blank" rel="noopener noreferrer">
                <MessageCircle size={14} />
                {artwork.isAvailable ? "Tenho Interesse" : "Entrar em Contato"}
              </a>
            </div>
          </div>
        </div>
      </div>
      <AdminFloatingButton href="/admin/obras" label="Gerenciar Obras" />
      <Footer />
    </div>
  );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
function ObrasGallery() {
  useSEO({
    title: "Obras de Arte – Série Fio",
    description: "Série Fio de Camilla Vieira: obras de arte que combinam fotografia e costura artesanal. Cada peça é uma intervenção única — linhas que atravessam a imagem fotográfica, criando nova camada de significado.",
    descriptionEn: "Fio Series by Camilla Vieira: artworks combining photography and hand embroidery. Each piece is a unique intervention — threads crossing the photographic image, creating a new layer of meaning.",
    descriptionFr: "Série Fio de Camilla Vieira: œuvres d'art combinant photographie et broderie artisanale. Chaque pièce est une intervention unique — des fils traversant l'image photographique, créant une nouvelle couche de sens.",
    keywords: "série fio, costura sobre fotografia, obras de arte, arte contemporânea, Camilla Vieira, fotografia artística, fine art photography, contemporary art Brazil, art photographique Brésil",
    canonical: "/obras",
    enableHreflang: true,
  });
  const [visible, setVisible] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<{ src: string; alt?: string; caption?: string } | null>(null);
  const { data: artworksData } = trpc.artworks.getAll.useQuery();
  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);

  const artworks = (artworksData && artworksData.length > 0) ? artworksData : PLACEHOLDER_ARTWORKS;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--brand-bege-light)" }}>
      <StructuredData schemas={[SERIE_FIO_SCHEMA]} />
      <Navigation />
      {lightboxSrc && (
        <div className="lightbox-backdrop" onClick={() => setLightboxSrc(null)} role="dialog" aria-modal="true" aria-label={lightboxSrc.alt || "Obra ampliada"}>
          <button className="absolute top-6 right-6 text-white bg-transparent border-none cursor-pointer z-10" onClick={() => setLightboxSrc(null)} aria-label="Fechar">
            <X size={28} />
          </button>
          <figure className="flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <img src={lightboxSrc.src} alt={lightboxSrc.alt || "Obra de arte por Camilla Vieira"} className="lightbox-img" />
            {lightboxSrc.caption && (
              <figcaption className="mt-3 text-center text-xs tracking-widest uppercase max-w-md" style={{ color: "rgba(250,247,242,0.7)", fontFamily: "'Inter', sans-serif" }}>
                {lightboxSrc.caption}
              </figcaption>
            )}
          </figure>
        </div>
      )}

      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          {/* Header */}
          <div className={`mb-16 transition-all duration-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <span className="section-eyebrow block mb-3">Obras de Arte</span>
            <h1 className="font-serif text-5xl md:text-6xl font-medium mb-4" style={{ color: "var(--brand-marrom-deep)" }}>
              Série <em>Fio</em>
            </h1>
            <div className="divider-terracota" />
            <p className="mt-6 text-sm leading-relaxed prose-body" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
              Costura sobre fotografia. Cada obra é uma intervenção artística única: linhas que atravessam a imagem fotográfica, criando uma nova camada de significado. A agulha como extensão do olhar.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 mb-24">
            {artworks.map((artwork, i) => (
              <div key={artwork.id}
                className={`group artwork-card transition-all duration-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${100 + i * 70}ms` }}>
                <Link href={`/obras/${artwork.slug}`} className="block no-underline">
                  <figure className="img-hover aspect-square overflow-hidden" style={{ margin: 0 }}>
                    <GalleryImage
                      src={artwork.imageUrl}
                      alt={`${artwork.title} — ${artwork.technique}, ${artwork.year}. Obra de Camilla Vieira, artista visual em Brasília.`}
                      title={`${artwork.title} — Camilla Vieira`}
                      loading={i < 4 ? "eager" : "lazy"}
                      style={{ filter: "sepia(10%)", width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div className="img-hover-overlay" />
                    <figcaption className="sr-only">{artwork.title}. {artwork.technique}. {artwork.dimensions}. {artwork.year}. {artwork.description}</figcaption>
                  </figure>
                  <div className="p-4 pb-2">
                    <h3 className="font-serif text-base font-medium mb-1" style={{ color: "var(--brand-marrom-deep)" }}>{artwork.title}</h3>
                    <p className="text-xs mb-2" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                      {artwork.technique} · {artwork.year}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium" style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>
                        {artwork.priceDisplay}
                      </span>
                      <div className="flex items-center gap-1">
                        {(artwork as any).audioUrl && (
                          <span title="Narração disponível">
                            <Headphones size={12} style={{ color: "var(--brand-terracota)", opacity: 0.7 }} />
                          </span>
                        )}
                        <span className={`text-xs px-2 py-0.5 ${artwork.isAvailable ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}
                          style={{ fontFamily: "'Inter', sans-serif" }}>
                          {artwork.isAvailable ? "Disponível" : "Vendida"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                {/* CTA Button */}
                <div className="px-4 pb-4">
                  {artwork.isAvailable ? (
                    <a
                      href={`https://wa.me/5561991087909?text=Ol%C3%A1%2C+Camilla!+Tenho+interesse+na+obra+${encodeURIComponent(artwork.title)}+da+S%C3%A9rie+Fio.+Poderia+me+dar+mais+informa%C3%A7%C3%B5es%3F`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2 text-xs tracking-widest uppercase no-underline transition-all hover:opacity-80"
                      style={{ backgroundColor: "var(--brand-terracota)", color: "var(--brand-bege-light)", fontFamily: "'Inter', sans-serif" }}>
                      <MessageCircle size={12} /> Tenho Interesse
                    </a>
                  ) : (
                    <div className="flex items-center justify-center w-full py-2 text-xs tracking-widest uppercase"
                      style={{ backgroundColor: "var(--brand-sand)", color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.6 }}>
                      Obra Vendida
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Como Comprar */}
          <div className={`mb-20 transition-all duration-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <div className="mb-10 text-center">
              <span className="section-eyebrow block mb-3">Colecionismo</span>
              <h2 className="font-serif text-4xl font-medium mb-4" style={{ color: "var(--brand-marrom-deep)" }}>Como Adquirir uma Obra</h2>
              <div className="divider-terracota mx-auto" />
              <p className="mt-6 text-sm leading-relaxed max-w-xl mx-auto" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                Cada obra da Série Fio é única e acompanha certificado de autenticidade assinado pela artista. O processo de aquisição é simples e personalizado.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[
                { icon: MessageCircle, title: "1. Manifeste Interesse", text: "Entre em contato pelo WhatsApp ou formulário. Conversamos sobre a obra, o espaço onde ela vai viver e suas expectativas." },
                { icon: CreditCard, title: "2. Pagamento Facilitado", text: "Parcelamento em até 12x no cartão de crédito, PIX com 5% de desconto ou transferência bancária. Entrada de 50% para confirmar a reserva." },
                { icon: Package, title: "3. Embalagem e Envio", text: "A obra é embalada com proteção especial para transporte. Envio para todo o Brasil via transportadora especializada em arte." },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="p-6 text-center" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(201,112,100,0.1)" }}>
                    <Icon size={18} style={{ color: "var(--brand-terracota)" }} />
                  </div>
                  <h3 className="font-serif text-lg font-medium mb-2" style={{ color: "var(--brand-marrom-deep)" }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{text}</p>
                </div>
              ))}
            </div>

            {/* Garantias */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[
                { icon: Award, label: "Certificado de Autenticidade", desc: "Assinado pela artista" },
                { icon: Truck, label: "Frete para Todo o Brasil", desc: "Embalagem especializada" },
                { icon: ShieldCheck, label: "Garantia de Integridade", desc: "Seguro durante o transporte" },
                { icon: CreditCard, label: "Parcelamento em 12x", desc: "Sem juros no cartão" },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex flex-col items-center text-center p-4" style={{ border: "1px solid var(--brand-sand)" }}>
                  <Icon size={20} className="mb-2" style={{ color: "var(--brand-terracota)" }} />
                  <p className="text-xs font-medium mb-1" style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>{label}</p>
                  <p className="text-xs" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.7 }}>{desc}</p>
                </div>
              ))}
            </div>

            {/* CTA Final */}
            <div className="text-center p-10" style={{ backgroundColor: "var(--brand-marrom-deep)" }}>
              <h3 className="font-serif text-3xl font-medium mb-3" style={{ color: "var(--brand-bege)" }}>Uma obra que fala com você?</h3>
              <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: "rgba(245,230,211,0.7)", fontFamily: "'Inter', sans-serif" }}>
                Cada peça da Série Fio carrega uma história. Se uma obra tocou algo em você, vamos conversar — sem compromisso.
              </p>
              <a
                href="https://wa.me/5561991087909?text=Ol%C3%A1%2C+Camilla!+Gostaria+de+conversar+sobre+as+obras+da+S%C3%A9rie+Fio."
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 text-xs tracking-widest uppercase no-underline transition-all hover:opacity-80"
                style={{ backgroundColor: "var(--brand-terracota)", color: "var(--brand-bege-light)", fontFamily: "'Inter', sans-serif" }}>
                <MessageCircle size={14} /> Fale Comigo sobre Obras
              </a>
            </div>
          </div>
        </div>
      </div>
      <AdminFloatingButton href="/admin/obras" label="Gerenciar Obras" />
      <Footer />
    </div>
  );
}

export default function Obras() {
  const params = useParams<{ slug?: string }>();
  if (params.slug) return <ArtworkDetail slug={params.slug} />;
  return <ObrasGallery />;
}
