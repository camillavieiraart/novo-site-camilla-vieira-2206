import { useState, useEffect } from "react";
import { useSEO } from "@/hooks/useSEO";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArrowRight, Clock, Camera, Package, Briefcase, Star, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const VENDASDEMO_BASE = "https://vendasdemo-35ftt8sk.manus.space";

const GALLERY_IMGS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&q=80&auto=format&fit=crop",
];

const PACOTES = [
  {
    id: "essencial",
    vendaUrl: `${VENDASDEMO_BASE}/?tab=profissional`,
    nome: "Essencial",
    preco: "R$ 2.197",
    precoEntrada: "Entrada: R$ 1.099",
    precoPix: "Pix: R$ 2.087 (5% off)",
    destaque: false,
    duracao: "1h30",
    locacao: "1 locação",
    fotos: "20 fotos editadas",
    entrega: "10 dias úteis",
    extras: [
      "1 figurino",
      "Galeria digital para download",
      "Ideal para LinkedIn e redes profissionais",
    ],
  },
  {
    id: "profissional",
    vendaUrl: `${VENDASDEMO_BASE}/?tab=profissional`,
    nome: "Profissional",
    preco: "R$ 4.197",
    precoEntrada: "Entrada: R$ 2.099",
    precoPix: "Pix: R$ 3.987 (5% off)",
    destaque: true,
    duracao: "3h",
    locacao: "2 locações",
    fotos: "40 fotos editadas",
    entrega: "10 dias úteis",
    extras: [
      "2 figurinos",
      "1 vídeo de até 1 minuto",
      "Galeria digital para download",
      "Call de briefing incluída",
    ],
  },
  {
    id: "premium",
    vendaUrl: `${VENDASDEMO_BASE}/?tab=profissional`,
    nome: "Premium",
    preco: "R$ 7.497",
    precoEntrada: "Entrada: R$ 3.749",
    precoPix: "Pix: R$ 7.122 (5% off)",
    destaque: false,
    duracao: "Dia completo",
    locacao: "Múltiplas locações",
    fotos: "80 fotos editadas",
    entrega: "15 dias úteis",
    extras: [
      "Figurinos ilimitados",
      "2 vídeos de até 1 minuto",
      "Galeria digital para download",
      "Consultoria de imagem incluída",
      "Entrega expressa disponível",
    ],
  },
];

const FAQS = [
  {
    q: "O que é um ensaio profissional e para quem é indicado?",
    a: "É um ensaio fotográfico voltado para construção de imagem pessoal e corporativa — ideal para empreendedores, executivos, coaches, médicos, advogados, influenciadores e qualquer profissional que queira transmitir autoridade e autenticidade nas suas fotos.",
  },
  {
    q: "Posso usar as fotos para LinkedIn, site e materiais de marketing?",
    a: "Sim. Todas as fotos são entregues em alta resolução com licença de uso comercial para fins pessoais e profissionais. Você pode usar em qualquer plataforma digital ou impressa.",
  },
  {
    q: "Como é a direção durante o ensaio?",
    a: "A direção é consultiva e estratégica. Antes do ensaio, fazemos um briefing para entender sua marca pessoal, público-alvo e objetivos. Durante o ensaio, oriento poses, expressões e cenários que comuniquem sua autoridade e personalidade.",
  },
  {
    q: "Preciso contratar um maquiador ou stylist?",
    a: "Não é obrigatório, mas recomendado para o resultado mais impactante. Posso indicar profissionais parceiros em Brasília. Nos pacotes Profissional e Premium, a consultoria de imagem já está incluída.",
  },
  {
    q: "Qual é o prazo de entrega?",
    a: "O prazo padrão é de 10 a 15 dias úteis após o ensaio, dependendo do pacote. Entrega expressa (5 dias úteis) está disponível mediante consulta.",
  },
];

const DEPOIMENTOS = [
  {
    texto: "As fotos transformaram minha presença digital. Recebi elogios de clientes e parceiros logo na primeira semana após atualizar meu LinkedIn. Investimento que se paga rápido.",
    nome: "Ricardo A.",
    cidade: "Brasília",
  },
  {
    texto: "Eu precisava de fotos que transmitissem quem eu sou como profissional — não apenas um rosto sorrindo. A Camilla entendeu isso perfeitamente. Resultado incrível.",
    nome: "Patrícia M.",
    cidade: "São Paulo",
  },
  {
    texto: "Profissionalismo do início ao fim. O briefing foi fundamental para o resultado. As fotos ficaram exatamente com a identidade que eu queria para minha marca.",
    nome: "Carlos E.",
    cidade: "Brasília",
  },
];

