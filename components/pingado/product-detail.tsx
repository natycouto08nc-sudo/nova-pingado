'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Cafe } from '@/lib/types';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { SENS_AXES, REFERENCE_PROFILES, ROTULOS_INTENSIDADE, getReferenceProfile } from '@/lib/pingado/profiles';
import { matchPct, cafeSensoryValues } from '@/lib/pingado/selection';
import { getMetodosPreparo, getCertificacoes, AVALIACOES_PRODUTO } from '@/lib/pingado/crm-data';
import { brl, estrelasTexto } from '@/lib/pingado/format';

export function ProductDetail({ cafe }: { cafe: Cafe }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { perfilSensorial } = useAuth();

  const variantes = cafe.variantes ?? [];
  const primeiraDisponivel = variantes.find((v) => v.disponivel) ?? variantes[0];
  const metodosOpcoes = getMetodosPreparo(cafe).length ? getMetodosPreparo(cafe) : (cafe.moagem_opcoes ?? []);

  const [varianteId, setVarianteId] = useState(primeiraDisponivel?.id);
  const [metodo, setMetodo] = useState(metodosOpcoes[0] ?? '');
  const [adicionado, setAdicionado] = useState(false);

  const varianteSelecionada = variantes.find((v) => v.id === varianteId) ?? primeiraDisponivel;
  const precoUnitario = varianteSelecionada?.preco ?? cafe.preco ?? 0;
  const semEstoque = cafe.estoque === 0;

  const temSensorial = cafe.acidez != null;
  const sens = cafeSensoryValues(cafe);
  const alvoCliente = perfilSensorial ? getReferenceProfile(
    [...REFERENCE_PROFILES].sort((a, b) => matchPct(perfilSensorial, b.alvo) - matchPct(perfilSensorial, a.alvo))[0].nome,
  ).alvo : getReferenceProfile('Clássico Equilibrado').alvo;
  const match = temSensorial ? matchPct(sens, alvoCliente) : null;

  const avaliacoes = AVALIACOES_PRODUTO.filter((a) => a.cafeId === cafe.id);
  const notaMedia = avaliacoes.length ? avaliacoes.reduce((a, b) => a + b.estrelas, 0) / avaliacoes.length : null;

  const certificacoes = getCertificacoes(cafe);

  function handleAdd(comprarAgora: boolean) {
    if (semEstoque) return;
    addItem({
      cafeId: cafe.id, slug: cafe.slug, nome: cafe.nome, imagem: cafe.imagem_url,
      varianteId: varianteSelecionada?.id, varianteLabel: varianteSelecionada?.peso,
      moagem: metodosOpcoes.length ? metodo : undefined,
      precoUnitario, quantidade: 1, estoqueMaximo: cafe.estoque,
    });
    if (comprarAgora) { router.push('/checkout'); return; }
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 2000);
  }

  return (
    <div className="min-h-screen bg-pg-bg font-pg-ui flex flex-col justify-between">
      <div>
        <SiteHeader />

        <div className="px-[38px] py-[22px] pb-[70px]">
        <div className="text-[11.5px] text-pg-text-tertiary mb-5 max-w-[1180px] mx-auto">
          <Link href="/loja" className="hover:text-pg-terracotta">Loja</Link> · {cafe.formato ?? 'Grãos'} · <span className="text-[#5E6A5C]">{cafe.nome}</span>
        </div>

        <div className="grid grid-cols-2 gap-[34px] items-start max-w-[1180px] mx-auto">
          <div className="flex flex-col gap-4">
            <div
              className="h-[420px] rounded-[3px] bg-[#E7DFD1] bg-cover bg-center flex items-center justify-center text-[10px] tracking-[.12em] text-[#A79A88]"
              style={cafe.imagem_url ? { backgroundImage: `url(${cafe.imagem_url})` } : undefined}
            >
              {!cafe.imagem_url && 'FOTO DO PRODUTO'}
            </div>

            <div className="bg-pg-surface border border-[rgba(28,46,35,.10)] rounded-[3px] px-[22px] py-5">
              <div className="font-pg-display text-[22px] text-pg-green mb-[14px]">Perfil sensorial</div>
              {temSensorial ? (
                <>
                  <div className="flex flex-wrap gap-[6px] mb-[18px]">
                    {(cafe.notas_sensoriais ?? []).map((n) => (
                      <span key={n} className="text-[11px] px-[10px] py-[5px] border border-[rgba(28,46,35,.16)] rounded-[2px] text-[#5E6A5C]">{n}</span>
                    ))}
                  </div>
                  {SENS_AXES.map((axis) => (
                    <div key={axis.key} className="grid grid-cols-[88px_1fr_auto] gap-[14px] items-center py-[6px]">
                      <span className="text-[12.5px] text-[#3C4A3E]">{axis.label}</span>
                      <div className="flex gap-[5px]">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <span key={n} className="w-[9px] h-[9px] rounded-full" style={{ background: n <= sens[axis.key] ? '#C0562B' : '#DED5C6' }} />
                        ))}
                      </div>
                      <span className="text-[11px] text-pg-text-tertiary">{ROTULOS_INTENSIDADE[sens[axis.key]]}</span>
                    </div>
                  ))}
                  <div className="h-px bg-[rgba(28,46,35,.09)] my-4" />
                </>
              ) : (
                <p className="text-[12.5px] text-pg-text-secondary mb-4">Este produto ainda não tem ficha sensorial cadastrada.</p>
              )}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Produtor', valor: cafe.produtores?.nome ?? cafe.fazenda ?? '—' },
                  { label: 'Região', valor: cafe.regiao ?? '—' },
                  { label: 'Altitude', valor: cafe.altitude ?? '—' },
                  { label: 'Variedade', valor: cafe.variedade ?? '—' },
                  { label: 'Beneficiamento', valor: cafe.processo ?? '—' },
                  { label: 'Torra', valor: cafe.torra ?? '—' },
                  { label: 'Pontuação SCA', valor: cafe.score_sca ? `${cafe.score_sca} pontos` : 'não informada' },
                  { label: 'Estoque', valor: `${cafe.estoque ?? 0} pacotes` },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-[9.5px] tracking-[.14em] uppercase text-pg-text-tertiary">{s.label}</div>
                    <div className="text-[13px] text-pg-text mt-[3px]">{s.valor}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="text-[9.5px] tracking-[.18em] uppercase text-pg-terracotta-text">Cafés especiais · {cafe.formato ?? 'Grãos'}</div>
            <h1 className="font-pg-display font-medium text-[38px] mt-2 mb-0 text-pg-green leading-[1.1]">{cafe.nome}</h1>
            <p className="mt-[10px] text-[13.5px] text-pg-text-secondary leading-[1.6] max-w-[52ch]">{cafe.descricao}</p>

            <div className="flex items-center gap-[10px] mt-[14px]">
              {notaMedia != null && (
                <>
                  <span className="text-[13px] text-pg-terracotta tracking-[.1em]">{estrelasTexto(notaMedia)}</span>
                  <span className="text-xs text-pg-text-secondary">{notaMedia.toFixed(1).replace('.', ',')} · {avaliacoes.length} avaliações</span>
                </>
              )}
              {match != null && (
                <span className="text-[9.5px] tracking-[.1em] uppercase px-2 py-1 rounded-[2px] bg-pg-green text-pg-cream">{match}% com o seu perfil</span>
              )}
            </div>

            <div className="font-pg-display text-[34px] text-pg-terracotta mt-5">{brl(precoUnitario)}</div>
            <div className="text-[11.5px] text-pg-text-tertiary mt-1">ou 3x de {brl(precoUnitario / 3)} sem juros</div>

            {variantes.length > 0 && (
              <div className="mt-[22px]">
                <div className="text-[10px] tracking-[.14em] uppercase text-pg-text-label mb-2">Tamanho</div>
                <div className="flex gap-2">
                  {variantes.map((v) => (
                    <button key={v.id} disabled={!v.disponivel} onClick={() => setVarianteId(v.id)}
                      className={`cursor-pointer text-[12.5px] px-[18px] py-[9px] rounded-[2px] border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${varianteId === v.id ? 'bg-pg-terracotta border-pg-terracotta text-white' : 'bg-pg-field border-[rgba(28,46,35,.18)] text-[#3C4A3E]'}`}>
                      {v.peso}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {metodosOpcoes.length > 0 && (
              <div className="mt-[18px]">
                <div className="text-[10px] tracking-[.14em] uppercase text-pg-text-label mb-2">Como você quer receber</div>
                <div className="flex flex-wrap gap-2">
                  {metodosOpcoes.map((m) => (
                    <button key={m} onClick={() => setMetodo(m)}
                      className={`cursor-pointer text-xs px-[14px] py-2 rounded-[2px] border transition-colors ${metodo === m ? 'bg-pg-terracotta border-pg-terracotta text-white' : 'bg-pg-field border-[rgba(28,46,35,.18)] text-[#3C4A3E]'}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-[10px] mt-6 max-w-[420px]">
              <button disabled={semEstoque} onClick={() => handleAdd(false)} className="cursor-pointer border-0 bg-pg-green text-pg-cream-2 text-[13px] py-[14px] rounded-[2px] disabled:opacity-50 disabled:cursor-not-allowed">
                {semEstoque ? 'Fora de estoque' : adicionado ? 'Adicionado ✓' : 'Adicionar ao carrinho'}
              </button>
              <button disabled={semEstoque} onClick={() => handleAdd(true)} className="cursor-pointer border border-[rgba(28,46,35,.24)] bg-transparent text-pg-green text-[13px] py-[14px] rounded-[2px] disabled:opacity-50 disabled:cursor-not-allowed">
                Comprar agora
              </button>
            </div>

            <div className="bg-pg-surface border border-[rgba(28,46,35,.10)] rounded-[3px] px-[18px] py-4 mt-[22px] max-w-[420px]">
              <div className="text-[9.5px] tracking-[.14em] uppercase text-pg-text-tertiary mb-2">Produtor</div>
              <div className="text-sm text-pg-text">{cafe.produtores?.nome ?? cafe.fazenda ?? '—'}</div>
              <div className="text-xs text-pg-text-secondary mt-1">{[cafe.regiao, cafe.altitude, cafe.variedade].filter(Boolean).join(' · ')}</div>
              <div className="flex flex-wrap gap-[6px] mt-[10px]">
                {(certificacoes.length ? certificacoes : ['sem certificação declarada']).map((c) => (
                  <span key={c} className="text-[10px] px-2 py-[3px] rounded-[2px] bg-pg-success-bg text-pg-success-fg">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      <SiteFooter />
    </div>
  );
}
