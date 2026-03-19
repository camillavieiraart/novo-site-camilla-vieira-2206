import { useEffect } from "react";

const PHOTO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030818024/ej2TpcbaYKYkYBzWSZou7r/camilla-bio-photo_d0731733.jpg";

const links = [
  {
    label: "📅 Agendar Ensaio",
    href: "https://vendasdemo-35ftt8sk.manus.space",
    primary: true,
  },
  {
    label: "💬 WhatsApp",
    href: "https://wa.me/5511910868299",
    primary: false,
  },
  {
    label: "🌐 Site",
    href: "https://camillavieira.art",
    primary: false,
  },
  {
    label: "🖼️ Portfólio",
    href: "https://camillavieira.art/portfolio",
    primary: false,
  },
  {
    label: "🛍️ Loja",
    href: "https://camillavieira.art/loja",
    primary: false,
  },
  {
    label: "✨ Mentoria",
    href: "https://camillavieira.art/mentorias",
    primary: false,
  },
];

export default function Links() {
  useEffect(() => {
    document.title = "Camilla Vieira | @camillavieira.art";
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #2c1a0e 0%, #3d2410 40%, #1a0f07 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "48px 20px 60px",
        fontFamily: "'Cormorant Garamond', 'Georgia', serif",
      }}
    >
      {/* Foto */}
      <div
        style={{
          width: 110,
          height: 110,
          borderRadius: "50%",
          overflow: "hidden",
          border: "2px solid rgba(212, 163, 115, 0.5)",
          boxShadow: "0 0 0 4px rgba(212, 163, 115, 0.12)",
          marginBottom: 20,
          flexShrink: 0,
        }}
      >
        <img
          src={PHOTO_URL}
          alt="Camilla Vieira"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
        />
      </div>

      {/* Nome */}
      <h1
        style={{
          color: "#f0e6d3",
          fontSize: "1.6rem",
          fontWeight: 400,
          letterSpacing: "0.08em",
          margin: "0 0 4px",
          textAlign: "center",
        }}
      >
        Camilla Vieira
      </h1>

      {/* Handle */}
      <p
        style={{
          color: "rgba(212, 163, 115, 0.8)",
          fontSize: "0.85rem",
          letterSpacing: "0.12em",
          margin: "0 0 6px",
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
        }}
      >
        @camillavieira.art
      </p>

      {/* Tagline */}
      <p
        style={{
          color: "rgba(240, 230, 211, 0.6)",
          fontSize: "0.95rem",
          fontStyle: "italic",
          margin: "0 0 36px",
          textAlign: "center",
          maxWidth: 280,
          lineHeight: 1.5,
        }}
      >
        Fotógrafa · Artista · Brasília
      </p>

      {/* Botões */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          width: "100%",
          maxWidth: 380,
        }}
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              padding: link.primary ? "16px 24px" : "14px 24px",
              borderRadius: 4,
              textAlign: "center",
              textDecoration: "none",
              fontSize: link.primary ? "1rem" : "0.95rem",
              fontFamily: "'Inter', sans-serif",
              fontWeight: link.primary ? 500 : 400,
              letterSpacing: "0.06em",
              transition: "all 0.2s ease",
              background: link.primary
                ? "linear-gradient(135deg, #b5651d, #8b4513)"
                : "rgba(255,255,255,0.06)",
              color: link.primary ? "#fff" : "rgba(240, 230, 211, 0.9)",
              border: link.primary
                ? "1px solid rgba(181, 101, 29, 0.4)"
                : "1px solid rgba(212, 163, 115, 0.2)",
              boxShadow: link.primary
                ? "0 4px 20px rgba(181, 101, 29, 0.3)"
                : "none",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              if (link.primary) {
                el.style.background = "linear-gradient(135deg, #c8722a, #9b5020)";
                el.style.transform = "translateY(-1px)";
              } else {
                el.style.background = "rgba(255,255,255,0.1)";
                el.style.borderColor = "rgba(212, 163, 115, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              if (link.primary) {
                el.style.background = "linear-gradient(135deg, #b5651d, #8b4513)";
                el.style.transform = "translateY(0)";
              } else {
                el.style.background = "rgba(255,255,255,0.06)";
                el.style.borderColor = "rgba(212, 163, 115, 0.2)";
              }
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Rodapé */}
      <p
        style={{
          color: "rgba(240, 230, 211, 0.25)",
          fontSize: "0.72rem",
          marginTop: 48,
          letterSpacing: "0.1em",
          fontFamily: "'Inter', sans-serif",
          textAlign: "center",
        }}
      >
        camillavieira.art
      </p>
    </div>
  );
}
