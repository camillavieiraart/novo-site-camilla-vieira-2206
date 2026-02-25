import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Floating "back to top" button — appears after scrolling 300px.
 * Works on both regular pages and the snap-container on the Home page.
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);

    // Also listen to the snap-container if it exists
    const snapEl = document.querySelector(".snap-container");
    const onSnapScroll = () => {
      if (snapEl) setVisible((snapEl as HTMLElement).scrollTop > 300);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    snapEl?.addEventListener("scroll", onSnapScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      snapEl?.removeEventListener("scroll", onSnapScroll);
    };
  }, []);

  const handleClick = () => {
    // Scroll snap container back to top
    const snapEl = document.querySelector(".snap-container");
    if (snapEl) {
      snapEl.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Voltar ao topo"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-11 h-11 rounded-full shadow-lg transition-all duration-500"
      style={{
        backgroundColor: "var(--brand-terracota-dark)",
        color: "var(--brand-bege-light)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateY(0)" : "translateY(16px)",
        border: "1px solid rgba(245,230,211,0.2)",
      }}
    >
      <ArrowUp size={18} />
    </button>
  );
}
