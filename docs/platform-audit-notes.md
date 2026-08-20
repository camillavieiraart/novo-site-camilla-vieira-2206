# Notas de Auditoria da Plataforma

## Ambiente do servidor

O contrato de ambiente do servidor usa `VITE_APP_ID`, `JWT_SECRET`, `DATABASE_URL`, `OAUTH_SERVER_URL`, `OWNER_OPEN_ID`, `BUILT_IN_FORGE_API_URL` e `BUILT_IN_FORGE_API_KEY`. Os valores não são registrados neste documento.

## Storage

O projeto envia e obtém arquivos pelo proxy Forge através de `BUILT_IN_FORGE_API_URL` e `BUILT_IN_FORGE_API_KEY`. O adaptador chama os endpoints `v1/storage/upload` e `v1/storage/downloadUrl` com token Bearer. O código não contém função de listagem ou exportação integral de mídia.

## Autenticação

O login do administrador depende do portal OAuth da plataforma. No navegador, a URL de retorno é formada dinamicamente como `${window.location.origin}/api/oauth/callback`; no servidor, essa rota troca o código de autorização por dados do usuário e cria um cookie de sessão próprio. Portanto, em localhost o callback esperado é `http://localhost:<porta>/api/oauth/callback`, mas a origem precisa ser aceita pelo provedor OAuth e o portal precisa estar acessível.

## Execução e integrações

O script local é `pnpm dev`, que inicia o Express com `tsx` em modo de desenvolvimento. O projeto usa MySQL por Drizzle, Stripe, Resend, node-cron, Forge (storage, notificações e recursos de IA/voz), OAuth da plataforma e o pacote `vite-plugin-manus-runtime`.

Além das variáveis de plataforma, o código referencia `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `VITE_STRIPE_PUBLISHABLE_KEY`, `RESEND_API_KEY`, `PORT`, `NODE_ENV` e `VITE_APP_URL`. O repositório ignora arquivos `.env` e não contém um modelo de ambiente versionado na auditoria atual.

## GitHub

Na auditoria de 13 de julho de 2026, o commit local e o commit `main` do repositório público no GitHub correspondem ao mesmo SHA `3c4e3e5`. O checkout local rastreia `origin/main`, que é um remoto interno da plataforma; não há remoto Git direto chamado `user_github` disponível neste checkout restaurado.
