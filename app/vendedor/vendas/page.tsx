'use client';

import { useState } from 'react';
import { useVendedor } from '@/lib/pingado/vendedor-store';
import { PgEyebrow, PgBadge, PgChip, PgEmpty } from '@/components/pingado/ui';
import { brl } from '@/lib/pingado/format';

const STATUS_TONE: Record<string, 'success' | 'error' | 'warn'> = {
  Entregue: 'success', Devolvido: 'error', Preparando: 'warn', 'Em transporte': 'warn',
};

const COLS = '90px 78px 1.3fr 1.6fr .9fr .8fr 116px';

function parseValor(v: string) {
  return Number(v.replace(/[^\d,.-]/g, '').replace('.', '').replace(',', '.')) || 0;
}

export default function VendasReceitaPage() {
  const { pedidos, meusProdutos } = useVendedor();
  const [tab, setTab] = useState<'Todas' | 'Loja' | 'Assinatura'>('Todas');

  const filtrados = pedidos.filter((o) => tab === 'Todas' || o.canal === tab);

  const receitaAssinatura = pedidos.filter((o) => o.canal === 'Assinatura').reduce((a, o) => a + parseValor(o.valor), 0);
  const receitaLoja = pedidos.filter((o) => o.canal === 'Loja').reduce((a, o) => a + parseValor(o.valor), 0);
  const receitaTotal = receitaAssinatura + receitaLoja;
  const pctAssinatura = receitaTotal ? Math.round((receitaAssinatura / receitaTotal) * 100) : 0;

  const contagemPorProduto = new Map<string, number>();
  pedidos.forEach((o) => {
    const alvo = meusProdutos.find((p) => o.itens.includes(p.nome));
    if (alvo) contagemPorProduto.set(alvo.nome, (contagemPorProduto.get(alvo.nome) ?? 0) + 1);
  });
  const maisVendido = [...contagemPorProduto.entries()].sort((a, b) => b[1] - a[1])[0];

  const repasse = receitaTotal * 0.82;

  return (
    <div>
      <div className="mb-5">
        <PgEyebrow>Últimos 30 dias</PgEyebrow>
        <h1 className="font-pg-display font-medium text-[34px] m-0 text-pg-green">Vendas e receita</h1>
      </div>

      <div className="flex gap-2 mb-4">
        {(['Todas', 'Loja', 'Assinatura'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`cursor-pointer text-xs px-4 py-2 rounded-[2px] border transition-colors ${tab === t ? 'bg-pg-green border-pg-green text-pg-cream-2' : 'bg-pg-surface border-[rgba(28,46,35,.18)] text-[#3C4A3E]'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {filtrados.length === 0 ? (
        <PgEmpty>Nenhum pedido {tab !== 'Todas' ? `no canal ${tab}` : 'registrado'} ainda.</PgEmpty>
      ) : (
        <div className="bg-pg-surface border border-[rgba(28,46,35,.10)] rounded-[3px] overflow-hidden">
          <div className="grid gap-3 px-[18px] py-3 border-b border-[rgba(28,46,35,.12)] text-[9.5px] tracking-[.14em] uppercase text-pg-text-tertiary" style={{ gridTemplateColumns: COLS }}>
            <span>Pedido</span><span>Data</span><span>Cliente</span><span>Itens</span><span>Canal</span><span>Valor</span><span className="justify-self-end">Status</span>
          </div>
          {filtrados.map((o) => (
            <div key={o.id} className="grid gap-3 items-center px-[18px] py-[13px] border-b border-[rgba(28,46,35,.06)] last:border-b-0 text-[12.5px] hover:bg-[#F6F0E6] transition-colors" style={{ gridTemplateColumns: COLS }}>
              <span className="font-mono text-[11px] text-pg-text-secondary">{o.id}</span>
              <span className="text-pg-text-secondary">{o.data}</span>
              <span className="text-pg-text truncate">{o.cliente}</span>
              <span className="text-[#5E6A5C] truncate">{o.itens}</span>
              <span className="text-pg-text-secondary">{o.canal}</span>
              <span className="text-pg-text">{o.valor}</span>
              <span className="justify-self-end"><PgBadge tone={STATUS_TONE[o.status]}>{o.status}</PgBadge></span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-[14px] mt-4">
        <div className="bg-pg-surface border border-[rgba(28,46,35,.10)] rounded-[3px] px-[18px] py-4">
          <div className="text-[9.5px] tracking-[.16em] uppercase text-pg-text-tertiary">Repasse previsto · 05/09</div>
          <div className="font-pg-display text-[28px] text-pg-green mt-2">{brl(repasse)}</div>
          <div className="text-[11.5px] text-pg-text-secondary mt-1">líquido, após comissão de 18% e fretes</div>
        </div>
        <div className="bg-pg-surface border border-[rgba(28,46,35,.10)] rounded-[3px] px-[18px] py-4">
          <div className="text-[9.5px] tracking-[.16em] uppercase text-pg-text-tertiary">Café mais vendido</div>
          <div className="font-pg-display text-[28px] text-pg-green mt-2">{maisVendido ? maisVendido[0] : '—'}</div>
          <div className="text-[11.5px] text-pg-text-secondary mt-1">{maisVendido ? `${maisVendido[1]} pedido${maisVendido[1] === 1 ? '' : 's'} no período` : 'sem vendas ainda'}</div>
        </div>
        <div className="bg-pg-surface border border-[rgba(28,46,35,.10)] rounded-[3px] px-[18px] py-4">
          <div className="text-[9.5px] tracking-[.16em] uppercase text-pg-text-tertiary">Receita por canal</div>
          <div className="font-pg-display text-[28px] text-pg-green mt-2">{pctAssinatura}% assinatura</div>
          <div className="text-[11.5px] text-pg-text-secondary mt-1">{100 - pctAssinatura}% vitrine avulsa</div>
        </div>
      </div>
    </div>
  );
}
