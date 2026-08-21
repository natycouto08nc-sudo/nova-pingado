import { Barcode, CreditCard, QrCode } from 'lucide-react';

import { cn } from '@/lib/utils';

export type FormaPagamento = 'pix' | 'cartao' | 'boleto';

const OPCOES: { value: FormaPagamento; label: string; description: string; icon: typeof QrCode }[] = [
  { value: 'pix', label: 'Pix', description: 'Aprovação imediata', icon: QrCode },
  { value: 'cartao', label: 'Cartão de crédito', description: 'Em até 3x sem juros', icon: CreditCard },
  { value: 'boleto', label: 'Boleto', description: 'Compensação em 1 a 2 dias úteis', icon: Barcode },
];

export const PAGAMENTO_LABELS: Record<FormaPagamento, string> = {
  pix: 'Pix',
  cartao: 'Cartão de crédito',
  boleto: 'Boleto',
};

interface PaymentMethodSelectorProps {
  value: FormaPagamento | null;
  onChange: (value: FormaPagamento) => void;
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="font-serif text-lg text-foreground">Forma de pagamento</h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Forma de pagamento">
        {OPCOES.map((opcao) => {
          const Icon = opcao.icon;
          const selecionado = value === opcao.value;
          return (
            <button
              key={opcao.value}
              type="button"
              role="radio"
              aria-checked={selecionado}
              onClick={() => onChange(opcao.value)}
              className={cn(
                'flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                selecionado
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-background hover:border-primary/50',
              )}
            >
              <Icon size={20} className={selecionado ? 'text-primary' : 'text-muted-foreground'} />
              <span className="text-sm font-semibold text-foreground">{opcao.label}</span>
              <span className="text-xs text-muted-foreground">{opcao.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
