'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sliders, ArrowLeft, Save, Sparkles, SlidersHorizontal, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PerfilTabs } from '@/components/perfil/perfil-tabs';
import { obterPerfilDescricao } from '@/lib/recommendations';

const ATRIBUTOS = [
  { key: 'acidez', label: 'Acidez', desc: 'Sabor cítrico, brilhante ou frutado' },
  { key: 'docura', label: 'Doçura', desc: 'Notas naturais de açúcar, caramelo e chocolate' },
  { key: 'corpo', label: 'Corpo', desc: 'Sensação de peso e cremosidade na boca' },
  { key: 'amargor', label: 'Amargor', desc: 'Presença clássica da torra e intensidade' },
  { key: 'intensidade', label: 'Intensidade', desc: 'Força e impacto geral do café no paladar' },
] as const;

export default function SensorialDetalhesPage() {
  const router = useRouter();
  const { user, perfilSensorial, loading, savePerfilSensorial } = useAuth();
  
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [valores, setValores] = useState({
    acidez: 3,
    docura: 3,
    corpo: 3,
    amargor: 3,
    intensidade: 3,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (perfilSensorial) {
      setValores({
        acidez: perfilSensorial.acidez,
        docura: perfilSensorial.docura,
        corpo: perfilSensorial.corpo,
        amargor: perfilSensorial.amargor,
        intensidade: perfilSensorial.intensidade,
      });
    }
  }, [perfilSensorial]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    
    // Save current values, preserving existing preferences or initializing as empty array if none
    const prefs = perfilSensorial?.preferencias || [];
    await savePerfilSensorial(valores, prefs);
    
    setSaving(false);
    setSuccess(true);

    // Redirect to profile page after 1.5 seconds so they see the success message
    setTimeout(() => {
      setSuccess(false);
      router.push('/perfil');
    }, 1500);
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 text-primary">
              <Sliders size={28} />
            </div>
            <div>
              <p className="kicker text-primary">Calibração Sensorial</p>
              <h1 className="font-serif text-3xl md:text-4xl text-foreground font-normal mt-0.5">Meu Perfil Sensorial</h1>
              <p className="text-muted-foreground text-sm font-sans">Ajuste os valores dos atributos diretamente ou responda ao quiz completo.</p>
            </div>
          </div>
          
          <Link 
            href="/onboarding" 
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-card hover:bg-muted text-foreground font-bold rounded-full text-xs transition-colors border border-border shadow-xs font-sans w-fit"
          >
            <RefreshCw size={12} />
            Refazer Quiz Completo
          </Link>
        </div>

        {/* Barra de Abas Unificada */}
        <PerfilTabs />

        {/* Sucesso */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-xs p-4 rounded-xl flex items-center gap-2 font-sans font-medium shadow-xs">
            <Sparkles size={16} className="text-green-600 shrink-0" />
            <span>Perfil sensorial atualizado com sucesso! Suas recomendações de café foram recalculadas.</span>
          </div>
        )}

        {/* Formulário */}
        <div className="bg-card text-card-foreground rounded-2xl p-6 shadow-sm border border-border">
            <form onSubmit={handleSave} className="space-y-6">
              <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-1.5">
                <SlidersHorizontal size={18} className="text-primary" />
                Ajuste Fino dos Atributos
              </h3>

              {/* Descrição Detalhada em Tempo Real */}
              <div className="bg-muted/40 p-4 rounded-xl border border-border/60 font-sans">
                <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
                    <Image
                      src="/images/persona_coffee_lover.jpg"
                      alt="Persona do Perfil Sensorial"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1 flex-1 text-center sm:text-left">
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider block">Classificação IA (Tempo Real)</span>
                    <h4 className="font-serif text-sm font-bold text-foreground">
                      {obterPerfilDescricao(valores).nome}
                    </h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {obterPerfilDescricao(valores).detalhes}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 font-sans">
                {ATRIBUTOS.map(({ key, label, desc }) => (
                  <div key={key} className="space-y-2 border-b border-border/60 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-baseline">
                      <div>
                        <label className="text-sm font-bold text-foreground block capitalize">{label}</label>
                        <span className="text-[10px] text-muted-foreground font-semibold">{desc}</span>
                      </div>
                      <span className="text-primary font-bold text-sm bg-primary/10 px-2 py-0.5 rounded-md">
                        {valores[key]} / 5
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground font-semibold">Leve / Suave</span>
                      <input 
                        type="range"
                        min="1"
                        max="5"
                        value={valores[key]}
                        onChange={(e) => setValores(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                        className="flex-1 h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
                      />
                      <span className="text-xs text-muted-foreground font-semibold">Intenso / Forte</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botões de Ação */}
              <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-4 font-sans">
                <Link 
                  href="/perfil"
                  className="text-xs text-muted-foreground hover:text-foreground hover:underline font-bold"
                >
                  Descartar Alterações
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full font-bold text-xs transition shadow-sm disabled:opacity-60 flex items-center gap-1.5"
                >
                  {saving ? 'Salvando...' : (
                    <>
                      <Save size={14} />
                      Salvar Alterações
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>

      <SiteFooter />
    </div>
  );
}
