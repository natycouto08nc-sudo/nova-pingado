import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProductDetail } from '@/components/pingado/product-detail';
import { MOCK_CAFES } from '@/lib/coffees';
import { getCafeBySlug } from '@/lib/products';

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
    <>
      <ProductDetail cafe={cafe} />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
