/**
 * Tipos do CRM Pingado (vendedor · cliente · admin).
 * Complementam lib/types.ts sem alterar as entidades da vitrine existente.
 */

export interface SensoryValues {
  acidez: number;
  docura: number;
  corpo: number;
  amargor: number;
  intensidade: number;
}

export interface ReferenceProfile {
  nome: string;
  assinantes: number;
  alvo: SensoryValues;
  cor: string;
}

export type PlanoAssinatura = 'Descoberta' | 'Sommelier' | 'Colecionador';

export interface ClienteAssinante {
  id: string;
  nome: string;
  email: string;
  plano: PlanoAssinatura;
  desde: string;
  perfilNome: string;
  sens: SensoryValues;
  restricoes: string[];
  tags: string[];
  ultimoEnvio: string;
  ciclos: number;
}

export interface VendedorInfo {
  produtorId: string;
  cnpj: string;
  capacidadeTorraKg: number;
  canais: ('Vitrine' | 'Assinatura')[];
  nota: number;
  status: 'Ativo' | 'Teto atingido' | 'Em avaliação';
  verificado: boolean;
  participacaoPct: number;
  selecoesTotal: number;
}

export type StatusPedido = 'Preparando' | 'Em transporte' | 'Entregue' | 'Devolvido';

export interface PedidoVendedor {
  id: string;
  data: string;
  cliente: string;
  itens: string;
  canal: 'Loja' | 'Assinatura';
  valor: string;
  status: StatusPedido;
  produtorId: string;
}

export interface AvaliacaoProduto {
  id: string;
  cafeId: string;
  cliente: string;
  data: string;
  estrelas: number;
  metodo: string;
  perfilCliente: string;
  match: number;
  origem: string;
  texto: string;
}

export interface HistoricoSelecao {
  id: string;
  ciclo: string;
  cafeId: string;
  perfilNome: string;
  plano: PlanoAssinatura;
  pacotes: number;
  decisao: 'IA' | 'Override equipe';
  produtorId: string;
}

export type StatusReserva = 'pendente' | 'aceito' | 'recusado';

export interface ReservaCuradoria {
  id: string;
  cafeId: string;
  produtorId: string;
  plano: string;
  fonte: string;
  qtd: string;
  torraAte: string;
  valor: string;
  perfilNome: string;
  match: number;
  expira: string;
  motivo: string;
  status: StatusReserva;
}

export interface RegraSelecao {
  id: string;
  titulo: string;
  desc: string;
  on: boolean;
  travada?: boolean;
}

export interface PesoCriterio {
  nome: string;
  peso: number;
}

export type PapelUsuario = 'cliente' | 'vendedor' | 'admin';
