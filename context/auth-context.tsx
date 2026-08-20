'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Perfil, PerfilSensorial, Assinatura, Cafe } from '@/lib/types';
import { MOCK_CAFES } from '@/lib/coffees';
import { calcularCompatibilidade } from '@/lib/recommendations';

interface AuthContextType {
  user: { id: string; email: string; nome: string } | null;
  perfil: Perfil | null;
  perfilSensorial: PerfilSensorial | null;
  assinatura: Assinatura | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signUp: (email: string, password: string, nome: string, telefone: string) => Promise<{ success: boolean; message?: string }>;
  signInBypass: () => Promise<void>;
  signOut: () => Promise<void>;
  savePerfilSensorial: (valores: { acidez: number; docura: number; corpo: number; amargor: number; intensidade: number }, preferencias: string[]) => Promise<void>;
  saveAssinatura: (plano: 'basico' | 'premium' | 'plus') => Promise<void>;
  updateAssinaturaStatus: (status: 'ativa' | 'pausada' | 'cancelada') => Promise<void>;
  changeAssinaturaPlano: (plano: 'basico' | 'premium' | 'plus') => Promise<void>;
  savePerfilDados: (nome: string, telefone: string) => Promise<void>;
  getRecomendados: () => Cafe[];
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  perfil: null,
  perfilSensorial: null,
  assinatura: null,
  loading: true,
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  signInBypass: async () => {},
  signOut: async () => {},
  savePerfilSensorial: async () => {},
  saveAssinatura: async () => {},
  updateAssinaturaStatus: async () => {},
  changeAssinaturaPlano: async () => {},
  savePerfilDados: async () => {},
  getRecomendados: () => [],
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string; nome: string } | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [perfilSensorial, setPerfilSensorial] = useState<PerfilSensorial | null>(null);
  const [assinatura, setAssinatura] = useState<Assinatura | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar dados iniciais do localStorage (no cliente)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const activeSession = localStorage.getItem('pingado_active_session');
      if (activeSession) {
        try {
          const sessionUser = JSON.parse(activeSession);
          setUser(sessionUser);
          loadUserData(sessionUser.id, sessionUser.email, sessionUser.nome);
        } catch (e) {
          console.error('Erro ao ler sessão ativa:', e);
        }
      }
      setLoading(false);
    }
  }, []);

  const loadUserData = (userId: string, email: string, nome: string) => {
    // Carregar Perfil Geral
    const savedPerfis = JSON.parse(localStorage.getItem('pingado_perfis') || '{}');
    if (!savedPerfis[userId]) {
      const dbUsers = JSON.parse(localStorage.getItem('pingado_users_db') || '[]');
      const matchedUser = dbUsers.find((u: any) => u.id === userId);

      savedPerfis[userId] = {
        id: userId,
        nome: nome,
        email: email,
        telefone: matchedUser?.telefone || null,
        avatar_url: null,
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      localStorage.setItem('pingado_perfis', JSON.stringify(savedPerfis));
    }
    setPerfil(savedPerfis[userId]);

    // Carregar Perfil Sensorial
    const savedSensoriais = JSON.parse(localStorage.getItem('pingado_perfis_sensoriais') || '{}');
    if (savedSensoriais[userId]) {
      setPerfilSensorial(savedSensoriais[userId]);
    } else {
      setPerfilSensorial(null);
    }

    // Carregar Assinatura
    const savedAssinaturas = JSON.parse(localStorage.getItem('pingado_assinaturas') || '{}');
    if (savedAssinaturas[userId]) {
      setAssinatura(savedAssinaturas[userId]);
    } else {
      setAssinatura(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    const dbUsers = JSON.parse(localStorage.getItem('pingado_users_db') || '[]');
    const matchedUser = dbUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (!matchedUser || matchedUser.password !== password) {
      return { success: false, message: 'E-mail ou senha incorretos.' };
    }

    const sessionUser = { id: matchedUser.id, email: matchedUser.email, nome: matchedUser.nome };
    setUser(sessionUser);
    localStorage.setItem('pingado_active_session', JSON.stringify(sessionUser));
    loadUserData(matchedUser.id, matchedUser.email, matchedUser.nome);

    return { success: true };
  };

  const signUp = async (email: string, password: string, nome: string, telefone: string) => {
    const dbUsers = JSON.parse(localStorage.getItem('pingado_users_db') || '[]');
    const emailExists = dbUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (emailExists) {
      return { success: false, message: 'Já existe uma conta cadastrada com este e-mail.' };
    }

    const newUser = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      email: email,
      password: password,
      nome: nome,
      telefone: telefone
    };

    dbUsers.push(newUser);
    localStorage.setItem('pingado_users_db', JSON.stringify(dbUsers));

    const sessionUser = { id: newUser.id, email: newUser.email, nome: newUser.nome };
    setUser(sessionUser);
    localStorage.setItem('pingado_active_session', JSON.stringify(sessionUser));
    loadUserData(newUser.id, newUser.email, newUser.nome);

    return { success: true };
  };

  const signInBypass = async () => {
    const bypassUser = {
      id: 'bypass_user',
      email: 'po.luizandre@gmail.com',
      nome: 'Luiz André (Bypass)'
    };

    // Registrar no DB local de usuários
    const dbUsers = JSON.parse(localStorage.getItem('pingado_users_db') || '[]');
    if (!dbUsers.some((u: any) => u.email === bypassUser.email)) {
      dbUsers.push({ ...bypassUser, password: 'password123' });
      localStorage.setItem('pingado_users_db', JSON.stringify(dbUsers));
    }

    setUser(bypassUser);
    localStorage.setItem('pingado_active_session', JSON.stringify(bypassUser));
    loadUserData(bypassUser.id, bypassUser.email, bypassUser.nome);

    // Se não tiver perfil sensorial, criar um padrão para teste (Clássico Equilibrado)
    const savedSensoriais = JSON.parse(localStorage.getItem('pingado_perfis_sensoriais') || '{}');
    if (!savedSensoriais[bypassUser.id]) {
      const defaultSensorial = {
        id: 'sens_bypass',
        user_id: bypassUser.id,
        acidez: 3,
        docura: 3,
        corpo: 3,
        amargor: 3,
        intensidade: 3,
        preferencias: ['Chocolate', 'Caramelo'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      savedSensoriais[bypassUser.id] = defaultSensorial;
      localStorage.setItem('pingado_perfis_sensoriais', JSON.stringify(savedSensoriais));
      setPerfilSensorial(defaultSensorial);
    }

    // Se não tiver assinatura, criar uma padrão premium ativa
    const savedAssinaturas = JSON.parse(localStorage.getItem('pingado_assinaturas') || '{}');
    if (!savedAssinaturas[bypassUser.id]) {
      const proximaEntrega = new Date();
      proximaEntrega.setMonth(proximaEntrega.getMonth() + 1);
      const defaultAssinatura = {
        id: 'sub_bypass',
        user_id: bypassUser.id,
        plano: 'premium' as const,
        status: 'ativa' as const,
        proxima_entrega: proximaEntrega.toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      savedAssinaturas[bypassUser.id] = defaultAssinatura;
      localStorage.setItem('pingado_assinaturas', JSON.stringify(savedAssinaturas));
      setAssinatura(defaultAssinatura);
    }
  };

  const signOut = async () => {
    setUser(null);
    setPerfil(null);
    setPerfilSensorial(null);
    setAssinatura(null);
    localStorage.removeItem('pingado_active_session');
  };

  const savePerfilSensorial = async (
    valores: { acidez: number; docura: number; corpo: number; amargor: number; intensidade: number },
    preferencias: string[]
  ) => {
    let activeUser = user;
    if (!activeUser && typeof window !== 'undefined') {
      const activeSession = localStorage.getItem('pingado_active_session');
      if (activeSession) {
        activeUser = JSON.parse(activeSession);
      }
    }

    if (!activeUser) return;

    const newPerfilSensorial: PerfilSensorial = {
      id: 'sens_' + Math.random().toString(36).substr(2, 9),
      user_id: activeUser.id,
      ...valores,
      preferencias,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const savedSensoriais = JSON.parse(localStorage.getItem('pingado_perfis_sensoriais') || '{}');
    savedSensoriais[activeUser.id] = newPerfilSensorial;
    localStorage.setItem('pingado_perfis_sensoriais', JSON.stringify(savedSensoriais));
    setPerfilSensorial(newPerfilSensorial);
  };

  const saveAssinatura = async (plano: 'basico' | 'premium' | 'plus') => {
    let activeUser = user;
    if (!activeUser && typeof window !== 'undefined') {
      const activeSession = localStorage.getItem('pingado_active_session');
      if (activeSession) {
        activeUser = JSON.parse(activeSession);
      }
    }

    if (!activeUser) return;

    const proximaEntrega = new Date();
    proximaEntrega.setMonth(proximaEntrega.getMonth() + 1);

    const newAssinatura: Assinatura = {
      id: 'sub_' + Math.random().toString(36).substr(2, 9),
      user_id: activeUser.id,
      plano,
      status: 'ativa',
      proxima_entrega: proximaEntrega.toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const savedAssinaturas = JSON.parse(localStorage.getItem('pingado_assinaturas') || '{}');
    savedAssinaturas[activeUser.id] = newAssinatura;
    localStorage.setItem('pingado_assinaturas', JSON.stringify(savedAssinaturas));
    setAssinatura(newAssinatura);
  };

  const updateAssinaturaStatus = async (status: 'ativa' | 'pausada' | 'cancelada') => {
    if (!user || !assinatura) return;

    const updated = {
      ...assinatura,
      status,
      proxima_entrega: status === 'ativa' 
        ? (() => {
            const d = new Date();
            d.setMonth(d.getMonth() + 1);
            return d.toISOString().split('T')[0];
          })()
        : null,
      updated_at: new Date().toISOString()
    };

    const savedAssinaturas = JSON.parse(localStorage.getItem('pingado_assinaturas') || '{}');
    savedAssinaturas[user.id] = updated;
    localStorage.setItem('pingado_assinaturas', JSON.stringify(savedAssinaturas));
    setAssinatura(updated);
  };

  const changeAssinaturaPlano = async (plano: 'basico' | 'premium' | 'plus') => {
    if (!user || !assinatura) return;

    const updated = {
      ...assinatura,
      plano,
      updated_at: new Date().toISOString()
    };

    const savedAssinaturas = JSON.parse(localStorage.getItem('pingado_assinaturas') || '{}');
    savedAssinaturas[user.id] = updated;
    localStorage.setItem('pingado_assinaturas', JSON.stringify(savedAssinaturas));
    setAssinatura(updated);
  };

  const savePerfilDados = async (nome: string, telefone: string) => {
    if (!user || !perfil) return;

    const updatedPerfil = {
      ...perfil,
      nome,
      telefone,
      updated_at: new Date().toISOString()
    };

    const savedPerfis = JSON.parse(localStorage.getItem('pingado_perfis') || '{}');
    savedPerfis[user.id] = updatedPerfil;
    localStorage.setItem('pingado_perfis', JSON.stringify(savedPerfis));
    setPerfil(updatedPerfil);

    const updatedUser = { ...user, nome };
    setUser(updatedUser);
    localStorage.setItem('pingado_active_session', JSON.stringify(updatedUser));
  };

  const getRecomendados = () => {
    if (!perfilSensorial) return [];

    return MOCK_CAFES
      .map(cafe => ({
        ...cafe,
        compatibilidade: calcularCompatibilidade(cafe, perfilSensorial)
      }))
      .sort((a, b) => (b.compatibilidade ?? 0) - (a.compatibilidade ?? 0));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        perfil,
        perfilSensorial,
        assinatura,
        loading,
        signIn,
        signUp,
        signInBypass,
        signOut,
        savePerfilSensorial,
        saveAssinatura,
        updateAssinaturaStatus,
        changeAssinaturaPlano,
        savePerfilDados,
        getRecomendados,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
