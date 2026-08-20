'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Save, Sliders, CreditCard, AlertCircle, Sparkles, LogOut, Award, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { obterPerfilDescricao } from '@/lib/recommendations';

const ATRIBUTOS = [
  { key: 'acidez', label: 'Acidez' },
  { key: 'docura', label: 'Doçura' },
  { key: 'corpo', label: 'Corpo' },
  { key: 'amargor', label: 'Amargor' },
  { key: 'intensidade', label: 'Intensidade' },
] as const;

const PLANOS_INFO = {
  basico: { nome: 'Descoberta', preco: 'R$ 89,90/mês' },
  premium: { nome: 'Sommelier', preco: 'R$ 139,90/mês' },
  plus: { nome: 'Colecionador', preco: 'R$ 219,90/mês' }
};

export default function PerfilPage() {
  const router = useRouter();
  const { 
    user, 
    perfil, 
    perfilSensorial, 
    assinatura, 
    loading, 
    signOut, 
    savePerfilDados,
    getRecomendados 
  } = useAuth();
  
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (perfil) {
      setNome(perfil.nome || '');
      setTelefone(perfil.telefone || '');
    }
  }, [perfil]);

  const handleSavePerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    setSaving(true);
    await savePerfilDados(nome, telefone);
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#1c3328] flex items-center justify-center text-[#f5ede3]">
        <div className="w-8 h-8 rounded-full border-2 border-[#b5563c] border-t-transparent animate-spin" />
      </div>
    );
  }

  const recomendados = getRecomendados();

  return (
    <div className="min-h-screen bg-[#f5ede3] text-[#2f3b2a] flex flex-col font-sans">
      <SiteHeader />

      {/* Área Verde Oliva do Painel */}
      <main className="flex-1 bg-[#1c3328] py-12 px-4 md:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Cabeçalho do Dashboard */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <User size={24} className="text-[#e29b63]" />
              </div>
              <div>
                <h1 className="font-serif text-3xl font-normal text-white">Painel do Assinante</h1>
                <p className="text-gray-300 text-sm font-sans">Gerencie seu perfil, preferências sensoriais e detalhes do clube.</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-full transition-all border border-white/15 shadow-sm w-fit"
            >
              <LogOut size={14} className="text-[#e29b63]" />
              Sair da Conta
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Coluna Esquerda: Assinatura, Compras e Dados */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Seção Minha Assinatura */}
              <div className="bg-card text-card-foreground rounded-2xl p-6 shadow-md border border-border/40 border-l-4 border-l-primary flex flex-col justify-between h-fit">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-serif text-xl font-normal text-foreground flex items-center gap-2">
                      <CreditCard size={20} className="text-primary" />
                      Minha Assinatura
                    </h2>
                    {assinatura && (
                      <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                        assinatura.status === 'ativa' ? 'bg-green-100 text-green-800 border border-green-200' :
                        assinatura.status === 'pausada' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {assinatura.status === 'ativa' ? 'Ativa' : assinatura.status === 'pausada' ? 'Pausada' : 'Cancelada'}
                      </span>
                    )}
                  </div>

                  {!assinatura ? (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 bg-muted/40 rounded-2xl flex items-center justify-center mx-auto mb-3 text-primary">
                        <AlertCircle size={22} />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 font-semibold">Você ainda não possui um plano de assinatura ativo.</p>
                      <Link 
                        href="/onboarding" 
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs px-6 py-3 rounded-full shadow transition-all"
                      >
                        Assinar Clube Pingado
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-background/50 p-4 rounded-xl border border-border/40">
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Assinatura do Clube</p>
                        <p className="font-serif text-base font-bold text-foreground capitalize mt-0.5">
                          Clube {PLANOS_INFO[assinatura.plano as keyof typeof PLANOS_INFO]?.nome || assinatura.plano} ({PLANOS_INFO[assinatura.plano as keyof typeof PLANOS_INFO]?.preco})
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {assinatura && (
                  <div className="mt-6 pt-4 border-t border-border/50 flex justify-end">
                    <Link 
                      href="/perfil/assinatura" 
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                    >
                      Mais detalhes
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>

              {/* Seção Minhas Compras */}
              <div className="bg-card text-card-foreground rounded-2xl p-6 shadow-md border border-border/40 flex flex-col justify-between h-fit">
                <div>
                  <h2 className="font-serif text-xl font-normal text-foreground mb-4 flex items-center gap-2">
                    <ShoppingBag size={20} className="text-primary" />
                    Minhas Compras Avulsas
                  </h2>
                  <p className="text-xs text-muted-foreground font-medium font-sans">
                    Gerencie e acompanhe seus pedidos de cafés especiais comprados avulsos em nossa loja.
                  </p>
                  
                  <div className="mt-4 bg-background/50 p-4 rounded-xl border border-border/40 text-xs font-semibold text-muted-foreground font-sans">
                    Você possui <strong className="text-foreground">2 compras avulsas</strong> finalizadas em seu histórico.
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 flex justify-end">
                  <Link 
                    href="/perfil/compras" 
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                  >
                    Mais detalhes
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Informações Cadastrais */}
              <div className="bg-card text-card-foreground rounded-2xl p-6 shadow-md border border-border/40">
                <h2 className="font-serif text-xl font-normal text-foreground mb-5 flex items-center gap-2">
                  <User size={20} className="text-primary" />
                  Dados do Cadastro
                </h2>

                <form onSubmit={handleSavePerfil} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Nome Completo</label>
                      <input
                        type="text"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        placeholder="Seu nome"
                        className="w-full px-4 py-3 rounded-xl border border-border/80 bg-white text-[#2f3b2a] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Telefone</label>
                      <input
                        type="tel"
                        value={telefone}
                        onChange={e => setTelefone(e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="w-full px-4 py-3 rounded-xl border border-border/80 bg-white text-[#2f3b2a] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition font-semibold"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Email</label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-4 py-3 rounded-xl border border-border/60 bg-muted/40 text-muted-foreground cursor-not-allowed font-semibold"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 bg-primary hover:bg-primary/95 text-white px-6 py-3 rounded-full font-bold text-xs transition shadow disabled:opacity-60"
                    >
                      {saving ? (
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Save size={14} />
                      )}
                      Salvar Alterações
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Coluna Direita: Perfil Sensorial */}
            <div className="space-y-6">
              <div className="bg-card text-card-foreground rounded-2xl p-6 shadow-md border border-border/40 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-serif text-xl font-normal text-foreground flex items-center gap-2">
                      <Sliders size={20} className="text-primary" />
                      Perfil Sensorial
                    </h2>
                  </div>

                  {perfilSensorial ? (
                    <div className="space-y-4">
                      {/* Descrição Detalhada em Texto */}
                      <div className="bg-background/50 p-4 rounded-xl border border-border/40 space-y-1 font-sans mb-4">
                        <span className="text-[10px] text-primary font-bold uppercase tracking-wider block">Classificação IA</span>
                        <h4 className="font-serif text-sm font-bold text-foreground">
                          {obterPerfilDescricao(perfilSensorial).nome}
                        </h4>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          {obterPerfilDescricao(perfilSensorial).detalhes}
                        </p>
                      </div>

                      {ATRIBUTOS.map(({ key, label }) => (
                        <div key={key}>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span className="text-card-foreground/80">{label}</span>
                            <span className="text-primary font-bold">{perfilSensorial[key]}/5</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full" 
                              style={{ width: `${(perfilSensorial[key] / 5) * 100}%` }} 
                            />
                          </div>
                        </div>
                      ))}

                      {perfilSensorial.preferencias && perfilSensorial.preferencias.length > 0 && (
                        <div className="pt-4 border-t border-border/60">
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 font-sans">Preferências Aromáticas</p>
                          <div className="flex flex-wrap gap-1.5">
                            {perfilSensorial.preferencias.slice(0, 3).map(pref => (
                              <span key={pref} className="text-[10px] bg-muted/40 text-primary px-2.5 py-1 rounded-full border border-border font-bold">
                                {pref}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 bg-muted/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-primary">
                        <Sliders size={20} />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 font-semibold font-sans">Nenhum perfil cadastrado.</p>
                      <Link href="/onboarding" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-primary/90 shadow">
                        Responder Quiz
                      </Link>
                    </div>
                  )}
                </div>

                {perfilSensorial && (
                  <div className="mt-6 pt-4 border-t border-border/60 flex justify-end">
                    <Link 
                      href="/perfil/sensorial" 
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                    >
                      Mais detalhes
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recomendações Baseadas no Perfil */}
          {perfilSensorial && recomendados.length > 0 && (
            <div className="pt-8 border-t border-white/10">
              <div className="mb-6">
                <h2 className="font-serif text-2xl font-normal text-white flex items-center gap-2">
                  <Award size={24} className="text-[#e29b63]" />
                  Recomendados para o Seu Paladar
                </h2>
                <p className="text-gray-300 text-sm mt-1 font-sans">Os cafés abaixo possuem a melhor compatibilidade com o seu perfil sensorial atual mapeado pela IA.</p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recomendados.slice(0, 3).map((cafe) => (
                  <div 
                    key={cafe.id} 
                    className="bg-card text-card-foreground rounded-2xl overflow-hidden shadow-md border border-border/40 flex flex-col h-full hover:shadow-lg transition-shadow"
                  >
                    {/* Header da Imagem */}
                    <div className="relative aspect-[4/3] bg-muted/20">
                      <Image
                        src={cafe.imagem_url || '/placeholder.jpg'}
                        alt={cafe.nome}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 30vw, 50vw"
                      />
                      
                      {/* Pontuação de Compatibilidade */}
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-primary px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                        <Sparkles size={12} fill="currentColor" />
                        {cafe.compatibilidade}% Compatível
                      </div>

                      {/* Score SCA */}
                      {cafe.score_sca && (
                        <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                          SCA {cafe.score_sca}
                        </div>
                      )}
                    </div>

                    {/* Conteúdo do Card */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider font-sans">
                            {cafe.produtores?.nome} • {cafe.regiao}
                          </p>
                          <h3 className="font-serif text-lg font-bold mt-1 text-foreground">
                            {cafe.nome}
                          </h3>
                        </div>
                        
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 font-sans">
                          {cafe.descricao}
                        </p>

                        {/* Badges de notas sensoriais */}
                        {cafe.notas_sensoriais && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {cafe.notas_sensoriais.slice(0, 3).map(nota => (
                              <span key={nota} className="text-[10px] bg-muted/40 border border-border/80 text-foreground px-2.5 py-1 rounded-full font-medium font-sans">
                                {nota}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-5">
                        <p className="font-serif text-lg font-bold text-foreground">
                          R$ {cafe.preco?.toFixed(2).replace('.', ',')}
                          <span className="text-[10px] text-muted-foreground font-normal ml-0.5 font-sans">/ 250g</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
