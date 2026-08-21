'use client';

import { useState, type MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Check } from 'lucide-react';

import type { Cafe } from '@/lib/types';
import { useCart } from '@/context/cart-context';

interface ProductCardProps {
  cafe: Cafe;
  isWishlisted?: boolean;
  onToggleWishlist?: (id: string) => void;
}

export function ProductCard({ cafe, isWishlisted = false, onToggleWishlist }: ProductCardProps) {
  const { addItem } = useCart();
  const [adicionado, setAdicionado] = useState(false);
  const indisponivel = cafe.estoque === 0;

  function handleQuickAdd(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (indisponivel) return;

    const variantePadrao = cafe.variantes?.find((v) => v.disponivel) ?? cafe.variantes?.[0];

    addItem({
      cafeId: cafe.id,
      slug: cafe.slug,
      nome: cafe.nome,
      imagem: cafe.imagem_url,
      varianteId: variantePadrao?.id,
      varianteLabel: variantePadrao?.peso,
      moagem: cafe.moagem_opcoes?.[0],
      precoUnitario: variantePadrao?.preco ?? cafe.preco ?? 0,
      quantidade: 1,
      estoqueMaximo: cafe.estoque,
    });

    setAdicionado(true);
    window.setTimeout(() => setAdicionado(false), 2000);
  }

  return (
    <Link
      href={`/loja/${cafe.slug}`}
      className="group bg-card text-card-foreground rounded-2xl overflow-hidden shadow-sm border border-border/70 flex flex-col justify-between h-full hover:shadow-md transition-shadow relative focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="relative aspect-[4/3] bg-muted/20">
        <Image
          src={cafe.imagem_url || '/placeholder.jpg'}
          alt={cafe.nome}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, 50vw"
        />

        {onToggleWishlist && (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onToggleWishlist(cafe.id);
            }}
            aria-label={isWishlisted ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            aria-pressed={isWishlisted}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-primary shadow-sm hover:scale-105 transition-transform"
          >
            <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        )}

        {cafe.badge && (
          <div className="absolute top-3 left-3 bg-gold text-gold-foreground text-[10px] px-2.5 py-0.5 rounded-full font-semibold">
            {cafe.badge}
          </div>
        )}

        {cafe.score_sca && (
          <div className="absolute bottom-3 left-3 bg-secondary text-secondary-foreground text-[10px] px-2.5 py-0.5 rounded-full font-semibold">
            SCA {cafe.score_sca}
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
              {cafe.produtores?.nome} • {cafe.regiao}
            </p>
            <h3 className="font-serif text-base font-bold text-foreground truncate mt-0.5">
              {cafe.nome}
            </h3>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {cafe.descricao}
          </p>

          {cafe.notas_sensoriais && (
            <div className="flex flex-wrap gap-1">
              {cafe.notas_sensoriais.slice(0, 2).map((nota) => (
                <span
                  key={nota}
                  className="text-[9px] bg-muted border border-border text-foreground px-2 py-0.5 rounded-full font-medium"
                >
                  {nota}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-4">
          <p className="font-serif text-base font-bold text-foreground">
            R$ {cafe.preco?.toFixed(2).replace('.', ',')}
            {cafe.variantes?.[0] && (
              <span className="text-[9px] text-muted-foreground font-normal ml-0.5">
                / {cafe.variantes[0].peso}
              </span>
            )}
          </p>

          <button
            type="button"
            disabled={indisponivel}
            onClick={handleQuickAdd}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 disabled:opacity-50 disabled:pointer-events-none ${
              adicionado ? 'bg-green-600 text-white' : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm'
            }`}
          >
            {adicionado ? (
              <>
                <Check size={12} />
                Adicionado
              </>
            ) : (
              <>
                <ShoppingCart size={12} />
                {indisponivel ? 'Indisponível' : 'Comprar'}
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
