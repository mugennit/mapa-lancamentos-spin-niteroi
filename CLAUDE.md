# CLAUDE.md — Mapa de Lançamentos SPIN Niterói

Site interno, protegido por senha, com o catálogo de lançamentos imobiliários de
Niterói: lista geral, mapa (Leaflet, com camada de satélite), fichas, unidades
das tabelas, favoritos, comparação e ficha para WhatsApp.

Endereço oficial (produção): **https://mapa-lancamentos-spin-niteroi.vercel.app**

Idioma: textos da interface, documentação, commits e PRs em **português do Brasil**.

## Divisão de responsabilidades (obrigatória)

| Quem | Responsável por |
| --- | --- |
| **ChatGPT** — automação “Atualizar lançamentos SPIN”, diária às 08h (America/Sao_Paulo) | Varredura das fontes e atualização dos dados: tudo em `data/`, imagens em `public/empreendimentos/`, materiais no Google Drive, coordenadas. Faz commit direto na `main`. |
| **Claude** | Melhorias do site: interface, acessibilidade, desempenho, testes e documentação do código. Sempre em branch própria, com pull request. |

Regras decorrentes:
- **Claude não edita** `data/`, `public/empreendimentos/`, `scripts/`, nem os
  links do Drive, salvo pedido explícito do responsável pelo projeto.
- **Claude não cria agendamentos** nem rotinas de atualização de dados. Não pode
  existir rotina concorrente com a do ChatGPT.
- As fontes (Linktree → botões “Tabelas de Vendas” e “Books dos Lançamentos” →
  **SharePoint**) e o destino dos materiais (**Google Drive**) não são acessíveis
  a partir do ambiente de nuvem do Claude. Nunca simule ou invente resultados de
  varredura.
- O código precisa continuar compatível com os arquivos de dados atualizados
  diariamente (ver “Contrato dos dados”). Antes de abrir ou atualizar um PR,
  trazer a `main` para a branch (`git merge origin/main`) e rodar os testes.

## Git, deploy e produção

- **Nunca** fazer merge, push ou commit na `main` sem aprovação explícita. Todo
  push na `main` publica a produção automaticamente em dois projetos da Vercel
  (`mapa-lancamentos-spin-niteroi`, cujo nome coincide com o endereço oficial,
  e `mapa-lancamentos-spin-niteroi-r2au`).
- Não alterar a configuração da Vercel, os domínios, `vercel.json` ou
  `.openai/hosting.json` sem pedido explícito.
- Branches e PRs geram prévias da Vercel (autorizadas). A prévia não substitui a
  revisão humana.
- Evitar push ou merge perto das 08h–09h30 (horário de São Paulo), quando a
  automação do ChatGPT costuma commitar na `main`.
- Os PRs #7, #8 e #9 já foram incorporados. Novos trabalhos: branch própria e PR.

## Senha e credenciais

- A proteção fica em `proxy.ts` (verifica o cookie `spinmap_session`),
  `lib/site-auth.ts` (sessão assinada com HMAC), `app/api/auth`, `app/api/logout`
  e `app/login`. `app/api/report` também verifica a sessão. **Não enfraquecer nem
  contornar.**
- Variáveis de ambiente: `SITE_PASSWORD`, `SITE_SESSION_SECRET`, `REPORT_TO_EMAIL`,
  `BROKER_LINK_SECRET` (links de corretor) e `PUBLIC_CONTACT_WHATSAPP` /
  `PUBLIC_CONTACT_NAME` (contato central da vitrine, por enquanto sem
  configuração). Nunca registrar valores em código, commits, logs, PRs ou chat.
- Para teste local, usar valores fictícios num `.env` (já ignorado pelo Git) e
  apagá-lo ao terminar.
- **Dados comerciais só depois da sessão validada.** `app/page.tsx` é componente
  de servidor: confere a sessão (além do `proxy.ts`), monta o pacote
  (`buildCatalogPayload`) e entrega à interface (`components/catalog-app.tsx`).
  **Nenhum componente de cliente pode importar `data/*.json`** (só tipos, com
  `import type`). As respostas autenticadas saem com `Cache-Control: private, no-store`.
