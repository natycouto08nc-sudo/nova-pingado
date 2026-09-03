"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MOCK_CAFES } from "@/lib/coffees"
import type { Cafe } from "@/lib/types"

type Product = {
  name: string
  price: string
  image: string
  alt: string
  badge?: string
  href: string
}

function toProduct(cafe: Cafe): Product {
  return {
    name: cafe.nome,
    price: (cafe.preco ?? 0).toFixed(2).replace(".", ","),
    image: cafe.imagem_url ?? "/placeholder.jpg",
    alt: `Pacote de café Pingado ${cafe.nome}`,
    badge: cafe.badge,
    href: `/loja/${cafe.slug}`,
  }
}

const CATEGORY_TABS: { value: NonNullable<Cafe["formato"]>; label: string }[] = [
  { value: "graos", label: "Grãos" },
  { value: "moido", label: "Moídos" },
  { value: "drip", label: "Drip Coffee" },
  { value: "capsula", label: "Cápsulas" },
]

const categories = CATEGORY_TABS.map((tab) => ({
  value: tab.value,
  label: tab.label,
  products: MOCK_CAFES.filter((cafe) => (cafe.formato ?? "graos") === tab.value).map(toProduct),
}))

export function ProductGrid() {
  return (
    <section id="produtos" className="bg-muted/50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="kicker text-primary">Produtos</p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-balance md:text-4xl">
            Busque por categoria
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
            Selecione seus produtos preferidos por categoria abaixo
          </p>
        </div>

        <Tabs defaultValue="graos" className="mt-12">
          <TabsList
            variant="line"
            className="mx-auto h-auto flex-wrap justify-center gap-x-6 gap-y-2"
          >
            {categories.map((category) => (
              <TabsTrigger
                key={category.value}
                value={category.value}
                className="kicker h-auto flex-none px-1 py-2"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent
              key={category.value}
              value={category.value}
              className="mt-10"
            >
              <ul className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
                {category.products.map((product) => (
                  <li key={product.name}>
                    <Link
                      href={product.href}
                      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        <Image
                          src={product.image}
                          alt={product.alt}
                          fill
                          sizes="(min-width: 1024px) 22vw, 45vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {product.badge && (
                          <Badge className="absolute top-3 left-3 bg-gold text-gold-foreground">
                            {product.badge}
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col justify-between gap-3 p-4">
                        <h3 className="font-sans text-sm leading-relaxed text-pretty">
                          {product.name}
                        </h3>
                        <p className="font-serif text-xl text-primary">
                          R$ {product.price}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-12 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            className="group h-12 px-6 text-base"
            render={<Link href="/loja" />}
          >
            Explorar vitrine completa com filtros
            <ArrowRight
              data-icon="inline-end"
              className="ml-2 transition-transform group-hover:translate-x-0.5"
            />
          </Button>
        </div>
      </div>
    </section>
  )
}
