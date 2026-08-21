import { Cafe } from './types';
import { MOCK_CAFES } from './coffees';

const FORMATO_LABELS: Record<NonNullable<Cafe['formato']>, string> = {
  graos: 'Grãos',
  moido: 'Moídos',
  drip: 'Drip Coffee',
  capsula: 'Cápsulas',
};

export function getFormatoLabel(cafe: Cafe): string {
  return FORMATO_LABELS[cafe.formato ?? 'graos'];
}

export function getCafeBySlug(slug: string): Cafe | undefined {
  return MOCK_CAFES.find((cafe) => cafe.slug === slug);
}

export function getRelatedCafes(cafe: Cafe, limit = 4): Cafe[] {
  if (cafe.relacionados_ids?.length) {
    return cafe.relacionados_ids
      .map((id) => MOCK_CAFES.find((c) => c.id === id))
      .filter((c): c is Cafe => Boolean(c))
      .slice(0, limit);
  }

  const outros = MOCK_CAFES.filter((c) => c.id !== cafe.id);
  const mesmoFormato = outros.filter((c) => (c.formato ?? 'graos') === (cafe.formato ?? 'graos'));
  const mesmaRegiao = outros.filter(
    (c) => c.regiao && c.regiao === cafe.regiao && !mesmoFormato.includes(c),
  );
  const demais = outros.filter((c) => !mesmoFormato.includes(c) && !mesmaRegiao.includes(c));

  return [...mesmoFormato, ...mesmaRegiao, ...demais].slice(0, limit);
}
