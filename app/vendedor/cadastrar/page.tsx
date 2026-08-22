'use client';

import { useMemo, useState } from 'react';
import { useVendedor } from '@/lib/pingado/vendedor-store';
import { PgEyebrow, PgChip } from '@/components/pingado/ui';
import {
  SENS_AXES, NOTAS_SABOR, METODOS_PREPARO, CERTIFICACOES, TAMANHOS_PRODUTO, CATEGORIAS_PRODUTO, REFERENCE_PROFILES,
} from '@/lib/pingado/profiles';
import { matchPct } from '@/lib/pingado/selection';
import type { Cafe } from '@/lib/types';
import type { SensoryValues } from '@/lib/pingado/types';

const CATEGORIA_TO_FORMATO: Record<string, Cafe['formato']> = {
  'Grãos': 'graos', 'Moídos': 'moido', 'Drip Coffee': 'drip', 'Cápsulas': 'capsula',
};

const inputCls = 'border border-[rgba(28,46,35,.18)] bg-pg-field rounded-[2px] px-3 py-[10px] text-[13px] text-pg-text focus:outline-none focus:border-pg-terracotta transition-colors';
const inputClsDark = 'border border-[rgba(237,230,217,.22)] bg-pg-green-soft-2 rounded-[2px] px-[13px] py-[11px] text-[13px] text-pg-cream focus:outline-none focus:border-pg-terracotta transition-colors resize-y';

function Field({ label, children, dark }: { label: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <label className="flex flex-col gap-[6px]">
      <span className={`text-[10px] tracking-[.12em] uppercase ${dark ? 'text-[#C8A98C]' : 'text-pg-text-label'}`}>{label}</span>
      {children}
    </label>
  );
}

