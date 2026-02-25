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
