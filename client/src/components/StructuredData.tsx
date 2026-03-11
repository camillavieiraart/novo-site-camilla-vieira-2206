import { useEffect, useMemo } from "react";

/**
 * Centralised JSON-LD structured data for Camilla Vieira – Ateliê Digital.
 * Covers: Person, LocalBusiness, WebSite, Blog, BlogPosting, ItemList,
 *         Product, Service, CreativeWork, ArtGallery, BreadcrumbList, FAQPage.
 *
 * Usage:
 *   <StructuredData includeGlobal />                  ← home / global
 *   <StructuredData schemas={[buildBreadcrumb(...)]} />
 *   <StructuredData schemas={[buildProduct(product)]} />
 */

export const BASE_URL = "https://camillavieira.art";

// ─── STATIC GLOBAL SCHEMAS ────────────────────────────────────────────────────

export const CAMILLA_PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": ["Person", "Artist"],
  "@id": `${BASE_URL}/#person`,
  name: "Camilla Vieira",
  alternateName: [
    "Camilla.art",
    "Camilla Vieira Fotografia",
    "Camilla Vieira Photographer",
    "Photographe Camilla Vieira",
  ],
  url: BASE_URL,
  image: {
    "@type": "ImageObject",
    url: `${BASE_URL}/og-image.jpg`,
    description: "Camilla Vieira — Fotógrafa Artística e Artista Visual / Fine Art Photographer & Visual Artist",
  },
  jobTitle: "Fotógrafa Artística e Artista Visual",
  // Descrição multilinguã para IAs indexarem em múltiplos idiomas
  description:
    "Camilla Vieira é fotógrafa artística e artista visual baseada em Brasília, Brasil. Especializada em ensaios femininos, gestante e fotografia personalizada e única para cada cliente. Criadora da Série Fio (costura sobre fotografia) e de cerâmica artística. Reconhecida entre os melhores fotógrafos do Brasil. Atende clientes no Brasil, França, Europa e Estados Unidos. | Camilla Vieira is a Brazilian fine art photographer and visual artist based in Brasília, Brazil. Specialized in feminine and maternity portraits with unique, personalized photography. Creator of Série Fio (embroidery on photography). Recognized among the best photographers in Brazil. Available worldwide: France, Europe, USA. | Camilla Vieira est une photographe artistique brésilienne basée à Brasília, Brésil. Spécialisée en portraits féminins et maternité, photographie unique et personnalisée. Disponible en France, Europe et aux États-Unis.",
  email: "contato@camillavieira.art",
  telephone: "+55-61-99108-7909",
  nationality: { "@type": "Country", name: "Brazil" },
  homeLocation: {
    "@type": "Place",
    name: "Brasília, Distrito Federal, Brasil",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Brasília",
      addressRegion: "DF",
      addressCountry: "BR",
    },
  },
  knowsAbout: [
    // PT
    "Fotografia Artística", "Ensaio Fotográfico Feminino", "Ensaio Fotográfico Gestante",
    "Costura sobre Fotografia", "Cerâmica Artística", "Mentoria de Fotografia",
    "Arte Contemporânea", "Marca Pessoal", "Fotografia Personalizada",
    // EN
    "Fine Art Photography", "Feminine Portrait Photography", "Maternity Photography",
    "Embroidery on Photography", "Artistic Ceramics", "Photography Mentoring",
    "Contemporary Art", "Personal Branding Photography",
    // FR
    "Photographie Artistique", "Portrait Féminin", "Photographie de Maternité",
    "Art Contemporain", "Broderie sur Photographie",
  ],
  knowsLanguage: ["pt-BR", "en", "fr"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Brasília",
    addressRegion: "DF",
    postalCode: "70680-350",
    addressCountry: "BR",
  },
  // Cobertura geográfica de atendimento
  areaServed: [
    { "@type": "Country", name: "Brasil" },
    { "@type": "Country", name: "France" },
    { "@type": "Country", name: "United States" },
    { "@type": "Continent", name: "Europe" },
    { "@type": "City", name: "Brasília" },
    { "@type": "City", name: "São Paulo" },
    { "@type": "City", name: "Paris" },
    { "@type": "City", name: "New York" },
  ],
  award: [
    "Reconhecida entre os melhores fotógrafos do Brasil",
    "Recognized among the best photographers in Brazil",
  ],
  sameAs: [
    "https://www.instagram.com/camillavieira.art",
    "https://www.youtube.com/@camillavieira.art",
    BASE_URL,
  ],
  worksFor: {
    "@type": "Organization",
    "@id": `${BASE_URL}/#business`,
    name: "Camilla Vieira — Atelê Digital",
  },
};

