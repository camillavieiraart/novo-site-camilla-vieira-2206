import { useState } from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function FormOnboarding() {
  const { token } = useParams<{ token: string }>();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const { data: form, isLoading, error } = trpc.forms.getFormByToken.useQuery(
    { token: token || "" },
    { enabled: !!token }
  );

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    whatsapp: "",
    city: "",
    instagram: "",
    profession: "",
    workContext: "",
    serviceType: "",
    serviceDetails: "",
    budgetRange: "",
    preferredDate: "",
    howFoundUs: "",
    expectations: "",
  });

  const submitMutation = trpc.forms.submitOnboarding.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (e) => toast.error(e.message),
  });

  const update = (key: string, val: string) => setFormData(p => ({ ...p, [key]: val }));

  if (!token) return <NotFound />;
  if (isLoading) return <Loading />;
  if (error || !form) return <NotFound />;
  if (form.status === "filled") return <AlreadyFilled name={form.leadName} />;

  if (submitted) return <Success name={formData.fullName || form.leadName} />;

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <div className="bg-[#2C2416] py-8 px-6 text-center">
        <p className="text-[#C9A96E] text-xs tracking-[0.3em] uppercase mb-2">Camilla Vieira</p>
        <h1 className="text-white font-serif text-2xl md:text-3xl">Bem-vinda, {form.leadName.split(" ")[0]}</h1>
        <p className="text-[#C9A96E]/70 text-sm mt-2">Preencha com calma — isso me ajuda a criar algo único para você</p>
      </div>

      {/* Progress */}
      <div className="flex justify-center gap-2 py-6 px-6">
        {[1, 2, 3].map(s => (
          <div key={s} className={`h-1 flex-1 max-w-16 rounded-full transition-all ${s <= step ? "bg-[#C9A96E]" : "bg-[#E8E0D5]"}`} />
        ))}
      </div>

      <div className="max-w-lg mx-auto px-6 pb-16">
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <p className="text-[#8B7355] text-xs tracking-widest uppercase mb-4">Sobre você</p>
              <div className="space-y-4">
                <div>
                  <Label className="text-[#2C2416] text-sm font-medium">Nome completo *</Label>
                  <Input value={formData.fullName} onChange={e => update("fullName", e.target.value)}
                    placeholder="Seu nome" className="mt-1 border-[#D4C9B8] bg-white focus:border-[#C9A96E] focus:ring-[#C9A96E]/20" />
                </div>
                <div>
                  <Label className="text-[#2C2416] text-sm font-medium">E-mail *</Label>
                  <Input type="email" value={formData.email} onChange={e => update("email", e.target.value)}
                    placeholder="seu@email.com" className="mt-1 border-[#D4C9B8] bg-white focus:border-[#C9A96E] focus:ring-[#C9A96E]/20" />
                </div>
                <div>
                  <Label className="text-[#2C2416] text-sm font-medium">WhatsApp *</Label>
                  <Input value={formData.whatsapp} onChange={e => update("whatsapp", e.target.value)}
                    placeholder="(61) 99999-9999" className="mt-1 border-[#D4C9B8] bg-white focus:border-[#C9A96E] focus:ring-[#C9A96E]/20" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[#2C2416] text-sm font-medium">Cidade</Label>
                    <Input value={formData.city} onChange={e => update("city", e.target.value)}
                      placeholder="Brasília" className="mt-1 border-[#D4C9B8] bg-white focus:border-[#C9A96E] focus:ring-[#C9A96E]/20" />
                  </div>
                  <div>
                    <Label className="text-[#2C2416] text-sm font-medium">Instagram</Label>
                    <Input value={formData.instagram} onChange={e => update("instagram", e.target.value)}
                      placeholder="@seu.perfil" className="mt-1 border-[#D4C9B8] bg-white focus:border-[#C9A96E] focus:ring-[#C9A96E]/20" />
                  </div>
                </div>
              </div>
            </div>
            <Button onClick={() => {
              if (!formData.fullName || !formData.email || !formData.whatsapp) {
                toast.error("Preencha os campos obrigatórios"); return;
              }
              setStep(2);
            }} className="w-full bg-[#2C2416] hover:bg-[#3D3220] text-white py-3 rounded-none">
              Continuar →
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <p className="text-[#8B7355] text-xs tracking-widest uppercase mb-4">Sobre o serviço</p>
            <div className="space-y-4">
              <div>
                <Label className="text-[#2C2416] text-sm font-medium">O que você está buscando? *</Label>
                <Select onValueChange={v => update("serviceType", v)}>
                  <SelectTrigger className="mt-1 border-[#D4C9B8] bg-white">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ensaio_pessoal">Ensaio pessoal / artístico</SelectItem>
                    <SelectItem value="ensaio_familia">Ensaio de família</SelectItem>
                    <SelectItem value="ensaio_gestante">Ensaio gestante</SelectItem>
                    <SelectItem value="ensaio_newborn">Ensaio newborn</SelectItem>
                    <SelectItem value="obra_arte">Obra de arte / pintura</SelectItem>
                    <SelectItem value="ceramica">Cerâmica</SelectItem>
                    <SelectItem value="print">Print / impressão artística</SelectItem>
                    <SelectItem value="mentoria">Mentoria fotográfica</SelectItem>
                    <SelectItem value="marca_pessoal">Consultoria de marca pessoal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[#2C2416] text-sm font-medium">Me conte mais sobre o que você imagina</Label>
                <Textarea value={formData.serviceDetails} onChange={e => update("serviceDetails", e.target.value)}
                  placeholder="Descreva sua ideia, o que você quer sentir, o contexto..." rows={4}
                  className="mt-1 border-[#D4C9B8] bg-white focus:border-[#C9A96E] resize-none" />
              </div>
              <div>
                <Label className="text-[#2C2416] text-sm font-medium">Período de preferência</Label>
                <Input value={formData.preferredDate} onChange={e => update("preferredDate", e.target.value)}
                  placeholder="Ex: março, segunda quinzena de abril..." className="mt-1 border-[#D4C9B8] bg-white focus:border-[#C9A96E]" />
              </div>
              <div>
                <Label className="text-[#2C2416] text-sm font-medium">Faixa de investimento</Label>
                <Select onValueChange={v => update("budgetRange", v)}>
                  <SelectTrigger className="mt-1 border-[#D4C9B8] bg-white">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ate_1500">Até R$ 1.500</SelectItem>
                    <SelectItem value="1500_3000">R$ 1.500 – R$ 3.000</SelectItem>
                    <SelectItem value="3000_6000">R$ 3.000 – R$ 6.000</SelectItem>
                    <SelectItem value="acima_6000">Acima de R$ 6.000</SelectItem>
                    <SelectItem value="nao_sei">Ainda não sei</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 border-[#D4C9B8] text-[#8B7355] rounded-none">
                ← Voltar
              </Button>
              <Button onClick={() => {
                if (!formData.serviceType) { toast.error("Selecione o serviço"); return; }
                setStep(3);
              }} className="flex-1 bg-[#2C2416] hover:bg-[#3D3220] text-white rounded-none">
                Continuar →
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <p className="text-[#8B7355] text-xs tracking-widest uppercase mb-4">Últimas perguntas</p>
            <div className="space-y-4">
              <div>
                <Label className="text-[#2C2416] text-sm font-medium">Como você me encontrou?</Label>
                <Select onValueChange={v => update("howFoundUs", v)}>
                  <SelectTrigger className="mt-1 border-[#D4C9B8] bg-white">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="indicacao">Indicação de alguém</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="site">Site</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[#2C2416] text-sm font-medium">O que você espera dessa experiência?</Label>
                <Textarea value={formData.expectations} onChange={e => update("expectations", e.target.value)}
                  placeholder="Pode ser uma palavra, uma frase, uma sensação..." rows={4}
                  className="mt-1 border-[#D4C9B8] bg-white focus:border-[#C9A96E] resize-none" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1 border-[#D4C9B8] text-[#8B7355] rounded-none">
                ← Voltar
              </Button>
              <Button
                onClick={() => submitMutation.mutate({ token: token!, ...formData })}
                disabled={submitMutation.isPending}
                className="flex-1 bg-[#C9A96E] hover:bg-[#B8935A] text-white rounded-none"
              >
                {submitMutation.isPending ? "Enviando..." : "Enviar ✓"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#8B7355] text-sm">Carregando...</p>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <p className="text-[#C9A96E] text-xs tracking-widest uppercase mb-4">Camilla Vieira</p>
        <h2 className="text-[#2C2416] font-serif text-2xl mb-3">Link não encontrado</h2>
        <p className="text-[#8B7355] text-sm">Este link pode ter expirado ou ser inválido. Entre em contato pelo WhatsApp.</p>
      </div>
    </div>
  );
}

function AlreadyFilled({ name }: { name: string }) {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="text-4xl mb-4">✓</div>
        <p className="text-[#C9A96E] text-xs tracking-widest uppercase mb-4">Camilla Vieira</p>
        <h2 className="text-[#2C2416] font-serif text-2xl mb-3">Já recebemos, {name.split(" ")[0]}!</h2>
        <p className="text-[#8B7355] text-sm">Você já preencheu este formulário. Em breve entro em contato.</p>
      </div>
    </div>
  );
}

function Success({ name }: { name: string }) {
  return (
    <div className="min-h-screen bg-[#2C2416] flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-6">✨</div>
        <p className="text-[#C9A96E] text-xs tracking-widest uppercase mb-4">Camilla Vieira</p>
        <h2 className="text-white font-serif text-3xl mb-4">Obrigada, {name.split(" ")[0]}!</h2>
        <p className="text-[#C9A96E]/80 text-sm leading-relaxed">
          Recebi tudo com carinho. Vou analisar o que você compartilhou e entro em contato em breve para conversarmos sobre os próximos passos.
        </p>
        <div className="mt-8 w-16 h-px bg-[#C9A96E]/40 mx-auto" />
        <p className="text-[#C9A96E]/50 text-xs mt-4">camillavieira.art</p>
      </div>
    </div>
  );
}
