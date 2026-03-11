import { useEffect, useMemo, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { StructuredData, buildService, buildBreadcrumb, buildItemList, BASE_URL } from "@/components/StructuredData";
import { ArrowRight, Clock, Monitor, Users, CheckCircle } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BrushCorner } from "@/components/BrushStroke";
import { trpc } from "@/lib/trpc";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const MENTORSHIPS_FALLBACK = [
  {
    id: 1,
    title: "Mentoria Individual",
    description: "Sessão personalizada 1:1 para fotógrafos que querem desenvolver seu olhar autoral e construir uma identidade visual única.",
    details: JSON.stringify(["Análise do portfólio atual", "Desenvolvimento de identidade visual", "Estratégia de posicionamento", "Feedback técnico e artístico"]),
    duration: "2 horas",
    modality: "Online ou Presencial",
    priceDisplay: "R$ 450",
    isFeatured: true,
    isActive: true,
    order: 1,
  },
  {
    id: 2,
    title: "Imersão Fotografia Autoral",
    description: "Programa intensivo de 4 semanas para fotógrafos que querem transformar sua prática em arte autoral com propósito e identidade.",
    details: JSON.stringify(["4 encontros semanais de 2h", "Exercícios práticos entre sessões", "Grupo privado de acompanhamento", "Material exclusivo", "Certificado de conclusão"]),
    duration: "4 semanas",
    modality: "Online ao vivo",
    priceDisplay: "R$ 1.200",
    isFeatured: true,
    isActive: true,
    order: 2,
  },
  {
    id: 3,
    title: "Workshop Série Fio",
    description: "Aprenda a técnica de costura sobre fotografia que deu origem à série Fio. Um workshop prático e poético.",
    details: JSON.stringify(["Técnica de costura sobre fotografia", "Seleção e impressão de imagens", "Materiais e ferramentas", "Criação de obra autoral própria"]),
    duration: "1 dia (8h)",
    modality: "Presencial em São Paulo",
    priceDisplay: "R$ 680",
    isFeatured: false,
    isActive: true,
    order: 3,
  },
];

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  mentorshipId: number;
}

