"use client"

import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Product = {
  name: string
  price: string
  image: string
  alt: string
  badge?: string
}

const categories: { value: string; label: string; products: Product[] }[] = [
  {
    value: "graos",
    label: "Grãos",
    products: [
      {
        name: "Café Pingado Bourbon Amarelo em Grãos 250g",
        price: "48,90",
        image: "/images/produto-graos-bourbon.png",
        alt: "Pacote kraft de café Pingado Bourbon Amarelo em grãos",
        badge: "Novo produtor",
      },
      {
        name: "Café Pingado Catuaí Vermelho em Grãos 250g",
        price: "44,90",
        image: "/images/produto-graos-catuai.png",
        alt: "Pacote verde escuro de café Pingado Catuaí Vermelho em grãos",
      },
      {
        name: "Microlote Fermentação Natural em Grãos 250g",
        price: "79,90",
        image: "/images/produto-microlote.png",
        alt: "Pacote escuro de microlote Pingado ao lado de grãos crus em pote de vidro",
        badge: "Edição limitada",
      },
      {
        name: "Café Pingado Blend da Casa em Grãos 500g",
        price: "72,90",
        image: "/images/produto-graos-bourbon.png",
        alt: "Pacote kraft de café Pingado Blend da Casa em grãos",
      },
    ],
  },
  {
    value: "moidos",
    label: "Moídos",
    products: [
      {
        name: "Café Pingado Bourbon Amarelo Moído 250g",
        price: "46,90",
        image: "/images/produto-moido.png",
        alt: "Pacote creme de café Pingado moído aberto com pó de café",
      },
      {
        name: "Café Pingado Prensa Francesa Moagem Grossa 250g",
        price: "45,90",
        image: "/images/produto-moido.png",
        alt: "Pacote de café Pingado com moagem grossa para prensa francesa",
      },
      {
        name: "Café Pingado Espresso Moagem Fina 250g",
        price: "49,90",
        image: "/images/produto-graos-catuai.png",
        alt: "Pacote verde escuro de café Pingado com moagem fina para espresso",
        badge: "Novo produtor",
      },
      {
        name: "Café Pingado Coado Moagem Média 500g",
        price: "74,90",
        image: "/images/produto-moido.png",
        alt: "Pacote creme de café Pingado com moagem média para coado",
      },
    ],
  },
  {
    value: "drip",
    label: "Drip Coffee",
    products: [
      {
        name: "Drip Coffee Pingado Mantiqueira Caixa 10un",
        price: "59,90",
        image: "/images/produto-drip.png",
        alt: "Sachês de drip coffee Pingado em embalagem creme e terracota",
      },
      {
        name: "Drip Coffee Pingado Frutado Caixa 10un",
        price: "62,90",
        image: "/images/produto-drip.png",
        alt: "Sachês de drip coffee Pingado de perfil frutado",
        badge: "Novo produtor",
      },
      {
        name: "Drip Coffee Pingado Intenso Caixa 20un",
        price: "109,90",
        image: "/images/produto-drip.png",
        alt: "Caixa com vinte sachês de drip coffee Pingado perfil intenso",
      },
      {
        name: "Kit Degustação Drip Coffee 4 origens",
        price: "89,90",
        image: "/images/produto-drip.png",
        alt: "Kit degustação de drip coffee Pingado com quatro origens",
        badge: "Edição limitada",
      },
    ],
  },
  {
    value: "capsulas",
    label: "Cápsulas",
    products: [
      {
        name: "Cápsulas Pingado Bourbon Caixa 10un",
        price: "39,90",
        image: "/images/produto-capsulas.png",
        alt: "Cápsulas de espresso Pingado em alumínio terracota e dourado",
      },
      {
        name: "Cápsulas Pingado Intenso Caixa 10un",
        price: "41,90",
        image: "/images/produto-capsulas.png",
        alt: "Cápsulas de espresso Pingado perfil intenso",
      },
      {
        name: "Cápsulas Pingado Descafeinado Caixa 10un",
        price: "43,90",
        image: "/images/produto-capsulas.png",
        alt: "Cápsulas de espresso Pingado descafeinado",
        badge: "Novo produtor",
      },
      {
        name: "Cápsulas Pingado Microlote Caixa 10un",
        price: "58,90",
        image: "/images/produto-microlote.png",
        alt: "Cápsulas de microlote raro Pingado em embalagem escura",
        badge: "Edição limitada",
      },
    ],
  },
]

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
                    <a
                      href="#planos"
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
                    </a>
                  </li>
                ))}
              </ul>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
