'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Coffee, Eye, EyeOff, Search, User } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInBypass } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await signIn(email, password);
      if (res.success) {
        router.push('/perfil');
      } else {
        setErrorMsg(res.message || 'Erro ao entrar.');
        setLoading(false);
      }
    } catch (e: any) {
      setErrorMsg('Ocorreu um erro ao fazer login.');
      setLoading(false);
    }
  };

  const handleBypass = async () => {
    setLoading(true);
    await signInBypass();
    router.push('/perfil');
  };

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
            <Link href="/onboarding" className="hover:text-[#bf5a36] transition-colors">Assinatura</Link>
            <Link href="/#como-funciona" className="hover:text-[#bf5a36] transition-colors">Como Funciona</Link>
          </nav>
          <div className="flex justify-center">
            <Link href="/" className="font-display text-2xl font-bold tracking-[0.25em] text-[#4a2c2a] md:text-3xl">
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
              <Link href="/login" className="text-[#bf5a36] hover:text-[#bf5a36] transition-colors">
                <User size={20} />
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Área do Form com Fundo Verde Oliva */}
      <div className="flex-1 bg-[#1c3328] text-white flex flex-col items-center justify-center py-16 px-6">
        <div className="max-w-md w-full mx-auto bg-[#f5f0e6] text-[#4a2c2a] rounded-3xl p-8 sm:p-10 shadow-2xl border border-[#4a2c2a]/10">
          
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-[#bf5a36] flex items-center justify-center">
              <Coffee size={16} className="text-white" />
            </div>
            <span className="font-display text-lg font-bold tracking-widest text-[#4a2c2a]">PINGADO</span>
          </div>

          <h1 className="font-display text-3xl font-bold text-[#4a2c2a] mb-2">Bem-vindo de volta</h1>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">Entre na sua conta para acompanhar seu clube e perfil sensorial.</p>

          {errorMsg && (
            <div className="bg-red-100 border border-red-200 text-red-700 text-xs p-4 rounded-xl mb-4">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#4a2c2a] uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3.5 rounded-2xl border-0 bg-white text-[#4a2c2a] focus:outline-none focus:ring-2 focus:ring-[#bf5a36] transition font-semibold"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-[#4a2c2a] uppercase tracking-wider">Senha</label>
              </div>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 rounded-2xl border-0 bg-white text-[#4a2c2a] focus:outline-none focus:ring-2 focus:ring-[#bf5a36] transition font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#bf5a36]"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-6 bg-[#bf5a36] hover:bg-[#a64928] text-white font-bold rounded-full transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : 'Entrar'}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#4a2c2a]/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-[#f5f0e6] text-gray-500 font-bold uppercase tracking-wider text-[10px]">Acesso Rápido</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBypass}
              disabled={loading}
              className="w-full py-3.5 bg-transparent border-2 border-[#4a2c2a]/20 text-[#4a2c2a] hover:border-[#bf5a36]/40 font-bold rounded-full transition-all flex items-center justify-center gap-2"
            >
              Entrar sem Cadastro (Bypass)
            </button>
          </form>

          <p className="text-center text-xs font-semibold text-gray-500 mt-8">
            Não tem uma conta?{' '}
            <Link href="/onboarding" className="text-[#bf5a36] underline font-bold ml-1">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
