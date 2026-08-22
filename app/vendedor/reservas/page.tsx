'use client';

import { useReservasVendedor, useVendedor } from '@/lib/pingado/vendedor-store';
import { PgEyebrow, PgBadge, PgEmpty } from '@/components/pingado/ui';
import { getCafeById } from '@/lib/pingado/crm-data';

export default function ReservasCuradoriaPage() {
  const { produtorId } = useVendedor();
  const { reservas, definirStatus } = useReservasVendedor(produtorId);

  return (
    <div>
      <div className="mb-5">
        <PgEyebrow>Caixas de setembro · confirme até 26/08</PgEyebrow>
        <h1 className="font-pg-display font-medium text-[34px] m-0 text-pg-green">Reservas da curadoria</h1>
        <p className="mt-2 text-[13.5px] text-pg-text-secondary max-w-[64ch]">
          A curadoria — por IA ou pela equipe Pingado — reserva lotes dos seus cafés para assinantes com perfil compatível. Você confirma quantidade e prazo de torra.
        </p>
      </div>

      {reservas.length === 0 ? (
        <PgEmpty>Nenhuma reserva de curadoria para o seu catálogo neste ciclo.</PgEmpty>
      ) : (
        <div className="flex flex-col gap-[14px]">
          {reservas.map((r) => {
            const cafe = getCafeById(r.cafeId);
            const pendente = r.status === 'pendente';
            const recusado = r.status === 'recusado';
            return (
              <div
                key={r.id}
                className="bg-pg-surface border rounded-[3px] px-[22px] py-5 grid grid-cols-[1.5fr_1fr_232px] gap-[22px] items-start"
                style={{ borderColor: pendente ? 'rgba(192,86,43,.35)' : 'rgba(28,46,35,.10)' }}
              >
                <div>
                  <div className="flex items-center gap-[10px] mb-2">
                    <PgBadge tone={pendente ? 'accent' : recusado ? 'error' : 'success'}>
                      {pendente ? 'Reserva pendente' : recusado ? 'Recusado' : 'Confirmado'}
                    </PgBadge>
                    <span className="text-[11px] text-pg-text-tertiary">{r.plano} · {r.fonte}</span>
                  </div>
                  <div className="font-pg-display text-2xl text-pg-green">{cafe?.nome ?? r.cafeId}</div>
                  <div className="text-[13px] text-[#5E6A5C] mt-[6px]">{r.qtd} · torra até {r.torraAte}</div>
                  <p className="mt-[10px] text-[12.5px] text-pg-text-secondary leading-[1.55] max-w-[52ch]">{r.motivo}</p>
                </div>

                <div>
                  <div className="text-[9.5px] tracking-[.14em] uppercase text-pg-text-tertiary mb-2">Perfil dos assinantes</div>
                  <div className="text-[13px] text-pg-text">{r.perfilNome}</div>
                  <div className="h-[5px] rounded-[3px] overflow-hidden bg-[#E7DFD1] mt-2"><div className="h-[5px] bg-pg-terracotta" style={{ width: `${r.match}%` }} /></div>
                  <div className="text-[11.5px] text-pg-text-secondary mt-[5px]">{r.match}% de compatibilidade</div>
                  <div className="text-[11.5px] text-pg-text-secondary mt-[10px]">Valor do lote: <span className="text-pg-text">{r.valor}</span></div>
                </div>

                <div className="justify-self-end flex flex-col gap-2 w-full">
                  {pendente ? (
                    <>
                      <button onClick={() => definirStatus(r.id, 'aceito')} className="cursor-pointer border-0 bg-pg-terracotta hover:bg-pg-terracotta-hover text-white text-[12.5px] px-4 py-[11px] rounded-[2px] transition-colors">
                        Confirmar reserva
                      </button>
                      <button onClick={() => definirStatus(r.id, 'recusado')} className="cursor-pointer border border-[rgba(28,46,35,.22)] bg-transparent text-[#3C4A3E] text-[12.5px] px-4 py-[11px] rounded-[2px]">
                        Não consigo atender
                      </button>
                      <span className="text-[11px] text-pg-text-tertiary text-center">expira em {r.expira}</span>
                    </>
                  ) : (
                    <div
                      className="rounded-[2px] px-[14px] py-3 text-[12.5px] text-center"
                      style={recusado ? { border: '1px solid rgba(155,58,44,.28)', background: '#F8EDEB', color: '#9B3A2C' } : { border: '1px solid rgba(63,97,70,.28)', background: '#EAF1E8', color: '#3F6146' }}
                    >
                      {recusado ? 'Você recusou este lote. A curadoria vai realocar.' : 'Reserva confirmada · coleta agendada'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