export default function EnsaioProfissional() {
  useSEO({
    title: "Ensaio Profissional em Brasília",
    description: "Ensaio fotográfico profissional em Brasília com Camilla Vieira. Fotos para LinkedIn, site e marca pessoal com olhar artístico e autoral. Agende seu ensaio.",
    keywords: "ensaio profissional Brasília, fotografia corporativa, foto LinkedIn, marca pessoal, Camilla Vieira",
    canonical: "/ensaio-profissional",
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
      subject: "Ensaio Profissional",
      message: `[ENSAIO PROFISSIONAL]\n\n${formData.message || "Interesse em ensaio profissional."}`,
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--brand-bege-light)" }}>
      <Navigation />

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-end pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=85&auto=format&fit=crop"
            alt="Ensaio profissional artístico"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.45)" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(44,28,18,0.90) 0%, rgba(44,28,18,0.2) 60%, transparent 100%)" }} />
        </div>
        <div className={`relative z-10 max-w-5xl mx-auto px-6 lg:px-10 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="block text-xs tracking-[0.25em] uppercase mb-4" style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>
            Fotografia Profissional
          </span>
          <h1 className="font-serif text-5xl md:text-7xl font-medium leading-tight mb-6" style={{ color: "var(--brand-bege)" }}>
            Ensaio Profissional
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-xl mb-10" style={{ color: "rgba(245,235,220,0.85)", fontFamily: "'Inter', sans-serif" }}>
            Sua imagem profissional comunica antes mesmo de você falar. Fotos que transmitem autoridade, autenticidade e a essência da sua marca pessoal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href={`${VENDASDEMO_BASE}/?tab=profissional`} target="_blank" rel="noopener noreferrer"
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
                  <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" style={{ filter: "grayscale(10%)" }} />
                </div>
              ))}
            </div>
            <div>
              <span className="section-eyebrow block mb-4">Para quem é</span>
              <h2 className="font-serif text-4xl md:text-5xl font-medium mb-6" style={{ color: "var(--brand-marrom-deep)" }}>
                Para quem quer ser lembrado pela imagem certa.
              </h2>
              <div className="divider-terracota mb-6" />
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                Empreendedores, executivos, coaches, médicos, advogados, consultores, influenciadores e qualquer profissional que entende que a imagem é parte do negócio.
              </p>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                Fotos profissionais não são luxo — são investimento. Uma boa imagem abre portas, gera confiança e comunica sua proposta de valor antes mesmo da primeira palavra.
              </p>
              <div className="space-y-3">
                {[
                  "LinkedIn, site e materiais de marketing",
                  "Lançamentos de produtos e serviços",
                  "Construção de marca pessoal",
                  "Apresentações corporativas e mídia",
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
            <h2 className="font-serif text-4xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>Do briefing às fotos que vendem</h2>
            <div className="divider-terracota mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: "01", icon: <Briefcase size={24} />, titulo: "Briefing", desc: "Conversa estratégica para entender sua marca pessoal, público-alvo, objetivos e o que você quer comunicar com suas fotos." },
              { num: "02", icon: <Sparkles size={24} />, titulo: "Planejamento", desc: "Definimos locações, figurinos, paleta visual e roteiro do ensaio alinhados à sua identidade profissional." },
              { num: "03", icon: <Camera size={24} />, titulo: "O ensaio", desc: "Direção profissional com foco em expressão, postura e autenticidade. Você transmite confiança, eu capturo isso." },
              { num: "04", icon: <Package size={24} />, titulo: "Entrega", desc: "Galeria digital em alta resolução com licença comercial. Prontas para usar em qualquer plataforma." },
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
              { icon: <Clock size={20} />, titulo: "Duração", desc: "De 1h30 a dia completo, dependendo do pacote. Ritmo estratégico para o melhor resultado." },
              { icon: <Camera size={20} />, titulo: "Locação", desc: "Brasília (estúdio, escritório, externo). São Paulo mensalmente. Outros estados sob consulta." },
              { icon: <Package size={20} />, titulo: "Entrega", desc: "Galeria digital privada em alta resolução com licença comercial. Prazo: 10 a 15 dias úteis." },
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
              Todos os pacotes incluem briefing estratégico e licença de uso comercial.
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
                <p className="font-serif text-4xl font-medium mb-2" style={{ color: p.destaque ? "var(--brand-bege)" : "var(--brand-terracota)" }}>{p.preco}</p>
                <p className="text-xs mb-1" style={{ color: "rgba(245,235,220,0.6)", fontFamily: "'Inter', sans-serif" }}>{p.precoPix}</p>
                <p className="text-xs mb-6" style={{ color: "rgba(245,235,220,0.6)", fontFamily: "'Inter', sans-serif" }}>{p.precoEntrada}</p>
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
                <a href={p.vendaUrl} target="_blank" rel="noopener noreferrer"
                  className="block text-center py-3 text-xs tracking-widest uppercase font-medium transition-all duration-300"
                  style={{
                    backgroundColor: p.destaque ? "var(--brand-bege)" : "transparent",
                    color: p.destaque ? "var(--brand-marrom-deep)" : "var(--brand-bege)",
                    border: p.destaque ? "none" : "1px solid rgba(245,235,220,0.4)",
                    fontFamily: "'Inter', sans-serif",
                  }}>
                  Quero este pacote →
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-xs mt-8" style={{ color: "rgba(245,235,220,0.5)", fontFamily: "'Inter', sans-serif" }}>
            Parcelamento em até 6× sem juros no cartão. Pacotes para equipes e empresas sob consulta.
          </p>
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section className="py-24" style={{ backgroundColor: "var(--brand-bege-light)" }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <span className="section-eyebrow block mb-3">O que dizem</span>
            <h2 className="font-serif text-4xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>Resultados reais</h2>
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
                <Briefcase size={28} style={{ color: "var(--brand-bege)" }} />
              </div>
              <h2 className="font-serif text-3xl font-medium mb-4" style={{ color: "var(--brand-marrom-deep)" }}>Mensagem recebida!</h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                Camilla entrará em contato em até 24 horas para agendar seu briefing inicial gratuito.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <span className="section-eyebrow block mb-3">Próximo passo</span>
                <h2 className="font-serif text-4xl font-medium mb-4" style={{ color: "var(--brand-marrom-deep)" }}>Agende seu briefing gratuito</h2>
                <p className="text-sm leading-relaxed" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                  Uma conversa de 20 minutos para entender seus objetivos e criar a estratégia visual ideal para você.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>Nome *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-4 py-3 text-sm outline-none transition-all"
                      style={{ border: "1px solid var(--brand-sand)", backgroundColor: "white", color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>Telefone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                      className="w-full px-4 py-3 text-sm outline-none transition-all"
                      style={{ border: "1px solid var(--brand-sand)", backgroundColor: "white", color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}
                      placeholder="(61) 99999-9999"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>E-mail *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-4 py-3 text-sm outline-none transition-all"
                    style={{ border: "1px solid var(--brand-sand)", backgroundColor: "white", color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>Pacote de interesse</label>
                  <select
                    value={formData.message}
                    onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                    className="w-full px-4 py-3 text-sm outline-none transition-all"
                    style={{ border: "1px solid var(--brand-sand)", backgroundColor: "white", color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>
                    <option value="">Selecione um pacote</option>
                    <option value="Essencial (R$ 2.197)">Essencial — R$ 2.197</option>
                    <option value="Profissional (R$ 4.197)">Profissional — R$ 4.197</option>
                    <option value="Premium (R$ 7.497)">Premium — R$ 7.497</option>
                    <option value="Ainda não sei, quero conversar">Ainda não sei, quero conversar</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-4 text-sm tracking-widest uppercase font-medium transition-all duration-300 hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "var(--brand-terracota)", color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
                  {sending ? "Enviando..." : "Solicitar Briefing Gratuito"}
                </button>
                <p className="text-center text-xs" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.6 }}>
                  Ou fale diretamente pelo{" "}
                  <a href="https://wa.me/5511910868299?text=Olá%20Camilla!%20Tenho%20interesse%20no%20ensaio%20profissional."
                    target="_blank" rel="noopener noreferrer"
                    style={{ color: "var(--brand-terracota)" }}>WhatsApp</a>
                </p>
              </form>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
