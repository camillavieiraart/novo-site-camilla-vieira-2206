/**
 * Catálogo de produtos — Consultoria de Marca Pessoal
 * Camilla Vieira · camillavieira.art
 * Preços em centavos (BRL)
 */

export type ProductType =
  | "package_essencial"
  | "package_profissional"
  | "package_premium"
  | "avulso_roteiro_video"
  | "avulso_ideias_posts"
  | "avulso_analise_instagram"
  | "avulso_guia_marca"
  | "avulso_calendario"
  | "avulso_mentoria"
  | "avulso_consultoria";

export interface DeliverableTemplate {
  itemName: string;
  itemType:
    | "fotos"
    | "video_40s"
    | "videos_audio"
    | "filmagem"
    | "analise_instagram"
    | "ideias_posts"
    | "calendario"
    | "guia_pdf"
    | "mentoria"
    | "consultoria"
    | "roteiro_video"
    | "suporte_whatsapp";
  deadlineDays: number | null; // null = agendar manualmente
}

export interface MarcaPessoalProduct {
  type: ProductType;
  name: string;
  tagline: string;
  description: string;
  price: number; // em centavos
  isPackage: boolean;
  isFeatured?: boolean;
  deliveryWeeks?: string;
  additionalPersonPrice?: number;
  deliverables: DeliverableTemplate[];
}

