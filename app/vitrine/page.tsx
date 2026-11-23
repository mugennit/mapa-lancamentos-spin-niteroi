// Versão pública (vitrine): sem senha. Os dados são filtrados AQUI, no servidor,
// por lista de campos permitidos (lib/public-catalog.ts). Preços, tabelas,
// unidades e informações internas nunca chegam ao navegador do cliente.
import catalog from "@/data/catalog.json";
import attributes from "@/data/attributes.json";
import materials from "@/data/materials.json";
import unitOffers from "@/data/unit-offers.json";
import audit from "@/data/materials-audit.json";
import type { Metadata } from "next";
import PublicCatalogApp from "@/components/public-catalog";
import { buildPublicCatalog, isBookReleasable } from "@/lib/public-catalog";
import { isMapEligible } from "@/lib/catalog-rules";
import { verifyBrokerToken, normalizeWhatsApp, normalizeBrokerName } from "@/lib/broker-link";
import { PUBLIC_BOOK_BLOCKLIST } from "@/lib/public-book-blocklist";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lançamentos em Niterói | SPIN",
  description: "Lançamentos imobiliários em Niterói: mapa, books e atendimento com corretor SPIN.",
  robots: { index: false, follow: false },
};

type Offers = Record<string, { tableUrl?: string; offers: { typology?: string }[] }>;
type Raw = Record<string, unknown> & { id: string; lat: number | null; lng: number | null; tables?: { url: string }[]; book?: { url: string; name?: string } | null };

export default async function VitrinePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const token = typeof params.c === "string" ? params.c : null;
  const broker = await verifyBrokerToken(token, process.env.SITE_SESSION_SECRET);

  // Contato central: só aparece se estiver configurado (nunca um número presumido).
  const centralPhone = normalizeWhatsApp(process.env.PUBLIC_CONTACT_WHATSAPP || "");
  const centralName = normalizeBrokerName(process.env.PUBLIC_CONTACT_NAME || "") || "SPIN";
  const contact = broker
    ? { name: broker.name, phone: broker.phone, isBroker: true }
    : centralPhone ? { name: centralName, phone: centralPhone, isBroker: false } : null;

  const offers = unitOffers as unknown as Offers;
  const projects = catalog as unknown as Raw[];
  const materialList = materials as { url: string; type?: string; name?: string }[];
  const materialUrls = new Set(materialList.map((item) => item.url));
  const tableUrls = new Set([
    ...projects.flatMap((p) => (p.tables || []).map((t) => t.url)),
    ...Object.values(offers).map((t) => t.tableUrl).filter((url): url is string => Boolean(url)),
  ]);
  const blocked = new Set(PUBLIC_BOOK_BLOCKLIST);

  const data = buildPublicCatalog({
    catalog: projects,
    attributes: attributes as Record<string, Record<string, unknown>>,
    mapIds: new Set(projects.filter((p) => isMapEligible(p, materialUrls)).map((p) => p.id)),
    releasedBookIds: new Set(projects.filter((p) => isBookReleasable(p, materialList, tableUrls, blocked, p.id)).map((p) => p.id)),
    offerTypologies: Object.fromEntries(Object.entries(offers).map(([id, table]) => [id, table.offers.map((o) => o.typology).filter((t): t is string => Boolean(t))])),
    checkedAt: (audit as { checkedAt?: string }).checkedAt ?? null,
  });

  return <PublicCatalogApp data={data} contact={contact} brokerToken={broker ? token : null} />;
}
