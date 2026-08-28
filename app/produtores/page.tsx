'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MOCK_CAFES, MOCK_PRODUTORES } from '@/lib/coffees';
import { AVALIACOES_PRODUTO, VENDEDOR_INFO } from '@/lib/pingado/crm-data';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PgEyebrow } from '@/components/pingado/ui';
import { brl } from '@/lib/pingado/format';

export default function ProdutoresPage() {
  // 1. Filtrar cafés ativos que pertencem a algum produtor
  const cafesAtivos = useMemo(() => MOCK_CAFES.filter((c) => c.ativo && c.produtor_id !== null), []);

  // 2. Filtrar produtores que possuem pelo menos um café ativo
  const produtoresAtivos = useMemo(() => {
    return MOCK_PRODUTORES.filter((p) => cafesAtivos.some((c) => c.produtor_id === p.id));
  }, [cafesAtivos]);

  // 3. Mapear cada produtor com seus cafés e avaliações correspondentes
  const produtoresComDados = useMemo(() => {
    return produtoresAtivos.map((p) => {
      const cafes = cafesAtivos.filter((c) => c.produtor_id === p.id);
      const cafeIds = new Set(cafes.map((c) => c.id));
      const avaliacoes = AVALIACOES_PRODUTO.filter((a) => cafeIds.has(a.cafeId));
      
      // Média de nota do vendedor (busca do VENDEDOR_INFO ou calcula a média)
      const infoVendedor = VENDEDOR_INFO[p.id];
      const nota = infoVendedor?.nota ?? (avaliacoes.length
        ? Number((avaliacoes.reduce((acc, a) => acc + a.estrelas, 0) / avaliacoes.length).toFixed(1))
        : 5.0);

      return {
        ...p,
        cafes,
        avaliacoes,
        nota,
        totalReviews: avaliacoes.length,
      };
    });
  }, [produtoresAtivos, cafesAtivos]);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="mb-12">
          <PgEyebrow>Nossos Parceiros · {produtoresComDados.length} produtores ativos</PgEyebrow>
          <h1 className="font-serif text-3xl font-semibold leading-tight text-balance md:text-5xl text-foreground mt-2">
            Conheça as histórias por trás de cada grão
          </h1>
          <p className="mt-4 text-base text-muted-foreground max-w-[64ch] leading-relaxed">
            Apoiamos a agricultura familiar e o comércio justo. Veja a lista dos nossos produtores parceiros com cafés disponíveis na vitrine e as avaliações reais de nossa comunidade.
          </p>
        </div>

        <div className="flex flex-col gap-10">
          {produtoresComDados.map((p) => (
            <section 
              key={p.id} 
              className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 items-start"
            >
              {/* Lado Esquerdo: Info do Produtor e Cafés Ativos */}
              <div className="flex flex-col gap-6">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-serif text-2xl md:text-3xl text-foreground font-medium">{p.nome}</h2>
                    <div className="flex items-center gap-1 bg-[#F6F0E6] text-primary text-sm font-semibold px-2.5 py-0.5 rounded-full border border-primary/10">
                      ★ {p.nota.toFixed(1).replace('.', ',')}
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-primary mt-1">
                    {p.regiao} · {p.estado}
                  </p>
                  <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed max-w-[62ch]">
                    {p.descricao}
                  </p>
                </div>

                <div className="h-px bg-border/60" />

                {/* Cafés Ativos */}
                <div>
                  <h3 className="text-xs tracking-[0.14em] uppercase text-muted-foreground font-bold mb-4">
                    Cafés Disponíveis na Vitrine ({p.cafes.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {p.cafes.map((cafe) => (
                      <Link
                        key={cafe.id}
                        href={`/loja/${cafe.slug}`}
                        className="flex gap-4 p-3 bg-background rounded-lg border border-border/50 hover:border-primary/40 transition-colors"
                      >
                        <div 
                          className="w-14 h-18 bg-muted rounded-md bg-cover bg-center flex-none"
                          style={cafe.imagem_url ? { backgroundImage: `url(${cafe.imagem_url})` } : undefined}
                        />
                        <div className="min-w-0 flex flex-col justify-between">
                          <div>
                            <h4 className="font-serif text-base text-foreground font-medium truncate">{cafe.nome}</h4>
                            <p className="text-[11px] text-muted-foreground truncate">{cafe.variedade} · {cafe.processo}</p>
                          </div>
                          <span className="text-sm font-semibold text-primary">{cafe.preco != null ? brl(cafe.preco) : '—'}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lado Direito: Avaliações dos Clientes */}
              <div className="lg:border-l lg:border-border/60 lg:pl-8 flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-xs tracking-[0.14em] uppercase text-muted-foreground font-bold mb-4">
                    Avaliações dos Clientes ({p.totalReviews})
                  </h3>
                  
                  {p.avaliacoes.length === 0 ? (
                    <div className="p-6 text-center bg-muted/30 border border-dashed border-border/50 rounded-lg text-sm text-muted-foreground">
                      Sem avaliações escritas para este produtor ainda.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1">
                      {p.avaliacoes.map((av) => {
                        const cafeNome = p.cafes.find((c) => c.id === av.cafeId)?.nome ?? 'Café';
                        return (
                          <div key={av.id} className="p-4 bg-muted/30 border border-border/30 rounded-lg text-xs flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-foreground">{av.cliente}</span>
                              <span className="text-primary font-bold">{'★'.repeat(av.estrelas)}</span>
                            </div>
                            <p className="text-muted-foreground italic leading-relaxed">
                              &ldquo;{av.texto}&rdquo;
                            </p>
                            <div className="flex justify-between items-center text-[10px] text-muted-foreground border-t border-border/20 pt-1.5 mt-0.5">
                              <span>preparo: {av.metodo}</span>
                              <span className="italic font-medium">sobre o {cafeNome}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
