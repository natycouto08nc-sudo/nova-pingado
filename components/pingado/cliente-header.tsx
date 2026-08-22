'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';

export function PgClienteHeader() {
  const router = useRouter();
  const { user, role, signOut } = useAuth();
  const { itemCount } = useCart();

  const sair = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="font-pg-ui">
      <div className="bg-pg-green text-pg-cream text-center text-[10px] tracking-[.16em] uppercase py-[9px]">
        Frete grátis acima de R$ 149 no Sul e Sudeste
      </div>
      <div className="bg-pg-cream-2 border-b border-[rgba(28,46,35,.10)] px-[38px] py-4 grid grid-cols-[1fr_auto_1fr] items-center">
        <nav className="flex gap-5 text-[11.5px] text-[#5E6A5C]">
          <Link href="/onboarding" className="hover:text-pg-terracotta transition-colors">Assinatura</Link>
          <Link href="/#como-funciona" className="hover:text-pg-terracotta transition-colors">Como funciona</Link>
        </nav>
        <Link href="/loja" className="font-pg-display text-[19px] tracking-[.34em] text-pg-green">PINGADO</Link>
        <div className="flex gap-5 text-[11.5px] text-[#5E6A5C] justify-end items-center">
          <Link href="/#produtores" className="hover:text-pg-terracotta transition-colors">Nossos produtores</Link>
          <Link href="/loja" className="text-pg-terracotta">Loja</Link>
          <Link href="/carrinho" className="hover:text-pg-terracotta transition-colors">Carrinho{itemCount > 0 ? ` (${itemCount})` : ''}</Link>
          {user ? (
            <button onClick={sair} className="cursor-pointer border border-[rgba(28,46,35,.2)] bg-transparent text-[#3C4A3E] text-[11px] px-3 py-[6px] rounded-[2px]">
              Sair
            </button>
          ) : (
            <Link href="/login" className="border border-[rgba(28,46,35,.2)] px-3 py-[6px] rounded-[2px] text-[#3C4A3E]">Entrar</Link>
          )}
          {role === 'vendedor' && <Link href="/vendedor" className="text-pg-terracotta">Meu painel</Link>}
          {role === 'admin' && <Link href="/admin" className="text-pg-terracotta">Admin</Link>}
        </div>
      </div>
    </div>
  );
}
