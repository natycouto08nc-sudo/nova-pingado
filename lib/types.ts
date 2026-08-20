export interface Perfil {
  id: string;
  nome: string | null;
  email: string | null;
  telefone?: string | null;
  avatar_url: string | null;
  role: 'user' | 'produtor' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface PerfilSensorial {
  id: string;
  user_id: string;
  acidez: number;
  docura: number;
  corpo: number;
  amargor: number;
  intensidade: number;
  preferencias: string[];
  created_at: string;
  updated_at: string;
}

export interface Produtor {
  id: string;
  nome: string;
  regiao: string;
  estado: string | null;
  descricao: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Cafe {
  id: string;
  produtor_id: string | null;
  nome: string;
  descricao: string | null;
  regiao: string | null;
  score_sca: number | null;
  acidez: number | null;
  docura: number | null;
  corpo: number | null;
  amargor: number | null;
  intensidade: number | null;
  notas_sensoriais: string[] | null;
  imagem_url: string | null;
  ativo: boolean;
  preco: number | null;
  created_at: string;
  produtores?: Produtor;
}

export interface Favorito {
  id: string;
  user_id: string;
  cafe_id: string;
  created_at: string;
  cafes?: Cafe;
}

export interface Assinatura {
  id: string;
  user_id: string;
  plano: 'basico' | 'premium' | 'plus';
  status: 'ativa' | 'pausada' | 'cancelada';
  proxima_entrega: string | null;
  created_at: string;
  updated_at: string;
}

export interface Caixa {
  id: string;
  user_id: string;
  assinatura_id: string | null;
  mes_referencia: string | null;
  status: 'preparando' | 'enviada' | 'entregue';
  justificativa: string | null;
  created_at: string;
  caixa_cafes?: CaixaCafe[];
}

export interface CaixaCafe {
  id: string;
  caixa_id: string;
  cafe_id: string;
  score_compatibilidade: number | null;
  justificativa: string | null;
  cafes?: Cafe;
}

export interface CafeComCompatibilidade extends Cafe {
  compatibilidade?: number;
}
