import { useEffect } from "react";

interface SEOProps {
  title?: string;
  /** Quando definido, usa este texto exato como document.title (sem concatenar o site name) */
  fullTitle?: string;
  description?: string;
  /** Descrição em inglês para mercados internacionais (EN/US/EU) */
  descriptionEn?: string;
  /** Descrição em francês para mercado francês/europeu */
  descriptionFr?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
  /** Habilita hreflang multilíngue (padrão: true na home) */
  enableHreflang?: boolean;
}

const SITE_NAME = "Camilla Vieira – Ateliê Digital";
const BASE_URL = "https://camillavieira.art";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;

// ─── Descrições otimizadas por idioma ────────────────────────────────────────

/** PT-BR — busca local (Brasília/Brasil) + autoridade nacional */
const DEFAULT_DESCRIPTION =
  "Fotógrafa artística em Brasília. Ensaios femininos, gestante e fotografia autoral com alma. Obras da Série Fio e mentorias. Agende seu ensaio.";

/** EN — busca internacional (EUA, Europa anglófona) */
const DEFAULT_DESCRIPTION_EN =
  "Brazilian fine art photographer based in Brasília. Feminine & maternity portraits, original artworks and photography mentoring. Available worldwide.";

/** FR — busca francesa e europeia francófona */
const DEFAULT_DESCRIPTION_FR =
  "Photographe artistique brésilienne basée à Brasília. Portraits féminins, maternité et œuvres d'art originales. Disponible en France et en Europe.";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function setMeta(name: string, content: string, property = false) {
  const attr = property ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

/** Adiciona ou atualiza uma tag <link rel="alternate" hreflang="..." href="..."> */
function setHreflang(hreflang: string, href: string) {
  const selector = `link[rel="alternate"][hreflang="${hreflang}"]`;
  let el = document.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "alternate");
    el.setAttribute("hreflang", hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/** Remove todas as tags hreflang existentes (para páginas sem hreflang) */
function removeHreflang() {
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
}

// ─── Hook principal ───────────────────────────────────────────────────────────

export function useSEO({
  title,
  fullTitle: fullTitleOverride,
  description = DEFAULT_DESCRIPTION,
  descriptionEn = DEFAULT_DESCRIPTION_EN,
  descriptionFr = DEFAULT_DESCRIPTION_FR,
  keywords,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  noIndex = false,
  enableHreflang = false,
}: SEOProps = {}) {
  useEffect(() => {
    // ── Title ──────────────────────────────────────────────────────────────────
    const fullTitle = fullTitleOverride
      ? fullTitleOverride
      : title
        ? `${title} | ${SITE_NAME}`
        : `Camilla Vieira | Fotógrafa Artística`;
    document.title = fullTitle;

    // ── Primary SEO ────────────────────────────────────────────────────────────
    setMeta("description", description);
    if (keywords) setMeta("keywords", keywords);
    setMeta("robots", noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1");

    // ── Idioma e geo ───────────────────────────────────────────────────────────
    document.documentElement.setAttribute("lang", "pt-BR");
    setMeta("language", "pt-BR");
    setMeta("geo.region", "BR-DF");
    setMeta("geo.placename", "Brasília, Distrito Federal, Brasil");
    setMeta("geo.position", "-15.7801;-47.9292");
    setMeta("ICBM", "-15.7801, -47.9292");

    // ── Canonical ──────────────────────────────────────────────────────────────
    const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : `${BASE_URL}${window.location.pathname}`;
    setCanonical(canonicalUrl);

    // ── Open Graph (PT-BR principal) ───────────────────────────────────────────
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", description, true);
    setMeta("og:image", ogImage, true);
    setMeta("og:url", canonicalUrl, true);
    setMeta("og:type", ogType, true);
    setMeta("og:locale", "pt_BR", true);
    // Locales alternativos para distribuição internacional
    setMeta("og:locale:alternate", "en_US", true);
    setMeta("og:locale:alternate", "en_GB", true);
    setMeta("og:locale:alternate", "fr_FR", true);
    setMeta("og:site_name", SITE_NAME, true);

    // ── Twitter Cards ──────────────────────────────────────────────────────────
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", ogImage);
    setMeta("twitter:site", "@camillavieira_art");

    // ── Hreflang multilíngue (apenas quando habilitado) ────────────────────────
    // Sinaliza ao Google que o mesmo conteúdo serve múltiplos mercados linguísticos.
    // Usado na home e em páginas com audiência internacional.
    if (enableHreflang) {
      const path = canonical ?? window.location.pathname;
      setHreflang("pt-BR", `${BASE_URL}${path}`);          // Brasil
      setHreflang("pt",    `${BASE_URL}${path}`);           // Português global
      setHreflang("en",    `${BASE_URL}${path}`);           // Inglês global
      setHreflang("en-US", `${BASE_URL}${path}`);           // EUA
      setHreflang("en-GB", `${BASE_URL}${path}`);           // Reino Unido
      setHreflang("fr",    `${BASE_URL}${path}`);           // Francês global
      setHreflang("fr-FR", `${BASE_URL}${path}`);           // França
      setHreflang("fr-BE", `${BASE_URL}${path}`);           // Bélgica
      setHreflang("fr-CH", `${BASE_URL}${path}`);           // Suíça
      setHreflang("x-default", `${BASE_URL}${path}`);       // Fallback global
    } else {
      removeHreflang();
    }

    // ── Meta descriptions internacionais (EN + FR) ─────────────────────────────
    // Usadas por scrapers e agregadores internacionais que leem meta tags específicas.
    setMeta("description:en", descriptionEn);
    setMeta("description:fr", descriptionFr);

  }, [title, description, descriptionEn, descriptionFr, keywords, canonical, ogImage, ogType, noIndex, enableHreflang]);
}

// ─── Exporta constantes para uso em outros módulos ───────────────────────────
export { DEFAULT_DESCRIPTION, DEFAULT_DESCRIPTION_EN, DEFAULT_DESCRIPTION_FR };
