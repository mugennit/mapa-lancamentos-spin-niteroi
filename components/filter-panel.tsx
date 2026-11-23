"use client";
// Painel de filtros agrupado em Onde / O quê / Quanto / Quando, com contagem
// por opção. A regra de unidade continua em `lib/project-search`: preço,
// tipologia e vagas precisam corresponder à mesma unidade da tabela.
import { X } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { PRICE_PRESETS, digitsOnly, formatThousands, type FilterState, type ParkingFilter } from "@/lib/filter-state";

export type FacetCounter = (patch: Partial<FilterState>) => number;

type Options = {
  hoods: string[];
  companies: string[];
  typologies: string[];
  features: string[];
  deliveryYears: string[];
  stages: string[];
  locations: string[];
};

const PARKING_LABELS: Record<Exclude<ParkingFilter, "all">, string> = { "1": "Com vaga", "2": "2 ou mais vagas", none: "Sem vaga" };

function CountSelect({ id, label, value, values, onChange, count, display }: {
  id: string; label: string; value: string; values: string[]; onChange: (value: string) => void;
  count: (value: string) => number; display?: (value: string) => string;
}) {
  return <div className="fp-field">
    <label className="fp-label" id={`${id}-label`}>{label}</label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-labelledby={`${id}-label`} className="filter-trigger fp-trigger"><SelectValue /></SelectTrigger>
      <SelectContent style={{ zIndex: 2100 }}>
        <SelectItem value="all">Todos</SelectItem>
        {values.map((option) => {
          const n = count(option);
          return <SelectItem key={option} value={option} disabled={n === 0 && option !== value}>
            {(display ? display(option) : option)} ({n})
          </SelectItem>;
        })}
      </SelectContent>
    </Select>
  </div>;
}

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

export default function FilterPanel({ filters, update, count, options, parkingCoverage }: {
  filters: FilterState;
  update: (patch: Partial<FilterState>) => void;
  count: FacetCounter;
  options: Options;
  parkingCoverage: number;
}) {
  const parkingValue = filters.parking === "all" ? "all" : PARKING_LABELS[filters.parking];
  const toggleFeature = (feature: string) => update({
    features: filters.features.includes(feature) ? filters.features.filter((item) => item !== feature) : [...filters.features, feature],
  });
  const minNumber = Number(filters.minPrice || 0), maxNumber = Number(filters.maxPrice || 0);
  const invertedRange = filters.minPrice !== "" && filters.maxPrice !== "" && minNumber > maxNumber;

  return <div className="fp">
    <section className="fp-section" aria-labelledby="fp-onde">
      <h3 id="fp-onde">Onde</h3>
      <CountSelect id="fp-hood" label="Bairro" value={filters.hood} values={options.hoods} onChange={(hood) => update({ hood })} count={(hood) => count({ hood })} />
      <CountSelect id="fp-location" label="Localização" value={filters.location} values={options.locations} onChange={(location) => update({ location })} count={(location) => count({ location })} />
      {filters.area && <div className="fp-area">
        <span>Área selecionada no mapa</span>
        <button type="button" className="quiet-button" onClick={() => update({ area: null })}>Remover área</button>
      </div>}
    </section>

    <section className="fp-section" aria-labelledby="fp-oque">
      <h3 id="fp-oque">O quê</h3>
      <CountSelect id="fp-typology" label="Tipologia" value={filters.typology} values={options.typologies} onChange={(typology) => update({ typology })} count={(typology) => count({ typology })} />
      <CountSelect id="fp-parking" label="Vaga de garagem" value={parkingValue} values={Object.values(PARKING_LABELS)}
        onChange={(label) => update({ parking: (Object.entries(PARKING_LABELS).find(([, text]) => text === label)?.[0] as ParkingFilter) ?? "all" })}
        count={(label) => count({ parking: (Object.entries(PARKING_LABELS).find(([, text]) => text === label)?.[0] as ParkingFilter) ?? "all" })} />
      <small className="fp-hint">Vagas conferidas em {parkingCoverage} empreendimentos. Onde a tabela não confirma a informação, a opção fica fora deste filtro.</small>
      <CountSelect id="fp-company" label="Construtora" value={filters.company} values={options.companies} onChange={(company) => update({ company })} count={(company) => count({ company })} />
      <fieldset className="fp-features">
        <legend>Características do condomínio</legend>
        <div className="fp-chips">
          {options.features.map((feature) => {
            const checked = filters.features.includes(feature);
            const n = checked ? null : count({ features: [...filters.features, feature] });
            return <label key={feature} className={`fp-chip${checked ? " is-checked" : ""}${n === 0 ? " is-empty" : ""}`}>
              <input type="checkbox" checked={checked} disabled={n === 0} onChange={() => toggleFeature(feature)} />
              <span>{feature}{n !== null && <small> ({n})</small>}</span>
            </label>;
          })}
        </div>
        <small className="fp-hint">Ao marcar mais de uma, aparecem empreendimentos com todas as características escolhidas.</small>
      </fieldset>
    </section>

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

    <section className="fp-section" aria-labelledby="fp-quando">
      <h3 id="fp-quando">Quando</h3>
      <CountSelect id="fp-delivery-year" label="Prazo de entrega" value={filters.deliveryYear} values={options.deliveryYears} onChange={(deliveryYear) => update({ deliveryYear })} count={(deliveryYear) => count({ deliveryYear })} />
      <small className="fp-hint">“Até” inclui os prontos confirmados e as previsões até o fim do ano. Uma previsão vencida não comprova entrega.</small>
      <CountSelect id="fp-stage" label="Etapa confirmada" value={filters.delivery} values={options.stages} onChange={(delivery) => update({ delivery })} count={(delivery) => count({ delivery })} />
      <small className="fp-hint">Etapa confirmada nos materiais. Previsão de entrega não comprova a etapa atual.</small>
    </section>
  </div>;
}
