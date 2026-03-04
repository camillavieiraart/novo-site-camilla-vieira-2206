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

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {/* Portfólio dropdown */}
              <div className="dropdown-trigger">
                <button className={`nav-link flex items-center gap-1 bg-transparent border-none p-0 ${location.startsWith("/portfolio") ? "active" : ""}`}>
                  Portfólio <ChevronDown size={10} />
                </button>
                <div className="dropdown-menu">
                  <Link href="/portfolio/ensaios-femininos" className="dropdown-item">Ensaios Femininos</Link>
                  <Link href="/portfolio/gestante" className="dropdown-item">Gestante</Link>
                  <Link href="/portfolio/profissional" className="dropdown-item">Profissional</Link>
                  <Link href="/portfolio/familia" className="dropdown-item">Família</Link>
                  <Link href="/portfolio/casamentos" className="dropdown-item">Casamentos</Link>
                  <Link href="/portfolio/editoriais" className="dropdown-item">Editoriais</Link>
                  <Link href="/fotografia" className="dropdown-item">Fotografia Autoral</Link>
                  <Link href="/ceramica" className="dropdown-item">Cerâmica</Link>
                  <Link href="/projetos" className="dropdown-item">Projetos Especiais</Link>
                  <Link href="/portfolio" className="dropdown-item" style={{ borderTop: "1px solid var(--brand-sand)", marginTop: "0.25rem", paddingTop: "0.75rem" }}>Ver Todos</Link>
                </div>
              </div>

              {/* Fotografia Autoral dropdown */}
              <div className="dropdown-trigger">
                <button className={`nav-link flex items-center gap-1 bg-transparent border-none p-0 ${location.startsWith("/fotografia") ? "active" : ""}`}>
                  Fotografia Autoral <ChevronDown size={10} />
                </button>
                <div className="dropdown-menu">
                  <Link href="/fotografia/serie-fio" className="dropdown-item">Série Fio</Link>
                  <Link href="/fotografia/maternidade" className="dropdown-item">Maternidade</Link>
                  <Link href="/fotografia" className="dropdown-item" style={{ borderTop: "1px solid var(--brand-sand)", marginTop: "0.25rem", paddingTop: "0.75rem" }}>Ver Todas</Link>
                </div>
              </div>

              <Link href="/obras" className={`nav-link ${location === "/obras" || location.startsWith("/obras/") ? "active" : ""}`}>Obras de Arte</Link>
              <Link href="/ceramica" className={`nav-link ${location === "/ceramica" ? "active" : ""}`}>Cerâmica</Link>
              <Link href="/projetos" className={`nav-link ${location === "/projetos" ? "active" : ""}`}>Projetos</Link>
              <Link href="/mentorias" className={`nav-link ${location === "/mentorias" ? "active" : ""}`}>Mentorias</Link>
              <Link href="/loja" className={`nav-link ${location === "/loja" || location.startsWith("/loja/") ? "active" : ""}`}>Loja</Link>
              <Link href="/blog" className={`nav-link ${location === "/blog" || location.startsWith("/blog/") ? "active" : ""}`}>Blog</Link>
              <Link href="/sobre" className={`nav-link ${location === "/sobre" ? "active" : ""}`}>Sobre</Link>
              <Link href="/contato" className={`nav-link ${location === "/contato" ? "active" : ""}`}>Contato</Link>
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
        {/* Spacer for nav height */}
        <div className="h-14" />

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Group: Portfólio */}
          <div className="mobile-nav-group">
            <span className="mobile-nav-group-label">Portfólio</span>
            <Link href="/portfolio" className="mobile-nav-item" onClick={() => setMobileOpen(false)}>Ver Todos</Link>
            <Link href="/portfolio/ensaios-femininos" className="mobile-nav-sub" onClick={() => setMobileOpen(false)}>Ensaios Femininos</Link>
            <Link href="/portfolio/gestante" className="mobile-nav-sub" onClick={() => setMobileOpen(false)}>Gestante</Link>
            <Link href="/portfolio/profissional" className="mobile-nav-sub" onClick={() => setMobileOpen(false)}>Profissional</Link>
            <Link href="/portfolio/familia" className="mobile-nav-sub" onClick={() => setMobileOpen(false)}>Família</Link>
            <Link href="/portfolio/casamentos" className="mobile-nav-sub" onClick={() => setMobileOpen(false)}>Casamentos</Link>
            <Link href="/portfolio/editoriais" className="mobile-nav-sub" onClick={() => setMobileOpen(false)}>Editoriais</Link>
          </div>

          {/* Group: Fotografia Autoral */}
          <div className="mobile-nav-group">
            <span className="mobile-nav-group-label">Fotografia Autoral</span>
            <Link href="/fotografia" className="mobile-nav-item" onClick={() => setMobileOpen(false)}>Ver Todas</Link>
            <Link href="/fotografia/serie-fio" className="mobile-nav-sub" onClick={() => setMobileOpen(false)}>Série Fio</Link>
            <Link href="/fotografia/maternidade" className="mobile-nav-sub" onClick={() => setMobileOpen(false)}>Maternidade</Link>
          </div>

          {/* Group: Coleções */}
          <div className="mobile-nav-group">
            <span className="mobile-nav-group-label">Coleções</span>
            <Link href="/obras" className="mobile-nav-item" onClick={() => setMobileOpen(false)}>Obras de Arte</Link>
            <Link href="/ceramica" className="mobile-nav-item" onClick={() => setMobileOpen(false)}>Cerâmica</Link>
            <Link href="/projetos" className="mobile-nav-item" onClick={() => setMobileOpen(false)}>Projetos Especiais</Link>
          </div>

          {/* Group: Blog */}
          <div className="mobile-nav-group">
            <span className="mobile-nav-group-label">Blog</span>
            <Link href="/blog" className="mobile-nav-item" onClick={() => setMobileOpen(false)}>Reflexões & Processo</Link>
          </div>

          {/* Group: Sobre & Contato */}
          <div className="mobile-nav-group">
            <span className="mobile-nav-group-label">Sobre</span>
            <Link href="/mentorias" className="mobile-nav-item" onClick={() => setMobileOpen(false)}>Mentorias</Link>
            <Link href="/loja" className="mobile-nav-item" onClick={() => setMobileOpen(false)}>Loja</Link>
            <Link href="/sobre" className="mobile-nav-item" onClick={() => setMobileOpen(false)}>Sobre Camilla</Link>
            <Link href="/contato" className="mobile-nav-item" onClick={() => setMobileOpen(false)}>Contato</Link>
          </div>

          {user?.role === "admin" && (
            <div className="mt-2">
              <Link href="/admin" className="mobile-nav-item" style={{ color: "var(--brand-terracota)" }} onClick={() => setMobileOpen(false)}>
                Admin
              </Link>
            </div>
          )}

          {/* Social links */}
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

          {/* Brand tagline */}
          <p className="mt-6 text-xs tracking-widest uppercase opacity-40" style={{ color: "var(--brand-marrom)", fontFamily: "'Inter', sans-serif" }}>
            Fotografia é Arte
          </p>
        </div>
      </div>
    </>
  );
}
