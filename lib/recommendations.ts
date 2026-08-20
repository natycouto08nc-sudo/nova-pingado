import type { Cafe, PerfilSensorial } from './types';

export function calcularCompatibilidade(cafe: Cafe, perfil: PerfilSensorial): number {
  const atributos: Array<keyof Pick<PerfilSensorial, 'acidez' | 'docura' | 'corpo' | 'amargor' | 'intensidade'>> = [
    'acidez', 'docura', 'corpo', 'amargor', 'intensidade',
  ];

  let totalDiff = 0;
  let count = 0;

  for (const attr of atributos) {
    const cafeVal = cafe[attr as keyof Cafe] as number | null;
    if (cafeVal != null) {
      const diff = Math.abs(cafeVal - perfil[attr]);
      totalDiff += diff;
      count++;
    }
  }

  if (count === 0) return 70;

  const maxDiff = count * 4;
  const similarity = 1 - totalDiff / maxDiff;

  let bonus = 0;
  if (cafe.notas_sensoriais && perfil.preferencias && perfil.preferencias.length > 0) {
    const matches = cafe.notas_sensoriais.filter(nota =>
      perfil.preferencias.some(pref =>
        nota.toLowerCase().includes(pref.toLowerCase()) ||
        pref.toLowerCase().includes(nota.toLowerCase())
      )
    ).length;
    bonus = (matches / Math.max(perfil.preferencias.length, 1)) * 15;
  }

  return Math.min(100, Math.round(similarity * 85 + bonus));
}

export function getCompatibilidadeLabel(score: number): string {
  if (score >= 90) return 'Excelente';
  if (score >= 75) return 'Muito bom';
  if (score >= 60) return 'Bom';
  return 'Regular';
}

export function getCompatibilidadeColor(score: number): string {
  if (score >= 90) return 'text-green-600 bg-green-50';
  if (score >= 75) return 'text-orange-600 bg-orange-50';
  if (score >= 60) return 'text-yellow-600 bg-yellow-50';
  return 'text-gray-600 bg-gray-50';
}

export function obterPerfilDescricao(perfil: { acidez: number; docura: number; corpo: number; amargor: number; intensidade: number }) {
  const { acidez, docura, corpo, amargor, intensidade } = perfil;
  
  if (intensidade >= 4 && amargor >= 4) {
    return {
      nome: 'O Tradicional Intenso',
      detalhes: 'Você prefere cafés encorpados, fortes e com amargor característico marcante. Gosta daquela sensação clássica, robusta e potente que desperta o paladar.'
    };
  }
  if (acidez >= 4 && docura >= 3) {
    return {
      nome: 'O Explorador de Acidez (Frutados)',
      detalhes: 'Seu paladar é refinado para cafés mais cítricos, com acidez brilhante e notas florais ou de frutas frescas. Prefere cafés leves, aromáticos e complexos.'
    };
  }
  if (docura >= 4 && acidez <= 2) {
    return {
      nome: 'O Amante de Caramelo e Chocolates',
      detalhes: 'Para você, o café ideal é naturalmente doce, denso e aveludado, trazendo notas marcantes de caramelo, chocolate ao leite e baixíssimo amargor.'
    };
  }
  if (corpo >= 4) {
    return {
      nome: 'O Aveludado Encorpado',
      detalhes: 'Você valoriza a textura, o peso e a sensação do café na boca. Prefere bebidas cremosas que preenchem o paladar e trazem notas amadeiradas e de castanhas.'
    };
  }
  return {
    nome: 'O Clássico Equilibrado',
    detalhes: 'Seu paladar busca a harmonia perfeita: acidez moderada, doçura agradável e corpo equilibrado. Prefere um café versátil, limpo e suave para qualquer hora do dia.'
  };
}
