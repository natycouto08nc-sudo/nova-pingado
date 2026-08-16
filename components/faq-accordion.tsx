import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Quais produtos posso assinar?",
    answer:
      "Você pode assinar cafés em grãos, moídos na moagem do seu método, drip coffee em sachês individuais e cápsulas compatíveis. A escolha do formato fica no seu perfil e pode ser trocada a qualquer momento antes do fechamento do ciclo.",
  },
  {
    question: "Como funciona a curadoria por IA?",
    answer:
      "Você responde a um questionário sensorial curto sobre método de preparo, intensidade, acidez e notas preferidas. Nosso algoritmo cruza esse perfil com as fichas de degustação dos lotes disponíveis e monta sua seleção. A cada avaliação que você registra, a recomendação seguinte fica mais precisa.",
  },
  {
    question: "Quais são as formas de pagamento?",
    answer:
      "Aceitamos Pix, cartão de crédito recorrente das principais bandeiras e boleto para o primeiro ciclo. A cobrança da assinatura acontece sempre no mesmo dia do mês em que você começou.",
  },
  {
    question: "Como pausar minha assinatura?",
    answer:
      "Entre na sua área de assinatura, escolha o clube ativo e clique em pausar. Você pode pular um ou mais ciclos sem perder seu perfil sensorial nem o histórico de avaliações — e retomar quando quiser.",
  },
  {
    question: "Como funciona a rastreabilidade dos produtores?",
    answer:
      "Cada pacote traz o nome do produtor, a fazenda, a região, a altitude, a variedade, o processo de beneficiamento e a data da torra. Na sua área de assinatura você também acessa a ficha completa do lote e um vídeo curto gravado na propriedade.",
  },
  {
    question: "Posso cancelar quando quiser?",
    answer:
      "Sim. Não há fidelidade nem multa. O cancelamento é feito em dois cliques na sua área de assinatura e vale a partir do ciclo seguinte — o café já enviado segue normalmente para o seu endereço.",
  },
]

export function FaqAccordion() {
  return (
    <section id="faq" className="bg-muted/50 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <div className="text-center">
          <p className="kicker text-primary">Tire suas dúvidas</p>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-balance md:text-4xl">
            Perguntas frequentes
          </h2>
        </div>

        <Accordion className="mt-12">
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="py-5 font-serif text-lg font-normal">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                <p className="max-w-2xl leading-relaxed text-muted-foreground text-pretty">
                  {faq.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
