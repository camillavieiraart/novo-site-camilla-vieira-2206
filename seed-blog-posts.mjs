import mysql from 'mysql2/promise';

const db = await mysql.createConnection(process.env.DATABASE_URL);

// Helper to generate slug
function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-');
}

// Helper to calculate reading time
function readingTime(text) {
  const words = text.split(/\s+/).length;
  return Math.ceil(words / 200);
}

const posts = [
  {
    title: 'A IA não vai te salvar (se você não sabe o que quer dizer)',
    slug: 'ia-nao-vai-te-salvar',
    excerpt: '34 milhões de imagens geradas por IA todos os dias. A velocidade aumentou. Mas repertório, intenção e voz própria continuam insubstituíveis. IA é ferramenta — não é autoria.',
    content: `<p>34 milhões de imagens são geradas por inteligência artificial todos os dias. São retratos, paisagens, ilustrações, "fotografias" que nunca existiram, rostos de pessoas que nunca nasceram. A velocidade é impressionante. A quantidade, esmagadora.</p>

<p>E quase nenhuma dessas imagens diz alguma coisa.</p>

<h2>O problema não é a ferramenta. É a pressa.</h2>

<p>A IA generativa é, sem dúvida, a ferramenta mais poderosa que surgiu para criadores visuais nas últimas décadas. Midjourney, DALL·E, Firefly, Stable Diffusion — cada uma oferece capacidades que, há cinco anos, exigiriam equipes inteiras e semanas de trabalho. Gerar uma imagem conceitual em segundos, testar paletas de cor, explorar composições, criar moodboards instantâneos — tudo isso é real e útil.</p>

<p>O problema surge quando a ferramenta substitui o pensamento.</p>

<p>Existe uma diferença entre usar IA como ponto de partida para explorar ideias e usar IA como ponto final para não precisar ter ideias. A primeira abordagem expande a criatividade. A segunda a mata.</p>

<h2>A ilusão da facilidade</h2>

<p>A primeira vez que se digita um prompt e aparece uma imagem "perfeita" em 30 segundos, a sensação é de magia. A segunda, terceira, décima vez, a sensação começa a mudar.</p>

<p>Porque todas as imagens parecem saídas do mesmo lugar — bonitas, tecnicamente impecáveis, vagamente familiares, absolutamente esquecíveis.</p>

<p>A IA generativa foi treinada com bilhões de imagens existentes. Ela combina, recombina, interpola o que já existe. Não inventa linguagem — remixia vocabulário. O resultado é uma estética média: o ponto médio de tudo o que já foi criado. Impressionante no primeiro impacto. Genérica na repetição.</p>

<p>Salgado não é Salgado porque tinha a melhor câmera. É Salgado porque passou décadas construindo um olhar tão particular que se reconhece uma foto dele sem legenda. Esse olhar não é treinável por algoritmo. É construído por vida, repertório, escolhas, perdas, tempo.</p>

<h2>Repertório não se baixa</h2>

<p>A IA é excelente em executar. É péssima em conceber.</p>

<p>Consegue gerar uma imagem que se parece com Frida Kahlo. Não consegue entender por que Frida pintava o que pintava — a dor física, a identidade mexicana, a solidão dentro de um casamento turbulento, a política do corpo feminino como território de resistência. A IA reproduz a superfície. A profundidade é humana.</p>

<p>Repertório é o acúmulo de tudo o que se viveu, viu, leu, sentiu e esqueceu. É ter assistido a Tarkovsky e não lembrar conscientemente das cenas, mas reconhecer quando uma foto "funciona" porque a composição ecoa algo que ficou gravado em algum lugar da memória. É ter bordado durante horas e saber, no corpo, o que significa lentidão como método. É ter olhado centenas de fotografias de Rennó e entender que o descarte também é linguagem.</p>

<p>Nada disso cabe num prompt.</p>

<h2>A pergunta que a IA não faz</h2>

<p>A IA responde perguntas. Não faz perguntas.</p>

<p>"Gere uma imagem de uma mulher bordando uma fotografia." A IA obedece. Entrega uma imagem tecnicamente competente. Mas não pergunta: por que bordar uma fotografia? O que a câmera não disse? O que o fio acrescenta que o pixel não alcança? Qual memória está sendo costurada ali?</p>

<p>Essas perguntas são o trabalho do artista. E são essas perguntas — não as respostas visuais — que separam uma obra de uma imagem.</p>

<p>Quando existe clareza sobre o que se quer dizer, a IA se torna uma aliada poderosa. Pode acelerar etapas mecânicas, testar variações, explorar caminhos que levariam semanas manualmente. Mas quando não existe clareza — quando a pessoa senta diante do prompt sem saber o que quer — a IA entrega barulho visual. Bonito, rápido, vazio.</p>

<h2>Usar IA sem perder a mão</h2>

<p>A posição mais inteligente não é rejeitar a IA nem se render a ela. É usá-la como se usa qualquer ferramenta: com intenção.</p>

<p>A IA pode gerar referências visuais para acelerar o início de um projeto. Pode ajudar a visualizar composições antes de montar um set. Pode produzir textos-base que serão reescritos com voz própria. Pode criar moodboards em minutos que antes levavam dias.</p>

<p>Mas a decisão final — o enquadramento que inclui ou exclui, a cor que define o humor, o momento de parar de bordar porque o fio disse o suficiente — essa é humana. E precisa continuar sendo.</p>

<p>O futuro não pertence a quem sabe digitar o melhor prompt. Pertence a quem tem repertório, visão e a coragem de dizer algo que ninguém mais está dizendo. A IA amplifica. Mas não pode amplificar o que não existe.</p>

<p>Se não há voz, não há o que amplificar. Apenas eco.</p>

<p>A IA é a ferramenta mais rápida que já existiu. Mas velocidade sem direção é só pressa. E pressa não cria nada que dure.</p>

<p>A criatividade continua exigindo o que sempre exigiu: tempo, repertório, intenção e a coragem de fazer algo que ainda não tem referência no feed.</p>`,
    coverImageUrl: 'https://drive.google.com/uc?export=view&id=1X9XmKzqFzQ2vQxY3Z4W5A6B7C8D9E0F',
    category: 'IA & Tecnologia Criativa',
    tags: 'inteligência artificial e arte,IA criativa,Midjourney,fotografia e IA,processo criativo,repertório visual,arte contemporânea,tecnologia e arte',
    metaTitle: 'A IA não vai te salvar (se você não sabe o que quer dizer) | Camilla Vieira',
    metaDescription: '34 milhões de imagens geradas por IA todos os dias. A velocidade aumentou. Mas repertório, intenção e voz própria continuam insubstituíveis. IA é ferramenta — não é autoria.',
    keywords: 'inteligência artificial e arte,IA criativa,Midjourney,fotografia e IA,processo criativo,repertório visual',
    authorName: 'Camilla Vieira',
    isPublished: 1,
    publishedAt: new Date('2025-11-01'),
  },
  {
    title: 'Fotografia não é registro. É linguagem.',
    slug: 'fotografia-nao-e-registro-e-linguagem',
    excerpt: 'Fotografia não registra a realidade — ela a traduz. De Sebastião Salgado a Rosângela Rennó, entenda por que a câmera é tão artística quanto o pincel.',
    content: `<p>Um homem sobe uma encosta de lama carregando um saco nas costas. Ao redor, centenas de outros homens fazem o mesmo. A imagem é em preto e branco. Não há legenda, não há contexto imediato. Mas qualquer pessoa que olhe para essa fotografia — mesmo sem saber que é Serra Pelada, mesmo sem saber que é Sebastião Salgado — sente o peso.</p>

<p>Não o peso do saco. O peso da condição humana.</p>

<p>Isso não é registro. É linguagem.</p>

<h2>A câmera não reproduz. Ela traduz.</h2>

<p>Existe uma confusão que persiste — dentro e fora do mundo da arte — sobre o que a fotografia faz. A versão simplificada diz que a câmera captura o que está diante dela. Aperta o botão, congela o instante, pronto: registro.</p>

<p>Mas se fosse só isso, qualquer celular apontado para qualquer cena produziria arte. E não produz.</p>

<p>Salgado, que faleceu em maio de 2025 aos 81 anos, passou cinco décadas demonstrando o contrário. Economista de formação, trocou os números pelas imagens nos anos 1970, em Paris. Viajou por mais de 120 países. Fotografou exclusivamente em preto e branco — não por nostalgia, mas por decisão de linguagem. A ausência de cor força o olhar a procurar outra coisa: textura, contraste, geometria humana, a dignidade que sobrevive em qualquer circunstância.</p>

<p>Em sua última entrevista, concedida na Normandia pouco antes de morrer, Salgado foi direto: fotografia feita no celular é comunicação por imagem, mas não tem relação com a memória. Para ele, a fotografia autêntica — aquela que exige presença, tempo, intenção — era insubstituível.</p>

<h2>A fotógrafa que não fotografa</h2>

<p>Rosângela Rennó se define como uma fotógrafa que não mais fotografa. Em vez de produzir imagens novas, ela resgata fotografias abandonadas — em mercados de pulgas, arquivos de penitenciárias, álbuns de família descartados, depósitos institucionais — e as recontextualiza.</p>

<p>Em Imemorial (1994), Rennó recuperou retratos 3x4 de operários que construíram Brasília. Rostos anônimos, descartados junto com os arquivos da empresa Novacap. A artista ampliou essas imagens, alterou suas tonalidades e as dispôs em bandejas de ferro — os retratos mais claros na parede, os mais escuros no chão, como lápides.</p>

<p>A pergunta que a obra faz não é sobre fotografia. É sobre quem merece ser lembrado.</p>

<p>Rennó demonstra algo fundamental: a linguagem fotográfica não mora apenas no ato de apertar o botão. Mora na edição, na curadoria, na decisão de mostrar ou esconder, ampliar ou apagar. Mora na intenção.</p>

<h2>O artista que fotografa com lixo</h2>

<p>Vik Muniz construiu retratos monumentais usando materiais recicláveis no chão do aterro de Jardim Gramacho, no Rio de Janeiro. Depois, subiu num andaime e fotografou as composições de cima. O resultado final — a fotografia — é a obra. Mas o processo envolve escultura, instalação, performance, relação humana com os catadores. O documentário Waste Land registrou tudo.</p>

<p>A fotografia de Vik Muniz não "registra" nada. Ela é o ponto final de um processo criativo complexo que começa muito antes do clique.</p>

<p>Três artistas brasileiros. Três abordagens completamente distintas. Um ponto em comum: nenhum deles trata a câmera como aparelho de registro. Tratam como instrumento de linguagem.</p>

<h2>O que separa registro de linguagem</h2>

<p>A diferença não é técnica. Não é sobre ter a câmera certa, o ISO perfeito, a lente ideal. A diferença está em quatro dimensões:</p>

<p><strong>Intenção.</strong> Registro documenta o que está ali. Linguagem decide o que mostrar — e, tão importante quanto, o que esconder. Cada enquadramento é uma escolha. Cada corte é uma frase.</p>

<p><strong>Tempo.</strong> Registro é instantâneo. Linguagem exige processo — antes, durante e depois do clique. Salgado passava meses em cada projeto antes de levantar a câmera. Rennó passa anos com imagens antes de expô-las.</p>

<p><strong>Autoria.</strong> Registro pode ser feito por qualquer pessoa. Linguagem carrega uma voz. É possível olhar uma fotografia de Salgado sem legenda e saber que é dele. O preto e branco, a composição épica, a dignidade no sofrimento — tudo isso é assinatura.</p>

<p><strong>Permanência.</strong> Registro vive enquanto é útil. Linguagem permanece porque comunica algo que transcende o momento. As fotos de Serra Pelada não são sobre uma mina de ouro. São sobre a condição humana. E por isso continuam relevantes quarenta anos depois.</p>

<h2>A fotografia como vocabulário</h2>

<p>Toda língua tem gramática. A fotografia também.</p>

<p>Luz é entonação — direcional conta drama, difusa conta suavidade, contraluz conta mistério. Enquadramento é sintaxe — o que está dentro do quadro, o que ficou de fora, a relação entre os elementos. Profundidade de campo é ênfase — foco seletivo diz "olhe aqui e ignore o resto". Cor (ou ausência dela) é vocabulário — Salgado escolheu o preto e branco como quem escolhe escrever em verso em vez de prosa.</p>

<p>Quando esses elementos são usados com consciência, a imagem deixa de ilustrar e passa a argumentar. Deixa de mostrar e passa a dizer.</p>

<p>É isso que separa uma foto bonita de uma fotografia com alma.</p>

<h2>A câmera é tão artística quanto o pincel</h2>

<p>A hierarquia que coloca a pintura acima da fotografia é uma herança do século XIX que insiste em não morrer. A ideia de que a câmera "apenas reproduz" enquanto o pincel "cria" ignora um fato simples: ambos são instrumentos. O que importa é quem os segura — e o que essa pessoa tem a dizer.</p>

<p>Salgado tinha. Rennó tem. Muniz tem.</p>

<p>A pergunta que vale a pena fazer não é se fotografia é arte. Essa discussão já foi encerrada pelos fatos — pelo MoMA, pela Tate, pela Bienal de Veneza, por décadas de produção que não deixa margem para dúvida.</p>

<p>A pergunta que vale é outra: a sua fotografia é linguagem — ou apenas registro?</p>

<p>A resposta está na intenção com que se levanta a câmera. E na coragem de dizer algo que ainda não foi dito.</p>`,
    coverImageUrl: 'https://drive.google.com/uc?export=view&id=1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P',
    category: 'Fotografia é Arte',
    tags: 'fotografia é arte,linguagem fotográfica,Sebastião Salgado,Rosângela Rennó,Vik Muniz,fotografia contemporânea,processo criativo,arte visual',
    metaTitle: 'Fotografia não é registro. É linguagem. | Camilla Vieira',
    metaDescription: 'Fotografia não registra a realidade — ela a traduz. De Sebastião Salgado a Rosângela Rennó, entenda por que a câmera é tão artística quanto o pincel.',
    keywords: 'fotografia é arte,linguagem fotográfica,Sebastião Salgado,Rosângela Rennó,Vik Muniz,fotografia contemporânea',
    authorName: 'Camilla Vieira',
    isPublished: 1,
    publishedAt: new Date('2025-10-15'),
  },
  {
    title: 'Wong Kar-wai e a luz que conta mais que o roteiro',
    slug: 'wong-kar-wai-luz-conta-mais-que-roteiro',
    excerpt: 'Wong Kar-wai e Christopher Doyle criaram em In the Mood for Love uma aula de linguagem visual. O que fotógrafos podem aprender com esse filme sobre luz, cor e composição.',
    content: `<p>Dois vizinhos descobrem que seus cônjuges estão tendo um caso. Nos 98 minutos seguintes, quase nada acontece. Não há confronto, não há confissão, não há cena de amor explícita. Mas cada frame de In the Mood for Love carrega tanto peso emocional que, ao final, a sensação é de ter vivido uma vida inteira dentro de um corredor estreito em Hong Kong.</p>

<p>Como Wong Kar-wai consegue isso sem roteiro convencional, sem plot twists, sem diálogos grandiosos?</p>

<p>Com luz.</p>

<h2>O diretor que nunca teve roteiro</h2>

<p>Wong Kar-wai não trabalha com roteiro fechado. Nunca trabalhou. Para In the Mood for Love, havia apenas tratamentos vagos — ideias soltas sobre dois vizinhos na Hong Kong dos anos 1960. O filme foi sendo construído durante as filmagens, com cenas refilmadas dezenas de vezes em locações diferentes pelo sudeste asiático, até que Wong sentisse que algo funcionava.</p>

<p>O resultado não parece improvisado. Parece inevitável. E isso acontece porque, na ausência de um roteiro que guie a narrativa, a imagem assume essa função. A luz conta o que o diálogo cala. O enquadramento revela o que os personagens escondem. A cor define o humor antes de qualquer fala.</p>

<p>Para quem fotografa, essa inversão é reveladora: e se a imagem não servisse ao texto, mas fosse o texto?</p>

<h2>Christopher Doyle e a luz como emoção</h2>

<p>Christopher Doyle — australiano que adotou nome chinês, viveu em Taiwan, trabalhou como perfurador de petróleo na Índia e médico de medicina chinesa na Tailândia antes de pegar uma câmera — foi o diretor de fotografia de seis filmes de Wong Kar-wai. Sua parceria com o diretor é uma das mais influentes do cinema contemporâneo.</p>

<p>Em In the Mood for Love, Doyle estabeleceu uma gramática visual que funciona como manual para qualquer pessoa que trabalhe com imagem:</p>

<p><strong>Luz quente e direcional</strong> — quase toda a iluminação vem de fontes laterais ou de cima, criando sombras longas em corredores estreitos. A luz nunca é neutra. Ela é âmbar, dourada, avermelhada. Essa escolha não é técnica — é emocional. O calor visual traduz desejo contido.</p>

<p><strong>Espaço negativo como personagem</strong> — os protagonistas raramente ocupam o centro do quadro. São enquadrados por portas, espelhos, grades, cortinas. O vazio ao redor deles é tão eloquente quanto sua presença. Em composição fotográfica, chama-se espaço negativo. Em Wong Kar-wai, chama-se solidão.</p>

<p><strong>Câmera como cúmplice</strong> — a câmera se posiciona como se estivesse espiando. Atrás de pilares, através de frestas, refletida em superfícies. Quem assiste sente que está vendo algo que não deveria ver. Essa intimidade voyeurística é a marca registrada do filme — e funciona porque o espectador se torna participante emocional.</p>

<h2>A cor conta antes da palavra</h2>

<p>Maggie Cheung usa mais de vinte vestidos cheongsam ao longo do filme. Cada um marca uma fase emocional diferente — os padrões florais, as cores, a forma como o tecido interage com a luz mudam conforme o arco da personagem avança.</p>

<p>Para quem fotografa, a lição é direta: cor não é decoração. Cor é narrativa.</p>

<p>A paleta inteira do filme orbita entre vermelhos, dourados e verdes escuros. Não há azuis frios, não há brancos limpos. Tudo é saturado, quente, denso — como a emoção que os personagens não conseguem expressar. A temperatura de cor do filme é, literalmente, a temperatura emocional.</p>

<h2>O que fotógrafos podem roubar de Wong Kar-wai</h2>

<p>O cinema de Wong Kar-wai não é referência apenas para cineastas. É repertório essencial para qualquer pessoa que trabalhe com imagem. Algumas lições concretas:</p>

<p><strong>Não centralize o sujeito.</strong> Wong quase nunca coloca o protagonista no centro do quadro. Mover o sujeito para as bordas cria tensão, sugerindo que algo maior acontece fora do enquadramento. Na fotografia, isso transforma um retrato previsível em narrativa.</p>

<p><strong>Use molduras naturais.</strong> Portas, janelas, espelhos, corredores. O filme inteiro é construído com molduras dentro de molduras — o que os japoneses chamam de <em>ma</em>, o espaço entre as coisas. Na fotografia, enquadrar o sujeito dentro de uma moldura natural adiciona profundidade e contexto sem esforço.</p>

<p><strong>A luz quente não é preguiça.</strong> Existe um preconceito técnico que associa iluminação "correta" a luz neutra. Wong e Doyle provam que a luz quente — âmbar, dourada, avermelhada — carrega emoção de forma que a luz fria não alcança. Para ensaios, retratos e fotografia autoral, a permissão de abraçar a luz quente pode transformar tudo.</p>

<p><strong>Deixe coisas de fora.</strong> O que mais impressiona em In the Mood for Love é o que não aparece: os cônjuges traidores nunca são mostrados de frente. A câmera sugere sua presença, mas nunca os revela. Na fotografia, a ausência pode ser tão poderosa quanto a presença.</p>

<p><strong>A repetição cria ritmo.</strong> Os personagens percorrem o mesmo corredor dezenas de vezes. Cada passagem é levemente diferente — outra luz, outro vestido, outro humor. A repetição com variação cria ritmo visual. Em séries fotográficas, a repetição de um motivo com variações gera coesão e profundidade.</p>

<h2>O filme como escola de fotografia</h2>

<p>Wong Kar-wai nunca fez escola de cinema. Cresceu assistindo filmes — franceses, italianos, americanos, taiwaneses, de Hong Kong — e declarou que "ir ao cinema quase todo dia" foi sua formação. Doyle também era autodidata: começou como fotógrafo em Taiwan, sem formação formal.</p>

<p>A educação visual não precisa vir de uma sala de aula. Vem de observar com intenção. De assistir a um filme prestando atenção na luz e não no diálogo. De notar como a cor de um ambiente muda o significado de uma cena. De perceber que a composição de um quadro cinematográfico e a composição de uma fotografia obedecem à mesma gramática — porque ambas são linguagem visual.</p>

<p>In the Mood for Love completa 26 anos e continua sendo a referência de linguagem visual mais citada por fotógrafos, diretores de arte e cineastas contemporâneos. O Criterion Collection chamou de "uma das influências estilísticas mais significativas das últimas duas décadas do cinema."</p>

<p>A razão é simples: Wong provou que, quando a imagem é forte o suficiente, o roteiro se torna dispensável.</p>

<p>Para quem fotografa, a mensagem é a mesma: quando a luz conta a história, a legenda se torna dispensável.</p>`,
    coverImageUrl: 'https://drive.google.com/uc?export=view&id=1Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D5E6F',
    category: 'Cinema & Linguagem Visual',
    tags: 'Wong Kar-wai,In the Mood for Love,Christopher Doyle,direção de fotografia,cinema e fotografia,linguagem visual,composição,luz no cinema',
    metaTitle: 'Wong Kar-wai e a luz que conta mais que o roteiro | Camilla Vieira',
    metaDescription: 'Wong Kar-wai e Christopher Doyle criaram em In the Mood for Love uma aula de linguagem visual. O que fotógrafos podem aprender com esse filme sobre luz, cor e composição.',
    keywords: 'Wong Kar-wai,In the Mood for Love,Christopher Doyle,cinema e fotografia,linguagem visual,composição fotográfica',
    authorName: 'Camilla Vieira',
    isPublished: 1,
    publishedAt: new Date('2025-09-20'),
  }
];

