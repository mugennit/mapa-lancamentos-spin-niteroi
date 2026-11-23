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
- Branch experimental atual: `experimento/claude-mapa` (PR #7).

## Senha e credenciais

- A proteção fica em `proxy.ts` (verifica o cookie `spinmap_session`),
  `lib/site-auth.ts` (sessão assinada com HMAC), `app/api/auth`, `app/api/logout`
  e `app/login`. `app/api/report` também verifica a sessão. **Não enfraquecer nem
  contornar.**
- Variáveis de ambiente: `SITE_PASSWORD`, `SITE_SESSION_SECRET` e
  `REPORT_TO_EMAIL`. Nunca registrar valores em código, commits, logs, PRs ou chat.
- Para teste local, usar valores fictícios num `.env` (já ignorado pelo Git) e
  apagá-lo ao terminar.
- Pendência conhecida: os dados vão embutidos no JavaScript público e podem ser
  lidos sem senha. Ver `docs/seguranca-exposicao-dados.md`. A correção é uma etapa
  separada e precisa de aprovação.

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
- Os relatórios diários (`*-YYYY-MM-DD.json`) são do ChatGPT; o site não depende deles.

Se uma mudança de interface exigir um campo novo nos dados, combine antes com o
responsável: o campo precisa ser produzido pela rotina do ChatGPT.

## Estrutura do código

- `app/page.tsx`: página principal (cliente), com estado dos filtros, cards, lista e folhas.
- `app/globals.css` (base original) e `app/experience.css` (layout v2).
- `components/project-map.tsx`: mapa, agrupamento, rótulos e leque.
- `components/filter-panel.tsx`: painel Onde / O quê / Quanto / Quando.
- `components/project-inventory.tsx`, `project-comparison.tsx`, `project-parts.tsx`.
- `lib/catalog.ts`: monta o catálogo a partir de `data/`.
- `lib/catalog-rules.ts`, `lib/map-clusters.ts`, `lib/filter-state.ts`,
  `lib/project-search.ts`, `lib/project-insights.ts`: funções puras, testadas.
- `hooks/use-back-to-close.ts`: o "voltar" do celular fecha painéis.
- Stack: vinext (Next.js 16 App Router sobre Vite), React 19, Leaflet,
  Tailwind 4 e shadcn/ui.

## Comandos

```bash
corepack pnpm install --frozen-lockfile   # instalar dependências
npm test                                  # testes (node --test, sem dependências extras)
npx tsc --noEmit -p .                     # tipos (apague tsconfig.tsbuildinfo depois)
npm run lint                              # 2 erros react-hooks/set-state-in-effect já existentes em app/page.tsx
VERCEL=1 npx vite build                   # build igual ao da Vercel (saída em .vercel/, ignorada)
node scripts/run-framework.mjs dev        # servidor local em http://localhost:5173 (precisa de .env local)
```

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
