import { Link } from "wouter";
import { Instagram, Youtube, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--brand-marrom-deep)", color: "var(--brand-bege)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-serif text-2xl font-medium mb-4" style={{ color: "var(--brand-bege)" }}>
              Camilla.art
            </h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(245,230,211,0.65)", fontFamily: "'Inter', sans-serif" }}>
              Fotografia é Arte. Um ateliê digital onde cada imagem carrega alma, intenção e beleza autoral.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/camillavieira.art" target="_blank" rel="noopener noreferrer"
                className="transition-opacity hover:opacity-100 opacity-60" style={{ color: "var(--brand-bege)" }}>
                <Instagram size={18} />
              </a>
              <a href="https://youtube.com/@camillavieira.art" target="_blank" rel="noopener noreferrer"
                className="transition-opacity hover:opacity-100 opacity-60" style={{ color: "var(--brand-bege)" }}>
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Portfólio & Ensaios */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.18em] uppercase mb-5" style={{ color: "var(--brand-sand)", fontFamily: "'Inter', sans-serif" }}>
              Portfólio
            </h4>
            <div className="flex flex-col gap-2.5">
              {[
                { href: "/portfolio/ensaios-femininos", label: "Feminino" },
                { href: "/portfolio/gestante", label: "Gestante" },
                { href: "/portfolio/profissional", label: "Profissional" },
                { href: "/portfolio/editoriais", label: "Editoriais" },
                { href: "/portfolio", label: "Ver Todos" },
              ].map(({ href, label }) => (
                <Link key={href} href={href}
                  className="text-xs tracking-wide no-underline transition-colors hover:opacity-100"
                  style={{ color: "rgba(245,230,211,0.6)", fontFamily: "'Inter', sans-serif" }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Obras & Ensaios */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.18em] uppercase mb-5" style={{ color: "var(--brand-sand)", fontFamily: "'Inter', sans-serif" }}>
              Obras & Ensaios
            </h4>
            <div className="flex flex-col gap-2.5">
              {[
                { href: "/obras", label: "Série Fio" },
                { href: "/obras#fine-art", label: "Fine Art" },
                { href: "/ceramica", label: "Cerâmica" },
                { href: "/fotografia", label: "Fotografia Autoral" },
                { href: "/ensaio-feminino", label: "Ensaio Feminino" },
                { href: "/ensaio-gestante", label: "Ensaio Gestante" },
                { href: "/mentorias", label: "Mentorias" },
              ].map(({ href, label }) => (
                <Link key={href} href={href}
                  className="text-xs tracking-wide no-underline transition-colors hover:opacity-100"
                  style={{ color: "rgba(245,230,211,0.6)", fontFamily: "'Inter', sans-serif" }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.18em] uppercase mb-5" style={{ color: "var(--brand-sand)", fontFamily: "'Inter', sans-serif" }}>
              Contato
            </h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:contato@camillavieira.art"
                className="flex items-center gap-2.5 text-xs no-underline transition-opacity hover:opacity-100 opacity-65"
                style={{ color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
                <Mail size={14} />
                contato@camillavieira.art
              </a>
              <a href="https://wa.me/5561991087909"
                className="flex items-center gap-2.5 text-xs no-underline transition-opacity hover:opacity-100 opacity-65"
                style={{ color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
                <Phone size={14} />
                (61) 99108-7909
              </a>
              <a href="https://instagram.com/camillavieira.art" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-xs no-underline transition-opacity hover:opacity-100 opacity-65"
                style={{ color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
                <Instagram size={14} />
                @camillavieira.art
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(217,204,180,0.15)" }}>
          <p className="text-xs" style={{ color: "rgba(245,230,211,0.4)", fontFamily: "'Inter', sans-serif" }}>
            © {new Date().getFullYear()} Camilla Vieira. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/blog" className="text-xs no-underline transition-opacity hover:opacity-100 opacity-50"
              style={{ color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
              Blog
            </Link>
            <Link href="/sobre" className="text-xs no-underline transition-opacity hover:opacity-100 opacity-50"
              style={{ color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
              Sobre
            </Link>
            <Link href="/privacidade" className="text-xs no-underline transition-opacity hover:opacity-100 opacity-50"
              style={{ color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
              Privacidade
            </Link>
            <Link href="/termos" className="text-xs no-underline transition-opacity hover:opacity-100 opacity-50"
              style={{ color: "var(--brand-bege)", fontFamily: "'Inter', sans-serif" }}>
              Termos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
