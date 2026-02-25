import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, X, MessageCircle } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BrushCorner } from "@/components/BrushStroke";
import { trpc } from "@/lib/trpc";
import { GalleryImage } from "@/components/GalleryImage";

const PLACEHOLDER_ARTWORKS = [
  { id: 1, title: "Fio I — Raízes", slug: "fio-i-raizes", series: "Fio", year: "2023", technique: "Costura sobre fotografia", dimensions: "40 × 50 cm", description: "Linhas de linho natural que atravessam a imagem como raízes invisíveis, conectando o que foi ao que é.", poeticText: "O fio não costura apenas o tecido — ele costura o tempo.", imageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80&auto=format&fit=crop", priceDisplay: "R$ 2.800", isAvailable: true },
  { id: 2, title: "Fio II — Presença", slug: "fio-ii-presenca", series: "Fio", year: "2023", technique: "Costura sobre fotografia", dimensions: "30 × 40 cm", description: "A presença que permanece mesmo quando o corpo já não está. Fios vermelhos sobre pele em preto e branco.", poeticText: "Presença é o que fica depois que tudo passa.", imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80&auto=format&fit=crop", priceDisplay: "R$ 2.400", isAvailable: true },
  { id: 3, title: "Fio III — Memória", slug: "fio-iii-memoria", series: "Fio", year: "2023", technique: "Costura sobre fotografia", dimensions: "50 × 60 cm", description: "Memória como tapeçaria — fragmentos costurados que formam o todo de quem somos.", poeticText: "Somos feitos dos fios que escolhemos guardar.", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop", priceDisplay: "R$ 3.200", isAvailable: false },
  { id: 4, title: "Fio IV — Vínculo", slug: "fio-iv-vinculo", series: "Fio", year: "2023", technique: "Costura sobre fotografia", dimensions: "40 × 50 cm", description: "O vínculo invisível que une dois corpos, duas almas, dois mundos.", poeticText: "Entre dois pontos, um fio. Entre duas almas, amor.", imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80&auto=format&fit=crop", priceDisplay: "R$ 2.800", isAvailable: true },
  { id: 5, title: "Fio V — Silêncio", slug: "fio-v-silencio", series: "Fio", year: "2024", technique: "Costura sobre fotografia", dimensions: "60 × 80 cm", description: "No silêncio entre as palavras, o fio encontra seu caminho.", poeticText: "O silêncio também tem textura.", imageUrl: "https://images.unsplash.com/photo-1509460913899-515f1df34fea?w=800&q=80&auto=format&fit=crop", priceDisplay: "R$ 4.500", isAvailable: true },
  { id: 6, title: "Fio VI — Origem", slug: "fio-vi-origem", series: "Fio", year: "2024", technique: "Costura sobre fotografia", dimensions: "40 × 50 cm", description: "Retorno à origem — o fio que nos conecta ao que sempre fomos.", poeticText: "A origem não é um lugar. É um fio.", imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&q=80&auto=format&fit=crop", priceDisplay: "R$ 2.800", isAvailable: true },
  { id: 7, title: "Fio VII — Corpo", slug: "fio-vii-corpo", series: "Fio", year: "2024", technique: "Costura sobre fotografia", dimensions: "50 × 70 cm", description: "O corpo como mapa — linhas que revelam o que a pele esconde.", poeticText: "Cada cicatriz é um fio que conta uma história.", imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80&auto=format&fit=crop", priceDisplay: "R$ 3.800", isAvailable: true },
  { id: 8, title: "Fio VIII — Tempo", slug: "fio-viii-tempo", series: "Fio", year: "2024", technique: "Costura sobre fotografia", dimensions: "40 × 50 cm", description: "O tempo como tecido — cada momento um ponto, cada vida uma tapeçaria.", poeticText: "O tempo não passa. Ele se acumula.", imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80&auto=format&fit=crop", priceDisplay: "R$ 2.800", isAvailable: false },
  { id: 9, title: "Fio IX — Luz", slug: "fio-ix-luz", series: "Fio", year: "2024", technique: "Costura sobre fotografia", dimensions: "30 × 40 cm", description: "Fios dourados que seguem a luz — onde a fotografia termina, a costura começa.", poeticText: "A luz não ilumina apenas o que está fora.", imageUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80&auto=format&fit=crop", priceDisplay: "R$ 2.200", isAvailable: true },
  { id: 10, title: "Fio X — Infinito", slug: "fio-x-infinito", series: "Fio", year: "2024", technique: "Costura sobre fotografia", dimensions: "60 × 80 cm", description: "O infinito como possibilidade — o fio que nunca termina, a história que continua.", poeticText: "Infinito não é tamanho. É intenção.", imageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80&auto=format&fit=crop", priceDisplay: "R$ 4.800", isAvailable: true },
];

function ArtworkDetail({ slug }: { slug: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);

  const artwork = PLACEHOLDER_ARTWORKS.find(a => a.slug === slug) || PLACEHOLDER_ARTWORKS[0];

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
            {/* Image */}
            <div>
              <div className="overflow-hidden" style={{ border: "1px solid var(--brand-sand)" }}>
                <GalleryImage src={artwork.imageUrl} alt={artwork.title} className="w-full" />
              </div>
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

              <a href={`https://wa.me/5511999999999?text=Ol%C3%A1!%20Tenho%20interesse%20na%20obra%20${encodeURIComponent(artwork.title)}`}
                className="btn-primary w-full justify-center"
                target="_blank" rel="noopener noreferrer">
                <MessageCircle size={14} />
                {artwork.isAvailable ? "Tenho Interesse" : "Entrar em Contato"}
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ObrasGallery() {
  const [visible, setVisible] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const { data: artworksData } = trpc.artworks.getAll.useQuery();
  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);

  const artworks = (artworksData && artworksData.length > 0) ? artworksData : PLACEHOLDER_ARTWORKS;

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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {artworks.map((artwork, i) => (
              <Link key={artwork.id} href={`/obras/${artwork.slug}`}
                className={`group block no-underline artwork-card transition-all duration-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${100 + i * 70}ms` }}>
                <div className="img-hover aspect-square overflow-hidden">
                  <GalleryImage src={artwork.imageUrl} alt={artwork.title} style={{ filter: "sepia(10%)", width: "100%", height: "100%", objectFit: "cover" }} />
                  <div className="img-hover-overlay" />
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-base font-medium mb-1" style={{ color: "var(--brand-marrom-deep)" }}>{artwork.title}</h3>
                  <p className="text-xs mb-2" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                    {artwork.technique} · {artwork.year}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>
                      {artwork.priceDisplay}
                    </span>
                    <span className={`text-xs px-2 py-0.5 ${artwork.isAvailable ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}
                      style={{ fontFamily: "'Inter', sans-serif" }}>
                      {artwork.isAvailable ? "Disponível" : "Vendida"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function Obras() {
  const params = useParams<{ slug?: string }>();
  if (params.slug) return <ArtworkDetail slug={params.slug} />;
  return <ObrasGallery />;
}
