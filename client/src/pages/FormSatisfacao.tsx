import { useState } from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const STARS = [1, 2, 3, 4, 5];

function StarRating({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const [hover, setHover] = useState(0);
  return (
    <div>
      <Label className="text-[#2C2416] text-sm font-medium">{label}</Label>
      <div className="flex gap-2 mt-2">
        {STARS.map(s => (
          <button key={s} type="button"
            onClick={() => onChange(s)}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            className={`text-2xl transition-all ${s <= (hover || value) ? "text-[#C9A96E]" : "text-[#D4C9B8]"}`}
          >★</button>
        ))}
      </div>
    </div>
  );
}

function NpsButton({ value, selected, onClick }: { value: number; selected: boolean; onClick: () => void }) {
  const color = value >= 9 ? "bg-[#4A7C59] text-white" : value >= 7 ? "bg-[#C9A96E] text-white" : "bg-[#8B7355] text-white";
  return (
    <button type="button" onClick={onClick}
      className={`w-9 h-9 text-sm font-medium rounded-full transition-all border-2 ${selected ? `${color} border-transparent scale-110` : "bg-white border-[#D4C9B8] text-[#8B7355] hover:border-[#C9A96E]"}`}
    >
      {value}
    </button>
  );
}

export default function FormSatisfacao() {
  const { token } = useParams<{ token: string }>();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    npsScore: -1,
    qualityRating: 0,
    communicationRating: 0,
    deliveryRating: 0,
    overallRating: 0,
    bestPart: "",
    improvementSuggestion: "",
    wouldReferFriend: true,
    referralReason: "",
    allowTestimonial: false,
    testimonialText: "",
  });

  const { data: form, isLoading, error } = trpc.forms.getFormByToken.useQuery(
    { token: token || "" },
    { enabled: !!token }
  );

  const submitMutation = trpc.forms.submitSatisfacao.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (e) => toast.error(e.message),
  });

  const update = (key: string, val: any) => setFormData(p => ({ ...p, [key]: val }));

  if (!token) return <NotFound />;
  if (isLoading) return <Loading />;
  if (error || !form) return <NotFound />;
  if (form.status === "filled") return <AlreadyFilled name={form.leadName} />;
  if (submitted) return <Success nps={formData.npsScore} name={form.leadName} />;

  const canSubmit = formData.npsScore >= 0 && formData.qualityRating > 0 && formData.overallRating > 0;

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <div className="bg-[#2C2416] py-8 px-6 text-center">
        <p className="text-[#C9A96E] text-xs tracking-[0.3em] uppercase mb-2">Camilla Vieira</p>
        <h1 className="text-white font-serif text-2xl md:text-3xl">Como foi a experiência, {form.leadName.split(" ")[0]}?</h1>
        <p className="text-[#C9A96E]/70 text-sm mt-2">Sua opinião honesta me ajuda a crescer e a criar algo ainda mais especial</p>
      </div>

      <div className="max-w-lg mx-auto px-6 py-10 space-y-8">

        {/* NPS */}
        <div className="bg-white rounded-sm p-6 border border-[#E8E0D5]">
          <p className="text-[#2C2416] font-medium mb-1">Em uma escala de 0 a 10, o quanto você me indicaria para alguém?</p>
          <p className="text-[#8B7355] text-xs mb-4">0 = definitivamente não indicaria · 10 = com certeza indicaria</p>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 11 }, (_, i) => (
              <NpsButton key={i} value={i} selected={formData.npsScore === i} onClick={() => update("npsScore", i)} />
            ))}
          </div>
        </div>

        {/* Star ratings */}
        <div className="bg-white rounded-sm p-6 border border-[#E8E0D5] space-y-5">
          <StarRating value={formData.qualityRating} onChange={v => update("qualityRating", v)} label="Qualidade do trabalho entregue *" />
          <StarRating value={formData.communicationRating} onChange={v => update("communicationRating", v)} label="Comunicação e atendimento" />
          <StarRating value={formData.deliveryRating} onChange={v => update("deliveryRating", v)} label="Prazo de entrega" />
          <StarRating value={formData.overallRating} onChange={v => update("overallRating", v)} label="Experiência geral *" />
        </div>

        {/* Open questions */}
        <div className="bg-white rounded-sm p-6 border border-[#E8E0D5] space-y-5">
          <div>
            <Label className="text-[#2C2416] text-sm font-medium">O que mais te marcou nessa experiência?</Label>
            <Textarea value={formData.bestPart} onChange={e => update("bestPart", e.target.value)}
              placeholder="Pode ser um momento, uma sensação, um detalhe..." rows={3}
              className="mt-2 border-[#D4C9B8] bg-[#FAF8F5] focus:border-[#C9A96E] resize-none" />
          </div>
          <div>
            <Label className="text-[#2C2416] text-sm font-medium">Tem algo que eu poderia melhorar?</Label>
            <Textarea value={formData.improvementSuggestion} onChange={e => update("improvementSuggestion", e.target.value)}
              placeholder="Seja honesta — é assim que eu melhoro." rows={3}
              className="mt-2 border-[#D4C9B8] bg-[#FAF8F5] focus:border-[#C9A96E] resize-none" />
          </div>
        </div>

        {/* Referral */}
        <div className="bg-white rounded-sm p-6 border border-[#E8E0D5]">
          <p className="text-[#2C2416] font-medium mb-3">Você indicaria meu trabalho para alguém?</p>
          <div className="flex gap-3">
            {[{ label: "Sim, com certeza!", value: true }, { label: "Talvez", value: false }].map(opt => (
              <button key={String(opt.value)} type="button"
                onClick={() => update("wouldReferFriend", opt.value)}
                className={`flex-1 py-2 text-sm border rounded-none transition-all ${formData.wouldReferFriend === opt.value ? "bg-[#2C2416] text-white border-[#2C2416]" : "bg-white text-[#8B7355] border-[#D4C9B8] hover:border-[#C9A96E]"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Testimonial permission */}
        <div className="bg-[#FDF5E8] rounded-sm p-6 border border-[#E8D9B8]">
          <p className="text-[#2C2416] font-medium mb-1">Posso usar seu depoimento no meu site?</p>
          <p className="text-[#8B7355] text-xs mb-4">Seu nome apareceria apenas como primeiro nome. Você revisa antes de publicar.</p>
          <div className="flex gap-3 mb-4">
            {[{ label: "Sim, pode usar!", value: true }, { label: "Prefiro não", value: false }].map(opt => (
              <button key={String(opt.value)} type="button"
                onClick={() => update("allowTestimonial", opt.value)}
                className={`flex-1 py-2 text-sm border rounded-none transition-all ${formData.allowTestimonial === opt.value ? "bg-[#C9A96E] text-white border-[#C9A96E]" : "bg-white text-[#8B7355] border-[#D4C9B8] hover:border-[#C9A96E]"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {formData.allowTestimonial && (
            <Textarea value={formData.testimonialText} onChange={e => update("testimonialText", e.target.value)}
              placeholder="Escreva seu depoimento aqui (opcional — posso usar o que você já escreveu acima)..." rows={3}
              className="border-[#D4C9B8] bg-white focus:border-[#C9A96E] resize-none" />
          )}
        </div>

        <Button
          onClick={() => {
            if (!canSubmit) { toast.error("Preencha a nota NPS e as avaliações obrigatórias (*)"); return; }
            submitMutation.mutate({ token: token!, ...formData });
          }}
          disabled={submitMutation.isPending}
          className="w-full bg-[#C9A96E] hover:bg-[#B8935A] text-white py-4 rounded-none text-base"
        >
          {submitMutation.isPending ? "Enviando..." : "Enviar avaliação ✓"}
        </Button>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <p className="text-[#C9A96E] text-xs tracking-widest uppercase mb-4">Camilla Vieira</p>
        <h2 className="text-[#2C2416] font-serif text-2xl mb-3">Link não encontrado</h2>
        <p className="text-[#8B7355] text-sm">Este link pode ter expirado. Entre em contato pelo WhatsApp.</p>
      </div>
    </div>
  );
}

function AlreadyFilled({ name }: { name: string }) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="text-4xl mb-4">✓</div>
        <h2 className="text-[#2C2416] font-serif text-2xl mb-3">Obrigada, {name.split(" ")[0]}!</h2>
        <p className="text-[#8B7355] text-sm">Você já respondeu esta pesquisa. Fico muito feliz com sua participação!</p>
      </div>
    </div>
  );
}

function Success({ nps, name }: { nps: number; name: string }) {
  const msg = nps >= 9
    ? "Que alegria enorme! Obrigada por confiar no meu trabalho."
    : nps >= 7
    ? "Obrigada pelo retorno! Vou usar isso para crescer."
    : "Obrigada pela honestidade. Seu feedback é muito valioso para mim.";

  return (
    <div className="min-h-screen bg-[#2C2416] flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-6">{nps >= 9 ? "🌟" : nps >= 7 ? "💛" : "🙏"}</div>
        <p className="text-[#C9A96E] text-xs tracking-widest uppercase mb-4">Camilla Vieira</p>
        <h2 className="text-white font-serif text-3xl mb-4">Obrigada, {name.split(" ")[0]}!</h2>
        <p className="text-[#C9A96E]/80 text-sm leading-relaxed">{msg}</p>
        <div className="mt-8 w-16 h-px bg-[#C9A96E]/40 mx-auto" />
        <p className="text-[#C9A96E]/50 text-xs mt-4">camillavieira.art</p>
      </div>
    </div>
  );
}
