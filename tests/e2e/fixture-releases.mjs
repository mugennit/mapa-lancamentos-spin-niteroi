// CENÁRIO DE TESTE (só para a verificação automática): libera books fictícios de
// alguns empreendimentos do mapa para testar a vitrine com cards. ALTERA os
// arquivos de data/ na cópia de trabalho, então só roda com E2E_FIXTURE=1 e
// nunca deve ser commitado. Localmente, restaure com: git checkout -- data/
import { readFileSync, writeFileSync } from "node:fs";
import { isMapEligible } from "../../lib/catalog-rules.ts";

if (process.env.E2E_FIXTURE !== "1") {
  console.error("Recusado: defina E2E_FIXTURE=1 (este script altera data/ apenas para testes).");
  process.exit(1);
}
const file = (name) => new URL(`../../data/${name}`, import.meta.url);
const catalog = JSON.parse(readFileSync(file("catalog.json")));
const materials = JSON.parse(readFileSync(file("materials.json")));
const releasesFile = JSON.parse(readFileSync(file("public-book-releases.json")));
const urls = new Set(materials.map((m) => m.url));
const sample = catalog.filter((p) => isMapEligible(p, urls) && p.book?.url).slice(0, 12);
const sha = (i) => (i + 1).toString(16).padStart(64, "0");
sample.forEach((p, i) => {
  p.book = { ...p.book, sha256: sha(i) };
  releasesFile.releases.push({ projectId: p.id, fileUrl: p.book.url, sha256: sha(i), approved: true, reviewedAt: "2026-01-01", reviewedBy: "teste-automatico" });
});
writeFileSync(file("catalog.json"), JSON.stringify(catalog, null, 2));
writeFileSync(file("public-book-releases.json"), JSON.stringify(releasesFile, null, 2));
console.log(`cenário de teste: ${sample.length} books liberados (${sample.map((p) => p.id).join(", ")})`);
