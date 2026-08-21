import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ProductBreadcrumb } from '@/components/product/product-breadcrumb';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductPurchasePanel } from '@/components/product/product-purchase-panel';
import { ShippingCalculator } from '@/components/product/shipping-calculator';
import { SensoryProfile } from '@/components/product/sensory-profile';
import { ProductStory } from '@/components/product/product-story';
import { RelatedProducts } from '@/components/product/related-products';
import { MOCK_CAFES } from '@/lib/coffees';
import { getCafeBySlug, getFormatoLabel, getRelatedCafes } from '@/lib/products';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return MOCK_CAFES.map((cafe) => ({ slug: cafe.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cafe = getCafeBySlug(slug);

  if (!cafe) {
    return { title: 'Produto não encontrado | Pingado' };
  }

  const description = cafe.descricao ?? undefined;

  return {
    title: `${cafe.nome} | Pingado`,
    description,
    openGraph: {
      title: `${cafe.nome} | Pingado`,
      description,
      images: cafe.imagem_url ? [{ url: cafe.imagem_url }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const cafe = getCafeBySlug(slug);

  if (!cafe) {
    notFound();
  }

  const imagens = cafe.imagens?.length ? cafe.imagens : cafe.imagem_url ? [cafe.imagem_url] : [];
  const relacionados = getRelatedCafes(cafe);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: cafe.nome,
    image: cafe.imagem_url ?? undefined,
    description: cafe.descricao ?? undefined,
    sku: cafe.id,
    brand: cafe.produtores?.nome
      ? { '@type': 'Brand', name: cafe.produtores.nome }
      : undefined,
    offers: {
      '@type': 'Offer',
      price: cafe.preco ?? undefined,
      priceCurrency: 'BRL',
      availability:
        cafe.estoque === 0
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 pb-24 lg:pb-16">
        <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 md:px-6 md:py-12">
          <ProductBreadcrumb categoria={getFormatoLabel(cafe)} nome={cafe.nome} />

          <div className="grid gap-10 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              <ProductGallery imagens={imagens} nome={cafe.nome} />
              <SensoryProfile cafe={cafe} className="flex-1" />
            </div>

            <div className="flex flex-col gap-6">
              <ProductPurchasePanel cafe={cafe} />
              <ShippingCalculator />
            </div>
          </div>
        </div>

        <ProductStory cafe={cafe} />
        <RelatedProducts produtos={relacionados} />
      </main>

      <SiteFooter />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
