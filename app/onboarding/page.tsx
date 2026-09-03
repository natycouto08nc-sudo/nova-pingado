'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, Check, Award, Star, Search, User, Sparkles, PhoneCall, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { obterPerfilDescricao } from '@/lib/recommendations';

const PREFERENCIAS = [
  'Chocolate', 'Caramelo', 'Castanhas', 'Floral',
  'Frutas Vermelhas', 'Frutas Cítricas', 'Mel', 'Especiarias',
];

const ATRIBUTOS = [
  { key: 'acidez', label: 'Acidez', low: 'Muito baixa', high: 'Muito alta', desc: 'Quão ácido você prefere seu café?' },
  { key: 'docura', label: 'Doçura', low: 'Muito seco', high: 'Muito doce', desc: 'Qual nível de doçura você aprecia?' },
  { key: 'corpo', label: 'Corpo', low: 'Muito leve', high: 'Muito encorpado', desc: 'Como você prefere a textura e o peso do café na boca?' },
  { key: 'amargor', label: 'Amargor', low: 'Sem amargor', high: 'Muito amargo', desc: 'Você aprecia o amargor característico do café?' },
  { key: 'intensidade', label: 'Intensidade', low: 'Muito suave', high: 'Muito intenso', desc: 'Qual intensidade geral você prefere?' },
] as const;

type AtributoKey = 'acidez' | 'docura' | 'corpo' | 'amargor' | 'intensidade';

const PLANOS_INFO = {
  basico: { 
    nome: 'Descoberta', 
    sub: 'Para quem está começando a explorar cafés especiais.',
    preco: 'R$ 89,90/mês', 
    limit: 1,
    features: [
      '1 pacote de 250g por mês',
      'Curadoria por IA a cada entrega',
      'Frete fixo com desconto',
      'Pause ou cancele quando quiser'
    ]
  },
  premium: { 
    nome: 'Sommelier', 
    sub: 'O equilíbrio ideal entre variedade e volume.',
    preco: 'R$ 139,90/mês', 
    limit: 2,
    features: [
      '2 pacotes de 250g por mês',
      'Prioridade em lotes exclusivos',
      'Frete grátis para Sul e Sudeste',
      'Perfil sensorial refinado por avaliação'
    ]
  },
  plus: { 
    nome: 'Colecionador', 
    sub: 'Para quem quer provar o que ninguém provou.',
    preco: 'R$ 219,90/mês', 
    limit: 3,
    features: [
      '3 pacotes por mês, incluindo microlotes raros',
      'Acesso antecipado a novos produtores',
      'Frete grátis para todo o Brasil',
      'Fichas de degustação assinadas pelo produtor'
    ]
  }
};

