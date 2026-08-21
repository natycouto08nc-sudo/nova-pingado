'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';

import type { CarrinhoItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validarCupomAsync } from '@/lib/coupons';
import { useCart } from '@/context/cart-context';

function formatPreco(valor: number) {
  return valor.toFixed(2).replace('.', ',');
}

interface OrderSummaryProps {
  items: CarrinhoItem[];
  subtotal: number;
  ctaLabel: string;
  onCta: () => void;
  ctaDisabled?: boolean;
  freteGratis?: boolean;
  footer?: ReactNode;
  onTotalChange?: (total: number) => void;
}

export function OrderSummary({
  items,
  subtotal,
  ctaLabel,
  onCta,
  ctaDisabled = false,
  freteGratis = false,
  footer,
  onTotalChange,
}: OrderSummaryProps) {
  const totalUnidades = items.reduce((total, item) => total + item.quantidade, 0);

  const { cupom: cupomAplicado, setCupom } = useCart();
  const [cupomInput, setCupomInput] = useState('');
  const [validando, setValidando] = useState(false);
  const [erroCupom, setErroCupom] = useState<string | null>(null);

  async function handleAplicarCupom() {
    if (!cupomInput.trim()) return;
    setValidando(true);
    setErroCupom(null);
    const resultado = await validarCupomAsync(cupomInput);
    setValidando(false);

    if (resultado.valido && resultado.cupom) {
      setCupom(resultado.cupom);
      setCupomInput('');
    } else {
      setCupom(null);
      setErroCupom('Cupom não encontrado.');
    }
  }

  function handleRemoverCupom() {
    setCupom(null);
    setErroCupom(null);
  }

  const desconto = cupomAplicado ? (subtotal * cupomAplicado.percentualDesconto) / 100 : 0;
  const total = subtotal - desconto;

  useEffect(() => {
    onTotalChange?.(total);
  }, [total, onTotalChange]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-serif text-lg text-foreground">Resumo do pedido</h2>

        <dl className="mt-5 space-y-2.5 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">
              Subtotal ({totalUnidades} {totalUnidades === 1 ? 'item' : 'itens'})
            </dt>
            <dd className="font-medium text-foreground">R$ {formatPreco(subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Frete</dt>
            <dd className={freteGratis ? 'font-medium text-secondary' : 'text-muted-foreground'}>
              {freteGratis ? 'Grátis' : 'Calculado a seguir'}
            </dd>
          </div>
          {cupomAplicado && (
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Desconto ({cupomAplicado.codigo})</dt>
              <dd className="font-medium text-secondary">- R$ {formatPreco(desconto)}</dd>
            </div>
          )}
        </dl>

        <div className="mt-4 space-y-2 border-t border-border/70 pt-4">
          <Label htmlFor="cupom" className="text-xs font-bold uppercase tracking-wider text-foreground">
            Cupom de desconto
          </Label>

          {cupomAplicado ? (
            <div className="flex items-center justify-between rounded-lg border border-secondary/30 bg-secondary/10 px-3 py-2">
              <span className="text-sm font-medium text-secondary">
                {cupomAplicado.codigo} aplicado (-{cupomAplicado.percentualDesconto}%)
              </span>
              <button
                type="button"
                onClick={handleRemoverCupom}
                aria-label="Remover cupom"
                className="rounded-md p-1 text-secondary transition-colors hover:bg-secondary/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                id="cupom"
                placeholder="Ex: PINGADO15"
                value={cupomInput}
                onChange={(e) => {
                  setCupomInput(e.target.value.toUpperCase());
                  if (erroCupom) setErroCupom(null);
                }}
              />
              <Button
                type="button"
                variant="outline"
                disabled={!cupomInput.trim() || validando}
                onClick={handleAplicarCupom}
              >
                {validando ? 'Validando...' : 'Aplicar'}
              </Button>
            </div>
          )}

          {erroCupom && <p className="text-xs font-medium text-destructive">{erroCupom}</p>}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-4">
          <span className="font-serif text-base text-foreground">Total</span>
          <span className="font-serif text-2xl font-bold text-primary">R$ {formatPreco(total)}</span>
        </div>

        <Button
          type="button"
          size="lg"
          disabled={ctaDisabled}
          onClick={onCta}
          className="mt-5 w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          {ctaLabel}
        </Button>

        {footer}
      </div>
    </div>
  );
}
