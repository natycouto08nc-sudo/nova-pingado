'use client';

import { PgEyebrow, PgBadge } from '@/components/pingado/ui';
import { catalogoComProdutor, VENDEDOR_INFO } from '@/lib/pingado/crm-data';

const COLS = '1.6fr 1.2fr .7fr .7fr .8fr .9fr 110px';
const STATUS_TONE: Record<string, 'success' | 'error' | 'warn'> = {
  Ativo: 'success', 'Teto atingido': 'error', 'Em avaliação': 'warn',
};

export default function VendedoresAdminPage() {
  const catalogo = catalogoComProdutor();

  const vendedores = Object.values(VENDEDOR_INFO).map((v) => {
    const cafes = catalogo.filter((c) => c.produtor_id === v.produtorId);
    const nome = cafes[0]?.produtores?.nome ?? v.produtorId;
    const regiao = cafes[0]?.produtores?.regiao ?? '—';
    return { ...v, nome, regiao, cafesCount: cafes.length };
  }).sort((a, b) => b.selecoesTotal - a.selecoesTotal);

  return (
    <div>
      <div className="mb-5">
        <PgEyebrow>{vendedores.length} parceiros ativos</PgEyebrow>
        <h1 className="font-pg-display font-medium text-[34px] m-0 text-pg-green">Vendedores</h1>
      </div>

      <div className="bg-pg-surface border border-[rgba(28,46,35,.10)] rounded-[3px] overflow-hidden">
        <div className="grid gap-3 px-[18px] py-3 border-b border-[rgba(28,46,35,.12)] text-[9.5px] tracking-[.14em] uppercase text-pg-text-tertiary" style={{ gridTemplateColumns: COLS }}>
          <span>Vendedor</span><span>Região</span><span>Cafés</span><span>Nota</span><span>Seleções</span><span>Rotatividade</span><span className="justify-self-end">Status</span>
        </div>
        {vendedores.map((v) => (
          <div key={v.produtorId} className="grid gap-3 items-center px-[18px] py-[14px] border-b border-[rgba(28,46,35,.06)] last:border-b-0 text-[12.5px] hover:bg-[#F6F0E6] transition-colors" style={{ gridTemplateColumns: COLS }}>
            <span className="text-pg-text">{v.nome}</span>
            <span className="text-pg-text-secondary">{v.regiao}</span>
            <span className="text-[#5E6A5C]">{v.cafesCount}</span>
            <span className="text-pg-terracotta">{v.nota.toFixed(1).replace('.', ',')} ★</span>
            <span className="text-[#5E6A5C]">{v.selecoesTotal}×</span>
            <div className="flex items-center gap-2">
              <span className="text-pg-text">{v.participacaoPct}%</span>
              <div className="w-10 h-1 rounded-[2px] overflow-hidden bg-[#E7DFD1]">
                <div className="h-1" style={{ width: `${Math.min(100, v.participacaoPct * 4)}%`, background: v.status === 'Teto atingido' ? '#B03A2E' : '#4E7A55' }} />
              </div>
            </div>
            <span className="justify-self-end"><PgBadge tone={STATUS_TONE[v.status]}>{v.status}</PgBadge></span>
          </div>
        ))}
      </div>
    </div>
  );
}
