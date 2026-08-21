import type { Cafe } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SensoryProfileProps {
  cafe: Cafe;
  className?: string;
}

const MAX_SCALE = 5;

function ScaleRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-foreground">{label}</span>
      <div className="flex gap-1.5" role="img" aria-label={`${label}: ${value} de ${MAX_SCALE}`}>
        {Array.from({ length: MAX_SCALE }).map((_, index) => (
          <span
            key={index}
            aria-hidden="true"
            className={`size-2.5 rounded-full ${index < value ? 'bg-primary' : 'bg-muted'}`}
          />
        ))}
      </div>
    </div>
  );
}

export function SensoryProfile({ cafe, className }: SensoryProfileProps) {
  const escalasBrutas: { label: string; value: number | null }[] = [
    { label: 'Doçura', value: cafe.docura },
    { label: 'Acidez', value: cafe.acidez },
    { label: 'Corpo', value: cafe.corpo },
    { label: 'Intensidade', value: cafe.intensidade },
  ];
  const escalas = escalasBrutas.filter(
    (escala): escala is { label: string; value: number } => escala.value != null,
  );

  const temNotas = cafe.notas_sensoriais && cafe.notas_sensoriais.length > 0;

  if (!temNotas && escalas.length === 0) return null;

  return (
    <section
      aria-labelledby="sensory-profile-heading"
      className={cn('space-y-5 rounded-2xl border border-border bg-card p-6', className)}
    >
      <h2 id="sensory-profile-heading" className="font-serif text-lg text-foreground">
        Perfil sensorial
      </h2>

      {temNotas && (
        <div className="flex flex-wrap gap-2">
          {cafe.notas_sensoriais!.map((nota) => (
            <Badge key={nota} variant="outline" className="h-auto px-3 py-1.5 text-xs">
              {nota}
            </Badge>
          ))}
        </div>
      )}

      {escalas.length > 0 && (
        <div className={temNotas ? 'space-y-3 border-t border-border/70 pt-5' : 'space-y-3'}>
          {escalas.map((escala) => (
            <ScaleRow key={escala.label} label={escala.label} value={escala.value} />
          ))}
        </div>
      )}
    </section>
  );
}
