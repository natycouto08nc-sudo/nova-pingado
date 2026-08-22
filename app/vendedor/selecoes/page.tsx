'use client';

import { useVendedor } from '@/lib/pingado/vendedor-store';
import { PgEyebrow, PgKpi, PgBadge, PgEmpty } from '@/components/pingado/ui';
import { getCafeById } from '@/lib/pingado/crm-data';

const COLS = '90px 1.5fr 1.2fr 1fr .8fr 130px';

export default function SelecoesParaCaixasPage() {
  const { historico, vendedorInfo } = useVendedor();

  const totalSelecoes = historico.reduce((a, h) => a + h.pacotes, 0);
  const iaCount = historico.filter((h) => h.decisao === 'IA').length;
  const pctIA = historico.length ? Math.round((iaCount / historico.length) * 100) : 0;

  return (
    <div>
      <div className="mb-5">
        <PgEyebrow>Histórico de curadoria · {historico.length} registro{historico.length === 1 ? '' : 's'}</PgEyebrow>
        <h1 className="font-pg-display font-medium text-[34px] m-0 text-pg-green">Seleções para caixas</h1>
        <p className="mt-2 text-[13.5px] text-pg-text-secondary max-w-[60ch]">
          Quantas vezes cada café seu foi escolhido para as caixas de assinatura, por quem e com qual critério.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-[14px] mb-4">
        <PgKpi dark label="Total de seleções" value={totalSelecoes} sub="em ciclos mensais" />
        <PgKpi label="Escolhas pela IA" value={`${pctIA}%`} sub={`${100 - pctIA}% override da equipe`} />
        <PgKpi label="Sua fatia de rotatividade" value={`${vendedorInfo.participacaoPct}%`} sub="teto por vendedor: 20%" />
      </div>

      {historico.length === 0 ? (
        <PgEmpty>Nenhuma seleção registrada para o seu catálogo ainda.</PgEmpty>
      ) : (
        <div className="bg-pg-surface border border-[rgba(28,46,35,.10)] rounded-[3px] overflow-hidden">
          <div className="grid gap-3 px-[18px] py-3 border-b border-[rgba(28,46,35,.12)] text-[9.5px] tracking-[.14em] uppercase text-pg-text-tertiary" style={{ gridTemplateColumns: COLS }}>
            <span>Ciclo</span><span>Café</span><span>Perfil atendido</span><span>Plano</span><span>Pacotes</span><span className="justify-self-end">Decisão</span>
          </div>
          {historico.map((h) => (
            <div key={h.id} className="grid gap-3 items-center px-[18px] py-[13px] border-b border-[rgba(28,46,35,.06)] last:border-b-0 text-[12.5px]" style={{ gridTemplateColumns: COLS }}>
              <span className="text-pg-text-secondary">{h.ciclo}</span>
              <span className="text-pg-text">{getCafeById(h.cafeId)?.nome ?? h.cafeId}</span>
              <span className="text-[#5E6A5C]">{h.perfilNome}</span>
              <span className="text-pg-text-secondary">{h.plano}</span>
              <span className="text-pg-text">{h.pacotes}</span>
              <span className="justify-self-end"><PgBadge tone={h.decisao === 'IA' ? 'success' : 'warn'}>{h.decisao}</PgBadge></span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
