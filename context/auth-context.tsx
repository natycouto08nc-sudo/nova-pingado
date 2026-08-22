'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Perfil, PerfilSensorial, Assinatura, Cafe, CafeComCompatibilidade } from '@/lib/types';
import { MOCK_CAFES } from '@/lib/coffees';
import { calcularCompatibilidade } from '@/lib/recommendations';
import { papelDoEmail } from '@/lib/pingado/auth-helpers';
import { DEMO_ADMIN_EMAIL, DEMO_CLIENTE_EMAIL, DEMO_VENDEDOR_EMAIL, DEMO_VENDEDOR_PRODUTOR_ID, CLIENTES_ASSINANTES } from '@/lib/pingado/crm-data';
import { getReferenceProfile, REFERENCE_PROFILES } from '@/lib/pingado/profiles';
import { matchPct } from '@/lib/pingado/selection';
import type { PapelUsuario, PlanoAssinatura, SensoryValues } from '@/lib/pingado/types';

export interface SellerInfo {
  produtorId: string;
  regiao: string;
  cnpj: string;
  capacidadeKg: string;
  canais: ('Vitrine' | 'Assinatura')[];
}

const PLANO_LABEL_TO_KEY: Record<PlanoAssinatura, 'basico' | 'premium' | 'plus'> = {
  Descoberta: 'basico',
  Sommelier: 'premium',
  Colecionador: 'plus',
};

interface DbUser {
  id: string;
  email: string;
  password: string;
  nome: string;
  telefone?: string;
  role: PapelUsuario;
  sellerInfo?: SellerInfo;
}

interface SessionUser {
  id: string;
  email: string;
  nome: string;
  role: PapelUsuario;
}

interface AuthContextType {
  user: { id: string; email: string; nome: string } | null;
  role: PapelUsuario | null;
  perfil: Perfil | null;
  perfilSensorial: PerfilSensorial | null;
  assinatura: Assinatura | null;
  sellerInfo: SellerInfo | null;
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
  getRecomendados: () => CafeComCompatibilidade[];

  // CRM Pingado — login multi-papel, cadastro em passos e magic link (mockados).
  papelDoEmail: (email: string) => PapelUsuario;
  entrarComSenha: (email: string, senha: string) => Promise<{ success: boolean; message?: string; role?: PapelUsuario }>;
  entrarComLinkMagico: (email: string) => Promise<{ success: boolean; message?: string; role?: PapelUsuario }>;
  cadastrarCliente: (dados: {
    nome: string; email: string; senha: string | null;
    quiz: SensoryValues; restricoes: string[]; plano: PlanoAssinatura;
  }) => Promise<{ success: boolean; message?: string; perfilNome?: string }>;
  cadastrarVendedor: (dados: {
    nome: string; email: string; senha: string | null;
    regiao: string; cnpj: string; capacidadeKg: string; canais: ('Vitrine' | 'Assinatura')[];
  }) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  perfil: null,
  perfilSensorial: null,
  assinatura: null,
  sellerInfo: null,
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
  papelDoEmail,
  entrarComSenha: async () => ({ success: false }),
  entrarComLinkMagico: async () => ({ success: false }),
  cadastrarCliente: async () => ({ success: false }),
  cadastrarVendedor: async () => ({ success: false }),
});

