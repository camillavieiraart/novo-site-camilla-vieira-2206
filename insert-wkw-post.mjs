// Script to insert the Wong Kar-wai blog post into the database
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config({ path: '/home/ubuntu/camillavieira-atelier/.env' });

const DATABASE_URL = process.env.DATABASE_URL;

const content = `
<p class="post-lead">Dois vizinhos descobrem que seus cônjuges estão tendo um caso. Nos 98 minutos seguintes, quase nada acontece. Não há confronto, não há confissão, não há cena de amor explícita. Mas cada frame de <em>In the Mood for Love</em> carrega tanto peso emocional que, ao final, a sensação é de ter vivido uma vida inteira dentro de um corredor estreito em Hong Kong.</p>

<p>Como Wong Kar-wai consegue isso sem roteiro convencional, sem plot twists, sem diálogos grandiosos?</p>

<blockquote>Com luz.</blockquote>

<figure class="post-figure post-figure--wide">
  <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663030818024/iOaBrsKLhSkSpQNX.jpg" alt="Maggie Cheung e Tony Leung — In the Mood for Love" loading="lazy" />
  <figcaption>Maggie Cheung e Tony Leung no corredor icônico — a compressão espacial que define o filme inteiro.</figcaption>
</figure>

<h2>O Diretor que Nunca Teve Roteiro</h2>

<p>Wong Kar-wai não trabalha com roteiro fechado. Nunca trabalhou. Para <em>In the Mood for Love</em>, havia apenas tratamentos vagos — ideias soltas sobre dois vizinhos na Hong Kong dos anos 1960. O filme foi sendo construído durante as filmagens, com cenas refilmadas dezenas de vezes em locações diferentes pelo sudeste asiático, até que Wong sentisse que algo funcionava.</p>

<p>O resultado não parece improvisado. Parece inevitável.</p>

<p>E isso acontece porque, na ausência de um roteiro que guie a narrativa, a imagem assume essa função. A luz conta o que o diálogo cala. O enquadramento revela o que os personagens escondem. A cor define o humor antes de qualquer fala.</p>

<blockquote>E se a imagem não servisse ao texto, mas fosse o texto?</blockquote>

<figure class="post-figure post-figure--side-by-side">
  <div class="post-figure__grid">
    <div>
      <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663030818024/fMuMUDXtWlZbvwCa.jpg" alt="Corredor com luz âmbar — imagem gerada por IA inspirada em Wong Kar-wai" loading="lazy" />
      <figcaption>Luz lateral âmbar — a temperatura de cor do filme é a temperatura emocional dos personagens. <em>(Imagem gerada por IA)</em></figcaption>
    </div>
    <div>
      <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663030818024/dMBmdqwSAucwvjZn.jpg" alt="Corredor estreito — In the Mood for Love" loading="lazy" />
      <figcaption>A escada em câmera lenta — repetição como ritual. O mesmo trajeto, outra luz, outro vestido, outro humor.</figcaption>
    </div>
  </div>
</figure>

<h2>Christopher Doyle e a Luz como Emoção</h2>

<p>Christopher Doyle — australiano que adotou nome chinês, viveu em Taiwan, trabalhou como perfurador de petróleo na Índia e médico de medicina chinesa na Tailândia antes de pegar uma câmera — foi o diretor de fotografia de seis filmes de Wong Kar-wai. Sua parceria com o diretor é uma das mais influentes do cinema contemporâneo.</p>

<p>Em <em>In the Mood for Love</em>, Doyle estabeleceu uma gramática visual que funciona como manual para qualquer pessoa que trabalhe com imagem:</p>

<figure class="post-figure">
  <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663030818024/zWkzmrqxiIsvUBER.png" alt="Silhuetas e sombras — iluminação em In the Mood for Love" loading="lazy" />
  <figcaption>Silhuetas, sombras e fumaça — a gramática visual de Doyle.</figcaption>
</figure>

<h3>Luz quente e direcional</h3>

<p>Quase toda a iluminação vem de fontes laterais ou de cima, criando sombras longas em corredores estreitos. A luz nunca é neutra. Ela é âmbar, dourada, avermelhada. Essa escolha não é técnica — é emocional. O calor visual traduz desejo contido.</p>

<h3>Espaço negativo como personagem</h3>

<p>Os protagonistas raramente ocupam o centro do quadro. São enquadrados por portas, espelhos, grades, cortinas. O vazio ao redor deles é tão eloquente quanto sua presença. Em composição fotográfica, chama-se espaço negativo. Em Wong Kar-wai, chama-se solidão.</p>

<figure class="post-figure">
  <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663030818024/yXwXmuAqMXQboXRj.jpg" alt="Molduras dentro de molduras — imagem gerada por IA" loading="lazy" />
  <figcaption>Molduras dentro de molduras — portas, espelhos, cortinas. O espaço entre as coisas conta a história. <em>(Imagem gerada por IA)</em></figcaption>
</figure>

<h3>Câmera como cúmplice</h3>

<p>A câmera se posiciona como se estivesse espiando. Atrás de pilares, através de frestas, refletida em superfícies. Quem assiste sente que está vendo algo que não deveria ver. Essa intimidade voyeurística é a marca registrada do filme — e funciona porque o espectador se torna participante emocional.</p>

<blockquote>A câmera não mostra os personagens. Ela os espia.</blockquote>

<h2>A Cor Conta Antes da Palavra</h2>

<p>Maggie Cheung usa mais de vinte vestidos cheongsam ao longo do filme. Cada um marca uma fase emocional diferente — os padrões florais, as cores, a forma como o tecido interage com a luz mudam conforme o arco da personagem avança.</p>

<figure class="post-figure post-figure--side-by-side">
  <div class="post-figure__grid">
    <div>
      <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663030818024/KItlCnftdHccNFsY.jpg" alt="Os cheongsams de Maggie Cheung — In the Mood for Love" loading="lazy" />
      <figcaption>Os cheongsams de Maggie Cheung — mais de vinte vestidos, cada um marcando uma fase emocional diferente.</figcaption>
    </div>
    <div>
      <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663030818024/DspBXNdREtWbvLyi.jpg" alt="Vestidos cheongsam — imagem gerada por IA" loading="lazy" />
      <figcaption>Cor não é decoração. Cor é narrativa. <em>(Imagem gerada por IA)</em></figcaption>
    </div>
  </div>
</figure>

<p>Cor não é decoração. Cor é narrativa.</p>

<p>A paleta inteira do filme orbita entre vermelhos, dourados e verdes escuros. Não há azuis frios, não há brancos limpos. Tudo é saturado, quente, denso — como a emoção que os personagens não conseguem expressar. A temperatura de cor do filme é, literalmente, a temperatura emocional.</p>

<figure class="post-figure">
  <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663030818024/ecQMkTshJtGVPbou.jpg" alt="A obsessão com cor de Wong Kar-wai" loading="lazy" />
  <figcaption>A obsessão cromática de Wong Kar-wai — saturação como estado emocional.</figcaption>
</figure>

<h2>O que Fotógrafos Podem Aprender com Wong Kar-wai</h2>

<p>O cinema de Wong Kar-wai não é referência apenas para cineastas. É repertório essencial para qualquer pessoa que trabalhe com imagem. Algumas lições concretas:</p>

<p><strong>Não centralize o sujeito.</strong> Wong quase nunca coloca o protagonista no centro do quadro. Mover o sujeito para as bordas cria tensão, sugerindo que algo maior acontece fora do enquadramento. Na fotografia, isso transforma um retrato previsível em narrativa.</p>

<p><strong>Use molduras naturais.</strong> Portas, janelas, espelhos, corredores. O filme inteiro é construído com molduras dentro de molduras — o que os japoneses chamam de <em>ma</em>, o espaço entre as coisas. Na fotografia, enquadrar o sujeito dentro de uma moldura natural adiciona profundidade e contexto sem esforço.</p>

<p><strong>A luz quente não é preguiça.</strong> Existe um preconceito técnico que associa iluminação "correta" a luz neutra. Wong e Doyle provam que a luz quente — âmbar, dourada, avermelhada — carrega emoção de forma que a luz fria não alcança. Para ensaios, retratos e fotografia autoral, a permissão de abraçar a luz quente pode transformar tudo.</p>

<p><strong>Deixe coisas de fora.</strong> O que mais impressiona em <em>In the Mood for Love</em> é o que não aparece: os cônjuges traidores nunca são mostrados de frente. A câmera sugere sua presença, mas nunca os revela. Na fotografia, a ausência pode ser tão poderosa quanto a presença.</p>

<p><strong>A repetição cria ritmo.</strong> Os personagens percorrem o mesmo corredor dezenas de vezes. Cada passagem é levemente diferente — outra luz, outro vestido, outro humor. A repetição com variação cria ritmo visual. Em séries fotográficas, a repetição de um motivo com variações gera coesão e profundidade.</p>

<figure class="post-figure post-figure--side-by-side">
  <div class="post-figure__grid">
    <div>
      <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663030818024/GghTflPTBRXEOtFK.jpg" alt="O olhar no corredor — In the Mood for Love" loading="lazy" />
      <figcaption>O olhar no corredor — a tensão do não-dito.</figcaption>
    </div>
    <div>
      <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663030818024/CtghqyCtWqVRuDMm.jpg" alt="Escadaria em silhueta — imagem gerada por IA" loading="lazy" />
      <figcaption>Escadaria em silhueta — o mesmo trajeto, outra luz, outro humor. <em>(Imagem gerada por IA)</em></figcaption>
    </div>
  </div>
</figure>

<h2>O Filme como Escola de Fotografia</h2>

<p>Wong Kar-wai nunca fez escola de cinema. Cresceu assistindo filmes — franceses, italianos, americanos, taiwaneses, de Hong Kong — e declarou que ir ao cinema quase todo dia foi sua formação. Doyle também era autodidata: começou como fotógrafo em Taiwan, sem formação formal.</p>

<p>A educação visual não precisa vir de uma sala de aula. Vem de observar com intenção. De assistir a um filme prestando atenção na luz e não no diálogo. De notar como a cor de um ambiente muda o significado de uma cena. De perceber que a composição de um quadro cinematográfico e a composição de uma fotografia obedecem à mesma gramática — porque ambas são linguagem visual.</p>

<figure class="post-figure post-figure--wide">
  <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663030818024/TQRjyPnHcWHIETKL.jpg" alt="Angkor Wat — cena final de In the Mood for Love" loading="lazy" />
  <figcaption>O sussurro na parede de Angkor Wat — confissão sem testemunha. Desejo enterrado na arquitetura.</figcaption>
</figure>

<p><em>In the Mood for Love</em> completa 26 anos e continua sendo a referência de linguagem visual mais citada por fotógrafos, diretores de arte e cineastas contemporâneos.</p>

<p>A razão é simples: Wong provou que, quando a imagem é forte o suficiente, o roteiro se torna dispensável.</p>

<blockquote>Quando a luz conta a história, a legenda se torna dispensável.</blockquote>

<figure class="post-figure">
  <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663030818024/aijNkTNElnkaTPEj.jpg" alt="Restaurante — In the Mood for Love" loading="lazy" />
  <figcaption>A distância que separa — dois corpos no mesmo espaço, mundos à parte.</figcaption>
</figure>

<hr />

<p class="post-note"><strong>Mapa de Observação Criativa · Semana 1</strong><br/>Esta análise usa as 8 lentes do Mapa de Observação Criativa — cor, composição, iluminação, movimento, textura, simbolismo, narrativa e emoção — para decompor obras visuais e treinar o olhar fotográfico.</p>
`;

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);
  
  // Check if post already exists
  const [existing] = await conn.execute(
    'SELECT id FROM blog_posts WHERE slug = ?',
    ['o-que-wong-kar-wai-ensina-sobre-fotografar-o-desejo']
  );
  
  if (existing.length > 0) {
    console.log('Post already exists, updating...');
    await conn.execute(`
      UPDATE blog_posts SET
        title = ?,
        excerpt = ?,
        content = ?,
        coverImageUrl = ?,
        coverImageAlt = ?,
        category = ?,
        tags = ?,
        metaTitle = ?,
        metaDescription = ?,
        keywords = ?,
        isPublished = 1,
        publishedAt = NOW(),
        readingTimeMinutes = 8,
        wordCount = 1200,
        author = 'Camilla Vieira',
        updatedAt = NOW()
      WHERE slug = ?
    `, [
      'O que Wong Kar-wai ensina sobre fotografar o desejo',
      'Uma análise visual de In the Mood for Love (2000) pelas 8 lentes do Mapa de Observação Criativa — cor, composição, iluminação e o que a câmera escolhe não mostrar.',
      content,
      'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030818024/iOaBrsKLhSkSpQNX.jpg',
      'Maggie Cheung e Tony Leung — In the Mood for Love, Wong Kar-wai',
      'cinema',
      JSON.stringify(['Wong Kar-wai', 'In the Mood for Love', 'cinema e fotografia', 'Christopher Doyle', 'luz quente', 'composição cinematográfica', 'mapa de observação criativa']),
      'Wong Kar-wai e a Fotografia do Desejo — Camilla Vieira',
      'Como Wong Kar-wai usa luz, cor e composição para fotografar o desejo em In the Mood for Love. Análise visual para fotógrafos.',
      'Wong Kar-wai fotografia, In the Mood for Love análise visual, Christopher Doyle iluminação, cinema e fotografia, luz quente fotografia',
      'o-que-wong-kar-wai-ensina-sobre-fotografar-o-desejo'
    ]);
  } else {
    console.log('Inserting new post...');
    await conn.execute(`
      INSERT INTO blog_posts (
        title, slug, excerpt, content, coverImageUrl, coverImageAlt,
        category, tags, metaTitle, metaDescription, keywords,
        isPublished, publishedAt, readingTimeMinutes, wordCount, author,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), 8, 1200, 'Camilla Vieira', NOW(), NOW())
    `, [
      'O que Wong Kar-wai ensina sobre fotografar o desejo',
      'o-que-wong-kar-wai-ensina-sobre-fotografar-o-desejo',
      'Uma análise visual de In the Mood for Love (2000) pelas 8 lentes do Mapa de Observação Criativa — cor, composição, iluminação e o que a câmera escolhe não mostrar.',
      content,
      'https://files.manuscdn.com/user_upload_by_module/session_file/310419663030818024/iOaBrsKLhSkSpQNX.jpg',
      'Maggie Cheung e Tony Leung — In the Mood for Love, Wong Kar-wai',
      'cinema',
      JSON.stringify(['Wong Kar-wai', 'In the Mood for Love', 'cinema e fotografia', 'Christopher Doyle', 'luz quente', 'composição cinematográfica', 'mapa de observação criativa']),
      'Wong Kar-wai e a Fotografia do Desejo — Camilla Vieira',
      'Como Wong Kar-wai usa luz, cor e composição para fotografar o desejo em In the Mood for Love. Análise visual para fotógrafos.',
      'Wong Kar-wai fotografia, In the Mood for Love análise visual, Christopher Doyle iluminação, cinema e fotografia, luz quente fotografia',
    ]);
  }
  
  console.log('Post inserted/updated successfully!');
  await conn.end();
}

main().catch(console.error);
