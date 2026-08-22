'use client';

import { PgEyebrow } from '@/components/pingado/ui';
import { PESOS_CRITERIOS } from '@/lib/pingado/crm-data';
import { useAdminRegras } from '@/lib/pingado/admin-store';

const INTERVALOS = ['1 ciclo', '2 ciclos', '3 ciclos', '6 ciclos'];

export default function RegrasDeSelecaoPage() {
  const { regras, teto, setTeto, intervalo, setIntervalo, toggleRegra } = useAdminRegras();

  return (
    <div>
      <div className="mb-5">
        <PgEyebrow>Motor de seleção</PgEyebrow>
        <h1 className="font-pg-display font-medium text-[34px] m-0 text-pg-green">Regras de curadoria</h1>
        <p className="mt-2 text-[13.5px] text-pg-text-secondary max-w-[64ch]">
          Valem para toda seleção automática. A equipe pode sobrepor caso a caso, mas cada override fica registrado.
        </p>
      </div>

      <div className="grid grid-cols-[1.2fr_1fr] gap-4 items-start">
        <div className="flex flex-col gap-3">
          {regras.map((r) => (
            <div key={r.id} className="bg-pg-surface border border-[rgba(28,46,35,.10)] rounded-[3px] px-5 py-[18px] grid grid-cols-[1fr_132px] gap-[18px] items-center">
              <div>
                <div className="text-sm text-pg-text">{r.titulo}</div>
                <p className="mt-[6px] text-[12.5px] text-pg-text-secondary leading-[1.5] max-w-[56ch]">{r.desc}</p>
              </div>
              <div className="justify-self-end flex flex-col items-end gap-2">
                <button
                  onClick={() => toggleRegra(r)}
                  disabled={r.travada}
                  className="cursor-pointer w-[52px] h-[26px] rounded-[14px] border p-[2px] flex items-center disabled:cursor-not-allowed"
                  style={{
                    borderColor: r.on ? '#C0562B' : 'rgba(28,46,35,.18)',
                    background: r.on ? '#C0562B' : '#E7DFD1',
                    justifyContent: r.on ? 'flex-end' : 'flex-start',
                  }}
                >
                  <span className="w-5 h-5 rounded-full block" style={{ background: r.on ? '#fff' : '#FAF6EF' }} />
                </button>
                <span className="text-[11px]" style={{ color: r.on ? '#4E7A55' : '#9C8F7D' }}>
                  {r.travada ? 'obrigatória' : r.on ? 'ativa' : 'inativa'}
                </span>
              </div>
            </div>
          ))}

          <div className="bg-pg-surface border border-[rgba(28,46,35,.10)] rounded-[3px] px-5 py-[18px]">
            <div className="text-sm text-pg-text">Teto de participação por vendedor</div>
            <p className="mt-[6px] mb-3 text-[12.5px] text-pg-text-secondary leading-[1.5]">Percentual máximo das caixas de um ciclo que um único vendedor pode ocupar.</p>
            <div className="flex items-center gap-[14px]">
              <input type="range" min={10} max={60} step={5} value={teto} onChange={(e) => setTeto(Number(e.target.value))} className="flex-1 accent-[#C0562B]" />
              <span className="font-pg-display text-2xl text-pg-green w-14 text-right">{teto}%</span>
            </div>
          </div>

          <div className="bg-pg-surface border border-[rgba(28,46,35,.10)] rounded-[3px] px-5 py-[18px]">
            <div className="text-sm text-pg-text">Intervalo mínimo de repetição</div>
            <p className="mt-[6px] mb-3 text-[12.5px] text-pg-text-secondary leading-[1.5]">Ciclos que um mesmo café precisa esperar antes de voltar para o mesmo assinante.</p>
            <div className="flex gap-2">
              {INTERVALOS.map((i) => (
                <button
                  key={i}
                  onClick={() => setIntervalo(i)}
                  className={`cursor-pointer text-[12.5px] px-[18px] py-[9px] rounded-[2px] border transition-colors ${intervalo === i ? 'bg-pg-terracotta border-pg-terracotta text-white' : 'bg-pg-field border-[rgba(28,46,35,.18)] text-[#3C4A3E]'}`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-pg-green rounded-[3px] px-[22px] py-5 text-pg-cream">
          <div className="text-[9.5px] tracking-[.16em] uppercase text-[#C8A98C] mb-3">Peso dos critérios no score</div>
          {PESOS_CRITERIOS.map((p) => (
            <div key={p.nome} className="mb-[14px] last:mb-0">
              <div className="flex justify-between text-[12.5px] mb-[5px]">
                <span>{p.nome}</span><span className="text-[#C8A98C]">{p.peso}%</span>
              </div>
              <div className="h-[5px] rounded-[3px] overflow-hidden bg-[rgba(237,230,217,.16)]"><div className="h-[5px] bg-pg-terracotta" style={{ width: `${p.peso}%` }} /></div>
            </div>
          ))}
          <div className="h-px bg-[rgba(237,230,217,.14)] my-4" />
          <div className="text-xs text-[#A9BBAA] leading-[1.6]">Última recalibragem em 02/08/2026, com base nas avaliações e na taxa de recompra dos assinantes.</div>
        </div>
      </div>
    </div>
  );
}
