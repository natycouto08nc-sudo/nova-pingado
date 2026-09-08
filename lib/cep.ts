export function formatCep(raw: string) {
  const digitos = raw.replace(/\D/g, '').slice(0, 8);
  if (digitos.length <= 5) return digitos;
  return `${digitos.slice(0, 5)}-${digitos.slice(5)}`;
}

export function cepValido(cep: string) {
  return cep.replace(/\D/g, '').length === 8;
}
