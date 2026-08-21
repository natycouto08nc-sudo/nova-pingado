'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Lock, PackageCheck, ShieldCheck, Truck, Minus, Plus } from 'lucide-react';

import type { Cafe } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getFormatoLabel } from '@/lib/products';
import { useCart } from '@/context/cart-context';

function formatPreco(valor: number) {
  return valor.toFixed(2).replace('.', ',');
}

interface ProductPurchasePanelProps {
  cafe: Cafe;
}

export function ProductPurchasePanel({ cafe }: ProductPurchasePanelProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const variantes = cafe.variantes ?? [];
  const primeiraDisponivel = variantes.find((v) => v.disponivel) ?? variantes[0];

  const [varianteId, setVarianteId] = useState(primeiraDisponivel?.id);
  const [moagem, setMoagem] = useState(cafe.moagem_opcoes?.[0] ?? 'Em grãos');
  const [quantidade, setQuantidade] = useState(1);
  const [adicionado, setAdicionado] = useState(false);

  const varianteSelecionada = variantes.find((v) => v.id === varianteId) ?? primeiraDisponivel;
  const precoUnitario = varianteSelecionada?.preco ?? cafe.preco ?? 0;
  const precoOriginalUnitario = cafe.preco_original ?? null;
  const precoTotal = precoUnitario * quantidade;
  const precoOriginalTotal = precoOriginalUnitario ? precoOriginalUnitario * quantidade : null;
  const desconto =
    precoOriginalUnitario && precoOriginalUnitario > precoUnitario
      ? Math.round(((precoOriginalUnitario - precoUnitario) / precoOriginalUnitario) * 100)
      : null;

  const semEstoque = cafe.estoque === 0;
  const poucasUnidades = typeof cafe.estoque === 'number' && cafe.estoque > 0 && cafe.estoque <= 5;
  const estoqueMaximo = typeof cafe.estoque === 'number' ? cafe.estoque : undefined;

  const parcelamento = useMemo(() => {
    if (precoTotal < 10) return null;
    return { vezes: 3, valor: precoTotal / 3 };
  }, [precoTotal]);

  function handleAddToCart() {
    if (semEstoque) return;
    addItem({
      cafeId: cafe.id,
      slug: cafe.slug,
      nome: cafe.nome,
      imagem: cafe.imagem_url,
      varianteId: varianteSelecionada?.id,
      varianteLabel: varianteSelecionada?.peso,
      moagem: cafe.moagem_opcoes?.length ? moagem : undefined,
      precoUnitario,
      quantidade,
      estoqueMaximo: cafe.estoque,
    });
    setAdicionado(true);
    window.setTimeout(() => setAdicionado(false), 2000);
  }

  function handleBuyNow() {
    if (semEstoque) return;
    handleAddToCart();
    router.push('/checkout');
  }

  function decrementar() {
    setQuantidade((q) => Math.max(1, q - 1));
  }

  function incrementar() {
    setQuantidade((q) => (estoqueMaximo ? Math.min(estoqueMaximo, q + 1) : q + 1));
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="kicker text-primary">
          Cafés Especiais · {getFormatoLabel(cafe)}
        </p>
        <h1 className="font-serif text-3xl leading-tight text-foreground md:text-4xl">{cafe.nome}</h1>
        {cafe.descricao && (
          <p className="text-sm leading-relaxed text-muted-foreground">{cafe.descricao}</p>
        )}
      </div>

      <div className="flex items-baseline gap-3">
        {precoOriginalTotal && precoOriginalTotal > precoTotal && (
          <span className="text-sm text-muted-foreground line-through">
            R$ {formatPreco(precoOriginalTotal)}
          </span>
        )}
        <span className="font-serif text-3xl font-bold text-primary">R$ {formatPreco(precoTotal)}</span>
        {desconto && (
          <span className="rounded-full bg-gold text-gold-foreground text-[10px] font-bold px-2.5 py-0.5">
            -{desconto}%
          </span>
        )}
      </div>
      {parcelamento && (
        <p className="-mt-3 text-xs text-muted-foreground">
          ou {parcelamento.vezes}x de R$ {formatPreco(parcelamento.valor)} sem juros
        </p>
      )}
      {quantidade > 1 && (
        <p className="-mt-3 text-xs text-muted-foreground">
          R$ {formatPreco(precoUnitario)} cada, {quantidade} unidades
        </p>
      )}

      {variantes.length > 0 && (
        <fieldset className="space-y-2">
          <legend className="text-xs font-bold uppercase tracking-wider text-foreground">Tamanho</legend>
          <div className="flex flex-wrap gap-2">
            {variantes.map((variante) => (
              <button
                key={variante.id}
                type="button"
                disabled={!variante.disponivel}
                aria-pressed={varianteId === variante.id}
                onClick={() => setVarianteId(variante.id)}
                className={cn(
                  'rounded-lg border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-40',
                  varianteId === variante.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-foreground hover:border-primary/50',
                )}
              >
                {variante.peso}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {cafe.moagem_opcoes && cafe.moagem_opcoes.length > 0 && (
        <fieldset className="space-y-2">
          <legend className="text-xs font-bold uppercase tracking-wider text-foreground">
            Como você quer receber seu café?
          </legend>
          <div className="flex flex-wrap gap-2">
            {cafe.moagem_opcoes.map((opcao) => (
              <button
                key={opcao}
                type="button"
                aria-pressed={moagem === opcao}
                onClick={() => setMoagem(opcao)}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                  moagem === opcao
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-foreground hover:border-primary/50',
                )}
              >
                {opcao}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="space-y-2">
        <span id="quantidade-label" className="text-xs font-bold uppercase tracking-wider text-foreground">
          Quantidade
        </span>
        <div className="flex items-center gap-3" role="group" aria-labelledby="quantidade-label">
          <button
            type="button"
            onClick={decrementar}
            disabled={quantidade <= 1}
            aria-label="Diminuir quantidade"
            className="flex size-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Minus size={14} />
          </button>
          <span className="w-6 text-center text-sm font-semibold" aria-live="polite">
            {quantidade}
          </span>
          <button
            type="button"
            onClick={incrementar}
            disabled={estoqueMaximo !== undefined && quantidade >= estoqueMaximo}
            aria-label="Aumentar quantidade"
            className="flex size-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {semEstoque && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
          Produto indisponível
        </p>
      )}
      {!semEstoque && poucasUnidades && (
        <p className="text-xs font-medium text-primary">Últimas unidades</p>
      )}

      <div className="space-y-2">
        <Button
          type="button"
          size="lg"
          disabled={semEstoque}
          onClick={handleAddToCart}
          className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          {adicionado ? (
            <>
              <Check size={16} /> Produto adicionado ao carrinho
            </>
          ) : (
            'Adicionar ao carrinho'
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={semEstoque}
          onClick={handleBuyNow}
          className="w-full"
        >
          Comprar agora
        </Button>
      </div>

      <ul className="grid grid-cols-2 gap-3 border-t border-border/70 pt-5 text-xs text-muted-foreground">
        <li className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-primary shrink-0" /> Compra segura
        </li>
        <li className="flex items-center gap-2">
          <Lock size={16} className="text-primary shrink-0" /> Pagamento protegido
        </li>
        <li className="flex items-center gap-2">
          <Truck size={16} className="text-primary shrink-0" /> Envio para todo o Brasil
        </li>
        <li className="flex items-center gap-2">
          <PackageCheck size={16} className="text-primary shrink-0" /> Torrado recentemente
        </li>
      </ul>

      {/* Barra de compra fixa no mobile, sincronizada com o mesmo estado do painel. */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-border bg-card px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] lg:hidden">
        <span className="font-serif text-lg font-bold text-foreground">R$ {formatPreco(precoTotal)}</span>
        <Button
          type="button"
          disabled={semEstoque}
          onClick={handleAddToCart}
          className="flex-1 max-w-[220px] bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          {adicionado ? 'Adicionado' : 'Adicionar ao carrinho'}
        </Button>
      </div>
    </div>
  );
}
