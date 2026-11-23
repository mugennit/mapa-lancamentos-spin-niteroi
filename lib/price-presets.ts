// Atalhos de faixa de preço (só na área interna; a versão pública não importa este arquivo).
/** Atalhos de faixa de preço. Apenas preenchem mínimo e máximo; não criam dados. */
export const PRICE_PRESETS = [
  { label: "Até R$ 500 mil", min: "", max: "500000" },
  { label: "R$ 500 mil a 800 mil", min: "500000", max: "800000" },
  { label: "R$ 800 mil a 1,2 mi", min: "800000", max: "1200000" },
  { label: "R$ 1,2 mi a 2 mi", min: "1200000", max: "2000000" },
  { label: "Acima de R$ 2 mi", min: "2000000", max: "" },
] as const;
