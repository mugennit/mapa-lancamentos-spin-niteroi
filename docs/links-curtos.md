# Links curtos para clientes (`/c/código`)

O corretor gera, na área interna, um link curto como
`https://mapa-lancamentos-spin-niteroi.vercel.app/c/Ab7x2k`. O link:

- identifica o corretor (nome e WhatsApp, com a mesma assinatura dos links
  longos, `BROKER_LINK_SECRET`);
- abre direto o card público do lançamento escolhido (ou a vitrine completa,
  se o corretor escolher "Todos os lançamentos");
- é gerado pelo próprio site, sem encurtador externo.

## Como funciona

1. Botão "Link para clientes" (cabeçalho) ou "Link deste lançamento para
   clientes" (detalhe do empreendimento, só para quem está na vitrine).
2. `app/api/broker-link` (exige a sessão da área interna) assina o token do
   corretor e grava em um banco chave-valor o registro
   `{ token assinado, lançamento, data }` sob um código aleatório de 6
   caracteres (alfabeto sem 0/O, 1/I/l).
   - A gravação é condicional (`SET NX`): um código existente **nunca** é
     sobrescrito; em caso de colisão, sorteia outro.
   - O mesmo corretor e lançamento reaproveitam o código já criado.
3. `/c/<código>` (público) consulta o banco e redireciona para
   `/vitrine?c=<token>&p=<lançamento>`. A vitrine confere a assinatura do
   corretor e abre o card. Código inexistente: vitrine geral, sem corretor.
4. O botão "Copiar link" copia o link exibido, que é o curto.

Os registros ficam no banco, fora do código e da publicação: **novas
publicações não afetam os links já enviados.** Os links longos antigos
(`/vitrine?c=…`) continuam funcionando como antes.

Trocar `BROKER_LINK_SECRET` invalida a assinatura de todos os links de
corretor, curtos e longos (o link curto passa a abrir a vitrine sem corretor).

## Configuração na Vercel (uma vez)

O site usa a API REST do **Upstash Redis**, disponível na própria Vercel:

1. No projeto `mapa-lancamentos-spin-niteroi` da Vercel: **Storage → Create
   Database → Upstash for Redis** (plano gratuito é suficiente).
2. Conecte o banco ao projeto, nos ambientes **Production** e **Preview**.
   A integração cria as variáveis `KV_REST_API_URL` e `KV_REST_API_TOKEN`
   (também são aceitas `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`).
3. Faça uma nova publicação (ou "Redeploy") para as variáveis valerem.

O banco configurado é o **`spin-links-clientes`**, usado pelo site oficial.
**Não o exclua.** Ele também está conectado ao projeto
`mapa-lancamentos-spin-niteroi-r2au`, que está em desativação e não recebe mais
publicações (`docs/desativacao-r2au.md`); os links curtos devem ser gerados e
divulgados só pelo endereço oficial.

Não desative a persistência do banco nem configure expiração das chaves: os
links não expiram. Não apague chaves `spin:short:v1:*`.

**Sem o banco configurado**, nada quebra: o site entrega o link completo
(`/vitrine?c=…&p=…`), que também abre o card do lançamento, e mostra o aviso
"Links curtos ainda não configurados". Um `/c/…` sem banco abre a vitrine
geral.

## Testes

- `tests/short-links.test.mjs`: códigos aleatórios sem repetição, alfabeto,
  reaproveitamento, colisão sem sobrescrever, comandos enviados ao banco.
- `tests/e2e/fake-kv.mjs`: banco fictício local (imita a API REST, grava em
  arquivo) para o build de produção e o GitHub Actions.
- `tests/e2e/smoke.mjs`: gera o link curto, "Copiar link" copia o curto, o
  cliente abre o card certo com o WhatsApp do corretor, código inexistente
  abre a vitrine geral. Com `SHORT_LINK_LOG`, confere depois de um novo
  build que os links gerados antes continuam funcionando.
- `tests/e2e/access.mjs`: `/c/…` sem sessão só redireciona para a vitrine.
