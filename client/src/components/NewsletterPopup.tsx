import { useState, useEffect } from "react";
import { X, Mail, ArrowRight, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";

const STORAGE_KEY = "camilla_newsletter_dismissed";
const POPUP_DELAY_MS = 6000;

export function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const subscribe = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setSubmitted(true);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) { setError("Por favor, informe seu e-mail."); return; }
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

      {/* Popup container — uses inset padding so it never touches screen edges */}
      <div
        className="fixed z-[201] inset-0 flex items-center justify-center p-4"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="w-full relative rounded-2xl overflow-hidden shadow-2xl"
          style={{
            maxWidth: "420px",
            pointerEvents: "auto",
            background: "linear-gradient(135deg, var(--brand-marrom-deep) 0%, #3a2010 100%)",
            border: "1px solid rgba(245,230,211,0.15)",
            animation: "popupEnter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Inscrição na newsletter"
        >
          {/* Decorative top accent */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: "linear-gradient(90deg, transparent, var(--brand-terracota), transparent)" }}
          />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-2 rounded-full transition-all duration-200 hover:bg-white/10 border-none cursor-pointer z-10"
            style={{ color: "rgba(245,230,211,0.5)" }}
            aria-label="Fechar"
          >
            <X size={18} />
          </button>

          {/* Content — compact padding on mobile */}
          <div className="px-6 py-7 sm:px-8 sm:py-9">
            {!submitted ? (
              <>
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(201,112,100,0.15)", border: "1px solid rgba(201,112,100,0.3)" }}
                  >
                    <Sparkles size={20} style={{ color: "var(--brand-terracota)" }} />
                  </div>
                </div>

                {/* Heading */}
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
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all duration-200"
                    style={{
                      background: "rgba(245,230,211,0.08)",
                      border: "1px solid rgba(245,230,211,0.15)",
                      color: "var(--brand-bege)",
                      fontFamily: "'Inter', sans-serif",
                      boxSizing: "border-box",
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
                    className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all duration-200"
                    style={{
                      background: "rgba(245,230,211,0.08)",
                      border: "1px solid rgba(245,230,211,0.15)",
                      color: "var(--brand-bege)",
                      fontFamily: "'Inter', sans-serif",
                      boxSizing: "border-box",
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
                    className="w-full py-2.5 px-4 rounded-lg text-xs sm:text-sm font-medium tracking-[0.08em] uppercase flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer border-none"
                    style={{
                      background: subscribe.isPending ? "rgba(201,112,100,0.5)" : "var(--brand-terracota)",
                      color: "var(--brand-bege)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {subscribe.isPending ? "Inscrevendo..." : (
                      <>Quero receber novidades <ArrowRight size={13} /></>
                    )}
                  </button>
                </form>

                <p
                  className="text-center text-xs mt-3"
                  style={{ color: "rgba(245,230,211,0.35)", fontFamily: "'Inter', sans-serif" }}
                >
                  Sem spam. Cancele quando quiser.
                </p>
              </>
            ) : (
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
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
