'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowLeft, ExternalLink, Calendar, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

const MOCK_COMPRAS = [
  {
    id: 'compra-1',
    codigo: '#PG-9482',
    data: '14/08/2026',
    item: '1x Microlote Geisha (250g)',
    precoCafe: 'R$ 145,00',
    frete: 'Grátis',
    total: 'R$ 145,00',
    metodo: 'PIX',
    status: 'Em transporte',
    statusColor: 'bg-blue-100/50 text-blue-800 border-blue-200',
    detalhes: 'Seu pacote de Microlote Geisha foi coletado pela transportadora parceira e está a caminho da sua residência. Código de Rastreio: BR829302839LP.'
  },
  {
    id: 'compra-2',
    codigo: '#PG-9281',
    data: '05/08/2026',
    item: '1x Sweet Collection (250g)',
    precoCafe: 'R$ 72,00',
    frete: 'R$ 12,00',
    total: 'R$ 84,00',
    metodo: 'Cartão de Crédito',
    status: 'Entregue',
    statusColor: 'bg-green-100/50 text-green-800 border-green-200',
    detalhes: 'Pedido entregue com sucesso no dia 05/08/2026 às 15:42. Assinado por: LUIZ A.'
  }
];

export default function ComprasDetalhesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#1c3328] flex items-center justify-center text-[#f5ede3]">
        <div className="w-8 h-8 rounded-full border-2 border-[#b5563c] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5ede3] text-[#2f3b2a] flex flex-col font-sans">
      <SiteHeader />

      <main className="flex-1 bg-[#1c3328] py-12 px-4 md:px-6 lg:px-8 text-white">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Voltar */}
          <Link 
            href="/perfil" 
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white uppercase tracking-wider transition-colors"
          >
            <ArrowLeft size={14} />
            Voltar ao Painel
          </Link>

          {/* Cabeçalho */}
          <div className="border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <ShoppingBag size={24} className="text-[#e29b63]" />
              </div>
              <div>
                <h1 className="font-serif text-3xl font-normal text-white">Minhas Compras</h1>
                <p className="text-gray-300 text-sm font-sans">Consulte o histórico de pedidos individuais comprados avulsos na loja.</p>
              </div>
            </div>
          </div>

          {/* Lista de Compras */}
          <div className="space-y-6">
            {MOCK_COMPRAS.map((compra) => (
              <div 
                key={compra.id} 
                className="bg-card text-card-foreground rounded-2xl p-6 shadow-md border border-border/40 space-y-4"
              >
                {/* Cabeçalho do Pedido */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3 font-sans">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-bold text-foreground">{compra.codigo}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      {compra.data}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${compra.statusColor}`}>
                    {compra.status}
                  </span>
                </div>

                {/* Itens do Pedido */}
                <div className="grid md:grid-cols-3 gap-6 font-sans">
                  <div className="md:col-span-2 space-y-2">
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Produtos Adquiridos</p>
                    <p className="text-sm font-bold text-foreground">{compra.item}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/40 mt-2">
                      {compra.detalhes}
                    </p>
                  </div>

                  <div className="bg-background/40 p-4 rounded-xl border border-border/40 space-y-2 text-xs font-semibold text-muted-foreground">
                    <p className="text-[10px] font-bold uppercase tracking-wider pb-1.5 border-b border-border/60 text-foreground">Resumo dos Valores</p>
                    <div className="flex justify-between">
                      <span>Valor do Café:</span>
                      <span className="text-foreground">{compra.precoCafe}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frete:</span>
                      <span className="text-foreground">{compra.frete}</span>
                    </div>
                    <div className="flex justify-between border-t border-border/40 pt-2 text-sm text-foreground font-bold font-serif">
                      <span>Total:</span>
                      <span className="text-primary">{compra.total}</span>
                    </div>
                    <div className="text-[9px] pt-1 text-right text-muted-foreground font-normal">
                      Pago via {compra.metodo}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Suporte */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4 font-sans text-xs">
              <div className="flex items-center gap-2">
                <HelpCircle size={16} className="text-[#e29b63]" />
                <span className="text-gray-300">Dúvidas sobre o frete, entrega ou rastreamento de compras avulsas?</span>
              </div>
              <a 
                href="https://wa.me/5511999999999" 
                target="_blank" 
                rel="noreferrer"
                className="text-[#e29b63] hover:underline font-bold flex items-center gap-1"
              >
                Falar com Sommelier
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
