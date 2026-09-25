'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SlidersHorizontal, Star, X } from 'lucide-react';

import { MOCK_CAFES } from '@/lib/coffees';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { matchPct, cafeSensoryValues, melhorPerfilPara } from '@/lib/pingado/selection';
import { REFERENCE_PROFILES, getReferenceProfile } from '@/lib/pingado/profiles';
import { AVALIACOES_PRODUTO } from '@/lib/pingado/crm-data';
import { brl } from '@/lib/pingado/format';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';

function notaDoCafe(cafeId: string) {
  const avs = AVALIACOES_PRODUTO.filter((a) => a.cafeId === cafeId);
  if (!avs.length) return null;
  return { nota: avs.reduce((a, b) => a + b.estrelas, 0) / avs.length, count: avs.length };
}

/** Opção de filtro no mesmo formato de pílula usado nos badges da home. */
function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-background text-foreground/80 hover:border-primary/50 hover:text-foreground',
      )}
    >
      {label}
    </button>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="kicker mb-3 text-muted-foreground">{title}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

export default function LojaPage() {
  const { role, perfilSensorial } = useAuth();

  const [fPerfil, setFPerfil] = useState<string[]>([]);
  const [fOrigem, setFOrigem] = useState<string[]>([]);
  const [fTorra, setFTorra] = useState<string[]>([]);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

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
    const itens = catalogo.filter((c) => {
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

  const totalFiltros = fPerfil.length + fOrigem.length + fTorra.length;
  const limparFiltros = () => { setFPerfil([]); setFOrigem([]); setFTorra([]); };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        {/* Cabeçalho da loja — mesmo padrão de seção da home (kicker + título serifado + apoio) */}
        <section className="border-b border-border/70 bg-muted/50">
          <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
            <p className="kicker text-primary">Loja Pingado</p>
            <h1 className="mt-4 font-serif text-3xl leading-tight text-balance md:text-5xl">
              Cafés especiais de pequenos produtores
            </h1>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground text-pretty">
              {role === 'cliente' && perfilSensorial ? (
                <>
                  Ordenamos a vitrine pelo seu perfil sensorial,{' '}
                  <strong className="font-medium text-foreground">{perfilClienteNome}</strong>. Use os filtros para
                  explorar outros caminhos.
                </>
              ) : (
                <>
                  Filtre pelo que o seu paladar pede.{' '}
                  <Link href="/login" className="text-primary underline underline-offset-4 hover:text-primary/80">
                    Entre na sua conta
                  </Link>{' '}
                  para ordenar os cafés pelo seu perfil sensorial.
                </>
              )}
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
          {/* Barra de filtros no celular */}
          <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
            <Button
              variant="outline"
              className="h-10 px-4"
              onClick={() => setFiltrosAbertos((v) => !v)}
              aria-expanded={filtrosAbertos}
              aria-controls="filtros-loja"
            >
              <SlidersHorizontal data-icon="inline-start" />
              Filtros{totalFiltros > 0 ? ` (${totalFiltros})` : ''}
            </Button>
            <p className="text-sm text-muted-foreground">
              {vitrine.length} café{vitrine.length === 1 ? '' : 's'}
            </p>
          </div>

          <div className="grid items-start gap-8 lg:grid-cols-[260px_1fr] lg:gap-10">
            <aside
              id="filtros-loja"
              aria-label="Filtros"
              className={cn(
                'flex-col gap-7 rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24 lg:flex',
                filtrosAbertos ? 'flex' : 'hidden',
              )}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl">Filtros</h2>
                {totalFiltros > 0 && (
                  <button
                    type="button"
                    onClick={limparFiltros}
                    className="inline-flex cursor-pointer items-center gap-1 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
                  >
                    <X size={14} aria-hidden="true" />
                    Limpar
                  </button>
                )}
              </div>

              <FilterGroup title="Perfil sensorial">
                {REFERENCE_PROFILES.map((p) => (
                  <FilterPill key={p.nome} label={p.nome} active={fPerfil.includes(p.nome)} onClick={() => toggle(fPerfil, setFPerfil, p.nome)} />
                ))}
              </FilterGroup>

              <FilterGroup title="Origem">
                {origens.map((o) => (
                  <FilterPill key={o} label={o} active={fOrigem.includes(o)} onClick={() => toggle(fOrigem, setFOrigem, o)} />
                ))}
              </FilterGroup>

              <FilterGroup title="Torra">
                {torras.map((t) => (
                  <FilterPill key={t} label={t} active={fTorra.includes(t)} onClick={() => toggle(fTorra, setFTorra, t)} />
                ))}
              </FilterGroup>
            </aside>

            <div>
              <p className="mb-5 hidden text-sm text-muted-foreground lg:block">
                {vitrine.length} café{vitrine.length === 1 ? '' : 's'}
                {totalFiltros > 0 ? ' com os filtros escolhidos' : ' disponíveis'}
              </p>

              {vitrine.length === 0 ? (
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
                  <h2 className="font-serif text-2xl">Nenhum café com essa combinação</h2>
                  <p className="max-w-md text-muted-foreground">
                    Tire um ou mais filtros para ver outros cafés da vitrine.
                  </p>
                  <Button variant="outline" className="h-11 px-6" onClick={limparFiltros}>
                    Limpar filtros
                  </Button>
                </div>
              ) : (
                <ul className="grid grid-cols-2 gap-4 md:gap-6 xl:grid-cols-3">
                  {vitrine.map(({ cafe, match, avaliacao }) => (
                    <li key={cafe.id}>
                      <Link
                        href={`/loja/${cafe.slug}`}
                        className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        <div className="relative aspect-square overflow-hidden bg-muted">
                          <Image
                            src={cafe.imagem_url ?? '/placeholder.jpg'}
                            alt={`Pacote de café Pingado ${cafe.nome}`}
                            fill
                            sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 33vw, 45vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
                            {cafe.badge && <Badge className="bg-gold text-gold-foreground">{cafe.badge}</Badge>}
                            {match != null && (
                              <Badge className="bg-secondary text-secondary-foreground">{match}% com seu perfil</Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col gap-3 p-4 md:p-5">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              {cafe.produtores?.nome ?? 'Pingado'}
                              {cafe.regiao ? ` · ${cafe.regiao}` : ''}
                            </p>
                            <h2 className="mt-1 font-serif text-lg leading-snug text-pretty md:text-xl">{cafe.nome}</h2>
                          </div>

                          {(cafe.notas_sensoriais ?? []).length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {(cafe.notas_sensoriais ?? []).slice(0, 2).map((n) => (
                                <Badge key={n} variant="outline" className="font-normal text-muted-foreground">
                                  {n}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="mt-auto flex flex-wrap items-end justify-between gap-2 border-t border-border/60 pt-3">
                            <p className="font-serif text-xl text-primary">{cafe.preco != null ? brl(cafe.preco) : '—'}</p>
                            {avaliacao && (
                              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Star size={12} className="fill-gold text-gold" aria-hidden="true" />
                                {avaliacao.nota.toFixed(1).replace('.', ',')}
                                <span className="sr-only"> de 5,</span> ({avaliacao.count})
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
      <WhatsAppButton />
    </div>
  );
}
