'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Calendar, RefreshCw, AlertCircle, ArrowLeft, ShieldCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PerfilTabs } from '@/components/perfil/perfil-tabs';

const PLANOS_INFO = {
  basico: { nome: 'Descoberta', preco: 'R$ 89,90/mês', pacotes: 1 },
  premium: { nome: 'Sommelier', preco: 'R$ 139,90/mês', pacotes: 2 },
  plus: { nome: 'Colecionador', preco: 'R$ 219,90/mês', pacotes: 3 }
};

// Mock de entregas
const MOCK_ENTREGAS = [
  {
    id: 'box-3',
    nome: 'Caixa de Agosto / 2026',
    data: 'Em preparação',
    status: 'Preparando envio',
    statusColor: 'bg-blue-100/50 text-blue-800 border-blue-200'
  },
  {
    id: 'box-2',
    nome: 'Caixa de Julho / 2026',
    data: 'Entregue em 15/07/2026',
    status: 'Entregue',
    statusColor: 'bg-green-100/50 text-green-800 border-green-200'
  },
  {
    id: 'box-1',
    nome: 'Caixa de Junho / 2026',
    data: 'Entregue em 12/06/2026',
    status: 'Entregue',
    statusColor: 'bg-green-100/50 text-green-800 border-green-200'
  }
];

