import { useEffect } from "react";

const BG_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030818024/ej2TpcbaYKYkYBzWSZou7r/links-bg_197f88ee.png";

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
          background: #0a0a0a;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
          overflow-x: hidden;
        }

        /* Ticker */
        .links-ticker-wrap {
          background: #0a0a0a;
          border-bottom: 1px solid rgba(240,235,227,0.1);
          overflow: hidden;
          padding: 10px 0;
        }
        .links-ticker-inner {
          display: inline-block;
          white-space: nowrap;
          animation: ticker 28s linear infinite;
          color: #f0ebe3;
          font-size: 0.7rem;
          letter-spacing: 0.22em;
          font-weight: 500;
          opacity: 0.85;
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* Hero */
        .links-hero {
          width: 100%;
          height: 52vw;
          max-height: 58vh;
          min-height: 220px;
          overflow: hidden;
          position: relative;
        }
        .links-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 35%;
          display: block;
          filter: brightness(0.82);
        }

        /* Content */
        .links-content {
          background: #0a0a0a;
          padding: 1.8rem 1.5rem 3.5rem;
          display: flex;
          flex-direction: column;
        }

        .links-tagline {
          color: rgba(240,235,227,0.5);
          font-size: 0.65rem;
          letter-spacing: 0.28em;
          font-weight: 400;
          margin-bottom: 1.8rem;
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
          padding: 1.05rem 0;
          border-top: 1px solid rgba(240,235,227,0.12);
          text-decoration: none;
          transition: opacity 0.18s ease;
        }
        .links-item:last-child {
          border-bottom: 1px solid rgba(240,235,227,0.12);
        }
        .links-item:hover {
          opacity: 0.5;
        }
        .links-item-label {
          color: #f0ebe3;
          font-size: 0.78rem;
          letter-spacing: 0.22em;
          font-weight: 500;
          text-transform: uppercase;
        }
        .links-item-num {
          color: rgba(240,235,227,0.3);
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          font-weight: 300;
        }

        /* Footer */
        .links-footer {
          color: rgba(240,235,227,0.2);
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          margin-top: 2.5rem;
          text-align: center;
          text-transform: uppercase;
        }

        /* Desktop */
        @media (min-width: 600px) {
          .links-hero {
            max-height: 62vh;
          }
          .links-content {
            max-width: 460px;
            margin: 0 auto;
            width: 100%;
            padding: 2.2rem 0 4rem;
          }
          .links-item-label {
            font-size: 0.82rem;
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

        {/* Hero */}
        <div className="links-hero">
          <img src={BG_IMAGE} alt="Camilla Vieira" className="links-hero-img" />
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
