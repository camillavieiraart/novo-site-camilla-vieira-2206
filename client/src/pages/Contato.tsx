import { useEffect, useState } from "react";
import { Instagram, Youtube, Mail, Phone, MessageCircle } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BrushCorner } from "@/components/BrushStroke";
import { trpc } from "@/lib/trpc";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function Contato() {
  const [visible, setVisible] = useState(false);
  const [sent, setSent] = useState(false);

  const sendMessage = trpc.contact.send.useMutation({
    onSuccess: () => { setSent(true); toast.success("Mensagem enviada! Camilla responderá em breve."); reset(); },
    onError: () => toast.error("Erro ao enviar. Tente novamente."),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>();
  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);

  const onSubmit = (data: ContactForm) => sendMessage.mutate(data);

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

              <div className="flex flex-col gap-6 mb-12">
                {[
                  { icon: <MessageCircle size={18} />, label: "WhatsApp", value: "(11) 99999-9999", href: "https://wa.me/5511999999999" },
                  { icon: <Mail size={18} />, label: "E-mail", value: "contato@camillavieira.art", href: "mailto:contato@camillavieira.art" },
                  { icon: <Instagram size={18} />, label: "Instagram", value: "@camillavieira.art", href: "https://instagram.com/camillavieira.art" },
                  { icon: <Youtube size={18} />, label: "YouTube", value: "@camillavieira.art", href: "https://youtube.com/@camillavieira.art" },
                ].map(({ icon, label, value, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-4 p-5 no-underline transition-all hover:translate-x-1"
                    style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
                    <div className="flex items-center justify-center w-10 h-10 rounded-full"
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

              <div className="p-6" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
                <h3 className="font-serif text-lg font-medium mb-3" style={{ color: "var(--brand-marrom-deep)" }}>Horário de Atendimento</h3>
                <p className="text-sm" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
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

              {sent ? (
                <div className="p-8 text-center" style={{ backgroundColor: "var(--brand-bege)", border: "1px solid var(--brand-sand)" }}>
                  <div className="text-3xl mb-4">✦</div>
                  <h3 className="font-serif text-2xl font-medium mb-3" style={{ color: "var(--brand-marrom-deep)" }}>Mensagem Enviada!</h3>
                  <p className="text-sm" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                    Obrigada pelo contato. Camilla responderá em breve.
                  </p>
                  <button onClick={() => setSent(false)} className="btn-outline-dark mt-6">
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Nome *</label>
                      <input {...register("name", { required: true })} className="form-input" placeholder="Seu nome" />
                      {errors.name && <p className="text-xs text-red-500 mt-1">Obrigatório</p>}
                    </div>
                    <div>
                      <label className="form-label">E-mail *</label>
                      <input {...register("email", { required: true })} type="email" className="form-input" placeholder="seu@email.com" />
                      {errors.email && <p className="text-xs text-red-500 mt-1">Obrigatório</p>}
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Telefone / WhatsApp</label>
                    <input {...register("phone")} className="form-input" placeholder="(11) 99999-9999" />
                  </div>
                  <div>
                    <label className="form-label">Assunto</label>
                    <input {...register("subject")} className="form-input" placeholder="Ensaio, obra de arte, mentoria..." />
                  </div>
                  <div>
                    <label className="form-label">Mensagem *</label>
                    <textarea {...register("message", { required: true, minLength: 10 })} className="form-input min-h-[140px] resize-none"
                      placeholder="Conte o que você tem em mente..." />
                    {errors.message && <p className="text-xs text-red-500 mt-1">Mensagem muito curta</p>}
                  </div>
                  <button type="submit" disabled={sendMessage.isPending} className="btn-primary justify-center">
                    {sendMessage.isPending ? "Enviando..." : "Enviar Mensagem"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