export default function AssinaturaDetalhesPage() {
  const router = useRouter();
  const { 
    user, 
    assinatura, 
    loading, 
    updateAssinaturaStatus, 
    changeAssinaturaPlano 
  } = useAuth();
  
  const [changingPlan, setChangingPlan] = useState(false);
  const [updatingSub, setUpdatingSub] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleUpdateSubStatus = async (novoStatus: 'ativa' | 'pausada' | 'cancelada') => {
    setUpdatingSub(true);
    await updateAssinaturaStatus(novoStatus);
    setUpdatingSub(false);
  };

  const handleChangePlano = async (plano: 'basico' | 'premium' | 'plus') => {
    setUpdatingSub(true);
    await changeAssinaturaPlano(plano);
    setChangingPlan(false);
    setUpdatingSub(false);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between font-sans">
      <SiteHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto py-10 px-4 md:px-6 lg:px-8 space-y-8">
        {/* Cabeçalho */}
        <div className="flex items-center gap-4 pb-2">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
            <CreditCard size={28} />
          </div>
          <div>
            <p className="kicker text-primary">Assinatura Ativa</p>
            <h1 className="font-serif text-3xl md:text-4xl text-foreground font-normal mt-0.5">Minha Assinatura</h1>
            <p className="text-muted-foreground text-sm font-sans">Gerencie o plano do seu clube, veja faturamento e o histórico de entregas.</p>
          </div>
        </div>

        {/* Barra de Abas Unificada */}
        <PerfilTabs />

          {!assinatura ? (
            <div className="bg-card text-card-foreground rounded-2xl p-8 text-center border border-border/40">
              <div className="w-14 h-14 bg-muted/40 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                <AlertCircle size={28} />
              </div>
              <h3 className="font-serif text-lg font-bold mb-2">Nenhuma Assinatura Ativa</h3>
              <p className="text-sm text-muted-foreground mb-6 font-sans">Você ainda não escolheu um plano de assinatura para receber nossos cafés especiais.</p>
              <Link 
                href="/onboarding" 
                className="bg-primary hover:bg-primary/95 text-white font-bold text-xs px-6 py-3 rounded-full shadow transition-all inline-flex items-center gap-2"
              >
                Configurar Assinatura
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 items-start">
              
              {/* Card de Detalhes da Assinatura (Esquerda) */}
              <div className="md:col-span-2 space-y-6">
                
                {/* Status e Planos */}
                <div className="bg-card text-card-foreground rounded-2xl p-6 shadow-md border border-border/40 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-foreground">Detalhes do Plano</h3>
                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                      assinatura.status === 'ativa' ? 'bg-green-100 text-green-800 border border-green-200' :
                      assinatura.status === 'pausada' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {assinatura.status === 'ativa' ? 'Ativa' : assinatura.status === 'pausada' ? 'Pausada' : 'Cancelada'}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 bg-background/50 p-4 rounded-xl border border-border/40 font-sans">
                    <div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Clube Contratado</p>
                      <p className="font-serif text-base font-bold text-foreground capitalize mt-0.5">
                        Clube {PLANOS_INFO[assinatura.plano as keyof typeof PLANOS_INFO]?.nome || assinatura.plano}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Enviaremos {PLANOS_INFO[assinatura.plano as keyof typeof PLANOS_INFO]?.pacotes} pacote(s) / mês</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Mensalidade</p>
                      <p className="font-serif text-base font-bold text-primary mt-0.5">
                        {PLANOS_INFO[assinatura.plano as keyof typeof PLANOS_INFO]?.preco || '—'}
                      </p>
                    </div>
                  </div>

                  {assinatura.proxima_entrega && assinatura.status === 'ativa' && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold border-b border-border/60 pb-4 font-sans">
                      <Calendar size={16} className="text-primary" />
                      Próxima Caixa: {new Date(assinatura.proxima_entrega).toLocaleDateString('pt-BR')}
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <div className="flex gap-2">
                      {assinatura.status === 'ativa' && (
                        <>
                          <button
                            onClick={() => handleUpdateSubStatus('pausada')}
                            disabled={updatingSub}
                            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 border border-amber-500/30 px-4 py-2 rounded-xl text-xs font-bold transition font-sans"
                          >
                            Pausar Clube
                          </button>
                          <button
                            onClick={() => handleUpdateSubStatus('cancelada')}
                            disabled={updatingSub}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-800 border border-red-500/30 px-4 py-2 rounded-xl text-xs font-bold transition font-sans"
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                      {(assinatura.status === 'pausada' || assinatura.status === 'cancelada') && (
                        <button
                          onClick={() => handleUpdateSubStatus('ativa')}
                          disabled={updatingSub}
                          className="bg-green-500/10 hover:bg-green-500/20 text-green-800 border border-green-500/30 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 font-sans"
                        >
                          <RefreshCw size={12} className={updatingSub ? 'animate-spin' : ''} />
                          Reativar Assinatura
                        </button>
                      )}
                    </div>

                    <div className="relative">
                      {!changingPlan ? (
                        <button
                          onClick={() => setChangingPlan(true)}
                          disabled={updatingSub}
                          className="text-primary hover:text-primary/80 font-bold text-xs underline underline-offset-4 font-sans"
                        >
                          Alterar Plano
                        </button>
                      ) : (
                        <div className="flex flex-col gap-1 w-48 bg-card border border-border p-2 rounded-xl shadow-lg absolute right-0 bottom-full mb-2 z-10 text-card-foreground">
                          <span className="text-[10px] text-muted-foreground font-bold uppercase p-1">Escolha o plano:</span>
                          {(Object.keys(PLANOS_INFO) as Array<keyof typeof PLANOS_INFO>).map(k => (
                            <button
                              key={k}
                              onClick={() => handleChangePlano(k)}
                              disabled={assinatura.plano === k}
                              className={`text-left text-xs p-2 rounded-lg font-semibold transition-colors ${
                                assinatura.plano === k
                                  ? 'bg-muted/30 text-muted-foreground cursor-not-allowed'
                                  : 'hover:bg-primary/10 text-foreground'
                              }`}
                            >
                              {PLANOS_INFO[k].nome}
                            </button>
                          ))}
                          <button
                            onClick={() => setChangingPlan(false)}
                            className="text-[10px] text-red-500 font-bold p-1 hover:underline text-center border-t mt-1"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Histórico de Entregas */}
                <div className="bg-card text-card-foreground rounded-2xl p-6 shadow-md border border-border/40">
                  <h3 className="font-serif text-lg font-bold text-foreground mb-4">Histórico de Entregas</h3>
                  <div className="divide-y divide-border/60">
                    {MOCK_ENTREGAS.map(item => (
                      <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4 font-sans">
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-foreground">{item.nome}</p>
                          <p className="text-xs text-muted-foreground">{item.data}</p>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${item.statusColor}`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Informações Faturamento (Direita) */}
              <div className="bg-card text-card-foreground rounded-2xl p-6 shadow-md border border-border/40 space-y-4">
                <h3 className="font-serif text-base font-bold text-foreground flex items-center gap-1.5">
                  <ShieldCheck size={18} className="text-green-600" />
                  Faturamento Seguro
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                  Sua assinatura está ativa via atendimento de curadoria especial. As cobranças recorrentes são enviadas todo mês pelo WhatsApp no número cadastrado.
                </p>
                <div className="border-t border-border/60 pt-4 space-y-2 text-xs font-semibold text-muted-foreground font-sans">
                  <div className="flex justify-between">
                    <span>Método:</span>
                    <span className="text-foreground">WhatsApp Pay / PIX / Cartão</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cobrança:</span>
                    <span className="text-foreground">Todo dia {new Date(assinatura.created_at).getDate()}</span>
                  </div>
                </div>
              </div>

            </div>
          )}
        </main>

      <SiteFooter />
    </div>
  );
}
