import { useEffect, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { Instagram, Youtube, Mail, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BrushCorner } from "@/components/BrushStroke";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// ─── Validation helpers ───────────────────────────────────────────────────────
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// ─── Field component ──────────────────────────────────────────────────────────
function Field({
  id, label, required, error, children,
}: {
  id: string; label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="form-label">
        {label}{required && <span style={{ color: "var(--brand-terracota)" }}> *</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-xs mt-1" style={{ color: "#c0392b", fontFamily: "'Inter', sans-serif" }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── CONTACT FORM ─────────────────────────────────────────────────────────────
function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const sendMessage = trpc.contact.send.useMutation({
    onSuccess: () => {
      setSent(true);
      toast.success("Mensagem enviada! Camilla responderá em breve.");
    },
    onError: (err) => {
      toast.error("Erro ao enviar mensagem. Tente novamente.");
      console.error("[contact.send error]", err);
    },
  });

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Por favor, informe seu nome.";
    if (!email.trim()) e.email = "Por favor, informe seu e-mail.";
    else if (!isValidEmail(email)) e.email = "E-mail inválido.";
    if (!message.trim()) e.message = "Por favor, escreva uma mensagem.";
    else if (message.trim().length < 10) e.message = "Mensagem muito curta (mínimo 10 caracteres).";
    return e;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    sendMessage.mutate({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      subject: subject.trim() || undefined,
      message: message.trim(),
    });
  }

  if (sent) {
    return (
      <div className="p-10 text-center" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
        <CheckCircle2 size={40} className="mx-auto mb-4" style={{ color: "var(--brand-terracota)" }} />
        <h3 className="font-serif text-2xl font-medium mb-3" style={{ color: "var(--brand-marrom-deep)" }}>
          Mensagem Enviada!
        </h3>
        <p className="text-sm mb-6" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
          Obrigada pelo contato. Camilla responderá em até 24 horas úteis.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setName(""); setEmail(""); setPhone(""); setSubject(""); setMessage("");
          }}
          className="btn-outline-dark"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Formulário de contato"
      className="flex flex-col gap-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field id="contact-name" label="Nome" required error={errors.name}>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            className="form-input"
            placeholder="Seu nome completo"
            value={name}
            onChange={(e) => { setName(e.target.value); if (errors.name) setErrors(p => ({ ...p, name: "" })); }}
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
          />
        </Field>

        <Field id="contact-email" label="E-mail" required error={errors.email}>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            className="form-input"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: "" })); }}
            aria-required="true"
            aria-invalid={!!errors.email}
          />
        </Field>
      </div>

      <Field id="contact-phone" label="Telefone / WhatsApp">
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          className="form-input"
          placeholder="(61) 99999-9999"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </Field>

      <Field id="contact-subject" label="Assunto">
        <input
          id="contact-subject"
          name="subject"
          type="text"
          className="form-input"
          placeholder="Ensaio, obra de arte, mentoria..."
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </Field>

      <Field id="contact-message" label="Mensagem" required error={errors.message}>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          className="form-input resize-none"
          placeholder="Conte o que você tem em mente — um ensaio, uma obra, uma mentoria ou apenas um olá..."
          value={message}
          onChange={(e) => { setMessage(e.target.value); if (errors.message) setErrors(p => ({ ...p, message: "" })); }}
          aria-required="true"
          aria-invalid={!!errors.message}
        />
      </Field>

      {/* Global error summary */}
      {Object.keys(errors).filter(k => errors[k]).length > 0 && (
        <p role="alert" className="text-xs px-3 py-2" style={{ backgroundColor: "#fff0f0", border: "1px solid #f5c6c6", color: "#c0392b", fontFamily: "'Inter', sans-serif" }}>
          Por favor, corrija os campos marcados acima antes de enviar.
        </p>
      )}

      <button
        type="submit"
        disabled={sendMessage.isPending}
        className="btn-primary justify-center gap-2"
        aria-busy={sendMessage.isPending}
      >
        {sendMessage.isPending ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send size={15} />
            Enviar Mensagem
          </>
        )}
      </button>

      <p className="text-xs text-center" style={{ color: "var(--brand-marrom)", opacity: 0.6, fontFamily: "'Inter', sans-serif" }}>
        Seus dados são usados apenas para responder ao seu contato. Não compartilhamos com terceiros.
      </p>
    </form>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function Contato() {
  useSEO({
    title: "Contato",
    description: "Entre em contato com Camilla Vieira para agendamento de ensaios fotográficos, aquisição de obras de arte ou mentorias. WhatsApp, e-mail e redes sociais.",
    keywords: "contato Camilla Vieira, agendamento ensaio, fotógrafa Brasília, fotógrafa São Paulo, ensaio feminino Brasília, ensaio feminino SP, @camillavieira.art",
    canonical: "/contato",
  });

  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);

  // Schema LocalBusiness (JSON-LD)
  useEffect(() => {
    const siteUrl = window.location.origin;
    const schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Camilla Vieira — Ateliê Digital",
      "description": "Fotógrafa artística, artista visual e mentora criativa. Ensaios fotográficos, obras de arte, cerâmica artesanal e mentorias de marca pessoal.",
      "url": siteUrl,
      "telephone": "+55-61-99108-7909",
      "email": "contato@camillavieira.art",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Brasília",
        "addressRegion": "DF",
        "postalCode": "70680-350",
        "addressCountry": "BR",
      },
      "geo": { "@type": "GeoCoordinates", "latitude": "-15.7801", "longitude": "-47.9292" },
      "openingHours": "Mo-Fr 09:00-18:00",
      "priceRange": "$$",
      "areaServed": [
        { "@type": "City", "name": "Brasília" },
        { "@type": "City", "name": "São Paulo" },
        { "@type": "Country", "name": "Brasil" },
      ],
      "sameAs": ["https://www.instagram.com/camillavieira.art"],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Serviços e Obras",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Ensaios Fotográficos" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Mentoria de Marca Pessoal" } },
          { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Obras de Arte Original" } },
          { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Cerâmica Artesanal" } },
        ],
      },
    };
    let el = document.getElementById("schema-localbusiness");
    if (!el) {
      el = document.createElement("script");
      el.id = "schema-localbusiness";
      (el as HTMLScriptElement).type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(schema);
    return () => { document.getElementById("schema-localbusiness")?.remove(); };
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--brand-bege-light)" }}>
      <Navigation />

      {/* Hero */}
      <section className="relative pt-24 pb-20 overflow-hidden" style={{ backgroundColor: "var(--brand-marrom-deep)" }}>
        <BrushCorner position="tl" color="#F5E6D3" delay={400} />
        <BrushCorner position="br" color="#F5E6D3" delay={700} />
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center relative z-10">
          <div className={`transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="section-eyebrow block mb-4" style={{ color: "rgba(201,112,100,0.9)" }}>Contato</span>
            <h1 className="font-serif text-5xl md:text-6xl font-medium mb-6" style={{ color: "var(--brand-bege)" }}>
              Vamos Criar Juntos?
            </h1>
            <div className="mb-6 mx-auto" style={{ width: "48px", height: "1px", backgroundColor: "var(--brand-sand)" }} />
            <p className="text-base leading-relaxed max-w-xl mx-auto" style={{ color: "rgba(245,230,211,0.75)", fontFamily: "'Inter', sans-serif" }}>
              Seja para um ensaio, uma obra de arte, uma mentoria ou apenas para dizer olá — estou aqui.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Contact info */}
            <div className={`transition-all duration-800 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
              <span className="section-eyebrow block mb-6">Fale Comigo</span>
              <h2 className="font-serif text-3xl font-medium mb-8" style={{ color: "var(--brand-marrom-deep)" }}>
                Canais de Contato
              </h2>

              <div className="flex flex-col gap-4 mb-12">
                {[
                  { icon: <MessageCircle size={18} />, label: "WhatsApp", value: "(61) 99108-7909", href: "https://wa.me/5561991087909?text=Olá%20Camilla!%20Vim%20pelo%20site%20e%20gostaria%20de%20saber%20mais." },
                  { icon: <Mail size={18} />, label: "E-mail", value: "contato@camillavieira.art", href: "mailto:contato@camillavieira.art" },
                  { icon: <Instagram size={18} />, label: "Instagram", value: "@camillavieira.art", href: "https://instagram.com/camillavieira.art" },
                  { icon: <Youtube size={18} />, label: "YouTube", value: "@camillavieira.art", href: "https://youtube.com/@camillavieira.art" },
                ].map(({ icon, label, value, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-4 p-5 no-underline transition-all hover:translate-x-1"
                    style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
                    <div className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "var(--brand-bege-light)", color: "var(--brand-terracota)" }}>
                      {icon}
                    </div>
                    <div>
                      <p className="text-xs tracking-widest uppercase mb-0.5" style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>{label}</p>
                      <p className="text-sm font-medium" style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>{value}</p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="p-6 mb-6" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
                <h3 className="font-serif text-lg font-medium mb-4" style={{ color: "var(--brand-marrom-deep)" }}>Onde Atendo</h3>
                <div className="space-y-4">
                  {[
                    { cidade: "Brasília, DF", detalhe: "Base principal — atendimento contínuo" },
                    { cidade: "São Paulo, SP", detalhe: "Agenda mensal — quase todo mês" },
                    { cidade: "Outros estados", detalhe: "Mediante interesse e agendamento prévio" },
                  ].map(({ cidade, detalhe }) => (
                    <div key={cidade} className="flex items-start gap-3">
                      <span className="mt-0.5 flex-shrink-0" style={{ color: "var(--brand-terracota)", fontSize: "0.75rem" }}>✦</span>
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--brand-marrom-deep)", fontFamily: "'Inter', sans-serif" }}>{cidade}</p>
                        <p className="text-xs" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>{detalhe}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
                <h3 className="font-serif text-lg font-medium mb-3" style={{ color: "var(--brand-marrom-deep)" }}>Horário de Atendimento</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                  Segunda a Sexta: 9h às 18h<br />
                  Respondo mensagens em até 24 horas úteis.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className={`transition-all duration-800 delay-300 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
              <span className="section-eyebrow block mb-6">Mensagem</span>
              <h2 className="font-serif text-3xl font-medium mb-8" style={{ color: "var(--brand-marrom-deep)" }}>
                Envie uma Mensagem
              </h2>
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
