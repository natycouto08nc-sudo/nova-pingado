import Image from "next/image"
import { Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const profile = [
  { label: "Notas de sabor", value: "Frutas vermelhas, caramelo, cítrico" },
  { label: "Torra preferida", value: "Média" },
  { label: "Doçura", value: "Alta" },
  { label: "Método", value: "V60 e prensa francesa" },
]

export function AiSommelier() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="kicker text-primary">Curadoria inteligente</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-balance md:text-4xl">
              Conheça o seu Sommelier de IA
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground text-pretty">
              A cada café que você avalia, o algoritmo entende melhor o seu
              paladar: acidez, corpo, doçura e notas que te agradam. Ele cruza
              esse retrato sensorial com as fichas de degustação dos lotes que
              acabaram de chegar dos nossos produtores.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
              O resultado é uma seleção que muda com você — e nunca repete o que
              não te encantou.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="font-serif text-2xl text-primary">3 avaliações</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  é o que basta para a IA acertar seu perfil com precisão
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="font-serif text-2xl text-primary">94%</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  dos assinantes aprovam a segunda curadoria recebida
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/sommelier-degustacao.png"
                alt="Mesa de degustação de café com xícaras de cupping, frutas secas e cacau representando notas sensoriais"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>

            <Card className="relative -mt-16 ml-4 mr-4 shadow-xl sm:ml-12 sm:mr-0 sm:max-w-sm">
              <CardHeader>
                <Badge variant="secondary" className="w-fit">
                  <Sparkles data-icon="inline-start" />
                  Perfil gerado por IA
                </Badge>
                <CardTitle className="font-serif text-xl font-normal">
                  Seu perfil sensorial
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {profile.map((item, index) => (
                  <div key={item.label} className="flex flex-col gap-3">
                    {index > 0 && <Separator />}
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-xs text-muted-foreground">
                        {item.label}
                      </span>
                      <span className="text-right text-sm text-pretty">
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
