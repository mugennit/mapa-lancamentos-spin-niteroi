# Experimento `experimento/claude-mapa`

Versão experimental do Mapa de Lançamentos SPIN Niterói, focada no celular, na
visibilidade dos pins e na integração entre lista e mapa. **Não deve ir para a
`main` sem revisão.**

## O que mudou

### Celular
- Primeira tela com resultados: busca, botão **Filtros (n)**, atalhos
  (Favoritos, Pendências) e etiquetas dos filtros ativos numa linha rolável.
- Navegação inferior **Cards / Lista / Mapa**, ao alcance do polegar, com o total
  de pontos no mapa.
- Filtros num painel que sobe da parte de baixo, terminando em **Ver N lançamentos**.
- O botão "voltar" do aparelho fecha painéis (detalhe, filtros, pendências, ficha,
  comparação) em vez de sair do site.
- Áreas de toque de pelo menos 40–44 px em botões, pins e grupos.

### Pins
- Agrupamento por distância real na tela, com fusão de grupos que se sobreporiam
  (`lib/map-clusters.ts`). O tamanho do círculo cresce com a quantidade.
- Tocar num grupo aproxima o mapa até separar os pontos. Não abre mais lista e
  zoom ao mesmo tempo.
- Nomes visíveis a partir do zoom 13, sem sobreposição. O pin selecionado e o
  destacado sempre mostram o nome; os demais aparecem como ponto com nome ao
  passar o mouse ou focar.
- Contorno branco e sombra para contraste também na camada de satélite. Uma única
  cor de destaque (âmbar) para o selecionado.
- **Coordenadas coincidentes:** grupos com coordenadas idênticas aparecem como
  "pilha" (círculo escuro com sombra deslocada). Ao tocar, abrem em **leque
  visual**: cada pin é desenhado deslocado, ligado por linha tracejada a um ponto
  branco na **posição real cadastrada**, e uma legenda explica que o leque é só
  visual. As coordenadas dos dados não são alteradas (há teste para isso).

### Lista, cards e mapa
- Três formatos: **Cards** (detalhado), **Lista compacta** (uma linha por
  empreendimento, com preço, favorito e "ver no mapa") e **Mapa**.
- Tocar num pin abre um **cartão de resumo** (foto, nome, bairro, preço, Book,
  Tabela, favorito e "Ver detalhes"), sem cobrir o mapa inteiro. No computador, a
  lista rola até o card correspondente e o destaca.
- Passar o mouse sobre um card destaca o pin no mapa.
- **Ver no mapa** em cada card/linha de quem está no mapa: centraliza, seleciona
  e, se o pin estiver agrupado, separa ou abre o leque.
- O mapa não reenquadra ao alternar Lista ↔ Mapa; só quando os filtros mudam ou
  em **Ver todos**. **Buscar nesta região** aparece depois que o usuário move o mapa.
- Selo em cada card: **No mapa** ou **Fora do mapa · motivo** (book, tabela,
  endereço em revisão ou ponto exato pendente).

### Filtros
- Agrupados em **Onde / O quê / Quanto / Quando**, com contagem por opção
  considerando os demais filtros ativos (opções com zero ficam desabilitadas).
- Preço com separador de milhar e atalhos de faixa. Os atalhos só preenchem
  mínimo e máximo; não criam dados.
- A regra de unidade não mudou: tipologia, preço e vagas precisam corresponder à
  **mesma unidade** da tabela (`lib/project-search.ts`, sem alterações).
- Filtros, ordenação e formato ficam no endereço (`?bairro=...&max=...&ver=mapa`)
  e sobrevivem ao recarregar. Valores desconhecidos são descartados. A seleção
  compartilhada continua no `#selecao=...`.

## O que foi preservado
- Proteção por senha (`proxy.ts`, `lib/site-auth.ts`, `app/api/*`): sem alterações.
- `data/`, `public/empreendimentos/`, links do Drive e scripts: sem alterações.
- Regras de elegibilidade: extraídas para `lib/catalog-rules.ts`, com o mesmo critério.
- Camada de satélite (Esri World Imagery + rótulos) e todas as funções existentes:
  favoritos, comparação, compartilhamento, pendências, ficha para WhatsApp,
  reporte de problema, inventário de unidades, indicadores de atualização.

## Testes
```bash
npm test
```
- `tests/catalog-rules.test.mjs`: regras do mapa e invariantes sobre o catálogo
  real (todos continuam na lista; no mapa só quem tem book, tabela, endereço
  "Conferido" e coordenadas). Não fixa as quantidades: 116/83 são só a referência
  impressa no log desta versão, para não travar as inclusões da rotina diária.
- `tests/map-clusters.test.mjs`: agrupamento, ausência de sobreposição, leque
  sem alterar coordenadas e distribuição de rótulos.
- `tests/filter-state.test.mjs`: filtros no endereço, descarte de valores
  inválidos e formatação de preço.
- Os testes anteriores continuam iguais.

## Limitações conhecidas
- Os dados continuam embutidos no JavaScript público: ver
  `docs/seguranca-exposicao-dados.md` (item 7, segunda etapa).
- O CSS antigo (`app/globals.css`) ficou intacto. Os estilos novos estão em
  `app/experience.css`; regras antigas do layout anterior ficaram sem uso.
- O `npm run lint` mantém os 2 erros `react-hooks/set-state-in-effect` que já
  existiam na `main` (leitura de favoritos/URL ao montar a página).
