# Levantamento de pendências — 2026-11-23

Catálogo: 116 empreendimentos; 116 com alguma pendência; 784 registros.

| Grupo | Registros | Empreendimentos | Ausente | Aguardando validação | Conflitante |
| --- | ---: | ---: | ---: | ---: | ---: |
| Tipologia | 43 | 42 | 43 | 0 | 0 |
| Vagas | 64 | 64 | 60 | 4 | 0 |
| Etapa da obra | 109 | 109 | 105 | 4 | 0 |
| Preço | 91 | 78 | 26 | 51 | 14 |
| Condições comerciais | 116 | 116 | 116 | 0 | 0 |
| Vitrine | 116 | 116 | 84 | 32 | 0 |
| Área | 39 | 39 | 39 | 0 | 0 |
| Disponibilidade | 69 | 69 | 68 | 1 | 0 |
| Entrega | 59 | 59 | 51 | 8 | 0 |
| Materiais | 35 | 32 | 35 | 0 | 0 |
| Endereço | 24 | 16 | 11 | 13 | 0 |
| Coordenadas | 19 | 19 | 19 | 0 | 0 |

## Jardin di Grazielle (Itaipu) — `jardin-di-grazielle`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (14 de 14 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Mês da tabela comercial | Tabela comercial: "Outubro 2026"; nome do arquivo: "Tabela de Vendas Jardin Di Grazielle - Novembro 2026.pdf" | catalog.json → tables[].date × tables[].name | Conflitante | Confirmar no PDF o mês de vigência (pode ser correção intencional) e alinhar o registro. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Pebê 74 (Icaraí) — `pebe-74`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (28 de 28 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Área | Área por unidade | A confirmar (28 de 28 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Leitura só das unidades residenciais; outras ofertas podem não estar incluídas. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Singular (Charitas) — `singular`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (65 de 65 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Área | Área por unidade | A confirmar (65 de 65 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Leitura só das unidades residenciais; outras ofertas podem não estar incluídas. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Style (São Francisco) — `style`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (9 de 9 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Área | Área por unidade | A confirmar (9 de 9 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Vagas | Vagas por unidade | A confirmar (1 de 9 ofertas) · "Outras vagas a confirmar" | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas das unidades restantes. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Oka Icaraí (Icaraí) — `oka-icarai`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (16 de 16 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Área | Área por unidade | A confirmar (16 de 16 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Leitura só das unidades residenciais; outras ofertas podem não estar incluídas. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Oka São Francisco (São Francisco) — `oka-sao-francisco`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (7 de 7 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Área | Área por unidade | A confirmar (7 de 7 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Entrega | Previsão vencida | Previsão: Outubro 2026 — "Previsão anterior à data atual; confirmar entrega" | attributes.json → delivery / deliveryStatus | Aguardando validação | Confirmar se o empreendimento foi entregue (etapa "Pronto") ou a nova previsão. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. Tabela comercial há mais de 90 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Acqua (A confirmar) — `acqua`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Tabela de vendas | Sem tabela / Tabela não disponível / Tabela pendente | catalog.json → tables | Ausente | Localizar a tabela de vendas vigente (SharePoint) e publicar no Drive. |
| Endereço | Bairro | Bairro: A confirmar | catalog.json → neighborhood | Ausente | Confirmar o bairro do empreendimento nos materiais oficiais. |
| Coordenadas | Ponto no mapa | Coordenadas ou endereço a confirmar / Ponto exato pendente | catalog.json → lat, lng | Ausente | Obter o ponto exato do imóvel (marcador do lugar no Google Maps, não o Street View). |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Preço inicial | Sem preço no card / "Preço da unidade a confirmar" na ficha / "A confirmar" na comparação | catalog.json → price | Ausente | Ler o menor preço total vigente na tabela de vendas. |
| Disponibilidade | Unidades | Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## 141 Living (Icaraí) — `141-living`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Mês da tabela comercial | Tabela comercial: "Setembro 2026"; nome do arquivo: "Tabela de Vendas 141 Living - Novembro 2026.pdf" | catalog.json → tables[].date × tables[].name | Conflitante | Confirmar no PDF o mês de vigência (pode ser correção intencional) e alinhar o registro. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## IT Camboinhas (Camboinhas) — `it-camboinhas`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Tabela de vendas | Sem tabela / Tabela não disponível / Tabela pendente | catalog.json → tables | Ausente | Localizar a tabela de vendas vigente (SharePoint) e publicar no Drive. |
| Endereço | Revisão do endereço | Endereço em revisão | catalog.json → addressReviewStatus / addressReview | Aguardando validação | Conferir o endereço com fonte oficial e registrar como "Conferido". |
| Coordenadas | Ponto no mapa | Coordenadas ou endereço a confirmar / Ponto exato pendente | catalog.json → lat, lng | Ausente | Obter o ponto exato do imóvel (marcador do lugar no Google Maps, não o Street View). |
| Endereço | Nota de validação | Validação pendente: A Spin confirma a Rua José Lobo de Medeiros; um anúncio individual aponta nº 8, mas há referência pública divergente. Número pendente de validação. | catalog.json → notes[] | Aguardando validação | Resolver a validação descrita na nota. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Preço inicial | Sem preço no card / "Preço da unidade a confirmar" na ficha / "A confirmar" na comparação | catalog.json → price | Ausente | Ler o menor preço total vigente na tabela de vendas. |
| Disponibilidade | Unidades | Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## Nomad (Piratininga) — `nomad`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (1 de 1 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Maria Maria (Camboinhas) — `maria-maria`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Tao (Piratininga) — `tao`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Mês da tabela comercial | Tabela comercial: "Outubro 2026"; nome do arquivo: "Tabela de Vendas Tao - Novembro 2026.pdf" | catalog.json → tables[].date × tables[].name | Conflitante | Confirmar no PDF o mês de vigência (pode ser correção intencional) e alinhar o registro. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## In Icaraí (Icaraí) — `in-icarai`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Tabela de vendas | Sem tabela / Tabela não disponível / Tabela pendente | catalog.json → tables | Ausente | Localizar a tabela de vendas vigente (SharePoint) e publicar no Drive. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Preço inicial | Sem preço no card / "Preço da unidade a confirmar" na ficha / "A confirmar" na comparação | catalog.json → price | Ausente | Ler o menor preço total vigente na tabela de vendas. |
| Disponibilidade | Unidades | Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## Conviva Camboinhas (Camboinhas) — `conviva-camboinhas`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (2 de 14 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Entrega | Previsão vencida | Previsão: Setembro 2026 — "Previsão anterior à data atual; confirmar entrega" | attributes.json → delivery / deliveryStatus | Aguardando validação | Confirmar se o empreendimento foi entregue (etapa "Pronto") ou a nova previsão. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Conviva Charitas (Charitas) — `conviva-charitas`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Nice Camboinhas (Camboinhas) — `nice-camboinhas`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Brise by Conviva (Camboinhas) — `brise-by-conviva`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (19 de 19 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Conviva Life Camboinhas (Camboinhas) — `conviva-life-camboinhas`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Conviva Life Ingá (Ingá) — `conviva-life-inga`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Conviva Icaraí (Icaraí) — `conviva-icarai`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Conviva Itacoá (Itacoatiara) — `conviva-itacoa`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Caminhos da Guanabara (Centro) — `caminhos-da-guanabara`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Conferência incompleta — Falta uma data válida da leitura ou da tabela comercial. | attributes.json → availabilityCheckedAt; catalog.json → tables[0].date | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Unidades | Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Orla Central (Centro) — `orla-central`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Conferência incompleta — Falta uma data válida da leitura ou da tabela comercial. | attributes.json → availabilityCheckedAt; catalog.json → tables[0].date | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Unidades | Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Rio Branco 220 (Centro) — `rio-branco-220`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Preço inicial | Sem preço no card / "Preço da unidade a confirmar" na ficha / "A confirmar" na comparação | catalog.json → price | Ausente | Ler o menor preço total vigente na tabela de vendas. |
| Preço | Atualização de preço e estoque | Conferência incompleta — Falta uma data válida da leitura ou da tabela comercial. | attributes.json → availabilityCheckedAt; catalog.json → tables[0].date | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Unidades | Preços por unidade não extraídos (só identificações registradas) | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## The Pier (Centro) — `the-pier`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Conferência incompleta — Falta uma data válida da leitura ou da tabela comercial. | attributes.json → availabilityCheckedAt; catalog.json → tables[0].date | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Unidades | Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Flow Santa Rosa (Santa Rosa) — `flow-santa-rosa`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Tabela de vendas | Sem tabela / Tabela não disponível / Tabela pendente | catalog.json → tables | Ausente | Localizar a tabela de vendas vigente (SharePoint) e publicar no Drive. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Preço inicial | Sem preço no card / "Preço da unidade a confirmar" na ficha / "A confirmar" na comparação | catalog.json → price | Ausente | Ler o menor preço total vigente na tabela de vendas. |
| Disponibilidade | Unidades | Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## Alto do Ingá (Ingá) — `alto-do-inga`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Tabela de vendas | Sem tabela / Tabela não disponível / Tabela pendente | catalog.json → tables | Ausente | Localizar a tabela de vendas vigente (SharePoint) e publicar no Drive. |
| Coordenadas | Ponto no mapa | Coordenadas ou endereço a confirmar / Ponto exato pendente | catalog.json → lat, lng | Ausente | Obter o ponto exato do imóvel (marcador do lugar no Google Maps, não o Street View). |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Preço inicial | Sem preço no card / "Preço da unidade a confirmar" na ficha / "A confirmar" na comparação | catalog.json → price | Ausente | Ler o menor preço total vigente na tabela de vendas. |
| Disponibilidade | Unidades | Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## Conquista Oceânica (Várzea das Moças) — `conquista-oceanica`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Tabela de vendas | Sem tabela / Tabela não disponível / Tabela pendente | catalog.json → tables | Ausente | Localizar a tabela de vendas vigente (SharePoint) e publicar no Drive. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Preço inicial | Sem preço no card / "Preço da unidade a confirmar" na ficha / "A confirmar" na comparação | catalog.json → price | Ausente | Ler o menor preço total vigente na tabela de vendas. |
| Disponibilidade | Unidades | Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## Reserva São Francisco (São Francisco) — `reserva-sao-francisco`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (46 de 46 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Neo Design Icaraí (Icaraí) — `neo-design-icarai`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (21 de 21 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Upside Charitas (Charitas) — `upside-charitas`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (36 de 36 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Vila Gaudí (Itaipu) — `vila-gaudi`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Tabela de vendas | Sem tabela / Tabela não disponível / Tabela pendente | catalog.json → tables | Ausente | Localizar a tabela de vendas vigente (SharePoint) e publicar no Drive. |
| Endereço | Revisão do endereço | Endereço em revisão | catalog.json → addressReviewStatus / addressReview | Aguardando validação | Conferir o endereço com fonte oficial e registrar como "Conferido". |
| Coordenadas | Ponto no mapa | Coordenadas ou endereço a confirmar / Ponto exato pendente | catalog.json → lat, lng | Ausente | Obter o ponto exato do imóvel (marcador do lugar no Google Maps, não o Street View). |
| Endereço | Nota de validação | Validação pendente: Lopes lista o endereço em Piratininga; outros anúncios classificam como Itaipu/Santo Antônio. Validar o bairro cartográfico. | catalog.json → notes[] | Aguardando validação | Resolver a validação descrita na nota. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Preço inicial | Sem preço no card / "Preço da unidade a confirmar" na ficha / "A confirmar" na comparação | catalog.json → price | Ausente | Ler o menor preço total vigente na tabela de vendas. |
| Disponibilidade | Unidades | Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## Mok 132 (Icaraí) — `mok-132`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (11 de 11 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Área | Área por unidade | A confirmar (11 de 11 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. Tabela comercial há mais de 90 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## MB Loft (Icaraí) — `mb-loft`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Tabela de vendas | Sem tabela / Tabela não disponível / Tabela pendente | catalog.json → tables | Ausente | Localizar a tabela de vendas vigente (SharePoint) e publicar no Drive. |
| Coordenadas | Ponto no mapa | Coordenadas ou endereço a confirmar / Ponto exato pendente | catalog.json → lat, lng | Ausente | Obter o ponto exato do imóvel (marcador do lugar no Google Maps, não o Street View). |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Preço inicial | Sem preço no card / "Preço da unidade a confirmar" na ficha / "A confirmar" na comparação | catalog.json → price | Ausente | Ler o menor preço total vigente na tabela de vendas. |
| Disponibilidade | Unidades | Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## Namas Smart Living (Ingá) — `namas-smart-living`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (2 de 2 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Área | Área por unidade | A confirmar (2 de 2 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. Tabela comercial há mais de 90 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Cascais (São Francisco) — `cascais`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (1 de 1 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Área | Área por unidade | A confirmar (1 de 1 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Data da tabela comercial | Tabela comercial: Não informada (o nome do arquivo sugere "Novembro 2026") | unit-offers.json → tableDate | Aguardando validação | Confirmar no PDF se a vigência é a indicada no nome do arquivo e registrar a data. |
| Preço | Atualização de preço e estoque | Conferência incompleta — Falta uma data válida da leitura ou da tabela comercial. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Trend by Falves (Ingá) — `trend-by-falves`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (86 de 86 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Área | Área por unidade | A confirmar (86 de 86 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. Tabela comercial há mais de 90 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Arend (São Francisco) — `arend`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (89 de 99 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Vagas | Vagas por unidade | A confirmar (10 de 99 ofertas) · "Outras vagas a confirmar" | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas das unidades restantes. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Duetto (Jardim Icaraí) — `duetto`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (2 de 2 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Entrega | Previsão vencida | Previsão: Janeiro 2024 — "Previsão anterior à data atual; confirmar entrega" | attributes.json → delivery / deliveryStatus | Aguardando validação | Confirmar se o empreendimento foi entregue (etapa "Pronto") ou a nova previsão. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Íle (Icaraí) — `ile`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (116 de 116 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## SD40 (Icaraí) — `sd40`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (4 de 4 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Entrega | Previsão vencida | Previsão: Outubro 2025 — "Previsão anterior à data atual; confirmar entrega" | attributes.json → delivery / deliveryStatus | Aguardando validação | Confirmar se o empreendimento foi entregue (etapa "Pronto") ou a nova previsão. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Green Open (Fonseca) — `green-open`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Área | Área por unidade | A confirmar (57 de 57 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Vagas | Quantidade de vagas | Com vaga (quantidade a confirmar) / Mín. N (confirmar total) — 21 ofertas | unit-offers.json → offers[].parkingCountIsMinimum | Aguardando validação | Confirmar a quantidade exata de vagas (a tabela só indica que há vaga). |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. Tabela comercial há mais de 90 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Niterói Open Santa Rosa (Santa Rosa) — `niteroi-open-santa-rosa`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Área | Área por unidade | A confirmar (4 de 4 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Vagas | Quantidade de vagas | Com vaga (quantidade a confirmar) / Mín. N (confirmar total) — 3 ofertas | unit-offers.json → offers[].parkingCountIsMinimum | Aguardando validação | Confirmar a quantidade exata de vagas (a tabela só indica que há vaga). |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Mês da tabela comercial | Tabela comercial: "Novembro 2025"; nome do arquivo: "Tabela de Vendas Niterói Open - Fevereiro 2026.pdf" | catalog.json → tables[].date × tables[].name | Conflitante | Confirmar no PDF o mês de vigência (pode ser correção intencional) e alinhar o registro. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. Tabela comercial há mais de 90 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Lazuli (Boa Viagem) — `lazuli`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Área | Área por unidade | A confirmar (60 de 60 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Sou + Icaraí (Ingá) — `sou-icarai`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (19 de 19 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Área | Área por unidade | A confirmar (19 de 19 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. Tabela comercial há mais de 90 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Sou + Itacoá (Itacoatiara) — `sou-itacoa`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (16 de 61 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Área | Área por unidade | A confirmar (61 de 61 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. Tabela comercial há mais de 90 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Sou + Charitas (Charitas) — `sou-charitas`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Área | Área por unidade | A confirmar (39 de 39 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. Tabela comercial há mais de 90 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Sou + Wellness Charitas (Charitas) — `sou-wellness-charitas`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Área | Área por unidade | A confirmar (87 de 87 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. Tabela comercial há mais de 90 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Marina (Piratininga) — `marina`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Mês da tabela comercial | Tabela comercial: "Outubro 2026"; nome do arquivo: "Tabela de Vendas Marina - Novembro 2026 (2).pdf" | catalog.json → tables[].date × tables[].name | Conflitante | Confirmar no PDF o mês de vigência (pode ser correção intencional) e alinhar o registro. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Ravello Residenziale (Piratininga) — `ravello-residenziale`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Tabela de vendas | Sem tabela / Tabela não disponível / Tabela pendente | catalog.json → tables | Ausente | Localizar a tabela de vendas vigente (SharePoint) e publicar no Drive. |
| Coordenadas | Ponto no mapa | Coordenadas ou endereço a confirmar / Ponto exato pendente | catalog.json → lat, lng | Ausente | Obter o ponto exato do imóvel (marcador do lugar no Google Maps, não o Street View). |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Preço inicial | Sem preço no card / "Preço da unidade a confirmar" na ficha / "A confirmar" na comparação | catalog.json → price | Ausente | Ler o menor preço total vigente na tabela de vendas. |
| Disponibilidade | Unidades | Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## Triunfo (Camboinhas) — `triunfo`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Mês da tabela comercial | Tabela comercial: "Outubro 2026"; nome do arquivo: "Tabela de Vendas Triunfo - Novembro 2026.pdf" | catalog.json → tables[].date × tables[].name | Conflitante | Confirmar no PDF o mês de vigência (pode ser correção intencional) e alinhar o registro. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Serena (Piratininga) — `serena`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Mês da tabela comercial | Tabela comercial: "Outubro 2026"; nome do arquivo: "Tabela de Vendas Serena - Novembro 2026 (3).pdf" | catalog.json → tables[].date × tables[].name | Conflitante | Confirmar no PDF o mês de vigência (pode ser correção intencional) e alinhar o registro. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Althea (Jardim Icaraí) — `althea`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## NP38 (Santa Rosa) — `np38`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Terramarine (Icaraí) — `terramarine`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (1 de 24 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Uni Home Studios (Boa Viagem) — `uni-home-studios`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (2 de 3 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Preço | Mês da tabela comercial | Tabela comercial: "Agosto 2026"; nome do arquivo: "Tabela de Vendas Uni Home Studio - Novembro 2026 (2).pdf" | catalog.json → tables[].date × tables[].name | Conflitante | Confirmar no PDF o mês de vigência (pode ser correção intencional) e alinhar o registro. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Tabela comercial há mais de 90 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Maris (Charitas) — `maris`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (48 de 48 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Calle Sardegna (Santa Rosa) — `calle-sardegna`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (2 de 2 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Área | Área por unidade | A confirmar (2 de 2 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. Tabela comercial há mais de 90 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Solo (Icaraí) — `solo`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (69 de 69 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Área | Área por unidade | A confirmar (69 de 69 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Mês da tabela comercial | Tabela comercial: "Setembro 2026"; nome do arquivo: "Tabela de Vendas Solo - Outubro 2026.pdf" | catalog.json → tables[].date × tables[].name | Conflitante | Confirmar no PDF o mês de vigência (pode ser correção intencional) e alinhar o registro. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Scenarium Piratininga (Piratininga) — `scenarium-piratininga`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (9 de 9 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Área | Área por unidade | A confirmar (9 de 9 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Preço | Mês da tabela comercial | Tabela comercial: "Setembro 2026"; nome do arquivo: "Tabela de Vendas Scenarium - Outubro 2026.pdf" | catalog.json → tables[].date × tables[].name | Conflitante | Confirmar no PDF o mês de vigência (pode ser correção intencional) e alinhar o registro. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Leitura só das unidades residenciais; outras ofertas podem não estar incluídas. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Tre Amici (Piratininga) — `tre-amici`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Tabela de vendas | Sem tabela / Tabela não disponível / Tabela pendente | catalog.json → tables | Ausente | Localizar a tabela de vendas vigente (SharePoint) e publicar no Drive. |
| Coordenadas | Ponto no mapa | Coordenadas ou endereço a confirmar / Ponto exato pendente | catalog.json → lat, lng | Ausente | Obter o ponto exato do imóvel (marcador do lugar no Google Maps, não o Street View). |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Preço inicial | Sem preço no card / "Preço da unidade a confirmar" na ficha / "A confirmar" na comparação | catalog.json → price | Ausente | Ler o menor preço total vigente na tabela de vendas. |
| Disponibilidade | Unidades | Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## Jardim Itacoá (Itacoatiara) — `jardim-itacoa`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Data da tabela comercial | Tabela comercial: Não informada (o nome do arquivo sugere "Novembro 2026") | unit-offers.json → tableDate | Aguardando validação | Confirmar no PDF se a vigência é a indicada no nome do arquivo e registrar a data. |
| Preço | Atualização de preço e estoque | Conferência incompleta — Falta uma data válida da leitura ou da tabela comercial. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Wind Itacoatiara (Itaipu) — `wind-itacoatiara`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Tabela de vendas | Sem tabela / Tabela não disponível / Tabela pendente | catalog.json → tables | Ausente | Localizar a tabela de vendas vigente (SharePoint) e publicar no Drive. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Preço inicial | Sem preço no card / "Preço da unidade a confirmar" na ficha / "A confirmar" na comparação | catalog.json → price | Ausente | Ler o menor preço total vigente na tabela de vendas. |
| Disponibilidade | Unidades | Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## Wind Oceânica (Piratininga) — `wind-oceanica`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Área | Área por unidade | A confirmar (10 de 10 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Wind Piratininga (Piratininga) — `wind-piratininga`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Tabela de vendas | Sem tabela / Tabela não disponível / Tabela pendente | catalog.json → tables | Ausente | Localizar a tabela de vendas vigente (SharePoint) e publicar no Drive. |
| Coordenadas | Ponto no mapa | Coordenadas ou endereço a confirmar / Ponto exato pendente | catalog.json → lat, lng | Ausente | Obter o ponto exato do imóvel (marcador do lugar no Google Maps, não o Street View). |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Preço inicial | Sem preço no card / "Preço da unidade a confirmar" na ficha / "A confirmar" na comparação | catalog.json → price | Ausente | Ler o menor preço total vigente na tabela de vendas. |
| Disponibilidade | Unidades | Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## Bettina (Piratininga) — `bettina`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Tabela de vendas | Sem tabela / Tabela não disponível / Tabela pendente | catalog.json → tables | Ausente | Localizar a tabela de vendas vigente (SharePoint) e publicar no Drive. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Preço inicial | Sem preço no card / "Preço da unidade a confirmar" na ficha / "A confirmar" na comparação | catalog.json → price | Ausente | Ler o menor preço total vigente na tabela de vendas. |
| Disponibilidade | Unidades | Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## 115 Tapuias (São Francisco) — `115-tapuias`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Área | Área por unidade | A confirmar (2 de 2 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## M.48 (Boa Viagem) — `m-48`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Tabela de vendas | Sem tabela / Tabela não disponível / Tabela pendente | catalog.json → tables | Ausente | Localizar a tabela de vendas vigente (SharePoint) e publicar no Drive. |
| Coordenadas | Ponto no mapa | Coordenadas ou endereço a confirmar / Ponto exato pendente | catalog.json → lat, lng | Ausente | Obter o ponto exato do imóvel (marcador do lugar no Google Maps, não o Street View). |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Preço inicial | Sem preço no card / "Preço da unidade a confirmar" na ficha / "A confirmar" na comparação | catalog.json → price | Ausente | Ler o menor preço total vigente na tabela de vendas. |
| Disponibilidade | Unidades | Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## Green Life (A confirmar) — `green-life`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Endereço | Bairro | Bairro: A confirmar | catalog.json → neighborhood | Ausente | Confirmar o bairro do empreendimento nos materiais oficiais. |
| Área | Área por unidade | A confirmar (422 de 422 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Vagas | Quantidade de vagas | Com vaga (quantidade a confirmar) / Mín. N (confirmar total) — 281 ofertas | unit-offers.json → offers[].parkingCountIsMinimum | Aguardando validação | Confirmar a quantidade exata de vagas (a tabela só indica que há vaga). |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Preço inicial | Exibe "a partir de R$ 430.000", mas há oferta de R$ 364.191 na tabela lida | catalog.json → price × unit-offers.json → offers[].price | Conflitante | Confirmar o menor preço vigente na tabela e alinhar o preço inicial. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. Tabela comercial há mais de 90 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Monier (Piratininga) — `monier`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Área | Área por unidade | A confirmar (31 de 31 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Gael (A confirmar) — `gael`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Endereço | Bairro | Bairro: A confirmar | catalog.json → neighborhood | Ausente | Confirmar o bairro do empreendimento nos materiais oficiais. |
| Área | Área por unidade | A confirmar (23 de 23 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Jardim dos Manacás (Santa Rosa) — `jardim-dos-manacas`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Up Icaraí (Icaraí) — `up-icarai`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (10 de 10 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Entrega | Previsão vencida | Previsão: Outubro 2026 — "Previsão anterior à data atual; confirmar entrega" | attributes.json → delivery / deliveryStatus | Aguardando validação | Confirmar se o empreendimento foi entregue (etapa "Pronto") ou a nova previsão. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Data da tabela comercial | Tabela comercial: Não informada (o nome do arquivo sugere "Novembro 2026") | unit-offers.json → tableDate | Aguardando validação | Confirmar no PDF se a vigência é a indicada no nome do arquivo e registrar a data. |
| Preço | Atualização de preço e estoque | Conferência incompleta — Falta uma data válida da leitura ou da tabela comercial. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Nirvana (Piratininga) — `nirvana`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Stage (Icaraí) — `stage`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Sunset (Icaraí) — `sunset`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Soma (Ingá) — `soma`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (2 de 63 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Maren (Piratininga) — `maren`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Viña del Mar (Piratininga) — `vina-del-mar`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Tabela de vendas | Sem tabela / Tabela não disponível / Tabela pendente | catalog.json → tables | Ausente | Localizar a tabela de vendas vigente (SharePoint) e publicar no Drive. |
| Coordenadas | Ponto no mapa | Coordenadas ou endereço a confirmar / Ponto exato pendente | catalog.json → lat, lng | Ausente | Obter o ponto exato do imóvel (marcador do lugar no Google Maps, não o Street View). |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Preço inicial | Sem preço no card / "Preço da unidade a confirmar" na ficha / "A confirmar" na comparação | catalog.json → price | Ausente | Ler o menor preço total vigente na tabela de vendas. |
| Disponibilidade | Unidades | Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## Vila Santo Antônio (Itaipu) — `vila-santo-antonio`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Tabela de vendas | Sem tabela / Tabela não disponível / Tabela pendente | catalog.json → tables | Ausente | Localizar a tabela de vendas vigente (SharePoint) e publicar no Drive. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Preço inicial | Sem preço no card / "Preço da unidade a confirmar" na ficha / "A confirmar" na comparação | catalog.json → price | Ausente | Ler o menor preço total vigente na tabela de vendas. |
| Disponibilidade | Unidades | Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## Soul Fonseca (Fonseca) — `soul-fonseca`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (1 de 55 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Vagas | Quantidade de vagas | Com vaga (quantidade a confirmar) / Mín. N (confirmar total) — 53 ofertas | unit-offers.json → offers[].parkingCountIsMinimum | Aguardando validação | Confirmar a quantidade exata de vagas (a tabela só indica que há vaga). |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Sun In (A confirmar) — `sun-in`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Endereço | Bairro | Bairro: A confirmar | catalog.json → neighborhood | Ausente | Confirmar o bairro do empreendimento nos materiais oficiais. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Giardino di Verona (São Francisco) — `giardino-di-verona`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Área | Área por unidade | A confirmar (54 de 54 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. Tabela comercial há mais de 90 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Dahlia Residence (Itaipu) — `dahlia-residence`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Área | Área por unidade | A confirmar (11 de 11 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. Tabela comercial há mais de 90 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Dianthus (Piratininga) — `dianthus`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Área | Área por unidade | A confirmar (9 de 9 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Entrega | Previsão vencida | Previsão: Outubro 2026 — "Previsão anterior à data atual; confirmar entrega" | attributes.json → delivery / deliveryStatus | Aguardando validação | Confirmar se o empreendimento foi entregue (etapa "Pronto") ou a nova previsão. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Helianthus (A confirmar) — `helianthus`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Tabela de vendas | Sem tabela / Tabela não disponível / Tabela pendente | catalog.json → tables | Ausente | Localizar a tabela de vendas vigente (SharePoint) e publicar no Drive. |
| Endereço | Bairro | Bairro: A confirmar | catalog.json → neighborhood | Ausente | Confirmar o bairro do empreendimento nos materiais oficiais. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Preço inicial | Sem preço no card / "Preço da unidade a confirmar" na ficha / "A confirmar" na comparação | catalog.json → price | Ausente | Ler o menor preço total vigente na tabela de vendas. |
| Disponibilidade | Unidades | Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## Tarsila (Ingá) — `tarsila`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Tabela de vendas | Sem tabela / Tabela não disponível / Tabela pendente | catalog.json → tables | Ausente | Localizar a tabela de vendas vigente (SharePoint) e publicar no Drive. |
| Coordenadas | Ponto no mapa | Coordenadas ou endereço a confirmar / Ponto exato pendente | catalog.json → lat, lng | Ausente | Obter o ponto exato do imóvel (marcador do lugar no Google Maps, não o Street View). |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Preço inicial | Sem preço no card / "Preço da unidade a confirmar" na ficha / "A confirmar" na comparação | catalog.json → price | Ausente | Ler o menor preço total vigente na tabela de vendas. |
| Disponibilidade | Unidades | Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## Attrium Icaraí (Icaraí) — `attrium-icarai`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (1 de 1 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Área | Área por unidade | A confirmar (1 de 1 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Íon Icaraí (Icaraí) — `ion-icarai`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Área | Área por unidade | A confirmar (1 de 1 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Maestro (Jardim Icaraí) — `maestro`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (5 de 5 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Mediterrâneo (A confirmar) — `mediterraneo`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Tabela de vendas | Sem tabela / Tabela não disponível / Tabela pendente | catalog.json → tables | Ausente | Localizar a tabela de vendas vigente (SharePoint) e publicar no Drive. |
| Endereço | Bairro | Bairro: A confirmar | catalog.json → neighborhood | Ausente | Confirmar o bairro do empreendimento nos materiais oficiais. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Preço inicial | Sem preço no card / "Preço da unidade a confirmar" na ficha / "A confirmar" na comparação | catalog.json → price | Ausente | Ler o menor preço total vigente na tabela de vendas. |
| Disponibilidade | Unidades | Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## MUD 333 (Jardim Icaraí) — `mud-333`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Tabela de vendas | Sem tabela / Tabela não disponível / Tabela pendente | catalog.json → tables | Ausente | Localizar a tabela de vendas vigente (SharePoint) e publicar no Drive. |
| Coordenadas | Ponto no mapa | Coordenadas ou endereço a confirmar / Ponto exato pendente | catalog.json → lat, lng | Ausente | Obter o ponto exato do imóvel (marcador do lugar no Google Maps, não o Street View). |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Preço inicial | Sem preço no card / "Preço da unidade a confirmar" na ficha / "A confirmar" na comparação | catalog.json → price | Ausente | Ler o menor preço total vigente na tabela de vendas. |
| Disponibilidade | Unidades | Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## The Edge (Icaraí) — `the-edge`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Tabela de vendas | Sem tabela / Tabela não disponível / Tabela pendente | catalog.json → tables | Ausente | Localizar a tabela de vendas vigente (SharePoint) e publicar no Drive. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Preço inicial | Sem preço no card / "Preço da unidade a confirmar" na ficha / "A confirmar" na comparação | catalog.json → price | Ausente | Ler o menor preço total vigente na tabela de vendas. |
| Disponibilidade | Unidades | Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## Clarice (Jardim Icaraí) — `clarice`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Área | Área por unidade | A confirmar (16 de 16 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Pulse (Icaraí) — `pulse`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Origem (Icaraí) — `origem`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (3 de 21 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## The Grove (Icaraí) — `the-grove`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Área | Área por unidade | A confirmar (41 de 41 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Trópico Camboinhas (Camboinhas) — `tropico-camboinhas`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Flua (Centro) — `flua`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (2 de 2 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Área | Área por unidade | A confirmar (2 de 2 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Home Boutique (Icaraí) — `home-boutique`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Tabela de vendas | Sem tabela / Tabela não disponível / Tabela pendente | catalog.json → tables | Ausente | Localizar a tabela de vendas vigente (SharePoint) e publicar no Drive. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Preço inicial | Sem preço no card / "Preço da unidade a confirmar" na ficha / "A confirmar" na comparação | catalog.json → price | Ausente | Ler o menor preço total vigente na tabela de vendas. |
| Disponibilidade | Unidades | Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## Trésor Dior (Camboinhas) — `tresor-dior`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Tipologia | Tipologia por unidade | A confirmar (3 de 3 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Mare Blu (Piratininga) — `mare-blu`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Área | Área por unidade | A confirmar (2 de 2 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Conviva Piratininga (Piratininga) — `conviva-piratininga`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Área | Área por unidade | A confirmar (3 de 3 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Entrega | Previsão vencida | Previsão: Maio 2026 — "Previsão anterior à data atual; confirmar entrega" | attributes.json → delivery / deliveryStatus | Aguardando validação | Confirmar se o empreendimento foi entregue (etapa "Pronto") ou a nova previsão. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Mês da tabela comercial | Tabela comercial: "Agosto 2026"; nome do arquivo: "Tabela de Vendas Conviva Piratininga - Outubro 2026.pdf" | catalog.json → tables[].date × tables[].name | Conflitante | Confirmar no PDF o mês de vigência (pode ser correção intencional) e alinhar o registro. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. Tabela comercial há mais de 90 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Eldorado II (Santa Rosa) — `eldorado-ii`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Book | Sem book / Book não disponível / Book pendente | catalog.json → book | Ausente | Localizar o book oficial na pasta Books (SharePoint) e publicar no Drive. |
| Materiais | Tabela de vendas | Sem tabela / Tabela não disponível / Tabela pendente | catalog.json → tables | Ausente | Localizar a tabela de vendas vigente (SharePoint) e publicar no Drive. |
| Coordenadas | Ponto no mapa | Coordenadas ou endereço a confirmar / Ponto exato pendente | catalog.json → lat, lng | Ausente | Obter o ponto exato do imóvel (marcador do lugar no Google Maps, não o Street View). |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Preço inicial | Sem preço no card / "Preço da unidade a confirmar" na ficha / "A confirmar" na comparação | catalog.json → price | Ausente | Ler o menor preço total vigente na tabela de vendas. |
| Disponibilidade | Unidades | Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## Business (A confirmar) — `business`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Book | Sem book / Book não disponível / Book pendente | catalog.json → book | Ausente | Localizar o book oficial na pasta Books (SharePoint) e publicar no Drive. |
| Endereço | Bairro | Bairro: A confirmar | catalog.json → neighborhood | Ausente | Confirmar o bairro do empreendimento nos materiais oficiais. |
| Endereço | Revisão do endereço | Endereço em revisão | catalog.json → addressReviewStatus / addressReview | Aguardando validação | Conferir o endereço com fonte oficial e registrar como "Conferido". |
| Coordenadas | Ponto no mapa | Coordenadas ou endereço a confirmar / Ponto exato pendente | catalog.json → lat, lng | Ausente | Obter o ponto exato do imóvel (marcador do lugar no Google Maps, não o Street View). |
| Endereço | Nota de validação | Validação pendente: A Itaúba tem um empreendimento chamado Quality Business neste endereço, mas a tabela base informa apenas “Business”. Confirmar se é o mesmo empreendimento. | catalog.json → notes[] | Aguardando validação | Resolver a validação descrita na nota. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Mês da tabela comercial | Tabela comercial: "Outubro 2026"; nome do arquivo: "Tabela de Vendas Business - Novembro 2026.pdf" | catalog.json → tables[].date × tables[].name | Conflitante | Confirmar no PDF o mês de vigência (pode ser correção intencional) e alinhar o registro. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## Unic Icaraí (Icaraí) — `unic-icarai`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Book | Sem book / Book não disponível / Book pendente | catalog.json → book | Ausente | Localizar o book oficial na pasta Books (SharePoint) e publicar no Drive. |
| Materiais | Tabela de vendas | Sem tabela / Tabela não disponível / Tabela pendente | catalog.json → tables | Ausente | Localizar a tabela de vendas vigente (SharePoint) e publicar no Drive. |
| Endereço | Revisão do endereço | Endereço em revisão | catalog.json → addressReviewStatus / addressReview | Aguardando validação | Conferir o endereço com fonte oficial e registrar como "Conferido". |
| Coordenadas | Ponto no mapa | Coordenadas ou endereço a confirmar / Ponto exato pendente | catalog.json → lat, lng | Ausente | Obter o ponto exato do imóvel (marcador do lugar no Google Maps, não o Street View). |
| Endereço | Nota de validação | Validação pendente: Google/listagens mostram o edifício UNIC Icaraí na Rua Doutor Paulo César, 63; verificar se é o empreendimento correspondente da tabela. | catalog.json → notes[] | Aguardando validação | Resolver a validação descrita na nota. |
| Tipologia | Tipologias | Tipologia a confirmar (sem tipologia no card; "A confirmar" na comparação) | attributes.json → typologies; unit-offers.json → offers[].typology | Ausente | Confirmar as tipologias na tabela ou no book. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Preço inicial | Sem preço no card / "Preço da unidade a confirmar" na ficha / "A confirmar" na comparação | catalog.json → price | Ausente | Ler o menor preço total vigente na tabela de vendas. |
| Disponibilidade | Unidades | Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## Reserva Natural (Maceió) — `reserva-natural`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Book | Sem book / Book não disponível / Book pendente | catalog.json → book | Ausente | Localizar o book oficial na pasta Books (SharePoint) e publicar no Drive. |
| Coordenadas | Ponto no mapa | Coordenadas ou endereço a confirmar / Ponto exato pendente | catalog.json → lat, lng | Ausente | Obter o ponto exato do imóvel (marcador do lugar no Google Maps, não o Street View). |
| Tipologia | Tipologia por unidade | A confirmar (1 de 1 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Área | Área por unidade | A confirmar (1 de 1 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## Seven Avenue (A confirmar) — `seven-avenue`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Book | Sem book / Book não disponível / Book pendente | catalog.json → book | Ausente | Localizar o book oficial na pasta Books (SharePoint) e publicar no Drive. |
| Endereço | Bairro | Bairro: A confirmar | catalog.json → neighborhood | Ausente | Confirmar o bairro do empreendimento nos materiais oficiais. |
| Tipologia | Tipologia por unidade | A confirmar (3 de 3 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Área | Área por unidade | A confirmar (3 de 3 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Data da tabela comercial | Tabela comercial: Não informada (o nome do arquivo sugere "Novembro 2026") | unit-offers.json → tableDate | Aguardando validação | Confirmar no PDF se a vigência é a indicada no nome do arquivo e registrar a data. |
| Preço | Atualização de preço e estoque | Conferência incompleta — Falta uma data válida da leitura ou da tabela comercial. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## Vila Moura (A confirmar) — `vila-moura`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Book | Sem book / Book não disponível / Book pendente | catalog.json → book | Ausente | Localizar o book oficial na pasta Books (SharePoint) e publicar no Drive. |
| Materiais | Tabela de vendas | Sem tabela / Tabela não disponível / Tabela pendente | catalog.json → tables | Ausente | Localizar a tabela de vendas vigente (SharePoint) e publicar no Drive. |
| Endereço | Bairro | Bairro: A confirmar | catalog.json → neighborhood | Ausente | Confirmar o bairro do empreendimento nos materiais oficiais. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json (sem ofertas lidas) | Ausente | Ler as unidades da tabela de vendas, incluindo vagas. |
| Entrega | Previsão vencida | Previsão: Abril 2026 (previsão da tabela) — "Previsão anterior à data atual; confirmar entrega" | attributes.json → delivery / deliveryStatus | Aguardando validação | Confirmar se o empreendimento foi entregue (etapa "Pronto") ou a nova previsão. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Preço inicial | Sem preço no card / "Preço da unidade a confirmar" na ficha / "A confirmar" na comparação | catalog.json → price | Ausente | Ler o menor preço total vigente na tabela de vendas. |
| Disponibilidade | Unidades | Consulte a tabela vinculada / As características e os preços por unidade ainda não foram extraídos | unit-offers.json (sem ofertas); attributes.json → availableUnits | Ausente | Extrair as unidades disponíveis com preço, tipologia, área e vagas da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## Santa Bárbara (A confirmar) — `santa-barbara`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Book | Sem book / Book não disponível / Book pendente | catalog.json → book | Ausente | Localizar o book oficial na pasta Books (SharePoint) e publicar no Drive. |
| Endereço | Bairro | Bairro: A confirmar | catalog.json → neighborhood | Ausente | Confirmar o bairro do empreendimento nos materiais oficiais. |
| Endereço | Revisão do endereço | Endereço em revisão | catalog.json → addressReviewStatus / addressReview | Aguardando validação | Conferir o endereço com fonte oficial e registrar como "Conferido". |
| Coordenadas | Ponto no mapa | Coordenadas ou endereço a confirmar / Ponto exato pendente | catalog.json → lat, lng | Ausente | Obter o ponto exato do imóvel (marcador do lugar no Google Maps, não o Street View). |
| Endereço | Nota de validação | Validação pendente: Cadastro da SPE FEFM/La Grandiere indica esse endereço; confirmar que Santa Bárbara na tabela corresponde a esse empreendimento. | catalog.json → notes[] | Aguardando validação | Resolver a validação descrita na nota. |
| Tipologia | Tipologias | Tipologia a confirmar (sem tipologia no card; "A confirmar" na comparação) | attributes.json → typologies; unit-offers.json → offers[].typology | Ausente | Confirmar as tipologias na tabela ou no book. |
| Tipologia | Tipologia por unidade | A confirmar (22 de 22 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Área | Área por unidade | A confirmar (22 de 22 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. Tabela comercial há mais de 90 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## Golden Ville Residence (Maria Paula, São Gonçalo) — `golden-ville-residence`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Book | Sem book / Book não disponível / Book pendente | catalog.json → book | Ausente | Localizar o book oficial na pasta Books (SharePoint) e publicar no Drive. |
| Endereço | Revisão do endereço | Endereço em revisão | catalog.json → addressReviewStatus / addressReview | Aguardando validação | Conferir o endereço com fonte oficial e registrar como "Conferido". |
| Coordenadas | Ponto no mapa | Coordenadas ou endereço a confirmar / Ponto exato pendente | catalog.json → lat, lng | Ausente | Obter o ponto exato do imóvel (marcador do lugar no Google Maps, não o Street View). |
| Endereço | Nota de validação | Validação pendente: O Golden Ville Residence aparece em Maria Paula, São Gonçalo, fora do município de Niterói indicado pelo mapa; confirmar se deve constar. | catalog.json → notes[] | Aguardando validação | Resolver a validação descrita na nota. |
| Área | Área por unidade | A confirmar (57 de 57 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Vagas | Vagas | Vagas a confirmar | unit-offers.json → offers[].parkingSpaces | Ausente | Ler a quantidade de vagas por unidade na tabela de vendas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Preço | Atualização de preço e estoque | Revisar preço e estoque — Leitura dos dados há mais de 30 dias. Tabela comercial há mais de 90 dias. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## DaVinci (A confirmar) — `davinci`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Book | Sem book / Book não disponível / Book pendente | catalog.json → book | Ausente | Localizar o book oficial na pasta Books (SharePoint) e publicar no Drive. |
| Endereço | Bairro | Bairro: A confirmar | catalog.json → neighborhood | Ausente | Confirmar o bairro do empreendimento nos materiais oficiais. |
| Tipologia | Tipologia por unidade | A confirmar (2 de 2 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar | attributes.json → deliveryStatus (catalog.json → status: "A confirmar") | Ausente | Confirmar a etapa atual (lançamento, em construção ou pronto) com evidência. |
| Disponibilidade | Cobertura da leitura | Levantamento parcial; pode haver outras unidades na tabela. | unit-offers.json → coverage | Ausente | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## Baume (Jardim Icaraí) — `baume`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar (catalog.json → status indica "Lançamento") | attributes.json → deliveryStatus × catalog.json → status | Aguardando validação | Confirmar com evidência se a etapa é "Lançamento" e registrar em deliveryStatus. |
| Preço | Data da tabela comercial | Tabela comercial: Não informada (o nome do arquivo sugere "Novembro 2026") | unit-offers.json → tableDate | Aguardando validação | Confirmar no PDF se a vigência é a indicada no nome do arquivo e registrar a data. |
| Preço | Atualização de preço e estoque | Conferência incompleta — Falta uma data válida da leitura ou da tabela comercial. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Orla Guanabara (Centro) — `orla-guanabara`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Área | Área por unidade | A confirmar (700 de 700 ofertas) | unit-offers.json → offers[].area | Ausente | Ler a área privativa de cada unidade na tabela ou no book. |
| Entrega | Previsão de entrega | Previsão de entrega a confirmar / Entrega a confirmar / Sem previsão informada | attributes.json → delivery; catalog.json → delivery | Ausente | Confirmar a previsão de entrega nos materiais oficiais. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar (catalog.json → status indica "Lançamento") | attributes.json → deliveryStatus × catalog.json → status | Aguardando validação | Confirmar com evidência se a etapa é "Lançamento" e registrar em deliveryStatus. |
| Preço | Mês da tabela comercial | Tabela comercial: "Outubro 2026"; nome do arquivo: "Tabela de Vendas Orla Guanabara - Novembro 2026 - Lançamento.pdf" | catalog.json → tables[].date × tables[].name | Conflitante | Confirmar no PDF o mês de vigência (pode ser correção intencional) e alinhar o registro. |
| Disponibilidade | Cobertura da leitura | Disponibilidade preliminar, sujeita a confirmação. | unit-offers.json → coverage | Aguardando validação | Completar a leitura de todas as unidades da tabela. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |

## Conviva Piratininga II (Piratininga) — `conviva-piratininga-ii`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Materiais | Book | Sem book / Book não disponível / Book pendente | catalog.json → book | Ausente | Localizar o book oficial na pasta Books (SharePoint) e publicar no Drive. |
| Endereço | Revisão do endereço | Revisão do endereço: Pendente | catalog.json → addressReviewStatus / addressReview | Aguardando validação | Conferir o endereço com fonte oficial e registrar como "Conferido". |
| Coordenadas | Ponto no mapa | Coordenadas ou endereço a confirmar / Ponto exato pendente | catalog.json → lat, lng | Ausente | Obter o ponto exato do imóvel (marcador do lugar no Google Maps, não o Street View). |
| Tipologia | Tipologia por unidade | A confirmar (1 de 18 ofertas) | unit-offers.json → offers[].typology | Ausente | Ler a tipologia de cada unidade na tabela de vendas. |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar (catalog.json → status indica "Lançamento") | attributes.json → deliveryStatus × catalog.json → status | Aguardando validação | Confirmar com evidência se a etapa é "Lançamento" e registrar em deliveryStatus. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: pin não habilitado no mapa dos corretores | regra do mapa (ver Materiais/Endereço/Coordenadas) | Aguardando validação | Resolver as pendências de materiais, endereço e coordenadas acima. |

## Lothus Residence (Charitas) — `lothus-residence`

| Grupo | Campo | Exibido | Origem | Situação | Confirmação necessária |
| --- | --- | --- | --- | --- | --- |
| Etapa da obra | Etapa confirmada | Etapa: A confirmar (catalog.json → status indica "Lançamento") | attributes.json → deliveryStatus × catalog.json → status | Aguardando validação | Confirmar com evidência se a etapa é "Lançamento" e registrar em deliveryStatus. |
| Preço | Data da tabela comercial | Tabela comercial: Não informada (o nome do arquivo sugere "Novembro 2026") | unit-offers.json → tableDate | Aguardando validação | Confirmar no PDF se a vigência é a indicada no nome do arquivo e registrar a data. |
| Preço | Atualização de preço e estoque | Conferência incompleta — Falta uma data válida da leitura ou da tabela comercial. | unit-offers.json → checkedAt / tableDate | Aguardando validação | Reler preços e unidades na tabela vigente e registrar a data da leitura. |
| Condições comerciais | Entrada e condições de pagamento | Entrada e condições: a confirmar na tabela | não existe campo no contrato de dados | Ausente | Definir se as condições de pagamento serão extraídas da tabela (novo campo combinado com a rotina). |
| Vitrine | Book para clientes | Fora da vitrine: falta registrar a versão (SHA-256) do book | catalog.json → book.sha256 / clientBook; public-book-releases.json | Ausente | Registrar o SHA-256, revisar o conteúdo do book e registrar a decisão (docs/liberacao-books.md). |
