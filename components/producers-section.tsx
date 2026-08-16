import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const producers = [
  {
    name: "Antônio Ferreira",
    region: "Serra da Mantiqueira, MG",
    score: "88,5",
    quote:
      "Meu pai plantou esse cafezal em 1974. Hoje eu sei o nome de quem bebe cada saca.",
    image: "/images/produtor-antonio.png",
    alt: "Retrato de Antônio Ferreira, produtor de café, com chapéu de palha em seu cafezal",
  },
  {
    name: "Marlene Duarte",
    region: "Chapada Diamantina, BA",
    score: "87,0",
    quote:
      "Seco meu café no terreiro suspenso, grão por grão. É trabalho de paciência.",
    image: "/images/produtora-marlene.png",
    alt: "Retrato de Marlene Duarte, produtora de café, ao lado de grãos secando no terreiro",
  },
  {
    name: "Joaquim Bispo",
    region: "Alta Mogiana, SP",
    score: "90,2",
    quote:
      "Fermentação natural por 60 horas. O resultado é uma doçura que assusta.",
    image: "/images/produtor-joaquim.png",
    alt: "Retrato de Joaquim Bispo, produtor de café, carregando uma saca de juta na lavoura",
  },
]

export function ProducersSection() {
  return (
    <section id="produtores" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="kicker text-primary">Origem e pertencimento</p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-balance md:text-4xl">
            Saiba quem plantou o café que está na sua xícara
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
            Cada pacote Pingado traz o nome, o rosto e a história de um pequeno
            produtor brasileiro. Eliminamos os atravessadores para pagar um
            preço justo a quem cultiva — e para você provar cafés que não
            existem em prateleira nenhuma.
          </p>
        </div>

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {producers.map((producer) => (
            <li key={producer.name}>
              <Card className="h-full text-center transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="flex flex-col items-center gap-4 pt-2">
                  <div className="relative size-28 overflow-hidden rounded-full border border-border">
                    <Image
                      src={producer.image}
                      alt={producer.alt}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-serif text-xl">{producer.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {producer.region}
                    </p>
                  </div>

                  <p className="kicker text-primary">
                    Pontuação SCA {producer.score}
                  </p>

                  <blockquote className="font-serif text-lg leading-relaxed italic text-foreground/80 text-pretty">
                    &ldquo;{producer.quote}&rdquo;
                  </blockquote>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex justify-center">
          <Button
            variant="outline"
            className="h-11 px-6"
            nativeButton={false}
            render={<a href="#produtos" />}
          >
            Conhecer todos os produtores
          </Button>
        </div>
      </div>
    </section>
  )
}
