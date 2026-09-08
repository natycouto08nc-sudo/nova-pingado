import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formata um telefone brasileiro conforme o usuário digita: (XX)XXXXX-XXXX. */
export function formatTelefone(raw: string) {
  const digitos = raw.replace(/\D/g, '').slice(0, 11)
  if (digitos.length === 0) return ''
  if (digitos.length <= 2) return `(${digitos}`
  if (digitos.length <= 7) return `(${digitos.slice(0, 2)})${digitos.slice(2)}`
  return `(${digitos.slice(0, 2)})${digitos.slice(2, 7)}-${digitos.slice(7)}`
}
