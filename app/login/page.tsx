'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { SENS_AXES, REFERENCE_PROFILES, PLANOS_ASSINATURA, RESTRICOES_QUIZ, pipsFor } from '@/lib/pingado/profiles';
import { matchPct } from '@/lib/pingado/selection';
import { emailValido } from '@/lib/pingado/auth-helpers';
import type { PapelUsuario, PlanoAssinatura, SensoryValues } from '@/lib/pingado/types';

type Passo = 'email' | 'metodo' | 'senha' | 'enviado' | 'cadastro' | 'quiz' | 'loja' | 'pronto';
type ContaTipo = 'cliente' | 'vendedor';

const VOLTAR: Partial<Record<Passo, Passo>> = {
  metodo: 'email', senha: 'metodo', enviado: 'metodo', cadastro: 'email', quiz: 'cadastro', loja: 'cadastro',
};

const PASSOS_TEXTO: Record<Passo, { titulo: string; headline: string; sub: string }> = {
  email: { titulo: 'Entrar ou criar conta', headline: 'Login', sub: 'Informe seu e-mail. Você escolhe se prefere senha ou um link de acesso — sem senha nenhuma.' },
  metodo: { titulo: 'Como você quer entrar', headline: 'Escolha seu acesso', sub: 'Duas formas de entrar na sua conta. O link mágico é o caminho mais rápido.' },
  senha: { titulo: 'Entrar com senha', headline: 'Sua senha', sub: 'Digite a senha da sua conta.' },
  enviado: { titulo: 'Link enviado', headline: 'Verifique seu e-mail', sub: 'Enviamos um link de acesso. Abaixo, a simulação do e-mail que você receberia.' },
  cadastro: { titulo: 'Criar conta', headline: 'Criar conta', sub: 'Leva menos de um minuto. Depois você escolhe se quer senha ou só link mágico.' },
  quiz: { titulo: 'Criar conta · perfil sensorial', headline: 'Seu paladar', sub: 'Responda de 1 a 5 — é isso que a IA usa para escolher os cafés das suas caixas.' },
  loja: { titulo: 'Criar conta · sua torrefação', headline: 'Dados da torrefação', sub: 'Precisamos disso para liberar seu painel e o repasse das vendas.' },
  pronto: { titulo: 'Conta criada', headline: 'Tudo pronto', sub: 'Sua conta já está ativa — nos próximos acessos você entra por senha ou link mágico.' },
};

const DEMOS: { email: string; tipo: string }[] = [
  { email: 'contato@sitiobomjesus.com.br', tipo: 'Vendedor' },
  { email: 'marina.prado@email.com', tipo: 'Cliente' },
  { email: 'curadoria@pingado.com.br', tipo: 'Admin' },
];

