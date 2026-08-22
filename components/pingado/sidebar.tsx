'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

export interface SidebarItem {
  href: string;
  label: string;
  badge?: string;
}

export function PgSidebar({
  wordmarkSub,
  groupLabel,
  items,
  footer,
  dark = false,
}: {
  wordmarkSub: string;
  groupLabel?: string;
  items: SidebarItem[];
  footer?: React.ReactNode;
  dark?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  const bg = dark ? 'bg-pg-green-dark' : 'bg-pg-green';

  const sair = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <aside className={`w-[238px] flex-none ${bg} text-pg-cream py-[26px] flex flex-col gap-6 sticky top-0 h-screen font-pg-ui`}>
      <div className="px-[22px]">
        <div className="font-pg-display text-[19px] tracking-[.34em] text-pg-cream-2">PINGADO</div>
        <div className="text-[9px] tracking-[.2em] uppercase text-[#8FA394] mt-[7px]">{wordmarkSub}</div>
      </div>

      <div className="px-[14px] flex flex-col gap-[2px] overflow-y-auto">
        {groupLabel && <div className="text-[9px] tracking-[.18em] uppercase text-[#71856F] px-2 pb-2">{groupLabel}</div>}
        {items.map((item) => {
          const active = item.href === '/vendedor' || item.href === '/admin'
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between gap-2 text-left rounded-[3px] px-[10px] py-[9px] text-[13px] transition-colors ${
                active ? 'bg-pg-green-soft text-pg-cream-2' : 'text-[#B4C4B5] hover:bg-pg-green-soft-2/60'
              }`}
            >
              <span>{item.label}</span>
              {item.badge && <span className={`text-[10.5px] ${active ? 'text-[#C8A98C]' : 'text-[#7A8E7C]'}`}>{item.badge}</span>}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto px-[22px] flex flex-col gap-3">
        <div className="h-px bg-[rgba(237,230,217,.14)]" />
        {footer}
        <button onClick={sair} className="cursor-pointer border border-[rgba(237,230,217,.2)] bg-transparent text-[#B4C4B5] text-[11.5px] py-2 rounded-[2px]">
          Sair
        </button>
      </div>
    </aside>
  );
}