- `tests/e2e/access.mjs` testa o acesso direto sem autenticação contra o build
  de produção: página, RSC, APIs, cookie forjado e **todos** os arquivos públicos.
- `proxy.ts` libera só o que não tem dados internos: login, autenticação,
  arquivos estáticos do build, `manifest.webmanifest`, `/icons/` e `/vitrine`.

## Versão pública (`/vitrine`)

- Sem senha. **A lista e o mapa públicos mostram exatamente os pins do mapa
  interno** (`isPubliclyListed` em `lib/public-catalog.ts` = `isMapEligible`):
  book e tabela confirmados e pin validado. Quem não tem book, tabela ou
  localização validada fica fora. A área interna continua com todo o catálogo.
- **Todos os cards públicos têm "Ver book"** com o book já vinculado
  (`publicBookUrl`), sem exigir revisão individual do PDF (liberação autorizada
  por Frederico em 24/11/2026; não é registrada em `public-book-releases.json`).
  Decisões de revisão não retiram o botão; aparecem só como ressalva na área
  interna. Única trava: nunca oferecer uma tabela como book (link de tabela ou
  nome com tabela/preço).
- **Sem preços, tabelas, unidades, vagas, datas de leitura, notas ou fontes.**
- Os dados são filtrados no servidor (`app/vitrine/page.tsx`) por **lista de
  campos permitidos** (`lib/public-catalog.ts`, `PUBLIC_FIELDS`). Nunca enviar o
  pacote interno.
- `components/public-catalog.tsx` e tudo o que ele importa **não podem importar
  `data/*.json` nem `components/catalog-app.tsx`**, nem os atalhos de preço
  (`lib/price-presets.ts`, `components/filter-price.tsx`). O teste de navegador
  confere que nenhum link de tabela ou preço chega à vitrine.
- `catalog.json → clientBook`, se aprovado em `data/public-book-releases.json`
  para o seu próprio arquivo e `sha256`, tem preferência sobre o book original.
  Esse arquivo de decisões é do ChatGPT (`docs/liberacao-books.md`); não apagar.
- Link do corretor: gerado na área interna (botão "Link para clientes",
  `app/api/broker-link`), assinado com HMAC usando a chave exclusiva
  `BROKER_LINK_SECRET` (`lib/broker-link.ts`), separada da sessão. Trocar a senha
  ou a chave de sessão não invalida os links; trocar `BROKER_LINK_SECRET`, sim.
  Sem essa chave, a geração fica desativada e a vitrine ignora o parâmetro `c`,
  que precisa ser preservado no endereço durante a navegação.
- Sem corretor: o contato central vem de `PUBLIC_CONTACT_WHATSAPP` (e
  `PUBLIC_CONTACT_NAME`, opcional) no ambiente da Vercel. Sem essa variável,
  **não exibir botão de WhatsApp** e nunca usar um número presumido.

## Regras dos dados (valem para qualquer alteração de código)

- **Lista geral:** todos os empreendimentos do catálogo aparecem, sem exceção.
- **Mapa:** somente quem tem book **e** tabela presentes em `data/materials.json`,
  endereço com `addressReviewStatus === "Conferido"` **e** `lat`/`lng` numéricos.
  A regra está em `lib/catalog-rules.ts`. Não flexibilizar.
- **Não inventar** coordenadas, preços, datas, prazos, tipologias, vagas ou
  disponibilidade. O que não estiver comprovado aparece como “A confirmar”,
  “Vagas a confirmar” etc.
- **Filtros por unidade:** tipologia, preço e vagas precisam corresponder à
  **mesma unidade/oferta** da tabela (`lib/project-search.ts`: `matchingOffers`,
  `matchesBudget`). Vaga ausente não é zero; “mínimo 1 vaga” não comprova duas.
  Aluguéis não entram em faixa de preço de venda.
