"use client";
// Seção "Quanto" do painel de filtros (faixa de preço). Usada só na área
// interna: fica separada para que a versão pública não carregue nada de preço.
import { X } from "lucide-react";
import { digitsOnly, formatThousands, type FilterState } from "@/lib/filter-state";
import { PRICE_PRESETS } from "@/lib/price-presets";
import type { FacetCounter } from "@/components/filter-panel";

function PriceInput({ label, value, placeholder, onChange }: { label: string; value: string; placeholder: string; onChange: (digits: string) => void }) {
  return <label className="fp-price">
    <span>{label}</span>
    <span className="fp-price-wrap">
      <span aria-hidden="true">R$</span>
      <input inputMode="numeric" autoComplete="off" aria-label={`Preço ${label.toLowerCase()} em reais`} placeholder={placeholder}
        value={formatThousands(value)} onChange={(event) => onChange(digitsOnly(event.target.value))} />
      {value && <button type="button" className="fp-price-clear" aria-label={`Limpar preço ${label.toLowerCase()}`} onClick={() => onChange("")}><X size={14} /></button>}
    </span>
  </label>;
}

export default function PriceSection({ filters, update, count }: { filters: FilterState; update: (patch: Partial<FilterState>) => void; count: FacetCounter }) {
  const minNumber = Number(filters.minPrice || 0), maxNumber = Number(filters.maxPrice || 0);
  const invertedRange = filters.minPrice !== "" && filters.maxPrice !== "" && minNumber > maxNumber;
  return (
    <section className="fp-section" aria-labelledby="fp-quanto">
      <h3 id="fp-quanto">Quanto</h3>
      <p className="fp-sub">Faixa de preço total do imóvel</p>
      <div className="fp-presets" role="group" aria-label="Atalhos de faixa de preço">
        {PRICE_PRESETS.map((preset) => {
          const active = filters.minPrice === preset.min && filters.maxPrice === preset.max;
          return <button type="button" key={preset.label} className={`fp-preset${active ? " is-active" : ""}`} aria-pressed={active}
            onClick={() => update(active ? { minPrice: "", maxPrice: "" } : { minPrice: preset.min, maxPrice: preset.max })}>
            {preset.label} <small>({count({ minPrice: preset.min, maxPrice: preset.max })})</small>
          </button>;
        })}
      </div>
      <div className="fp-price-row">
        <PriceInput label="Mínimo" value={filters.minPrice} placeholder="Sem mínimo" onChange={(minPrice) => update({ minPrice })} />
        <PriceInput label="Máximo" value={filters.maxPrice} placeholder="Sem máximo" onChange={(maxPrice) => update({ maxPrice })} />
      </div>
      {invertedRange && <small className="fp-warning" role="alert">O mínimo está acima do máximo. Ajuste a faixa.</small>}
      <small className="fp-hint">{filters.typology === "all" && filters.parking === "all"
        ? "Valores totais do imóvel, não de entrada. Sem tipologia, usa o preço inicial do empreendimento. Aluguéis não entram."
        : "Com tipologia ou vaga, só entram unidades em que preço, tipologia e vagas estão comprovados na mesma linha da tabela."}</small>
    </section>
  );
}
