# Liberação de books para a versão pública (`/vitrine`)

Responsável pela revisão: **automação do ChatGPT “Atualizar lançamentos SPIN”**.
O site só lê os arquivos; não revisa conteúdo de PDF.

## Regra

Um book aparece na vitrine somente quando **todas** as condições abaixo valem:

1. O book está em `data/materials.json` com `type: "Book"` e não é o arquivo de
   uma tabela.
2. O nome do arquivo não sugere preço ou tabela.
3. `data/catalog.json` informa a versão atual do PDF em `book.sha256`.
4. `data/public-book-releases.json` tem uma aprovação (`approved: true`) para o
   **mesmo** `projectId`, `fileUrl` (igual a `book.url`) e `sha256`.

Se qualquer condição falhar, o book fica indisponível na vitrine. **O
empreendimento continua visível** (nome, bairro, mapa, tipologias, entrega).

Substituir o PDF muda o SHA-256. Com isso, a aprovação antiga deixa de valer e o
book sai da vitrine até uma nova revisão. Isso também vale para substituições
“no lugar”, que mantêm o mesmo link do Drive.

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
  edite a antiga, para manter o histórico.
- Não apague o arquivo `public-book-releases.json`: a vitrine depende dele.

### 3. Conferência
A verificação automática do GitHub valida o formato do arquivo (ids
existentes, `sha256` com 64 caracteres hexadecimais, `approved` booleano, data
`AAAA-MM-DD`). Na área interna, o detalhe de cada empreendimento mostra a
situação do book na vitrine:

| Situação | Significado |
| --- | --- |
| Liberado | Aparece na vitrine. |
| Falta registrar a versão | `book.sha256` ausente no catálogo. |
| Aguardando revisão | Nenhuma decisão para este arquivo. |
| O PDF mudou | Há decisão para outra versão; é preciso revisar a nova. |
| Reprovado | Decisão `approved: false` para esta versão. |
| Não passou nas verificações automáticas | Arquivo fora do inventário, é uma tabela ou o nome sugere preço. |
