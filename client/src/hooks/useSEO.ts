import { useEffect } from "react";

interface SEOProps {
  title?: string;
  /** Quando definido, usa este texto exato como document.title (sem concatenar o site name) */
  fullTitle?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
}

const SITE_NAME = "Camilla Vieira – Ateliê Digital";
const BASE_URL = "https://camillavieira.art";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;
const DEFAULT_DESCRIPTION =
  "Ensaios femininos, gestante e fotografia autoral com alma. Obras da Série Fio, cerâmica artística e mentorias em Brasília, DF.";

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

export function useSEO({
  title,
  fullTitle: fullTitleOverride,
  description = DEFAULT_DESCRIPTION,
  keywords,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  noIndex = false,
}: SEOProps = {}) {
  useEffect(() => {
    // Title: fullTitle override > title + site name > fallback
    const fullTitle = fullTitleOverride
      ? fullTitleOverride
      : title
        ? `${title} | ${SITE_NAME}`
        : `Camilla Vieira | Fotógrafa Artística`;
    document.title = fullTitle;

    // Primary SEO
    setMeta("description", description);
    if (keywords) setMeta("keywords", keywords);
    setMeta("robots", noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1");

    // Canonical
    const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : `${BASE_URL}${window.location.pathname}`;
    setCanonical(canonicalUrl);

    // Open Graph
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", description, true);
    setMeta("og:image", ogImage, true);
    setMeta("og:url", canonicalUrl, true);
    setMeta("og:type", ogType, true);

    // Twitter Cards
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", ogImage);
  }, [title, description, keywords, canonical, ogImage, ogType, noIndex]);
}
