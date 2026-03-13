import { useState, useEffect } from "react";
import { useSEO } from "@/hooks/useSEO";
import { StructuredData, buildBreadcrumb, BASE_URL } from "@/components/StructuredData";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Link } from "wouter";
import { ArrowRight, Clock, Camera, Package, Heart, Star, ChevronDown, ChevronUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const VENDASDEMO_BASE = "https://vendasdemo-35ftt8sk.manus.space";

const GALLERY_IMGS = [
  "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1560328055-e938bb2ed50a?w=800&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&q=80&auto=format&fit=crop",
];

const PACOTES = [
  {
    id: "gestante-i",
    vendaUrl: `${VENDASDEMO_BASE}/?tab=gestante`,
    nome: "Gestante I",
    preco: "R$ 1.957",
    precoEntrada: "Entrada: R$ 979",
    precoPix: "Pix: R$ 1.907 (5% off)",
    destaque: false,
    duracao: "1h30",
    locacao: "1 locação",
    fotos: "30 fotos editadas",
    entrega: "15 dias úteis",
    extras: ["1 figurino", "Galeria digital para download", "Call de alinhamento após confirmação"],
  },
  {
    id: "gestante-ii",
    vendaUrl: `${VENDASDEMO_BASE}/?tab=gestante`,
    nome: "Gestante II",
    preco: "R$ 2.617",
    precoEntrada: "Entrada: R$ 1.309",
    precoPix: "Pix: R$ 2.487 (5% off)",
    destaque: true,
    duracao: "3h",
    locacao: "1 locação",
    fotos: "40 fotos editadas",
    entrega: "15 dias úteis",
    extras: ["2 figurinos", "1 vídeo de até 1 minuto", "Galeria digital para download", "Call de alinhamento após confirmação"],
  },
];

const FAQS = [
  {
    q: "Qual a melhor época para fazer o ensaio gestante?",
    a: "O período ideal é entre a 28ª e a 34ª semana de gestação. Nessa fase a barriga já está bem evidente e linda, e você ainda tem mobilidade e disposição para as poses. Evitamos as últimas semanas para garantir conforto e segurança.",
  },
  {
    q: "Posso incluir o parceiro e outros filhos no ensaio?",
    a: "Com certeza! A presença do parceiro e de irmãos mais velhos enriquece muito o ensaio e cria registros ainda mais emocionantes. Não há custo adicional para até 2 acompanhantes.",
  },
  {
    q: "O que devo usar no ensaio?",
    a: "Após a confirmação do agendamento, você recebe um guia completo de estilo com sugestões de roupas, cores e acessórios alinhados ao seu estilo e à proposta do ensaio. Também posso indicar locadoras de vestidos específicos para gestantes.",
  },
  {
    q: "Como funciona a entrega das fotos?",
    a: "As fotos são entregues em galeria online privada e protegida por senha, em alta resolução, prontas para impressão. O prazo é de 15 dias úteis após o ensaio. Você escolhe as favoritas para impressão (nos pacotes que incluem).",
  },
  {
    q: "Qual é a política de remarcação?",
    a: "Você pode remarcar o ensaio com até 48h de antecedência sem custo adicional. Em caso de imprevistos de saúde ou condições climáticas adversas, a remarcação é gratuita independente do prazo.",
  },
  {
    q: "Onde são realizados os ensaios?",
    a: "Atendo em Brasília com locações internas (estúdio, residências, espaços alugados) e externas (parques, jardins, áreas urbanas). Também viajo para São Paulo mensalmente e para outros estados mediante consulta.",
  },
];

export default function EnsaioGestante() {
  useSEO({
    title: "Ensaio Gestante em Brasília",
    description: "Ensaio gestante artístico em Brasília com Camilla Vieira. Fotografia sensível que celebra a maternidade com beleza e autenticidade. Agende sua consulta.",
    keywords: "ensaio gestante Brasília, fotografia gestante, ensaio grávida, fotógrafa gestante Brasília, Camilla Vieira",
    canonical: "/ensaio-gestante",
  });

  const [visible, setVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "", semana: "" });
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
      subject: "Ensaio Gestante",
      message: `[ENSAIO GESTANTE] Semana: ${formData.semana}\n\n${formData.message || "Interesse em ensaio gestante."}`,
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--brand-bege-light)" }}>
      <Navigation />

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-end pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1609220136736-443140cffec6?w=1600&q=85&auto=format&fit=crop"
            alt="Ensaio gestante artístico"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.55)" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(44,28,18,0.85) 0%, rgba(44,28,18,0.2) 60%, transparent 100%)" }} />
        </div>
        <div className={`relative z-10 max-w-5xl mx-auto px-6 lg:px-10 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="block text-xs tracking-[0.25em] uppercase mb-4" style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>
            Fotografia de Maternidade
          </span>
          <h1 className="font-serif text-5xl md:text-7xl font-medium leading-tight mb-6" style={{ color: "var(--brand-bege)" }}>
            Ensaio Gestante
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-xl mb-10" style={{ color: "rgba(245,235,220,0.85)", fontFamily: "'Inter', sans-serif" }}>
            Um registro íntimo e poético do momento mais transformador da sua vida. Fotografia que celebra o corpo, a espera e a conexão que já existe antes do primeiro olhar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href={`${VENDASDEMO_BASE}/?tab=gestante`} target="_blank" rel="noopener noreferrer"
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

      {/* ── SOBRE O ENSAIO ── */}
      <section className="py-24" style={{ backgroundColor: "var(--brand-bege-light)" }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-eyebrow block mb-4">O que é</span>
              <h2 className="font-serif text-4xl md:text-5xl font-medium mb-6" style={{ color: "var(--brand-marrom-deep)" }}>
                Mais do que um registro. Uma memória que dura para sempre.
              </h2>
              <div className="divider-terracota mb-6" />
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                O ensaio gestante é um presente que você dá para si mesma — e para o filho que está chegando. É a chance de parar no tempo, sentir o peso e a leveza dessa transformação, e ter imagens que vão contar essa história por gerações.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                Com direção sensível e olhar artístico, cada ensaio é construído ao redor da sua personalidade, do seu estilo e da emoção que você quer preservar. Não há poses forçadas — há momentos reais, capturados com cuidado.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {GALLERY_IMGS.slice(0, 4).map((src, i) => (
                <div key={i} className="overflow-hidden" style={{ aspectRatio: i % 3 === 0 ? "3/4" : "4/5", border: "1px solid var(--brand-sand)" }}>
                  <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" style={{ filter: "grayscale(15%)" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESSO ── */}
      <section className="py-24" style={{ backgroundColor: "var(--brand-sand)" }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <span className="section-eyebrow block mb-3">Como funciona</span>
            <h2 className="font-serif text-4xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>O processo em 4 etapas</h2>
            <div className="divider-terracota mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: "01", icon: <Heart size={24} />, titulo: "Escolha seu pacote", desc: "Conheça os pacotes, escolha o que faz sentido para você e confirme com o pagamento de 50% de entrada." },
              { num: "02", icon: <Camera size={24} />, titulo: "Call de Alinhamento", desc: "Após o pagamento, agendamos uma call exclusiva — com pelo menos 1 semana de antecedência — para entender seus objetivos, montar referências e definir figurinos, locações e o roteiro emocional do ensaio." },
              { num: "03", icon: <Star size={24} />, titulo: "O ensaio", desc: "Um encontro com leveza e cuidado. Direção suave para que você se sinta segura e bonita em cada momento." },
              { num: "04", icon: <Package size={24} />, titulo: "Entrega", desc: "Galeria online privada com todas as fotos editadas em alta resolução. Prontas para impressão e para guardar." },
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
              { icon: <Clock size={20} />, titulo: "Melhor época", desc: "Entre a 28ª e a 34ª semana de gestação — barriga evidente, conforto e mobilidade." },
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
              Todos os pacotes incluem call de alinhamento exclusiva após confirmação e guia de estilo personalizado.
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
            Parcelamento em até 6× sem juros no cartão. Pacotes personalizados sob consulta.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24" style={{ backgroundColor: "var(--brand-bege-light)" }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <span className="section-eyebrow block mb-3">Dúvidas frequentes</span>
            <h2 className="font-serif text-4xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>Perguntas e respostas</h2>
            <div className="divider-terracota mx-auto mt-4" />
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} style={{ border: "1px solid var(--brand-sand)" }}>
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
      <section id="agendar" className="py-24" style={{ backgroundColor: "var(--brand-sand)" }}>
        <div className="max-w-2xl mx-auto px-6 lg:px-10">
          {sent ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "var(--brand-terracota)" }}>
                <Heart size={28} style={{ color: "var(--brand-bege)" }} />
              </div>
              <h2 className="font-serif text-3xl font-medium mb-4" style={{ color: "var(--brand-marrom-deep)" }}>Mensagem recebida!</h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                Camilla entrará em contato em até 24 horas. Após confirmar o pacote e o pagamento de 50%, você agenda sua call de alinhamento exclusiva — onde planejamos cada detalhe do seu ensaio.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <span className="section-eyebrow block mb-3">Próximo passo</span>
                <h2 className="font-serif text-4xl font-medium mb-4" style={{ color: "var(--brand-marrom-deep)" }}>Agende seu ensaio</h2>
                <p className="text-sm leading-relaxed" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                  Uma conversa de 20 minutos para entender sua história e ver se temos conexão. Sem compromisso.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
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
                    <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>Semana de gestação</label>
                    <input
                      type="text"
                      value={formData.semana}
                      onChange={e => setFormData(p => ({ ...p, semana: e.target.value }))}
                      className="w-full px-4 py-3 text-sm bg-transparent outline-none"
                      style={{ border: "1px solid var(--brand-marrom)", color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}
                      placeholder="Ex: 30 semanas"
                    />
                  </div>
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
                  <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>Mensagem (opcional)</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                    className="w-full px-4 py-3 text-sm bg-transparent outline-none resize-none"
                    style={{ border: "1px solid var(--brand-marrom)", color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}
                    placeholder="Conte um pouco sobre o que você imagina para o ensaio..."
                  />
                </div>
                <button
                  type="submit" disabled={sending}
                  className="w-full py-4 text-sm tracking-widest uppercase font-medium transition-all duration-300 hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: "var(--brand-terracota)", color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
                  {sending ? "Enviando..." : "Quero Agendar Meu Ensaio →"}
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
      <section className="py-16" style={{ backgroundColor: "var(--brand-bege-light)" }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center">
          <p className="text-sm mb-4" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>Quer ver exemplos antes de decidir?</p>
          <Link href="/portfolio/gestante"
            className="inline-flex items-center gap-2 text-sm tracking-widest uppercase no-underline transition-opacity hover:opacity-70"
            style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>
            Ver portfólio de ensaios gestante <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <StructuredData schemas={[
        buildBreadcrumb([
          { name: "Portfólio", url: "/portfolio" },
          { name: "Ensaio Gestante", url: "/ensaio-gestante" },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Ensaio Gestante — Camilla Vieira",
          description: "Fotografia gestante artística e sensível em Brasília. Registro íntimo da maternidade com direção criativa e entrega em alta resolução.",
          url: `${BASE_URL}/ensaio-gestante`,
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
