import { cn } from '@/lib/utils';

const ITEMS = [
  { label: 'Armazenamento', value: 'Local seco e arejado' },
  { label: 'Proteção', value: 'Longe de luz e calor' },
  { label: 'Após aberto', value: 'Consumir em até 30 dias' },
];

interface ConservationCardProps {
  className?: string;
}

/** Mesmo formato visual dos cards de preparo, para viver lado a lado com "Como recomendamos preparar". */
export function ConservationCard({ className }: ConservationCardProps) {
  return (
    <div
      className={cn(
        'flex flex-1 flex-col rounded-2xl border border-border bg-card p-6 sm:p-8',
        className,
      )}
    >
      <h4 className="font-serif text-lg text-foreground">Conservação</h4>
      <dl className="mt-5 flex flex-1 flex-col justify-between gap-3">
        {ITEMS.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-4">
            <dt className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              {item.label}
            </dt>
            <dd className="font-serif text-base text-foreground">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
