'use client';

import { useAuth } from '@/context/auth-context';
import { useRequireRole } from '@/lib/pingado/use-require-role';
import { useReservasVendedor, useVendedor } from '@/lib/pingado/vendedor-store';
import { PgSidebar } from '@/components/pingado/sidebar';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { AVALIACOES_PRODUTO } from '@/lib/pingado/crm-data';

export default function VendedorLayout({ children }: { children: React.ReactNode }) {
  const { pronto } = useRequireRole('vendedor');
  const { user } = useAuth();
  const { produtorId, nomeVendedor, meusProdutos } = useVendedor();
  const { reservas } = useReservasVendedor(produtorId);

  if (!pronto) return null;

  const meusIds = new Set(meusProdutos.map((p) => p.id));
  const totalAvaliacoes = AVALIACOES_PRODUTO.filter((a) => meusIds.has(a.cafeId)).length;
  const pendentes = reservas.filter((r) => r.status === 'pendente').length;

  const iniciais = nomeVendedor
    .split(' ')
    .filter((w) => !/^(Torrefação|Torrefacao|Fazenda|Sítio|Sitio|Café|Cafe|de|do|da)$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || 'PG';

  return (
    <div className="min-h-screen bg-pg-bg font-pg-ui flex flex-col justify-between">
      <SiteHeader />
      <div className="flex flex-1">
        <PgSidebar
          wordmarkSub="Painel do vendedor"
          groupLabel="Operação"
          items={[
            { href: '/vendedor', label: 'Visão geral' },
            { href: '/vendedor/produtos', label: 'Meus produtos', badge: String(meusProdutos.length) },
            { href: '/vendedor/cadastrar', label: 'Cadastrar café' },
            { href: '/vendedor/vendas', label: 'Vendas e receita' },
            { href: '/vendedor/selecoes', label: 'Seleções para caixas' },
            { href: '/vendedor/avaliacoes', label: 'Avaliações', badge: String(totalAvaliacoes) },
            { href: '/vendedor/reservas', label: 'Reservas', badge: String(pendentes) },
          ]}
          footer={
            <div className="flex items-center gap-[10px]">
              <div className="w-[30px] h-[30px] flex-none rounded-full bg-pg-green-soft-2 flex items-center justify-center font-pg-display text-sm text-[#E4D9C6]">
                {iniciais}
              </div>
              <div className="min-w-0">
                <div className="text-xs text-pg-cream truncate">{nomeVendedor}</div>
                <div className="text-[10px] text-[#8FA394]">Vendedor verificado</div>
              </div>
            </div>
          }
        />
        <main className="flex-1 min-w-0 px-[38px] pt-7 pb-[60px]">{children}</main>
      </div>
      <SiteFooter />
    </div>
  );
}
