'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sliders, ArrowLeft, Save, Sparkles, SlidersHorizontal, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
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

    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(false), 3000);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#1c3328] flex items-center justify-center text-[#f5ede3]">
        <div className="w-8 h-8 rounded-full border-2 border-[#b5563c] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5ede3] text-[#2f3b2a] flex flex-col font-sans">
      <SiteHeader />

      <main className="flex-1 bg-[#1c3328] py-12 px-4 md:px-6 lg:px-8 text-white">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Voltar */}
          <Link 
            href="/perfil" 
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white uppercase tracking-wider transition-colors"
          >
            <ArrowLeft size={14} />
            Voltar ao Painel
          </Link>

          {/* Cabeçalho */}
          <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <Sliders size={24} className="text-[#e29b63]" />
              </div>
              <div>
                <h1 className="font-serif text-3xl font-normal text-white">Refazer Perfil Sensorial</h1>
                <p className="text-gray-300 text-sm font-sans">Ajuste os valores dos atributos diretamente ou responda ao quiz completo.</p>
              </div>
            </div>
            
            <Link 
              href="/onboarding" 
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition border border-white/10 font-sans w-fit"
            >
              <RefreshCw size={12} />
              Refazer Quiz Completo
            </Link>
          </div>

          {/* Sucesso */}
          {success && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-200 text-sm p-4 rounded-xl flex items-center gap-2 font-sans">
              <Sparkles size={16} className="text-green-400" />
              <span>Perfil sensorial atualizado com sucesso! Suas recomendações de café foram recalculadas.</span>
            </div>
          )}

          {/* Formulário */}
          <div className="bg-card text-card-foreground rounded-2xl p-6 shadow-md border border-border/40">
            <form onSubmit={handleSave} className="space-y-6">
              <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-1.5">
                <SlidersHorizontal size={18} className="text-primary" />
                Ajuste Fino dos Atributos
              </h3>

              {/* Descrição Detalhada em Tempo Real */}
              <div className="bg-background/50 p-4 rounded-xl border border-border/40 space-y-1 font-sans">
                <span className="text-[10px] text-primary font-bold uppercase tracking-wider block">Classificação IA (Tempo Real)</span>
                <h4 className="font-serif text-sm font-bold text-foreground">
                  {obterPerfilDescricao(valores).nome}
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {obterPerfilDescricao(valores).detalhes}
                </p>
              </div>

              <div className="space-y-6 font-sans">
                {ATRIBUTOS.map(({ key, label, desc }) => (
                  <div key={key} className="space-y-2 border-b border-border/40 pb-4 last:border-0 last:pb-0">
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
                  className="text-xs text-muted-foreground hover:underline font-bold"
                >
                  Descartar Alterações
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-primary hover:bg-primary/95 text-white px-6 py-3 rounded-full font-bold text-xs transition shadow disabled:opacity-60 flex items-center gap-1.5"
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

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
