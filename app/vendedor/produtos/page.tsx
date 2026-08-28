'use client';

import Link from 'next/link';
import { useVendedor } from '@/lib/pingado/vendedor-store';
import { PgEyebrow, PgMatchBar, PgEmpty } from '@/components/pingado/ui';
import { REFERENCE_PROFILES } from '@/lib/pingado/profiles';
import { matchPct, cafeSensoryValues } from '@/lib/pingado/selection';
import { getMetodosPreparo, getSelecoesCaixa } from '@/lib/pingado/crm-data';
import { brl } from '@/lib/pingado/format';

const COLS = '2fr .8fr .7fr .6fr 1.2fr .6fr .8fr .6fr';

export default function MeusProdutosPage() {
  const { meusProdutos } = useVendedor();

  const linhas = meusProdutos.map((p) => {
    const match = Math.max(...REFERENCE_PROFILES.map((pf) => matchPct(cafeSensoryValues(p), pf.alvo)));
    const faltando: string[] = [];
    if (!p.notas_sensoriais || p.notas_sensoriais.length < 2) faltando.push('mais notas de sabor');
    if (!getMetodosPreparo(p).length) faltando.push('os métodos de preparo');
    if (!p.score_sca) faltando.push('a pontuação SCA');
    return { p, match, faltando };
  });

  const pior = linhas.length ? [...linhas].sort((a, b) => a.match - b.match)[0] : null;

  return (
    <div>
      <div className="flex items-end justify-between gap-6 mb-[22px]">
        <div>
          <PgEyebrow>Catálogo · {meusProdutos.length} café{meusProdutos.length === 1 ? '' : 's'}</PgEyebrow>
          <h1 className="font-pg-display font-medium text-[34px] m-0 text-pg-green">Meus produtos</h1>
        </div>
        <Link href="/vendedor/cadastrar" className="flex-none border-0 cursor-pointer bg-pg-terracotta hover:bg-pg-terracotta-hover text-white text-[12.5px] px-5 py-3 rounded-[3px] transition-colors">
          Cadastrar novo café
        </Link>
      </div>

      {linhas.length === 0 ? (
        <PgEmpty>Nenhum café cadastrado. <Link href="/vendedor/cadastrar" className="text-pg-terracotta">Cadastre o primeiro</Link>.</PgEmpty>
      ) : (
        <div className="bg-pg-surface border border-[rgba(28,46,35,.10)] rounded-[3px] overflow-hidden">
          <div className="grid gap-[14px] px-[18px] py-3 border-b border-[rgba(28,46,35,.12)] text-[9.5px] tracking-[.14em] uppercase text-pg-text-tertiary" style={{ gridTemplateColumns: COLS }}>
            <span>Café</span><span>Torra</span><span>Preço</span><span>Estoque</span><span>Notas</span><span>Seleções</span><span>Match IA</span><span className="justify-self-end">Ações</span>
          </div>
          {linhas.map(({ p, match }) => (
            <div key={p.id} className="grid gap-[14px] items-center px-[18px] py-[14px] border-b border-[rgba(28,46,35,.06)] last:border-b-0 hover:bg-[#F6F0E6] transition-colors" style={{ gridTemplateColumns: COLS }}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-[38px] h-[46px] flex-none rounded-[2px] bg-[#E7DFD1] bg-cover bg-center flex items-center justify-center text-[8px] tracking-[.08em] text-[#A79A88]" style={p.imagem_url ? { backgroundImage: `url(${p.imagem_url})` } : undefined}>
                  {!p.imagem_url && 'FOTO'}
                </div>
                <div className="min-w-0">
                  <div className="text-[13.5px] text-pg-text truncate">{p.nome}</div>
                  <div className="text-[10.5px] text-pg-text-tertiary truncate">{p.regiao ?? '—'} · {p.altitude ?? '—'}</div>
                </div>
              </div>
              <span className="text-xs text-pg-text-secondary">{p.torra ?? '—'}</span>
              <span className="text-[12.5px] text-pg-text">{p.preco != null ? brl(p.preco) : '—'}</span>
              <span className="text-[12.5px]" style={{ color: (p.estoque ?? 0) < 20 ? '#B03A2E' : '#23231F' }}>{p.estoque ?? 0} un</span>
              <div className="flex flex-wrap gap-[5px]">
                {(p.notas_sensoriais ?? []).slice(0, 2).map((n) => (
                  <span key={n} className="text-[10px] px-[7px] py-[3px] border border-[rgba(28,46,35,.16)] rounded-[2px] text-[#5E6A5C]">{n}</span>
                ))}
              </div>
              <span className="text-[12.5px] text-[#5E6A5C]">{getSelecoesCaixa(p)}×</span>
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-pg-text">{match}%</span>
                <PgMatchBar pct={match} />
              </div>
              <div className="justify-self-end">
                <Link href={`/vendedor/cadastrar?id=${p.id}`} className="text-xs text-pg-terracotta hover:underline font-bold">
                  Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {pior && (
        <div className="bg-pg-surface border border-[rgba(28,46,35,.10)] rounded-[3px] px-[18px] py-4 mt-4">
          <div className="text-[9.5px] tracking-[.16em] uppercase text-pg-text-tertiary mb-2">Sugestão da IA</div>
          <p className="m-0 text-[13px] text-[#4A4A42] leading-[1.55]">
            O <strong className="font-medium">{pior.p.nome}</strong> tem o match mais baixo do catálogo{pior.faltando.length ? ` porque o perfil sensorial está incompleto — faltam ${pior.faltando.join(', ')}` : ''}. Cadastros completos são selecionados até 30% mais vezes para as caixas.
          </p>
        </div>
      )}
    </div>
  );
}
