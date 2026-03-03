import { useState, useEffect } from "react";
import { X, Mail, ArrowRight, Camera, Palette, BookOpen, Bell, Layers } from "lucide-react";
import { trpc } from "@/lib/trpc";

const STORAGE_KEY = "camilla_newsletter_dismissed";
const POPUP_DELAY_MS = 6000;

const CONTENT_OPTIONS = [
  {
    id: "todos",
    icon: Layers,
    label: "Tudo",
    description: "Ensaios, obras, mentorias e reflexões",
    exclusive: true, // selecting this deselects others
  },
  {
    id: "ensaios",
    icon: Camera,
    label: "Ensaios fotográficos",
    description: "Bastidores, experiências e novas séries",
    exclusive: false,
  },
  {
    id: "arte",
    icon: Palette,
    label: "Arte & coleções",
    description: "Obras, exposições e processo criativo",
    exclusive: false,
  },
  {
    id: "mentoria",
    icon: BookOpen,
    label: "Mentoria & aprendizado",
    description: "Referências, Mapa de Observação, ebooks",
    exclusive: false,
  },
  {
    id: "blog_alert",
    icon: Bell,
    label: "Alerta de publicações",
    description: "Aviso a cada novo texto no blog",
    exclusive: false,
  },
];

export function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState<"form" | "prefs">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [frequency, setFrequency] = useState<"semanal" | "quinzenal">("semanal");
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>(["todos"]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const subscribe = trpc.newsletter.subscribeWithPreferences.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setTimeout(() => {
        setIsVisible(false);
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
      }, 3500);
    },
    onError: (err) => {
      setError(err.message || "Erro ao se inscrever. Tente novamente.");
    },
  });

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      const daysSince = (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60 * 24);
      if (daysSince < 30) return;
    }
    const timer = setTimeout(() => setIsVisible(true), POPUP_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  };

  const handleFirstStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) { setError("Por favor, informe seu e-mail."); return; }
    setStep("prefs");
  };

  const togglePref = (id: string) => {
    const opt = CONTENT_OPTIONS.find(o => o.id === id);
    if (opt?.exclusive) {
      setSelectedPrefs(["todos"]);
      return;
    }
    setSelectedPrefs(prev => {
      const withoutTodos = prev.filter(p => p !== "todos");
      if (withoutTodos.includes(id)) {
        const next = withoutTodos.filter(p => p !== id);
        return next.length === 0 ? ["todos"] : next;
      }
      return [...withoutTodos, id];
    });
  };

  const handleSubmit = () => {
    subscribe.mutate({
      email,
      name: name || undefined,
      source: "popup",
      frequencyPreference: frequency,
      contentPreferences: selectedPrefs,
    });
  };

  if (!isVisible) return null;

  const inputStyle = {
    background: "rgba(245,230,211,0.08)",
    border: "1px solid rgba(245,230,211,0.15)",
    color: "var(--brand-bege)",
    fontFamily: "'Inter', sans-serif",
    boxSizing: "border-box" as const,
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
        onClick={handleDismiss}
        aria-hidden="true"
      />

      <div
        className="fixed z-[201] inset-0 flex items-center justify-center p-4"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="w-full relative rounded-2xl overflow-hidden shadow-2xl"
          style={{
            maxWidth: step === "prefs" ? "480px" : "420px",
            pointerEvents: "auto",
            background: "linear-gradient(135deg, var(--brand-marrom-deep) 0%, #3a2010 100%)",
            border: "1px solid rgba(245,230,211,0.15)",
            animation: "popupEnter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            transition: "max-width 0.3s ease",
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Inscrição na newsletter"
        >
          {/* Top accent */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: "linear-gradient(90deg, transparent, var(--brand-terracota), transparent)" }}
          />

          {/* Close */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-2 rounded-full transition-all duration-200 hover:bg-white/10 border-none cursor-pointer z-10"
            style={{ color: "rgba(245,230,211,0.5)" }}
            aria-label="Fechar"
          >
            <X size={18} />
          </button>

          <div className="px-6 py-7 sm:px-8 sm:py-9">
            {submitted ? (
              /* ── CONFIRMAÇÃO ── */
              <div className="text-center py-2">
                <div className="flex justify-center mb-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(201,112,100,0.15)", border: "1px solid rgba(201,112,100,0.4)" }}
                  >
                    <Mail size={24} style={{ color: "var(--brand-terracota)" }} />
                  </div>
                </div>
                <h3 className="font-serif text-2xl font-medium mb-2" style={{ color: "var(--brand-bege)" }}>
                  Bem-vinda ao ateliê.
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(245,230,211,0.65)", fontFamily: "'Inter', sans-serif" }}>
                  {selectedPrefs.includes("todos")
                    ? "Você receberá tudo — ensaios, obras, mentorias e reflexões."
                    : `Você receberá: ${selectedPrefs.map(p => CONTENT_OPTIONS.find(o => o.id === p)?.label ?? p).join(", ")}.`}
                  <br />
                  <span className="text-xs opacity-70 mt-1 block">
                    Frequência: {frequency === "semanal" ? "toda semana" : "quinzenalmente"}.
                  </span>
                </p>
              </div>

            ) : step === "form" ? (
              /* ── STEP 1: EMAIL + NOME ── */
              <>
                <div className="flex justify-center mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(201,112,100,0.15)", border: "1px solid rgba(201,112,100,0.3)" }}
                  >
                    <Mail size={20} style={{ color: "var(--brand-terracota)" }} />
                  </div>
                </div>

                <div className="text-center mb-5">
                  <p
                    className="text-xs tracking-[0.25em] uppercase mb-2"
                    style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}
                  >
                    Ateliê Digital
                  </p>
                  <h2
                    className="font-serif text-2xl sm:text-3xl font-medium mb-2"
                    style={{ color: "var(--brand-bege)" }}
                  >
                    Fique por dentro
                  </h2>
                  <p
                    className="text-xs sm:text-sm leading-relaxed"
                    style={{ color: "rgba(245,230,211,0.65)", fontFamily: "'Inter', sans-serif" }}
                  >
                    Cartas de artista — ensaios, obras, processo criativo e o que inspira o olhar.
                    <br />
                    <span className="opacity-75">Semanal ou quinzenal. Cancele quando quiser.</span>
                  </p>
                </div>

                <form onSubmit={handleFirstStep} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Seu nome (opcional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all duration-200"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(201,112,100,0.5)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(245,230,211,0.15)"; }}
                  />
                  <input
                    type="email"
                    placeholder="Seu melhor e-mail *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all duration-200"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(201,112,100,0.5)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(245,230,211,0.15)"; }}
                  />

                  {error && (
                    <p className="text-xs" style={{ color: "#f87171", fontFamily: "'Inter', sans-serif" }}>
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-lg text-xs sm:text-sm font-medium tracking-[0.08em] uppercase flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer border-none"
                    style={{
                      background: "var(--brand-terracota)",
                      color: "var(--brand-bege)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Continuar <ArrowRight size={13} />
                  </button>
                </form>
              </>

            ) : (
              /* ── STEP 2: PREFERÊNCIAS ── */
              <>
                <div className="text-center mb-5">
                  <p
                    className="text-xs tracking-[0.25em] uppercase mb-1"
                    style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}
                  >
                    Personalize
                  </p>
                  <h2
                    className="font-serif text-xl sm:text-2xl font-medium mb-1"
                    style={{ color: "var(--brand-bege)" }}
                  >
                    O que você quer receber?
                  </h2>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "rgba(245,230,211,0.55)", fontFamily: "'Inter', sans-serif" }}
                  >
                    Selecione um ou mais. Você pode mudar depois.
                  </p>
                </div>

                {/* Content preference tiles */}
                <div className="grid grid-cols-1 gap-2 mb-4">
                  {CONTENT_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = selectedPrefs.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => togglePref(opt.id)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 cursor-pointer border"
                        style={{
                          background: isSelected ? "rgba(201,112,100,0.18)" : "rgba(245,230,211,0.04)",
                          borderColor: isSelected ? "rgba(201,112,100,0.6)" : "rgba(245,230,211,0.12)",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        <div
                          className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                          style={{
                            background: isSelected ? "rgba(201,112,100,0.25)" : "rgba(245,230,211,0.08)",
                          }}
                        >
                          <Icon size={14} style={{ color: isSelected ? "var(--brand-terracota)" : "rgba(245,230,211,0.5)" }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium" style={{ color: isSelected ? "var(--brand-bege)" : "rgba(245,230,211,0.7)" }}>
                            {opt.label}
                          </p>
                          <p className="text-xs" style={{ color: "rgba(245,230,211,0.4)" }}>
                            {opt.description}
                          </p>
                        </div>
                        {/* Checkmark */}
                        <div
                          className="ml-auto w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            background: isSelected ? "var(--brand-terracota)" : "transparent",
                            border: isSelected ? "none" : "1px solid rgba(245,230,211,0.2)",
                          }}
                        >
                          {isSelected && (
                            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                              <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Frequency */}
                <div className="mb-4">
                  <p
                    className="text-xs tracking-[0.15em] uppercase mb-2"
                    style={{ color: "rgba(245,230,211,0.5)", fontFamily: "'Inter', sans-serif" }}
                  >
                    Com que frequência?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {(["semanal", "quinzenal"] as const).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFrequency(f)}
                        className="py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer border"
                        style={{
                          background: frequency === f ? "rgba(201,112,100,0.18)" : "rgba(245,230,211,0.04)",
                          borderColor: frequency === f ? "rgba(201,112,100,0.6)" : "rgba(245,230,211,0.12)",
                          color: frequency === f ? "var(--brand-bege)" : "rgba(245,230,211,0.55)",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {f === "semanal" ? "Toda semana" : "A cada 2 semanas"}
                      </button>
                    ))}
                  </div>
                  <p
                    className="text-xs mt-1.5"
                    style={{ color: "rgba(245,230,211,0.35)", fontFamily: "'Inter', sans-serif" }}
                  >
                    {frequency === "semanal"
                      ? "Terças, quartas ou quintas — entre 11h e 14h."
                      : "Quinzenalmente, no mesmo horário de pico."}
                  </p>
                </div>

                {error && (
                  <p className="text-xs mb-2" style={{ color: "#f87171", fontFamily: "'Inter', sans-serif" }}>
                    {error}
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep("form")}
                    className="flex-shrink-0 py-2.5 px-4 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer border"
                    style={{
                      background: "transparent",
                      borderColor: "rgba(245,230,211,0.15)",
                      color: "rgba(245,230,211,0.5)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={subscribe.isPending}
                    className="flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-medium tracking-[0.08em] uppercase flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer border-none"
                    style={{
                      background: subscribe.isPending ? "rgba(201,112,100,0.5)" : "var(--brand-terracota)",
                      color: "var(--brand-bege)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {subscribe.isPending ? "Inscrevendo..." : (
                      <>Confirmar inscrição <ArrowRight size={13} /></>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes popupEnter {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