- **Coordenadas:** só pontos exatos validados. O ponto vem do marcador do lugar
  (por exemplo, o `!3d/!4d` do Google Maps), nunca da câmera do Street View.
  Coordenadas coincidentes podem ser abertas em leque **apenas visualmente**
  (`lib/map-clusters.ts`), sempre indicando o ponto real e sem alterar os dados.
- **Atualização:** uma varredura de arquivos não torna recente uma leitura
  comercial antiga (`freshnessOf` em `lib/project-insights.ts`). Previsão de
  entrega vencida não comprova entrega.
- Preservar a camada de satélite (Esri World Imagery com rótulos) e todas as
  funções existentes: favoritos, comparação, compartilhamento (`#selecao=`),
  pendências, ficha WhatsApp, reporte de problema e inventário de unidades.

## Contrato dos dados (o que o código lê)

O código deve tolerar novos empreendimentos, bairros, construtoras, tipologias e
características, além de campos opcionais ausentes. Opções de filtro são
derivadas dos dados, nunca listas fixas.

- `data/catalog.json`: lista de empreendimentos com `id` (único), `name`, `company`,
  `neighborhood`, `address`, `book {url, name}` ou `null`, `tables [{url, date, name}]`,
  `price`, `priceLabel?`, `delivery`, `deliveryStatus?`, `lat`, `lng`,
  `addressReviewStatus`, `addressSource?`, `locationStatus?`, `photo`, `notes[]`,
  `checkedAt`, `materialsCheckedAt`, `availableUnits?`, `availabilityCheckedAt?`.
- `data/attributes.json`: objeto por `id` que complementa o catálogo
  (`typologies`, `features` e outros).
- `data/materials.json`: lista de `{url}` dos materiais válidos (book e tabela).
- `data/unit-offers.json`: objeto por `id` com `tableUrl`, `tableDate`, `checkedAt`,
  `coverage` e `offers[]` (`unit`, `typology`, `unitKind?`, `price`, `priceNote?`,
  `area?`, `parkingSpaces?`, `parkingCountIsMinimum?`, `parkingNote?`, `offerKind?`).
- `data/materials-audit.json`: `checkedAt`, a data exibida como “Fontes conferidas em”.
- `catalog.json → book.sha256` (opcional): SHA-256 do PDF atual no Drive,
  produzido pela rotina do ChatGPT. Não é exigido para o "Ver book".
- `catalog.json → clientBook {url, name, sha256}` (opcional): versão do book para
  clientes, quando o original tem preços ou dados internos (ChatGPT).
- `data/public-book-releases.json`: decisões de revisão dos books para a vitrine
  (mantido pelo ChatGPT; ver `docs/liberacao-books.md`). Não apagar.
- Os relatórios diários (`*-YYYY-MM-DD.json`) são do ChatGPT; o site não depende deles.

Se uma mudança de interface exigir um campo novo nos dados, combine antes com o
responsável: o campo precisa ser produzido pela rotina do ChatGPT.

## Estrutura do código

- `app/page.tsx`: área interna (servidor): valida a sessão e entrega os dados.
- `components/catalog-app.tsx`: interface interna (cliente): filtros, cards, lista e folhas.
- `app/vitrine/page.tsx` e `components/public-catalog.tsx`: versão pública.
- `app/globals.css` (base original) e `app/experience.css` (layout v2).
- `components/project-map.tsx`: mapa, agrupamento, rótulos e leque. Clique em área
  vazia desmarca, fecha o resumo e recolhe o leque, sem mudar zoom, posição ou filtros.
- `components/map-controls.tsx`: botões sobre o mapa. No celular: "Filtros" +
  menu "Mais" (Ver todos, Perto de mim, Preços), camada e zoom à direita e
  faixa própria para "Buscar nesta região"; cartão e legenda ficam acima do
  crédito do mapa e da barra de comparação.
