'use client';

import { useVendedor } from '@/lib/pingado/vendedor-store';
import { PgEyebrow, PgEmpty } from '@/components/pingado/ui';
import { AVALIACOES_PRODUTO, getCafeById } from '@/lib/pingado/crm-data';
import { estrelasTexto } from '@/lib/pingado/format';

export default function AvaliacoesVendedorPage() {
  const { meusProdutos } = useVendedor();
  const meusIds = new Set(meusProdutos.map((p) => p.id));
  const avaliacoes = AVALIACOES_PRODUTO.filter((a) => meusIds.has(a.cafeId));
  const notaMedia = avaliacoes.length ? avaliacoes.reduce((a, b) => a + b.estrelas, 0) / avaliacoes.length : 0;

  return (
    <div>
      <div className="flex items-end justify-between gap-6 mb-[22px]">
        <div>
          <PgEyebrow>{avaliacoes.length} avaliaç{avaliacoes.length === 1 ? 'ão verificada' : 'ões verificadas'}</PgEyebrow>
          <h1 className="font-pg-display font-medium text-[34px] m-0 text-pg-green">Avaliações</h1>
        </div>
        {avaliacoes.length > 0 && (
          <div className="text-right">
            <div className="font-pg-display text-[40px] text-pg-green leading-none">{notaMedia.toFixed(1).replace('.', ',')}</div>
            <div className="text-[13px] text-pg-terracotta tracking-[.14em]">{estrelasTexto(notaMedia)}</div>
          </div>
        )}
      </div>

      {avaliacoes.length === 0 ? (
        <PgEmpty>Nenhuma avaliação registrada para o seu catálogo ainda.</PgEmpty>
      ) : (
        <div className="flex flex-col gap-3">
          {avaliacoes.map((a) => (
            <div key={a.id} className="bg-pg-surface border border-[rgba(28,46,35,.10)] rounded-[3px] px-5 py-[18px] grid grid-cols-[1fr_200px] gap-5 items-start">
              <div>
                <div className="flex items-center gap-[10px]">
                  <span className="text-[13px] text-pg-terracotta tracking-[.1em]">{estrelasTexto(a.estrelas)}</span>
                  <span className="text-[12.5px] text-pg-text">{a.cliente}</span>
                  <span className="text-[11px] text-pg-text-tertiary">· {a.data} · {a.origem}</span>
                </div>
                <p className="mt-[9px] text-[13.5px] text-[#4A4A42] leading-[1.6] max-w-[70ch]">{a.texto}</p>
                <div className="text-[11.5px] text-pg-text-tertiary mt-2">{getCafeById(a.cafeId)?.nome ?? a.cafeId} · preparo {a.metodo}</div>
              </div>
              <div className="justify-self-end text-right">
                <div className="text-[9.5px] tracking-[.14em] uppercase text-pg-text-tertiary">Perfil do cliente</div>
                <div className="text-[12.5px] text-[#5E6A5C] mt-[5px]">{a.perfilCliente}</div>
                <div className="text-[11.5px] text-pg-text-secondary mt-2">match do envio: {a.match}%</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
