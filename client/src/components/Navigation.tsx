import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Instagram, Youtube, ChevronDown } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

interface NavigationProps {
  transparent?: boolean;
}

export function Navigation({ transparent = false }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isTransparent = transparent && !scrolled && !mobileOpen;
  const navClass = isTransparent ? "nav-transparent" : "";

  const isPortfolio = location.startsWith("/portfolio");
  const isObras = location.startsWith("/obras") || location === "/ceramica" || location.startsWith("/fotografia");
  const isEnsaios = location.startsWith("/ensaio");
  const isBlog = location.startsWith("/blog");
  const isSobre = location === "/sobre" || location === "/mentorias" || location === "/contato" || location === "/projetos";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navClass}`}
        style={{
          backgroundColor: isTransparent ? "transparent" : "rgba(250,244,238,0.97)",
          backdropFilter: isTransparent ? "none" : "blur(14px)",
          borderBottom: isTransparent ? "none" : "1px solid rgba(217,204,180,0.4)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link
              href="/"
              className={`nav-logo font-serif text-base md:text-lg font-medium tracking-wide no-underline transition-colors ${isTransparent ? "text-[var(--brand-bege)]" : "text-[var(--brand-marrom-deep)]"}`}
            >
              Camilla.art
            </Link>

            {/* Desktop Nav — 5 itens */}
            <div className="hidden lg:flex items-center gap-7 xl:gap-9">

              {/* 1. Portfólio */}
              <div className="dropdown-trigger">
                <button className={`nav-link flex items-center gap-1 bg-transparent border-none p-0 ${isPortfolio ? "active" : ""}`}>
                  Portfólio <ChevronDown size={10} />
                </button>
                <div className="dropdown-menu">
                  <Link href="/portfolio/ensaios-femininos" className="dropdown-item">Feminino</Link>
                  <Link href="/portfolio/gestante" className="dropdown-item">Gestante</Link>
                  <Link href="/portfolio/profissional" className="dropdown-item">Profissional</Link>
                  <Link href="/portfolio/familia" className="dropdown-item">Família</Link>
                  <Link href="/portfolio/casamentos" className="dropdown-item">Casamentos</Link>
                  <Link href="/portfolio/editoriais" className="dropdown-item">Editoriais</Link>
                  <Link href="/portfolio" className="dropdown-item" style={{ borderTop: "1px solid var(--brand-sand)", marginTop: "0.25rem", paddingTop: "0.75rem" }}>
                    Ver Todos
                  </Link>
                </div>
              </div>

              {/* 2. Obras */}
              <div className="dropdown-trigger">
                <button className={`nav-link flex items-center gap-1 bg-transparent border-none p-0 ${isObras ? "active" : ""}`}>
                  Obras <ChevronDown size={10} />
                </button>
                <div className="dropdown-menu">
                  <Link href="/obras" className="dropdown-item">Série Fio</Link>
                  <Link href="/obras#fine-art" className="dropdown-item">Fine Art</Link>
                  <Link href="/ceramica" className="dropdown-item">Cerâmica</Link>
                  <Link href="/fotografia" className="dropdown-item">Fotografia Autoral</Link>
                  <Link href="/projetos" className="dropdown-item" style={{ borderTop: "1px solid var(--brand-sand)", marginTop: "0.25rem", paddingTop: "0.75rem" }}>
                    Projetos Especiais
                  </Link>
                </div>
              </div>

              {/* 3. Ensaios */}
              <div className="dropdown-trigger">
                <button className={`nav-link flex items-center gap-1 bg-transparent border-none p-0 ${isEnsaios ? "active" : ""}`}>
                  Ensaios <ChevronDown size={10} />
                </button>
                <div className="dropdown-menu">
                  <Link href="/ensaio-feminino" className="dropdown-item">Ensaio Feminino</Link>
                  <Link href="/ensaio-gestante" className="dropdown-item">Ensaio Gestante</Link>
                  <Link href="/ensaio-profissional" className="dropdown-item">Ensaio Profissional</Link>
                </div>
              </div>

              {/* 4. Blog */}
              <Link href="/blog" className={`nav-link ${isBlog ? "active" : ""}`}>Blog</Link>

              {/* 5. Sobre */}
              <div className="dropdown-trigger">
                <button className={`nav-link flex items-center gap-1 bg-transparent border-none p-0 ${isSobre ? "active" : ""}`}>
                  Sobre <ChevronDown size={10} />
                </button>
                <div className="dropdown-menu">
                  <Link href="/sobre" className="dropdown-item">Sobre Camilla</Link>
                  <Link href="/mentorias" className="dropdown-item">Mentorias</Link>
                  <Link href="/contato" className="dropdown-item">Contato</Link>
                </div>
              </div>

              {user?.role === "admin" && (
                <Link href="/admin" className="nav-link" style={{ color: "var(--brand-terracota)" }}>Admin</Link>
              )}
            </div>

            {/* Social + Mobile toggle */}
            <div className="flex items-center gap-3">
              <a href="https://instagram.com/camillavieira.art" target="_blank" rel="noopener noreferrer"
                className={`hidden lg:flex transition-opacity hover:opacity-100 opacity-60 ${isTransparent ? "text-[var(--brand-bege)]" : "text-[var(--brand-marrom-deep)]"}`}>
                <Instagram size={16} />
              </a>
              <a href="https://youtube.com/@camillavieira.art" target="_blank" rel="noopener noreferrer"
                className={`hidden lg:flex transition-opacity hover:opacity-100 opacity-60 ${isTransparent ? "text-[var(--brand-bege)]" : "text-[var(--brand-marrom-deep)]"}`}>
                <Youtube size={16} />
              </a>
              <button
                className={`lg:hidden p-2 bg-transparent border-none rounded-sm transition-colors ${isTransparent ? "text-[var(--brand-bege)]" : "text-[var(--brand-marrom-deep)]"}`}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu — full-screen overlay */}
      <div
        className={`fixed inset-0 z-40 flex flex-col transition-all duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ backgroundColor: "var(--brand-bege-light)" }}
      >
        <div className="h-14" />

        <div className="flex-1 overflow-y-auto px-6 py-6">

          {/* Portfólio */}
          <div className="mobile-nav-group">
            <span className="mobile-nav-group-label">Portfólio</span>
            <Link href="/portfolio/ensaios-femininos" className="mobile-nav-sub" onClick={() => setMobileOpen(false)}>Feminino</Link>
            <Link href="/portfolio/gestante" className="mobile-nav-sub" onClick={() => setMobileOpen(false)}>Gestante</Link>
            <Link href="/portfolio/profissional" className="mobile-nav-sub" onClick={() => setMobileOpen(false)}>Profissional</Link>
            <Link href="/portfolio/familia" className="mobile-nav-sub" onClick={() => setMobileOpen(false)}>Família</Link>
            <Link href="/portfolio/casamentos" className="mobile-nav-sub" onClick={() => setMobileOpen(false)}>Casamentos</Link>
            <Link href="/portfolio/editoriais" className="mobile-nav-sub" onClick={() => setMobileOpen(false)}>Editoriais</Link>
            <Link href="/portfolio" className="mobile-nav-item" onClick={() => setMobileOpen(false)}>Ver Todos</Link>
          </div>

          {/* Obras */}
          <div className="mobile-nav-group">
            <span className="mobile-nav-group-label">Obras</span>
            <Link href="/obras" className="mobile-nav-sub" onClick={() => setMobileOpen(false)}>Série Fio</Link>
            <Link href="/obras#fine-art" className="mobile-nav-sub" onClick={() => setMobileOpen(false)}>Fine Art</Link>
            <Link href="/ceramica" className="mobile-nav-sub" onClick={() => setMobileOpen(false)}>Cerâmica</Link>
            <Link href="/fotografia" className="mobile-nav-sub" onClick={() => setMobileOpen(false)}>Fotografia Autoral</Link>
            <Link href="/projetos" className="mobile-nav-sub" onClick={() => setMobileOpen(false)}>Projetos Especiais</Link>
          </div>

          {/* Ensaios */}
          <div className="mobile-nav-group">
            <span className="mobile-nav-group-label">Ensaios</span>
            <Link href="/ensaio-feminino" className="mobile-nav-sub" onClick={() => setMobileOpen(false)}>Ensaio Feminino</Link>
            <Link href="/ensaio-gestante" className="mobile-nav-sub" onClick={() => setMobileOpen(false)}>Ensaio Gestante</Link>
            <Link href="/ensaio-profissional" className="mobile-nav-sub" onClick={() => setMobileOpen(false)}>Ensaio Profissional</Link>
          </div>

          {/* Blog */}
          <div className="mobile-nav-group">
            <Link href="/blog" className="mobile-nav-item" onClick={() => setMobileOpen(false)}>Blog</Link>
          </div>

          {/* Sobre */}
          <div className="mobile-nav-group">
            <span className="mobile-nav-group-label">Sobre</span>
            <Link href="/sobre" className="mobile-nav-sub" onClick={() => setMobileOpen(false)}>Sobre Camilla</Link>
            <Link href="/mentorias" className="mobile-nav-sub" onClick={() => setMobileOpen(false)}>Mentorias</Link>
            <Link href="/contato" className="mobile-nav-sub" onClick={() => setMobileOpen(false)}>Contato</Link>
          </div>

          {user?.role === "admin" && (
            <div className="mt-2">
              <Link href="/admin" className="mobile-nav-item" style={{ color: "var(--brand-terracota)" }} onClick={() => setMobileOpen(false)}>
                Admin
              </Link>
            </div>
          )}

          {/* Social */}
          <div className="flex gap-5 mt-8 pt-6 border-t border-[var(--brand-sand)]">
            <a href="https://instagram.com/camillavieira.art" target="_blank" rel="noopener noreferrer"
              className="text-[var(--brand-marrom)] hover:text-[var(--brand-terracota)] transition-colors">
              <Instagram size={20} />
            </a>
            <a href="https://youtube.com/@camillavieira.art" target="_blank" rel="noopener noreferrer"
              className="text-[var(--brand-marrom)] hover:text-[var(--brand-terracota)] transition-colors">
              <Youtube size={20} />
            </a>
          </div>

          <p className="mt-6 text-xs tracking-widest uppercase opacity-40" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
            Fotografia é Arte
          </p>
        </div>
      </div>
    </>
  );
}