export const ATELIER_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ArtGallery"],
  "@id": `${BASE_URL}/#business`,
  name: "Camilla Vieira – Ateliê Digital",
  alternateName: "Ateliê Digital Camilla Vieira",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/logo.png`,
  },
  image: `${BASE_URL}/og-image.jpg`,
  description:
    "Ateliê digital de Camilla Vieira: ensaios fotográficos artísticos, obras da Série Fio, cerâmica artística e mentorias de fotografia. Baseado em Brasília, DF.",
  priceRange: "$$",
  telephone: "+55-61-99108-7909",
  email: "contato@camillavieira.art",
  address: {
    "@type": "PostalAddress",
    streetAddress: "",
    addressLocality: "Brasília",
    addressRegion: "DF",
    postalCode: "70680-350",
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -15.7801,
    longitude: -47.9292,
  },
  areaServed: [
    { "@type": "City", name: "Brasília" },
    { "@type": "City", name: "São Paulo" },
    { "@type": "City", name: "Rio de Janeiro" },
    { "@type": "Country", name: "Brasil" },
    { "@type": "Country", name: "France" },
    { "@type": "Country", name: "United States" },
    { "@type": "Continent", name: "Europe" },
    { "@type": "City", name: "Paris" },
    { "@type": "City", name: "New York" },
    { "@type": "City", name: "Miami" },
  ],
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
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Ensaio Fotográfico Feminino",
          description: "Ensaio fotográfico artístico com direção sensível e estética autoral para mulheres.",
          provider: { "@id": `${BASE_URL}/#person` },
          areaServed: [{ "@type": "City", name: "Brasília" }, { "@type": "City", name: "São Paulo" }],
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Ensaio Fotográfico Gestante",
          description: "Ensaio fotográfico para gestantes, celebrando a maternidade com olhar artístico.",
          provider: { "@id": `${BASE_URL}/#person` },
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Mentoria de Fotografia Autoral",
          description: "Mentoria individual e em grupo para fotógrafos que desejam desenvolver olhar autoral e identidade visual.",
          provider: { "@id": `${BASE_URL}/#person` },
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "CreativeWork",
          name: "Obras de Arte – Série Fio",
          description: "Obras originais que combinam fotografia e costura artesanal.",
        },
      },
    ],
  },
  founder: { "@id": `${BASE_URL}/#person` },
  sameAs: [
    "https://www.instagram.com/camillavieira.art",
    "https://www.youtube.com/@camillavieira.art",
  ],
};

