# Books na versão pública (`/vitrine`)

## Quem aparece na vitrine (lista e mapa)

A vitrine mostra, **na lista e no mapa**, exatamente os mesmos empreendimentos
que têm pin no mapa dos corretores: book e tabela de vendas confirmados em
`data/materials.json`, endereço conferido e coordenadas exatas validadas
(`isMapEligible` em `lib/catalog-rules.ts`). Quem estiver sem book, sem tabela
ou sem localização validada fica fora da lista e do mapa dos clientes.

Preços, tabelas, unidades, vagas e informações internas nunca vão para a
vitrine. A área interna dos corretores continua mostrando todo o catálogo.

## "Ver book": book vinculado, sem revisão individual

**Liberação autorizada por Frederico (responsável pelo projeto) em 24/11/2026.**
Todo empreendimento da vitrine tem o botão "Ver book", que abre o book **já
vinculado** em `catalog.json → book.url`. Não é exigida revisão individual do
PDF, nem `book.sha256`. Essa autorização **não** é registrada em
`data/public-book-releases.json` e não conta como revisão dos PDFs.

O site só deixa de oferecer o book em um caso, como trava automática para nunca
expor uma tabela: o arquivo vinculado como book é um link de tabela, não está
no inventário como `type: "Book"` ou o nome sugere preço ("tabela", "preço",
"valores", "planilha"). Nesse caso, a área interna mostra "o arquivo parece ser
uma tabela".

Decisões desfavoráveis já registradas em `public-book-releases.json`
(reprovado, retirado ou `needsClientVersion`) **não retiram o botão**: aparecem
apenas como ressalva no detalhe do empreendimento na área interna.

## Versão para clientes (opcional)

Se for preparada uma versão do book para clientes, registre-a em
`catalog.json → clientBook` com `url`, `name` e `sha256`, e a aprovação em
`data/public-book-releases.json` para o `fileUrl` e o `sha256` **dela**:

```json
"clientBook": {
  "name": "Book Style - clientes.pdf",
  "url": "https://drive.google.com/file/d/…/view?usp=drivesdk",
  "sha256": "…"
}
```

Com essa aprovação, "Ver book" passa a abrir a versão para clientes; sem ela,
continua abrindo o book vinculado.

## Registro de revisões (opcional, mantido pelo ChatGPT)

O arquivo `public-book-releases.json` continua válido como histórico (só se
acrescentam entradas; a última prevalece) e é usado para liberar a versão para
clientes. Não apague o arquivo.

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
`AAAA-MM-DD`, `withdrawn` só junto com `approved: false`, `needsClientVersion` booleano, `clientBook` com `url` e `sha256` válidos). Na área interna, o detalhe de cada empreendimento mostra a
situação do book na vitrine:

| Situação | Significado |
| --- | --- |
| Na vitrine, com "Ver book" | Abre o book vinculado. |
| Na vitrine, com "Ver book" (ressalva) | Abre o book vinculado; há decisão desfavorável registrada para este PDF. |
| Na vitrine, com a versão para clientes | Abre o `clientBook` aprovado. |
| Fora da vitrine | Pin não habilitado no mapa dos corretores. |
| Sem "Ver book" | O arquivo vinculado parece ser uma tabela (trava automática). |
