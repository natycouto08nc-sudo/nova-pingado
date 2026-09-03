'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CreditCard, ShoppingBag, Sliders } from 'lucide-react';

const TABS = [
  { href: '/perfil', label: 'Visão Geral', icon: LayoutDashboard, exact: true },
  { href: '/perfil/assinatura', label: 'Minha Assinatura', icon: CreditCard },
  { href: '/perfil/compras', label: 'Minhas Compras', icon: ShoppingBag },
  { href: '/perfil/sensorial', label: 'Perfil Sensorial', icon: Sliders },
];

export function PerfilTabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegação do painel" className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border/70 scrollbar-none">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const active = tab.exact ? pathname === tab.href : pathname?.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              active
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border/80'
            }`}
          >
            <Icon size={14} className={active ? 'text-primary-foreground' : 'text-primary'} />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
