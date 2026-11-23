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
import { buildCatalogPayload, isMapEligible, type CatalogRaw } from "@/lib/catalog-rules";
import { isValidSiteSession } from "@/lib/site-auth";
import { collectTableUrls, publicStatus, type BookRelease, type ReleaseProject } from "@/lib/public-catalog";
import type { CatalogData } from "@/lib/catalog-types";

// Sempre por requisição: a página nunca vira arquivo estático servido sem senha.
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const explicitView = typeof (await searchParams).ver === "string";
  const secret = process.env.SITE_SESSION_SECRET;
  const session = (await cookies()).get("spinmap_session")?.value;
  if (!secret || !(await isValidSiteSession(session, secret))) redirect("/login");
  const data = buildCatalogPayload({ catalog, attributes, materials, offers: unitOffers, audit } as unknown as CatalogRaw) as unknown as CatalogData;
  // Situação de cada empreendimento na versão pública (só texto de status).
  const releases = ((bookReleases as { releases?: BookRelease[] }).releases || []) as BookRelease[];
  const offers = unitOffers as unknown as Record<string, { tableUrl?: string }>;
  const projects = catalog as unknown as (ReleaseProject & Record<string, unknown>)[];
  const materialList = materials as { url: string; type?: string; name?: string }[];
  const materialUrls = new Set(materialList.map((item) => item.url));
  const tableUrls = collectTableUrls(projects, Object.values(offers));
  const publicBooks = Object.fromEntries(projects.map((p) => [p.id, publicStatus(p, isMapEligible(p as never, materialUrls), materialList, tableUrls, releases)]));
  return <CatalogApp data={data} publicBooks={publicBooks} explicitView={explicitView} />;
}