function rotaDoPapel(papel: PapelUsuario) {
  if (papel === 'vendedor') return '/vendedor';
  if (papel === 'admin') return '/admin';
  return '/loja';
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-[7px]">
      <span className="text-[10px] tracking-[0.12em] uppercase text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

const inputCls = 'border border-border bg-background rounded-2xl px-[14px] py-[13px] text-sm text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:border-primary transition-colors';

function ErroBox({ erro }: { erro: string }) {
  if (!erro) return null;
  return (
    <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-full px-[11px] py-[9px]">
      {erro}
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer text-xs px-[12px] py-[8px] rounded-full border transition-colors ${
        active ? 'bg-primary border-primary text-white' : 'bg-background border-border text-foreground'
      }`}
    >
      {label}
    </button>
  );
}

function Dots({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-[6px]">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`cursor-pointer w-7 h-7 rounded-full text-[11.5px] border transition-colors ${
            value === n ? 'bg-primary border-primary text-white' : 'bg-background border-border text-muted-foreground'
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { papelDoEmail, entrarComSenha, entrarComLinkMagico, cadastrarCliente, cadastrarVendedor } = useAuth();

  const [passo, setPasso] = useState<Passo>('email');
  const [abaAtiva, setAbaAtiva] = useState<'email' | 'cadastro'>('email');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const [contaTipo, setContaTipo] = useState<ContaTipo>('cliente');
  const [contaNome, setContaNome] = useState('');
  const [contaApelido, setContaApelido] = useState('');
  const [contaSenha, setContaSenha] = useState('');
  const [semSenha, setSemSenha] = useState(false);
  const [contaPlano, setContaPlano] = useState<PlanoAssinatura>('Descoberta');

  const [quiz, setQuiz] = useState<SensoryValues>({ acidez: 3, docura: 3, corpo: 3, amargor: 3, intensidade: 3 });
  const [quizRestricoes, setQuizRestricoes] = useState<string[]>([]);

  const [lojaRegiao, setLojaRegiao] = useState('');
  const [lojaCnpj, setLojaCnpj] = useState('');
  const [lojaCapacidade, setLojaCapacidade] = useState('');
  const [lojaCanais, setLojaCanais] = useState<('Vitrine' | 'Assinatura')[]>(['Vitrine', 'Assinatura']);

  const [pronto, setPronto] = useState<{ papel: PapelUsuario; perfilNome?: string } | null>(null);

  const papel = useMemo(() => papelDoEmail(email), [email, papelDoEmail]);
  const perfilDetectado = papel === 'vendedor' ? 'vendedor' : papel === 'admin' ? 'admin (equipe Pingado)' : 'cliente assinante';
  const melhorPerfilQuiz = useMemo(
    () => [...REFERENCE_PROFILES].sort((a, b) => matchPct(quiz, b.alvo) - matchPct(quiz, a.alvo))[0],
    [quiz],
  );

  const podeVoltar = passo !== 'email' && passo !== 'pronto';
  const voltar = () => { setErro(''); setPasso(VOLTAR[passo] ?? 'email'); };
  const irAba = (aba: 'email' | 'cadastro') => { setAbaAtiva(aba); setPasso(aba); setErro(''); };

  const toggleRestricao = (r: string) =>
    setQuizRestricoes((cur) => (cur.includes(r) ? cur.filter((x) => x !== r) : [...cur, r]));
  const toggleCanal = (c: 'Vitrine' | 'Assinatura') =>
    setLojaCanais((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));

  const usarDemo = (demoEmail: string) => { setEmail(demoEmail); setErro(''); setPasso('metodo'); };

  const handleEntrarSenha = async (usarSenhaAtual = true) => {
    setErro(''); setLoading(true);
    const res = await entrarComSenha(email, usarSenhaAtual ? senha : senha);
    setLoading(false);
    if (!res.success) { setErro(res.message || 'Erro ao entrar.'); return; }
    router.push(rotaDoPapel(res.role!));
  };

  const handleEnviarLink = async () => {
    if (!emailValido(email)) { setErro('Digite um e-mail válido para receber o link.'); return; }
    setErro(''); setPasso('enviado');
  };

  const handleAbrirLink = async () => {
    setLoading(true);
    const res = await entrarComLinkMagico(email);
    setLoading(false);
    if (!res.success) { setErro(res.message || 'Erro ao entrar.'); return; }
    router.push(rotaDoPapel(res.role!));
  };

  const handleCriarConta = () => {
    if (!contaNome.trim()) { setErro('Informe ' + (contaTipo === 'vendedor' ? 'o nome da torrefação' : 'seu nome') + '.'); return; }
    if (!emailValido(email)) { setErro('Digite um e-mail válido.'); return; }
    if (!semSenha && contaSenha.length < 6) { setErro('A senha precisa de pelo menos 6 caracteres.'); return; }
    setErro('');
    setPasso(contaTipo === 'vendedor' ? 'loja' : 'quiz');
  };

  const handleConcluirQuiz = () => setPasso('pronto');

  const handleConcluirLoja = () => {
    if (!lojaRegiao.trim()) { setErro('Informe a região produtora.'); return; }
    if (lojaCnpj.replace(/\D/g, '').length < 14) { setErro('CNPJ incompleto — informe os 14 dígitos.'); return; }
    if (!lojaCanais.length) { setErro('Escolha ao menos um canal de venda.'); return; }
    setErro('');
    setPasso('pronto');
  };

  const handleEntrarConta = async () => {
    setLoading(true);
    if (contaTipo === 'cliente') {
      const res = await cadastrarCliente({ nome: contaNome, email, senha: semSenha ? null : contaSenha, quiz, restricoes: quizRestricoes, plano: contaPlano, apelido: contaApelido });
      setLoading(false);
      if (!res.success) { setErro(res.message || 'Erro ao criar conta.'); setPasso('cadastro'); return; }
      router.push('/loja');
    } else {
      const res = await cadastrarVendedor({ nome: contaNome, email, senha: semSenha ? null : contaSenha, regiao: lojaRegiao, cnpj: lojaCnpj, capacidadeKg: lojaCapacidade, canais: lojaCanais });
      setLoading(false);
      if (!res.success) { setErro(res.message || 'Erro ao criar conta.'); setPasso('loja'); return; }
      router.push('/vendedor');
    }
  };

  // ao chegar em "pronto" pela primeira vez, guarda o resumo pra exibir
  if (passo === 'pronto' && !pronto) {
    if (contaTipo === 'cliente') setPronto({ papel: 'cliente', perfilNome: melhorPerfilQuiz.nome });
    else setPronto({ papel: 'vendedor' });
  }

  const texto = PASSOS_TEXTO[passo];
  const mostrarTabs = passo === 'email' || passo === 'cadastro';

  return (
    <div className="min-h-screen bg-secondary flex flex-col justify-between text-secondary-foreground font-sans">
      <SiteHeader />
      <div className="flex-1 flex flex-col items-center justify-center py-[50px] px-6">
        <div className="font-serif text-2xl tracking-[.42em] text-secondary-foreground">PINGADO</div>
        <div className="text-[10px] tracking-[.24em] uppercase text-muted-foreground mt-[9px]">Plataforma de assinatura de cafés especiais</div>

        <div className="w-[440px] max-w-full bg-card rounded-3xl mt-7 text-foreground overflow-hidden shadow-lg border border-border">
          <div className="px-6 py-[15px] border-b border-border flex items-center gap-3">
          {podeVoltar && (
            <button onClick={voltar} className="cursor-pointer border-0 bg-transparent p-0 text-lg leading-none text-muted-foreground" aria-label="Voltar">‹</button>
          )}
          <div className="text-[12.5px] tracking-[.06em] text-foreground">{texto.titulo}</div>
        </div>

        {mostrarTabs && (
          <div className="grid grid-cols-2 bg-muted/40 border-b border-border">
            <button
              onClick={() => irAba('email')}
              className={`cursor-pointer border-0 border-b-2 text-[13px] py-[13px] px-[10px] ${abaAtiva === 'email' ? 'bg-card text-foreground border-primary' : 'bg-transparent text-muted-foreground border-transparent'}`}
            >
              Entrar
            </button>
            <button
              onClick={() => irAba('cadastro')}
              className={`cursor-pointer border-0 border-b-2 text-[13px] py-[13px] px-[10px] ${abaAtiva === 'cadastro' ? 'bg-card text-foreground border-primary' : 'bg-transparent text-muted-foreground border-transparent'}`}
            >
              Criar conta
            </button>
          </div>
        )}

        <div className="px-7 pt-[26px] pb-7">
          <h1 className="font-serif font-medium text-[29px] leading-[1.15] text-foreground m-0">{texto.headline}</h1>

          {passo === 'email' && (
            <div className="mt-5 flex flex-col gap-[14px]">
              <Field label="E-mail">
                <input className={inputCls} value={email} onChange={(e) => { setEmail(e.target.value); setErro(''); }} placeholder="pingado@email.com" />
              </Field>
              <Field label="Senha">
                <input type="password" className={inputCls} value={senha} onChange={(e) => { setSenha(e.target.value); setErro(''); }} placeholder="••••••••" />
              </Field>
              <ErroBox erro={erro} />
              <button disabled={loading} onClick={() => handleEntrarSenha()} className="cursor-pointer border-0 bg-primary hover:bg-primary-hover text-white text-[13.5px] py-[14px] rounded-full transition-colors disabled:opacity-60">
                Entrar
              </button>
              <div className="flex items-center justify-between gap-3">
                <button onClick={handleEnviarLink} className="cursor-pointer border-0 bg-transparent p-0 text-[12.5px] text-primary">Entrar sem senha · link mágico</button>
                <span className="text-xs text-muted-foreground/80">Esqueci minha senha</span>
              </div>

              <div className="mt-2 pt-4 border-t border-border flex flex-col gap-2">
                <div className="text-[10px] tracking-[.12em] uppercase text-muted-foreground">Contas de demonstração</div>
                {DEMOS.map((d) => (
                  <button
                    key={d.email}
                    onClick={() => usarDemo(d.email)}
                    className="cursor-pointer text-left border border-border hover:border-primary bg-background rounded-full px-3 py-2 text-[12px] text-muted-foreground transition-colors"
                  >
                    <span className="text-foreground">{d.email}</span> · {d.tipo}
                  </button>
                ))}
              </div>
            </div>
          )}

          {passo === 'metodo' && (
            <div className="mt-5 flex flex-col gap-[10px]">
              <button onClick={handleEnviarLink} className="cursor-pointer text-left border border-primary bg-muted/40 rounded-3xl px-[18px] py-4">
                <div className="flex items-center justify-between gap-[10px]">
                  <span className="text-[14.5px] text-foreground">Receber link mágico por e-mail</span>
                  <span className="text-[9.5px] tracking-[.12em] uppercase px-[7px] py-[3px] rounded-full bg-primary text-white">recomendado</span>
                </div>
                <div className="text-xs text-foreground mt-[6px] leading-[1.5]">Um clique no e-mail e você entra. Sem senha, válido por 15 minutos.</div>
              </button>
              <button onClick={() => setPasso('senha')} className="cursor-pointer text-left border border-border bg-background rounded-3xl px-[18px] py-4">
                <div className="text-[14.5px] text-foreground">Entrar com minha senha</div>
                <div className="text-xs text-muted-foreground mt-[6px] leading-[1.5]">Use a senha cadastrada para esta conta.</div>
              </button>
              <div className="text-[11.5px] text-muted-foreground/80 mt-[6px]">
                Conta identificada: <span className="text-foreground">{email}</span> · perfil {perfilDetectado}
              </div>
            </div>
          )}

          {passo === 'senha' && (
            <div className="mt-5 flex flex-col gap-[14px]">
              <Field label="Senha">
                <input type="password" className={inputCls} value={senha} onChange={(e) => { setSenha(e.target.value); setErro(''); }} placeholder="••••••••" />
              </Field>
              <ErroBox erro={erro} />
              <button disabled={loading} onClick={() => handleEntrarSenha()} className="cursor-pointer border-0 bg-primary hover:bg-primary-hover text-white text-[13.5px] py-[14px] rounded-full transition-colors disabled:opacity-60">
                Entrar
              </button>
              <div className="flex items-center justify-between gap-3">
                <button onClick={handleEnviarLink} className="cursor-pointer border-0 bg-transparent p-0 text-[12.5px] text-primary">Prefiro o link mágico</button>
                <span className="text-xs text-muted-foreground/80">Esqueci minha senha</span>
              </div>
            </div>
          )}

          {passo === 'enviado' && (
            <div className="mt-5 flex flex-col gap-[14px]">
              <div className="border border-border bg-background rounded-3xl px-5 py-[18px]">
                <div className="text-[9.5px] tracking-[.14em] uppercase text-muted-foreground/80">Simulação da caixa de entrada</div>
                <div className="font-serif text-xl text-foreground mt-2">Seu acesso ao Pingado</div>
                <p className="my-[6px] mb-[14px] text-[12.5px] text-muted-foreground leading-[1.55]">Para {email} · o link expira em 15 minutos e só funciona uma vez.</p>
                <button disabled={loading} onClick={handleAbrirLink} className="cursor-pointer w-full border-0 bg-secondary text-secondary-foreground text-[13px] py-3 px-[18px] rounded-full disabled:opacity-60">
                  Entrar no Pingado
                </button>
              </div>
              <ErroBox erro={erro} />
              <div className="flex items-center justify-between gap-3">
                <button onClick={handleEnviarLink} className="cursor-pointer border-0 bg-transparent p-0 text-[12.5px] text-primary">Reenviar link</button>
                <button onClick={() => setPasso('senha')} className="cursor-pointer border-0 bg-transparent p-0 text-[12.5px] text-muted-foreground">Usar senha em vez disso</button>
              </div>
            </div>
          )}

          {passo === 'cadastro' && (
            <div className="mt-5 flex flex-col gap-[14px]">
              <div className="grid grid-cols-2 gap-2">
                {(['cliente', 'vendedor'] as ContaTipo[]).map((t) => {
                  const on = contaTipo === t;
                  return (
                    <button
                      key={t}
                      onClick={() => { setContaTipo(t); setErro(''); }}
                      className={`cursor-pointer text-left border rounded-3xl px-[14px] py-3 ${on ? 'bg-muted/40 border-primary' : 'bg-background border-border'}`}
                    >
                      <div className="text-[13.5px] text-foreground">{t === 'cliente' ? 'Cliente' : 'Vendedor'}</div>
                      <div className={`text-[11px] mt-[3px] ${on ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {t === 'cliente' ? 'Assinar e comprar cafés' : 'Vender meus cafés na plataforma'}
                      </div>
                    </button>
                  );
                })}
              </div>
              <Field label={contaTipo === 'vendedor' ? 'Nome da torrefação' : 'Nome completo'}>
                <input className={inputCls} value={contaNome} onChange={(e) => { setContaNome(e.target.value); setErro(''); }} placeholder={contaTipo === 'vendedor' ? 'Torrefação Serra Alta' : 'Marina Prado'} />
              </Field>
              {contaTipo === 'cliente' && (
                <Field label="Apelido">
                  <input className={inputCls} value={contaApelido} onChange={(e) => { setContaApelido(e.target.value); setErro(''); }} placeholder="Como quer ser chamado (ex: Mari)" />
                </Field>
              )}
              <Field label="E-mail">
                <input className={inputCls} value={email} onChange={(e) => { setEmail(e.target.value); setErro(''); }} placeholder="pingado@email.com" />
              </Field>
              <label className="flex items-center gap-[10px] cursor-pointer select-none">
                <span
                  onClick={() => setSemSenha((v) => !v)}
                  className={`w-[16px] h-[16px] rounded-full border flex-none flex items-center justify-center ${semSenha ? 'bg-primary border-primary' : 'bg-background border-border'}`}
                >
                  {semSenha && <span className="w-[8px] h-[8px] rounded-[1px] bg-white" />}
                </span>
                <span className="text-[12.5px] text-muted-foreground" onClick={() => setSemSenha((v) => !v)}>Criar conta sem senha · só link mágico</span>
              </label>
              {!semSenha && (
                <Field label="Senha">
                  <input type="password" className={inputCls} value={contaSenha} onChange={(e) => { setContaSenha(e.target.value); setErro(''); }} placeholder="••••••••" />
                </Field>
              )}
              <ErroBox erro={erro} />
              <button onClick={handleCriarConta} className="cursor-pointer border-0 bg-primary hover:bg-primary-hover text-white text-[13.5px] py-[14px] rounded-full transition-colors">
                {contaTipo === 'vendedor' ? 'Continuar · dados da torrefação' : 'Continuar · meu perfil sensorial'}
              </button>
              <div className="text-[11.5px] text-muted-foreground/80 leading-[1.5]">Ao criar a conta você aceita os termos de uso e a política de privacidade do Pingado.</div>
            </div>
          )}

          {passo === 'quiz' && (
            <div className="mt-5 flex flex-col gap-4">
              <div className="flex flex-col gap-[2px]">
                {SENS_AXES.map((axis) => (
                  <div key={axis.key} className="py-2 border-b border-border">
                    <div className="flex items-center justify-between gap-[10px]">
                      <span className="text-[13px] text-foreground">{axis.label}</span>
                      <Dots value={quiz[axis.key]} onChange={(n) => setQuiz((q) => ({ ...q, [axis.key]: n }))} />
                    </div>
                    <div className="text-[10.5px] text-muted-foreground/80 mt-[5px]">{axis.left} → {axis.right}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-[10px] tracking-[.12em] uppercase text-muted-foreground mb-2">Alguma restrição?</div>
                <div className="flex flex-wrap gap-[7px]">
                  {RESTRICOES_QUIZ.map((r) => (
                    <Chip key={r} label={r} active={quizRestricoes.includes(r)} onClick={() => toggleRestricao(r)} />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] tracking-[.12em] uppercase text-muted-foreground mb-2">Plano da assinatura</div>
                <div className="flex gap-[7px]">
                  {PLANOS_ASSINATURA.map((p) => (
                    <Chip key={p} label={p} active={contaPlano === p} onClick={() => setContaPlano(p)} />
                  ))}
                </div>
              </div>
              <button onClick={handleConcluirQuiz} className="cursor-pointer border-0 bg-primary hover:bg-primary-hover text-white text-[13.5px] py-[14px] rounded-full transition-colors">
                Ver meu perfil sensorial
              </button>
            </div>
          )}

          {passo === 'loja' && (
            <div className="mt-5 flex flex-col gap-[14px]">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Região produtora">
                  <input className={inputCls} value={lojaRegiao} onChange={(e) => { setLojaRegiao(e.target.value); setErro(''); }} placeholder="Mantiqueira de Minas" />
                </Field>
                <Field label="CNPJ">
                  <input className={inputCls} value={lojaCnpj} onChange={(e) => { setLojaCnpj(e.target.value); setErro(''); }} placeholder="00.000.000/0001-00" />
                </Field>
              </div>
              <Field label="Capacidade mensal de torra (kg)">
                <input className={inputCls} value={lojaCapacidade} onChange={(e) => { setLojaCapacidade(e.target.value); setErro(''); }} placeholder="400" />
              </Field>
              <div>
                <div className="text-[10px] tracking-[.12em] uppercase text-muted-foreground mb-2">Quero vender em</div>
                <div className="flex flex-wrap gap-[7px]">
                  {(['Vitrine', 'Assinatura'] as const).map((c) => (
                    <Chip key={c} label={c} active={lojaCanais.includes(c)} onClick={() => toggleCanal(c)} />
                  ))}
                </div>
              </div>
              <ErroBox erro={erro} />
              <button onClick={handleConcluirLoja} className="cursor-pointer border-0 bg-primary hover:bg-primary-hover text-white text-[13.5px] py-[14px] rounded-full transition-colors">
                Criar meu painel de vendedor
              </button>
            </div>
          )}

          {passo === 'pronto' && (
            <div className="mt-5 flex flex-col gap-[14px]">
              <div className="border border-primary/40 bg-muted/40 rounded-3xl px-5 py-[18px]">
                <div className="text-[9.5px] tracking-[.14em] uppercase text-primary">
                  {contaTipo === 'vendedor' ? 'Painel liberado' : 'Perfil sensorial mapeado'}
                </div>
                <div className="font-serif text-2xl text-foreground mt-[7px] leading-[1.15]">
                  {contaTipo === 'vendedor' ? (contaNome || 'Sua torrefação') : (pronto?.perfilNome || melhorPerfilQuiz.nome)}
                </div>
                <p className="mt-2 text-[12.5px] text-foreground leading-[1.55]">
                  {contaTipo === 'vendedor'
                    ? `Conta criada para ${email}. Cadastre seu primeiro café com perfil sensorial completo para entrar na curadoria do próximo ciclo.`
                    : `Suas caixas do plano ${contaPlano} vão priorizar cafés compatíveis com esse paladar${quizRestricoes.length ? ', respeitando: ' + quizRestricoes.join(', ') + '.' : '.'}`}
                </p>
                {contaTipo === 'cliente' && (
                  <div className="mt-[14px] flex flex-col gap-1">
                    {SENS_AXES.map((axis) => (
                      <div key={axis.key} className="flex items-center justify-between gap-[10px]">
                        <span className="text-[11.5px] text-[#5E4A3C]">{axis.label}</span>
                        <div className="flex gap-1">
                          {pipsFor(quiz[axis.key]).map((on, i) => (
                            <span key={i} className={`w-[7px] h-[7px] rounded-full ${on ? 'bg-primary' : 'bg-[#DED5C6]'}`} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button disabled={loading} onClick={handleEntrarConta} className="cursor-pointer border-0 bg-secondary text-secondary-foreground text-[13.5px] py-[14px] rounded-full disabled:opacity-60">
                {contaTipo === 'vendedor' ? 'Abrir meu painel' : 'Entrar na vitrine'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="text-[11.5px] text-muted-foreground mt-[22px] max-w-[440px] text-center leading-[1.6]">
        Demonstração com dados fictícios · escolha uma conta de demonstração ou crie a sua.
      </div>
      </div>
      <SiteFooter />
    </div>
  );
}
