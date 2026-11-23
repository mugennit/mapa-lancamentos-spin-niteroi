# Levantamento de pendências

Relação de toda informação exibida como "A confirmar", "Não informado",
"Pendente" ou equivalente, com o campo de origem e a confirmação necessária.
A investigação e a confirmação dos dados são feitas na rotina do ChatGPT; este
levantamento não preenche nem esconde nada.

- Gerar de novo (lê `data/`, não altera nada):
  ```bash
  node tools/levantamento-pendencias.mjs --csv docs/pendencias/levantamento-AAAA-MM-DD.csv --md docs/pendencias/levantamento-AAAA-MM-DD.md
  ```
- Colunas: empreendimento, id, bairro, grupo, campo, texto exibido, arquivo e
  campo de origem, situação (Ausente, Conflitante ou Aguardando validação) e
  confirmação necessária.
- Áreas, vagas e tipologias por unidade aparecem agregadas por empreendimento,
  com a quantidade de ofertas afetadas.
- "Entrada e condições de pagamento" aparece para todos: não existe campo para
  isso no contrato de dados, e a interface sempre exibe o aviso.
