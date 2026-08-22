import type { Cafe } from '@/lib/types';
import { getCertificacoes, getMetodosPreparo, VENDEDOR_INFO } from './crm-data';
import { getReferenceProfile, REFERENCE_PROFILES } from './profiles';
import type { ClienteAssinante, RegraSelecao, SensoryValues } from './types';

const EIXOS: (keyof SensoryValues)[] = ['acidez', 'docura', 'corpo', 'amargor', 'intensidade'];

export function cafeSensoryValues(cafe: Cafe): SensoryValues {
  return {
    acidez: cafe.acidez ?? 3,
    docura: cafe.docura ?? 3,
    corpo: cafe.corpo ?? 3,
    amargor: cafe.amargor ?? 3,
    intensidade: cafe.intensidade ?? 3,
  };
}

/** matchPct(sensorialProduto, alvoPerfilCliente) — distância máxima = 20 (5 eixos × 4). */
export function matchPct(sens: Partial<SensoryValues>, alvo: SensoryValues): number {
  let d = 0;
  for (const k of EIXOS) d += Math.abs((sens[k] ?? 3) - alvo[k]);
  return Math.round(100 - (d / 20) * 100);
}

export function melhorPerfilPara(cafe: Cafe) {
  const sens = cafeSensoryValues(cafe);
  return [...REFERENCE_PROFILES].sort((a, b) => matchPct(sens, b.alvo) - matchPct(sens, a.alvo))[0];
}

const RESTRICAO_TESTE: Record<string, (cafe: Cafe) => boolean> = {
  'Sem torra escura': (c) => c.torra === 'Escura',
  'Sem fermentados': (c) => (c.processo ?? '').toLowerCase().includes('ferment'),
  'Somente moído': (c) => c.formato !== 'moido',
  'Sem cafeína após 16h': () => false,
};

/** bloqueios(cliente, produto) — regra rígida, nunca ignorada pela IA (a menos que a regra esteja desligada). */
export function bloqueios(cliente: ClienteAssinante, cafe: Cafe, respeitarRestricoes = true): string[] {
  if (!respeitarRestricoes) return [];
  return cliente.restricoes.filter((r) => (RESTRICAO_TESTE[r] ?? (() => false))(cafe));
}

export interface ScoreOpts {
  respeitarRestricoes?: boolean;
}

/** scoreCaixa(cliente, produto) */
export function scoreCaixa(cliente: ClienteAssinante, cafe: Cafe): number {
  const perfil = getReferenceProfile(cliente.perfilNome);
  const base = matchPct(cafeSensoryValues(cafe), perfil.alvo);

  const notas = cafe.notas_sensoriais?.length ?? 0;
  const metodos = getMetodosPreparo(cafe).length;
  const completo = notas >= 2 && metodos > 0 && (cafe.score_sca ?? 0) > 0 ? 4 : -6;

  const vendedor = cafe.produtor_id ? VENDEDOR_INFO[cafe.produtor_id] : undefined;
  const rotatividade = vendedor?.status === 'Teto atingido' ? -5 : 0;

  return Math.max(20, Math.min(99, base + completo + rotatividade));
}

/** sugestao(cliente) = maior scoreCaixa entre produtos sem bloqueio e com estoque > 20. */
export function sugestao(cliente: ClienteAssinante, catalogo: Cafe[], regras?: RegraSelecao[]): Cafe {
  const respeitar = regras ? regras.find((r) => r.id === 'g1')?.on ?? true : true;
  const validos = catalogo.filter((c) => bloqueios(cliente, c, respeitar).length === 0 && (c.estoque ?? 0) > 20);
  const pool = validos.length ? validos : catalogo;
  return pool.slice().sort((a, b) => scoreCaixa(cliente, b) - scoreCaixa(cliente, a))[0];
}

export { getCertificacoes, getMetodosPreparo };
