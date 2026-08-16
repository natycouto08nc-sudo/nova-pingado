"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  const [sent, setSent] = useState(false)

  return (
    <section id="newsletter" className="py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="rounded-2xl border border-border bg-card px-6 py-12 md:px-14 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14">
            <div>
              <p className="kicker text-primary">Fique por dentro</p>
              <h2 className="mt-4 font-serif text-2xl leading-tight text-balance md:text-3xl">
                Cadastre-se e receba histórias de produtores e novidades da
                Pingado
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground text-pretty">
                Uma carta por mês, sem enrolação: o retrato de um produtor, uma
                dica de preparo e o aviso dos microlotes antes de esgotarem.
              </p>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault()
                setSent(true)
              }}
            >
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="newsletter-nome">Nome</FieldLabel>
                  <Input
                    id="newsletter-nome"
                    name="nome"
                    autoComplete="name"
                    placeholder="Como podemos te chamar?"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="newsletter-email">E-mail</FieldLabel>
                  <Input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="voce@email.com.br"
                    required
                  />
                </Field>

                <Button type="submit" className="h-11 w-full">
                  {sent ? "Cadastro recebido!" : "Cadastrar"}
                </Button>

                <p aria-live="polite" className="text-xs leading-relaxed text-muted-foreground">
                  {sent
                    ? "Pronto! Sua primeira carta chega no próximo envio."
                    : "Ao se cadastrar você concorda em receber comunicações da Pingado. Cancele quando quiser."}
                </p>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
