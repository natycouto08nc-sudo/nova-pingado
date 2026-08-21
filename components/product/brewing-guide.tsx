import type { Cafe } from '@/lib/types';
import { cn } from '@/lib/utils';

interface BrewingGuideProps {
  cafe: Cafe;
  className?: string;
}

export function hasBrewingGuide(cafe: Cafe): boolean {
  return Boolean(cafe.preparos && cafe.preparos.length > 0);
}

/** Cards de receita, pensados para viver dentro da seção "Sobre este café". */
export function BrewingGuide({ cafe, className }: BrewingGuideProps) {
  if (!cafe.preparos || cafe.preparos.length === 0) return null;

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {cafe.preparos.map((preparo) => (
        <div
          key={preparo.metodo}
          className="flex flex-1 flex-col rounded-2xl border border-border bg-card p-6 sm:p-8"
        >
          <h4 className="font-serif text-lg text-foreground">{preparo.metodo}</h4>
          <dl className="mt-5 flex flex-1 flex-col justify-between gap-3">
            {[
              ['Café', preparo.cafe],
              ['Água', preparo.agua],
              ['Temperatura', preparo.temperatura],
              ['Moagem', preparo.moagem],
              ['Extração', preparo.tempo],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {label}
                </dt>
                <dd className="font-serif text-base text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
