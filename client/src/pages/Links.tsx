import { useEffect } from "react";

// Foto P&B grande atrás
const BG_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030818024/ej2TpcbaYKYkYBzWSZou7r/links-bg-bw_9f643b56.jpg";
// Foto colorida menor na frente
const FRONT_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030818024/ej2TpcbaYKYkYBzWSZou7r/links-front_d5f5dbae.jpg";

const links = [
  { label: "AGENDAR ENSAIO", href: "https://camillavieira.art/ensaio-feminino", num: "01" },
  { label: "WHATSAPP", href: "https://wa.me/5511910868299", num: "02" },
  { label: "SITE", href: "https://camillavieira.art", num: "03" },
  { label: "PORTFÓLIO", href: "https://camillavieira.art/portfolio", num: "04" },
  { label: "LOJA", href: "https://camillavieira.art/loja", num: "05" },
  { label: "MENTORIA", href: "https://camillavieira.art/mentorias", num: "06" },
];

export default function Links() {
  useEffect(() => {
    document.title = "Camilla Vieira | @camillavieira.art";
  }, []);

  return (
    <>
      <style>{`
        .links-page {
          min-height: 100vh;
          background: #2a1a0e;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
          overflow-x: hidden;
        }

        /* Ticker */
        .links-ticker-wrap {
          background: #2a1a0e;
          border-bottom: 1px solid rgba(240,235,227,0.08);
          overflow: hidden;
          padding: 9px 0;
        }
        .links-ticker-inner {
          display: inline-block;
          white-space: nowrap;
          animation: ticker 32s linear infinite;
          color: #f0ebe3;
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          font-weight: 500;
          opacity: 0.7;
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* Hero com duas fotos sobrepostas */
        .links-hero {
          position: relative;
          width: 100%;
          height: 58vw;
          max-height: 62vh;
          min-height: 240px;
          overflow: hidden;
          background: #2a1a0e;
        }

        /* Foto de fundo P&B — ocupa tudo */
        .links-hero-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 20%;
          display: block;
          filter: brightness(0.7) grayscale(80%) sepia(20%);
        }

        /* Foto da frente colorida — canto inferior direito, levemente rotacionada */
        .links-hero-front {
          position: absolute;
          bottom: -8px;
          right: 12px;
          width: 52%;
          max-width: 220px;
          aspect-ratio: 2/3;
          object-fit: cover;
          object-position: center 15%;
          display: block;
          box-shadow: -4px 4px 24px rgba(0,0,0,0.6);
          transform: rotate(1.5deg);
          border: 2px solid rgba(255,255,255,0.08);
        }

        /* Nome sobre a foto de fundo */
        .links-hero-name {
          position: absolute;
          top: 50%;
          left: 18px;
          transform: translateY(-50%);
          z-index: 2;
        }
        .links-hero-name h1 {
          color: #f0ebe3;
          font-size: clamp(1.6rem, 7vw, 2.8rem);
          font-weight: 300;
          letter-spacing: 0.06em;
          line-height: 1.1;
          margin: 0;
          text-shadow: 0 2px 12px rgba(0,0,0,0.5);
          font-family: 'Cormorant Garamond', 'Georgia', serif;
        }
        .links-hero-name span {
          display: block;
          color: rgba(240,235,227,0.5);
          font-size: 0.6rem;
          letter-spacing: 0.28em;
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          margin-top: 6px;
          text-transform: uppercase;
        }

        /* Content */
        .links-content {
          background: #2a1a0e;
          padding: 1.8rem 1.5rem 3.5rem;
          display: flex;
          flex-direction: column;
        }

        .links-tagline {
          color: rgba(240,235,227,0.4);
          font-size: 0.6rem;
          letter-spacing: 0.28em;
          font-weight: 400;
          margin-bottom: 1.6rem;
          text-transform: uppercase;
        }

        /* Nav */
        .links-nav {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .links-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
          border-top: 1px solid rgba(240,235,227,0.1);
          text-decoration: none;
          transition: opacity 0.18s ease;
        }
        .links-item:last-child {
          border-bottom: 1px solid rgba(240,235,227,0.1);
        }
        .links-item:hover {
          opacity: 0.45;
        }
        .links-item-label {
          color: #f0ebe3;
          font-size: 0.75rem;
          letter-spacing: 0.22em;
          font-weight: 500;
          text-transform: uppercase;
        }
        .links-item-num {
          color: rgba(240,235,227,0.25);
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          font-weight: 300;
        }

        /* Footer */
        .links-footer {
          color: rgba(240,235,227,0.18);
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          margin-top: 2.5rem;
          text-align: center;
          text-transform: uppercase;
        }

        /* Desktop */
        @media (min-width: 600px) {
          .links-hero {
            max-height: 65vh;
          }
          .links-hero-front {
            width: 44%;
            max-width: 260px;
            right: 20px;
          }
          .links-content {
            max-width: 460px;
            margin: 0 auto;
            width: 100%;
            padding: 2.2rem 0 4rem;
          }
          .links-item-label {
            font-size: 0.8rem;
          }
        }
      `}</style>

      <div className="links-page">
        {/* Ticker */}
        <div className="links-ticker-wrap">
          <span className="links-ticker-inner">
            {"CAMILLA VIEIRA · FOTOGRAFIA É ARTE · BRASÍLIA · ".repeat(8)}
          </span>
        </div>

        {/* Hero com duas fotos */}
        <div className="links-hero">
          <img src={BG_IMAGE} alt="" className="links-hero-bg" />
          <img src={FRONT_IMAGE} alt="Camilla Vieira" className="links-hero-front" />
          <div className="links-hero-name">
            <h1>Camilla<br />Vieira</h1>
            <span>@camillavieira.art</span>
          </div>
        </div>

        {/* Content */}
        <div className="links-content">
          <p className="links-tagline">FOTOGRAFIA É ARTE.</p>

          <nav className="links-nav">
            {links.map((link) => (
              <a
                key={link.num}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="links-item"
              >
                <span className="links-item-label">{link.label}</span>
                <span className="links-item-num">{link.num}</span>
              </a>
            ))}
          </nav>

          <p className="links-footer">camillavieira.art</p>
        </div>
      </div>
    </>
  );
}
