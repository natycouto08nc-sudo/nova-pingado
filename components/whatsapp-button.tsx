import { WhatsappIcon } from "@/components/icons/brand-icons"

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5511900000000"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com o atendimento Pingado no WhatsApp"
      className="fixed right-4 bottom-4 z-50 flex size-14 items-center justify-center rounded-full bg-coffee text-coffee-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:bg-primary hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary md:right-6 md:bottom-6"
    >
      <WhatsappIcon className="size-6" />
    </a>
  )
}
