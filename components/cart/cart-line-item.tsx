'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';

import type { CarrinhoItem } from '@/lib/types';
import { useCart } from '@/context/cart-context';

function formatPreco(valor: number) {
  return valor.toFixed(2).replace('.', ',');
}

interface CartLineItemProps {
  item: CarrinhoItem;
}

export function CartLineItem({ item }: CartLineItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const subtotalLinha = item.precoUnitario * item.quantidade;

  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5">
      <Link
        href={`/loja/${item.slug}`}
        className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:size-28"
      >
        <Image
          src={item.imagem || '/placeholder.jpg'}
          alt={item.nome}
          fill
          className="object-cover"
          sizes="112px"
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <Link
              href={`/loja/${item.slug}`}
              className="font-serif text-base text-foreground hover:text-primary focus-visible:text-primary"
            >
              {item.nome}
            </Link>
            <div className="flex flex-wrap gap-1.5">
              {item.varianteLabel && (
                <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground">
                  {item.varianteLabel}
                </span>
              )}
              {item.moagem && (
                <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground">
                  {item.moagem}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => removeItem(item.id)}
            aria-label={`Remover ${item.nome} do carrinho`}
            className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="flex items-center gap-2" role="group" aria-label={`Quantidade de ${item.nome}`}>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantidade - 1)}
              disabled={item.quantidade <= 1}
              aria-label="Diminuir quantidade"
              className="flex size-7 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Minus size={12} />
            </button>
            <span className="w-5 text-center text-sm font-semibold" aria-live="polite">
              {item.quantidade}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantidade + 1)}
              disabled={item.estoqueMaximo != null && item.quantidade >= item.estoqueMaximo}
              aria-label="Aumentar quantidade"
              className="flex size-7 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Plus size={12} />
            </button>
          </div>

          <div className="text-right">
            <p className="font-serif text-base font-bold text-foreground">R$ {formatPreco(subtotalLinha)}</p>
            {item.quantidade > 1 && (
              <p className="text-[11px] text-muted-foreground">R$ {formatPreco(item.precoUnitario)} cada</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