function readDb(): DbUser[] {
  try {
    return JSON.parse(localStorage.getItem('pingado_users_db') || '[]');
  } catch {
    return [];
  }
}
function writeDb(db: DbUser[]) {
  localStorage.setItem('pingado_users_db', JSON.stringify(db));
}
function idFor(prefix: string) {
  return prefix + '_' + Math.random().toString(36).slice(2, 11);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string; nome: string } | null>(null);
  const [role, setRole] = useState<PapelUsuario | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [perfilSensorial, setPerfilSensorial] = useState<PerfilSensorial | null>(null);
  const [assinatura, setAssinatura] = useState<Assinatura | null>(null);
  const [sellerInfo, setSellerInfo] = useState<SellerInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const activeSession = localStorage.getItem('pingado_active_session');
      if (activeSession) {
        try {
          const sessionUser: SessionUser = JSON.parse(activeSession);
          setUser(sessionUser);
          setRole(sessionUser.role ?? null);
          loadUserData(sessionUser.id, sessionUser.email, sessionUser.nome, sessionUser.role);
        } catch (e) {
          console.error('Erro ao ler sessão ativa:', e);
        }
      }
      setLoading(false);
    }
  }, []);

  const loadUserData = (userId: string, email: string, nome: string, papel?: PapelUsuario) => {
    const savedPerfis = JSON.parse(localStorage.getItem('pingado_perfis') || '{}');
    const dbUsers = readDb();
    const matchedUser = dbUsers.find((u) => u.id === userId);
    const papelFinal: PapelUsuario = papel ?? matchedUser?.role ?? 'cliente';

    if (!savedPerfis[userId] || savedPerfis[userId].role !== papelFinal) {
      savedPerfis[userId] = {
        id: userId,
        nome,
        email,
        telefone: matchedUser?.telefone || null,
        avatar_url: null,
        role: papelFinal,
        created_at: savedPerfis[userId]?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem('pingado_perfis', JSON.stringify(savedPerfis));
    }
    setPerfil(savedPerfis[userId]);

    const savedSensoriais = JSON.parse(localStorage.getItem('pingado_perfis_sensoriais') || '{}');
    setPerfilSensorial(savedSensoriais[userId] ?? null);

    const savedAssinaturas = JSON.parse(localStorage.getItem('pingado_assinaturas') || '{}');
    setAssinatura(savedAssinaturas[userId] ?? null);

    setSellerInfo(matchedUser?.sellerInfo ?? null);
  };

  const startSession = (u: DbUser) => {
    const sessionUser: SessionUser = { id: u.id, email: u.email, nome: u.nome, role: u.role };
    setUser({ id: u.id, email: u.email, nome: u.nome });
    setRole(u.role);
    localStorage.setItem('pingado_active_session', JSON.stringify(sessionUser));
    loadUserData(u.id, u.email, u.nome, u.role);
  };

  const signIn = async (email: string, password: string) => {
    const dbUsers = readDb();
    const matchedUser = dbUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!matchedUser || matchedUser.password !== password) {
      return { success: false, message: 'E-mail ou senha incorretos.' };
    }
    startSession(matchedUser);
    return { success: true };
  };

  const signUp = async (email: string, password: string, nome: string, telefone: string) => {
    const dbUsers = readDb();
    const emailExists = dbUsers.some((u) => u.email.toLowerCase() === email.toLowerCase());

    if (emailExists) {
      return { success: false, message: 'Já existe uma conta cadastrada com este e-mail.' };
    }

    const newUser: DbUser = { id: idFor('usr'), email, password, nome, telefone, role: 'cliente' };
    dbUsers.push(newUser);
    writeDb(dbUsers);
    startSession(newUser);
    return { success: true };
  };

  const signInBypass = async () => {
    const dbUsers = readDb();
    let bypassUser = dbUsers.find((u) => u.email === 'po.luizandre@gmail.com');
    if (!bypassUser) {
      bypassUser = { id: 'bypass_user', email: 'po.luizandre@gmail.com', password: 'password123', nome: 'Luiz André (Bypass)', role: 'cliente' };
      dbUsers.push(bypassUser);
      writeDb(dbUsers);
    }
    startSession(bypassUser);

    const savedSensoriais = JSON.parse(localStorage.getItem('pingado_perfis_sensoriais') || '{}');
    if (!savedSensoriais[bypassUser.id]) {
      const defaultSensorial = {
        id: 'sens_bypass', user_id: bypassUser.id,
        acidez: 3, docura: 3, corpo: 3, amargor: 3, intensidade: 3,
        preferencias: ['Chocolate', 'Caramelo'],
        created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      };
      savedSensoriais[bypassUser.id] = defaultSensorial;
      localStorage.setItem('pingado_perfis_sensoriais', JSON.stringify(savedSensoriais));
      setPerfilSensorial(defaultSensorial);
    }

    const savedAssinaturas = JSON.parse(localStorage.getItem('pingado_assinaturas') || '{}');
    if (!savedAssinaturas[bypassUser.id]) {
      const proximaEntrega = new Date();
      proximaEntrega.setMonth(proximaEntrega.getMonth() + 1);
      const defaultAssinatura = {
        id: 'sub_bypass', user_id: bypassUser.id, plano: 'premium' as const, status: 'ativa' as const,
        proxima_entrega: proximaEntrega.toISOString().split('T')[0],
        created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      };
      savedAssinaturas[bypassUser.id] = defaultAssinatura;
      localStorage.setItem('pingado_assinaturas', JSON.stringify(savedAssinaturas));
      setAssinatura(defaultAssinatura);
    }
  };

  const signOut = async () => {
    setUser(null);
    setRole(null);
    setPerfil(null);
    setPerfilSensorial(null);
    setAssinatura(null);
    setSellerInfo(null);
    localStorage.removeItem('pingado_active_session');
  };

  const savePerfilSensorial = async (
    valores: { acidez: number; docura: number; corpo: number; amargor: number; intensidade: number },
    preferencias: string[]
  ) => {
    let activeUser = user;
    if (!activeUser && typeof window !== 'undefined') {
      const activeSession = localStorage.getItem('pingado_active_session');
      if (activeSession) activeUser = JSON.parse(activeSession);
    }
    if (!activeUser) return;

    const newPerfilSensorial: PerfilSensorial = {
      id: idFor('sens'), user_id: activeUser.id, ...valores, preferencias,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
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
      if (activeSession) activeUser = JSON.parse(activeSession);
    }
    if (!activeUser) return;

    const proximaEntrega = new Date();
    proximaEntrega.setMonth(proximaEntrega.getMonth() + 1);
    const newAssinatura: Assinatura = {
      id: idFor('sub'), user_id: activeUser.id, plano, status: 'ativa',
      proxima_entrega: proximaEntrega.toISOString().split('T')[0],
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    };
    const savedAssinaturas = JSON.parse(localStorage.getItem('pingado_assinaturas') || '{}');
    savedAssinaturas[activeUser.id] = newAssinatura;
    localStorage.setItem('pingado_assinaturas', JSON.stringify(savedAssinaturas));
    setAssinatura(newAssinatura);
  };

  const updateAssinaturaStatus = async (status: 'ativa' | 'pausada' | 'cancelada') => {
    if (!user || !assinatura) return;
    const updated = {
      ...assinatura, status,
      proxima_entrega: status === 'ativa'
        ? (() => { const d = new Date(); d.setMonth(d.getMonth() + 1); return d.toISOString().split('T')[0]; })()
        : null,
      updated_at: new Date().toISOString(),
    };
    const savedAssinaturas = JSON.parse(localStorage.getItem('pingado_assinaturas') || '{}');
    savedAssinaturas[user.id] = updated;
    localStorage.setItem('pingado_assinaturas', JSON.stringify(savedAssinaturas));
    setAssinatura(updated);
  };

  const changeAssinaturaPlano = async (plano: 'basico' | 'premium' | 'plus') => {
    if (!user || !assinatura) return;
    const updated = { ...assinatura, plano, updated_at: new Date().toISOString() };
    const savedAssinaturas = JSON.parse(localStorage.getItem('pingado_assinaturas') || '{}');
    savedAssinaturas[user.id] = updated;
    localStorage.setItem('pingado_assinaturas', JSON.stringify(savedAssinaturas));
    setAssinatura(updated);
  };

  const savePerfilDados = async (nome: string, telefone: string) => {
    if (!user || !perfil) return;
    const updatedPerfil = { ...perfil, nome, telefone, updated_at: new Date().toISOString() };
    const savedPerfis = JSON.parse(localStorage.getItem('pingado_perfis') || '{}');
    savedPerfis[user.id] = updatedPerfil;
    localStorage.setItem('pingado_perfis', JSON.stringify(savedPerfis));
    setPerfil(updatedPerfil);
    const updatedUser = { ...user, nome };
    setUser(updatedUser);
    const raw = localStorage.getItem('pingado_active_session');
    const session = raw ? JSON.parse(raw) : {};
    localStorage.setItem('pingado_active_session', JSON.stringify({ ...session, nome }));
  };

  const getRecomendados = () => {
    if (!perfilSensorial) return [];
    return MOCK_CAFES
      .map((cafe) => ({ ...cafe, compatibilidade: calcularCompatibilidade(cafe, perfilSensorial) }))
      .sort((a, b) => (b.compatibilidade ?? 0) - (a.compatibilidade ?? 0));
  };

  // ---------------------------------------------------------------------
  // CRM Pingado — login multi-papel / magic link / cadastro em passos
  // ---------------------------------------------------------------------

  /** Provisiona (se necessário) e retorna a conta de demonstração associada a um e-mail conhecido. */
  const ensureDemoUser = (email: string): DbUser | null => {
    const e = email.toLowerCase();
    const dbUsers = readDb();
    const existing = dbUsers.find((u) => u.email.toLowerCase() === e);
    if (existing) return existing;

    let novo: DbUser | null = null;
    if (e === DEMO_VENDEDOR_EMAIL) {
      novo = {
        id: idFor('usr'), email, password: '', nome: 'Sítio Bom Jesus', role: 'vendedor',
        sellerInfo: { produtorId: DEMO_VENDEDOR_PRODUTOR_ID, regiao: 'Chapada Diamantina', cnpj: '23.456.789/0001-01', capacidadeKg: '260', canais: ['Vitrine', 'Assinatura'] },
      };
    } else if (e === DEMO_CLIENTE_EMAIL) {
      const cli = CLIENTES_ASSINANTES.find((c) => c.email === DEMO_CLIENTE_EMAIL)!;
      novo = { id: idFor('usr'), email, password: '', nome: cli.nome, role: 'cliente' };
    } else if (e === DEMO_ADMIN_EMAIL) {
      novo = { id: idFor('usr'), email, password: '', nome: 'Equipe de curadoria', role: 'admin' };
    }
    if (!novo) return null;

    dbUsers.push(novo);
    writeDb(dbUsers);

    if (novo.role === 'cliente') {
      const cli = CLIENTES_ASSINANTES.find((c) => c.email === e);
      if (cli) {
        const savedSensoriais = JSON.parse(localStorage.getItem('pingado_perfis_sensoriais') || '{}');
        savedSensoriais[novo.id] = {
          id: idFor('sens'), user_id: novo.id, ...cli.sens, preferencias: cli.tags,
          created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        };
        localStorage.setItem('pingado_perfis_sensoriais', JSON.stringify(savedSensoriais));

        const savedAssinaturas = JSON.parse(localStorage.getItem('pingado_assinaturas') || '{}');
        const proximaEntrega = new Date(); proximaEntrega.setMonth(proximaEntrega.getMonth() + 1);
        savedAssinaturas[novo.id] = {
          id: idFor('sub'), user_id: novo.id, plano: PLANO_LABEL_TO_KEY[cli.plano], status: 'ativa',
          proxima_entrega: proximaEntrega.toISOString().split('T')[0],
          created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        };
        localStorage.setItem('pingado_assinaturas', JSON.stringify(savedAssinaturas));
      }
    }
    return novo;
  };

  const entrarComSenha = async (email: string, senha: string) => {
    if (!email.includes('@')) return { success: false, message: 'Digite um e-mail válido.' };
    if (senha.length < 4) return { success: false, message: 'A senha precisa de pelo menos 4 caracteres.' };

    const eLower = email.toLowerCase();
    const isDemo = [DEMO_VENDEDOR_EMAIL, DEMO_CLIENTE_EMAIL, DEMO_ADMIN_EMAIL].includes(eLower);
    let matched = readDb().find((u) => u.email.toLowerCase() === eLower);

    if (!matched && isDemo) matched = ensureDemoUser(eLower) ?? undefined;
    if (!matched) return { success: false, message: 'Não encontramos uma conta com esse e-mail. Crie uma conta na aba "Criar conta".' };
    if (!isDemo && matched.password !== senha) return { success: false, message: 'E-mail ou senha incorretos.' };

    startSession(matched);
    return { success: true, role: matched.role };
  };

  const entrarComLinkMagico = async (email: string) => {
    if (!email.includes('@')) return { success: false, message: 'Digite um e-mail válido para receber o link.' };
    const eLower = email.toLowerCase();
    let matched = readDb().find((u) => u.email.toLowerCase() === eLower) ?? ensureDemoUser(eLower);

    if (!matched) {
      // Sem conta: cria uma conta cliente mínima, como um cadastro implícito via link mágico.
      matched = { id: idFor('usr'), email, password: '', nome: email.split('@')[0], role: papelDoEmail(email) };
      const dbUsers = readDb(); dbUsers.push(matched); writeDb(dbUsers);
    }
    startSession(matched);
    return { success: true, role: matched.role };
  };

  const cadastrarCliente: AuthContextType['cadastrarCliente'] = async ({ nome, email, senha, quiz, restricoes, plano }) => {
    if (!nome.trim()) return { success: false, message: 'Informe seu nome.' };
    if (!email.includes('@')) return { success: false, message: 'Digite um e-mail válido.' };
    if (senha != null && senha.length < 6) return { success: false, message: 'A senha precisa de pelo menos 6 caracteres.' };

    const dbUsers = readDb();
    if (dbUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'Já existe uma conta cadastrada com este e-mail.' };
    }

    const novo: DbUser = { id: idFor('usr'), email, password: senha ?? '', nome, role: 'cliente' };
    dbUsers.push(novo); writeDb(dbUsers);
    startSession(novo);

    const melhor = [...REFERENCE_PROFILES].sort((a, b) => matchPct(quiz, b.alvo) - matchPct(quiz, a.alvo))[0];
    const savedSensoriais = JSON.parse(localStorage.getItem('pingado_perfis_sensoriais') || '{}');
    savedSensoriais[novo.id] = {
      id: idFor('sens'), user_id: novo.id, ...quiz, preferencias: restricoes,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    };
    localStorage.setItem('pingado_perfis_sensoriais', JSON.stringify(savedSensoriais));
    setPerfilSensorial(savedSensoriais[novo.id]);

    const savedAssinaturas = JSON.parse(localStorage.getItem('pingado_assinaturas') || '{}');
    const proximaEntrega = new Date(); proximaEntrega.setMonth(proximaEntrega.getMonth() + 1);
    savedAssinaturas[novo.id] = {
      id: idFor('sub'), user_id: novo.id, plano: PLANO_LABEL_TO_KEY[plano], status: 'ativa',
      proxima_entrega: proximaEntrega.toISOString().split('T')[0],
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    };
    localStorage.setItem('pingado_assinaturas', JSON.stringify(savedAssinaturas));
    setAssinatura(savedAssinaturas[novo.id]);

    return { success: true, perfilNome: melhor.nome };
  };

  const cadastrarVendedor: AuthContextType['cadastrarVendedor'] = async ({ nome, email, senha, regiao, cnpj, capacidadeKg, canais }) => {
    if (!nome.trim()) return { success: false, message: 'Informe o nome da torrefação.' };
    if (!email.includes('@')) return { success: false, message: 'Digite um e-mail válido.' };
    if (senha != null && senha.length < 6) return { success: false, message: 'A senha precisa de pelo menos 6 caracteres.' };
    if (!regiao.trim()) return { success: false, message: 'Informe a região produtora.' };
    if (cnpj.replace(/\D/g, '').length < 14) return { success: false, message: 'CNPJ incompleto — informe os 14 dígitos.' };
    if (!canais.length) return { success: false, message: 'Escolha ao menos um canal de venda.' };

    const dbUsers = readDb();
    if (dbUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'Já existe uma conta cadastrada com este e-mail.' };
    }

    const novo: DbUser = {
      id: idFor('usr'), email, password: senha ?? '', nome, role: 'vendedor',
      sellerInfo: { produtorId: 'own-' + idFor('p'), regiao, cnpj, capacidadeKg, canais },
    };
    dbUsers.push(novo); writeDb(dbUsers);
    startSession(novo);
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        perfil,
        perfilSensorial,
        assinatura,
        sellerInfo,
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
        papelDoEmail,
        entrarComSenha,
        entrarComLinkMagico,
        cadastrarCliente,
        cadastrarVendedor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
