'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, ChevronRight, ShoppingCart, Star } from 'lucide-react';

import type { Cafe } from '@/lib/types';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { SENS_AXES, REFERENCE_PROFILES, ROTULOS_INTENSIDADE, getReferenceProfile } from '@/lib/pingado/profiles';
import { matchPct, cafeSensoryValues } from '@/lib/pingado/selection';
import { getMetodosPreparo, getCertificacoes, AVALIACOES_PRODUTO } from '@/lib/pingado/crm-data';
import { brl } from '@/lib/pingado/format';
import { cn } from '@/lib/utils';

const FORMATO_LABEL: Record<string, string> = {
  graos: 'Grãos',
  moido: 'Moído',
  drip: 'Drip Coffee',
  capsula: 'Cápsulas',
};

/** Botão de opção (tamanho, moagem) no padrão de pílula da loja. */
function OptionButton({
  children, selected, disabled, onClick,
}: { children: React.ReactNode; selected: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-40',
        selected
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-background text-foreground/80 hover:border-primary/50 hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

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
  const formato = FORMATO_LABEL[cafe.formato ?? 'graos'] ?? cafe.formato ?? 'Grãos';

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

  const ficha = [
    { label: 'Produtor', valor: cafe.produtores?.nome ?? cafe.fazenda ?? '—' },
    { label: 'Região', valor: cafe.regiao ?? '—' },
    { label: 'Altitude', valor: cafe.altitude ?? '—' },
    { label: 'Variedade', valor: cafe.variedade ?? '—' },
    { label: 'Beneficiamento', valor: cafe.processo ?? '—' },
    { label: 'Torra', valor: cafe.torra ?? '—' },
    { label: 'Pontuação SCA', valor: cafe.score_sca ? `${cafe.score_sca} pontos` : 'Não informada' },
    { label: 'Estoque', valor: `${cafe.estoque ?? 0} pacotes` },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
          <nav aria-label="Você está em" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
              <li><Link href="/" className="transition-colors hover:text-primary">Início</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li><Link href="/loja" className="transition-colors hover:text-primary">Loja</Link></li>
              <li aria-hidden="true"><ChevronRight size={14} /></li>
              <li aria-current="page" className="text-foreground">{cafe.nome}</li>
            </ol>
          </nav>

          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Coluna da imagem + ficha técnica */}
            <div className="flex flex-col gap-6">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                <Image
                  src={cafe.imagem_url ?? '/placeholder.jpg'}
                  alt={`Pacote de café Pingado ${cafe.nome}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
                {cafe.badge && (
                  <Badge className="absolute top-4 left-4 bg-gold text-gold-foreground">{cafe.badge}</Badge>
                )}
              </div>

              <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
                <h2 className="font-serif text-2xl">Perfil sensorial</h2>
                {temSensorial ? (
                  <>
                    {(cafe.notas_sensoriais ?? []).length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(cafe.notas_sensoriais ?? []).map((n) => (
                          <Badge key={n} variant="outline" className="h-6 px-3 font-normal text-muted-foreground">{n}</Badge>
                        ))}
                      </div>
                    )}
                    <dl className="mt-6 flex flex-col gap-3">
                      {SENS_AXES.map((axis) => (
                        <div key={axis.key} className="grid grid-cols-[100px_1fr_auto] items-center gap-4">
                          <dt className="text-sm">{axis.label}</dt>
                          <dd className="flex gap-1.5" aria-label={`${sens[axis.key]} de 5`}>
                            {[1, 2, 3, 4, 5].map((n) => (
                              <span
                                key={n}
                                aria-hidden="true"
                                className={cn('size-2.5 rounded-full', n <= sens[axis.key] ? 'bg-primary' : 'bg-muted')}
                              />
                            ))}
                          </dd>
                          <dd className="text-sm text-muted-foreground">{ROTULOS_INTENSIDADE[sens[axis.key]]}</dd>
                        </div>
                      ))}
                    </dl>
                  </>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Este café ainda não tem ficha sensorial cadastrada.
                  </p>
                )}

                <h3 className="mt-8 border-t border-border pt-6 font-serif text-xl">Ficha técnica</h3>
                <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
                  {ficha.map((s) => (
                    <div key={s.label}>
                      <dt className="text-xs text-muted-foreground">{s.label}</dt>
                      <dd className="mt-0.5 text-sm">{s.valor}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>

            {/* Coluna de compra */}
            <div className="lg:sticky lg:top-28">
              <p className="kicker text-primary">Cafés especiais · {formato}</p>
              <h1 className="mt-4 font-serif text-3xl leading-[1.1] text-balance md:text-5xl">{cafe.nome}</h1>

              {(notaMedia != null || match != null) && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {notaMedia != null && (
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <span className="flex" aria-hidden="true">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star key={n} size={14} className={n <= Math.round(notaMedia) ? 'fill-gold text-gold' : 'text-border'} />
                        ))}
                      </span>
                      <span className="sr-only">Nota</span>
                      {notaMedia.toFixed(1).replace('.', ',')} · {avaliacoes.length} {avaliacoes.length === 1 ? 'avaliação' : 'avaliações'}
                    </p>
                  )}
                  {match != null && (
                    <Badge className="bg-secondary text-secondary-foreground">{match}% com o seu perfil</Badge>
                  )}
                </div>
              )}

              {cafe.descricao && (
                <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground text-pretty">{cafe.descricao}</p>
              )}

              <div className="mt-8 border-t border-border pt-6">
                <p className="font-serif text-4xl text-primary">{brl(precoUnitario)}</p>
                <p className="mt-1 text-sm text-muted-foreground">ou 3x de {brl(precoUnitario / 3)} sem juros</p>
              </div>

              {variantes.length > 0 && (
                <fieldset className="mt-7">
                  <legend className="kicker mb-3 text-muted-foreground">Tamanho</legend>
                  <div className="flex flex-wrap gap-2">
                    {variantes.map((v) => (
                      <OptionButton key={v.id} selected={varianteId === v.id} disabled={!v.disponivel} onClick={() => setVarianteId(v.id)}>
                        {v.peso}
                      </OptionButton>
                    ))}
                  </div>
                </fieldset>
              )}

              {metodosOpcoes.length > 0 && (
                <fieldset className="mt-6">
                  <legend className="kicker mb-3 text-muted-foreground">Como você quer receber</legend>
                  <div className="flex flex-wrap gap-2">
                    {metodosOpcoes.map((m) => (
                      <OptionButton key={m} selected={metodo === m} onClick={() => setMetodo(m)}>
                        {m}
                      </OptionButton>
                    ))}
                  </div>
                </fieldset>
              )}

              <div className="mt-8 flex max-w-md flex-col gap-3">
                <Button
                  size="lg"
                  className="h-12 px-6 text-base"
                  disabled={semEstoque}
                  onClick={() => handleAdd(false)}
                >
                  {semEstoque ? (
                    'Fora de estoque'
                  ) : adicionado ? (
                    <><Check data-icon="inline-start" /> Adicionado ao carrinho</>
                  ) : (
                    <><ShoppingCart data-icon="inline-start" /> Adicionar ao carrinho</>
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-6 text-base"
                  disabled={semEstoque}
                  onClick={() => handleAdd(true)}
                >
                  Comprar agora
                </Button>
              </div>

              <section className="mt-8 max-w-md rounded-2xl border border-border bg-card p-6">
                <p className="kicker text-muted-foreground">Quem plantou</p>
                <h2 className="mt-2 font-serif text-xl">{cafe.produtores?.nome ?? cafe.fazenda ?? 'Produtor parceiro'}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {[cafe.regiao, cafe.altitude, cafe.variedade].filter(Boolean).join(' · ')}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(certificacoes.length ? certificacoes : ['Sem certificação declarada']).map((c) => (
                    <Badge key={c} variant="outline" className="font-normal text-muted-foreground">{c}</Badge>
                  ))}
                </div>
                <Link
                  href="/produtores"
                  className="mt-5 inline-block text-sm text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
                >
                  Conheça nossos produtores
                </Link>
              </section>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
      <WhatsAppButton />
    </div>
  );
}
