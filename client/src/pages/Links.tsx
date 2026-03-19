import { useEffect, useState } from "react";

// Foto P&B de fundo
const BG_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030818024/ej2TpcbaYKYkYBzWSZou7r/links-bg-new_9cf1880c.jpeg";

// Foto colorida menor na frente
const FRONT_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663030818024/ej2TpcbaYKYkYBzWSZou7r/links-front-new_bf4f91aa.jpeg";

const FULL_NAME = "Camilla Vieira";

const links = [
  { label: "AGENDAR ENSAIO", href: "https://camillavieira.art/ensaio-feminino", num: "01" },
  { label: "WHATSAPP", href: "https://wa.me/5511910868299", num: "02" },
  { label: "SITE", href: "https://camillavieira.art", num: "03" },
  { label: "PORTFÓLIO", href: "https://camillavieira.art/portfolio", num: "04" },
  { label: "LOJA", href: "https://camillavieira.art/loja", num: "05" },
  { label: "MENTORIA", href: "https://camillavieira.art/mentorias", num: "06" },
  { label: "NEWSLETTER & BLOG", href: "https://camillavieira.art/blog", num: "07" },
];

export default function Links() {
  const [displayedName, setDisplayedName] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [nameComplete, setNameComplete] = useState(false);

  useEffect(() => {
    document.title = "Camilla Vieira | @camillavieira.art";
  }, []);

  // Typewriter do nome
  useEffect(() => {
    let i = 0;
    const delay = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < FULL_NAME.length) {
          setDisplayedName(FULL_NAME.slice(0, i + 1));
          i++;
        } else {
          setNameComplete(true);
          clearInterval(interval);
        }
      }, 120);
      return () => clearInterval(interval);
    }, 400);
    return () => clearTimeout(delay);
  }, []);

  // Piscar cursor
  useEffect(() => {
    if (nameComplete) {
      const t = setTimeout(() => setShowCursor(false), 1200);
      return () => clearTimeout(t);
    }
    const interval = setInterval(() => setShowCursor((v) => !v), 500);
    return () => clearInterval(interval);
  }, [nameComplete]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Inter:wght@300;400;500&display=swap');

        .lp-page {
          min-height: 100vh;
          background: #3d2410;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        /* Pinceladas decorativas */
        .lp-brush {
          position: absolute;
          pointer-events: none;
          z-index: 0;
          opacity: 0.18;
        }
        .lp-brush-tl {
          top: -20px;
          left: -30px;
          width: 220px;
          height: 220px;
        }
        .lp-brush-br {
          bottom: 30px;
          right: -20px;
          width: 180px;
          height: 180px;
          transform: rotate(180deg);
        }

        /* Ticker */
        .lp-ticker-wrap {
          position: relative;
          z-index: 1;
          background: transparent;
          border-bottom: 1px solid rgba(240,225,200,0.1);
          overflow: hidden;
          padding: 9px 0;
        }
        .lp-ticker-inner {
          display: inline-block;
          white-space: nowrap;
          animation: lp-ticker 32s linear infinite;
          color: #f0e6d3;
          font-size: 0.62rem;
          letter-spacing: 0.28em;
          font-weight: 400;
          opacity: 0.55;
        }
        @keyframes lp-ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* Hero */
        .lp-hero {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 2.5rem 1.5rem 1.5rem;
          min-height: 52vw;
          max-height: 56vh;
          overflow: hidden;
        }

        /* Foto P&B de fundo com overlay */
        .lp-hero-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 20%;
          display: block;
          filter: grayscale(100%) brightness(0.5);
          z-index: 0;
        }
        .lp-hero-overlay {
          position: absolute;
          inset: 0;
          background: rgba(45, 20, 8, 0.72);
          z-index: 1;
        }

        /* Conteúdo do hero acima do overlay */
        .lp-hero > *:not(.lp-hero-bg):not(.lp-hero-overlay) {
          position: relative;
          z-index: 2;
        }

        /* Subtítulo acima do nome */
        .lp-supertitle {
          color: rgba(240,225,200,0.55);
          font-size: 0.6rem;
          letter-spacing: 0.3em;
          font-weight: 400;
          text-transform: uppercase;
          margin-bottom: 0.6rem;
          font-family: 'Inter', sans-serif;
        }

        /* Nome com typewriter */
        .lp-name {
          font-family: 'Cormorant Garamond', 'Georgia', serif;
          font-weight: 300;
          font-size: clamp(2.4rem, 10vw, 4rem);
          color: #f0e6d3;
          line-height: 1.05;
          letter-spacing: 0.02em;
          margin: 0 0 0.5rem;
          min-height: 1.1em;
        }
        .lp-cursor {
          display: inline-block;
          width: 2px;
          height: 0.85em;
          background: #c97a4a;
          margin-left: 2px;
          vertical-align: middle;
          border-radius: 1px;
        }

        /* Localidades */
        .lp-location {
          color: rgba(240,225,200,0.45);
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          font-weight: 300;
          margin-top: 0.3rem;
          font-family: 'Inter', sans-serif;
        }

        /* Foto flutuante */
        .lp-photo {
          position: absolute;
          bottom: -24px;
          right: 16px;
          width: 46%;
          max-width: 200px;
          aspect-ratio: 2/3;
          object-fit: cover;
          object-position: center 15%;
          box-shadow: -4px 6px 28px rgba(0,0,0,0.45);
          transform: rotate(1.5deg);
          border: 2px solid rgba(255,255,255,0.06);
          z-index: 2;
        }

        /* Divisor */
        .lp-divider {
          position: relative;
          z-index: 1;
          height: 1px;
          background: rgba(240,225,200,0.1);
          margin: 2rem 1.5rem 0;
        }

        /* Links */
        .lp-content {
          position: relative;
          z-index: 1;
          padding: 1.8rem 1.5rem 3.5rem;
          display: flex;
          flex-direction: column;
          margin-top: 16px;
        }

        .lp-nav {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .lp-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
          border-top: 1px solid rgba(240,225,200,0.1);
          text-decoration: none;
          transition: opacity 0.18s ease;
        }
        .lp-item:last-child {
          border-bottom: 1px solid rgba(240,225,200,0.1);
        }
        .lp-item:hover { opacity: 0.45; }

        .lp-item-label {
          color: #f0e6d3;
          font-size: 0.75rem;
          letter-spacing: 0.22em;
          font-weight: 500;
          text-transform: uppercase;
        }
        .lp-item-num {
          color: rgba(240,225,200,0.25);
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          font-weight: 300;
        }

        .lp-footer {
          color: rgba(240,225,200,0.18);
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          margin-top: 2.5rem;
          text-align: center;
          text-transform: uppercase;
        }

        @media (min-width: 600px) {
          .lp-hero { min-height: 40vh; max-height: 50vh; padding: 3rem 2rem 2rem; }
          .lp-photo { max-width: 240px; right: 24px; }
          .lp-content {
            max-width: 460px;
            margin: 16px auto 0;
            width: 100%;
            padding: 2rem 0 4rem;
          }
          .lp-divider { margin: 2rem auto 0; max-width: 460px; }
          .lp-item-label { font-size: 0.8rem; }
        }
      `}</style>

      <div className="lp-page">
        {/* Pincelada topo esquerdo */}
        <svg className="lp-brush lp-brush-tl" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 190 Q20 80 100 60 Q160 45 190 10" stroke="#c97a4a" strokeWidth="28" strokeLinecap="round" fill="none"/>
        </svg>
        {/* Pincelada baixo direito */}
        <svg className="lp-brush lp-brush-br" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 190 Q20 80 100 60 Q160 45 190 10" stroke="#c97a4a" strokeWidth="22" strokeLinecap="round" fill="none"/>
        </svg>

        {/* Ticker */}
        <div className="lp-ticker-wrap">
          <span className="lp-ticker-inner">
            {"CAMILLA VIEIRA · FOTOGRAFIA É ARTE · BRASÍLIA · SP · MG · RJ · ".repeat(6)}
          </span>
        </div>

        {/* Hero */}
        <div className="lp-hero">
          <img src={BG_IMAGE} alt="" className="lp-hero-bg" />
          <div className="lp-hero-overlay" />
          <p className="lp-supertitle">ATELIÊ DIGITAL</p>
          <h1 className="lp-name">
            {displayedName}
            {!nameComplete && <span className="lp-cursor" style={{ opacity: showCursor ? 1 : 0 }} />}
          </h1>
          <p className="lp-location">Brasília · São Paulo · Minas Gerais · e outros estados</p>
          <img src={FRONT_IMAGE} alt="Camilla Vieira" className="lp-photo" />
        </div>

        <div className="lp-divider" />

        {/* Links */}
        <div className="lp-content">
          <nav className="lp-nav">
            {links.map((link) => (
              <a
                key={link.num}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="lp-item"
              >
                <span className="lp-item-label">{link.label}</span>
                <span className="lp-item-num">{link.num}</span>
              </a>
            ))}
          </nav>
          <p className="lp-footer">camillavieira.art</p>
        </div>
      </div>
    </>
  );
}
