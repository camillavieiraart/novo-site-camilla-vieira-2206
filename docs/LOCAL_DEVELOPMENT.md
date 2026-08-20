# Execução local e integrações

Este guia permite rodar o projeto localmente sem colocar chaves de produção no GitHub. Por segurança, o repositório não armazena um arquivo `.env.example`; crie o seu `.env.local` somente no computador de desenvolvimento e use a tabela abaixo como modelo.

> O repositório é público. Nunca registre valores de `DATABASE_URL`, chaves secretas Stripe, `JWT_SECRET`, chaves Forge ou API keys em commits, issues, capturas de tela ou mensagens.

## Inicialização local

Instale o Node.js 22 e o pnpm. Em seguida, instale as dependências e inicie a aplicação:

```bash
pnpm install
touch .env.local
pnpm dev
```

O comando de desenvolvimento executa o servidor Express através de `tsx`; a porta padrão é `3000`, ou a próxima porta disponível. Antes de fazer alterações estruturais no banco, execute `pnpm db:push` somente contra uma base de desenvolvimento ou cópia restaurável.

## Variáveis e finalidade

| Variável | Finalidade | Onde obter com segurança |
|---|---|---|
| `DATABASE_URL` | Conexão MySQL/TiDB usada pelo Drizzle | Painel privado do banco ou responsável pela infraestrutura. |
| `STRIPE_SECRET_KEY` | Cria checkout, produtos e processa pagamentos no servidor | Dashboard Stripe, usando `sk_test_` no computador local. |
| `STRIPE_WEBHOOK_SECRET` | Valida eventos recebidos no endpoint de webhook | Dashboard Stripe CLI/endpoint de teste local. |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Inicializa Stripe.js no navegador | Dashboard Stripe, usando `pk_test_` no computador local. |
| `RESEND_API_KEY` | Envia e-mails transacionais e newsletter | Dashboard Resend; preferir uma chave separada de desenvolvimento. |
| `JWT_SECRET` | Assina o cookie de sessão da aplicação | Gere localmente com um gerenciador de segredos. |
| `VITE_APP_ID`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`, `OWNER_OPEN_ID` | Mantêm o OAuth administrativo atual | Configurações privadas da plataforma. |
| `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY` | Proxy servidor para storage, IA, voz e notificações | Configurações privadas da plataforma. |
| `VITE_FRONTEND_FORGE_API_URL`, `VITE_FRONTEND_FORGE_API_KEY` | Acesso Forge que o frontend usa para integrações compatíveis | Configurações privadas da plataforma. |

As variáveis que começam com `VITE_` são incorporadas ao código do navegador; por isso, **não devem conceder privilégios de escrita, acesso a banco ou administração**.

## Stripe local

Para evitar qualquer cobrança real, use apenas as chaves `pk_test_` e `sk_test_`. Para receber eventos em localhost, execute o encaminhamento da Stripe CLI para `http://localhost:3000/api/stripe/webhook` e use o `whsec_` emitido por essa sessão em `STRIPE_WEBHOOK_SECRET`. O endpoint live e seus segredos não devem ser usados no arquivo local.

## Banco de dados

O código usa MySQL via Drizzle e espera `DATABASE_URL`. A base de produção não deve ser apontada pelo ambiente local. Crie uma base de desenvolvimento, restaure nela um backup sanitizado e use uma conta com privilégios mínimos.

O formato esperado é:

```text
mysql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO
```

Quando o provedor exigir, habilite SSL na conexão. Para exportar uma base que você administra, use uma conexão protegida e gere um dump fora do repositório:

```bash
mysqldump --ssl-mode=REQUIRED --single-transaction --routines --triggers \
  -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p "$DB_NAME" > backup.sql
```

O acesso externo, liberação de IP e parâmetros SSL dependem do provedor da base. Eles não podem ser confirmados pelo código do aplicativo; devem ser consultados no painel privado de banco.

## GitHub e sincronização

Em 13 de julho de 2026, a branch `main` local e a branch `main` pública do GitHub apontavam para o mesmo commit `3c4e3e5`. O checkout de desenvolvimento usa um remoto interno da plataforma (`origin`), e a sincronização com o GitHub ocorre pelo mecanismo de checkpoints, não por um remoto Git direto exposto neste ambiente restaurado.

Por essa razão, antes de editar fora da plataforma, faça backup e trate uma fonte como canônica por vez. O fluxo mais seguro é: criar uma branch no GitHub, enviar alterações por pull request, validar o merge e então sincronizar/atualizar o projeto na plataforma antes do próximo checkpoint. Evite editar os mesmos arquivos nos dois lugares antes da sincronização, pois isso pode gerar conflito.

## Storage, OAuth e dependências de plataforma

Os uploads do site usam o proxy Forge nos endpoints de upload e URL de download. O adaptador atual não implementa listagem ou exportação integral de arquivos. Para uma estratégia independente da plataforma, migre os arquivos para uma conta S3/Cloudflare R2 própria e salve as URLs ou keys no banco.

O login administrativo utiliza OAuth da plataforma. O callback é formado como `http://localhost:3000/api/oauth/callback` em execução local. Ele só funcionará se o provedor aceitar essa origem e se as variáveis OAuth privadas estiverem configuradas. Para remover essa dependência, substitua o fluxo atual por uma autenticação própria, como Clerk, Auth.js ou um login baseado em senha/magic link.

Além de banco, storage e OAuth, o projeto possui chamadas de notificação, IA e transcrição que dependem do Forge, além de telemetria de desenvolvimento e do plugin de runtime da plataforma. Stripe, Resend, MySQL/Drizzle e node-cron podem funcionar fora da plataforma desde que recebam as respectivas configurações e sejam hospedados em uma infraestrutura compatível.
