/**
 * Blog Agent — Camilla Vieira
 * Agente autônomo que pesquisa tendências, escreve posts no estilo da Camilla
 * e publica automaticamente no blog toda quinta-feira às 9h (horário de Brasília).
 *
 * Executado pelo agendador em server/scheduler.ts
 */

import { getDb } from "./db";
import { blogPosts } from "../drizzle/schema";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import { storagePut } from "./storage";
import { notifyOwner } from "./_core/notification";
import { eq } from "drizzle-orm";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 80);
}

function countWords(html: string): number {
  return html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
}

// ─── Tendências semanais ──────────────────────────────────────────────────────

async function fetchTrendingTopics(): Promise<string[]> {
  const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const res = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `Você é um pesquisador de tendências culturais e artísticas. 
Hoje é ${today}. 
Sua tarefa é identificar os 5 temas mais relevantes da semana para um blog de fotografia artística, arte contemporânea, cinema e cultura visual.
Foque em: exposições abertas, lançamentos de filmes com fotografia notável, debates sobre IA e arte, artistas em destaque, tendências em fotografia e bordado/têxtil.
Retorne APENAS um JSON com o campo "topics" contendo um array de 5 strings, cada uma sendo um tema específico e concreto (não genérico).`,
      },
      {
        role: "user",
        content: "Quais são os 5 temas mais relevantes desta semana para um blog de fotografia artística e cultura visual?",
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "trending_topics",
        strict: true,
        schema: {
          type: "object",
          properties: {
            topics: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: ["topics"],
          additionalProperties: false,
        },
      },
    },
  });

    const raw = res.choices[0]?.message?.content;
    const content = typeof raw === "string" ? raw : null;
    if (!content) return [];
    try {
      const parsed = JSON.parse(content);
      return parsed.topics ?? [];
    } catch {
      return [];
    }
  }

// ─── Seleção do tema ──────────────────────────────────────────────────────────

async function selectBestTopic(trends: string[]): Promise<{ topic: string; category: string; editoria: string }> {
  const res = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `Você é o editor do blog de Camilla Vieira — fotógrafa, artista visual, criadora da série Fio (fotografia bordada à mão), mentora e co-host do PodFlash.

As editorias do blog são:
1. Fotografia como Arte e Linguagem
2. Bordado, Têxtil e Fotografia Expandida
3. Cinema e Linguagem Visual
4. IA e Tecnologia Criativa
5. Cópia vs. Referência
6. Maternidade e Ancestralidade
7. Mentoria e Ensino
8. Podcast e Cultura
9. Exposições e Mundo da Arte
10. Provocações e Manifestos

Posts já publicados recentemente (não repetir):
- "O MoMA bordou uma fotografia" (Bordado/Fotografia)
- "A IA não vai te salvar" (IA/Tecnologia)
- "Fotografia não é registro" (Fotografia como Arte)
- "Wong Kar-wai e a luz" (Cinema)

Tendências da semana: ${trends.join(", ")}

Escolha o tema mais relevante e conecte com a editoria mais adequada. Retorne JSON.`,
      },
      {
        role: "user",
        content: "Qual tema devo escrever esta semana?",
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "topic_selection",
        strict: true,
        schema: {
          type: "object",
          properties: {
            topic: { type: "string" },
            category: {
              type: "string",
              enum: ["fotografia", "bordado", "cinema", "ia", "maternidade", "mentoria", "exposicoes", "manifesto"],
            },
            editoria: { type: "string" },
          },
          required: ["topic", "category", "editoria"],
          additionalProperties: false,
        },
      },
    },
  });

  const raw2 = res.choices[0]?.message?.content;
  const content = typeof raw2 === "string" ? raw2 : null;
  if (!content) return { topic: "Fotografia como linguagem visual contemporânea", category: "fotografia", editoria: "Fotografia como Arte e Linguagem" };
  try {
    return JSON.parse(content);
  } catch {
    return { topic: "Fotografia como linguagem visual contemporânea", category: "fotografia", editoria: "Fotografia como Arte e Linguagem" };
  }
}

// ─── Escrita do post ──────────────────────────────────────────────────────────

