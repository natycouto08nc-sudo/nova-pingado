'use client';

import { useState } from 'react';
import { CheckCircle2, Lock, Truck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function formatCep(raw: string) {
  const digitos = raw.replace(/\D/g, '').slice(0, 8);
  if (digitos.length <= 5) return digitos;
  return `${digitos.slice(0, 5)}-${digitos.slice(5)}`;
}

export function cepValido(cep: string) {
  return cep.replace(/\D/g, '').length === 8;
}

interface ShippingCalculationProps {
  cep: string;
  onCepChange: (cep: string) => void;
  calculado: boolean;
  onCalcular: () => void;
}

export function ShippingCalculation({ cep, onCepChange, calculado, onCalcular }: ShippingCalculationProps) {
  const [calculando, setCalculando] = useState(false);
  const [editando, setEditando] = useState(false);
  const cepOk = cepValido(cep);
  const mostrarFormulario = !calculado || editando;

  function handleCalcular() {
    if (!cepOk) return;
    setCalculando(true);
    window.setTimeout(() => {
      setCalculando(false);
      setEditando(false);
      onCalcular();
    }, 500);
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="flex items-center gap-2 font-serif text-lg text-foreground">
        <Truck size={18} className="text-primary" />
        Frete
      </h2>

      {mostrarFormulario ? (
        <div className="mt-5 flex items-end gap-2">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="cep-frete">CEP</Label>
            <Input
              id="cep-frete"
              inputMode="numeric"
              placeholder="00000-000"
              value={cep}
              onChange={(e) => onCepChange(formatCep(e.target.value))}
              maxLength={9}
            />
          </div>
          <Button type="button" variant="outline" disabled={!cepOk || calculando} onClick={handleCalcular}>
            {calculando ? 'Calculando...' : 'Calcular'}
          </Button>
        </div>
      ) : (
        <div className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3">
          <div className="space-y-1">
            <p className="flex items-center gap-2 text-sm font-medium text-secondary">
              <CheckCircle2 size={16} />
              Frete grátis para o seu CEP
            </p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock size={11} />
              CEP {cep}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditando(true)}
            className="shrink-0 text-xs font-semibold text-primary underline underline-offset-4 hover:text-primary/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Alterar CEP
          </button>
        </div>
      )}
    </div>
  );
}
