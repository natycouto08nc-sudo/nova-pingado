'use client';

import Link from 'next/link';
import { useVendedor, useReservasVendedor } from '@/lib/pingado/vendedor-store';
import { PgEyebrow, PgKpi, PgBadge, PgEmpty } from '@/components/pingado/ui';
import { REFERENCE_PROFILES } from '@/lib/pingado/profiles';
import { matchPct, cafeSensoryValues } from '@/lib/pingado/selection';
import { brl, estrelasTexto } from '@/lib/pingado/format';
import { AVALIACOES_PRODUTO } from '@/lib/pingado/crm-data';

const STATUS_TONE: Record<string, 'success' | 'error' | 'warn'> = {
  Entregue: 'success', Devolvido: 'error', Preparando: 'warn', 'Em transporte': 'warn',
};

function parseValor(v: string) {
  return Number(v.replace(/[^\d,.-]/g, '').replace('.', '').replace(',', '.')) || 0;
}

export default function VisaoGeralVendedor() {
  const { produtorId, saudacaoNome, meusProdutos, pedidos } = useVendedor();
  const { reservas } = useReservasVendedor(produtorId);
  const pendentes = reservas.filter((r) => r.status === 'pendente').length;

  const receitaMes = pedidos.reduce((acc, p) => acc + parseValor(p.valor), 0);

  const meusIds = new Set(meusProdutos.map((p) => p.id));
  const avaliacoesMeus = AVALIACOES_PRODUTO.filter((a) => meusIds.has(a.cafeId));
  const notaMedia = avaliacoesMeus.length ? avaliacoesMeus.reduce((a, b) => a + b.estrelas, 0) / avaliacoesMeus.length : null;

  const matchesPorProduto = meusProdutos.map((p) => Math.max(...REFERENCE_PROFILES.map((pf) => matchPct(cafeSensoryValues(p), pf.alvo))));
  const matchMedio = matchesPorProduto.length ? Math.round(matchesPorProduto.reduce((a, b) => a + b, 0) / matchesPorProduto.length) : null;

  const perfisResumo = REFERENCE_PROFILES.map((perfil) => {
    if (!meusProdutos.length) return { perfil, pct: 0, melhor: null as null | (typeof meusProdutos)[number] };
    const ordenado = [...meusProdutos].sort((a, b) => matchPct(cafeSensoryValues(b), perfil.alvo) - matchPct(cafeSensoryValues(a), perfil.alvo));
    return { perfil, pct: matchPct(cafeSensoryValues(ordenado[0]), perfil.alvo), melhor: ordenado[0] };
  });

  return (
    <div>
      <div className="flex items-end justify-between gap-6 mb-6">
        <div>
          <PgEyebrow>Agosto de 2026</PgEyebrow>
          <h1 className="font-pg-display font-medium text-[36px] leading-[1.05] m-0 text-pg-green">Bom dia, {saudacaoNome}</h1>
          <p className="mt-2 text-[13.5px] text-pg-text-secondary max-w-[54ch]">
            Seus cafés estão na fila de curadoria das caixas de setembro. {pendentes} reserva{pendentes === 1 ? '' : 's'} aguardam sua confirmação.
          </p>
        </div>
        <Link href="/vendedor/cadastrar" className="flex-none border-0 cursor-pointer bg-pg-terracotta hover:bg-pg-terracotta-hover text-white text-[12.5px] px-5 py-3 rounded-[3px] transition-colors">
          Cadastrar novo café
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-[14px] mb-4">
        <PgKpi label="Receita do mês" value={brl(receitaMes)} sub={pedidos.length ? `${pedidos.length} pedidos no período` : 'sem pedidos ainda'} />
        <PgKpi label="Pedidos" value={pedidos.length} sub={pedidos.length ? `ticket médio ${brl(receitaMes / pedidos.length)}` : '—'} />
        <PgKpi label="Nota média" value={notaMedia ? `${notaMedia.toFixed(1).replace('.', ',')} ★` : '—'} sub={avaliacoesMeus.length ? `${avaliacoesMeus.length} avaliações verificadas` : 'sem avaliações ainda'} />
        <PgKpi dark label="Match médio do catálogo" value={matchMedio != null ? `${matchMedio}%` : '—'} sub="com os assinantes ativos" />
      </div>

      <div className="grid grid-cols-[1.55fr_1fr] gap-4 items-start">
        <div className="bg-pg-surface border border-[rgba(28,46,35,.10)] rounded-[3px]">
          <div className="flex items-baseline justify-between px-[18px] pt-4 pb-3 border-b border-[rgba(28,46,35,.09)]">
            <div className="text-[9.5px] tracking-[.16em] uppercase text-pg-text-tertiary">Pedidos recentes</div>
            <Link href="/vendedor/vendas" className="text-[11.5px] text-pg-terracotta">ver todos</Link>
          </div>
          {pedidos.length === 0 ? (
            <div className="px-[18px] py-8 text-sm text-pg-text-secondary">Nenhum pedido registrado ainda.</div>
          ) : (
            pedidos.slice(0, 5).map((o) => (
              <div key={o.id} className="grid grid-cols-[86px_1.5fr_1fr_96px] gap-3 items-center px-[18px] py-[13px] border-b border-[rgba(28,46,35,.06)] text-[12.5px] last:border-b-0">
                <span className="font-mono text-[11px] text-pg-text-secondary">{o.id}</span>
                <span className="text-pg-text truncate">{o.itens}</span>
                <span className="text-pg-text-secondary truncate">{o.cliente}</span>
                <span className="justify-self-end"><PgBadge tone={STATUS_TONE[o.status]}>{o.status}</PgBadge></span>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-pg-surface border border-[rgba(28,46,35,.10)] rounded-[3px] px-[18px] pt-4 pb-[18px]">
            <div className="text-[9.5px] tracking-[.16em] uppercase text-pg-text-tertiary mb-[14px]">Compatibilidade com os perfis de assinante</div>
            {perfisResumo.map(({ perfil, pct, melhor }) => (
              <div key={perfil.nome} className="mb-[13px] last:mb-0">
                <div className="flex justify-between text-[12.5px] mb-[5px]">
                  <span className="text-pg-text">{perfil.nome}</span><span className="text-pg-text-secondary">{pct}%</span>
                </div>
                <div className="h-[5px] rounded-[3px] overflow-hidden bg-[#E7DFD1]">
                  <div className="h-[5px]" style={{ width: `${pct}%`, background: perfil.cor }} />
                </div>
                <div className="text-[10.5px] text-pg-text-tertiary mt-1">
                  {perfil.assinantes} assinantes ativos · melhor café: {melhor ? melhor.nome : '—'}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-pg-accent-bg border border-[rgba(192,86,43,.28)] rounded-[3px] px-[18px] pt-4 pb-[18px]">
            <div className="text-[9.5px] tracking-[.16em] uppercase text-pg-terracotta-text mb-2">Curadoria de setembro</div>
            <div className="font-pg-display text-[21px] text-pg-green leading-[1.25]">{pendentes} lote{pendentes === 1 ? '' : 's'} reservado{pendentes === 1 ? '' : 's'} aguardam você</div>
            <p className="text-xs text-pg-accent-fg mt-2 mb-[14px]">Confirme até 26/08 para entrar no ciclo de torra.</p>
            <Link href="/vendedor/reservas" className="inline-block border-0 cursor-pointer bg-pg-terracotta hover:bg-pg-terracotta-hover text-white text-xs px-4 py-[10px] rounded-[3px] transition-colors">
              Revisar reservas
            </Link>
          </div>
        </div>
      </div>

      {meusProdutos.length === 0 && (
        <div className="mt-4">
          <PgEmpty>Você ainda não cadastrou nenhum café. <Link href="/vendedor/cadastrar" className="text-pg-terracotta">Cadastre o primeiro</Link> para começar a aparecer na curadoria.</PgEmpty>
        </div>
      )}
    </div>
  );
}