const VOICE_SYSTEM_PROMPT = `Você é Camilla Vieira — fotógrafa, artista visual, criadora da série Fio (fotografia bordada à mão), mentora e co-host do PodFlash. Mora em Brasília. Formada em Direito, largou a carreira jurídica para viver de arte e fotografia. Pós-graduação em História da Arte.

## REGRAS INEGOCIÁVEIS DE VOZ

1. EVITAR "eu" — preferir construções sem sujeito explícito ("Fotografar é..." em vez de "Eu fotografo porque..."). Usar "eu" apenas quando indispensável para vulnerabilidade genuína.
2. NUNCA usar gírias: "cara", "mano", "tipo", "né". Tom polido e profissional.
3. NUNCA abrir com "Uma coisa que me tira do sério" ou variações.
4. ZERO política. Tratar temas que tangenciem política apenas pela perspectiva da arte e cultura.
5. Parágrafos curtos. NUNCA genérico. Vocabulário culto porém acessível.
6. SIM: poesia no cotidiano, referências cinema/arte/literatura, provocações intelectuais.
7. NÃO: corporativês, emojis, tom de coach, "jornada", "mindset", "entregar valor".

## VOCABULÁRIO PROIBIDO
cara, mano, tipo, né, vibe, energia (sentido místico), jornada (sentido coach), mindset, escalar, monetizar, hack, dica matadora, segredo revelado, engajar, conteúdo de valor.

## VOCABULÁRIO FREQUENTE
processo, linguagem, intenção, permanência, repertório, presença, ancestralidade, tátil, visceral, inquietação, fio, linha, traduzir, autoria, provocação, contemplação, corpo, textura, camadas.

## ESTRUTURA DO POST
1. Abertura com cena ou dado impactante — imagem mental, número, situação concreta. NUNCA começa com "Hoje vou falar sobre..."
2. Frase de corte curta — uma linha que resume o argumento central (2ª ou 3ª frase)
3. Desenvolvimento em seções com subtítulos (frases, não títulos de capítulo)
4. Referências culturais concretas — artistas, filmes, livros, obras específicas
5. Aplicação prática — sem tom de tutorial
6. Fechamento com frase de impacto — curta, definitiva, não resume, encerra com força
7. Assinatura: "Camilla Vieira"

## COMPRIMENTO
800–1.500 palavras. Parágrafos corridos. Sem bullet points no corpo do texto.

## REFERÊNCIAS ARTÍSTICAS
Duchamp, Frida Kahlo, Kurosawa, Tarantino, Wong Kar-wai, Tarkovsky, Flor Garduño, Sebastião Salgado, Rosângela Rennó, Vik Muniz, Sophie Calle, Vivian Maier, Dora Maar, David Lynch, Wolfgang Tillmans, Cartier-Bresson, Claudia Andujar, Miguel Rio Branco.`;

interface BlogPostDraft {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  coverImagePrompt: string;
  readingTimeMinutes: number;
  wordCount: number;
}

async function writePost(topic: string, category: string): Promise<BlogPostDraft> {
  const res = await invokeLLM({
    messages: [
      { role: "system", content: VOICE_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Escreva um post de blog completo sobre o tema: "${topic}"

O post deve ser escrito em HTML semântico (use <p>, <h2>, <h3>, <blockquote>, <strong>, <em>).
Inclua subtítulos com <h2> para cada seção principal.
Comprimento: 1.000–1.500 palavras.

Retorne um JSON com os campos:
- title: título provocativo (8-12 palavras)
- slug: slug SEO em português (sem acentos, com hífens)
- excerpt: resumo de 1-2 frases que abre o argumento (máx. 200 chars)
- content: o post completo em HTML
- metaTitle: meta title SEO (máx. 60 chars)
- metaDescription: meta description (máx. 155 chars)
- keywords: palavras-chave separadas por vírgula (5-8 termos)
- coverImagePrompt: prompt em inglês para gerar a imagem de capa com IA (estilo: moody, warm, textural, analog photography aesthetic, film grain, Camilla Vieira's universe — threads, needles, embroidery on photographs, hands, warm light)`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "blog_post_draft",
        strict: true,
        schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            slug: { type: "string" },
            excerpt: { type: "string" },
            content: { type: "string" },
            metaTitle: { type: "string" },
            metaDescription: { type: "string" },
            keywords: { type: "string" },
            coverImagePrompt: { type: "string" },
          },
          required: ["title", "slug", "excerpt", "content", "metaTitle", "metaDescription", "keywords", "coverImagePrompt"],
          additionalProperties: false,
        },
      },
    },
  });

  const rawContent = res.choices[0]?.message?.content;
  const content = typeof rawContent === "string" ? rawContent : null;
  if (!content) throw new Error("LLM retornou resposta vazia");

  const parsed = JSON.parse(content);
  const words = countWords(parsed.content);

  return {
    ...parsed,
    slug: parsed.slug || slugify(parsed.title),
    readingTimeMinutes: Math.max(1, Math.ceil(words / 200)),
    wordCount: words,
  };
}