- **Modo inicial:** no celular, área interna e vitrine abrem no **Mapa**; no
  computador, em Cards. Um `ver=` no endereço é sempre respeitado (o modo
  padrão do aparelho não vai para o endereço).
- `components/filter-panel.tsx`: painel Onde / O quê / Quanto / Quando.
- `components/project-inventory.tsx`, `project-comparison.tsx`, `project-parts.tsx`.
- `lib/catalog-rules.ts` (`buildCatalogPayload`), `lib/catalog-types.ts` e
  `lib/catalog-view.ts`: pacote interno, tipos e derivações no navegador.
- `lib/public-catalog.ts`, `lib/broker-link.ts`: vitrine, liberação de books e
  links de corretor.
- `lib/catalog-rules.ts`, `lib/map-clusters.ts`, `lib/filter-state.ts`,
  `lib/project-search.ts`, `lib/project-insights.ts`: funções puras, testadas.
- `hooks/use-back-to-close.ts`: o "voltar" do celular fecha painéis.
- `hooks/use-stored-value.ts`: preferências no navegador (favoritos, "Preços").
- `lib/map-format.ts`: distância, preço abreviado (sempre arredondado para
  baixo), etapa e preço por m².
- Stack: vinext (Next.js 16 App Router sobre Vite), React 19, Leaflet,
  Tailwind 4 e shadcn/ui.

## Comandos

```bash
corepack pnpm install --frozen-lockfile   # instalar dependências
npm test                                  # testes (node --test, sem dependências extras)
npx tsc --noEmit -p .                     # tipos (apague tsconfig.tsbuildinfo depois)
npm run lint                              # 0 erros (há avisos sobre <img>)
VERCEL=1 NITRO_PRESET=vercel npx vite build   # build igual ao da Vercel (saída em .vercel/, ignorada)
node scripts/run-framework.mjs dev        # servidor local em http://localhost:5173 (precisa de .env local)
VERCEL=1 NITRO_PRESET=vercel npx vite build && PORT=4181 node tests/e2e/vercel-sim.mjs   # build de produção local (precisa das variáveis no ambiente)
BASE_URL=http://localhost:4181 SITE_PASSWORD=<senha> node tests/e2e/access.mjs   # acesso direto sem autenticação
BASE_URL=http://localhost:4181 SITE_PASSWORD=<senha> node tests/e2e/smoke.mjs    # navegador (vitrine, corretor, interno)
BASE_URL=http://localhost:4181 SITE_PASSWORD=<senha> node tests/e2e/map-click.mjs # área vazia do mapa desmarca (computador e celular)
BASE_URL=http://localhost:4181 SITE_PASSWORD=<senha> node tests/e2e/mobile-map.mjs # celular: controles sem sobreposição e abertura no Mapa
```

## Verificação automática (GitHub Actions)

`.github/workflows/verificacao.yml` roda em todo push (inclusive os commits
diários do ChatGPT na `main`) e em PRs. Tem duas etapas:
- `npm test`: regras, contrato dos dados e formatos;
- build de produção com simulador da Vercel, teste de acesso direto sem
  autenticação e teste de navegador, com chaves fictícias só de teste.

A verificação **apenas avisa**: não bloqueia commits nem a Vercel. Se falhar
depois de um commit diário, o problema costuma estar nos dados. Avise o
responsável, em vez de "consertar" `data/`.

## Testes: regras

- Validar **regras**, não quantidades. Os números do catálogo mudam diariamente.
  Em 23/11/2026 eram 116 empreendimentos, 84 com book e tabela e 84 no mapa;
  isso é só referência.
- Não criar testes que falhem quando a rotina diária incluir, retirar ou
  atualizar empreendimentos.
- Mudanças em mapa, filtros ou elegibilidade precisam de teste em `tests/`.
- Para mudanças visuais, verificar no celular (390 px) e no computador (1440 px).
  Neste ambiente, os mosaicos do mapa não carregam por restrição de rede; os pins
  e a interface sim.
