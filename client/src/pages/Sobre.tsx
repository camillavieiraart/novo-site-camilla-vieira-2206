import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BrushCorner } from "@/components/BrushStroke";

const PORTRAIT = "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80&auto=format&fit=crop";

export default function Sobre() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--brand-bege-light)" }}>
      <Navigation />

      {/* Hero */}
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
                Fotógrafa, artista visual e criadora do Ateliê Digital — um espaço onde fotografia e arte se encontram.
              </p>
            </div>
            <div className={`transition-all duration-1000 delay-300 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
              <div className="overflow-hidden" style={{ border: "1px solid rgba(217,204,180,0.2)" }}>
                <img src={PORTRAIT} alt="Camilla Vieira" className="w-full" style={{ filter: "grayscale(20%)" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto */}
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
            {[
              "Acredito que fotografia é arte. Não apenas registro — é presença. É o instante que se recusa a desaparecer.",
              "Cada imagem nasce de um olhar que sente antes de apertar o obturador. Um olhar que percebe a luz não como técnica, mas como linguagem.",
              "Meu trabalho transita entre o ensaio fotográfico e a obra de arte. Entre o retrato que revela e a imagem que questiona. Entre o belo e o verdadeiro.",
              "Na série Fio, a agulha se torna extensão do olhar. A costura sobre a fotografia cria uma nova camada de significado — o visível e o invisível, o que foi capturado e o que ainda está sendo construído.",
              "Sou Criadora, Maga e Sábia. Crio porque preciso. Transformo porque é minha natureza. Compartilho porque acredito que arte só existe no encontro.",
              "Este ateliê digital é um convite. Para olhar com mais cuidado. Para sentir com mais profundidade. Para reconhecer que beleza não é superfície — é essência.",
            ].map((para, i) => (
              <p key={i} className="text-sm sm:text-base prose-body" style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif", lineHeight: "2", maxWidth: "100%" }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Arquétipos */}
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

      {/* Propósito */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: "var(--brand-marrom-deep)" }}>
        <BrushCorner position="bl" color="#F5E6D3" delay={400} />
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center relative z-10">
          <div className={`transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <span className="section-eyebrow block mb-4" style={{ color: "rgba(201,112,100,0.9)" }}>Propósito</span>
            <h2 className="font-serif text-4xl md:text-5xl font-medium mb-8" style={{ color: "var(--brand-bege)" }}>
              Por que faço o que faço
            </h2>
            <p className="text-base leading-loose mb-4" style={{ color: "rgba(245,230,211,0.75)", fontFamily: "'Inter', sans-serif", lineHeight: "2" }}>
              Acredito que toda pessoa merece ser vista com beleza e verdade. Que toda história merece ser contada com arte. Que fotografia não é luxo — é necessidade humana de se reconhecer, de deixar rastro, de dizer: eu estive aqui.
            </p>
            <p className="text-base leading-loose mb-12" style={{ color: "rgba(245,230,211,0.75)", fontFamily: "'Inter', sans-serif", lineHeight: "2" }}>
              Meu propósito é criar imagens que permaneçam. Que sejam olhadas daqui a 20 anos e ainda causem emoção. Que sejam arte, não apenas foto.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/portfolio" className="btn-outline-light">
                Ver Portfólio <ArrowRight size={14} />
              </Link>
              <Link href="/contato" className="btn-outline-light">
                Fale Comigo <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
