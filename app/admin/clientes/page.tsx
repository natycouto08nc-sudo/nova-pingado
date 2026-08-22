'use client';

import { PgEyebrow, PgPips } from '@/components/pingado/ui';
import { CLIENTES_ASSINANTES } from '@/lib/pingado/crm-data';
import { SENS_AXES } from '@/lib/pingado/profiles';

export default function ClientesEPerfisPage() {
  return (
    <div>
      <div className="mb-5">
        <PgEyebrow>Assinantes ativos</PgEyebrow>
        <h1 className="font-pg-display font-medium text-[34px] m-0 text-pg-green">Clientes e perfis sensoriais</h1>
      </div>

      <div className="grid grid-cols-2 gap-[14px]">
        {CLIENTES_ASSINANTES.map((c) => (
          <div key={c.id} className="bg-pg-surface border border-[rgba(28,46,35,.10)] rounded-[3px] px-5 py-[18px]">
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <div className="text-[15px] text-pg-text">{c.nome}</div>
                <div className="text-[11.5px] text-pg-text-tertiary mt-[3px]">{c.plano} · assinante desde {c.desde}</div>
              </div>
              <span className="text-[9.5px] tracking-[.12em] uppercase px-2 py-[3px] rounded-[2px] bg-pg-success-bg text-pg-success-fg whitespace-nowrap">{c.perfilNome}</span>
            </div>
            <div className="h-px bg-[rgba(28,46,35,.09)] my-[14px]" />
            {SENS_AXES.map((axis) => (
              <div key={axis.key} className="flex items-center justify-between gap-[10px] py-[3px]">
                <span className="text-[11.5px] text-[#5E6A5C]">{axis.label}</span>
                <PgPips value={c.sens[axis.key]} />
              </div>
            ))}
            <div className="flex flex-wrap gap-[5px] mt-3">
              {[...c.restricoes, ...c.tags].map((t) => (
                <span key={t} className="text-[10px] px-[7px] py-[3px] border border-[rgba(28,46,35,.16)] rounded-[2px] text-[#5E6A5C]">{t}</span>
              ))}
            </div>
            <div className="text-[11.5px] text-pg-text-secondary mt-3">Último envio: {c.ultimoEnvio}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
