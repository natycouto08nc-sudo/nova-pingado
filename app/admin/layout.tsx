'use client';

import { useRequireRole } from '@/lib/pingado/use-require-role';
import { PgSidebar } from '@/components/pingado/sidebar';
import { catalogoComProdutor } from '@/lib/pingado/crm-data';
import { CLIENTES_ASSINANTES, VENDEDOR_INFO } from '@/lib/pingado/crm-data';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { pronto } = useRequireRole('admin');

  if (!pronto) return null;

  return (
    <div className="flex min-h-screen bg-pg-bg font-pg-ui">
      <PgSidebar
        dark
        wordmarkSub="Painel interno · admin"
        items={[
          { href: '/admin', label: 'Montagem das caixas', badge: String(CLIENTES_ASSINANTES.length) },
          { href: '/admin/regras', label: 'Regras de seleção' },
          { href: '/admin/vendedores', label: 'Vendedores', badge: String(Object.keys(VENDEDOR_INFO).length) },
          { href: '/admin/clientes', label: 'Clientes e perfis', badge: String(CLIENTES_ASSINANTES.length) },
        ]}
        footer={<div className="text-xs text-pg-cream">Equipe de curadoria</div>}
      />
      <main className="flex-1 min-w-0 px-[38px] pt-7 pb-[60px]">{children}</main>
    </div>
  );
}
