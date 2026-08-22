'use client';

import { useMemo } from 'react';
import { useLocalStorageState } from './use-local-storage';
import { REGRAS_SELECAO_DEFAULT, LOG_DECISOES_INICIAL } from './crm-data';
import type { RegraSelecao } from './types';

const REGRAS_KEY = 'pingado_admin_regras';
const TETO_KEY = 'pingado_admin_teto';
const INTERVALO_KEY = 'pingado_admin_intervalo';

export function useAdminRegras() {
  const [overrides, setOverrides] = useLocalStorageState<Record<string, boolean>>(REGRAS_KEY, {});
  const [teto, setTeto] = useLocalStorageState<number>(TETO_KEY, 20);
  const [intervalo, setIntervalo] = useLocalStorageState<string>(INTERVALO_KEY, '3 ciclos');

  const regras: RegraSelecao[] = useMemo(
    () => REGRAS_SELECAO_DEFAULT.map((r) => ({ ...r, on: overrides[r.id] ?? r.on })),
    [overrides],
  );

  const toggleRegra = (r: RegraSelecao) => {
    if (r.travada) return;
    setOverrides((cur) => ({ ...cur, [r.id]: !(cur[r.id] ?? r.on) }));
  };

  return { regras, teto, setTeto, intervalo, setIntervalo, toggleRegra };
}

const OVERRIDES_KEY = 'pingado_admin_overrides';
const LOG_KEY = 'pingado_admin_log';

export function useAdminCuradoria() {
  const [overrides, setOverrides] = useLocalStorageState<Record<string, string>>(OVERRIDES_KEY, {});
  const [log, setLog] = useLocalStorageState<string[]>(LOG_KEY, LOG_DECISOES_INICIAL);

  const trocar = (clienteNome: string, clienteId: string, cafeId: string, cafeNome: string) => {
    setOverrides((cur) => ({ ...cur, [clienteId]: cafeId }));
    setLog((cur) => ['agora · override: ' + clienteNome + ' → ' + cafeNome, ...cur].slice(0, 6));
  };

  const restaurar = (clienteNome: string, clienteId: string) => {
    setOverrides((cur) => {
      const next = { ...cur };
      delete next[clienteId];
      return next;
    });
    setLog((cur) => ['agora · ' + clienteNome + ' voltou à sugestão da IA', ...cur].slice(0, 6));
  };

  const rodarIA = () => {
    setOverrides({});
    setLog((cur) => ['agora · IA reprocessou o ciclo com as regras atuais', ...cur].slice(0, 6));
  };

  const aprovarTudo = () => {
    setLog((cur) => ['agora · ciclo aprovado e enviado aos vendedores', ...cur].slice(0, 6));
  };

  return { overrides, trocar, restaurar, rodarIA, aprovarTudo, log };
}
