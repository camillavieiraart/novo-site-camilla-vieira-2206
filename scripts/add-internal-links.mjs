/**
 * Script: add-internal-links.mjs
 * Adds "Leia também" blocks with contextual internal links to each blog post.
 * Uses MySQL/TiDB via the DATABASE_URL environment variable.
 */

import mysql from "mysql2/promise";

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) throw new Error("DATABASE_URL not set");

// Per-post related links configuration
const POST_RELATED = {
  "o-que-e-um-ensaio-feminino-de-verdade": [
    { text: "Como se preparar para seu primeiro ensaio feminino", href: "/blog/como-se-preparar-para-seu-primeiro-ensaio-feminino" },
    { text: "Fotógrafa em Brasília: o que considerar antes de escolher", href: "/blog/fotografa-em-brasilia-o-que-considerar-antes-de-escolher" },
    { text: "Ver portfólio de ensaios femininos", href: "/portfolio" },
  ],
  "como-se-preparar-para-seu-primeiro-ensaio-feminino": [
    { text: "O que é um ensaio feminino de verdade", href: "/blog/o-que-e-um-ensaio-feminino-de-verdade" },
    { text: "Fotógrafa em Brasília: o que considerar antes de escolher", href: "/blog/fotografa-em-brasilia-o-que-considerar-antes-de-escolher" },
    { text: "Agendar meu ensaio", href: "/contato" },
  ],
  "ensaio-gestante-mais-que-um-registro": [
    { text: "O que é um ensaio feminino de verdade", href: "/blog/o-que-e-um-ensaio-feminino-de-verdade" },
    { text: "Como se preparar para seu primeiro ensaio feminino", href: "/blog/como-se-preparar-para-seu-primeiro-ensaio-feminino" },
    { text: "Agendar ensaio gestante", href: "/contato" },
  ],
  "fotografa-em-brasilia-o-que-considerar-antes-de-escolher": [
    { text: "Como se preparar para seu primeiro ensaio feminino", href: "/blog/como-se-preparar-para-seu-primeiro-ensaio-feminino" },
    { text: "O que é um ensaio feminino de verdade", href: "/blog/o-que-e-um-ensaio-feminino-de-verdade" },
    { text: "Entrar em contato", href: "/contato" },
  ],
  "quando-voce-esta-pronta-para-uma-mentoria-de-fotografia": [
    { text: "Fotografia autoral: o que é e por que importa", href: "/blog/fotografia-autoral-o-que-e-e-por-que-importa" },
    { text: "A IA não vai te salvar", href: "/blog/ia-nao-vai-te-salvar" },
    { text: "Conhecer as mentorias", href: "/mentorias" },
  ],
  "fotografia-autoral-o-que-e-e-por-que-importa": [
    { text: "Quando você está pronta para uma mentoria de fotografia", href: "/blog/quando-voce-esta-pronta-para-uma-mentoria-de-fotografia" },
    { text: "Fotografia não é registro. É linguagem.", href: "/blog/fotografia-nao-e-registro-e-linguagem" },
    { text: "Conhecer as mentorias", href: "/mentorias" },
  ],
  "ceramica-e-fotografia-o-que-o-barro-me-ensinou-sobre-imagem": [
    { text: "Cerâmica artesanal em Brasília: o ateliê da Camilla Vieira", href: "/blog/ceramica-artesanal-em-brasilia-o-atelie-da-camilla-vieira" },
    { text: "Ver obras de cerâmica", href: "/ceramica" },
    { text: "Ver portfólio completo", href: "/portfolio" },
  ],
  "ceramica-artesanal-em-brasilia-o-atelie-da-camilla-vieira": [
    { text: "Cerâmica e fotografia: o que o barro me ensinou", href: "/blog/ceramica-e-fotografia-o-que-o-barro-me-ensinou-sobre-imagem" },
    { text: "Ver obras de cerâmica", href: "/ceramica" },
    { text: "Entrar em contato", href: "/contato" },
  ],
  "por-que-sua-marca-pessoal-precisa-de-imagens-que-te-representam": [
    { text: "Como se preparar para seu primeiro ensaio feminino", href: "/blog/como-se-preparar-para-seu-primeiro-ensaio-feminino" },
    { text: "Ver portfólio profissional", href: "/portfolio" },
    { text: "Falar sobre minha marca", href: "/contato" },
  ],
  "ia-nao-vai-te-salvar": [
    { text: "Fotografia autoral: o que é e por que importa", href: "/blog/fotografia-autoral-o-que-e-e-por-que-importa" },
    { text: "Quando você está pronta para uma mentoria", href: "/blog/quando-voce-esta-pronta-para-uma-mentoria-de-fotografia" },
    { text: "Conhecer as mentorias", href: "/mentorias" },
  ],
  "fotografia-nao-e-registro-e-linguagem": [
    { text: "Fotografia autoral: o que é e por que importa", href: "/blog/fotografia-autoral-o-que-e-e-por-que-importa" },
    { text: "O que Wong Kar-wai ensina sobre fotografar o desejo", href: "/blog/o-que-wong-kar-wai-ensina-sobre-fotografar-o-desejo" },
    { text: "Conhecer as mentorias", href: "/mentorias" },
  ],
  "o-que-wong-kar-wai-ensina-sobre-fotografar-o-desejo": [
    { text: "Fotografia não é registro. É linguagem.", href: "/blog/fotografia-nao-e-registro-e-linguagem" },
    { text: "Fotografia autoral: o que é e por que importa", href: "/blog/fotografia-autoral-o-que-e-e-por-que-importa" },
    { text: "Conhecer as mentorias", href: "/mentorias" },
  ],
  "wong-kar-wai-luz-conta-mais-que-roteiro": [
    { text: "Fotografia não é registro. É linguagem.", href: "/blog/fotografia-nao-e-registro-e-linguagem" },
    { text: "Fotografia autoral: o que é e por que importa", href: "/blog/fotografia-autoral-o-que-e-e-por-que-importa" },
    { text: "Ver portfólio autoral", href: "/portfolio" },
  ],
  "vivian-maier-retrospectiva-moma-olhar-anonimo": [
    { text: "Fotografia autoral: o que é e por que importa", href: "/blog/fotografia-autoral-o-que-e-e-por-que-importa" },
    { text: "Fotografia não é registro. É linguagem.", href: "/blog/fotografia-nao-e-registro-e-linguagem" },
    { text: "Conhecer as mentorias", href: "/mentorias" },
  ],
  "fio-e-algoritmo-permanencia-textil-ia-arte-masp": [
    { text: "A IA não vai te salvar", href: "/blog/ia-nao-vai-te-salvar" },
    { text: "Cerâmica artesanal em Brasília", href: "/blog/ceramica-artesanal-em-brasilia-o-atelie-da-camilla-vieira" },
    { text: "Ver obras de arte", href: "/obras" },
  ],
};

