import Link from 'next/link';

import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';

export default function ProductNotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex flex-1 items-center justify-center px-4 py-24 text-center">
        <div className="space-y-6">
          <p className="kicker text-primary">Ops</p>
          <h1 className="font-serif text-3xl text-foreground md:text-4xl">Produto não encontrado</h1>
          <p className="text-sm text-muted-foreground">
            O café que você procura não existe ou não está mais disponível.
          </p>
          <Button size="lg" render={<Link href="/loja" />}>
            Voltar para produtos
          </Button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
