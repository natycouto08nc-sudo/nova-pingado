'use client';

import { useMemo } from 'react';
import { useAuth } from '@/context/auth-context';
import type { Cafe } from '@/lib/types';
import { catalogoDoProdutor, PEDIDOS_VENDEDOR, VENDEDOR_INFO, RESERVAS_CURADORIA_SEED, HISTORICO_SELECOES } from './crm-data';
import type { VendedorInfo, ReservaCuradoria, StatusReserva } from './types';
import { useLocalStorageState } from './use-local-storage';

function extrasKey(produtorId: string) {
  return `pingado_produtos_extra_${produtorId}`;
}

/** Cafés cadastrados pelo próprio vendedor durante o protótipo (não fazem parte do catálogo seed). */
export function useProdutosExtras(produtorId: string | null) {
  const [produtos, setProdutos] = useLocalStorageState<Cafe[]>(extrasKey(produtorId ?? 'nenhum'), []);
  const adicionar = (produto: Cafe) => setProdutos((cur) => [produto, ...cur]);
  const salvar = (produto: Cafe) => {
    setProdutos((cur) => {
      const idx = cur.findIndex((p) => p.id === produto.id);
      if (idx !== -1) {
        const next = [...cur];
        next[idx] = produto;
        return next;
      } else {
        return [produto, ...cur];
      }
    });
  };
  return { produtosExtras: produtos, adicionarProduto: adicionar, salvarProduto: salvar };
}

/** Dados agregados do vendedor logado: identidade, catálogo (seed + extras) e infos de rotatividade. */
export function useVendedor() {
  const { user, sellerInfo } = useAuth();
  const produtorId = sellerInfo?.produtorId ?? null;
  const { produtosExtras, adicionarProduto, salvarProduto } = useProdutosExtras(produtorId);

  const meusProdutos = useMemo(() => {
    const base = produtorId ? catalogoDoProdutor(produtorId) : [];
    const extrasIds = new Set(produtosExtras.map((p) => p.id));
    const baseFiltered = base.filter((p) => !extrasIds.has(p.id));
    return [...produtosExtras, ...baseFiltered];
  }, [produtorId, produtosExtras]);

  const vendedorInfo: VendedorInfo = useMemo(() => {
    if (produtorId && VENDEDOR_INFO[produtorId]) return VENDEDOR_INFO[produtorId];
    return {
      produtorId: produtorId ?? '',
      cnpj: sellerInfo?.cnpj ?? '',
      capacidadeTorraKg: Number(sellerInfo?.capacidadeKg) || 0,
      canais: sellerInfo?.canais ?? [],
      nota: 0,
      status: 'Em avaliação',
      verificado: false,
      participacaoPct: 0,
      selecoesTotal: 0,
    };
  }, [produtorId, sellerInfo]);

  const pedidos = useMemo(() => PEDIDOS_VENDEDOR.filter((p) => p.produtorId === produtorId), [produtorId]);
  const historico = useMemo(() => HISTORICO_SELECOES.filter((h) => h.produtorId === produtorId), [produtorId]);

  const nomeVendedor = user?.nome || 'Torrefação';
  const saudacaoNome = nomeVendedor.replace(/^(Torrefação|Torrefacao|Fazenda|Sítio|Sitio|Café|Cafe)\s+/i, '');

  return { produtorId, nomeVendedor, saudacaoNome, meusProdutos, adicionarProduto, salvarProduto, vendedorInfo, pedidos, historico, sellerInfo };
}

const RESERVAS_KEY = 'pingado_reservas_status';

/** Estado (aceito/recusado) das reservas de curadoria, mutável e persistido — simula a confirmação do vendedor. */
export function useReservasVendedor(produtorId: string | null) {
  const [overrides, setOverrides] = useLocalStorageState<Record<string, StatusReserva>>(RESERVAS_KEY, {});

  const reservas: ReservaCuradoria[] = useMemo(() => {
    return RESERVAS_CURADORIA_SEED
      .filter((r) => r.produtorId === produtorId)
      .map((r) => ({ ...r, status: overrides[r.id] ?? r.status }));
  }, [produtorId, overrides]);

  const definirStatus = (id: string, status: StatusReserva) => setOverrides((cur) => ({ ...cur, [id]: status }));

  return { reservas, definirStatus };
}
