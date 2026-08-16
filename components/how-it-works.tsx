import Image from "next/image"

const steps = [
  {
    number: "01",
    title: "Responda o Questionário Sensorial",
    description:
      "Conte sobre seu método de preparo (V60, prensa francesa, espresso...), intensidade e notas de sabor preferidas.",
  },
  {
    number: "02",
    title: "Conheça sua Curadoria por IA",
    description:
      "Nosso algoritmo cruza seu perfil com lotes de pequenos produtores parceiros e monta sua primeira seleção.",
  },
  {
    number: "03",
    title: "Receba, Avalie e Evolua",
    description:
      "A cada entrega, avalie o café. A IA aprende com seu feedback e refina as próximas recomendações. Pause, troque ou cancele quando quiser.",
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src="/images/ritual-coar-cafe.png"
              alt="Mãos coando café em um filtro V60 com chaleira de bico fino"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <p className="kicker text-primary">Como funciona?</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-balance md:text-4xl">
              Personalize sua experiência em 3 passos
            </h2>

            <ol className="mt-10 flex flex-col">
              {steps.map((step, index) => (
                <li
                  key={step.number}
                  className="relative flex gap-5 pb-9 last:pb-0"
                >
                  {index < steps.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute top-12 left-[1.375rem] h-[calc(100%-3rem)] w-px bg-border"
                    />
                  )}
                  <span className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-card font-serif text-sm text-primary">
                    {step.number}
                  </span>
                  <div className="pt-1.5">
                    <h3 className="font-serif text-xl">{step.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
