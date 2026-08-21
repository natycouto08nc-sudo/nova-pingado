'use client';

import { useEffect, useState } from 'react';

import { WhatsappIcon } from '@/components/icons/brand-icons';
import { montarLinkWhatsApp } from '@/lib/checkout';

interface WhatsAppRedirectProps {
  orderCode: string;
  nomeUsuario: string;
  valorPedido: number;
  metodoPagamento: string;
}

export function WhatsAppRedirect({ orderCode, nomeUsuario, valorPedido, metodoPagamento }: WhatsAppRedirectProps) {
  const [segundos, setSegundos] = useState(5);
  const link = montarLinkWhatsApp({
    nomeUsuario,
    codigoPedido: orderCode,
    valorPedido,
    metodoPagamento,
  });

  useEffect(() => {
    if (segundos === 0) {
      window.location.href = link;
      return;
    }

    const timer = window.setTimeout(() => setSegundos((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [segundos, link]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-secondary/10">
        <WhatsappIcon className="size-8 text-secondary" />
      </div>
      <p className="kicker text-primary">Pedido {orderCode}</p>
      <h1 className="font-serif text-3xl text-foreground">Redirecionando para o WhatsApp</h1>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Redirecionaremos você para nosso WhatsApp de finalização de compra do pedido{' '}
        <span className="font-semibold text-foreground">{orderCode}</span> em{' '}
        <span className="font-semibold text-foreground">
          {segundos} segundo{segundos !== 1 ? 's' : ''}
        </span>
        ...
      </p>
      <a
        href={link}
        className="text-xs font-medium text-primary underline underline-offset-4 hover:text-primary/80"
      >
        Não quer esperar? Clique aqui
      </a>
    </div>
  );
}