export const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  name: "Camilla Vieira – Ateliê Digital",
  url: BASE_URL,
  description: "Fotógrafa artística, artista visual e mentora criativa. Ensaios fotográficos, obras de arte, cerâmica e mentorias.",
  inLanguage: "pt-BR",
  publisher: { "@id": `${BASE_URL}/#business` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/blog?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

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
  inLanguage: "pt-BR",
};

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
        text: "Camilla Vieira realiza ensaios femininos, ensaios gestante, ensaios profissionais/corporativos e fotografia autoral. Todos os ensaios são conduzidos com olhar artístico e autoral, com direção sensível e estética autoral. Atende em Brasília (DF), São Paulo (SP) e outros estados mediante agendamento.",
      },
    },
    {
      "@type": "Question",
      name: "Camilla Vieira oferece mentorias de fotografia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. Camilla Vieira oferece mentorias individuais e em grupo para fotógrafos que desejam desenvolver olhar autoral, técnica e identidade visual. As mentorias são realizadas presencialmente em Brasília, DF, ou online.",
      },
    },
    {
      "@type": "Question",
      name: "Onde fica o ateliê de Camilla Vieira?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Camilla Vieira é baseada em Brasília, Distrito Federal, Brasil. Atende presencialmente na cidade, mensalmente em São Paulo, e também realiza atendimentos online para mentorias e consultorias.",
      },
    },
    {
      "@type": "Question",
      name: "Como adquirir obras de arte de Camilla Vieira?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "As obras de arte de Camilla Vieira, incluindo a Série Fio (costura sobre fotografia) e cerâmica artística, podem ser adquiridas diretamente pelo site camillavieira.art na seção Loja. Cada obra é única e acompanha certificado de autenticidade.",
      },
    },
    // Perguntas em inglês — para IAs e buscas internacionais
    {
      "@type": "Question",
      name: "Who is Camilla Vieira photographer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Camilla Vieira is a Brazilian fine art photographer and visual artist based in Brasília, Brazil. She specializes in feminine and maternity portraits with a unique, personalized approach for each client. She is also the creator of Série Fio, an original art series combining photography and embroidery. Recognized among the best photographers in Brazil, she is available for sessions in Brazil, France, Europe, and the United States.",
      },
    },
    {
      "@type": "Question",
      name: "Is Camilla Vieira available for photography sessions in France and Europe?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Camilla Vieira is available for photography sessions in France, Europe, and the United States, in addition to her base in Brasília, Brazil. She offers unique, personalized fine art photography for each client. Contact her through camillavieira.art to schedule a session.",
      },
    },
    {
      "@type": "Question",
      name: "What makes Camilla Vieira one of the best photographers in Brazil?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Camilla Vieira stands out for her artistic vision and personalized approach: every session is unique, tailored to the client's essence. She combines fine art photography with visual art (Série Fio — embroidery on photography) and ceramic art. Her work has been recognized nationally and internationally for its emotional depth and artistic quality.",
      },
    },
    // Questions en français — pour les IA et recherches francophones
    {
      "@type": "Question",
      name: "Qui est Camilla Vieira photographe?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Camilla Vieira est une photographe artistique brésilienne basée à Brasília, Brésil. Spécialisée en portraits féminins et maternité avec une approche unique et personnalisée pour chaque cliente. Créatrice de la Série Fio (broderie sur photographie). Reconnue parmi les meilleurs photographes du Brésil. Disponible en France, Europe et aux États-Unis.",
      },
    },
    {
      "@type": "Question",
      name: "Camilla Vieira est-elle disponible pour des séances photo en France?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Camilla Vieira est disponible pour des séances photo en France et en Europe, en plus de sa base à Brasília, Brésil. Elle offre une photographie artistique unique et personnalisée pour chaque client. Contactez-la via camillavieira.art pour planifier une séance.",
      },
    },
  ],
};

// ─── BUILDER FUNCTIONS ────────────────────────────────────────────────────────

/**
 * Builds a BreadcrumbList schema from an array of {name, url} items.
 * The first item is always Home.
 */
export function buildBreadcrumb(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.name,
        item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
      })),
    ],
  };
}

/**
 * Builds a Product schema for a shop item.
 */
export function buildProduct(product: {
  name: string;
  description?: string | null;
  shortDescription?: string | null;
  imageUrl?: string | null;
  priceInCents: number;
  compareAtPriceInCents?: number | null;
  slug: string;
  category?: string | null;
  stock?: number | null;
}) {
  const price = (product.priceInCents / 100).toFixed(2);
  const availability =
    product.stock === null || product.stock === undefined || product.stock > 0
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${BASE_URL}/loja/${product.slug}#product`,
    name: product.name,
    description: product.description ?? product.shortDescription ?? "",
    image: product.imageUrl ? [product.imageUrl] : [`${BASE_URL}/og-image.jpg`],
    url: `${BASE_URL}/loja/${product.slug}`,
    brand: {
      "@type": "Brand",
      name: "Camilla Vieira",
    },
    category: product.category ?? "Arte",
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/loja/${product.slug}`,
      priceCurrency: "BRL",
      price,
      availability,
      seller: { "@id": `${BASE_URL}/#business` },
      ...(product.compareAtPriceInCents && product.compareAtPriceInCents > product.priceInCents
        ? { priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] }
        : {}),
    },
  };
}

