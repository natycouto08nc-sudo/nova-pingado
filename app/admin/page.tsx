'use client';

import { useMemo } from 'react';
import { PgEyebrow, PgKpi, PgBadge, PgMatchBar } from '@/components/pingado/ui';
import { CLIENTES_ASSINANTES, catalogoComProdutor, VENDEDOR_INFO } from '@/lib/pingado/crm-data';
import { bloqueios, scoreCaixa, sugestao } from '@/lib/pingado/selection';
import { useAdminCuradoria, useAdminRegras } from '@/lib/pingado/admin-store';

export default function MontagemDasCaixasPage() {
  const { regras, teto } = useAdminRegras();
  const { overrides, trocar, restaurar, rodarIA, aprovarTudo, log } = useAdminCuradoria();
  const catalogo = catalogoComProdutor();

  const caixas = useMemo(() => {
    return CLIENTES_ASSINANTES.map((cliente, i) => {
      const sug = sugestao(cliente, catalogo, regras);
      const overrideId = overrides[cliente.id];
      const escolhido = (overrideId && catalogo.find((c) => c.id === overrideId)) || sug;
      const manual = !!overrideId && overrideId !== sug.id;
      const respeitar = regras.find((r) => r.id === 'g1')?.on ?? true;
      const bl = bloqueios(cliente, escolhido, respeitar);
      const score = scoreCaixa(cliente, escolhido);
      return { cliente, sug, escolhido, manual, bl, score, codigo: 'CX-' + (3101 + i) };
    });
  }, [catalogo, regras, overrides]);

  const overrideCount = caixas.filter((c) => c.manual).length;
  const conflitos = caixas.filter((c) => c.bl.length > 0).length;
  const scoreMedio = caixas.length ? Math.round(caixas.reduce((a, c) => a + c.score, 0) / caixas.length) : 0;

  const contagem = new Map<string, number>();
  caixas.forEach((c) => {
    const id = c.escolhido.produtor_id;
    if (id) contagem.set(id, (contagem.get(id) ?? 0) + 1);
  });
  const nomePorProdutor = new Map<string, string>();
  catalogo.forEach((c) => { if (c.produtor_id && c.produtores?.nome) nomePorProdutor.set(c.produtor_id, c.produtores.nome); });

  const rotatividade = Object.values(VENDEDOR_INFO)
    .map((v) => {
      const pct = caixas.length ? Math.round(((contagem.get(v.produtorId) ?? 0) / caixas.length) * 100) : 0;
      return { ...v, pctCiclo: pct, nome: nomePorProdutor.get(v.produtorId) ?? v.produtorId };
    })
    .sort((a, b) => b.pctCiclo - a.pctCiclo);

  return (
    <div>
      <div className="flex items-end justify-between gap-6 mb-5">
        <div>
          <PgEyebrow>Ciclo setembro/2026 · fecha 26/08</PgEyebrow>
          <h1 className="font-pg-display font-medium text-[34px] m-0 text-pg-green">Montagem das caixas</h1>
          <p className="mt-2 text-[13.5px] text-pg-text-secondary max-w-[66ch]">
            A IA cruza o perfil sensorial de cada assinante com o catálogo, respeitando variedade, restrições e rotatividade entre vendedores. Toda sugestão aceita override manual.
          </p>
        </div>
        <div className="flex gap-[10px] flex-none">
          <button onClick={rodarIA} className="cursor-pointer border border-[rgba(28,46,35,.22)] bg-pg-surface text-pg-green text-[12.5px] px-[18px] py-3 rounded-[3px]">
            Rodar IA novamente
          </button>
          <button onClick={aprovarTudo} className="cursor-pointer border-0 bg-pg-terracotta hover:bg-pg-terracotta-hover text-white text-[12.5px] px-[18px] py-3 rounded-[3px] transition-colors">
            Aprovar ciclo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-[14px] mb-4">
        <PgKpi label="Caixas do ciclo" value={CLIENTES_ASSINANTES.length} sub="assinantes na amostra em revisão" />
        <PgKpi label="Score médio de match" value={`${scoreMedio}%`} sub="meta interna: 85%" />
        <PgKpi label="Overrides manuais" value={overrideCount} sub="registrados neste ciclo" />
        <div className={`rounded-[3px] border px-[18px] pt-[18px] pb-4 ${conflitos ? 'bg-pg-error-bg border-[rgba(155,58,44,.28)]' : 'bg-pg-green border-pg-green'}`}>
          <div className={`text-[9.5px] tracking-[.16em] uppercase ${conflitos ? 'text-pg-error-fg' : 'text-[#8FA394]'}`}>Conflitos de restrição</div>
          <div className={`font-pg-display text-[30px] mt-[10px] ${conflitos ? 'text-pg-error-fg' : 'text-pg-cream'}`}>{conflitos}</div>
          <div className={`text-[11.5px] mt-1 ${conflitos ? 'text-pg-error-fg' : 'text-[#C8A98C]'}`}>{conflitos ? 'revise antes de aprovar' : 'nenhum pendente'}</div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-4 items-start">
        <div className="flex flex-col gap-3">
          {caixas.map(({ cliente, sug, escolhido, manual, bl, score, codigo }) => (
            <div key={cliente.id} className="bg-pg-surface border rounded-[3px] px-5 py-[18px]" style={{ borderColor: bl.length ? 'rgba(155,58,44,.45)' : 'rgba(28,46,35,.10)' }}>
              <div className="grid grid-cols-[1.1fr_1.5fr_1fr] gap-5 items-start">
                <div>
                  <div className="flex items-center gap-[9px] mb-[7px]">
                    <span className="font-mono text-[11px] text-pg-text-secondary">{codigo}</span>
                    <PgBadge tone={manual ? 'warn' : 'success'}>{manual ? 'Override manual' : 'Sugestão da IA'}</PgBadge>
                  </div>
                  <div className="text-[15px] text-pg-text">{cliente.nome}</div>
                  <div className="text-[11.5px] text-pg-text-tertiary mt-[3px]">Plano {cliente.plano} · {cliente.ciclos}º ciclo</div>
                  <div className="text-xs text-[#5E6A5C] mt-[9px]">Perfil: {cliente.perfilNome}</div>
                  <div className="flex flex-wrap gap-[5px] mt-[7px]">
                    {(cliente.restricoes.length ? cliente.restricoes : ['sem restrições']).map((r) => (
                      <span key={r} className="text-[10px] px-[7px] py-[3px] rounded-[2px] bg-pg-error-bg text-pg-error-fg">{r}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[9.5px] tracking-[.14em] uppercase text-pg-text-tertiary mb-[7px]">Café da caixa</div>
                  <div className="font-pg-display text-[21px] text-pg-green">{escolhido.nome}</div>
                  <div className="text-[11.5px] text-pg-text-tertiary mt-[3px]">{escolhido.produtores?.nome ?? '—'} · torra {(escolhido.torra ?? '').toLowerCase()}</div>
                  <div className="flex items-center gap-[9px] mt-[9px]">
                    <PgMatchBar pct={score} width={88} />
                    <span className="text-xs text-pg-text">{score}% de match</span>
                  </div>
                  <p className="mt-[9px] text-xs text-pg-text-secondary leading-[1.5]">
                    {manual
                      ? `Override manual da equipe — a sugestão da IA era ${sug.nome} (${scoreCaixa(cliente, sug)}%).`
                      : `A IA cruzou o perfil ${cliente.perfilNome} com o sensorial do café e respeitou variedade e rotatividade do ciclo.`}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="text-[9.5px] tracking-[.14em] uppercase text-pg-text-tertiary">Override manual</div>
                  <select
                    value={escolhido.id}
                    onChange={(e) => {
                      const novo = catalogo.find((c) => c.id === e.target.value);
                      if (novo) trocar(cliente.nome, cliente.id, novo.id, novo.nome);
                    }}
                    className="border border-[rgba(28,46,35,.18)] bg-pg-field rounded-[2px] px-[11px] py-[9px] text-[12.5px] text-pg-text"
                  >
                    {catalogo.map((p) => (
                      <option key={p.id} value={p.id}>{p.nome} · {p.produtores?.nome ?? '—'} ({scoreCaixa(cliente, p)}%)</option>
                    ))}
                  </select>
                  {bl.length > 0 && (
                    <div className="text-[11px] text-pg-error-fg bg-pg-error-bg border border-[rgba(155,58,44,.24)] rounded-[2px] px-[10px] py-2 leading-[1.45]">
                      Conflito com a restrição &quot;{bl[0]}&quot; do cliente.
                    </div>
                  )}
                  <button onClick={() => restaurar(cliente.nome, cliente.id)} className="cursor-pointer border border-[rgba(28,46,35,.2)] bg-transparent text-[#3C4A3E] text-[11.5px] px-[10px] py-2 rounded-[2px]">
                    Voltar à sugestão da IA
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="sticky top-7 flex flex-col gap-[14px]">
          <div className="bg-pg-green rounded-[3px] px-5 py-[18px] text-pg-cream">
            <div className="text-[9.5px] tracking-[.16em] uppercase text-[#C8A98C] mb-3">Rotatividade entre vendedores</div>
            {rotatividade.map((v) => (
              <div key={v.produtorId} className="mb-[11px] last:mb-0">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-pg-cream truncate pr-2">{v.nome}</span>
                  <span style={{ color: v.pctCiclo > teto ? '#E0806A' : '#C8A98C' }}>{v.pctCiclo}%</span>
                </div>
                <div className="h-1 rounded-[2px] overflow-hidden bg-[rgba(237,230,217,.16)]">
                  <div className="h-1" style={{ width: `${Math.min(100, v.pctCiclo)}%`, background: v.pctCiclo > teto ? '#E0806A' : '#C8A98C' }} />
                </div>
              </div>
            ))}
            <div className="text-[11px] text-[#8FA394] mt-3 leading-[1.5]">Teto de {teto}% por vendedor no ciclo. Acima disso a IA redistribui automaticamente.</div>
          </div>

          <div className="bg-pg-accent-bg border border-[rgba(192,86,43,.28)] rounded-[3px] px-[18px] py-4">
            <div className="text-[9.5px] tracking-[.16em] uppercase text-pg-terracotta-text mb-2">Registro de decisões</div>
            {log.map((l, i) => (
              <div key={i} className="text-[11.5px] text-[#5E4A3C] py-[5px] border-b border-[rgba(192,86,43,.16)] leading-[1.45] last:border-b-0">{l}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
