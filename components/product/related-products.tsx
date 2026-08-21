import type { Cafe } from '@/lib/types';
import { ProductCard } from '@/components/product/product-card';

interface RelatedProductsProps {
  produtos: Cafe[];
}

export function RelatedProducts({ produtos }: RelatedProductsProps) {
  if (produtos.length === 0) return null;

  return (
    <section aria-labelledby="related-products-heading" className="bg-muted/50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="kicker text-primary">Continue explorando</p>
          <h2
            id="related-products-heading"
            className="mt-4 font-serif text-3xl leading-tight text-balance md:text-4xl"
          >
            Você também pode gostar
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {produtos.map((cafe) => (
            <ProductCard key={cafe.id} cafe={cafe} />
          ))}
        </div>
      </div>
    </section>
  );
}
