/**
 * AGENTE DE IA — RESPOSTAS AUTOMÁTICAS DE E-MAIL
 * Camilla Vieira — Ateliê Digital (contato@camillavieira.art)
 *
 * COMO USAR:
 * 1. Acesse https://script.google.com
 * 2. Crie um novo projeto e cole este código
 * 3. Substitua GEMINI_API_KEY pela sua chave da API Gemini
 *    (obtenha em https://aistudio.google.com/app/apikey — gratuito)
 * 4. Clique em "Executar" → "configurarGatilho" para ativar o agente
 * 5. Autorize as permissões solicitadas
 *
 * O agente roda automaticamente a cada 5 minutos e responde
 * todos os e-mails não lidos recebidos em contato@camillavieira.art
 */

// ─── CONFIGURAÇÃO ─────────────────────────────────────────────────────────────
const GEMINI_API_KEY = "COLE_SUA_CHAVE_AQUI"; // https://aistudio.google.com/app/apikey
const LABEL_RESPONDIDO = "IA-Respondido";
const LABEL_REVISAR    = "IA-Revisar";
const WHATSAPP_LINK    = "https://wa.me/5561999999999"; // Atualize com o número real
const SITE_URL         = "https://camillavieira.art";

// ─── CONTEXTO DO NEGÓCIO ──────────────────────────────────────────────────────
const SYSTEM_PROMPT = `
Você é a assistente virtual da Camilla Vieira, fotógrafa artística, artista visual e mentora criativa baseada em Brasília e São Paulo, Brasil.

SOBRE A CAMILLA:
Camilla Vieira é fotógrafa artística especializada em ensaios femininos, gestantes, casais e família. Também é artista visual (cerâmica artesanal, obras autorais) e mentora para fotógrafos que querem desenvolver olhar autoral e identidade visual. Seu trabalho é poético, intimista e empoderador.

SERVIÇOS OFERECIDOS:
1. ENSAIOS FOTOGRÁFICOS
   - Ensaio Feminino (o mais popular — celebra a mulher em sua essência)
   - Ensaio Gestante
   - Ensaio de Casal
   - Ensaio Família
   - Atende em Brasília, São Paulo e viagens
   - Para orçamentos e agendamentos: direcionar para WhatsApp

2. MENTORIAS DE FOTOGRAFIA
   - Mentoria Individual (online ou presencial em BH/Brasília)
   - Mentoria em Grupo
   - Workshop Fio (técnica de costura sobre fotografia — obra autoral)
   - Para mais informações: ${SITE_URL}/mentorias

3. LOJA — OBRAS DE ARTE E CERÂMICA
   - Peças de cerâmica artesanal
   - Obras fotográficas autorais
   - Para ver a loja: ${SITE_URL}/loja

TOM DE VOZ:
- Caloroso, acolhedor e pessoal — como uma conversa entre amigas
- Poético e inspirador, sem ser excessivo
- Profissional mas nunca frio ou corporativo
- Use "você" (não "tu")
- Assine sempre como "Camilla Vieira"

REGRAS IMPORTANTES:
- NUNCA invente preços ou valores — diga que os valores são passados pelo WhatsApp
- NUNCA confirme datas de agenda — diga que a disponibilidade é verificada pelo WhatsApp
- Se o e-mail for uma reclamação ou situação delicada, use o label "revisar" em vez de responder
- Sempre inclua o link do WhatsApp para continuar a conversa
- Responda em português brasileiro
- Mantenha as respostas concisas (máximo 200 palavras)
`;