// ─── Geração da imagem de capa ────────────────────────────────────────────────

async function generateCoverImage(prompt: string, slug: string): Promise<string | null> {
  try {
    const fullPrompt = `${prompt}. Style: moody analog photography, warm golden light, textural, film grain, dark background, intimate and contemplative mood. NO text, NO watermarks, NO people's faces clearly visible. Horizontal 16:9 composition.`;

    const { url } = await generateImage({ prompt: fullPrompt });

    // Fetch the image and upload to S3 for permanent storage
    if (!url) throw new Error("generateImage retornou URL vazia");
    const response = await fetch(url);
    const buffer = Buffer.from(await response.arrayBuffer());
    const key = `blog-covers/${slug}-${Date.now()}.jpg`;
    const { url: s3Url } = await storagePut(key, buffer, "image/jpeg");

    return s3Url;
  } catch (err) {
    console.error("[BlogAgent] Falha ao gerar imagem de capa:", err);
    return null;
  }
}

// ─── Publicação ───────────────────────────────────────────────────────────────

async function publishPost(draft: BlogPostDraft, coverImageUrl: string | null, category: string): Promise<void> {
  // Check if slug already exists and make it unique
  let finalSlug = draft.slug;
  const database = await getDb();
  if (!database) throw new Error("Database not available");

  const existing = await database.select({ id: blogPosts.id }).from(blogPosts).where(eq(blogPosts.slug, finalSlug));
  if (existing.length > 0) {
    const date = new Date().toISOString().split("T")[0];
    finalSlug = `${finalSlug}-${date}`;
  }

  await database.insert(blogPosts).values({
    title: draft.title,
    slug: finalSlug,
    excerpt: draft.excerpt,
    content: draft.content,
    coverImageUrl: coverImageUrl ?? undefined,
    category,
    metaTitle: draft.metaTitle,
    metaDescription: draft.metaDescription,
    keywords: draft.keywords,
    isPublished: true,
    isAutoGenerated: true,
    publishedAt: new Date(),
    wordCount: draft.wordCount,
    readingTimeMinutes: draft.readingTimeMinutes,
    author: "Camilla Vieira",
  });
}

// ─── Ponto de entrada principal ───────────────────────────────────────────────

export async function runBlogAgent(): Promise<void> {
  console.log("[BlogAgent] Iniciando agente de blog autônomo...");

  try {
    // 1. Pesquisa de tendências
    console.log("[BlogAgent] Etapa 1: Pesquisando tendências...");
    const trends = await fetchTrendingTopics();
    console.log("[BlogAgent] Tendências encontradas:", trends);

    // 2. Seleção do tema
    console.log("[BlogAgent] Etapa 2: Selecionando tema...");
    const { topic, category, editoria } = await selectBestTopic(trends.length > 0 ? trends : ["fotografia contemporânea"]);
    console.log(`[BlogAgent] Tema selecionado: "${topic}" (${editoria})`);

    // 3. Escrita do post
    console.log("[BlogAgent] Etapa 3: Escrevendo post...");
    const draft = await writePost(topic, category);
    console.log(`[BlogAgent] Post escrito: "${draft.title}" (${draft.wordCount} palavras)`);

    // 4. Geração da imagem de capa
    console.log("[BlogAgent] Etapa 4: Gerando imagem de capa...");
    const coverImageUrl = await generateCoverImage(draft.coverImagePrompt, draft.slug);
    console.log("[BlogAgent] Imagem de capa:", coverImageUrl ? "gerada com sucesso" : "falhou (publicando sem imagem)");

    // 5. Publicação
    console.log("[BlogAgent] Etapa 5: Publicando post...");
    await publishPost(draft, coverImageUrl, category);
    console.log(`[BlogAgent] Post publicado com sucesso: "${draft.title}"`);

    // 6. Notificação
    await notifyOwner({
      title: `📝 Novo post publicado no blog`,
      content: `O agente de IA publicou um novo post:\n\n"${draft.title}"\n\nCategoria: ${editoria}\nPalavras: ${draft.wordCount}\nTempo de leitura: ${draft.readingTimeMinutes} min\n\nAcesse /admin/blog para revisar.`,
    });

    console.log("[BlogAgent] Concluído com sucesso!");
  } catch (err) {
    console.error("[BlogAgent] Erro durante execução:", err);
    await notifyOwner({
      title: "⚠️ Erro no agente de blog",
      content: `O agente de blog encontrou um erro e não publicou o post desta semana.\n\nErro: ${err instanceof Error ? err.message : String(err)}\n\nAcesse /admin/blog para publicar manualmente.`,
    }).catch(() => {});
  }
}