function buildRelatedBlock(links) {
  const items = links.map(l =>
    `<li><a href="${l.href}" style="color:#C97064;text-decoration:underline;text-underline-offset:3px;">${l.text}</a></li>`
  ).join("\n    ");

  return `\n<div class="post-related-links" style="margin:2.5rem 0;padding:1.5rem 2rem;background:#faf5ef;border-left:3px solid #C9A96E;">\n  <p style="font-size:0.75rem;letter-spacing:0.2em;text-transform:uppercase;color:#8B6F47;margin:0 0 0.75rem;font-family:Inter,sans-serif;">Leia também</p>\n  <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.5rem;font-family:Inter,sans-serif;font-size:0.9375rem;">\n    ${items}\n  </ul>\n</div>`;
}

function hasInternalLinks(content) {
  return content.includes('class="post-related-links"') ||
    content.includes("post-related-links");
}

async function main() {
  const conn = await mysql.createConnection(DB_URL);
  console.log("Connected to database");

  const [posts] = await conn.execute(
    "SELECT id, slug, content FROM blog_posts WHERE isPublished = 1"
  );

  console.log(`Found ${posts.length} published posts`);
  let updated = 0;

  for (const post of posts) {
    const related = POST_RELATED[post.slug];
    if (!related) {
      console.log(`  SKIP (no config): ${post.slug}`);
      continue;
    }

    if (hasInternalLinks(post.content)) {
      console.log(`  SKIP (already has links): ${post.slug}`);
      continue;
    }

    const relatedBlock = buildRelatedBlock(related);
    let newContent = post.content;

    // Insert before the last </p> tag
    const lastP = newContent.lastIndexOf("</p>");
    if (lastP !== -1) {
      newContent = newContent.slice(0, lastP + 4) + relatedBlock;
    } else {
      newContent = newContent + relatedBlock;
    }

    await conn.execute(
      "UPDATE blog_posts SET content = ?, updatedAt = NOW() WHERE id = ?",
      [newContent, post.id]
    );

    console.log(`  UPDATED: ${post.slug}`);
    updated++;
  }

  console.log(`\nDone. Updated ${updated} posts.`);
  await conn.end();
}

main().catch(err => { console.error(err); process.exit(1); });
