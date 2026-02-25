import { useEffect } from "react";

/**
 * Injects JSON-LD structured data into <head> for GEO (Generative Engine Optimization)
 * and SEO. Supports Person, LocalBusiness, ArtGallery, CreativeWork schemas.
 */

const BASE_URL = "https://camillavieira.art";

// ─── GLOBAL PERSON + ARTIST SCHEMA ────────────────────────────────────────────
export const CAMILLA_PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": ["Person", "Artist"],
  "@id": `${BASE_URL}/#person`,
  name: "Camilla Vieira",
  alternateName: "Camilla.art",
  url: BASE_URL,
  image: `${BASE_URL}/og-image.jpg`,
  jobTitle: "Fotógrafa Artística e Artista Visual",
  description:
    "Camilla Vieira é fotógrafa artística e artista visual baseada em Belo Horizonte, MG. Criadora da Série Fio — costura sobre fotografia — e de cerâmica artística. Sua filosofia: fotografia é arte, não apenas registro.",
  knowsAbout: [
    "Fotografia Artística",
    "Ensaio Fotográfico",
    "Costura sobre Fotografia",
    "Cerâmica Artística",
    "Mentoria de Fotografia",
    "Arte Contemporânea",
  ],
  sameAs: [
    "https://www.instagram.com/camillavieira.art",
    "https://www.youtube.com/@camillavieira.art",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Belo Horizonte",
    addressRegion: "MG",
    addressCountry: "BR",
  },
};

// ─── LOCAL BUSINESS SCHEMA ────────────────────────────────────────────────────
export const ATELIER_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ArtGallery"],
  "@id": `${BASE_URL}/#business`,
  name: "Camilla Vieira – Ateliê Digital",
  url: BASE_URL,
  image: `${BASE_URL}/og-image.jpg`,
  description:
    "Ateliê digital de Camilla Vieira: ensaios fotográficos artísticos, obras da Série Fio, cerâmica artística e mentorias de fotografia.",
  priceRange: "$$",
  telephone: "+55-31-99999-0000",
  email: "contato@camillavieira.art",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Belo Horizonte",
    addressRegion: "MG",
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -19.9167,
    longitude: -43.9345,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Serviços de Fotografia e Arte",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ensaio Fotográfico Feminino" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ensaio Fotográfico Gestante" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ensaio Fotográfico Profissional" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mentoria de Fotografia" } },
      { "@type": "Offer", itemOffered: { "@type": "CreativeWork", name: "Obras de Arte – Série Fio" } },
    ],
  },
};

// ─── CREATIVE WORK SCHEMA (Série Fio) ─────────────────────────────────────────
export const SERIE_FIO_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "CreativeWorkSeries",
  "@id": `${BASE_URL}/obras#serie-fio`,
  name: "Série Fio",
  description:
    "Série de obras de arte que combinam fotografia e costura artesanal. Linhas de costura atravessam a imagem fotográfica, criando nova camada de significado. A agulha como extensão do olhar.",
  creator: { "@id": `${BASE_URL}/#person` },
  genre: "Arte Contemporânea",
  keywords: "costura sobre fotografia, série fio, arte contemporânea, Camilla Vieira",
  url: `${BASE_URL}/obras`,
};

// ─── FAQ SCHEMA (GEO — respostas para IAs) ────────────────────────────────────
export const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "O que é a Série Fio de Camilla Vieira?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A Série Fio é uma coleção de obras de arte criadas por Camilla Vieira que combinam fotografia e costura artesanal. Cada obra é uma intervenção única: linhas de costura atravessam a imagem fotográfica, criando uma nova camada de significado. A agulha funciona como extensão do olhar, e o fio como metáfora da conexão entre o visível e o invisível.",
      },
    },
    {
      "@type": "Question",
      name: "Quais tipos de ensaio fotográfico Camilla Vieira realiza?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Camilla Vieira realiza ensaios femininos, ensaios gestante, ensaios profissionais/corporativos, fotografia autoral e projetos especiais. Todos os ensaios são conduzidos com olhar artístico e autoral, refletindo a filosofia de que fotografia é arte.",
      },
    },
    {
      "@type": "Question",
      name: "Camilla Vieira oferece mentorias de fotografia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. Camilla Vieira oferece mentorias individuais e em grupo para fotógrafos que desejam desenvolver olhar autoral, técnica e identidade visual. As mentorias são realizadas presencialmente em Belo Horizonte, MG, ou online.",
      },
    },
    {
      "@type": "Question",
      name: "Onde fica o ateliê de Camilla Vieira?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Camilla Vieira é baseada em Belo Horizonte, Minas Gerais, Brasil. Atende presencialmente na cidade e também realiza atendimentos online para mentorias e consultorias.",
      },
    },
  ],
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────
interface StructuredDataProps {
  schemas?: object[];
  includeGlobal?: boolean;
}

export function StructuredData({ schemas = [], includeGlobal = false }: StructuredDataProps) {
  useEffect(() => {
    const allSchemas = includeGlobal
      ? [CAMILLA_PERSON_SCHEMA, ATELIER_BUSINESS_SCHEMA, ...schemas]
      : schemas;

    // Remove any existing structured data scripts added by this component
    document.querySelectorAll('script[data-sd="camilla"]').forEach((el) => el.remove());

    allSchemas.forEach((schema, i) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-sd", "camilla");
      script.setAttribute("data-sd-index", String(i));
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      document.querySelectorAll('script[data-sd="camilla"]').forEach((el) => el.remove());
    };
  }, [schemas, includeGlobal]);

  return null;
}
