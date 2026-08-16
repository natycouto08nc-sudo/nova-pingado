"use client"

import { useState } from "react"
import { Menu, Search, User, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { label: "Assinatura", href: "#planos" },
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Nossos Produtores", href: "#produtores" },
  { label: "Loja", href: "#produtos" },
  { label: "Sobre", href: "#newsletter" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-10 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
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
              {navigation.slice(0, 2).map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-foreground/70 underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <a
          href="#top"
          className="font-serif text-2xl tracking-[0.32em] text-foreground transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring md:text-3xl"
        >
          PINGADO
        </a>

        <div className="flex flex-1 items-center justify-end gap-1">
          <nav aria-label="Navegação secundária" className="hidden lg:block">
            <ul className="flex items-center gap-6">
              {navigation.slice(2).map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-foreground/70 underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <Button variant="ghost" size="icon" aria-label="Buscar cafés">
            <Search />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Minha conta">
            <User />
          </Button>
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
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-border/60 py-3 font-serif text-lg transition-colors last:border-b-0 hover:text-primary focus-visible:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