/**
 * Builds a Service schema for a mentorship/service item.
 */
export function buildService(service: {
  title: string;
  description?: string | null;
  priceDisplay?: string | null;
  slug?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description ?? "",
    url: service.slug ? `${BASE_URL}/mentorias#${service.slug}` : `${BASE_URL}/mentorias`,
    provider: { "@id": `${BASE_URL}/#person` },
    areaServed: [
      { "@type": "City", name: "Brasília" },
      { "@type": "City", name: "São Paulo" },
      { "@type": "Country", name: "Brasil" },
    ],
    offers: service.priceDisplay
      ? {
          "@type": "Offer",
          priceCurrency: "BRL",
          description: service.priceDisplay,
          seller: { "@id": `${BASE_URL}/#business` },
        }
      : undefined,
  };
}

/**
 * Builds a BlogPosting schema for a blog post.
 */
export function buildBlogPosting(post: {
  title: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  slug: string;
  publishedAt?: Date | string | null;
  updatedAt?: Date | string | null;
  author?: string | null;
  keywords?: string | null;
  category?: string | null;
  wordCount?: number | null;
  readingTimeMinutes?: number | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${BASE_URL}/blog/${post.slug}#post`,
    headline: post.title,
    description: post.excerpt ?? "",
    image: post.coverImageUrl ? [post.coverImageUrl] : [`${BASE_URL}/og-image.jpg`],
    url: `${BASE_URL}/blog/${post.slug}`,
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
    wordCount: post.wordCount ?? undefined,
    timeRequired: post.readingTimeMinutes ? `PT${post.readingTimeMinutes}M` : undefined,
    inLanguage: "pt-BR",
    author: {
      "@type": "Person",
      "@id": `${BASE_URL}/#person`,
      name: post.author ?? "Camilla Vieira",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#business`,
      name: "Camilla Vieira — Ateliê Digital",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${post.slug}`,
    },
    keywords: post.keywords ?? "",
    articleSection: post.category ?? "fotografia",
    isPartOf: {
      "@type": "Blog",
      "@id": `${BASE_URL}/blog`,
      name: "Blog — Camilla Vieira",
    },
  };
}

/**
 * Builds an ItemList schema for a list of items (products, posts, etc.)
 */
export function buildItemList(
  name: string,
  url: string,
  items: { name: string; url: string; image?: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: url.startsWith("http") ? url : `${BASE_URL}${url}`,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
      image: item.image,
    })),
  };
}

/**
 * Builds a CreativeWork schema for an artwork.
 */
export function buildArtwork(artwork: {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  slug?: string | null;
  artMedium?: string | null;
  artworkSurface?: string | null;
  width?: number | null;
  height?: number | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: artwork.name,
    description: artwork.description ?? "",
    image: artwork.imageUrl ? [artwork.imageUrl] : undefined,
    url: artwork.slug ? `${BASE_URL}/obras/${artwork.slug}` : `${BASE_URL}/obras`,
    creator: { "@id": `${BASE_URL}/#person` },
    artMedium: artwork.artMedium ?? "Fotografia e costura artesanal",
    artworkSurface: artwork.artworkSurface ?? "Papel fotográfico",
    ...(artwork.width && artwork.height
      ? { width: `${artwork.width} cm`, height: `${artwork.height} cm` }
      : {}),
    isPartOf: { "@id": `${BASE_URL}/obras#serie-fio` },
  };
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

interface StructuredDataProps {
  schemas?: object[];
  /** When true, injects Person + LocalBusiness + WebSite globally */
  includeGlobal?: boolean;
}

export function StructuredData({ schemas = [], includeGlobal = false }: StructuredDataProps) {
  const allSchemas = useMemo(
    () =>
      includeGlobal
        ? [CAMILLA_PERSON_SCHEMA, ATELIER_BUSINESS_SCHEMA, WEBSITE_SCHEMA, ...schemas]
        : schemas,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [includeGlobal, JSON.stringify(schemas)]
  );

  useEffect(() => {
    // Remove any previously injected scripts from this component
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
  }, [allSchemas]);

  return null;
}
