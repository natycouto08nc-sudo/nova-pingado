import type { PapelUsuario } from './types';

/**
 * Heurística de demonstração usada apenas como fallback do fluxo de login/cadastro.
 * Em produção o papel viria sempre do registro do usuário, nunca do domínio do e-mail.
 */
export function papelDoEmail(email: string): PapelUsuario {
  const e = (email || '').toLowerCase();
  if (e.includes('pingado.com')) return 'admin';
  if (/fazenda|s[ií]tio|caf[eé]|torref|coffee/.test(e)) return 'vendedor';
  return 'cliente';
}

export function emailValido(email: string): boolean {
  return email.includes('@') && email.length > 3;
}

export function cnpjValido(cnpj: string): boolean {
  return cnpj.replace(/\D/g, '').length >= 14;
}
