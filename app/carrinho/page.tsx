'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';

import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { CartLineItem } from '@/components/cart/cart-line-item';
import { OrderSummary } from '@/components/cart/order-summary';
import { ShippingCalculation, cepValido } from '@/components/cart/shipping-calculation';
import { useCart } from '@/context/cart-context';

export default function CarrinhoPage() {
  const router = useRouter();
  const { items, subtotal, loading, cep, freteCalculado, setCep, calcularFrete } = useCart();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h1 className="font-serif text-3xl text-foreground md:text-4xl">Seu carrinho</h1>

          {!loading && items.length === 0 && (
            <div className="mx-auto mt-16 flex max-w-md flex-col items-center gap-4 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                <ShoppingBag size={28} className="text-muted-foreground" />
              </div>
              <h2 className="font-serif text-xl text-foreground">Seu carrinho está vazio</h2>
              <p className="text-sm text-muted-foreground">
                Explore nossos cafés especiais e encontre o próximo que vai marcar sua xícara.
              </p>
              <Button size="lg" render={<Link href="/loja" />} className="mt-2">
                Ver produtos
              </Button>
            </div>
          )}

          {items.length > 0 && (
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
              <div className="space-y-4">
                {items.map((item) => (
                  <CartLineItem key={item.id} item={item} />
                ))}
              </div>

              <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                <OrderSummary
                  items={items}
                  subtotal={subtotal}
                  ctaLabel="Finalizar compra"
                  onCta={() => router.push('/checkout')}
                  ctaDisabled={!cepValido(cep) || !freteCalculado}
                  freteGratis={freteCalculado}
                  footer={
                    <>
                      {(!cepValido(cep) || !freteCalculado) && (
                        <p className="mt-3 text-center text-xs font-medium text-destructive">
                          Calcule o frete para continuar.
                        </p>
                      )}
                      <Link
                        href="/loja"
                        className="mt-3 block text-center text-xs text-muted-foreground underline underline-offset-4 hover:text-primary"
                      >
                        Continuar comprando
                      </Link>
                    </>
                  }
                />

                <ShippingCalculation
                  cep={cep}
                  onCepChange={setCep}
                  calculado={freteCalculado}
                  onCalcular={calcularFrete}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
