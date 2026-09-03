'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowLeft, ExternalLink, Calendar, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PerfilTabs } from '@/components/perfil/perfil-tabs';

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

  const [compras, setCompras] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      try {
        const key = `pingado_compras_${user.id}`;
        const items = JSON.parse(localStorage.getItem(key) || '[]');
        setCompras(items);
      } catch (e) {
        console.error('Erro ao ler compras do localStorage:', e);
      }
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between font-sans">
      <SiteHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto py-10 px-4 md:px-6 lg:px-8 space-y-8">
        {/* Cabeçalho */}
        <div className="flex items-center gap-4 pb-2">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
            <ShoppingBag size={28} />
          </div>
          <div>
            <p className="kicker text-primary">Histórico</p>
            <h1 className="font-serif text-3xl md:text-4xl text-foreground font-normal mt-0.5">Minhas Compras</h1>
            <p className="text-muted-foreground text-sm font-sans">Consulte o histórico de pedidos individuais comprados avulsos na loja.</p>
          </div>
        </div>

        {/* Barra de Abas Unificada */}
        <PerfilTabs />

          {/* Lista de Compras */}
          <div className="space-y-6">
            {compras.length === 0 ? (
              <div className="bg-card text-card-foreground rounded-2xl p-8 shadow-md border border-border/40 text-center space-y-4 font-sans">
                <div className="w-16 h-16 bg-muted/40 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                  <ShoppingBag size={28} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold">Nenhuma compra avulsa</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">Você ainda não realizou compras individuais na loja. Visite nosso catálogo e descubra cafés incríveis.</p>
                </div>
                <Link 
                  href="/loja" 
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs px-6 py-3 rounded-full shadow transition-all font-sans"
                >
                  Ir para a Loja
                </Link>
              </div>
            ) : (
              compras.map((compra) => (
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
            )))}

            {/* Suporte */}
            <div className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between gap-4 font-sans text-xs shadow-sm">
              <div className="flex items-center gap-2.5">
                <HelpCircle size={16} className="text-primary" />
                <span className="text-muted-foreground">Dúvidas sobre o frete, entrega ou rastreamento de compras avulsas?</span>
              </div>
              <a 
                href="https://wa.me/5511999999999" 
                target="_blank" 
                rel="noreferrer"
                className="text-primary hover:underline font-bold flex items-center gap-1 shrink-0"
              >
                Falar com Sommelier
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </main>

      <SiteFooter />
    </div>
  );
}