export default function CadastrarCafePage() {
  const { adicionarProduto, produtorId, nomeVendedor } = useVendedor();

  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState<(typeof CATEGORIAS_PRODUTO)[number]>('Grãos');
  const [preco, setPreco] = useState('79,00');
  const [estoque, setEstoque] = useState('120');
  const [lote, setLote] = useState('60');
  const [tamanhos, setTamanhos] = useState<string[]>(['250g', '500g']);

  const [produtor, setProdutor] = useState('');
  const [regiao, setRegiao] = useState('');
  const [altitude, setAltitude] = useState('');
  const [variedade, setVariedade] = useState('');
  const [processo, setProcesso] = useState('Honey');
  const [torra, setTorra] = useState('Média');
  const [sca, setSca] = useState('');
  const [certs, setCerts] = useState<string[]>([]);

  const [sens, setSens] = useState<SensoryValues>({ acidez: 4, docura: 5, corpo: 3, amargor: 1, intensidade: 3 });
  const [notas, setNotas] = useState<string[]>(['Frutas Vermelhas', 'Mel']);
  const [metodos, setMetodos] = useState<string[]>(['Em grãos', 'V60']);
  const [descricao, setDescricao] = useState('');

  const [salvo, setSalvo] = useState('');

  const toggle = (arr: string[], set: (v: string[]) => void, v: string, max?: number) => {
    if (arr.includes(v)) return set(arr.filter((x) => x !== v));
    if (max && arr.length >= max) return;
    set([...arr, v]);
  };

  const matchLive = useMemo(
    () => [...REFERENCE_PROFILES].map((p) => ({ ...p, pct: Math.max(8, matchPct(sens, p.alvo)) })).sort((a, b) => b.pct - a.pct),
    [sens],
  );

  const faltando: string[] = [];
  if (!nome) faltando.push('o nome');
  if (!sca) faltando.push('a pontuação SCA');
  if (notas.length < 2) faltando.push('mais notas de sabor');
  if (!metodos.length) faltando.push('os métodos de preparo');

  const precoNum = Number(preco.replace(/\./g, '').replace(',', '.')) || 0;

  const publicar = () => {
    if (!produtorId) return;
    const id = 'own-' + Math.random().toString(36).slice(2, 10);
    const slug = nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || id;
    const novo: Cafe = {
      id, produtor_id: produtorId, nome: nome || 'Novo café', descricao: descricao || null,
      regiao: regiao || null, score_sca: sca ? Number(sca) : null,
      acidez: sens.acidez, docura: sens.docura, corpo: sens.corpo, amargor: sens.amargor, intensidade: sens.intensidade,
      notas_sensoriais: notas.length ? notas : null, imagem_url: null, ativo: true, preco: precoNum,
      created_at: new Date().toISOString(), produtores: undefined,
      slug, formato: CATEGORIA_TO_FORMATO[categoria], variantes: tamanhos.map((t) => ({ id: t, peso: t, preco: precoNum, disponivel: true })),
      moagem_opcoes: metodos, origem: 'Brasil', fazenda: produtor || nomeVendedor, variedade: variedade || null,
      processo: processo || null, torra: torra || null, altitude: altitude ? `${altitude}m` : null, safra: String(new Date().getFullYear()),
      estoque: Number(estoque) || 0,
    };
    adicionarProduto(novo);
    setSalvo('Enviado para curadoria · publicado na vitrine em até 2h.');
  };

  return (
    <div>
      <div className="mb-[22px]">
        <PgEyebrow>Novo produto</PgEyebrow>
        <h1 className="font-pg-display font-medium text-[34px] m-0 text-pg-green">Cadastrar café</h1>
        <p className="mt-2 text-[13.5px] text-pg-text-secondary max-w-[62ch]">
          O perfil sensorial usa a mesma escala do quiz de onboarding do cliente — é o que permite à IA cruzar seu café com o paladar de cada assinante.
        </p>
      </div>

      <div className="grid grid-cols-[1fr_336px] gap-5 items-start">
        <div className="flex flex-col gap-4">
          {/* 1 · Produto */}
          <div className="bg-pg-surface border border-[rgba(28,46,35,.10)] rounded-[3px] px-[22px] pt-5 pb-[22px]">
            <div className="text-[9.5px] tracking-[.16em] uppercase text-pg-terracotta-text mb-4">1 · Produto</div>
            <div className="grid grid-cols-[1.6fr_1fr] gap-[14px]">
              <Field label="Nome do café">
                <input className={inputCls} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Catuaí Honey" />
              </Field>
              <Field label="Categoria">
                <select className={inputCls} value={categoria} onChange={(e) => setCategoria(e.target.value as typeof categoria)}>
                  {CATEGORIAS_PRODUTO.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-[14px] mt-[14px]">
              <Field label="Preço 250g (R$)"><input className={inputCls} value={preco} onChange={(e) => setPreco(e.target.value)} /></Field>
              <Field label="Estoque (pacotes)"><input className={inputCls} value={estoque} onChange={(e) => setEstoque(e.target.value)} /></Field>
              <Field label="Lote disponível (kg)"><input className={inputCls} value={lote} onChange={(e) => setLote(e.target.value)} /></Field>
            </div>
            <div className="mt-4">
              <div className="text-[10px] tracking-[.12em] uppercase text-pg-text-label mb-2">Tamanhos oferecidos</div>
              <div className="flex gap-2">
                {TAMANHOS_PRODUTO.map((t) => <PgChip key={t} label={t} active={tamanhos.includes(t)} onClick={() => toggle(tamanhos, setTamanhos, t)} />)}
              </div>
            </div>
            <div className="mt-4">
              <div className="text-[10px] tracking-[.12em] uppercase text-pg-text-label mb-2">Fotos do produto · a primeira vira a capa na vitrine</div>
              <div className="flex gap-[10px]">
                <div className="w-[78px] h-24 border border-dashed border-[rgba(28,46,35,.28)] rounded-[2px] bg-pg-surface-alt flex items-center justify-center text-[9px] tracking-[.08em] text-[#A79A88] text-center px-1.5">ARRASTE<br />A FOTO</div>
                <div className="w-[78px] h-24 border border-dashed border-[rgba(28,46,35,.22)] rounded-[2px] bg-pg-surface-alt" />
                <div className="w-[78px] h-24 border border-dashed border-[rgba(28,46,35,.22)] rounded-[2px] bg-pg-surface-alt" />
              </div>
            </div>
          </div>

          {/* 2 · Origem */}
          <div className="bg-pg-surface border border-[rgba(28,46,35,.10)] rounded-[3px] px-[22px] pt-5 pb-[22px]">
            <div className="text-[9.5px] tracking-[.16em] uppercase text-pg-terracotta-text mb-4">2 · Origem, beneficiamento e certificações</div>
            <div className="grid grid-cols-3 gap-[14px]">
              <Field label="Produtor / sítio"><input className={inputCls} value={produtor} onChange={(e) => setProdutor(e.target.value)} placeholder="Sítio Boa Vista" /></Field>
              <Field label="Região de origem"><input className={inputCls} value={regiao} onChange={(e) => setRegiao(e.target.value)} placeholder="Mantiqueira de Minas" /></Field>
              <Field label="Altitude (m)"><input className={inputCls} value={altitude} onChange={(e) => setAltitude(e.target.value)} placeholder="1.180" /></Field>
            </div>
            <div className="grid grid-cols-4 gap-[14px] mt-[14px]">
              <Field label="Variedade"><input className={inputCls} value={variedade} onChange={(e) => setVariedade(e.target.value)} placeholder="Catuaí Amarelo" /></Field>
              <Field label="Beneficiamento">
                <select className={inputCls} value={processo} onChange={(e) => setProcesso(e.target.value)}>
                  {['Natural', 'Honey', 'Lavado', 'Cereja descascado', 'Fermentação induzida'].map((p) => <option key={p}>{p}</option>)}
                </select>
              </Field>
              <Field label="Tipo de torra">
                <select className={inputCls} value={torra} onChange={(e) => setTorra(e.target.value)}>
                  {['Clara', 'Média-clara', 'Média', 'Média-escura', 'Escura'].map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Pontuação SCA"><input className={inputCls} value={sca} onChange={(e) => setSca(e.target.value)} placeholder="86" /></Field>
            </div>
            <div className="mt-4">
              <div className="text-[10px] tracking-[.12em] uppercase text-pg-text-label mb-2">Certificações</div>
              <div className="flex flex-wrap gap-2">
                {CERTIFICACOES.map((c) => <PgChip key={c} label={c} active={certs.includes(c)} onClick={() => toggle(certs, setCerts, c)} />)}
              </div>
            </div>
          </div>

          {/* 3 · Perfil sensorial */}
          <div className="bg-pg-green rounded-[3px] px-6 pt-[22px] pb-6 text-pg-cream">
            <div className="flex items-baseline justify-between gap-4 mb-[6px]">
              <div className="text-[9.5px] tracking-[.16em] uppercase text-[#C8A98C]">3 · Perfil sensorial</div>
              <div className="text-[11px] text-[#8FA394]">cruzado com o perfil do assinante</div>
            </div>
            <p className="m-0 mb-5 text-[12.5px] text-[#A9BBAA] max-w-[60ch]">Escala de 1 a 5 — a mesma que o cliente responde no onboarding.</p>
            {SENS_AXES.map((axis) => (
              <div key={axis.key} className="grid grid-cols-[120px_1fr] gap-[18px] items-center py-[9px] border-b border-[rgba(237,230,217,.10)]">
                <div className="text-[13px] text-pg-cream">{axis.label}</div>
                <div className="flex items-center gap-[14px]">
                  <span className="text-[9.5px] tracking-[.08em] uppercase text-[#7A8E7C] w-[104px] text-right">{axis.left}</span>
                  <div className="flex gap-[7px]">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} type="button" onClick={() => setSens((s) => ({ ...s, [axis.key]: n }))}
                        className={`cursor-pointer w-[30px] h-[30px] rounded-[2px] text-[11.5px] border transition-colors ${sens[axis.key] === n ? 'bg-pg-terracotta border-pg-terracotta text-white' : 'bg-pg-green-soft-2 border-[rgba(237,230,217,.22)] text-[#A9BBAA]'}`}>
                        {n}
                      </button>
                    ))}
                  </div>
                  <span className="text-[9.5px] tracking-[.08em] uppercase text-[#7A8E7C] w-[104px]">{axis.right}</span>
                </div>
              </div>
            ))}
            <div className="mt-[22px]">
              <div className="text-[10px] tracking-[.12em] uppercase text-[#C8A98C] mb-[10px]">Notas de sabor · até 4</div>
              <div className="flex flex-wrap gap-2">
                {NOTAS_SABOR.map((n) => <PgChip key={n} dark label={n} active={notas.includes(n)} onClick={() => toggle(notas, setNotas, n, 4)} />)}
              </div>
            </div>
            <div className="mt-5">
              <div className="text-[10px] tracking-[.12em] uppercase text-[#C8A98C] mb-[10px]">Métodos de preparo recomendados</div>
              <div className="flex flex-wrap gap-2">
                {METODOS_PREPARO.map((m) => <PgChip key={m} dark label={m} active={metodos.includes(m)} onClick={() => toggle(metodos, setMetodos, m)} />)}
              </div>
            </div>
            <div className="mt-5">
              <Field dark label="Notas do produtor · ficha de degustação">
                <textarea className={inputClsDark} rows={3} value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Processamento honey que realça a doçura natural do grão, com notas de frutas vermelhas." />
              </Field>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={publicar} className="cursor-pointer border-0 bg-pg-terracotta hover:bg-pg-terracotta-hover text-white text-[13px] px-[26px] py-[13px] rounded-[3px] transition-colors">
              Publicar na vitrine e enviar para curadoria
            </button>
            <button type="button" onClick={() => setSalvo('Rascunho salvo localmente.')} className="cursor-pointer border border-[rgba(28,46,35,.22)] bg-transparent text-[#3C4A3E] text-[13px] px-[22px] py-[13px] rounded-[3px]">
              Salvar rascunho
            </button>
            {salvo && <span className="text-xs text-[#4E7A55]">{salvo}</span>}
          </div>
        </div>

        <div className="sticky top-7 flex flex-col gap-[14px]">
          <div className="bg-pg-surface border border-[rgba(28,46,35,.10)] rounded-[3px] overflow-hidden">
            <div className="h-[150px] bg-[#E7DFD1] flex items-center justify-center text-[9px] tracking-[.1em] text-[#A79A88]">PRÉVIA NA VITRINE</div>
            <div className="px-[18px] pt-4 pb-[18px]">
              <div className="text-[9px] tracking-[.16em] uppercase text-pg-text-tertiary">Cafés especiais · {categoria}</div>
              <div className="font-pg-display text-[23px] text-pg-green mt-[6px]">{nome || 'Nome do café'}</div>
              <div className="text-[17px] text-pg-terracotta mt-[6px]">R$ {preco}</div>
              <div className="h-px bg-[rgba(28,46,35,.10)] my-[14px]" />
              <div className="text-[9.5px] tracking-[.14em] uppercase text-pg-text-tertiary mb-[10px]">Perfil sensorial</div>
              <div className="flex flex-wrap gap-[5px] mb-3">
                {(notas.length ? notas : ['sem notas selecionadas']).map((n) => (
                  <span key={n} className="text-[10px] px-2 py-[3px] border border-[rgba(28,46,35,.16)] rounded-[2px] text-[#5E6A5C]">{n}</span>
                ))}
              </div>
              {SENS_AXES.map((axis) => (
                <div key={axis.key} className="flex items-center justify-between gap-[10px] py-[3px]">
                  <span className="text-[11.5px] text-[#5E6A5C]">{axis.label}</span>
                  <div className="flex gap-[3px]">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span key={n} className="w-[6px] h-[6px] rounded-full" style={{ background: n <= sens[axis.key] ? '#C0562B' : '#DED5C6' }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-pg-accent-bg border border-[rgba(192,86,43,.28)] rounded-[3px] px-[18px] pt-4 pb-[18px]">
            <div className="text-[9.5px] tracking-[.16em] uppercase text-pg-terracotta-text mb-[10px]">Match potencial</div>
            <div className="flex items-baseline gap-2">
              <span className="font-pg-display text-[38px] text-pg-green leading-none">{matchLive[0].pct}%</span>
              <span className="text-xs text-pg-accent-fg">com {matchLive[0].nome}</span>
            </div>
            <div className="h-px bg-[rgba(192,86,43,.2)] my-[14px]" />
            {matchLive.map((m) => (
              <div key={m.nome} className="mb-[10px] last:mb-0">
                <div className="flex justify-between text-[11.5px] text-[#4A4A42] mb-1">
                  <span>{m.nome}</span><span>{m.pct}% · {m.assinantes} assinantes</span>
                </div>
                <div className="h-1 rounded-[2px] overflow-hidden bg-[#E3D2C3]"><div className="h-1" style={{ width: `${m.pct}%`, background: m.cor }} /></div>
              </div>
            ))}
            <p className="mt-3 text-[11.5px] text-pg-accent-fg leading-[1.5]">
              {faltando.length ? `Para subir na fila de seleção, complete ${faltando.join(', ')}.` : 'Cadastro completo — este café entra na próxima rodada com prioridade alta.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
