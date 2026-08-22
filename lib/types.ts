export interface Perfil {
  id: string;
  nome: string | null;
  email: string | null;
  telefone?: string | null;
  avatar_url: string | null;
  role: 'cliente' | 'vendedor' | 'admin';
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

export interface CafeVariante {
  id: string;
  peso: string;
  preco: number;
  disponivel: boolean;
}

export interface PreparoRecomendado {
  metodo: string;
  cafe: string;
  agua: string;
  temperatura: string;
  moagem: string;
  tempo: string;
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

  /** Slug único usado na rota /loja/[slug]. */
  slug: string;
  /** Formato de venda, usado para agrupar produtos por aba na vitrine. Padrão: 'graos'. */
  formato?: 'graos' | 'moido' | 'drip' | 'capsula';
  /** Galeria de imagens; quando ausente, a PDP usa [imagem_url]. */
  imagens?: string[];
  badge?: string;
  preco_original?: number | null;
  variantes?: CafeVariante[];
  /** Métodos de moagem aceitos; ausente = produto não permite escolher moagem. */
  moagem_opcoes?: string[];
  origem?: string | null;
  fazenda?: string | null;
  variedade?: string | null;
  processo?: string | null;
  torra?: string | null;
  altitude?: string | null;
  safra?: string | null;
  preparos?: PreparoRecomendado[];
  estoque?: number | null;
  relacionados_ids?: string[];
}

export interface CarrinhoItem {
  /** Chave única da linha: cafeId + varianteId + moagem. */
  id: string;
  cafeId: string;
  slug: string;
  nome: string;
  imagem: string | null;
  varianteId?: string;
  varianteLabel?: string;
  moagem?: string;
  precoUnitario: number;
  quantidade: number;
  estoqueMaximo?: number | null;
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
