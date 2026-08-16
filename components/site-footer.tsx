import { Star } from "lucide-react"

import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
} from "@/components/icons/brand-icons"
import { Separator } from "@/components/ui/separator"

const columns = [
  {
    title: "Sobre a Pingado",
    links: [
      "Quem somos",
      "Nossa origem",
      "Sustentabilidade",
      "Política de Privacidade",
      "Termos de Uso",
    ],
  },
  {
    title: "Para Produtores",
    links: ["Seja um parceiro", "Como funciona a parceria"],
  },
  {
    title: "Como Comprar",
    links: ["Loja", "Assinatura", "Entrega e Frete", "FAQ"],
  },
  {
    title: "Clube Pingado",
    links: ["Clube de Assinatura", "Cashback"],
  },
  {
    title: "Fale Conosco",
    links: ["WhatsApp", "atendimento@pingado.com.br"],
  },
]

const socials = [
  { label: "Instagram da Pingado", icon: InstagramIcon },
  { label: "Facebook da Pingado", icon: FacebookIcon },
  { label: "YouTube da Pingado", icon: YoutubeIcon },
]

const payments = ["Pix", "Visa", "Mastercard", "Elo", "Boleto"]

export function SiteFooter() {
  return (
    <footer className="bg-coffee text-coffee-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <p className="text-center font-serif text-2xl tracking-[0.32em] md:text-3xl">
          PINGADO
        </p>
        <p className="mt-3 text-center text-sm text-coffee-foreground/60">
          Cafés especiais com nome, rosto e história.
        </p>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="kicker text-gold">{column.title}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#top"
                      className="text-sm leading-relaxed text-coffee-foreground/70 underline-offset-4 transition-colors hover:text-gold hover:underline focus-visible:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-12 bg-coffee-foreground/15" />

        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href="#top"
                aria-label={social.label}
                className="flex size-10 items-center justify-center rounded-full border border-coffee-foreground/20 transition-colors hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <social.icon className="size-4" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex gap-0.5" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="size-4 fill-gold text-gold" />
              ))}
            </div>
            <p className="text-sm text-coffee-foreground/70">
              4,9 de 5 — 3.482 avaliações de assinantes
            </p>
          </div>

          <ul className="flex flex-wrap items-center gap-2">
            {payments.map((payment) => (
              <li
                key={payment}
                className="rounded-md border border-coffee-foreground/20 px-2.5 py-1 text-xs text-coffee-foreground/70"
              >
                {payment}
              </li>
            ))}
          </ul>
        </div>

        <Separator className="my-10 bg-coffee-foreground/15" />

        <div className="flex flex-col gap-1.5 text-center text-xs leading-relaxed text-coffee-foreground/50">
          <p>
            © {new Date().getFullYear()} Pingado Cafés Especiais LTDA. Todos os
            direitos reservados.
          </p>
          <p>CNPJ 12.345.678/0001-90</p>
          <p>
            Rua do Terreiro, 148 — Bairro Serrano, Camanducaia/MG — CEP
            37650-000
          </p>
        </div>
      </div>
    </footer>
  )
}
