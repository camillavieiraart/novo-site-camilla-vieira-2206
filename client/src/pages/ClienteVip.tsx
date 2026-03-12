import { useState, useEffect } from "react";
import { useSEO } from "@/hooks/useSEO";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Heart, Star, CheckCircle, Camera } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ClienteVip() {
  useSEO({
    title: "Área Exclusiva — Clientes Camilla Vieira",
    description: "Página exclusiva para clientes da Camilla Vieira. Atualize seus dados e, se quiser, deixe um depoimento sobre sua experiência.",
    canonical: "/cliente-vip",
  });

  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<"form" | "done">("form");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    instagram: "",
    sessionType: "",
    testimonialText: "",
    wantsTestimonial: false,
  });

  const [sending, setSending] = useState(false);

  const sendContact = trpc.contact.send.useMutation();
  const submitTestimonial = trpc.testimonials.submit.useMutation();

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Preencha pelo menos nome e e-mail.");
      return;
    }
    setSending(true);
    try {
      // Salva no CRM via mensagem de contato
      await sendContact.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        subject: "Cliente VIP — Cadastro",
        message: `[CLIENTE VIP]\nInstagram: ${formData.instagram || "não informado"}\nTipo de ensaio: ${formData.sessionType || "não informado"}\nQuer deixar depoimento: ${formData.wantsTestimonial ? "Sim" : "Não"}`,
      });

      // Se quiser deixar depoimento, envia também
      if (formData.wantsTestimonial && formData.testimonialText.trim().length >= 10) {
        await submitTestimonial.mutateAsync({
          name: formData.name,
          email: formData.email,
          role: formData.instagram ? `@${formData.instagram.replace("@", "")}` : undefined,
          sessionType: formData.sessionType || undefined,
          text: formData.testimonialText,
          rating,
        });
      }

      setStep("done");
    } catch {
      toast.error("Algo deu errado. Tente novamente.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--brand-bege-light)" }}>
      <Navigation />

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10"
            style={{ background: "radial-gradient(ellipse at top right, var(--brand-terracota), transparent 70%)" }} />
        </div>
        <div className={`relative max-w-3xl mx-auto px-6 lg:px-10 text-center transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "var(--brand-terracota)" }}>
            <Camera size={28} style={{ color: "var(--brand-bege)" }} />
          </div>
          <span className="block text-xs tracking-[0.25em] uppercase mb-4"
            style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>
            Área Exclusiva
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-medium leading-tight mb-6"
            style={{ color: "var(--brand-marrom-deep)" }}>
            Que bom te ver por aqui.
          </h1>
          <p className="text-base leading-relaxed max-w-xl mx-auto"
            style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
            Esta página é exclusiva para quem já viveu a experiência de um ensaio comigo.
            Preencha seus dados para que eu possa te manter por perto — e, se quiser, deixe um depoimento sobre como foi.
          </p>
        </div>
      </section>

      {/* ── FORMULÁRIO ── */}
      <section className="pb-32">
        <div className="max-w-2xl mx-auto px-6 lg:px-10">
          {step === "done" ? (
            <div className={`text-center py-16 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
                style={{ backgroundColor: "var(--brand-terracota)" }}>
                <CheckCircle size={36} style={{ color: "var(--brand-bege)" }} />
              </div>
              <h2 className="font-serif text-3xl font-medium mb-4"
                style={{ color: "var(--brand-marrom-deep)" }}>
                Obrigada, {formData.name.split(" ")[0]}!
              </h2>
              <p className="text-sm leading-relaxed max-w-md mx-auto mb-6"
                style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                Seus dados foram recebidos com carinho.
                {formData.wantsTestimonial && formData.testimonialText.length >= 10
                  ? " Seu depoimento já está em análise e em breve poderá aparecer no site para inspirar outras pessoas."
                  : ""}
              </p>
              <p className="text-xs"
                style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.6 }}>
                Com amor, Camilla ♡
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Dados pessoais */}
              <div className="p-8" style={{ backgroundColor: "var(--brand-sand)", border: "1px solid rgba(44,28,18,0.1)" }}>
                <h2 className="font-serif text-2xl font-medium mb-6"
                  style={{ color: "var(--brand-marrom-deep)" }}>
                  Seus dados
                </h2>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs tracking-widest uppercase mb-2"
                      style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                      Nome completo *
                    </label>
                    <input
                      type="text" required
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-4 py-3 text-sm outline-none bg-white"
                      style={{ border: "1px solid rgba(44,28,18,0.2)", color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase mb-2"
                      style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                      E-mail *
                    </label>
                    <input
                      type="email" required
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      className="w-full px-4 py-3 text-sm outline-none bg-white"
                      style={{ border: "1px solid rgba(44,28,18,0.2)", color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase mb-2"
                      style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                      className="w-full px-4 py-3 text-sm outline-none bg-white"
                      style={{ border: "1px solid rgba(44,28,18,0.2)", color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}
                      placeholder="(61) 9 0000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase mb-2"
                      style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                      Instagram
                    </label>
                    <input
                      type="text"
                      value={formData.instagram}
                      onChange={e => setFormData(p => ({ ...p, instagram: e.target.value }))}
                      className="w-full px-4 py-3 text-sm outline-none bg-white"
                      style={{ border: "1px solid rgba(44,28,18,0.2)", color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}
                      placeholder="@seuperfil"
                    />
                  </div>
                </div>
                <div className="mt-5">
                  <label className="block text-xs tracking-widest uppercase mb-2"
                    style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                    Qual ensaio fizemos juntas?
                  </label>
                  <select
                    value={formData.sessionType}
                    onChange={e => setFormData(p => ({ ...p, sessionType: e.target.value }))}
                    className="w-full px-4 py-3 text-sm outline-none bg-white"
                    style={{ border: "1px solid rgba(44,28,18,0.2)", color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>
                    <option value="">Selecione</option>
                    <option value="Ensaio Feminino">Ensaio Feminino</option>
                    <option value="Ensaio Gestante">Ensaio Gestante</option>
                    <option value="Ensaio Profissional">Ensaio Profissional</option>
                    <option value="Casamento">Casamento</option>
                    <option value="Festa Infantil">Festa Infantil</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              {/* Depoimento opcional */}
              <div className="p-8" style={{ backgroundColor: "var(--brand-marrom-deep)" }}>
                <div className="flex items-start gap-4 mb-6">
                  <Heart size={22} className="flex-shrink-0 mt-1" style={{ color: "var(--brand-terracota)" }} />
                  <div>
                    <h2 className="font-serif text-2xl font-medium mb-2"
                      style={{ color: "var(--brand-bege)" }}>
                      Deixar um depoimento
                    </h2>
                    <p className="text-sm leading-relaxed"
                      style={{ color: "rgba(245,235,220,0.75)", fontFamily: "'Inter', sans-serif" }}>
                      Isso é completamente opcional — mas seria muito bem-vindo.
                      Quando você compartilha como foi a sua experiência, outras mulheres conseguem se ver nessa história
                      e encontrar coragem para viver a delas também. Você ajuda o meu trabalho a chegar em quem precisa.
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer mb-6">
                  <div
                    onClick={() => setFormData(p => ({ ...p, wantsTestimonial: !p.wantsTestimonial }))}
                    className="w-5 h-5 flex-shrink-0 flex items-center justify-center transition-all"
                    style={{
                      border: "2px solid var(--brand-terracota)",
                      backgroundColor: formData.wantsTestimonial ? "var(--brand-terracota)" : "transparent",
                    }}>
                    {formData.wantsTestimonial && <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>✓</span>}
                  </div>
                  <span className="text-sm" style={{ color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
                    Sim, quero deixar um depoimento
                  </span>
                </label>

                {formData.wantsTestimonial && (
                  <div className="space-y-5">
                    {/* Estrelas */}
                    <div>
                      <label className="block text-xs tracking-widest uppercase mb-3"
                        style={{ color: "rgba(245,235,220,0.6)", fontFamily: "'Inter', sans-serif" }}>
                        Como foi a experiência?
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="transition-transform hover:scale-110">
                            <Star
                              size={28}
                              fill={(hoverRating || rating) >= star ? "var(--brand-terracota)" : "transparent"}
                              style={{ color: "var(--brand-terracota)" }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Texto */}
                    <div>
                      <label className="block text-xs tracking-widest uppercase mb-2"
                        style={{ color: "rgba(245,235,220,0.6)", fontFamily: "'Inter', sans-serif" }}>
                        Conta um pouco sobre como foi
                      </label>
                      <textarea
                        rows={5}
                        value={formData.testimonialText}
                        onChange={e => setFormData(p => ({ ...p, testimonialText: e.target.value }))}
                        className="w-full px-4 py-3 text-sm outline-none resize-none"
                        style={{
                          border: "1px solid rgba(245,235,220,0.2)",
                          backgroundColor: "rgba(255,255,255,0.05)",
                          color: "var(--brand-bege)",
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "1rem",
                        }}
                        placeholder="Como você se sentiu antes, durante e depois do ensaio? O que mudou para você? Fique à vontade para escrever do seu jeito..."
                      />
                      <p className="text-xs mt-2"
                        style={{ color: "rgba(245,235,220,0.4)", fontFamily: "'Inter', sans-serif" }}>
                        Seu depoimento passará por uma revisão antes de aparecer no site.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Botão */}
              <button
                type="submit"
                disabled={sending}
                className="w-full py-4 text-sm tracking-widest uppercase font-medium transition-all duration-300 hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "var(--brand-terracota)", color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
                {sending ? "Enviando..." : "Enviar →"}
              </button>

              <p className="text-center text-xs"
                style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", opacity: 0.5 }}>
                Seus dados são protegidos conforme a LGPD e nunca serão compartilhados.
              </p>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
