'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MOCK_CAFES } from '@/lib/coffees';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Award, ShoppingCart, Check, Heart } from 'lucide-react';

export default function LojaPage() {
  const [cartCount, setCartCount] = useState(0);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const addToCart = (id: string) => {
    setCartCount(prev => prev + 1);
    setAddedItem(id);
    setTimeout(() => setAddedItem(null), 2000);
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
            <div className="flex items-center gap-2 bg-[#bf5a36] text-white px-4 py-2 rounded-full font-bold text-xs shadow-md">
              <ShoppingCart size={14} />
              Carrinho ({cartCount})
            </div>
          </div>

          {/* Grid de Cafés */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {MOCK_CAFES.map((cafe) => (
              <div 
                key={cafe.id} 
                className="bg-card text-card-foreground rounded-2xl overflow-hidden shadow-sm border border-border/70 flex flex-col justify-between h-full hover:shadow-md transition-shadow relative"
              >
                {/* Imagem */}
                <div className="relative aspect-[4/3] bg-muted/20">
                  <Image
                    src={cafe.imagem_url || '/placeholder.jpg'}
                    alt={cafe.nome}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, 50vw"
                  />

                  {/* Favoritar */}
                  <button 
                    onClick={() => toggleWishlist(cafe.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-primary shadow-sm hover:scale-105 transition-transform"
                  >
                    <Heart size={14} fill={wishlist.includes(cafe.id) ? "currentColor" : "none"} />
                  </button>

                  {/* Score SCA */}
                  {cafe.score_sca && (
                    <div className="absolute bottom-3 left-3 bg-secondary text-secondary-foreground text-[10px] px-2.5 py-0.5 rounded-full font-semibold">
                      SCA {cafe.score_sca}
                    </div>
                  )}
                </div>

                {/* Info */}
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

                    {/* Notas */}
                    {cafe.notas_sensoriais && (
                      <div className="flex flex-wrap gap-1">
                        {cafe.notas_sensoriais.slice(0, 2).map(nota => (
                          <span key={nota} className="text-[9px] bg-muted border border-border text-foreground px-2 py-0.5 rounded-full font-medium">
                            {nota}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Preço e Botão */}
                  <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-4">
                    <p className="font-serif text-base font-bold text-foreground">
                      R$ {cafe.preco?.toFixed(2).replace('.', ',')}
                      <span className="text-[9px] text-muted-foreground font-normal ml-0.5">/ 250g</span>
                    </p>

                    <button
                      onClick={() => addToCart(cafe.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                        addedItem === cafe.id 
                          ? 'bg-green-600 text-white' 
                          : 'bg-[#bf5a36] hover:bg-[#a64928] text-white shadow-sm'
                      }`}
                    >
                      {addedItem === cafe.id ? (
                        <>
                          <Check size={12} />
                          Adicionado
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={12} />
                          Comprar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
