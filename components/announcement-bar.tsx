"use client"

import { useEffect, useState } from "react"

const messages = [
  { text: "GANHE 10% OFF NA SUA PRIMEIRA ASSINATURA", code: "PRIMEIROPINGADO" },
  { text: "FRETE GRÁTIS ACIMA DE R$ 149 NO SUL E SUDESTE", code: "PINGAFRETE" },
  { text: "MICROLOTES DA MANTIQUEIRA RECÉM-TORRADOS TODA SEXTA", code: "SEXTAMICRO" },
]

export function AnnouncementBar() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % messages.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  const current = messages[index]

  return (
    <div className="sticky top-0 z-50 bg-coffee text-coffee-foreground">
      <div
        className="mx-auto flex h-10 max-w-7xl items-center justify-center gap-2 px-4 text-center"
        aria-live="polite"
      >
        <p className="kicker truncate text-[11px] sm:text-xs">
          {current.text}
          <span className="ml-2 rounded-sm bg-gold px-1.5 py-0.5 text-gold-foreground">
            {current.code}
          </span>
        </p>
      </div>
    </div>
  )
}
