'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MOCK_CAFES } from '@/lib/coffees';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ProductCard } from '@/components/product/product-card';
import { useCart } from '@/context/cart-context';
import { ShoppingCart } from 'lucide-react';

export default function LojaPage() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { itemCount } = useCart();

  const toggleWishlist = (id: string) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#f5ede3] text-[#2f3b2a] flex flex-col font-sans">
      <SiteHeader />

      <main className="flex-1 py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* Header da Loja */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h1 className="font-serif text-4xl md:text-5xl font-normal text-foreground">A Loja de Cafés Especiais</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Compre pacotes avulsos dos melhores grãos do Brasil, cultivados por pequenos produtores e selecionados sob medida pela nossa curadoria.
            </p>
          </div>

          {/* Carrinho Flutuante / Status */}
          <div className="flex items-center justify-between border-b border-border/70 pb-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Exibindo {MOCK_CAFES.length} Cafés Especiais
            </p>
            <Link
              href="/carrinho"
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold text-xs shadow-md hover:bg-primary/90 transition-colors"
            >
              <ShoppingCart size={14} />
              Carrinho ({itemCount})
            </Link>
          </div>

          {/* Grid de Cafés */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {MOCK_CAFES.map((cafe) => (
              <ProductCard
                key={cafe.id}
                cafe={cafe}
                isWishlisted={wishlist.includes(cafe.id)}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
