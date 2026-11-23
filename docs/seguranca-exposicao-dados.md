# Possível exposição dos dados sem senha (item 7 — segunda etapa)

> Situação: **documentado, não corrigido nesta branch.** A correção foi deixada
> para uma segunda etapa, conforme combinado. Nada aqui altera a proteção atual.

## Resumo

A senha protege as **páginas** do site, mas o catálogo (nomes, preços, unidades,
links do Drive de books e tabelas) está embutido no **JavaScript do navegador**.
Esses arquivos JavaScript são servidos como arquivos estáticos, **sem passar pela
verificação de senha**. Quem souber (ou descobrir) o endereço do arquivo consegue
ler os dados sem entrar no site.

Isso já acontece hoje na `main`; esta branch experimental não piora nem melhora o
quadro.

## Como acontece

1. `app/page.tsx` é um componente de cliente (`"use client"`) e importa
   diretamente `data/catalog.json`, `data/materials.json`, `data/attributes.json`,
   `data/materials-audit.json` e `data/unit-offers.json` (nesta branch, via
   `lib/catalog.ts`). O empacotador coloca esse conteúdo dentro do arquivo
   `_next/static/chunks/page-<hash>.js` (cerca de 836 KB no build atual).
2. A verificação de senha fica em `proxy.ts`. O `matcher` exclui de propósito
   `_next/static`, `_next/image`, `favicon.ico` e `robots.txt`.
3. No build para a Vercel (`.vercel/output/config.json`, gerado pelo Nitro), a
   regra `{"handle": "filesystem"}` vem **antes** da função do servidor. Ou seja,
   **todo arquivo estático** é entregue direto pela CDN, sem executar `proxy.ts`.
   Isso inclui:
   - `/_next/static/chunks/*.js` (onde estão os dados);
   - `/vinext-client-entry-manifest.json` e `/.vite/manifest.json`, que **listam
     os nomes dos arquivos com hash**;
   - `/empreendimentos/*.jpg` (imagens dos books).
4. Caminho de descoberta, sem senha: `/vinext-client-entry-manifest.json` →
   nome do arquivo de entrada (`index-<hash>.js`) → esse arquivo referencia
   `page-<hash>.js` → conteúdo completo do catálogo. O hash, portanto, não
   funciona como segredo.

Verificado no build local desta branch (`VERCEL=1 npx vite build`): o arquivo
`page-<hash>.js` contém os links `drive.google.com` e o manifesto público aponta
para ele. A confirmação no ambiente publicado deve ser feita com uma requisição
sem cookie de sessão (ver "Como validar").

## O que está protegido e o que não está

| Recurso | Protegido pela senha? |
| --- | --- |
| Página `/` (HTML) | Sim (`proxy.ts`) |
| `/api/report` | Sim (verifica a sessão na própria rota) |
| JavaScript em `/_next/static/...` com o catálogo embutido | **Não** |
| Manifestos `/vinext-client-entry-manifest.json` e `/.vite/manifest.json` | **Não** |
| Imagens em `/empreendimentos/*.jpg` | **Não** |
| Arquivos no Google Drive | Depende do compartilhamento de cada arquivo no Drive |

## Correção proposta

Objetivo: os dados só podem sair do servidor depois da verificação de sessão.

1. **Tirar os dados do JavaScript público.**
   - Transformar `app/page.tsx` em componente de servidor (sem `"use client"`),
     que lê os JSON no servidor e passa ao cliente apenas o necessário. A interface
     atual (filtros, mapa, fichas) vira um componente de cliente, por exemplo
     `components/catalog-app.tsx`, que recebe os dados por *props*.
   - Os dados passam a viajar no HTML/RSC da própria página `/`, que já é
     protegida por `proxy.ts`.
   - Marcar a página com `export const dynamic = "force-dynamic"` e enviar
     `Cache-Control: private, no-store`, para que nenhuma CDN guarde uma cópia
     acessível sem sessão.
   - Garantir que nenhum componente de cliente importe `@/data/*.json`.
     `lib/catalog.ts` passaria a ser usado só no servidor (com
     `import "server-only"`), e os tipos ficariam num arquivo separado.

2. **Carregar as unidades sob demanda e com sessão.** `data/unit-offers.json`
   (582 KB) é o maior arquivo e só é necessário no detalhe e nos filtros por
   unidade. Criar uma rota, por exemplo `app/api/offers/route.ts`, que verifica
   o cookie `spinmap_session` com `isValidSiteSession` (como já faz
   `app/api/report/route.ts`) e devolve as ofertas com `Cache-Control: private,
   no-store`. Isso também deixa a primeira carga mais leve no celular.
   - Observação: os filtros por tipologia/preço/vagas precisam das ofertas para
     manter a regra de "mesma unidade". A rota pode devolver só os campos usados
     pelos filtros (unidade, tipologia, tipo, preço, vagas e notas) logo na
     entrada, deixando o restante para o detalhe.

3. **Imagens.** Avaliar mover `public/empreendimentos/` para fora de `public/` e
   servir por uma rota protegida (`app/api/photo/[id]/route.ts`, verificando a
   sessão), ou aceitar que as capas dos books sejam públicas. É uma decisão de
   negócio; as imagens são páginas de book, não preços nem links.

4. **Manifestos públicos.** Depois do passo 1, eles deixam de apontar para dados
   sensíveis. Opcionalmente, configurar a hospedagem para não publicar
   `/.vite/manifest.json`.

### Arquivos que mudariam

- `app/page.tsx` → componente de servidor que lê os dados.
- `components/catalog-app.tsx` (novo) → a interface atual, recebendo dados por props.
- `lib/catalog.ts` → uso exclusivo no servidor (`server-only`); tipos em `lib/catalog-types.ts`.
- `components/project-parts.tsx`, `components/project-inventory.tsx`,
  `components/project-comparison.tsx` → passam a importar só os tipos.
- `app/api/offers/route.ts` (novo) → ofertas por unidade, com verificação de sessão.
- `proxy.ts` → sem mudança de regra; continua protegendo `/` e as rotas novas
  (que também verificam a sessão por conta própria).
- Opcional: `app/api/photo/[id]/route.ts` e a mudança das imagens para fora de `public/`.

Nada disso altera `data/`, os links do Drive, as regras de elegibilidade ou a
rotina diária de atualização: muda apenas **por onde** os dados chegam ao navegador.

## Como validar (depois da correção)

Sem cookie de sessão:

```bash
curl -s https://<endereco-da-previa>/vinext-client-entry-manifest.json
```

Com o nome do arquivo de entrada obtido acima, procurar referências a `page-` e
baixar esse arquivo; ele **não** deve conter `drive.google.com` nem preços:

```bash
curl -s https://<endereco-da-previa>/_next/static/chunks/<arquivo>.js | grep -c drive.google.com
```

E as rotas de dados devem responder `401` sem sessão:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://<endereco-da-previa>/api/offers
```