// ─── FUNÇÃO PRINCIPAL ─────────────────────────────────────────────────────────
function verificarEResponder() {
  // Busca e-mails não lidos que ainda não foram processados pela IA
  const threads = GmailApp.search(
    `to:contato@camillavieira.art is:unread -label:${LABEL_RESPONDIDO} -label:${LABEL_REVISAR}`,
    0, 10
  );

  if (threads.length === 0) return;

  // Garante que os labels existem
  let labelRespondido = GmailApp.getUserLabelByName(LABEL_RESPONDIDO)
    || GmailApp.createLabel(LABEL_RESPONDIDO);
  let labelRevisar = GmailApp.getUserLabelByName(LABEL_REVISAR)
    || GmailApp.createLabel(LABEL_REVISAR);

  threads.forEach(thread => {
    const messages = thread.getMessages();
    const lastMessage = messages[messages.length - 1];

    // Ignora e-mails enviados pela própria Camilla
    const from = lastMessage.getFrom();
    if (from.includes("camillavieira.art") || from.includes("camillavieirafotografia@gmail.com")) {
      thread.markRead();
      return;
    }

    const subject = lastMessage.getSubject();
    const body = lastMessage.getPlainBody().substring(0, 2000); // Limita o tamanho
    const senderName = from.replace(/<.*>/, "").trim().split(" ")[0] || "querida";

    // Detecta assuntos delicados que precisam de revisão humana
    const assuntosDelicados = ["reclamação", "problema", "insatisfeita", "errado", "cancelar", "reembolso", "devolução"];
    const precisaRevisar = assuntosDelicados.some(palavra =>
      body.toLowerCase().includes(palavra) || subject.toLowerCase().includes(palavra)
    );

    if (precisaRevisar) {
      thread.addLabel(labelRevisar);
      thread.markRead();
      Logger.log(`[REVISAR] E-mail de ${from} marcado para revisão humana.`);
      return;
    }

    // Gera resposta com Gemini
    const resposta = gerarResposta(senderName, subject, body);

    if (resposta) {
      // Responde o e-mail
      thread.reply(resposta);
      thread.addLabel(labelRespondido);
      thread.markRead();
      Logger.log(`[OK] Respondido e-mail de ${from} — assunto: ${subject}`);
    } else {
      // Se a IA falhou, marca para revisão
      thread.addLabel(labelRevisar);
      Logger.log(`[ERRO] Falha ao gerar resposta para ${from}`);
    }
  });
}

// ─── GERAR RESPOSTA COM GEMINI ────────────────────────────────────────────────
function gerarResposta(senderName, subject, body) {
  const userPrompt = `
Você recebeu um e-mail com as seguintes informações:

ASSUNTO: ${subject}
NOME DO REMETENTE: ${senderName}
MENSAGEM:
${body}

---
Escreva uma resposta calorosa e profissional em nome da Camilla Vieira.
Inclua ao final um convite para continuar a conversa pelo WhatsApp: ${WHATSAPP_LINK}
Não use saudações genéricas como "Olá!" — comece com algo personalizado usando o nome da pessoa.
Não inclua assunto na resposta — apenas o corpo do e-mail.
`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT + "\n\n" + userPrompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500
      }
    };

    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(response.getContentText());

    if (json.candidates && json.candidates[0]) {
      return json.candidates[0].content.parts[0].text;
    }

    Logger.log("Resposta inesperada da API Gemini: " + response.getContentText());
    return null;

  } catch (e) {
    Logger.log("Erro ao chamar Gemini: " + e.toString());
    return null;
  }
}

// ─── CONFIGURAR GATILHO AUTOMÁTICO ───────────────────────────────────────────
/**
 * Execute esta função UMA VEZ para ativar o agente.
 * Depois disso, ele roda automaticamente a cada 5 minutos.
 */
function configurarGatilho() {
  // Remove gatilhos existentes para evitar duplicatas
  ScriptApp.getProjectTriggers().forEach(trigger => {
    if (trigger.getHandlerFunction() === "verificarEResponder") {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Cria novo gatilho a cada 5 minutos
  ScriptApp.newTrigger("verificarEResponder")
    .timeBased()
    .everyMinutes(5)
    .create();

  Logger.log("✓ Gatilho configurado! O agente vai verificar e-mails a cada 5 minutos.");
}

// ─── TESTAR MANUALMENTE ───────────────────────────────────────────────────────
/**
 * Execute esta função para testar o agente manualmente.
 */
function testar() {
  Logger.log("Iniciando verificação manual...");
  verificarEResponder();
  Logger.log("Verificação concluída.");
}
