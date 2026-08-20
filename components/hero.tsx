import Image from "next/image"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      <Image
        src="/images/hero-cafe-manha.png"
        alt="Mesa de café da manhã com xícara fumegante, coador V60 e grãos de café sob luz quente"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-coffee/85 via-coffee/60 to-coffee/20"
      />

      <div className="relative mx-auto flex min-h-[36rem] max-w-7xl flex-col justify-center px-4 py-24 md:min-h-[42rem] md:px-6 md:py-32">
        <div className="max-w-2xl">
          <p className="kicker text-gold">Da roça para a sua xícara</p>

          <h1 className="mt-6 font-serif text-4xl leading-[1.08] text-coffee-foreground text-balance sm:text-5xl md:text-6xl">
            Bem-vindo ao Clube Pingado
          </h1>

          <p className="mt-5 font-serif text-xl italic text-coffee-foreground/90 text-pretty md:text-2xl">
            Seu Sommelier de IA encontra o café perfeito para o seu paladar
          </p>

          <p className="mt-5 max-w-xl leading-relaxed text-coffee-foreground/80 text-pretty">
            Descubra cafés especiais de pequenos produtores brasileiros,
            escolhidos por inteligência artificial de acordo com o seu gosto.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              className="group h-12 px-6 text-base"
              render={<Link href="/onboarding" />}
            >
              Monte meu perfil de sabor
              <ArrowRight
                data-icon="inline-end"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Button>
            <a
              href="#produtores"
              className="text-sm text-coffee-foreground/80 underline underline-offset-4 transition-colors hover:text-gold focus-visible:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:ml-4"
            >
              Conheça nossos produtores
            </a>
          </div>

          <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-coffee-foreground/20 pt-6">
            {[
              { value: "42", label: "produtores parceiros" },
              { value: "86+", label: "pontuação SCA média" },
              { value: "7 dias", label: "da torra à sua casa" },
            ].map((item) => (
              <div key={item.label}>
                <dt className="sr-only">{item.label}</dt>
                <dd>
                  <span className="block font-serif text-2xl text-gold">
                    {item.value}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-coffee-foreground/70">
                    {item.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
