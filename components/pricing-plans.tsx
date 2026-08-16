import Image from "next/image"
import { Check } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Descoberta",
    price: "89,90",
    description: "Para quem está começando a explorar cafés especiais.",
    benefits: [
      "1 pacote de 250g por mês",
      "Curadoria por IA a cada entrega",
      "Frete fixo com desconto",
      "Pause ou cancele quando quiser",
    ],
    popular: false,
  },
  {
    name: "Sommelier",
    price: "139,90",
    description: "O equilíbrio ideal entre variedade e volume.",
    benefits: [
      "2 pacotes de 250g por mês",
      "Prioridade em lotes exclusivos",
      "Frete grátis para Sul e Sudeste",
      "Perfil sensorial refinado por avaliação",
    ],
    popular: true,
  },
  {
    name: "Colecionador",
    price: "219,90",
    description: "Para quem quer provar o que ninguém provou.",
    benefits: [
      "3 pacotes por mês, incluindo microlotes raros",
      "Acesso antecipado a novos produtores",
      "Frete grátis para todo o Brasil",
      "Fichas de degustação assinadas pelo produtor",
    ],
    popular: false,
  },
]

export function PricingPlans() {
  return (
    <section id="planos" className="relative isolate overflow-hidden bg-coffee">
      <Image
        src="/images/fazenda-mantiqueira.png"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="object-cover opacity-20"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-coffee/70" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="kicker text-gold">Nossos planos</p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-coffee-foreground text-balance md:text-4xl">
            Escolha como quer descobrir seu próximo café
          </h2>
          <p className="mt-4 leading-relaxed text-coffee-foreground/75 text-pretty">
            Planos flexíveis. Pause, troque de café ou cancele quando quiser,
            direto no seu perfil.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3 md:items-start">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative h-full transition-all hover:-translate-y-1 hover:shadow-xl",
                plan.popular && "md:-mt-4 md:pt-10 ring-2 ring-gold",
              )}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-gold-foreground">
                  MAIS POPULAR
                </Badge>
              )}

              <CardHeader>
                <CardTitle className="font-serif text-2xl font-normal">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-pretty">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-6">
                <p className="flex items-end gap-1.5">
                  <span className="text-xs text-muted-foreground">
                    a partir de
                  </span>
                  <span className="font-serif text-3xl leading-none text-primary">
                    R$ {plan.price}
                  </span>
                  <span className="text-xs text-muted-foreground">/mês</span>
                </p>

                <ul className="flex flex-col gap-3">
                  {plan.benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-2.5 text-sm leading-relaxed">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="text-pretty">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="h-11 w-full"
                  variant={plan.popular ? "default" : "outline"}
                  render={<a href="#como-funciona" />}
                >
                  Montar meu clube
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-coffee-foreground/60">
          *Os benefícios variam conforme o plano escolhido. Consulte as
          condições completas na sua área de assinatura.
        </p>
      </div>
    </section>
  )
}
