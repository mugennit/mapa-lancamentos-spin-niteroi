// Regras de elegibilidade do catálogo. Funções puras, sem dependências, para
// poderem ser testadas diretamente com `node --test`.
//
// - Lista geral: todos os empreendimentos do catálogo, sem exceção.
// - Mapa: somente quem tem book E tabela presentes no inventário de materiais
//   E endereço com revisão "Conferido" E coordenadas numéricas cadastradas.

export type EligibilityProject = {
  id: string;
  book?: { url?: string | null } | null;
  tables?: { url?: string | null }[] | null;
  addressReviewStatus?: string | null;
  lat?: number | null;
  lng?: number | null;
};

const isCoordinate = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export function hasValidatedBook(project: EligibilityProject, materialUrls: Set<string>): boolean {
  const url = project.book?.url;
  return Boolean(url && materialUrls.has(url));
}

export function hasValidatedTable(project: EligibilityProject, materialUrls: Set<string>): boolean {
  return Boolean(project.tables?.some((table) => Boolean(table.url && materialUrls.has(table.url))));
}

export function hasValidatedLocation(project: EligibilityProject): boolean {
  return project.addressReviewStatus === "Conferido" && isCoordinate(project.lat) && isCoordinate(project.lng);
}

/** Book e tabela localizados no inventário de materiais. */
export function hasBookAndTable(project: EligibilityProject, materialUrls: Set<string>): boolean {
  return hasValidatedBook(project, materialUrls) && hasValidatedTable(project, materialUrls);
}

/** Pode aparecer no mapa: book, tabela e coordenadas exatas validadas. */
export function isMapEligible(project: EligibilityProject, materialUrls: Set<string>): boolean {
  return hasBookAndTable(project, materialUrls) && hasValidatedLocation(project);
}

/** Motivos pelos quais um empreendimento não aparece no mapa (vazio = elegível). */
export function pendingIssues(project: EligibilityProject, materialUrls: Set<string>): string[] {
  const issues: string[] = [];
  if (!hasValidatedBook(project, materialUrls)) issues.push("Book pendente");
  if (!hasValidatedTable(project, materialUrls)) issues.push("Tabela pendente");
  if (!hasValidatedLocation(project)) issues.push("Coordenadas ou endereço a confirmar");
  return issues;
}
