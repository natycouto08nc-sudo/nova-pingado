'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import {
  ShippingAddressForm,
  ENDERECO_VAZIO,
  enderecoValido,
  type EnderecoEntrega,
} from '@/components/checkout/shipping-address-form';
import { ShippingCalculation, cepValido } from '@/components/cart/shipping-calculation';
import {
  PaymentMethodSelector,
  PAGAMENTO_LABELS,
  type FormaPagamento,
} from '@/components/checkout/payment-method-selector';
import { WhatsAppRedirect } from '@/components/checkout/whatsapp-redirect';
import { OrderSummary } from '@/components/cart/order-summary';
import { useCart } from '@/context/cart-context';

function gerarCodigoPedido() {
  return `#PG-${Math.floor(1000 + Math.random() * 9000)}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, loading, clearCart, cep, freteCalculado, setCep, calcularFrete } = useCart();

  const [endereco, setEndereco] = useState<EnderecoEntrega>(ENDERECO_VAZIO);
  const [pagamento, setPagamento] = useState<FormaPagamento | null>(null);
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [pedidoConfirmado, setPedidoConfirmado] = useState<string | null>(null);
  const [totalPedido, setTotalPedido] = useState(subtotal);

  useEffect(() => {
    if (!loading && items.length === 0 && !pedidoConfirmado) {
      router.replace('/carrinho');
    }
  }, [loading, items.length, pedidoConfirmado, router]);

  const freteValido = cepValido(cep) && freteCalculado;

  function handleFinalizarPedido() {
    setTentouEnviar(true);
    if (!enderecoValido(endereco) || !freteValido || !pagamento) return;

    const codigo = gerarCodigoPedido();
    clearCart();
    setPedidoConfirmado(codigo);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {pedidoConfirmado ? (
            <WhatsAppRedirect
              orderCode={pedidoConfirmado}
              nomeUsuario={endereco.nomeCompleto}
              valorPedido={totalPedido}
              metodoPagamento={pagamento ? PAGAMENTO_LABELS[pagamento] : ''}
            />
          ) : (
            <>
              <h1 className="font-serif text-3xl text-foreground md:text-4xl">Finalizar pedido</h1>

              <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
                <div className="space-y-6">
                  <ShippingAddressForm value={endereco} onChange={setEndereco} />
                  {tentouEnviar && !enderecoValido(endereco) && (
                    <p className="-mt-3 text-sm font-medium text-destructive">
                      Preencha todos os campos obrigatórios do endereço.
                    </p>
                  )}

                  <PaymentMethodSelector value={pagamento} onChange={setPagamento} />
                  {tentouEnviar && !pagamento && (
                    <p className="-mt-3 text-sm font-medium text-destructive">
                      Selecione uma forma de pagamento.
                    </p>
                  )}
                </div>

                <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                  <OrderSummary
                    items={items}
                    subtotal={subtotal}
                    ctaLabel="Finalizar pedido"
                    onCta={handleFinalizarPedido}
                    freteGratis={freteCalculado}
                    onTotalChange={setTotalPedido}
                  />

                  <ShippingCalculation
                    cep={cep}
                    onCepChange={setCep}
                    calculado={freteCalculado}
                    onCalcular={calcularFrete}
                  />
                  {tentouEnviar && !freteValido && (
                    <p className="-mt-2 text-sm font-medium text-destructive">
                      Informe o CEP e calcule o frete para continuar.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
