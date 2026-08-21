import type { Cafe } from '@/lib/types';

interface CoffeeSpecsProps {
  cafe: Cafe;
}

function getSpecs(cafe: Cafe) {
  return [
    { label: 'Origem', value: cafe.origem ?? '' },
    { label: 'Região', value: cafe.regiao ?? '' },
    { label: 'Fazenda', value: cafe.fazenda ?? '' },
    { label: 'Produtor', value: cafe.produtores?.nome ?? '' },
    { label: 'Variedade', value: cafe.variedade ?? '' },
    { label: 'Processo', value: cafe.processo ?? '' },
    { label: 'Torra', value: cafe.torra ?? '' },
    { label: 'Altitude', value: cafe.altitude ?? '' },
    { label: 'Pontuação SCA', value: cafe.score_sca ? String(cafe.score_sca) : '' },
    { label: 'Safra', value: cafe.safra ?? '' },
  ].filter((spec) => spec.value);
}

export function hasCoffeeSpecs(cafe: Cafe): boolean {
  return getSpecs(cafe).length > 0;
}

/** Ficha técnica em formato de lista tipográfica, sem linhas de tabela — pensada para viver dentro de "Sobre este café". */
export function CoffeeSpecs({ cafe }: CoffeeSpecsProps) {
  const specs = getSpecs(cafe);

  if (specs.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-6 rounded-2xl border border-border bg-card p-6 sm:grid-cols-3 sm:p-8">
      {specs.map((spec) => (
        <div key={spec.label}>
          <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            {spec.label}
          </dt>
          <dd className="mt-1.5 font-serif text-lg text-foreground">{spec.value}</dd>
        </div>
      ))}
    </dl>
  );
}
