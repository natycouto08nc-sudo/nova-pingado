'use client';

import { useState, type FormEvent } from 'react';
import { Truck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Status = 'idle' | 'loading' | 'unavailable';

/**
 * Sem integração de logística ainda: o handler só simula o estado de
 * carregamento e informa que o cálculo real chega em uma próxima etapa.
 */
function calcularFrete(_cep: string): Promise<never> {
  return new Promise((_, reject) => {
    window.setTimeout(() => reject(new Error('unavailable')), 600);
  });
}

export function ShippingCalculator() {
  const [cep, setCep] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (cep.trim().length < 8) return;
    setStatus('loading');
    try {
      await calcularFrete(cep);
    } catch {
      setStatus('unavailable');
    }
  }

  return (
    <div className="space-y-2 rounded-xl border border-border bg-card p-4">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
        <Truck size={14} className="text-primary" /> Calcule o frete
      </p>
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1 space-y-1">
          <Label htmlFor="cep" className="sr-only">
            CEP
          </Label>
          <Input
            id="cep"
            name="cep"
            inputMode="numeric"
            placeholder="Digite seu CEP"
            value={cep}
            onChange={(event) => setCep(event.target.value)}
            maxLength={9}
          />
        </div>
        <Button type="submit" variant="outline" disabled={status === 'loading'}>
          Calcular
        </Button>
      </form>
      {status === 'unavailable' && (
        <p className="text-xs text-muted-foreground">
          Cálculo de frete disponível em breve. Nossa equipe pode te ajudar antes disso.
        </p>
      )}
      <a
        href="https://buscacepinter.correios.com.br/app/endereco/index.php"
        target="_blank"
        rel="noreferrer"
        className="inline-block text-xs text-muted-foreground underline underline-offset-4 hover:text-primary"
      >
        Não sei meu CEP
      </a>
    </div>
  );
}