console.log('Inserting 3 reference blog posts...');

for (const post of posts) {
  // Truncate SEO fields to fit column limits
  post.metaTitle = post.metaTitle.substring(0, 70);
  post.metaDescription = post.metaDescription.substring(0, 200);
  post.keywords = post.keywords.substring(0, 1000);
  post.tags = post.tags.substring(0, 1000);
  post.category = post.category.substring(0, 100);
  post.authorName = post.authorName.substring(0, 200);
  // Check if post already exists
  const [existing] = await db.execute('SELECT id FROM blog_posts WHERE slug = ?', [post.slug]);
  if (existing.length > 0) {
    console.log(`Post "${post.slug}" already exists, updating...`);
    await db.execute(
      `UPDATE blog_posts SET 
        title = ?, excerpt = ?, content = ?, coverImageUrl = ?,
        category = ?, tags = ?, metaTitle = ?, metaDescription = ?,
        keywords = ?, author = ?, isPublished = ?, publishedAt = ?
       WHERE slug = ?`,
      [post.title, post.excerpt, post.content, post.coverImageUrl,
       post.category, post.tags, post.metaTitle, post.metaDescription,
       post.keywords, post.authorName, post.isPublished, post.publishedAt,
       post.slug]
    );
  } else {
    await db.execute(
      `INSERT INTO blog_posts 
        (title, slug, excerpt, content, coverImageUrl, category, tags, 
         metaTitle, metaDescription, keywords, author, isPublished, publishedAt, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [post.title, post.slug, post.excerpt, post.content, post.coverImageUrl,
       post.category, post.tags, post.metaTitle, post.metaDescription,
       post.keywords, post.authorName, post.isPublished, post.publishedAt,
       new Date()]
    );
  }
  console.log(`✓ Published: "${post.title}"`);
}

await db.end();
console.log('\n✅ All 3 reference posts published successfully!');
