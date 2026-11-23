// Área interna: componente de SERVIDOR. Os dados comerciais são lidos aqui e só
// são entregues depois de validar a sessão (além do proxy.ts). Nenhum
// componente de cliente importa arquivos de `data/`, então preços e tabelas não
// ficam em arquivos JavaScript públicos.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import catalog from "@/data/catalog.json";
import attributes from "@/data/attributes.json";
import materials from "@/data/materials.json";
import unitOffers from "@/data/unit-offers.json";
import audit from "@/data/materials-audit.json";
import bookReleases from "@/data/public-book-releases.json";
import CatalogApp from "@/components/catalog-app";
import { buildCatalogPayload, type CatalogRaw } from "@/lib/catalog-rules";
import { isValidSiteSession } from "@/lib/site-auth";
import { bookReleaseStatus, type BookRelease, type ReleaseProject } from "@/lib/public-catalog";
import type { CatalogData } from "@/lib/catalog-types";

// Sempre por requisição: a página nunca vira arquivo estático servido sem senha.
export const dynamic = "force-dynamic";

export default async function Page() {
  const secret = process.env.SITE_SESSION_SECRET;
  const session = (await cookies()).get("spinmap_session")?.value;
  if (!secret || !(await isValidSiteSession(session, secret))) redirect("/login");
  const data = buildCatalogPayload({ catalog, attributes, materials, offers: unitOffers, audit } as unknown as CatalogRaw) as unknown as CatalogData;
  // Situação de cada book na versão pública (só texto de status, sem dados novos).
  const releases = ((bookReleases as { releases?: BookRelease[] }).releases || []) as BookRelease[];
  const offers = unitOffers as unknown as Record<string, { tableUrl?: string }>;
  const projects = catalog as unknown as (ReleaseProject & { tables?: { url: string }[] })[];
  const tableUrls = new Set([...projects.flatMap((p) => (p.tables || []).map((t) => t.url)), ...Object.values(offers).map((t) => t.tableUrl).filter((u): u is string => Boolean(u))]);
  const publicBooks = Object.fromEntries(projects.map((p) => [p.id, bookReleaseStatus(p, materials as { url: string; type?: string; name?: string }[], tableUrls, releases)]));
  return <CatalogApp data={data} publicBooks={publicBooks} />;
}
