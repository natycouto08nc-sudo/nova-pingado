'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { MOCK_CAFES } from '@/lib/coffees';
import { SiteHeader } from '@/components/site-header';
import { PgEyebrow } from '@/components/pingado/ui';
import { matchPct, cafeSensoryValues, melhorPerfilPara } from '@/lib/pingado/selection';
import { REFERENCE_PROFILES, getReferenceProfile } from '@/lib/pingado/profiles';
import { AVALIACOES_PRODUTO } from '@/lib/pingado/crm-data';
import { brl } from '@/lib/pingado/format';
import { useAuth } from '@/context/auth-context';

function notaDoCafe(cafeId: string) {
  const avs = AVALIACOES_PRODUTO.filter((a) => a.cafeId === cafeId);
  if (!avs.length) return null;
  return { nota: avs.reduce((a, b) => a + b.estrelas, 0) / avs.length, count: avs.length };
}

export default function LojaPage() {
  const { role, perfilSensorial } = useAuth();

  const [fPerfil, setFPerfil] = useState<string[]>([]);
  const [fOrigem, setFOrigem] = useState<string[]>([]);
  const [fTorra, setFTorra] = useState<string[]>([]);

  const catalogo = useMemo(() => MOCK_CAFES.filter((c) => c.ativo), []);
  const temSensorial = (c: (typeof catalogo)[number]) => c.acidez != null;

  const perfilClienteNome = perfilSensorial ? getReferenceProfile(
    [...REFERENCE_PROFILES].sort((a, b) => matchPct(perfilSensorial, b.alvo) - matchPct(perfilSensorial, a.alvo))[0].nome,
  ).nome : 'Clássico Equilibrado';
  const alvoCliente = getReferenceProfile(perfilClienteNome).alvo;

  const origens = useMemo(() => [...new Set(catalogo.map((c) => c.regiao).filter(Boolean))] as string[], [catalogo]);
  const torras = useMemo(() => [...new Set(catalogo.map((c) => c.torra).filter(Boolean))] as string[], [catalogo]);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const vitrine = useMemo(() => {
    let itens = catalogo.filter((c) => {
      if (fOrigem.length && !fOrigem.includes(c.regiao ?? '')) return false;
      if (fTorra.length && !fTorra.includes(c.torra ?? '')) return false;
      if (fPerfil.length) {
        if (!temSensorial(c)) return false;
        if (!fPerfil.includes(melhorPerfilPara(c).nome)) return false;
      }
      return true;
    });
    return itens
      .map((c) => ({ cafe: c, match: temSensorial(c) ? matchPct(cafeSensoryValues(c), alvoCliente) : null, avaliacao: notaDoCafe(c.id) }))
      .sort((a, b) => (b.match ?? -1) - (a.match ?? -1));
  }, [catalogo, fOrigem, fTorra, fPerfil, alvoCliente]);

  const limparFiltros = () => { setFPerfil([]); setFOrigem([]); setFTorra([]); };

  return (
    <div className="min-h-screen bg-pg-bg font-pg-ui">
      <SiteHeader />

      <div className="px-[38px] py-[34px] pb-[60px]">
        <div className="flex items-end justify-between gap-6 mb-[22px]">
          <div>
            <PgEyebrow>Vitrine · {vitrine.length} café{vitrine.length === 1 ? '' : 's'}</PgEyebrow>
            <h1 className="font-pg-display font-medium text-[38px] m-0 text-pg-green">Cafés especiais</h1>
            <p className="mt-2 text-[13.5px] text-pg-text-secondary max-w-[56ch]">
              Filtre pelo que o seu paladar pede. {role === 'cliente' && perfilSensorial ? (
                <>Seu perfil sensorial — <strong className="font-medium">{perfilClienteNome}</strong> — já está aplicado na ordenação.</>
              ) : (
                <>Entre na sua conta para aplicar o seu perfil sensorial na ordenação.</>
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[230px_1fr] gap-6 items-start">
          <div className="sticky top-5 flex flex-col gap-5 bg-pg-surface border border-[rgba(28,46,35,.10)] rounded-[3px] px-[18px] pt-[18px] pb-5">
            <div>
              <div className="text-[9.5px] tracking-[.16em] uppercase text-pg-text-tertiary mb-[10px]">Perfil sensorial</div>
              <div className="flex flex-wrap gap-[6px]">
                {REFERENCE_PROFILES.map((p) => (
                  <button key={p.nome} onClick={() => toggle(fPerfil, setFPerfil, p.nome)}
                    className={`cursor-pointer text-left text-[11.5px] px-[11px] py-[7px] rounded-[2px] border transition-colors ${fPerfil.includes(p.nome) ? 'bg-pg-terracotta border-pg-terracotta text-white' : 'bg-pg-field border-[rgba(28,46,35,.18)] text-[#3C4A3E]'}`}>
                    {p.nome}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[9.5px] tracking-[.16em] uppercase text-pg-text-tertiary mb-[10px]">Origem</div>
              <div className="flex flex-col gap-[6px]">
                {origens.map((o) => (
                  <button key={o} onClick={() => toggle(fOrigem, setFOrigem, o)}
                    className={`cursor-pointer text-left text-[11.5px] px-[11px] py-[7px] rounded-[2px] border transition-colors ${fOrigem.includes(o) ? 'bg-pg-terracotta border-pg-terracotta text-white' : 'bg-pg-field border-[rgba(28,46,35,.18)] text-[#3C4A3E]'}`}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[9.5px] tracking-[.16em] uppercase text-pg-text-tertiary mb-[10px]">Torra</div>
              <div className="flex flex-wrap gap-[6px]">
                {torras.map((t) => (
                  <button key={t} onClick={() => toggle(fTorra, setFTorra, t)}
                    className={`cursor-pointer text-[11.5px] px-[11px] py-[7px] rounded-[2px] border transition-colors ${fTorra.includes(t) ? 'bg-pg-terracotta border-pg-terracotta text-white' : 'bg-pg-field border-[rgba(28,46,35,.18)] text-[#3C4A3E]'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={limparFiltros} className="cursor-pointer border border-[rgba(28,46,35,.2)] bg-transparent text-[#3C4A3E] text-[11.5px] py-[9px] rounded-[2px]">
              Limpar filtros
            </button>
          </div>

          <div>
            <div className="text-xs text-pg-text-secondary mb-[14px]">{vitrine.length} resultados</div>
            <div className="grid grid-cols-3 gap-4">
              {vitrine.map(({ cafe, match, avaliacao }) => (
                <Link
                  key={cafe.id}
                  href={`/loja/${cafe.slug}`}
                  className="block bg-pg-surface border border-[rgba(28,46,35,.10)] hover:border-[rgba(192,86,43,.5)] rounded-[3px] overflow-hidden transition-colors"
                >
                  <div
                    className="h-[200px] bg-[#E7DFD1] bg-cover bg-center flex items-center justify-center text-[9px] tracking-[.1em] text-[#A79A88] relative"
                    style={cafe.imagem_url ? { backgroundImage: `url(${cafe.imagem_url})` } : undefined}
                  >
                    {!cafe.imagem_url && 'FOTO DO PRODUTO'}
                    {match != null && (
                      <span className="absolute top-[10px] left-[10px] text-[9.5px] tracking-[.1em] uppercase px-2 py-1 rounded-[2px] bg-pg-green text-pg-cream">
                        {match}% match
                      </span>
                    )}
                  </div>
                  <div className="px-[18px] pt-4 pb-[18px]">
                    <div className="text-[9px] tracking-[.16em] uppercase text-pg-text-tertiary">{cafe.produtores?.nome ?? 'Pingado'}</div>
                    <div className="font-pg-display text-[22px] text-pg-green mt-[5px]">{cafe.nome}</div>
                    <div className="text-[11.5px] text-pg-text-secondary mt-1">
                      {[cafe.regiao, cafe.altitude ? `${cafe.altitude}` : null, cafe.torra ? `torra ${cafe.torra.toLowerCase()}` : null].filter(Boolean).join(' · ')}
                    </div>
                    <div className="flex flex-wrap gap-[5px] mt-[10px]">
                      {(cafe.notas_sensoriais ?? []).slice(0, 2).map((n) => (
                        <span key={n} className="text-[10px] px-[7px] py-[3px] border border-[rgba(28,46,35,.16)] rounded-[2px] text-[#5E6A5C]">{n}</span>
                      ))}
                    </div>
                    <div className="flex items-baseline justify-between mt-[14px]">
                      <span className="text-lg text-pg-terracotta">{cafe.preco != null ? brl(cafe.preco) : '—'}</span>
                      {avaliacao && <span className="text-[11.5px] text-pg-text-tertiary">{avaliacao.nota.toFixed(1).replace('.', ',')} ★ · {avaliacao.count} avaliações</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
