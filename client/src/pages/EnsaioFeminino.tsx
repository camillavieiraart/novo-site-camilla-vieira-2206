import { useState, useEffect } from "react";
import { useSEO } from "@/hooks/useSEO";
import { StructuredData, buildBreadcrumb, BASE_URL } from "@/components/StructuredData";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Link } from "wouter";
import { ArrowRight, Clock, Camera, Package, Heart, Star, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const GALLERY_IMGS = [
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509460913899-515f1df34fea?w=800&q=80&auto=format&fit=crop",
];

const PACOTES = [
  {
    id: "essencial",
    nome: "Essencial",
    preco: "R$ 790",
    destaque: false,
    duracao: "1h30",
    locacao: "1 locação",
    fotos: "25 fotos editadas",
    entrega: "15 dias úteis",
    extras: ["Álbum digital em alta resolução", "Galeria online privada por 30 dias"],
  },
  {
    id: "completo",
    nome: "Completo",
    preco: "R$ 1.290",
    destaque: true,
    duracao: "2h30",
    locacao: "2 locações",
    fotos: "50 fotos editadas",
    entrega: "15 dias úteis",
    extras: ["Álbum digital em alta resolução", "Galeria online privada por 60 dias", "10 fotos impressas 15×21cm", "Mini álbum impresso"],
  },
  {
    id: "imersao",
    nome: "Imersão",
    preco: "R$ 1.990",
    destaque: false,
    duracao: "Dia completo",
    locacao: "Locações ilimitadas",
    fotos: "80+ fotos editadas",
    entrega: "20 dias úteis",
    extras: ["Álbum digital em alta resolução", "Galeria online privada por 90 dias", "20 fotos impressas 20×30cm", "Álbum impresso capa dura 30×30cm", "Vídeo slideshow com música"],
  },
];

const FAQS = [
  {
    q: "Preciso ter experiência com fotos para fazer um ensaio feminino?",
    a: "Não. A maioria das minhas clientes nunca fez um ensaio antes e chega com muito nervosismo. Parte do meu trabalho é criar um ambiente seguro e acolhedor onde você esquece a câmera e simplesmente existe. A direção é suave e intuitiva.",
  },
  {
    q: "O que devo usar no ensaio?",
    a: "Após confirmar o agendamento, você recebe um guia completo de estilo com sugestões de roupas, cores e acessórios alinhados ao seu estilo e à proposta do ensaio. Não precisa comprar nada novo — trabalhamos com o que você já tem e ama.",
  },
  {
    q: "Posso fazer o ensaio em casa?",
    a: "Sim! Ensaios em casa têm uma intimidade e autenticidade únicas. Também trabalho com estúdio, locações externas (parques, jardins, áreas urbanas) e espaços alugados. Definimos juntas o ambiente que mais combina com você.",
  },
  {
    q: "Como funciona a entrega das fotos?",
    a: "As fotos são entregues em galeria online privada e protegida por senha, em alta resolução, prontas para impressão. O prazo é de 15 dias úteis após o ensaio. Você escolhe as favoritas para impressão (nos pacotes que incluem).",
  },
  {
    q: "Qual é a política de remarcação?",
    a: "Você pode remarcar o ensaio com até 48h de antecedência sem custo adicional. Em caso de imprevistos ou condições climáticas adversas, a remarcação é gratuita independente do prazo.",
  },
  {
    q: "Onde são realizados os ensaios?",
    a: "Atendo em Brasília com locações internas (estúdio, residências, espaços alugados) e externas (parques, jardins, áreas urbanas). Também viajo para São Paulo mensalmente e para outros estados mediante consulta.",
  },
];

const DEPOIMENTOS = [
  {
    texto: "Eu nunca me senti tão eu mesma na frente de uma câmera. A Camilla tem um jeito de te fazer esquecer que está sendo fotografada. As fotos ficaram além do que eu imaginava.",
    nome: "Mariana S.",
    cidade: "Brasília",
  },
  {
    texto: "Foi a primeira vez que eu olhei para fotos minhas e pensei: 'essa sou eu de verdade'. Não uma versão editada, não uma pose — eu. Recomendo de olhos fechados.",
    nome: "Fernanda L.",
    cidade: "São Paulo",
  },
  {
    texto: "O processo todo foi muito acolhedor. Desde a conversa inicial até a entrega. As fotos contam uma história que eu não sabia que tinha para contar.",
    nome: "Juliana M.",
    cidade: "Brasília",
  },
];

export default function EnsaioFeminino() {
  useSEO({
    title: "Ensaio Feminino em Brasília — Camilla Vieira Fotografia",
    description: "Ensaio feminino artístico em Brasília com Camilla Vieira. Retratos que celebram a autenticidade e a beleza feminina com olhar sensível e autoral. Pacotes a partir de R$ 790.",
    keywords: "ensaio feminino Brasília, fotografia feminina, retrato feminino, fotógrafa feminina Brasília, Camilla Vieira",
    canonical: "/ensaio-feminino",
  });

  const [visible, setVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const sendContact = trpc.contact.send.useMutation({
    onSuccess: () => { setSent(true); setSending(false); },
    onError: () => { toast.error("Erro ao enviar. Tente novamente."); setSending(false); },
  });

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Preencha nome, e-mail e telefone.");
      return;
    }
    setSending(true);
    sendContact.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: "Ensaio Feminino",
      message: `[ENSAIO FEMININO]\n\n${formData.message || "Interesse em ensaio feminino."}`,
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--brand-bege-light)" }}>
      <Navigation />

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-end pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1600&q=85&auto=format&fit=crop"
            alt="Ensaio feminino artístico"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.5)" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(44,28,18,0.88) 0%, rgba(44,28,18,0.2) 60%, transparent 100%)" }} />
        </div>
        <div className={`relative z-10 max-w-5xl mx-auto px-6 lg:px-10 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="block text-xs tracking-[0.25em] uppercase mb-4" style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>
            Retratos Femininos
          </span>
          <h1 className="font-serif text-5xl md:text-7xl font-medium leading-tight mb-6" style={{ color: "var(--brand-bege)" }}>
            Ensaio Feminino
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-xl mb-10" style={{ color: "rgba(245,235,220,0.85)", fontFamily: "'Inter', sans-serif" }}>
            Não é sobre parecer bonita. É sobre ser vista — de verdade. Um espaço seguro para você se encontrar, se reconhecer e se surpreender com quem você já é.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#agendar"
              className="inline-flex items-center gap-2 px-8 py-4 text-sm tracking-widest uppercase font-medium transition-all duration-300 hover:opacity-90"
              style={{ backgroundColor: "var(--brand-terracota)", color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
              Agendar Consulta <ArrowRight size={16} />
            </a>
            <a href="#pacotes"
              className="inline-flex items-center gap-2 px-8 py-4 text-sm tracking-widest uppercase font-medium transition-all duration-300"
              style={{ border: "1px solid rgba(245,235,220,0.5)", color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
              Ver Pacotes
            </a>
          </div>
        </div>
      </section>

      {/* ── PARA QUEM É ── */}
      <section className="py-24" style={{ backgroundColor: "var(--brand-bege-light)" }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="grid grid-cols-2 gap-3">
              {GALLERY_IMGS.slice(0, 4).map((src, i) => (
                <div key={i} className="overflow-hidden" style={{ aspectRatio: i % 3 === 0 ? "3/4" : "4/5", border: "1px solid var(--brand-sand)" }}>
                  <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" style={{ filter: "grayscale(15%)" }} />
                </div>
              ))}
            </div>
            <div>
              <span className="section-eyebrow block mb-4">Para quem é</span>
              <h2 className="font-serif text-4xl md:text-5xl font-medium mb-6" style={{ color: "var(--brand-marrom-deep)" }}>
                Para a mulher que quer se ver com outros olhos.
              </h2>
              <div className="divider-terracota mb-6" />
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                Para quem nunca se sentiu fotogênica. Para quem está em transição — de fase, de corpo, de vida. Para quem quer celebrar quem se tornou. Para quem simplesmente quer ter fotos que a representem de verdade.
              </p>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                O ensaio feminino não é um serviço de vaidade. É um ato de presença. De parar e dizer: eu mereço ser vista. Eu mereço ter registros de quem eu sou agora.
              </p>
              <div className="space-y-3">
                {[
                  "Aniversários e marcos de vida",
                  "Autoconhecimento e reconexão com o corpo",
                  "Presente para si mesma (ou para alguém especial)",
                  "Fotos profissionais com alma e autenticidade",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Sparkles size={14} style={{ color: "var(--brand-terracota)", flexShrink: 0 }} />
                    <span className="text-sm" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESSO ── */}
      <section className="py-24" style={{ backgroundColor: "var(--brand-sand)" }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <span className="section-eyebrow block mb-3">Como funciona</span>
            <h2 className="font-serif text-4xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>Do primeiro contato às fotos nas mãos</h2>
            <div className="divider-terracota mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: "01", icon: <Heart size={24} />, titulo: "Consulta inicial", desc: "Conversa por vídeo ou WhatsApp para entender sua história, estilo e o que você quer sentir no ensaio. Sem compromisso." },
              { num: "02", icon: <Sparkles size={24} />, titulo: "Planejamento", desc: "Definimos locação, figurino, paleta de cores e a intenção emocional do ensaio. Você recebe um guia completo de estilo." },
              { num: "03", icon: <Camera size={24} />, titulo: "O ensaio", desc: "Um encontro com leveza, música e direção suave. Você esquece a câmera. Eu capturo quem você é." },
              { num: "04", icon: <Package size={24} />, titulo: "Entrega", desc: "Galeria online privada com todas as fotos editadas em alta resolução, prontas para impressão e para guardar para sempre." },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "var(--brand-terracota)", color: "var(--brand-bege)" }}>
                  {step.icon}
                </div>
                <span className="block text-xs tracking-widest mb-2" style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>{step.num}</span>
                <h3 className="font-serif text-lg font-medium mb-3" style={{ color: "var(--brand-marrom-deep)" }}>{step.titulo}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DETALHES PRÁTICOS ── */}
      <section className="py-16" style={{ backgroundColor: "var(--brand-bege-light)" }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Clock size={20} />, titulo: "Duração", desc: "De 1h30 a dia completo, dependendo do pacote. Sem pressa — o ritmo é o seu." },
              { icon: <Camera size={20} />, titulo: "Locação", desc: "Brasília (estúdio, externo, residência). São Paulo mensalmente. Outros estados sob consulta." },
              { icon: <Package size={20} />, titulo: "Entrega", desc: "Galeria digital privada em alta resolução + fotos impressas (conforme pacote). Prazo: 15 dias úteis." },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-6" style={{ border: "1px solid var(--brand-sand)" }}>
                <div className="flex-shrink-0 mt-1" style={{ color: "var(--brand-terracota)" }}>{item.icon}</div>
                <div>
                  <h3 className="font-serif text-base font-medium mb-2" style={{ color: "var(--brand-marrom-deep)" }}>{item.titulo}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PACOTES ── */}
      <section id="pacotes" className="py-24" style={{ backgroundColor: "var(--brand-marrom-deep)" }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <span className="block text-xs tracking-[0.25em] uppercase mb-3" style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>Investimento</span>
            <h2 className="font-serif text-4xl font-medium mb-4" style={{ color: "var(--brand-bege)" }}>Escolha seu pacote</h2>
            <p className="text-sm" style={{ color: "rgba(245,235,220,0.7)", fontFamily: "'Inter', sans-serif" }}>
              Todos os pacotes incluem consulta inicial gratuita e guia de estilo personalizado.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PACOTES.map((p) => (
              <div key={p.id}
                className="relative flex flex-col p-8 transition-transform duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: p.destaque ? "var(--brand-terracota)" : "rgba(255,255,255,0.05)",
                  border: p.destaque ? "none" : "1px solid rgba(245,235,220,0.15)",
                }}>
                {p.destaque && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs tracking-widest uppercase px-4 py-1"
                    style={{ backgroundColor: "var(--brand-bege)", color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>
                    Mais escolhido
                  </span>
                )}
                <h3 className="font-serif text-2xl font-medium mb-1" style={{ color: "var(--brand-bege)" }}>{p.nome}</h3>
                <p className="font-serif text-4xl font-medium mb-6" style={{ color: p.destaque ? "var(--brand-bege)" : "var(--brand-terracota)" }}>{p.preco}</p>
                <div className="space-y-2 mb-6 flex-1">
                  {[
                    `⏱ ${p.duracao}`,
                    `📍 ${p.locacao}`,
                    `📷 ${p.fotos}`,
                    `📦 Entrega em ${p.entrega}`,
                    ...p.extras.map(e => `✓ ${e}`),
                  ].map((item, i) => (
                    <p key={i} className="text-xs leading-relaxed" style={{ color: p.destaque ? "rgba(255,255,255,0.9)" : "rgba(245,235,220,0.7)", fontFamily: "'Inter', sans-serif" }}>
                      {item}
                    </p>
                  ))}
                </div>
                <a href="#agendar"
                  className="block text-center py-3 text-xs tracking-widest uppercase font-medium transition-all duration-300"
                  style={{
                    backgroundColor: p.destaque ? "var(--brand-bege)" : "transparent",
                    color: p.destaque ? "var(--brand-marrom-deep)" : "var(--brand-bege)",
                    border: p.destaque ? "none" : "1px solid rgba(245,235,220,0.4)",
                    fontFamily: "'Inter', sans-serif",
                  }}>
                  Quero este pacote
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-xs mt-8" style={{ color: "rgba(245,235,220,0.5)", fontFamily: "'Inter', sans-serif" }}>
            Parcelamento em até 6× sem juros no cartão. Pacotes personalizados sob consulta.
          </p>
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section className="py-24" style={{ backgroundColor: "var(--brand-bege-light)" }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <span className="section-eyebrow block mb-3">O que dizem</span>
            <h2 className="font-serif text-4xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>Histórias reais</h2>
            <div className="divider-terracota mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {DEPOIMENTOS.map((d, i) => (
              <div key={i} className="p-8" style={{ backgroundColor: "var(--brand-sand)" }}>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={14} fill="var(--brand-terracota)" style={{ color: "var(--brand-terracota)" }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-6 italic" style={{ color: "var(--brand-marrom)", fontFamily: "'Cormorant Garamond', serif" }}>
                  "{d.texto}"
                </p>
                <div>
                  <p className="font-serif text-base font-medium" style={{ color: "var(--brand-marrom-deep)" }}>{d.nome}</p>
                  <p className="text-xs" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.7 }}>{d.cidade}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24" style={{ backgroundColor: "var(--brand-sand)" }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <span className="section-eyebrow block mb-3">Dúvidas frequentes</span>
            <h2 className="font-serif text-4xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>Perguntas e respostas</h2>
            <div className="divider-terracota mx-auto mt-4" />
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} style={{ border: "1px solid rgba(44,28,18,0.15)", backgroundColor: "var(--brand-bege-light)" }}>
                <button
                  className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-serif text-base font-medium pr-4" style={{ color: "var(--brand-marrom-deep)" }}>{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={18} style={{ color: "var(--brand-terracota)", flexShrink: 0 }} /> : <ChevronDown size={18} style={{ color: "var(--brand-terracota)", flexShrink: 0 }} />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm leading-relaxed" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORMULÁRIO DE AGENDAMENTO ── */}
      <section id="agendar" className="py-24" style={{ backgroundColor: "var(--brand-bege-light)" }}>
        <div className="max-w-2xl mx-auto px-6 lg:px-10">
          {sent ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "var(--brand-terracota)" }}>
                <Heart size={28} style={{ color: "var(--brand-bege)" }} />
              </div>
              <h2 className="font-serif text-3xl font-medium mb-4" style={{ color: "var(--brand-marrom-deep)" }}>Mensagem recebida!</h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                Camilla entrará em contato em até 24 horas para agendar sua consulta inicial gratuita.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <span className="section-eyebrow block mb-3">Próximo passo</span>
                <h2 className="font-serif text-4xl font-medium mb-4" style={{ color: "var(--brand-marrom-deep)" }}>Agende sua consulta gratuita</h2>
                <p className="text-sm leading-relaxed" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                  Uma conversa de 20 minutos para entender sua história e ver se temos conexão. Sem compromisso.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>Nome *</label>
                  <input
                    type="text" required
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-3 text-sm bg-transparent outline-none transition-colors"
                    style={{ border: "1px solid var(--brand-marrom)", color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>E-mail *</label>
                  <input
                    type="email" required
                    value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-4 py-3 text-sm bg-transparent outline-none"
                    style={{ border: "1px solid var(--brand-marrom)", color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>WhatsApp *</label>
                  <input
                    type="tel" required
                    value={formData.phone}
                    onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-4 py-3 text-sm bg-transparent outline-none"
                    style={{ border: "1px solid var(--brand-marrom)", color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}
                    placeholder="(61) 9 0000-0000"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>O que você está buscando? (opcional)</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                    className="w-full px-4 py-3 text-sm bg-transparent outline-none resize-none"
                    style={{ border: "1px solid var(--brand-marrom)", color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}
                    placeholder="Aniversário, presente para mim mesma, fotos profissionais, simplesmente quero me ver diferente..."
                  />
                </div>
                <button
                  type="submit" disabled={sending}
                  className="w-full py-4 text-sm tracking-widest uppercase font-medium transition-all duration-300 hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: "var(--brand-terracota)", color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
                  {sending ? "Enviando..." : "Agendar consulta gratuita →"}
                </button>
                <p className="text-center text-xs" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.6 }}>
                  Seus dados são protegidos conforme a LGPD. Nenhum spam, nunca.
                </p>
              </form>
            </>
          )}
        </div>
      </section>

      {/* ── LINK PARA PORTFÓLIO ── */}
      <section className="py-16" style={{ backgroundColor: "var(--brand-sand)" }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center">
          <p className="text-sm mb-4" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>Quer ver exemplos antes de decidir?</p>
          <Link href="/portfolio/ensaios-femininos"
            className="inline-flex items-center gap-2 text-sm tracking-widest uppercase no-underline transition-opacity hover:opacity-70"
            style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>
            Ver portfólio de ensaios femininos <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <StructuredData schemas={[
        buildBreadcrumb([
          { name: "Portfólio", url: "/portfolio" },
          { name: "Ensaio Feminino", url: "/ensaio-feminino" },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Ensaio Feminino — Camilla Vieira",
          description: "Fotografia feminina artística e sensível em Brasília. Retratos que celebram a autenticidade e a beleza feminina com olhar autoral.",
          url: `${BASE_URL}/ensaio-feminino`,
          provider: { "@id": `${BASE_URL}/#person` },
          areaServed: [{ "@type": "City", name: "Brasília" }, { "@type": "City", name: "São Paulo" }],
          offers: PACOTES.map(p => ({
            "@type": "Offer",
            name: p.nome,
            price: p.preco.replace("R$ ", "").replace(".", ""),
            priceCurrency: "BRL",
          })),
        },
      ]} />
      <Footer />
    </div>
  );
}
