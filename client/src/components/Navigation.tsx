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

  const isTransparent = transparent && !scrolled && !mobileOpen;
  const navClass = isTransparent ? "nav-transparent" : "";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navClass}`}
        style={{
          backgroundColor: isTransparent ? "transparent" : "rgba(250,244,238,0.96)",
          backdropFilter: isTransparent ? "none" : "blur(12px)",
          borderBottom: isTransparent ? "none" : "1px solid rgba(217,204,180,0.4)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className={`nav-logo font-serif text-lg font-medium tracking-wide no-underline transition-colors ${isTransparent ? "text-[var(--brand-bege)]" : "text-[var(--brand-marrom-deep)]"}`}>
              Camilla.art
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Portfólio dropdown */}
              <div className="dropdown-trigger">
                <button className={`nav-link flex items-center gap-1 bg-transparent border-none p-0 ${location.startsWith("/portfolio") ? "active" : ""}`}>
                  Portfólio <ChevronDown size={10} />
                </button>
                <div className="dropdown-menu">
                  <Link href="/portfolio/ensaios-femininos" className="dropdown-item">Ensaios Femininos</Link>
                  <Link href="/portfolio/gestantes" className="dropdown-item">Gestantes</Link>
                  <Link href="/portfolio/masculino" className="dropdown-item">Masculino</Link>
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

              <Link href="/obras" className={`nav-link ${location === "/obras" ? "active" : ""}`}>Obras de Arte</Link>
              <Link href="/ceramica" className={`nav-link ${location === "/ceramica" ? "active" : ""}`}>Cerâmica</Link>
              <Link href="/projetos" className={`nav-link ${location === "/projetos" ? "active" : ""}`}>Projetos Especiais</Link>
              <Link href="/mentorias" className={`nav-link ${location === "/mentorias" ? "active" : ""}`}>Mentorias</Link>
              <Link href="/sobre" className={`nav-link ${location === "/sobre" ? "active" : ""}`}>Sobre</Link>
              <Link href="/contato" className={`nav-link ${location === "/contato" ? "active" : ""}`}>Contato</Link>
              {user?.role === "admin" && (
                <Link href="/admin" className="nav-link" style={{ color: "var(--brand-terracota)" }}>Admin</Link>
              )}
            </div>

            {/* Social + Mobile toggle */}
            <div className="flex items-center gap-4">
              <a href="https://instagram.com/camillavieira.art" target="_blank" rel="noopener noreferrer"
                className={`hidden lg:flex transition-opacity hover:opacity-100 opacity-60 ${isTransparent ? "text-[var(--brand-bege)]" : "text-[var(--brand-marrom-deep)]"}`}>
                <Instagram size={16} />
              </a>
              <a href="https://youtube.com/@camillavieira.art" target="_blank" rel="noopener noreferrer"
                className={`hidden lg:flex transition-opacity hover:opacity-100 opacity-60 ${isTransparent ? "text-[var(--brand-bege)]" : "text-[var(--brand-marrom-deep)]"}`}>
                <Youtube size={16} />
              </a>
              <button
                className={`lg:hidden p-1 bg-transparent border-none ${isTransparent ? "text-[var(--brand-bege)]" : "text-[var(--brand-marrom-deep)]"}`}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col pt-16"
          style={{ backgroundColor: "var(--brand-bege-light)" }}
        >
          <div className="flex flex-col gap-0 px-6 py-8 overflow-y-auto">
            {[
              { href: "/portfolio", label: "Portfólio" },
              { href: "/portfolio/ensaios-femininos", label: "— Ensaios Femininos" },
              { href: "/portfolio/gestantes", label: "— Gestantes" },
              { href: "/portfolio/masculino", label: "— Masculino" },
              { href: "/fotografia", label: "Fotografia Autoral" },
              { href: "/fotografia/serie-fio", label: "— Série Fio" },
              { href: "/obras", label: "Obras de Arte" },
              { href: "/ceramica", label: "Cerâmica" },
              { href: "/projetos", label: "Projetos Especiais" },
              { href: "/mentorias", label: "Mentorias" },
              { href: "/sobre", label: "Sobre" },
              { href: "/contato", label: "Contato" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="py-3 text-sm font-medium tracking-widest uppercase border-b border-[var(--brand-sand)] text-[var(--brand-marrom-deep)] no-underline hover:text-[var(--brand-terracota)] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link href="/admin" className="py-3 text-sm font-medium tracking-widest uppercase text-[var(--brand-terracota)] no-underline" onClick={() => setMobileOpen(false)}>
                Admin
              </Link>
            )}
            <div className="flex gap-5 mt-8">
              <a href="https://instagram.com/camillavieira.art" target="_blank" rel="noopener noreferrer" className="text-[var(--brand-marrom)]"><Instagram size={20} /></a>
              <a href="https://youtube.com/@camillavieira.art" target="_blank" rel="noopener noreferrer" className="text-[var(--brand-marrom)]"><Youtube size={20} /></a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
