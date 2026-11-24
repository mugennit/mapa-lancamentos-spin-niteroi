# Desativação do projeto `mapa-lancamentos-spin-niteroi-r2au`

Decisão do responsável pelo projeto: desativar por etapas o projeto
`mapa-lancamentos-spin-niteroi-r2au` da Vercel. **Apenas o projeto principal,
`mapa-lancamentos-spin-niteroi` (https://mapa-lancamentos-spin-niteroi.vercel.app),
deve receber novas publicações.**

## Conferência feita antes da decisão (24/11/2026)

- O `r2au` publicava cada commit da `main` desde 04/10/2026, em paralelo ao
  projeto principal.
- Área interna inacessível: o login responde 503 (falta `SITE_PASSWORD` ou
  `SITE_SESSION_SECRET` nesse projeto). Por isso, nenhum link de corretor pode
  ter sido gerado com o endereço do `r2au`.
- Ele também não reconhece links de corretor do projeto principal
  (`BROKER_LINK_SECRET` ausente ou diferente).
- A vitrine pública dele mostrava os mesmos lançamentos do site oficial.
- Nada no código, nos dados, na rotina do ChatGPT ou na verificação
  automática do GitHub depende do `r2au`; a `main` não tem proteção que exija
  o status dele.
- Não verificável fora do painel da Vercel: acessos recentes (Logs/Analytics)
  e domínios próprios ligados ao `r2au`.

## Etapas

1. **Git desconectado** (Vercel → `r2au` → Settings → Git → Disconnect). O
   projeto, os endereços atuais, as variáveis e o banco continuam; a última
   publicação continua no ar, mas **não recebe mais atualizações** (os dados da
   vitrine dele ficam parados na data da desconexão).
2. **Observação:** acompanhar por um período os acessos ao `r2au` (Logs /
   Analytics) e se alguém sente falta dele.
3. **Exclusão (futura, só com nova decisão):** antes de excluir, desconectar o
   banco `spin-links-clientes` **apenas** do `r2au`, sem apagar o banco, que é
   usado pelo site oficial. Depois, retirar as menções restantes ao `r2au` da
   documentação.

## O que não muda

- Projeto principal, domínio oficial, variáveis e chaves
  (`SITE_PASSWORD`, `SITE_SESSION_SECRET`, `BROKER_LINK_SECRET`, `KV_*`, etc.).
- Banco `spin-links-clientes` e todos os links curtos já criados.
- Rotina diária do ChatGPT (commits na `main` publicam o projeto principal).
