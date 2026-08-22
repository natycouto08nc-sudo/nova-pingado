import type { ReferenceProfile, SensoryValues } from './types';

export const SENS_AXES: { key: keyof SensoryValues; label: string; left: string; right: string }[] = [
  { key: 'acidez', label: 'Acidez', left: 'Muito baixa', right: 'Muito alta' },
  { key: 'docura', label: 'Doçura', left: 'Muito seco', right: 'Muito doce' },
  { key: 'corpo', label: 'Corpo', left: 'Muito leve', right: 'Muito encorpado' },
  { key: 'amargor', label: 'Amargor', left: 'Sem amargor', right: 'Muito amargo' },
  { key: 'intensidade', label: 'Intensidade', left: 'Muito suave', right: 'Muito intenso' },
];

export const ROTULOS_INTENSIDADE: Record<number, string> = {
  1: 'muito baixa',
  2: 'baixa',
  3: 'média',
  4: 'alta',
  5: 'muito alta',
};

export const REFERENCE_PROFILES: ReferenceProfile[] = [
  { nome: 'O Tradicional Intenso', assinantes: 412, alvo: { acidez: 2, docura: 3, corpo: 5, amargor: 4, intensidade: 5 }, cor: '#1C2E23' },
  { nome: 'Doce & Frutado', assinantes: 318, alvo: { acidez: 4, docura: 5, corpo: 3, amargor: 1, intensidade: 3 }, cor: '#C0562B' },
  { nome: 'Clássico Equilibrado', assinantes: 526, alvo: { acidez: 3, docura: 3, corpo: 3, amargor: 3, intensidade: 3 }, cor: '#7C6555' },
  { nome: 'Ácido & Floral', assinantes: 187, alvo: { acidez: 5, docura: 4, corpo: 2, amargor: 1, intensidade: 2 }, cor: '#4E7A55' },
];

export const NOTAS_SABOR = [
  'Chocolate', 'Caramelo', 'Castanhas', 'Floral', 'Frutas Vermelhas',
  'Frutas Cítricas', 'Frutas Tropicais', 'Mel', 'Especiarias', 'Baunilha',
];

export const METODOS_PREPARO = ['Em grãos', 'Moído', 'Espresso', 'V60', 'Chemex', 'Aeropress', 'Prensa Francesa', 'Moka'];

export const CERTIFICACOES = [
  'Orgânico', 'Rainforest Alliance', 'Fair Trade', 'Denominação de Origem', 'Mulheres do Café', 'Carbono Neutro',
];

export const TAMANHOS_PRODUTO = ['250g', '500g', '1kg'];

export const CATEGORIAS_PRODUTO = ['Grãos', 'Moídos', 'Drip Coffee', 'Cápsulas'] as const;

export const RESTRICOES_QUIZ = ['Sem torra escura', 'Sem fermentados', 'Somente moído', 'Sem restrições'];

export const PLANOS_ASSINATURA = ['Descoberta', 'Sommelier', 'Colecionador'] as const;

export function getReferenceProfile(nome: string | undefined | null): ReferenceProfile {
  return REFERENCE_PROFILES.find((p) => p.nome === nome) ?? REFERENCE_PROFILES[2];
}

export function pipsFor(valor: number) {
  return [1, 2, 3, 4, 5].map((n) => n <= valor);
}