export default function OnboardingPage() {
  const router = useRouter();
  const { user, perfilSensorial, signUp, savePerfilSensorial, saveAssinatura } = useAuth();

  const [step, setStep] = useState(0);
  const [valores, setValores] = useState<Record<AtributoKey, number>>({
    acidez: 3, docura: 3, corpo: 3, amargor: 3, intensidade: 3,
  });
  const [preferencias, setPreferencias] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Estados do Passo Cadastro
  const [cadNome, setCadNome] = useState('');
  const [cadApelido, setCadApelido] = useState('');
  const [hasInitialized, setHasInitialized] = useState(false);
  const [cadEmail, setCadEmail] = useState('');
  const [cadTelefone, setCadTelefone] = useState('');
  const [cadSenha, setCadSenha] = useState('');
  const [cadConfirmaSenha, setCadConfirmaSenha] = useState('');

  // Estados do Passo Assinatura
  const [selectedPlan, setSelectedPlan] = useState<'basico' | 'premium' | 'plus'>('premium');

  useEffect(() => {
    const savedPlan = localStorage.getItem('pingado_selected_plan');
    if (savedPlan && (savedPlan === 'basico' || savedPlan === 'premium' || savedPlan === 'plus')) {
      setSelectedPlan(savedPlan);
    }
  }, []);

  useEffect(() => {
    if (user && perfilSensorial && !hasInitialized) {
      setValores({
        acidez: perfilSensorial.acidez,
        docura: perfilSensorial.docura,
        corpo: perfilSensorial.corpo,
        amargor: perfilSensorial.amargor,
        intensidade: perfilSensorial.intensidade,
      });
      if (perfilSensorial.preferencias) {
        setPreferencias(perfilSensorial.preferencias);
      }
      setStep(ATRIBUTOS.length + 1); // Go straight to profile result
      setHasInitialized(true);
    }
  }, [user, perfilSensorial, hasInitialized]);

  const totalSteps = ATRIBUTOS.length + 4; // 5 atributos + 1 preferências + 1 resultado perfil + 1 cadastro + 1 checkout/assinatura

  const togglePreferencia = (pref: string) => {
    setPreferencias(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const perfilSensorialInfo = obterPerfilDescricao(valores);

  // Trata o cadastro do usuário
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSaving(true);

    if (!cadTelefone.trim()) {
      setErrorMsg('Por favor, informe seu telefone.');
      setSaving(false);
      return;
    }

    if (cadSenha.length < 6) {
      setErrorMsg('A senha deve ter pelo menos 6 caracteres.');
      setSaving(false);
      return;
    }

    if (cadSenha !== cadConfirmaSenha) {
      setErrorMsg('As senhas não coincidem.');
      setSaving(false);
      return;
    }

    try {
      const res = await signUp(cadEmail, cadSenha, cadNome, cadTelefone, cadApelido);
      if (!res.success) {
        setErrorMsg(res.message || 'Erro ao criar conta.');
        setSaving(false);
        return;
      }

      // Salvar perfil sensorial no banco/localStorage
      await savePerfilSensorial(valores, preferencias);
      
      setSaving(false);
      setStep(s => s + 1); // Avança para o checkout
    } catch (e: any) {
      setErrorMsg(e.message || 'Erro inesperado.');
      setSaving(false);
    }
  };

  // Finalizar assinatura e pular para o perfil
  const handleFinalizarAssinatura = async () => {
    setSaving(true);
    await saveAssinatura(selectedPlan);
    setSaving(false);
    router.push('/perfil');
  };

  const isSensoryStep = step < ATRIBUTOS.length;
  const isPrefsStep = step === ATRIBUTOS.length;
  const isResultStep = step === ATRIBUTOS.length + 1;
  const isAuthStep = step === ATRIBUTOS.length + 2;
  const isCheckoutStep = step === ATRIBUTOS.length + 3;

  const currentAtributo = isSensoryStep ? ATRIBUTOS[step] : null;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col justify-between">
      <div>
        <SiteHeader />

        {/* Área do Form com Fundo Padronizado */}
        <div className="flex-1 bg-background text-foreground flex flex-col items-center justify-center py-12 px-4 md:px-6">
        <div className={`${isCheckoutStep ? 'max-w-4xl' : 'max-w-xl'} w-full mx-auto transition-all duration-300`}>
          
          {/* Barra de Progresso do Topo */}
          <div className="w-full mb-10">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              <span>
                {isCheckoutStep 
                  ? 'Pagamento' 
                  : isAuthStep 
                  ? 'Identificação' 
                  : isResultStep 
                  ? 'Seu Perfil' 
                  : 'Perfil Sensorial'}
              </span>
              <span>{step + 1} de {totalSteps}</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Content */}
          <div className="w-full">
            
            {/* Passos Sensoriais 1 a 5 */}
            {currentAtributo && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <span className="text-primary font-bold text-xs uppercase tracking-widest block">
                  PASSO {step + 1}: {currentAtributo.label}
                </span>
                <h2 className="font-serif text-3xl font-normal text-foreground leading-tight md:text-4xl">
                  {currentAtributo.desc}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Selecione de 1 a 5 de acordo com sua preferência pessoal para ajudar nossa inteligência artificial a mapear seu paladar.
                </p>

                {/* Opções de 1 a 5 */}
                <div className="grid grid-cols-5 gap-3.5 pt-4">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      key={val}
                      onClick={() => setValores(prev => ({ ...prev, [currentAtributo.key]: val }))}
                      className={`
                        flex flex-col items-center justify-center p-6 rounded-2xl border transition-all text-xl font-bold md:text-2xl cursor-pointer
                        ${valores[currentAtributo.key] === val
                          ? 'border-primary bg-primary text-primary-foreground shadow-md scale-105'
                          : 'border-border bg-card text-foreground hover:bg-muted'
                        }
                      `}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest pt-2 px-1">
                  <span>{currentAtributo.low}</span>
                  <span>{currentAtributo.high}</span>
                </div>
              </div>
            )}

            {/* Passo 6: Notas Aromáticas */}
            {isPrefsStep && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <span className="text-primary font-bold text-xs uppercase tracking-widest block">
                  PREFERÊNCIAS
                </span>
                <h2 className="font-serif text-3xl font-normal text-foreground leading-tight md:text-4xl">
                  Quais notas aromáticas você prefere no café?
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Selecione os sabores que costumam te agradar. Fique à vontade para marcar múltiplos ou avançar se preferir.
                </p>

                {/* Grid de Sabores */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  {PREFERENCIAS.map(pref => {
                    const selected = preferencias.includes(pref);
                    return (
                      <button
                        key={pref}
                        onClick={() => togglePreferencia(pref)}
                        className={`
                          flex items-center justify-between px-5 py-4 rounded-2xl border transition-all text-left text-sm font-bold cursor-pointer
                          ${selected
                            ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                            : 'border-border bg-card text-foreground hover:bg-muted'
                          }
                        `}
                      >
                        <span>{pref}</span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${selected ? 'border-white bg-primary text-primary-foreground' : 'border-border'}`}>
                          {selected && <Check size={11} className="text-primary-foreground" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Passo 7: Resultado do Perfil Sensorial */}
            {isResultStep && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <span className="text-primary font-bold text-xs uppercase tracking-widest block">
                    SEU PERFIL SENSORIAL
                  </span>
                  <h2 className="font-serif text-3xl font-normal text-foreground md:text-4xl">
                    {perfilSensorialInfo.nome}
                  </h2>
                </div>
                
                {/* Card do Perfil */}
                <div className="bg-card text-card-foreground rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm border border-border">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 bg-primary/10 text-primary border border-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-primary font-bold uppercase tracking-wider">Resultado da IA</p>
                      <p className="font-bold text-foreground text-sm">Perfil sensorial mapeado!</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {perfilSensorialInfo.detalhes}
                  </p>

                  {/* Resumo Gráfico dos Atributos */}
                  <div className="pt-4 border-t border-border/60 space-y-2.5">
                    {ATRIBUTOS.map(attr => (
                      <div key={attr.key} className="flex justify-between items-center text-xs">
                        <span className="text-foreground font-bold">{attr.label}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                              key={star} 
                              size={12} 
                              className={star <= valores[attr.key] ? 'text-primary' : 'text-muted-foreground/30'} 
                              fill={star <= valores[attr.key] ? 'currentColor' : 'none'} 
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Opções de Edição */}
                  <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs font-sans">
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className="text-primary hover:underline font-bold"
                    >
                      Refazer Quiz Completo
                    </button>
                    <Link
                      href="/perfil/sensorial"
                      className="text-muted-foreground hover:text-primary hover:underline font-bold"
                    >
                      Ajuste Fino dos Atributos
                    </Link>
                  </div>
                </div>

                {user ? (
                  <div className="bg-muted/40 p-5 rounded-2xl border border-border/60 text-sm">
                    <p className="font-bold text-foreground">Salvar perfil e assinar</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Seu perfil sensorial será atualizado em sua conta e utilizaremos esses dados para selecionar os cafés da sua assinatura.
                    </p>
                  </div>
                ) : (
                  <div className="bg-muted/40 p-5 rounded-2xl border border-border/60 text-sm">
                    <p className="font-bold text-foreground">Salvar perfil e assinar</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Para salvar este perfil na nuvem e configurar a assinatura dos seus cafés personalizados do clube, você precisará criar uma conta a seguir.
                    </p>
                  </div>
                )}

                {user ? (
                  <button
                    type="button"
                    onClick={() => setStep(ATRIBUTOS.length + 3)}
                    className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full transition-all shadow-sm flex items-center justify-center gap-2 font-sans cursor-pointer"
                  >
                    Prosseguir para Assinatura
                    <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStep(s => s + 1)}
                    className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full transition-all shadow-sm flex items-center justify-center gap-2 font-sans cursor-pointer"
                  >
                    Prosseguir para o Cadastro
                    <ChevronRight size={18} />
                  </button>
                )}
              </div>
            )}

            {/* Passo 8: Cadastro da Conta */}
            {isAuthStep && (
              <form onSubmit={handleAuthSubmit} className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <span className="text-primary font-bold text-xs uppercase tracking-widest block">
                    CADASTRO
                  </span>
                  <h2 className="font-serif text-3xl font-normal text-foreground md:text-4xl">
                    Realize seu cadastro para salvar seu perfil
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Preencha os campos abaixo para salvar seu perfil sensorial e ativar sua assinatura.
                  </p>
                </div>

                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-xl">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Nome Completo</label>
                    <input
                      type="text"
                      required
                      value={cadNome}
                      onChange={e => setCadNome(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full px-4 py-3.5 rounded-2xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition font-medium text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Apelido (como quer ser chamado)</label>
                    <input
                      type="text"
                      value={cadApelido}
                      onChange={e => setCadApelido(e.target.value)}
                      placeholder="Seu apelido"
                      className="w-full px-4 py-3.5 rounded-2xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition font-medium text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={cadEmail}
                      onChange={e => setCadEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3.5 rounded-2xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition font-medium text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Telefone</label>
                    <input
                      type="tel"
                      required
                      value={cadTelefone}
                      onChange={e => setCadTelefone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full px-4 py-3.5 rounded-2xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition font-medium text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Senha</label>
                    <input
                      type="password"
                      required
                      value={cadSenha}
                      onChange={e => setCadSenha(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full px-4 py-3.5 rounded-2xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition font-medium text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Confirmar Senha</label>
                    <input
                      type="password"
                      required
                      value={cadConfirmaSenha}
                      onChange={e => setCadConfirmaSenha(e.target.value)}
                      placeholder="Digite a senha novamente"
                      className="w-full px-4 py-3.5 rounded-2xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition font-medium text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-4 mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      Criar Conta e Prosseguir
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>

                <p className="text-center text-xs font-semibold mt-4 text-muted-foreground">
                  Já possui uma conta?{' '}
                  <Link href="/login" className="text-primary underline ml-1 font-bold">
                    Entrar na minha conta
                  </Link>
                </p>
              </form>
            )}

            {/* Passo 9: Checkout / Contato por WhatsApp */}
            {isCheckoutStep && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-2 text-center">
                  <span className="text-primary font-bold text-xs uppercase tracking-widest block">
                    ATIVAR ASSINATURA
                  </span>
                  <h2 className="font-serif text-3xl font-normal text-foreground md:text-4xl">
                    Escolha como quer descobrir seu próximo café
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-xl mx-auto font-sans">
                    Planos flexíveis. Pause, troque de café ou cancele quando quiser, direto no seu perfil.
                  </p>
                </div>

                {/* Seleção do Plano - Grid de 3 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  {(Object.keys(PLANOS_INFO) as Array<keyof typeof PLANOS_INFO>).map(k => {
                    const plan = PLANOS_INFO[k];
                    const isSelected = selectedPlan === k;
                    return (
                      <div
                        key={k}
                        className={`bg-card text-card-foreground rounded-2xl p-6 shadow-sm border transition-all flex flex-col justify-between h-full ${
                          isSelected
                            ? 'border-primary ring-2 ring-primary/20 scale-102'
                            : 'border-border hover:border-primary/40'
                        }`}
                      >
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-serif text-xl font-bold text-foreground">{plan.nome}</h3>
                            <p className="text-[11px] text-muted-foreground font-medium font-sans leading-relaxed mt-1">{plan.sub}</p>
                          </div>
                          
                          <p className="text-xs text-foreground font-sans">
                            a partir de <span className="font-serif text-xl font-bold text-primary block sm:inline">R$ {plan.preco.split(' ')[1].split('/')[0]}</span> <span className="text-[10px] text-muted-foreground font-normal">/mês</span>
                          </p>

                          <ul className="space-y-2.5 pt-2 border-t border-border/60">
                            {plan.features.map((feat, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-[11px] text-muted-foreground font-sans leading-tight">
                                <Check size={12} className="text-primary mt-0.5 flex-shrink-0" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedPlan(k)}
                          className={`w-full py-2.5 mt-6 font-bold rounded-xl text-xs transition duration-200 cursor-pointer ${
                            isSelected
                              ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm'
                              : 'bg-card hover:bg-muted text-foreground border border-border'
                          }`}
                        >
                          {isSelected ? 'Plano Selecionado' : 'Selecionar plano'}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Card Separado de Pagamento */}
                <div className="bg-muted/40 text-card-foreground rounded-2xl p-6 shadow-sm border border-border/60 space-y-3 mt-4 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                    <MessageSquare size={16} className="text-green-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground font-sans">Pagamento</span>
                  </div>
                  <div className="font-sans text-xs text-muted-foreground space-y-2 leading-relaxed">
                    <p>
                      A cobrança mensal e agendamento da entrega da sua curadoria personalizada serão enviados diretamente no seu WhatsApp.
                    </p>
                    <p>
                      Em até 24 horas úteis, nossos sommeliers entrarão em contato no número cadastrado para confirmar seu endereço, faturamento (PIX ou cartão de crédito) e agendar o primeiro envio do seu clube.
                    </p>
                  </div>
                </div>

                {/* Botões de Finalização */}
                <div className="space-y-4 pt-4 max-w-md mx-auto">
                  <button
                    type="button"
                    onClick={handleFinalizarAssinatura}
                    className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full transition-all shadow-sm flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] font-sans cursor-pointer"
                  >
                    Confirmar e Finalizar Assinatura
                    <Check size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/perfil')}
                    className="w-full py-2 bg-transparent text-muted-foreground hover:text-foreground font-bold transition-all text-xs text-center block hover:underline font-sans cursor-pointer"
                  >
                    Prefiro continuar sem assinar
                  </button>
                </div>
              </div>
            )}

            {/* Navegação Inferior */}
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-border/70">
              <button
                onClick={() => setStep(s => s === ATRIBUTOS.length + 3 && user ? ATRIBUTOS.length + 1 : s - 1)}
                disabled={step === 0 || isAuthStep || isCheckoutStep && saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft size={16} />
                Voltar
              </button>

              {/* Botão Próximo/Salvar */}
              {isSensoryStep && (
                <button
                  onClick={() => setStep(s => s + 1)}
                  className="flex items-center gap-1 bg-primary text-primary-foreground px-7 py-3 rounded-full font-bold text-xs hover:bg-primary/90 transition-all shadow-sm cursor-pointer"
                >
                  Próximo
                  <ChevronRight size={16} />
                </button>
              )}

              {isPrefsStep && (
                <button
                  onClick={() => setStep(s => s + 1)}
                  className="flex items-center gap-1 bg-primary text-primary-foreground px-7 py-3 rounded-full font-bold text-xs hover:bg-primary/90 transition-all shadow-sm cursor-pointer"
                >
                  Salvar preferências
                  <ChevronRight size={16} />
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
      </div>
      <SiteFooter />
    </div>
  );
}
