// Tipos do catálogo interno. O import do JSON é só de tipo (some no build).
import type source from "@/data/catalog.json";
import type { OfferTable } from "@/lib/project-search";
import type { CatalogPayload } from "@/lib/catalog-rules";

export type Project = Omit<(typeof source)[number], "geocoding" | "locationSource"> & {
  priceLabel?: string;
  locationStatus?: string;
  typologies?: string[];
  features?: string[];
  availableUnits?: string[];
  availabilityTableDate?: string | null;
  availabilityCheckedAt?: string | null;
  deliveryStatus?: string;
};

export type CatalogData = CatalogPayload<Project, OfferTable>;
