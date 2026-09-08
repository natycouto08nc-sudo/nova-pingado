"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Search, User, X, LogOut, CreditCard, ShoppingBag, Sliders } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, role, signOut } = useAuth()
  const { itemCount } = useCart()
  const pathname = usePathname()

  const isProfileRoute = pathname?.startsWith('/perfil') || pathname?.startsWith('/vendedor') || pathname?.startsWith('/admin')

  const navigation = isProfileRoute
    ? [
        { label: "Página Inicial", href: "/" },
        { label: "Loja", href: "/loja" },
      ]
    : [
        { label: "Assinatura", href: "/#planos" },
        { label: "Como Funciona", href: "/#como-funciona" },
        { label: "Nossos Produtores", href: "/#produtores" },
        { label: "Loja", href: "/loja" },
        { label: "Sobre", href: "/#newsletter" },
      ]

  const handleSignOutClick = async () => {
    setDropdownOpen(false)
    await signOut()
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-20 md:px-6">
        <div className="flex flex-1 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X /> : <Menu />}
          </Button>

          <nav aria-label="Navegação principal" className="hidden lg:block">
            <ul className="flex items-center gap-6">
              {navigation.slice(0, isProfileRoute ? 2 : 2).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-foreground/70 underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Link
          href="/"
          className="font-serif text-2xl tracking-[0.32em] text-primary transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring md:text-3xl"
        >
          PINGADO
        </Link>

        <div className="flex flex-1 items-center justify-end gap-1 relative">
          {!isProfileRoute && (
            <nav aria-label="Navegação secundária" className="hidden lg:block">
              <ul className="flex items-center gap-6 mr-6">
                {navigation.slice(2).map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-foreground/70 underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <Button variant="ghost" size="icon" aria-label="Buscar cafés">
            <Search />
          </Button>
          <Link
            href="/carrinho"
            aria-label={`Carrinho${itemCount > 0 ? `, ${itemCount} ${itemCount === 1 ? 'item' : 'itens'}` : ''}`}
            className="relative inline-flex size-8 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ShoppingBag size={18} />
            {itemCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
              >
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Minha conta"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={cn(dropdownOpen && "bg-muted")}
          >
            <User />
          </Button>

          {dropdownOpen && (
            <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-border bg-card p-1.5 shadow-lg text-card-foreground animate-in fade-in duration-100 font-sans">
              {user ? (
                <div className="flex flex-col">
                  <div className="px-3 py-2 border-b border-border/60 text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                    Olá, {user.nome.split(' ')[0]}
                  </div>
                  <Link 
                    href="/perfil" 
                    onClick={() => setDropdownOpen(false)} 
                    className="px-3 py-2 text-xs hover:bg-muted rounded-lg font-bold transition-colors text-left flex items-center gap-2"
                  >
                    <User size={14} className="text-primary" />
                    Meu Painel
                  </Link>
                  <Link 
                    href="/perfil/assinatura" 
                    onClick={() => setDropdownOpen(false)} 
                    className="px-3 py-2 text-xs hover:bg-muted rounded-lg font-bold transition-colors text-left flex items-center gap-2"
                  >
                    <CreditCard size={14} className="text-primary" />
                    Minha Assinatura
                  </Link>
                  <Link 
                    href="/perfil/compras" 
                    onClick={() => setDropdownOpen(false)} 
                    className="px-3 py-2 text-xs hover:bg-muted rounded-lg font-bold transition-colors text-left flex items-center gap-2"
                  >
                    <ShoppingBag size={14} className="text-primary" />
                    Minhas Compras
                  </Link>
                  <Link 
                    href="/perfil/sensorial" 
                    onClick={() => setDropdownOpen(false)} 
                    className="px-3 py-2 text-xs hover:bg-muted rounded-lg font-bold transition-colors text-left flex items-center gap-2"
                  >
                    <Sliders size={14} className="text-primary" />
                    Refazer Perfil Sensorial
                  </Link>
                  {role === 'vendedor' && (
                    <Link 
                      href="/vendedor" 
                      onClick={() => setDropdownOpen(false)} 
                      className="px-3 py-2 text-xs hover:bg-muted rounded-lg font-bold transition-colors text-left flex items-center gap-2 text-primary"
                    >
                      <Sliders size={14} className="text-primary" />
                      Painel do Vendedor
                    </Link>
                  )}
                  {role === 'admin' && (
                    <Link 
                      href="/admin" 
                      onClick={() => setDropdownOpen(false)} 
                      className="px-3 py-2 text-xs hover:bg-muted rounded-lg font-bold transition-colors text-left flex items-center gap-2 text-primary"
                    >
                      <Sliders size={14} className="text-primary" />
                      Painel do Administrador
                    </Link>
                  )}
                  <button 
                    onClick={handleSignOutClick}
                    className="px-3 py-2 text-xs hover:bg-red-500/5 text-red-600 rounded-lg font-bold transition-colors text-left w-full flex items-center gap-2 border-t border-border/60 mt-1 pt-2"
                  >
                    <LogOut size={14} />
                    Sair da Conta
                  </button>
                </div>
              ) : (
                <div className="flex flex-col">
                  <Link 
                    href="/login" 
                    onClick={() => setDropdownOpen(false)} 
                    className="px-3 py-2.5 text-xs hover:bg-muted rounded-lg font-bold transition-colors text-left"
                  >
                    Entrar
                  </Link>
                  <Link 
                    href="/onboarding" 
                    onClick={() => setDropdownOpen(false)} 
                    className="px-3 py-2.5 text-xs hover:bg-muted rounded-lg font-bold transition-colors text-left"
                  >
                    Criar Conta / Assinar
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "overflow-hidden border-t border-border/70 transition-all lg:hidden",
          open ? "max-h-80" : "max-h-0 border-t-0",
        )}
      >
        <nav aria-label="Navegação mobile" className="px-4 py-2">
          <ul className="flex flex-col">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-border/60 py-3 font-serif text-lg transition-colors last:border-b-0 hover:text-primary focus-visible:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
