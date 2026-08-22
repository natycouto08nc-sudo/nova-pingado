export function brl(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function estrelasTexto(nota: number): string {
  const cheias = Math.round(nota);
  return '★★★★★'.slice(0, cheias) + '☆☆☆☆☆'.slice(0, 5 - cheias);
}
