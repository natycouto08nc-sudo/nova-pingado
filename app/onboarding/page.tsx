'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, Check, Award, Star, Search, User, Sparkles, PhoneCall, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
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
    <div className="min-h-screen bg-[#f5f0e6] text-[#4a2c2a] font-sans antialiased flex flex-col">
      {/* Top Banner */}
      <div className="bg-[#1c3328] text-[#f5f0e6] text-center py-2.5 px-4 text-xs font-semibold tracking-wider flex items-center justify-center gap-2">
        <span>FRETE GRÁTIS ACIMA DE R$ 149 NO SUL E SUDESTE</span>
        <span className="bg-[#bf5a36] text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-normal">PINGAFRETE</span>
      </div>

      {/* Header */}
      <header className="bg-[#f5f0e6] border-b border-[#4a2c2a]/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-3 items-center">
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/onboarding" className="text-[#bf5a36] hover:text-[#bf5a36] transition-colors">Assinatura</Link>
            <Link href="/#como-funciona" className="hover:text-[#bf5a36] transition-colors">Como Funciona</Link>
          </nav>
          <div className="flex justify-center">
            <Link href="/" className="font-serif text-2xl font-bold tracking-[0.25em] text-[#4a2c2a] md:text-3xl">
              PINGADO
            </Link>
          </div>
          <nav className="flex items-center justify-end gap-6 text-sm font-medium">
            <Link href="/#produtores" className="hover:text-[#bf5a36] transition-colors hidden md:block">Nossos Produtores</Link>
            <Link href="/#produtos" className="hover:text-[#bf5a36] transition-colors">Loja</Link>
            <Link href="/#newsletter" className="hover:text-[#bf5a36] transition-colors hidden md:block">Sobre</Link>
            <div className="flex items-center gap-4 ml-4">
              <button className="text-[#4a2c2a] hover:text-[#bf5a36] transition-colors">
                <Search size={20} />
              </button>
              <Link href="/login" className="text-[#4a2c2a] hover:text-[#bf5a36] transition-colors">
                <User size={20} />
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Área do Form com Fundo Verde Oliva */}
      <div className="flex-1 bg-[#1c3328] text-white flex flex-col items-center justify-center py-16 px-6">
        <div className={`${isCheckoutStep ? 'max-w-4xl' : 'max-w-xl'} w-full mx-auto transition-all duration-300`}>
          
          {/* Barra de Progresso do Topo */}
          <div className="w-full mb-12">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
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
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#bf5a36] rounded-full transition-all duration-500"
                style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Content */}
          <div className="w-full">
            
            {/* Passos Sensoriais 1 a 5 */}
            {currentAtributo && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <span className="text-[#e29b63] font-bold text-xs uppercase tracking-widest block">
                  PASSO {step + 1}: {currentAtributo.label}
                </span>
                <h2 className="font-serif text-3xl font-normal text-white leading-tight md:text-4xl">
                  {currentAtributo.desc}
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Selecione de 1 a 5 de acordo com sua preferência pessoal para ajudar nossa inteligência artificial a mapear seu paladar.
                </p>

                {/* Opções de 1 a 5 */}
                <div className="grid grid-cols-5 gap-3.5 pt-4">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      key={val}
                      onClick={() => setValores(prev => ({ ...prev, [currentAtributo.key]: val }))}
                      className={`
                        flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all text-xl font-bold md:text-2xl
                        ${valores[currentAtributo.key] === val
                          ? 'border-[#bf5a36] bg-[#bf5a36] text-white shadow-lg scale-105'
                          : 'border-transparent bg-[#f5f0e6] text-[#4a2c2a] hover:bg-[#e5dec9]'
                        }
                      `}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs font-bold text-gray-300 uppercase tracking-widest pt-2 px-1">
                  <span>{currentAtributo.low}</span>
                  <span>{currentAtributo.high}</span>
                </div>
              </div>
            )}

            {/* Passo 6: Notas Aromáticas */}
            {isPrefsStep && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <span className="text-[#e29b63] font-bold text-xs uppercase tracking-widest block">
                  PREFERÊNCIAS
                </span>
                <h2 className="font-serif text-3xl font-normal text-white leading-tight md:text-4xl">
                  Quais notas aromáticas você prefere no café?
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed">
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
                          flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all text-left text-sm font-bold
                          ${selected
                            ? 'border-[#bf5a36] bg-[#bf5a36] text-white shadow-md'
                            : 'border-transparent bg-[#f5f0e6] text-[#4a2c2a] hover:bg-[#e5dec9]'
                          }
                        `}
                      >
                        <span>{pref}</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${selected ? 'border-white bg-[#bf5a36]' : 'border-[#4a2c2a]/20'}`}>
                          {selected && <Check size={11} className="text-white" />}
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
                  <span className="text-[#e29b63] font-bold text-xs uppercase tracking-widest block">
                    SEU PERFIL SENSORIAL
                  </span>
                  <h2 className="font-serif text-3xl font-normal text-white md:text-4xl">
                    {perfilSensorialInfo.nome}
                  </h2>
                </div>
                
                {/* Card do Perfil */}
                <div className="bg-[#f5f0e6] text-[#4a2c2a] rounded-3xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#bf5a36] rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Resultado da IA</p>
                      <p className="font-bold text-[#4a2c2a] text-sm">Perfil sensorial mapeado!</p>
                    </div>
                  </div>

                  <p className="text-sm text-[#6b5b58] leading-relaxed">
                    {perfilSensorialInfo.detalhes}
                  </p>

                  {/* Resumo Gráfico dos Atributos */}
                  <div className="pt-4 border-t border-[#4a2c2a]/10 space-y-2.5">
                    {ATRIBUTOS.map(attr => (
                      <div key={attr.key} className="flex justify-between items-center text-xs">
                        <span className="text-[#4a2c2a] font-bold">{attr.label}</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                              key={star} 
                              size={12} 
                              className={star <= valores[attr.key] ? 'text-[#bf5a36]' : 'text-gray-300'} 
                              fill={star <= valores[attr.key] ? 'currentColor' : 'none'} 
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Opções de Edição */}
                  <div className="pt-4 border-t border-[#4a2c2a]/10 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs font-sans">
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className="text-[#bf5a36] hover:underline font-bold"
                    >
                      Refazer Quiz Completo
                    </button>
                    <Link
                      href="/perfil/sensorial"
                      className="text-[#6b5b58] hover:text-[#bf5a36] hover:underline font-bold"
                    >
                      Ajuste Fino dos Atributos
                    </Link>
                  </div>
                </div>

                {user ? (
                  <div className="bg-white/10 p-5 rounded-2xl border border-white/20 text-sm">
                    <p className="font-bold text-[#e29b63]">Salvar perfil e assinar</p>
                    <p className="text-xs text-gray-200 mt-1 leading-relaxed">
                      Seu perfil sensorial será atualizado em sua conta e utilizaremos esses dados para selecionar os cafés da sua assinatura.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white/10 p-5 rounded-2xl border border-white/20 text-sm">
                    <p className="font-bold text-[#e29b63]">Salvar perfil e assinar</p>
                    <p className="text-xs text-gray-200 mt-1 leading-relaxed">
                      Para salvar este perfil na nuvem e configurar a assinatura dos seus cafés personalizados do clube, você precisará criar uma conta a seguir.
                    </p>
                  </div>
                )}

                {user ? (
                  <button
                    type="button"
                    onClick={() => setStep(ATRIBUTOS.length + 3)}
                    className="w-full py-4 bg-[#bf5a36] hover:bg-[#a64928] text-white font-bold rounded-full transition-all shadow-lg flex items-center justify-center gap-2 font-sans"
                  >
                    Prosseguir para Assinatura
                    <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStep(s => s + 1)}
                    className="w-full py-4 bg-[#bf5a36] hover:bg-[#a64928] text-white font-bold rounded-full transition-all shadow-lg flex items-center justify-center gap-2 font-sans"
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
                  <span className="text-[#e29b63] font-bold text-xs uppercase tracking-widest block">
                    CADASTRO
                  </span>
                  <h2 className="font-serif text-3xl font-normal text-white md:text-4xl">
                    Realize seu cadastro para salvar seu perfil
                  </h2>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Preencha os campos abaixo para salvar seu perfil sensorial e ativar sua assinatura.
                  </p>
                </div>

                {errorMsg && (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-xs p-4 rounded-xl">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Nome Completo</label>
                    <input
                      type="text"
                      required
                      value={cadNome}
                      onChange={e => setCadNome(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full px-4 py-3.5 rounded-2xl border-0 bg-[#f5f0e6] text-[#4a2c2a] placeholder-[#4a2c2a]/40 focus:outline-none focus:ring-2 focus:ring-[#bf5a36] transition font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Apelido (como quer ser chamado)</label>
                    <input
                      type="text"
                      value={cadApelido}
                      onChange={e => setCadApelido(e.target.value)}
                      placeholder="Seu apelido"
                      className="w-full px-4 py-3.5 rounded-2xl border-0 bg-[#f5f0e6] text-[#4a2c2a] placeholder-[#4a2c2a]/40 focus:outline-none focus:ring-2 focus:ring-[#bf5a36] transition font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={cadEmail}
                      onChange={e => setCadEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3.5 rounded-2xl border-0 bg-[#f5f0e6] text-[#4a2c2a] placeholder-[#4a2c2a]/40 focus:outline-none focus:ring-2 focus:ring-[#bf5a36] transition font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Telefone</label>
                    <input
                      type="tel"
                      required
                      value={cadTelefone}
                      onChange={e => setCadTelefone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full px-4 py-3.5 rounded-2xl border-0 bg-[#f5f0e6] text-[#4a2c2a] placeholder-[#4a2c2a]/40 focus:outline-none focus:ring-2 focus:ring-[#bf5a36] transition font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Senha</label>
                    <input
                      type="password"
                      required
                      value={cadSenha}
                      onChange={e => setCadSenha(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full px-4 py-3.5 rounded-2xl border-0 bg-[#f5f0e6] text-[#4a2c2a] placeholder-[#4a2c2a]/40 focus:outline-none focus:ring-2 focus:ring-[#bf5a36] transition font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Confirmar Senha</label>
                    <input
                      type="password"
                      required
                      value={cadConfirmaSenha}
                      onChange={e => setCadConfirmaSenha(e.target.value)}
                      placeholder="Digite a senha novamente"
                      className="w-full px-4 py-3.5 rounded-2xl border-0 bg-[#f5f0e6] text-[#4a2c2a] placeholder-[#4a2c2a]/40 focus:outline-none focus:ring-2 focus:ring-[#bf5a36] transition font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-4 mt-4 bg-[#bf5a36] hover:bg-[#a64928] text-white font-bold rounded-full transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Criar Conta e Prosseguir
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>

                <p className="text-center text-xs font-semibold mt-4 text-gray-300">
                  Já possui uma conta?{' '}
                  <Link href="/login" className="text-[#e29b63] underline ml-1 font-bold">
                    Entrar na minha conta
                  </Link>
                </p>
              </form>
            )}

            {/* Passo 9: Checkout / Contato por WhatsApp */}
            {isCheckoutStep && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-2 text-center">
                  <span className="text-[#e29b63] font-bold text-xs uppercase tracking-widest block">
                    ATIVAR ASSINATURA
                  </span>
                  <h2 className="font-serif text-3xl font-normal text-white md:text-4xl">
                    Escolha como quer descobrir seu próximo café
                  </h2>
                  <p className="text-gray-300 text-sm leading-relaxed max-w-xl mx-auto font-sans">
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
                        className={`bg-[#fcf8f2] text-[#2f3b2a] rounded-2xl p-6 shadow-md border-2 transition-all flex flex-col justify-between h-full ${
                          isSelected
                            ? 'border-[#bf5a36] scale-102 ring-4 ring-[#bf5a36]/10'
                            : 'border-transparent opacity-95 hover:opacity-100'
                        }`}
                      >
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-serif text-xl font-bold text-[#2f3b2a]">{plan.nome}</h3>
                            <p className="text-[11px] text-gray-500 font-medium font-sans leading-relaxed mt-1">{plan.sub}</p>
                          </div>
                          
                          <p className="text-xs text-[#2f3b2a] font-sans">
                            a partir de <span className="font-serif text-xl font-bold text-[#bf5a36] block sm:inline">R$ {plan.preco.split(' ')[1].split('/')[0]}</span> <span className="text-[10px] text-gray-500 font-normal">/mês</span>
                          </p>

                          <ul className="space-y-2.5 pt-2 border-t border-gray-200">
                            {plan.features.map((feat, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-[11px] text-gray-600 font-sans leading-tight">
                                <Check size={12} className="text-[#bf5a36] mt-0.5 flex-shrink-0" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedPlan(k)}
                          className={`w-full py-2.5 mt-6 font-bold rounded-xl text-xs transition duration-200 ${
                            isSelected
                              ? 'bg-[#bf5a36] hover:bg-[#a64928] text-white shadow-md'
                              : 'bg-[#f5ede3] hover:bg-[#eadfd0] text-[#2f3b2a] border border-gray-300'
                          }`}
                        >
                          {isSelected ? 'Plano Selecionado' : 'Selecionar plano'}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Card Separado de Pagamento */}
                <div className="bg-[#fcf8f2] text-[#2f3b2a] rounded-2xl p-6 shadow-md border border-white/10 space-y-3 mt-4 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <MessageSquare size={16} className="text-green-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2f3b2a] font-sans">Pagamento</span>
                  </div>
                  <div className="font-sans text-xs text-gray-600 space-y-2 leading-relaxed">
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
                    className="w-full py-4 bg-[#bf5a36] hover:bg-[#a64928] text-white font-bold rounded-full transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] font-sans"
                  >
                    Confirmar e Finalizar Assinatura
                    <Check size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/perfil')}
                    className="w-full py-2 bg-transparent text-gray-300 hover:text-white font-bold transition-all text-xs text-center block hover:underline font-sans"
                  >
                    Prefiro continuar sem assinar
                  </button>
                </div>
              </div>
            )}

            {/* Navegação Inferior */}
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-white/20">
              <button
                onClick={() => setStep(s => s === ATRIBUTOS.length + 3 && user ? ATRIBUTOS.length + 1 : s - 1)}
                disabled={step === 0 || isAuthStep || isCheckoutStep && saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-gray-300 hover:bg-white/5 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
                Voltar
              </button>

              {/* Botão Próximo/Salvar */}
              {isSensoryStep && (
                <button
                  onClick={() => setStep(s => s + 1)}
                  className="flex items-center gap-1 bg-[#bf5a36] text-white px-7 py-3 rounded-full font-bold text-xs hover:bg-[#a64928] transition-all shadow shadow-[#bf5a36]/25"
                >
                  Próximo
                  <ChevronRight size={16} />
                </button>
              )}

              {isPrefsStep && (
                <button
                  onClick={() => setStep(s => s + 1)}
                  className="flex items-center gap-1 bg-[#bf5a36] text-white px-7 py-3 rounded-full font-bold text-xs hover:bg-[#a64928] transition-all shadow shadow-[#bf5a36]/25"
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
  );
}
