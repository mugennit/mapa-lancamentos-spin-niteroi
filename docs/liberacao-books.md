# Liberação de books para a versão pública (`/vitrine`)

Responsável pela revisão: **automação do ChatGPT “Atualizar lançamentos SPIN”**.
O site só lê os arquivos; não revisa conteúdo de PDF.

## Regra

Um book aparece na vitrine somente quando **todas** as condições abaixo valem:

1. O book está em `data/materials.json` com `type: "Book"` e não é o arquivo de
   uma tabela.
2. O nome do arquivo não sugere preço ou tabela.
3. `data/catalog.json` informa a versão atual do PDF em `book.sha256`.
4. Em `data/public-book-releases.json`, a **última** decisão registrada para o
   **mesmo** `projectId`, `fileUrl` (igual a `book.url`) e `sha256` é uma
   aprovação (`approved: true`). O arquivo é um histórico: só se acrescentam
   entradas, e a mais recente prevalece.

Se qualquer condição falhar, o book fica indisponível na vitrine. **O
empreendimento continua visível** (nome, bairro, mapa, tipologias, entrega).

Books ainda não revisados ficam **bloqueados** na vitrine.

## Substituição de um book (obrigatório seguir esta ordem)

Quando o PDF é trocado **no mesmo link** do Drive, o link passa a entregar o
arquivo novo imediatamente, mas o `book.sha256` do catálogo continua com o hash
antigo até a próxima atualização. Nesse intervalo, a aprovação antiga ainda
casaria com o catálogo, e o arquivo novo, **não revisado**, apareceria na
vitrine. Por isso, o hash sozinho não basta: a liberação precisa ser retirada
**antes** da troca.

1. **Retirar a liberação atual.** Acrescentar em `public-book-releases.json`
   uma entrada para a versão em vigor (o `sha256` atual), com
   `"approved": false` e `"withdrawn": true`:
   ```json
   {
     "projectId": "style",
     "fileUrl": "https://drive.google.com/file/d/…/view?usp=drivesdk",
     "sha256": "<sha256 atual>",
     "approved": false,
     "withdrawn": true,
     "reviewedAt": "2026-11-25",
     "reviewedBy": "ChatGPT",
     "notes": "Retirado antes da substituição do PDF."
   }
   ```
2. **Publicar a retirada antes de tocar no Drive.** Fazer commit e push na
   `main` e aguardar a Vercel concluir a publicação. Confirmar na área interna
   que o empreendimento mostra "liberação retirada", ou que o botão "Ver book"
   sumiu da vitrine.
3. **Substituir o PDF no Drive.**
4. **Atualizar o catálogo.** Gravar em `catalog.json → book.sha256` o hash do
   arquivo novo, calculado a partir do arquivo **baixado do próprio link**
   depois da troca. Nesse ponto o book continua bloqueado ("o PDF mudou e
   precisa de nova revisão").
5. **Revisar o arquivo novo**, lendo todas as páginas, com os mesmos critérios
   da seção 2.
6. **Liberar só depois da revisão.** Acrescentar a decisão para o **novo**
   `sha256` (`approved: true`, ou `false` se reprovado) e publicar.

Se a troca for para um **link novo**, a aprovação antiga não vale para ele, mas
a sequência acima continua recomendada, para manter o histórico coerente.

Se o arquivo for trocado sem a retirada prévia (por exemplo, por terceiros),
registre a retirada assim que perceber, publique e siga a partir do passo 4.

## O que a rotina diária precisa fazer

### 1. Registrar a versão de cada book em `catalog.json`
Para cada empreendimento com `book`, gravar o SHA-256 (64 caracteres
hexadecimais, minúsculos) do PDF **que está no link `book.url`** (a cópia no
Google Drive, não o original do SharePoint):

```json
"book": {
  "name": "Book Style.pdf",
  "url": "https://drive.google.com/file/d/…/view?usp=drivesdk",
  "sha256": "99bda203cb3d1820e9c75c84f5f5fe789ae2c72d551c21f19aabe8bd36502a97"
}
```

Atualize o `sha256` sempre que o arquivo do Drive mudar.

### 2. Revisar o conteúdo e registrar a decisão
Ler **todas as páginas** do PDF. Reprovar se houver:
- preço, valor, tabela de vendas, fluxo de pagamento, sinal, parcelas ou
  condições comerciais;
- lista de unidades disponíveis, espelho de vendas ou reservas;
- dados internos (comissão, contatos internos, observações para corretores).

Registrar a decisão em `data/public-book-releases.json`:

```json
{
  "schemaVersion": 1,
  "description": "…",
  "releases": [
    {
      "projectId": "style",
      "fileUrl": "https://drive.google.com/file/d/…/view?usp=drivesdk",
      "sha256": "99bda203cb3d1820e9c75c84f5f5fe789ae2c72d551c21f19aabe8bd36502a97",
      "approved": true,
      "reviewedAt": "2026-11-24",
      "reviewedBy": "ChatGPT",
      "notes": "114 páginas lidas; sem preços, tabelas ou condições comerciais."
    }
  ]
}
```

- Reprovado: o mesmo formato, com `"approved": false` e o motivo em `notes`.
- Nova versão do PDF: **acrescente** uma nova entrada com o novo `sha256`. Não
  edite nem apague entradas antigas: a última decisão prevalece.
- Não apague o arquivo `public-book-releases.json`: a vitrine depende dele.

### 3. Conferência
A verificação automática do GitHub valida o formato do arquivo (ids
existentes, `sha256` com 64 caracteres hexadecimais, `approved` booleano, data
`AAAA-MM-DD`, `withdrawn` só junto com `approved: false`). Na área interna, o detalhe de cada empreendimento mostra a
situação do book na vitrine:

| Situação | Significado |
| --- | --- |
| Liberado | Aparece na vitrine. |
| Falta registrar a versão | `book.sha256` ausente no catálogo. |
| Aguardando revisão | Nenhuma decisão para este arquivo. |
| O PDF mudou | Há decisão para outra versão; é preciso revisar a nova. |
| Reprovado | Última decisão para esta versão é `approved: false`. |
| Liberação retirada | Última decisão é uma retirada (`withdrawn: true`), por exemplo durante a substituição. |
| Não passou nas verificações automáticas | Arquivo fora do inventário, é uma tabela ou o nome sugere preço. |
