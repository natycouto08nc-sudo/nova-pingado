'use client';

import { useEffect, useState } from 'react';

interface Slot<T> {
  key: string;
  value: T;
  ready: boolean;
}

/**
 * Estado React persistido em localStorage — usado pelas telas do CRM para simular escrita em backend.
 *
 * `key` e `value` ficam num único objeto de estado (Slot) para que a leitura de uma nova chave e a
 * escrita fiquem sempre em sincronia: sem isso, trocar de `key` dispara os efeitos de leitura e escrita
 * juntos e o de escrita — rodando com o valor antigo, ainda em memória — sobrescreve o que acabou de ser
 * lido para a chave nova.
 */
export function useLocalStorageState<T>(key: string, initial: T) {
  const [slot, setSlot] = useState<Slot<T>>({ key, value: initial, ready: false });

  // Leitura: roda sempre que a key muda (inclusive na primeira montagem).
  useEffect(() => {
    let value = initial;
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
      if (raw != null) value = JSON.parse(raw);
    } catch (e) {
      console.error('Erro ao ler estado local:', key, e);
    }
    setSlot({ key, value, ready: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Escrita: só grava quando o slot já corresponde à key atual (evita sobrescrever com valor obsoleto
  // no mesmo ciclo em que a key mudou e a leitura ainda não voltou).
  useEffect(() => {
    if (!slot.ready || slot.key !== key) return;
    try {
      localStorage.setItem(key, JSON.stringify(slot.value));
    } catch (e) {
      console.error('Erro ao salvar estado local:', key, e);
    }
  }, [key, slot]);

  const setValue = (updater: T | ((cur: T) => T)) => {
    setSlot((s) => ({
      ...s,
      value: typeof updater === 'function' ? (updater as (cur: T) => T)(s.value) : updater,
    }));
  };

  return [slot.value, setValue, slot.ready] as const;
}
