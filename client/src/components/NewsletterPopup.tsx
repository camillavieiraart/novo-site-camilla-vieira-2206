import { useState, useEffect } from "react";
import { X, Mail, ArrowRight, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";

const STORAGE_KEY = "camilla_newsletter_dismissed";
const POPUP_DELAY_MS = 6000; // 6 seconds after page load

export function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const subscribe = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      // Auto-close after 3 seconds on success
      setTimeout(() => {
        setIsVisible(false);
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
      }, 3000);
    },
    onError: (err) => {
      setError(err.message || "Erro ao se inscrever. Tente novamente.");
    },
  });

  useEffect(() => {
    // Check if user already dismissed or subscribed recently (within 30 days)
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      const daysSince = (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60 * 24);
      if (daysSince < 30) return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, POPUP_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Por favor, informe seu e-mail.");
      return;
    }
    subscribe.mutate({ email, name: name || undefined, source: "popup" });
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
        onClick={handleDismiss}
        aria-hidden="true"
      />

      {/* Popup */}
      <div
        className="fixed z-[201] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4"
        style={{ animation: "popupEnter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards" }}
        role="dialog"
        aria-modal="true"
        aria-label="Inscrição na newsletter"
      >
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: "linear-gradient(135deg, var(--brand-marrom-deep) 0%, #3a2010 100%)",
            border: "1px solid rgba(245,230,211,0.15)",
          }}
        >
          {/* Decorative top accent */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: "linear-gradient(90deg, transparent, var(--brand-terracota), transparent)" }}
          />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1.5 rounded-full transition-all duration-200 hover:bg-white/10 border-none cursor-pointer"
            style={{ color: "rgba(245,230,211,0.5)" }}
            aria-label="Fechar"
          >
            <X size={18} />
          </button>

          <div className="p-8 sm:p-10">
            {!submitted ? (
              <>
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(201,112,100,0.15)", border: "1px solid rgba(201,112,100,0.3)" }}
                  >
                    <Sparkles size={22} style={{ color: "var(--brand-terracota)" }} />
                  </div>
                </div>

                {/* Heading */}
                <div className="text-center mb-6">
                  <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: "var(--brand-terracota)", fontFamily: "'Inter', sans-serif" }}>
                    Ateliê Digital
                  </p>
                  <h2 className="font-serif text-3xl font-medium mb-3" style={{ color: "var(--brand-bege)" }}>
                    Fique por dentro
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(245,230,211,0.65)", fontFamily: "'Inter', sans-serif" }}>
                    Receba novidades sobre obras, ensaios, mentorias e o universo criativo da Camilla Vieira.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Seu nome (opcional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                    style={{
                      background: "rgba(245,230,211,0.08)",
                      border: "1px solid rgba(245,230,211,0.15)",
                      color: "var(--brand-bege)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(201,112,100,0.5)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(245,230,211,0.15)"; }}
                  />
                  <input
                    type="email"
                    placeholder="Seu melhor e-mail *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                    style={{
                      background: "rgba(245,230,211,0.08)",
                      border: "1px solid rgba(245,230,211,0.15)",
                      color: "var(--brand-bege)",
                      fontFamily: "'Inter', sans-serif",
                    }}
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
                    disabled={subscribe.isPending}
                    className="w-full py-3 px-6 rounded-lg text-sm font-medium tracking-[0.1em] uppercase flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer border-none"
                    style={{
                      background: subscribe.isPending ? "rgba(201,112,100,0.5)" : "var(--brand-terracota)",
                      color: "var(--brand-bege)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onMouseEnter={(e) => { if (!subscribe.isPending) (e.target as HTMLElement).style.background = "#b5604a"; }}
                    onMouseLeave={(e) => { if (!subscribe.isPending) (e.target as HTMLElement).style.background = "var(--brand-terracota)"; }}
                  >
                    {subscribe.isPending ? "Inscrevendo..." : (
                      <>Quero receber novidades <ArrowRight size={14} /></>
                    )}
                  </button>
                </form>

                {/* Privacy note */}
                <p className="text-center text-xs mt-4" style={{ color: "rgba(245,230,211,0.35)", fontFamily: "'Inter', sans-serif" }}>
                  Sem spam. Cancele quando quiser.
                </p>
              </>
            ) : (
              /* Success state */
              <div className="text-center py-4">
                <div className="flex justify-center mb-5">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(201,112,100,0.15)", border: "1px solid rgba(201,112,100,0.4)" }}
                  >
                    <Mail size={26} style={{ color: "var(--brand-terracota)" }} />
                  </div>
                </div>
                <h3 className="font-serif text-2xl font-medium mb-3" style={{ color: "var(--brand-bege)" }}>
                  Bem-vinda ao ateliê!
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(245,230,211,0.65)", fontFamily: "'Inter', sans-serif" }}>
                  Você está inscrita. Em breve receberá novidades direto no seu e-mail.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes popupEnter {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.95); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </>
  );
}
