# Camilla Vieira - Ateliê Digital TODO

## Fase 1: Base Visual e Estrutura
- [x] Configurar paleta de cores terrosa no index.css (marrom #8B6F47, bege #F5E6D3, terracota #C97064)
- [x] Importar fontes Playfair Display + Inter via Google Fonts (HTML head)
- [x] Criar schema do banco de dados (artworks, portfolio, ceramics, mentorships, etc. — 13 tabelas)
- [x] Criar dados de conteúdo (obras série Fio, categorias de portfólio)

## Fase 2: Home com Rolagem Full-Screen
- [x] Seção 1 - Abertura: hero com manifesto visual "FOTOGRAFIA É ARTE" + typewriter
- [x] Seção 2 - Vídeo Manifesto: player de vídeo com texto poético + TypewriterLines
- [x] Seção 3 - Fotografia Autoral: 3 colunas (triptych) com imagens P&B
- [x] Seção 4 - Ensaios com Alma: layout assimétrico com grid de portfólio
- [x] Seção 5 - Obras de Arte: destaque das obras da série Fio
- [x] Navegação minimalista fixa com logo, dropdowns e menu completo
- [x] Scroll snap cinematográfico (scroll-snap-type: y mandatory)
- [x] Pinceladas orgânicas decorativas (BrushStroke, BrushCorner)
- [x] Typewriter letra a letra (150ms/100ms) com delay inicial de 500ms

## Fase 3: Portfólio, Obras e Sobre
- [x] Página Portfólio com grid de categorias (Femininos, Gestante, Masculino, Autoral, Cerâmica, Projetos Especiais)
- [x] Galeria de Obras da série Fio (10+ obras com título, técnica, dimensões, valor, descrição, lightbox)
- [x] Página Sobre com manifesto completo, biografia, propósito, valores e arquétipos
- [x] Página Cerâmica com galeria de peças
- [x] Página Fotografia Autoral com séries artísticas

## Fase 4: Mentorias, Contato e Polish
- [x] Página Mentorias com descrição dos serviços e formulário de agendamento
- [x] Página Contato com WhatsApp, email e redes sociais
- [x] Responsividade mobile-first em todas as páginas
- [x] Transições suaves entre páginas
- [x] Footer com informações da marca
- [x] Testes vitest (6 testes passando)

## Fase 5: Painel Administrativo (CMS)
- [x] Dashboard com estatísticas e acesso rápido
- [x] Gestão de Obras de Arte (criar, editar, remover, upload de imagens)
- [x] Gestão de Portfólio (categorias + ensaios com upload)
- [x] Gestão de Vídeos (manifesto, bastidores, processo)
- [x] Gestão de Mentorias (criar, editar, remover)
- [x] Visualização de Agendamentos
- [x] Visualização e gestão de Mensagens (marcar como lida, responder)
- [x] Configurações globais (WhatsApp, email, redes sociais, textos)
- [x] Upload de imagens para S3 via base64
- [x] Proteção admin (role-based access control)

## Atualização de Menu (Fev 2026)
- [x] Atualizar dropdown do Portfólio no Navigation.tsx: Ensaios Femininos, Gestante, Profissional, Fotografia Autoral, Cerâmica, Projetos Especiais
- [x] Atualizar categorias fallback na página Portfolio.tsx (trocar Masculino por Profissional)
- [x] Atualizar seção 4 da Home (ensaios) com a nova categoria Profissional

## Upload Direto de Mídia (Fev 2026)
- [x] Criar componente reutilizável MediaUploader (foto + vídeo) com preview, drag-and-drop e progress bar
- [x] Integrar MediaUploader no Admin: Obras, Portfólio (categorias + ensaios), Vídeos, Configurações
- [x] Exibir vídeo nativo (<video>) na seção Manifesto da Home quando URL for arquivo S3
- [x] Suporte a upload de vídeo direto no Admin (até 500MB) e imagem (até 20MB)

## Layout e Responsividade Mobile (Fev 2026)
- [x] Corrigir layout da página Obras de Arte: grid 2 colunas bem definido, texto justificado com max-width
- [x] Corrigir Navigation mobile: menu hambúrguer funcional, itens legíveis, sem sobreposição
- [x] Ajustar tipografia e espaçamento em todas as páginas para mobile (padding, font-size, line-height)
- [x] Corrigir Home mobile: hero, manifesto, triptych e ensaios adaptados para telas pequenas
- [x] Melhorar legibilidade geral: texto justificado, max-width nos parágrafos, espaçamento entre seções

## Layout Mobile e Justificação de Texto (Fev 2026)
- [x] CSS global: texto justificado, max-width em parágrafos, breakpoints mobile refinados
- [x] Navigation mobile: menu hambúrguer com grupos visuais, espaçamento e legibilidade
- [x] Home mobile: hero, manifesto, triptych (1 coluna), ensaios (1 coluna), obras adaptados
- [x] Obras de Arte mobile: grid 2 colunas, texto justificado, detalhe da obra responsivo
- [x] Portfolio, Sobre, Mentorias, Contato: padding, font-size e layout mobile corrigidos

## Correções Visuais (Fev 2026)
- [x] Imagem 1: Título "Ensaios com Alma" quebrando no mobile — ajustar font-size e white-space
- [x] Imagem 2: Fotos subindo por baixo da navbar — corrigir z-index e padding-top da seção de obras
- [x] Imagem 3: Vídeo manifesto horizontal (16:9) no desktop, vertical (9:16) no mobile

## Melhorias de UX (Fev 2026)
- [x] Transição suave (fade-in) nas imagens da galeria ao carregar (componente GalleryImage aplicado em Obras e Portfolio)
- [x] Botão flutuante "voltar ao topo" que aparece após scroll (ScrollToTop global em App.tsx)
- [x] Seção "Sobre Mim" na página Sobre com foto e parágrafo sobre a jornada na fotografia

## Depoimentos, Contato Rápido e Newsletter (Fev 2026)
- [x] Schema: tabelas testimonials e newsletter_subscribers
- [x] Rotas tRPC: testimonials (CRUD admin + listagem pública) e newsletter (subscribe + unsubscribe + admin list)
- [x] Seção Depoimentos na página Sobre com cards elegantes
- [x] Formulário de contato rápido na página Sobre
- [x] Widget de inscrição de Newsletter (popup com delay 6s + localStorage para não repetir por 30 dias)
- [x] Gestão de Depoimentos no Admin (adicionar, editar, publicar/ocultar)
- [x] Gestão de Assinantes da Newsletter no Admin (listar, remover)
- [x] Popup de newsletter com delay de 6 segundos após entrada no site (não mostra novamente se já inscrito ou fechado na sessão)

## SEO e GEO (Fev 2026)
- [ ] Meta tags dinâmicas por página (title, description, keywords, canonical)
- [ ] Open Graph e Twitter Cards para compartilhamento social
- [ ] Schema.org JSON-LD: Person, LocalBusiness, ArtGallery, CreativeWork, BreadcrumbList
- [ ] robots.txt e sitemap.xml dinâmico
- [ ] Preconnect e preload de fontes e recursos críticos
- [ ] Atributos alt descritivos em todas as imagens
- [ ] Estrutura semântica HTML5 (article, section, main, aside, header, footer)
- [ ] GEO: llms.txt para indexação por IAs (ChatGPT, Perplexity, Claude)
- [ ] GEO: FAQ estruturado com Schema.org FAQPage
- [ ] Performance: lazy loading nativo em imagens

## Correção Mobile - Newsletter Popup (Fev 2026)
- [x] Corrigir popup de newsletter no mobile: conteúdo extravasando a caixa, tamanho e padding responsivos

## Fotos do Portfólio - Curadoria Final (Fev 2026)
- [x] Inserir 6 categorias no banco (Gestantes, Femininos, Família, Casamentos, Profissional, Editoriais)
- [x] Inserir 6 ensaios com capa e descrição
- [x] Inserir 90 fotos (15 por categoria) nas tabelas portfolio_images
- [x] Corrigir página de detalhe do portfólio para buscar fotos reais do banco (não mais placeholders)

## Substituição de Fotos Placeholder na Home (Fev 2026)
- [x] Upload das 4 fotos reais para o CDN (Fotografia Autoral, Série Fio, Maternidade, foto da mão com fio)
- [x] Substituir imagens de placeholder na seção Fotografia Autoral da home e grade 2x2 da Série Fio

## Correção Fotos de Capa das Categorias na Home (Fev 2026)
- [x] Corrigir fotos de capa das categorias Ensaios Femininos, Gestante e Profissional — upload para CDN e atualização no banco

## Seção Blog SEO+GEO (Fev 2026)
- [x] Schema: tabela blog_posts com campos SEO (metaTitle, metaDescription, canonicalUrl, ogImage, keywords, schema JSON-LD)
- [x] Migrar banco de dados com pnpm db:push
- [x] Rotas tRPC: blog.getAll, blog.getBySlug, blog.upsert, blog.delete, blog.getSitemap
- [x] Página /blog — listagem com SEO (title, description, Open Graph, Schema.org BlogPosting list)
- [x] Página /blog/:slug — leitura com Schema.org Article, breadcrumbs, Open Graph, canonical URL
- [x] Dados estruturados GEO: author, datePublished, wordCount, readingTime
- [x] Adicionar Blog ao menu de navegação principal
- [x] Gerenciamento de posts no Admin com campos SEO editáveis
- [x] Agente autônomo: pesquisa tendências, escreve com voz da Camilla, gera imagem de capa, publica automaticamente
- [x] Scheduler: toda quinta-feira às 09:00 BRT (node-cron, timezone America/Sao_Paulo)
- [x] Voz calibrada com briefing completo (regras inegociáveis, vocábulário proibido, 10 editorias)

## Correção Urgente - Fotos de Capa na Home (Fev 2026)
- [x] Corrigir seção de portfólio da home para buscar coverImageUrl do banco em vez de usar constantes hardcoded

## Publicação Posts de Referência + Menu (Fev 2026)
- [x] Publicar "A IA não vai te salvar" no blog com SEO completo
- [x] Publicar "Fotografia não é registro" no blog com SEO completo
- [x] Publicar "Wong Kar-wai e a luz" no blog com SEO completo
- [x] Adicionar Família, Casamentos e Editoriais ao dropdown do menu de portfólio (já implementado)

## Correções Adicionais (Fev 2026)
- [ ] Corrigir título "Ensaios com Alma" quebrando na seção 4 da home

## Obras de Arte - Catálogo Real (Fev 2026)
- [ ] Atualizar obras da Série Fio no banco com dados reais do catálogo (título, técnica, dimensões, descrição, imagem — sem preço)

## Melhoria Experiência de Leitura do Blog (Fev 2026)
- [x] Melhorar tipografia, espaçamento entre parágrafos, largura de leitura e hierarquia visual da página de post
- [x] Adicionar campos audioUrl e videoUrl ao schema das obras da Série Fio
- [x] Implementar player de áudio com autoplay na página das obras

## Admin Completo - Cerâmica e Projetos Especiais (Fev 2026)
- [x] Criar CeramicsAdmin no painel admin com CRUD completo
- [x] Criar SpecialProjectsAdmin no painel admin com CRUD completo
- [x] Integrar CeramicsAdmin e SpecialProjectsAdmin no Admin.tsx
- [x] Adicionar campos audioUrl e videoUrl ao formulário de obras no admin

## Blog Imagético - Post Wong Kar-wai (Fev 2026)
- [x] Buscar imagens reais dos filmes de Wong Kar-wai
- [x] Gerar 4 imagens com IA para ilustrar conceitos do post
- [x] Fazer upload de todas as imagens para o CDN
- [x] Criar post completo de Wong Kar-wai com imagens integradas no HTML
- [x] Melhorar CSS do blog: post-figure, post-figure--wide, post-figure--side-by-side, post-lead, post-note
- [x] Atualizar agente de blog para gerar imagens inline em novos posts

## Ajustes Visuais (Mar 2026)
- [x] Ajustar letter-spacing do menu de navegação (reduzir respiro excessivo entre letras)

## Agente de Newsletter (Mar 2026)
- [ ] Integrar Resend no projeto com API Key como secret
- [ ] Criar agente de newsletter com pesquisa profunda e geração de conteúdo HTML editorial
- [ ] Criar tabela de newsletters enviadas no banco de dados
- [ ] Criar painel de monitoramento de newsletters no admin
- [ ] Configurar agendamento alternando terças e quartas entre 09h-11h

## Agente de Newsletter — Implementação Completa (Mar 2026)
- [x] Schema: tabelas newsletter_subscribers (com contentPreferences, frequencyPreference, blogAlert), newsletters_sent, email_events
- [x] Instalar pacote Resend (pnpm add resend)
- [x] Migrar banco de dados (pnpm db:push)
- [x] Agente newsletter-agent.ts (641 linhas): geração de conteúdo com voz da Camilla via LLM, template HTML editorial com identidade visual terrosa
- [x] Agendamento rotativo: terça → quarta → quinta (A/B testing de engajamento)
- [x] Horário inteligente: entre 11h–14h (pico de abertura no Brasil)
- [x] Rastreamento de abertura (pixel de tracking) e cliques (redirect rastreado)
- [x] Link de descadastro one-click (padrão RFC List-Unsubscribe)
- [x] Alerta automático se taxa de unsubscribe > 0,5%
- [x] Formulário de inscrição com preferências de conteúdo (Tudo / Ensaios / Arte / Mentoria) + alerta de novas publicações no blog
- [x] Rotas tRPC: send, preview, health, getAll, updateSubscriber, subscribeWithPreferences
- [x] Painel admin completo: campanhas enviadas (abertura, cliques, unsub), assinantes com preferências, analytics por dia da semana, pré-visualização de email
- [x] RESEND_API_KEY configurada e validada (re_Y2k37... — domínio camillavieira.art verificado, envio testado com sucesso)

## Sistema de Compras + CRM Unificado (Mar 2026)
- [x] Tabelas clients, professional_orders, deliverables, crmNotes adicionadas ao schema e migradas
- [x] products-marca-pessoal.ts: catálogo completo de pacotes e serviços avulsos
- [x] crm-db.ts: helpers de banco para CRM unificado (todos os clientes)
- [ ] Rotas tRPC para checkout de marca pessoal (createSession, webhook Stripe)
- [ ] Rotas tRPC para CRM admin (listOrders, getOrder, updateStage, updateDates, addNote, updateDeliverable)
- [ ] Página pública /mentorias/profissionais com pacotes, serviços avulsos e CheckoutModal
- [x] CRM Kanban no admin (/admin/crm) com drag-and-drop, estágios, detalhes de lead
- [ ] Ficha completa do cliente: dados, produto, prazos automáticos, histórico de atividades
- [x] Webhook Stripe para marcar pedido como pago automaticamente
- [x] Notificação para Camilla a cada novo pedido confirmado

## Sistema de Compras (A implementar)
- [x] Stripe integrado (STRIPE_SECRET_KEY + VITE_STRIPE_PUBLISHABLE_KEY configurados)
- [x] Schema: tabelas products, orders (já existiam no banco)
- [x] shop-router.ts: listProducts, getProduct, createCheckoutSession, getOrderStatus, adminListProducts, upsertProduct, deleteProduct, adminListOrders, updateOrderStatus, getOrderStats
- [x] Webhook Stripe /api/stripe/webhook com verificação de assinatura
- [x] Página /loja — listagem de produtos por categoria com filtros
- [x] Página /loja/:slug — detalhe do produto com checkout modal
- [x] Página /loja/sucesso — confirmação de pedido com status em tempo real
- [x] Painel admin /admin/loja — gestão de produtos (CRUD + sync Stripe) e pedidos (status, rastreio, notas)
- [x] Link "Loja" adicionado ao menu de navegação (desktop + mobile)
- [x] Notificação para Camilla a cada pedido confirmado via webhook

## Formulários Públicos de CRM (Mar 2026)
- [ ] Tabela lead_forms no banco (token único, tipo: onboarding | satisfacao, lead_id, status: pending | filled, respostas JSON)
- [ ] Rotas tRPC: generateFormLink, getFormByToken, submitOnboarding, submitSatisfacao
- [ ] Página pública /onboarding/:token — formulário de dados do cliente (leads negociando/quentes)
- [ ] Página pública /satisfacao/:token — pesquisa de satisfação NPS (clientes fechados)
- [ ] Painel admin: visualizar respostas dos formulários por lead
- [ ] Gerar links para os 27 leads importados (9 negociando/quentes → onboarding, 15 fechados → satisfação)

## Conformidade Legal LGPD (CRÍTICO — Mar 2026)
- [x] Página /privacidade — Política de Privacidade completa (LGPD/GDPR)
- [x] Página /termos — Termos de Uso completos
- [x] Links no rodapé do site apontando para /privacidade e /termos
- [x] WhatsApp no rodapé corrigido para (61) 99108-7909

## Skill Reutilizável (Mar 2026)
- [ ] Criar skill marca-pessoal-digital com scripts de importação de leads, base de conhecimento e SKILL.md

## SEO — Schema Markup (CRÍTICO — Mar 2026)
- [x] Schema BlogPosting JSON-LD em cada post do blog (author, datePublished, dateModified, image, description, keywords, breadcrumb, publisher) — JA IMPLEMENTADO
- [x] Schema Person na página /sobre
- [x] Schema LocalBusiness na página /contato

## Ativação da Conta Stripe (PENDENTE)
- [ ] Acessar dashboard.stripe.com com camillavieirafotografia@gmail.com e completar o cadastro KYC (nome, CPF, endereço, dados bancários) para ativar charges_enabled e payouts_enabled — sem isso pagamentos reais não são processados

## Estratégia de Clusters de Blog — 8 Posts (Mar 2026)
- [x] Definir clusters SEO e palavras-chave para cada post
- [x] Redigir 8 posts completos com voz da Camilla e HTML editorial
- [x] Gerar imagens de capa para cada post via IA
- [x] Publicar todos os posts no banco de dados

## Links Internos + Post Pilar Cerâmica + Posts Pendentes (Mar 2026)
- [x] Adicionar links internos: "O que é ensaio feminino" → "Como se preparar"
- [x] Adicionar links internos: "Fotógrafa em Brasília" → posts de ensaio feminino
- [x] Criar post pilar "Cerâmica artesanal em Brasília: o atelê da Camilla Vieira""
- [x] Publicar 3 posts pendentes: "A IA não vai te salvar", "Fotografia não é registro", "Wong Kar-wai e a luz" (já estavam publicados)

## Menu Portfólio — Categorias Faltantes (Mar 2026)
- [x] Adicionar Família, Casamentos e Editoriais ao dropdown do menu de portfólio (já estavam implementados)
- [x] Garantir que Portfolio.tsx reconhece as 3 novas categorias (busca do banco via trpc.categories.getAll)

## Correção Agente de Blog — Imagens Inline (Mar 2026)
- [x] Publicar post "Fio e Algoritmo" que falhou (5 imagens geradas + inserido no banco)
- [x] Corrigir agente de blog para substituir {{IMAGE_PLACEHOLDER}} por imagens geradas via IA antes de salvar no banco (função resolveInlineImages adicionada na etapa 4b)

## Correção Retroativa — Imagens Inline em Todos os Posts (Mar 2026)
- [x] Identificar posts com {{IMAGE_PLACEHOLDER}} no banco (1 post encontrado: Vivian Maier, id=120001)
- [x] Gerar 4 imagens reais para o post Vivian Maier (street photography P&B anos 1950)
- [x] Atualizar conteúdo do post no banco com URLs CDN reais — 0 placeholders restantes em 15 posts publicados

## Auditoria Editorial do Blog (Mar 2026)
- [x] Auditar todos os 15 posts publicados (título, capa, excerpt, categoria, metadados SEO, wordCount)
- [x] Gerar e adicionar imagem de capa ao post pilar de cerâmica (id=90001)
- [x] Corrigir wordCount=0 nos posts originais (ids 1, 2, 3) — contagem real: 787, 950, 1006 palavras
- [x] Corrigir typo "atelê" → "ateliê" no título do post pilar de cerâmica

## Sitemap.xml — Correção Crítica de SEO (Mar 2026)
- [x] Corrigir sitemap para incluir todos os posts do blog dinamicamente (endpoint dinâmico no Express)
- [x] Garantir que novos posts apareçam automaticamente no sitemap após publicação (busca do banco em tempo real)

## Feed RSS do Blog (Mar 2026)
- [x] Criar endpoint /feed.xml no Express com os 20 posts mais recentes (15 posts retornados)
- [x] Adicionar link de descoberta automática RSS no <head> do HTML
- [x] Adicionar botão RSS visível na página /blog (hero section, estilo dourado)

## Localização e Atendimento Nacional (Mar 2026)
- [x] Atualizar metadados SEO: Brasília (DF) como base, SP mensalmente, outros estados sob interesse
- [x] Atualizar Schema.org LocalBusiness: areaServed [Brasília, São Paulo, Brasil]
- [ ] Atualizar página /sobre com informação de atendimento em outros estados
- [x] Atualizar página /contato com bloco "Onde Atendo" (Brasília, SP, outros estados)
- [x] Adicionar badges de localização na seção "Ensaios com Alma" da home

## Admin Completo — 3 Seções Faltantes (Mar 2026)
- [x] Admin Fotografia Autoral (/admin/fotografia): CRUD de séries artísticas + upload de fotos
- [x] Admin Página /sobre (/admin/sobre): editar biografia, foto, valores, propósito
- [x] Admin Home (/admin/home): editar textos do manifesto, CTAs e seções editáveis

## Conexão Admin → Páginas Públicas (Mar 2026)
- [x] Conectar /sobre ao banco: foto de perfil, foto secundária, bio p1/p2/p3, manifesto 1/2/3, título hero, CTA
- [x] Conectar /home ao banco: hero (título, subtítulo, eyebrow, CTAs, imagem de fundo), manifesto (linhas 1/2/3, vídeo), ensaios (título, subtítulo, CTA), obras (título, subtítulo, CTA)
- [x] Garantir que alterações no /admin/sobre aparecem imediatamente na página pública /sobre
- [x] Garantir que alterações no /admin/home aparecem imediatamente na página pública /home

## Correção Crítica — Formulário de Contato (Mar 2026)
- [x] Corrigir formulário de contato: adicionar tag <form> real com onSubmit
- [x] Validação de campos obrigatórios (nome, email, mensagem) com feedback visual
- [x] Envio via tRPC (mutation contact.send) com loading state e toast de confirmação
- [x] Backend: salvar mensagem no banco de dados (tabela contact_messages)
- [x] Backend: notificar Camilla via notifyOwner ao receber nova mensagem
- [x] Testar fluxo completo: preenchimento → envio → confirmação → mensagem no admin

## Schema.org Completo — Rich Snippets (Mar 2026)
- [x] Criar componente SchemaScript reutilizável para injetar JSON-LD no head
- [x] Schema Person na /sobre (nome, foto, jobTitle, sameAs redes sociais, knowsAbout)
- [x] Schema LocalBusiness na /contato (já existe, revisar e completar)
- [x] Schema WebSite global com SearchAction (sitelinks search box)
- [x] Schema BlogPosting em /blog/:slug (author, datePublished, dateModified, image, headline, keywords, wordCount)
- [x] Schema ItemList em /blog (lista de posts recentes)
- [x] Schema Product em /loja/:slug (name, description, image, offers, brand)
- [x] Schema ItemList em /loja (lista de produtos)
- [x] Schema Service em /mentorias (name, description, provider, areaServed, offers)
- [x] Schema ArtGallery + CreativeWork em /obras (artworks com name, creator, artMedium, artworkSurface, image)
- [x] Schema BreadcrumbList em todas as páginas internas (/sobre, /contato, /blog, /loja, /obras, /portfolio, /mentorias)
- [x] Schema FAQPage na home (perguntas frequentes sobre ensaios e serviços)
- [x] Schema ImageObject nas fotos principais do portfólio

## Validação Schema.org + Formulários CRM (Mar 2026)
- [x] Validar schemas no Google Rich Results Test — LocalBusiness e Organization válidos; FAQPage duplicado removido do index.html
- [x] Criar tabela lead_forms no banco (token único, tipo: onboarding | satisfacao, lead_id, status: pending | filled, respostas JSON)
- [x] Rotas tRPC: generateFormLinks, getFormByToken, submitOnboarding, submitSatisfacao
- [x] Página pública /onboarding/:token — formulário de dados do cliente
- [x] Página pública /satisfacao/:token — pesquisa de satisfação NPS
- [x] Painel admin: visualizar respostas dos formulários por lead + botões Gerar link Onboarding / NPS
- [x] Corrigir URL dos links copiados (/onboarding/:token e /satisfacao/:token)
- [ ] Gerar links para os 27 leads importados (fazer via botão no admin)

## Sistema de Tags no CRM (Mar 2026)
- [x] Tabelas: crm_tags (id, name, color, createdAt) e lead_tags (leadId, tagId)
- [x] Migrar banco com SQL direto (db:push falhou em tabelas existentes)
- [x] Rotas tRPC: tags.getAll, tags.create, tags.update, tags.delete, tags.assignToLead, tags.removeFromLead, tags.getForLead
- [x] UI: exibir tags nos cards do Kanban (chips coloridos)
- [x] UI: painel de detalhes do lead — adicionar/remover tags com dropdown
- [x] UI: componente NewTagForm (criar nova tag inline com nome + seletor de cor)
- [x] UI: filtro por tag no Kanban (barra de filtros acima do board)
- [x] Tags padrão pré-criadas: Gestante, Feminino, Família, Profissional, Cerâmica, Mentoria, VIP, Urgente

## Sitemap.xml — Correção Urgente SEO (Mar 2026)
- [x] Sitemap.xml já inclui todos os 15 posts publicados do blog dinamicamente (2 estão como rascunho)
- [x] Novos posts aparecem automaticamente no sitemap ao serem publicados
- [x] /obras/:slug e /loja/:slug incluídos no sitemap

## Correção Formulário de Contato — Envio Real por E-mail (Mar 2026)
- [x] Investigar: formulário usa onSubmit React com e.preventDefault() — não há method="get"
- [x] Formulário usa estado controlado React sem react-hook-form — robusto e sem dependência
- [x] Configurar envio de e-mail via Resend para contato@camillavieira.art ao receber nova mensagem
- [x] Tela de sucesso já presente após envio
- [x] Corrigir erro de caractere Unicode U+2500 no leads-router.ts que causava crash do esbuild

## SEO Blog — Links Internos e CTAs (Mar 2026)
- [x] Adicionar 2-3 links internos contextuais em cada um dos 17 posts do blog (para /mentorias, /portfolio, /contato, posts relacionados)
- [x] Adicionar bloco de CTA visualmente distinto no final de cada post (botão para ação relevante: agendar mentoria, ver portfólio, entrar em contato)

## Bug — Erro JSON na Home (Mar 2026)
- [x] Corrigir erro "Unexpected token '<' is not valid JSON" na página inicial — era erro transiente de restart do servidor; adicionado onError handler no tRPC para melhor diagnóstico futuro

## Infraestrutura — GitHub (Mar 2026)
- [x] GitHub conectado: github.com/camillavieiraart/Camillavieira.art (648 arquivos, branch main)
  - Remote Manus (origin): checkpoints e deploy interno
  - Remote GitHub (github): repositório pessoal da Camilla
- [ ] Sincronizar GitHub automaticamente a cada checkpoint

## E-mail Profissional (Mar 2026)
- [x] Caixa contato@camillavieira.art criada no GoDaddy (plano ativo até 11/03/2026)
- [x] Gmail configurado para enviar como contato@camillavieira.art (SMTP smtp.gmail.com, porta 587 TLS)
- [ ] Configurar POP3 no Gmail para receber cópias da caixa GoDaddy
- [ ] Agente de IA para responder e-mails automaticamente (Google Apps Script + Gemini) — pausado aguardando chave Gemini API e número WhatsApp

## Pendências Gerais (Mar 2026)
- [ ] Ativar Stripe KYC (dashboard.stripe.com — CPF, endereço, dados bancários)
- [ ] Configurar IA no WhatsApp (ManyChat, Typebot + Z-API, ou Wati)

## Bug — Imagens de Capa Quebradas no Blog (Mar 2026)
- [ ] Corrigir imagens de capa quebradas: "A IA não vai te salvar", "Fotografia não é registro", "Wong Kar-wai" e outros posts sem coverImageUrl válida

## Páginas de Venda de Serviços (Mar 2026)
- [x] Criar página de venda /ensaio-gestante: hero, sobre o ensaio, galeria, processo em 4 etapas, detalhes práticos, 3 pacotes com preços, FAQ com accordion, formulário de agendamento, Schema.org Service
- [x] Criar página de venda /ensaio-feminino: hero, para quem é, galeria, processo em 4 etapas, detalhes práticos, 3 pacotes com preços, depoimentos, FAQ com accordion, formulário de agendamento, Schema.org Service
- [x] Adicionar links ✦ Ensaio Feminino e ✦ Ensaio Gestante ao dropdown do menu desktop e menu mobile
- [x] Corrigir sitemap.xml: remover arquivo estático client/public/sitemap.xml que sobrescrevia endpoint dinâmico em produção
- [x] Corrigir imagens de capa dos posts IDs 1, 2, 3 com URLs CDN válidas

## CTAs Estratégicos no Portfólio (Mar 2026)
- [ ] CTAs em 3 pontos (topo/meio/final) nas páginas de categoria do portfólio com textos específicos por tipo de ensaio
- [ ] Criar página de venda /ensaio-bebe: Ensaio de Bebê Lifestyle (não newborn) — 1º ensaio ~15 dias, estilo lifestyle, com pacote de acompanhamento anual

## Pagamentos e IA WhatsApp (Mar 2026)
- [ ] Configurar Stripe para receber pagamentos (ensaios, mentorias, produtos da loja)
- [ ] Definir e integrar solução de IA para WhatsApp

## Pagamentos Stripe (Mar 2026)
- [ ] Criar produtos e preços no Stripe (ensaios, mentorias, produtos digitais)
- [ ] Implementar checkout Stripe nas páginas de serviço (Ensaio Gestante, Feminino, Mentorias)
- [ ] Webhook Stripe para confirmar pagamentos e notificar admin
- [ ] Página de confirmação de pagamento (/pagamento-confirmado)
- [ ] Histórico de pedidos no admin

## Agendamento - Google Calendar e Calendly (Mar 2026)
- [ ] Configurar Google Calendar Appointment Scheduling: Call de Alinhamento 30min-1h, seg-sex 10h-17h, qua até 18h
- [ ] Testar Calendly amanhã como alternativa com integração Stripe nativa
- [ ] Agente de fechamento: capturar nome, e-mail e telefone do visitante logo na entrada para alimentar o CRM mesmo que não feche
- [ ] Agente de fechamento: enviar lead capturado automaticamente para o CRM do site
- [ ] Agente de fechamento: fluxo de follow-up automático por e-mail para leads que não fecharam

## Para Amanhã (10/Mar/2026)
- [ ] Testar e configurar Calendly com integração Stripe nativa para agendamento automático
- [ ] Conectar IA do WhatsApp via Wati (criar conta, migrar número para WhatsApp Business API, treinar IA com serviços)
- [ ] Conectar agente de fechamento ao Calendly (trocar placeholder do Google Calendar)

## Página de Obras - CTAs e Como Comprar (Mar 2026)
- [ ] Adicionar botão "Tenho Interesse" em cada obra com link para WhatsApp/formulário
- [ ] Criar seção "Como Comprar" com prazo, frete, certificado, pagamento, devolução
- [ ] Adicionar CTA final "Fale Comigo sobre Obras" no rodapé da página

## Blog - Links Internos Estratégicos (Mar 2026)
- [ ] Editar os 5 posts mais importantes para incluir 2-3 links internos contextuais para páginas de serviço (/ensaio-gestante, /ensaio-feminino, /mentorias) e posts relacionados

## SEO — Correções de Localização e Sitemap (Mar 2026)
- [x] Corrigir "Belo Horizonte" para "Brasília" no hook useSEO.ts (descrição padrão)
- [x] Corrigir "Belo Horizonte" para "Brasília" na meta description de /mentorias
- [x] Corrigir "Belo Horizonte" para "Brasília" na meta description de /portfolio
- [x] Ajustar meta descriptions das páginas de serviço para ≤160 chars
- [x] Ajustar títulos das páginas /ensaio-feminino e /ensaio-gestante para ≤60 chars
- [x] Adicionar /ensaio-feminino e /ensaio-gestante ao sitemap dinâmico do servidor
- [x] Sitemap dinâmico agora tem 37 URLs: 22 páginas estáticas + 15 posts do blog

## Admin — Botão Flutuante de Edição (Mar 2026)
- [x] Criar componente AdminFloatingButton (visível apenas para admin)
- [x] Adicionar botão em Portfolio.tsx → /admin/portfolio
- [x] Adicionar botão em Ceramica.tsx → /admin/ceramica
- [x] Adicionar botão em Obras.tsx → /admin/obras
- [x] Adicionar botão em Projetos.tsx → /admin/projetos
- [x] Adicionar botão em Fotografia.tsx → /admin/fotografia

## CRM — Funil do Agente de Vendas (Mar 2026)
- [x] Adicionar colunas de rastreamento na tabela leads (funnel_step, package_interest, preferred_dates, payment_status, etc.)
- [x] Criar endpoint público /api/funnel-event para receber eventos do agente de vendas
- [x] Adicionar aba "Funil do Agente" no CRM (AdminCRM.tsx) com visualização por etapa
- [x] Criar vendasdemo-v3-final.zip com Home.tsx atualizado para tracking do funil

## Correções de SEO
- [x] Corrigir H1 ausente na página inicial: adicionado span estático com sr-only para crawlers, mantendo efeito typewriter visual
- [x] Otimizar meta description da página inicial com foco em intenção de busca e proposta de valor

## SEO Global (3 camadas)
- [ ] useSEO hook: hreflang PT/EN/FR + meta descriptions multilíngues
- [ ] Schema.org Person + LocalBusiness + ArtGallery com cobertura internacional
- [ ] Conteúdo SEO textual na página Sobre com palavras-chave de autoridade global

## SEO + GEO Global (todas as IAs + mercados internacionais)
- [x] useSEO hook: hreflang PT/EN/FR + meta tags para crawlers de IA
- [x] Schema.org expandido: Person/LocalBusiness/ArtGallery com cobertura internacional
- [x] llms.txt: arquivo de autoridade para crawlers de IA (ChatGPT, Claude, Manus, Perplexity, Gemini)
- [x] robots.txt otimizado: permitir crawlers de IA e Googlebot
- [ ] sitemap.xml dinâmico: incluir blog, portfólio, obras e todas as páginas
- [x] Blog e artigos: Schema BlogPosting com autor, data, idioma e hreflang
- [x] Home: ativar hreflang multilíngue e keywords internacionais

## Portfólio com Galerias SEO
- [x] Analisar estrutura atual do portfólio e schema do banco de dados de fotos
- [x] Implementar alt text semântico e legendas SEO nas galerias (Portfólio, Obras, Cerâmica)
- [x] Adicionar Schema.org ImageGallery e ImageObject em todas as páginas de galeria
- [x] Garantir lazy loading, atributo loading="lazy" e dimensões explícitas nas imagens

## Novas Funcionalidades (Mar 2026)
- [x] Seção de depoimentos na Home com formulário de envio de feedback
- [x] Tabela testimonials no banco de dados com moderação admin
- [x] Página Sobre Mim detalhada: biografia, prêmios e exposições
- [x] Blog com suporte multilíngue PT/EN/FR e seletor de idioma
- [x] Campo language na tabela blog_posts para suporte multilíngue

## Dados Reais — Prêmios, Exposições e Palestras (Mar 2026)
- [ ] Pesquisar detalhes dos 6 podcasts (título, canal, data, descrição)
- [ ] Pesquisar detalhes da exposição Fio (Metrópoles)
- [ ] Pesquisar detalhes das palestras (Instagram posts)
- [ ] Atualizar página Sobre com dados reais de podcasts, exposição e palestras

## Bugs Mobile (Mar 2026)
- [x] Portfólio: clicar em categoria redireciona para /portfolio em vez de abrir a galeria da categoria
- [x] Home: imagens do triptych de Fotografia Autoral não são clicáveis no mobile

## Auditoria de Navegação + Blog Mobile (Mar 2026)
- [x] Auditar todos os links do site e corrigir bugs de navegação (bug link newsletter Loja corrigido)
- [x] Adicionar seção de preview do blog no final da Home (mobile-first)

## Links Diretos ao Vendasdemo nos CTAs (Mar 2026)
- [x] Mapear parâmetros de URL do vendasdemo: ?tab=essencia, ?tab=gestante, ?tab=profissional, etc.
- [x] EnsaioFeminino.tsx: botão hero e "Quero este pacote" → vendasdemo/?tab=essencia
- [x] EnsaioGestante.tsx: botão hero e "Quero este pacote" → vendasdemo/?tab=gestante
- [x] EnsaioProfissional.tsx: botão hero e "Quero este pacote" → vendasdemo/?tab=profissional

## Bug — Links da Newsletter com Erro (Mar 2026)
- [x] Investigar por que links do e-mail da newsletter para /blog e /portfolio retornam erro — causa: rotas /api/newsletter/track e /api/newsletter/unsubscribe nunca foram registradas no Express
- [x] Criar rota GET /api/newsletter/track: type=open retorna pixel GIF 1x1; type=click redireciona para URL destino (302)
- [x] Criar rota GET /api/newsletter/unsubscribe: cancela inscrição e redireciona para /?unsubscribe=success
- [x] Criar rota POST /api/newsletter/unsubscribe: one-click RFC 8058 (List-Unsubscribe-Post)
- [x] Testar todas as rotas localmente — respostas corretas (302 redirect, 200 GIF, 302 unsubscribe)

## Correções Visuais — Arquétipos e Botão Flutuante (Mar 2026)
- [x] Renomear arquétipo A Maga → A Artista (texto atualizado: "A câmera é sua linguagem — a luz, sua matéria")
- [x] Renomear arquétipo A Sábia → A Mentora (texto atualizado: "Conduz porque sabe que o crescimento é coletivo")
- [x] Atualizar frase do manifesto: "Sou Criadora, Artista e Mentora"
- [x] Botão flutuante "Agendar Ensaio": no mobile fica no canto inferior esquerdo (left-4), no desktop mantém direita (sm:right-6) — evita sobreposição com chat Octalk

## Galeria Maneva Origem (Mar 2026)
- [x] Upload das 31 fotos do DVD Maneva Origem para o CDN
- [x] Adicionar seção "Direção de Fotografia" na página /sobre com galeria masonry das 31 fotos (entre Exposições e Podcasts)

## Página /ensaio-profissional e CTAs Portfólio (Mar 2026)
- [x] Criar página /ensaio-profissional com hero, para quem é, galeria, processo, pacotes (Essencial/Profissional/Premium), FAQ, depoimentos e formulário
- [x] Registrar rota /ensaio-profissional no App.tsx
- [x] Corrigir CTA da categoria "profissional" no portfólio para apontar para /ensaio-profissional (estava apontando para /contato)
- [x] CTAs estratégicos no portfólio (topo, meio, final) já implementados para todas as categorias

## Menu de Navegação — Ensaio Profissional (Mar 2026)
- [x] Adicionar /ensaio-profissional ao dropdown de navegação principal

## Bug — Admin sem Botão de Login (Mar 2026)
- [x] Corrigir página /admin para redirecionar automaticamente para login quando usuário não está autenticado (em vez de mostrar "Acesso Restrito" sem saída)

## SEO — Home (/) (Mar 2026)
- [x] Reduzir keywords de 24 para 6 palavras-chave focadas (Brasília + serviços principais + marca)
- [x] Encurtar description de 179 para 118 caracteres (dentro do limite de 160)

## Skill SEO + Auditoria de Páginas (Mar 2026)
- [x] Criar skill seo-page-audit com script Python de auditoria automática
- [x] Script verifica: useSEO presente, description 50-160 chars, keywords 3-8 termos, canonical, Schema.org
- [x] Portfolio.tsx: description reduzida de 167 para 125 chars; keywords reduzidas de 9 para 6 termos focados
- [x] Obras.tsx: keywords reduzidas de 9 para 6 termos focados (removidos termos em inglês/francês)
- [x] EnsaioProfissional.tsx: adicionado Schema.org Service com breadcrumb e offers (3 pacotes)
- [x] Fotografia.tsx: adicionado useSEO na FotografiaOverview (description + keywords + canonical)
- [x] Projetos.tsx: adicionado useSEO (description + keywords + canonical)
- [x] ClienteVip.tsx: adicionadas keywords ao useSEO existente
- [x] PedidoSucesso.tsx: description expandida de 38 para 115 chars; keywords adicionadas

## Simplificação do Portfólio (Mar 2026)
- [x] Página pública: clicar em categoria abre galeria masonry com TODAS as fotos da categoria (sem ensaios)
- [x] Admin: entrar na categoria e fazer upload de várias fotos de uma vez (botão "Adicionar Fotos")
- [x] Admin: listar todas as fotos da categoria com opção de remover
- [x] Admin: campo de texto/descrição editável por categoria (aparece abaixo da galeria)

## Reformulação Portfólio + Loja + Obras (Mar 2026)
- [x] Portfólio público: clicar em categoria abre galeria masonry com TODAS as fotos (sem ensaios intermediários)
- [x] Portfólio admin (AdminFotos): upload múltiplo de fotos direto na categoria, sem criar ensaios
- [x] Portfólio admin: listar todas as fotos da categoria com botão remover
- [x] Portfólio admin: campo de texto/descrição editável por categoria
- [x] Schema artworks: adicionar campo buyUrl (link direto de compra)
- [x] Loja: reformular para vender fotos avulsas, obras de arte, cerâmica e ensaios
- [x] Loja: grid com filtro por categoria, busca por nome, ordenação (mais recente, preço)
- [x] Loja: cada item com foto, título, preço e botão "Comprar" direto
- [x] Obras admin: upload direto de áudio (sem precisar colar URL)
- [x] Obras admin: upload direto de vídeo (sem precisar colar URL)
- [x] Obras admin: campo link de compra (buyUrl) por obra
- [x] Obras público: botão "Adquirir esta obra" com link direto de compra

## Upload Inline na Galeria Pública (Mar 2026)

- [ ] Portfólio público: quando logada como admin, mostrar botão "+" flutuante na galeria para adicionar fotos direto na página
- [ ] Portfólio público: quando logada, mostrar botão "×" em cada foto para remover direto na galeria
- [ ] Portfólio público: quando logada, mostrar campo de descrição editável inline (clica e edita)
- [ ] Corrigir rota "Em breve" no admin que aparece quando a URL não corresponde a nenhuma seção

## Link na Bio Instagram (Mar 2026)
- [x] Criar página /links com foto da Camilla, identidade visual e 6 botões
- [x] Botões: Agendar Ensaio (1º), WhatsApp, Site, Portfólio, Loja, Mentoria
- [x] Upload da foto para CDN e design com fundo terroso escuro

## Venda de Presets (Mar 2026)
- [ ] Criar página /presets com 5 packs (Feminino, P&B, Editorial, Vintage, Cinematográfico) a R$97 cada + bundle R$347
- [ ] Configurar Stripe para pagamento dos presets
- [ ] Configurar entrega automática por e-mail após pagamento (link de download)
- [ ] Upload dos arquivos .xmp/.dng para o CDN (aguardando envio da Camilla)
- [ ] Adicionar "Presets" ao botão da página /links

## Fine Art / Quadros para Venda (Mar 2026)

- [x] Inserir 14 obras Fine Art no banco de dados com URLs do CDN e preços
- [x] Criar tabela de variações de tamanho/acabamento (30x45, 60x90, 90x120 — Canvas / Fine Art)
- [x] Criar produtos Stripe para cada variação
- [x] Implementar UI de venda na página de Obras de Arte com seletor de tamanho/acabamento e checkout
- [x] Testes vitest para lógica de variantes Fine Art (15 testes passando)

## Simplificação de Navegação (Jul 2026)
- [x] Redesenhar menu desktop: de 12+ itens para 5 grupos (Portfólio, Obras, Ensaios, Blog, Sobre)
- [x] Obras agrupa: Série Fio, Fine Art, Cerâmica, Fotografia Autoral, Projetos Especiais
- [x] Ensaios agrupa: Ensaio Feminino, Gestante, Profissional (páginas de venda)
- [x] Sobre agrupa: Sobre Camilla, Mentorias, Contato
- [x] Menu mobile reorganizado com os mesmos 5 grupos
- [x] Footer expandido para 4 colunas com links secundários preservados
- [x] Botão flutuante "Agendar Ensaio" aponta para /ensaio-feminino (interno)
- [x] Botão flutuante oculto nas páginas de ensaio e admin
- [x] CTA da seção Ensaios na Home: botão primário "Agendar Ensaio" + botão secundário portfólio
- [x] CTA da seção Obras na Home: botão "Comprar Fine Art" + botão "Explorar Obras"
- [x] CTA da seção Fotografia Autoral: dois botões (Portfólio + Obras de Arte)
- [x] Corrigir número WhatsApp no CTA do portfólio: (61) 99108-7909
- [x] Adicionar classe CSS btn-primary-dark (terracota para fundos claros)

## Auditoria GitHub e Ambiente Local (Jul 2026)
- [x] Confirmar a direção e o comportamento da sincronização entre Manus e GitHub
- [x] Verificar a existência de guia seguro para variáveis de ambiente locais
- [x] Orientar o uso de chaves Stripe de teste e banco local sem expor segredos de produção
- [x] Criar guia de modelo seguro para `.env.local` sem incluir valores confidenciais
- [x] Mapear dependências de plataforma: banco, storage/Forge, OAuth e rotinas de infraestrutura
- [x] Documentar limitações de execução em localhost e plano de saída da plataforma