export default function Mentorias() {
  useSEO({
    title: "Mentorias de Fotografia",
    description: "Mentorias individuais e em grupo com Camilla Vieira para fotógrafos que querem desenvolver olhar autoral, técnica e identidade visual. Presencial em Brasília, DF, ou online.",
    keywords: "mentoria fotografia, mentoria fotógrafo, fotografia autoral, Camilla Vieira, Brasília, DF",
    canonical: "/mentorias",
  });
  const [visible, setVisible] = useState(false);
  const [selectedMentorship, setSelectedMentorship] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const { data: mentorshipsData } = trpc.mentorships.getAll.useQuery();
  const createBooking = trpc.bookings.create.useMutation({
    onSuccess: () => {
      toast.success("Solicitação enviada! Camilla entrará em contato em breve.");
      setFormOpen(false);
      reset();
    },
    onError: () => toast.error("Erro ao enviar. Tente novamente."),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BookingForm>();

  useEffect(() => { setTimeout(() => setVisible(true), 200); }, []);

  const mentorships = (mentorshipsData && mentorshipsData.length > 0) ? mentorshipsData : MENTORSHIPS_FALLBACK;

  const onSubmit = (data: BookingForm) => {
    createBooking.mutate({ ...data, mentorshipId: selectedMentorship || undefined });
  };

  const openForm = (id: number) => {
    setSelectedMentorship(id);
    setFormOpen(true);
    setTimeout(() => document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--brand-bege-light)" }}>
      <Navigation />

      {/* Hero */}
      <section className="relative pt-24 pb-20 overflow-hidden" style={{ backgroundColor: "var(--brand-marrom-deep)" }}>
        <BrushCorner position="tl" color="#F5E6D3" delay={400} />
        <BrushCorner position="br" color="#F5E6D3" delay={700} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 text-center relative z-10">
          <div className={`transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="section-eyebrow block mb-4" style={{ color: "rgba(201,112,100,0.9)" }}>Mentorias</span>
            <h1 className="font-serif text-5xl md:text-6xl font-medium mb-6" style={{ color: "var(--brand-bege)" }}>
              Aprenda a Ver com Arte
            </h1>
            <div className="mb-6 mx-auto" style={{ width: "48px", height: "1px", backgroundColor: "var(--brand-sand)" }} />
            <p className="text-sm sm:text-base leading-relaxed max-w-2xl mx-auto prose-body-wide" style={{ color: "rgba(245,230,211,0.75)", fontFamily: "'Inter', sans-serif" }}>
              Mais do que técnica, ensino um olhar. Um jeito de estar presente diante da câmera e da vida que transforma imagens em arte.
            </p>
          </div>
        </div>
      </section>

      {/* Mentorships */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className={`text-center mb-16 transition-all duration-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <span className="section-eyebrow block mb-3">Programas</span>
            <h2 className="font-serif text-4xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>
              Escolha sua Jornada
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {mentorships.map((m, i) => {
              let details: string[] = [];
              try { details = JSON.parse(m.details || "[]"); } catch {}

              return (
                <div key={m.id}
                  className={`flex flex-col transition-all duration-800 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{
                    transitionDelay: `${200 + i * 150}ms`,
                    backgroundColor: "var(--brand-bege)",
                    border: m.isFeatured ? "1px solid var(--brand-terracota)" : "1px solid var(--brand-sand)",
                  }}>
                  {m.isFeatured && (
                    <div className="px-5 py-2 text-xs tracking-widest uppercase text-center"
                      style={{ backgroundColor: "var(--brand-terracota)", color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
                      Destaque
                    </div>
                  )}
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="font-serif text-2xl font-medium mb-3" style={{ color: "var(--brand-marrom-deep)" }}>{m.title}</h3>
                    <p className="text-sm leading-relaxed prose-body mb-6" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif", maxWidth: "100%" }}>{m.description}</p>

                    <div className="flex flex-col gap-2 mb-6">
                      <div className="flex items-center gap-2 text-xs" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                        <Clock size={12} style={{ color: "var(--brand-terracota)" }} /> {m.duration}
                      </div>
                      <div className="flex items-center gap-2 text-xs" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                        <Monitor size={12} style={{ color: "var(--brand-terracota)" }} /> {m.modality}
                      </div>
                    </div>

                    {details.length > 0 && (
                      <ul className="flex flex-col gap-2 mb-8 flex-1">
                        {details.map((d, j) => (
                          <li key={j} className="flex items-start gap-2 text-xs" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
                            <CheckCircle size={12} className="mt-0.5 shrink-0" style={{ color: "var(--brand-terracota)" }} />
                            {d}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-auto">
                      <p className="font-serif text-2xl font-medium mb-4" style={{ color: "var(--brand-marrom-deep)" }}>{m.priceDisplay}</p>
                      <button onClick={() => openForm(m.id)} className="btn-primary w-full justify-center">
                        Quero Participar <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      {formOpen && (
        <section id="booking-form" className="py-20" style={{ backgroundColor: "var(--brand-bege)" }}>
          <div className="max-w-2xl mx-auto px-6 lg:px-10">
            <div className="text-center mb-12">
              <span className="section-eyebrow block mb-3">Agendamento</span>
              <h2 className="font-serif text-3xl font-medium" style={{ color: "var(--brand-marrom-deep)" }}>
                Vamos Conversar?
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div>
                <label className="form-label">Nome *</label>
                <input {...register("name", { required: true })} className="form-input" placeholder="Seu nome completo" />
                {errors.name && <p className="text-xs text-red-500 mt-1">Nome é obrigatório</p>}
              </div>
              <div>
                <label className="form-label">E-mail *</label>
                <input {...register("email", { required: true })} type="email" className="form-input" placeholder="seu@email.com" />
                {errors.email && <p className="text-xs text-red-500 mt-1">E-mail é obrigatório</p>}
              </div>
              <div>
                <label className="form-label">WhatsApp</label>
                <input {...register("phone")} className="form-input" placeholder="(11) 99999-9999" />
              </div>
              <div>
                <label className="form-label">Mensagem</label>
                <textarea {...register("message")} className="form-input min-h-[120px] resize-none"
                  placeholder="Conte um pouco sobre você e o que busca com a mentoria..." />
              </div>
              <div className="flex gap-4 pt-2">
                <button type="submit" disabled={createBooking.isPending} className="btn-primary flex-1 justify-center">
                  {createBooking.isPending ? "Enviando..." : "Enviar Solicitação"}
                </button>
                <button type="button" onClick={() => setFormOpen(false)} className="btn-outline-dark">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      <StructuredData schemas={useMemo(() => [
        buildBreadcrumb([{ name: "Mentorias", url: "/mentorias" }]),
        buildItemList(
          "Mentorias de Fotografia — Camilla Vieira",
          "/mentorias",
          mentorships.map(m => ({ name: m.title, url: `/mentorias#${m.title.toLowerCase().replace(/\s+/g, "-")}` }))
        ),
        ...mentorships.map(m => buildService({
          title: m.title,
          description: m.description,
          priceDisplay: m.priceDisplay,
          slug: m.title.toLowerCase().replace(/\s+/g, "-"),
        })),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ], [JSON.stringify(mentorships)])} />
      <Footer />
    </div>
  );
}