export const MARCA_PESSOAL_PRODUCTS: Record<ProductType, MarcaPessoalProduct> = {
  package_essencial: {
    type: "package_essencial",
    name: "Essencial",
    tagline: "Para profissionais que querem começar a se posicionar",
    description: "O ponto de partida para construir uma presença profissional autêntica e consistente.",
    price: 219700,
    isPackage: true,
    deliveryWeeks: "2 semanas",
    additionalPersonPrice: 150000,
    deliverables: [
      { itemName: "Consultoria Inicial (1h)", itemType: "consultoria", deadlineDays: null },
      { itemName: "15 Fotos Profissionais Editadas", itemType: "fotos", deadlineDays: 10 },
      { itemName: "Vídeo 40s com cortes do ensaio", itemType: "video_40s", deadlineDays: 10 },
      { itemName: "10 Ideias de Posts + Legendas", itemType: "ideias_posts", deadlineDays: 7 },
      { itemName: "Calendário de Conteúdo (6 semanas)", itemType: "calendario", deadlineDays: 7 },
      { itemName: "Guia de Marca Pessoal PDF (5 páginas)", itemType: "guia_pdf", deadlineDays: 10 },
    ],
  },
  package_profissional: {
    type: "package_profissional",
    name: "Profissional",
    tagline: "Para executivos e empreendedores que querem estratégia completa",
    description: "Estratégia visual e de conteúdo completa para quem quer liderar conversas no mercado.",
    price: 419700,
    isPackage: true,
    isFeatured: true,
    deliveryWeeks: "3 semanas",
    additionalPersonPrice: 130000,
    deliverables: [
      { itemName: "Consultoria Profunda (1.5h)", itemType: "consultoria", deadlineDays: null },
      { itemName: "25 Fotos Profissionais Editadas", itemType: "fotos", deadlineDays: 14 },
      { itemName: "Vídeo 40s com cortes do ensaio", itemType: "video_40s", deadlineDays: 18 },
      { itemName: "2 Vídeos com Áudio", itemType: "videos_audio", deadlineDays: 18 },
      { itemName: "Análise Completa de Instagram", itemType: "analise_instagram", deadlineDays: 3 },
      { itemName: "20 Ideias de Posts + Legendas", itemType: "ideias_posts", deadlineDays: 7 },
      { itemName: "Calendário de Conteúdo (8 semanas)", itemType: "calendario", deadlineDays: 7 },
      { itemName: "Guia de Marca Pessoal PDF (15 páginas)", itemType: "guia_pdf", deadlineDays: 14 },
    ],
  },
  package_premium: {
    type: "package_premium",
    name: "Premium",
    tagline: "Para líderes que querem transformação total de marca",
    description: "Transformação completa com mentoria, filmagem de conteúdo e suporte contínuo.",
    price: 749700,
    isPackage: true,
    deliveryWeeks: "4 semanas",
    additionalPersonPrice: 120000,
    deliverables: [
      { itemName: "Consultoria Estratégica (2h)", itemType: "consultoria", deadlineDays: null },
      { itemName: "40 Fotos Profissionais Editadas", itemType: "fotos", deadlineDays: 21 },
      { itemName: "Vídeo 40s com cortes do ensaio", itemType: "video_40s", deadlineDays: 25 },
      { itemName: "4 Vídeos com Áudio", itemType: "videos_audio", deadlineDays: 25 },
      { itemName: "Filmagem de Conteúdo (1.5h)", itemType: "filmagem", deadlineDays: 25 },
      { itemName: "Análise de Instagram + 3 Concorrentes", itemType: "analise_instagram", deadlineDays: 3 },
      { itemName: "30 Ideias de Posts + Legendas", itemType: "ideias_posts", deadlineDays: 7 },
      { itemName: "Calendário de Conteúdo (12 semanas)", itemType: "calendario", deadlineDays: 7 },
      { itemName: "Guia de Marca Pessoal PDF (25 páginas)", itemType: "guia_pdf", deadlineDays: 21 },
      { itemName: "2 Sessões de Mentoria Individual", itemType: "mentoria", deadlineDays: null },
      { itemName: "Suporte WhatsApp 30 dias", itemType: "suporte_whatsapp", deadlineDays: null },
    ],
  },
  avulso_roteiro_video: {
    type: "avulso_roteiro_video",
    name: "Roteiro de Vídeo",
    tagline: "Roteiro completo para Reels, LinkedIn ou YouTube Shorts",
    description: "Roteiro personalizado para 1 vídeo, com gancho, desenvolvimento e CTA.",
    price: 29700,
    isPackage: false,
    deliverables: [
      { itemName: "Roteiro de Vídeo Personalizado", itemType: "roteiro_video", deadlineDays: 2 },
    ],
  },
  avulso_ideias_posts: {
    type: "avulso_ideias_posts",
    name: "10 Ideias de Posts + Legendas",
    tagline: "Conteúdo estratégico pronto para publicar",
    description: "10 ideias personalizadas com legendas completas e hashtags estratégicas.",
    price: 39700,
    isPackage: false,
    deliverables: [
      { itemName: "10 Ideias de Posts + Legendas Completas", itemType: "ideias_posts", deadlineDays: 3 },
    ],
  },
  avulso_analise_instagram: {
    type: "avulso_analise_instagram",
    name: "Análise de Instagram",
    tagline: "Diagnóstico completo do seu perfil",
    description: "Relatório detalhado com pontos de melhoria, estratégia de conteúdo e recomendações.",
    price: 49700,
    isPackage: false,
    deliverables: [
      { itemName: "Relatório de Análise de Instagram", itemType: "analise_instagram", deadlineDays: 3 },
    ],
  },
  avulso_guia_marca: {
    type: "avulso_guia_marca",
    name: "Guia de Marca Pessoal PDF",
    tagline: "Identidade visual, tom de voz e posicionamento",
    description: "Guia personalizado com tudo que define sua marca: cores, tipografia, tom e mensagem.",
    price: 49700,
    isPackage: false,
    deliverables: [
      { itemName: "Guia de Marca Pessoal PDF Personalizado", itemType: "guia_pdf", deadlineDays: 5 },
    ],
  },
  avulso_calendario: {
    type: "avulso_calendario",
    name: "Calendário de Conteúdo",
    tagline: "4 semanas de conteúdo planejado",
    description: "Calendário editorial completo com temas, formatos e legendas prontas para publicar.",
    price: 59700,
    isPackage: false,
    deliverables: [
      { itemName: "Calendário de Conteúdo 4 Semanas", itemType: "calendario", deadlineDays: 5 },
    ],
  },
  avulso_mentoria: {
    type: "avulso_mentoria",
    name: "Mentoria Individual (1h)",
    tagline: "Sessão individual de estratégia de marca",
    description: "Acompanhamento personalizado para acelerar seu posicionamento e presença digital.",
    price: 59700,
    isPackage: false,
    deliverables: [
      { itemName: "Sessão de Mentoria Individual (1h)", itemType: "mentoria", deadlineDays: null },
    ],
  },
  avulso_consultoria: {
    type: "avulso_consultoria",
    name: "Consultoria Estratégica (1h)",
    tagline: "Diagnóstico e plano de ação para sua marca",
    description: "Sessão focada em posicionamento, diferenciação e estratégia de marca pessoal.",
    price: 79700,
    isPackage: false,
    deliverables: [
      { itemName: "Consultoria Estratégica (1h)", itemType: "consultoria", deadlineDays: null },
    ],
  },
};

export function calculateGroupPrice(
  product: MarcaPessoalProduct,
  numberOfPeople: number
): {
  basePrice: number;
  additionalCost: number;
  discountAmount: number;
  totalPrice: number;
  discountPercent: number;
} {
  const basePrice = product.price;
  if (numberOfPeople <= 1 || !product.additionalPersonPrice) {
    return { basePrice, additionalCost: 0, discountAmount: 0, totalPrice: basePrice, discountPercent: 0 };
  }
  const additionalPeople = numberOfPeople - 1;
  const additionalCost = additionalPeople * product.additionalPersonPrice;
  const rawTotal = basePrice + additionalCost;
  const discountPercent = numberOfPeople >= 3 && numberOfPeople <= 5 ? 5 : 0;
  const discountAmount = Math.round(rawTotal * (discountPercent / 100));
  const totalPrice = rawTotal - discountAmount;
  return { basePrice, additionalCost, discountAmount, totalPrice, discountPercent };
}
