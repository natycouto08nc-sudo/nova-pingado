import { MOCK_CAFES } from '@/lib/coffees';
import type { Cafe } from '@/lib/types';
import type {
  AvaliacaoProduto,
  ClienteAssinante,
  HistoricoSelecao,
  PedidoVendedor,
  PesoCriterio,
  RegraSelecao,
  ReservaCuradoria,
  VendedorInfo,
} from './types';

/** Só os cafés ligados a um produtor têm dados suficientes para curadoria (perfil sensorial, SCA etc). */
export function catalogoComProdutor(): Cafe[] {
  return MOCK_CAFES.filter((c) => c.produtor_id != null);
}

export function catalogoDoProdutor(produtorId: string): Cafe[] {
  return MOCK_CAFES.filter((c) => c.produtor_id === produtorId);
}

export function getCafeById(id: string): Cafe | undefined {
  return MOCK_CAFES.find((c) => c.id === id);
}

/** Dados de vendedor (CNPJ, capacidade, canais, rotatividade) por produtor — estende Produtor sem tocar em lib/types.ts. */
export const VENDEDOR_INFO: Record<string, VendedorInfo> = {
  'prod-1': { produtorId: 'prod-1', cnpj: '12.345.678/0001-90', capacidadeTorraKg: 420, canais: ['Vitrine', 'Assinatura'], nota: 4.8, status: 'Ativo', verificado: true, participacaoPct: 14, selecoesTotal: 55 },
  'prod-2': { produtorId: 'prod-2', cnpj: '23.456.789/0001-01', capacidadeTorraKg: 260, canais: ['Vitrine', 'Assinatura'], nota: 4.7, status: 'Ativo', verificado: true, participacaoPct: 19, selecoesTotal: 36 },
  'prod-3': { produtorId: 'prod-3', cnpj: '34.567.890/0001-12', capacidadeTorraKg: 180, canais: ['Vitrine'], nota: 4.6, status: 'Ativo', verificado: true, participacaoPct: 11, selecoesTotal: 22 },
  'prod-4': { produtorId: 'prod-4', cnpj: '45.678.901/0001-23', capacidadeTorraKg: 300, canais: ['Vitrine', 'Assinatura'], nota: 4.4, status: 'Teto atingido', verificado: true, participacaoPct: 23, selecoesTotal: 41 },
  'prod-5': { produtorId: 'prod-5', cnpj: '56.789.012/0001-34', capacidadeTorraKg: 150, canais: ['Vitrine'], nota: 4.9, status: 'Em avaliação', verificado: false, participacaoPct: 6, selecoesTotal: 8 },
};

/** Notas de sabor (máx. 4) e métodos de preparo recomendados no perfil sensorial de cada café. */
export const CAFE_METODOS: Record<string, string[]> = {
  'cafe-1': ['Em grãos', 'Espresso', 'Moka', 'Prensa Francesa'],
  'cafe-2': ['Em grãos', 'V60', 'Chemex', 'Aeropress'],
  'cafe-3': ['Em grãos', 'Chemex', 'V60'],
  'cafe-4': ['V60', 'Chemex', 'Aeropress'],
  'cafe-5': ['Em grãos', 'Prensa Francesa', 'Espresso'],
  'cafe-6': ['Espresso', 'Moka'],
  'cafe-7': ['V60', 'Aeropress'],
  'cafe-8': ['Moka', 'Espresso'],
};

export const CAFE_CERTIFICACOES: Record<string, string[]> = {
  'cafe-1': ['Carbono Neutro'],
  'cafe-2': ['Denominação de Origem', 'Mulheres do Café'],
  'cafe-3': ['Rainforest Alliance'],
  'cafe-4': ['Orgânico', 'Denominação de Origem'],
  'cafe-5': ['Carbono Neutro'],
  'cafe-6': [],
  'cafe-7': ['Fair Trade'],
  'cafe-8': ['Rainforest Alliance', 'Carbono Neutro'],
};

export const CAFE_SELECOES: Record<string, number> = {
  'cafe-1': 21, 'cafe-2': 14, 'cafe-3': 9, 'cafe-4': 6,
  'cafe-5': 11, 'cafe-6': 8, 'cafe-7': 12, 'cafe-8': 15,
};

export function getMetodosPreparo(cafe: Cafe): string[] {
  // Cafés do seed (cafe-1..cafe-8) têm a curadoria explícita acima; produtos cadastrados pelo
  // próprio vendedor no protótipo caem no fallback dos métodos escolhidos no formulário.
  return CAFE_METODOS[cafe.id] ?? cafe.moagem_opcoes ?? [];
}
export function getCertificacoes(cafe: Cafe): string[] {
  return CAFE_CERTIFICACOES[cafe.id] ?? [];
}
export function getSelecoesCaixa(cafe: Cafe): number {
  return CAFE_SELECOES[cafe.id] ?? 0;
}

export const CLIENTES_ASSINANTES: ClienteAssinante[] = [
  { id: 'cli-1', nome: 'Marina Prado', email: 'marina.prado@email.com', plano: 'Sommelier', desde: 'mar/2026', perfilNome: 'Doce & Frutado', sens: { acidez: 4, docura: 5, corpo: 3, amargor: 1, intensidade: 3 }, restricoes: ['Sem torra escura'], tags: ['V60'], ultimoEnvio: 'Catuaí Honey · ago/2026', ciclos: 6 },
  { id: 'cli-2', nome: 'Rafael Nunes', email: 'rafael.nunes@email.com', plano: 'Colecionador', desde: 'jan/2026', perfilNome: 'Ácido & Floral', sens: { acidez: 5, docura: 4, corpo: 2, amargor: 1, intensidade: 2 }, restricoes: [], tags: ['Chemex', 'microlotes'], ultimoEnvio: 'Microlote Geisha · ago/2026', ciclos: 8 },
  { id: 'cli-3', nome: 'Bruno Teixeira', email: 'bruno.teixeira@email.com', plano: 'Descoberta', desde: 'mai/2026', perfilNome: 'O Tradicional Intenso', sens: { acidez: 2, docura: 3, corpo: 5, amargor: 4, intensidade: 5 }, restricoes: ['Somente moído'], tags: ['Espresso'], ultimoEnvio: 'Mundo Novo Natural · ago/2026', ciclos: 4 },
  { id: 'cli-4', nome: 'Juliana Alves', email: 'juliana.alves@email.com', plano: 'Sommelier', desde: 'fev/2026', perfilNome: 'Clássico Equilibrado', sens: { acidez: 3, docura: 3, corpo: 3, amargor: 3, intensidade: 3 }, restricoes: ['Sem fermentados'], tags: ['Prensa Francesa'], ultimoEnvio: 'Sweet Collection · ago/2026', ciclos: 7 },
  { id: 'cli-5', nome: 'Camila Rocha', email: 'camila.rocha@email.com', plano: 'Descoberta', desde: 'jun/2026', perfilNome: 'Doce & Frutado', sens: { acidez: 4, docura: 5, corpo: 2, amargor: 1, intensidade: 2 }, restricoes: ['Sem cafeína após 16h'], tags: ['Aeropress'], ultimoEnvio: 'Typica Fermentado · ago/2026', ciclos: 3 },
];

export const PEDIDOS_VENDEDOR: PedidoVendedor[] = [
  { id: '#PG-9482', data: '20/08', cliente: 'Marina Prado', itens: '1x Catuaí Honey 250g', canal: 'Loja', valor: 'R$ 91,00', status: 'Em transporte', produtorId: 'prod-2' },
  { id: '#CX-2210', data: '20/08', cliente: 'Caixa Sommelier · 34 assinantes', itens: '34x Catuaí Honey 250g', canal: 'Assinatura', valor: 'R$ 2.312,00', status: 'Preparando', produtorId: 'prod-2' },
  { id: '#PG-9479', data: '19/08', cliente: 'Rafael Nunes', itens: '1x Microlote Geisha 250g', canal: 'Loja', valor: 'R$ 157,00', status: 'Entregue', produtorId: 'prod-4' },
  { id: '#PG-9471', data: '18/08', cliente: 'Juliana Alves', itens: '2x Sweet Collection 250g', canal: 'Loja', valor: 'R$ 156,00', status: 'Entregue', produtorId: 'prod-5' },
  { id: '#CX-2204', data: '15/08', cliente: 'Caixa Colecionador · 12 assinantes', itens: '12x Microlote Geisha 250g', canal: 'Assinatura', valor: 'R$ 1.740,00', status: 'Entregue', produtorId: 'prod-4' },
  { id: '#PG-9455', data: '13/08', cliente: 'Rafael Nunes', itens: '1x Yellow Bourbon Natural 1kg', canal: 'Loja', valor: 'R$ 352,80', status: 'Entregue', produtorId: 'prod-1' },
  { id: '#PG-9450', data: '12/08', cliente: 'Camila Rocha', itens: '1x Typica Fermentado 500g', canal: 'Loja', valor: 'R$ 209,00', status: 'Devolvido', produtorId: 'prod-2' },
  { id: '#PG-9441', data: '10/08', cliente: 'Bruno Teixeira', itens: '1x Mundo Novo Natural 500g', canal: 'Loja', valor: 'R$ 144,40', status: 'Entregue', produtorId: 'prod-1' },
  { id: '#CX-2198', data: '08/08', cliente: 'Caixa Descoberta · 20 assinantes', itens: '20x Bourbon Amarelo Cereja Natural 250g', canal: 'Assinatura', valor: 'R$ 1.700,00', status: 'Entregue', produtorId: 'prod-3' },
];

export const AVALIACOES_PRODUTO: AvaliacaoProduto[] = [
  { id: 'av-1', cafeId: 'cafe-2', cliente: 'Marina Prado', data: '19/08/2026', estrelas: 5, metodo: 'V60', perfilCliente: 'Doce & Frutado', match: 96, origem: 'caixa de agosto', texto: 'A doçura é impressionante sem ser adocicada. Chegou torrado há 4 dias e rendeu duas semanas de coado perfeito.' },
  { id: 'av-2', cafeId: 'cafe-4', cliente: 'Rafael Nunes', data: '17/08/2026', estrelas: 5, metodo: 'Chemex', perfilCliente: 'Ácido & Floral', match: 93, origem: 'compra na loja', texto: 'Jasmim no aroma e pêssego na boca. Vale cada centavo do microlote — quero saber quando sai o próximo talhão.' },
  { id: 'av-3', cafeId: 'cafe-1', cliente: 'Bruno Teixeira', data: '14/08/2026', estrelas: 4, metodo: 'Espresso', perfilCliente: 'O Tradicional Intenso', match: 88, origem: 'caixa de agosto', texto: 'Corpo excelente para espresso. Só senti falta de um pouco mais de doçura no final.' },
  { id: 'av-4', cafeId: 'cafe-5', cliente: 'Juliana Alves', data: '11/08/2026', estrelas: 5, metodo: 'Prensa Francesa', perfilCliente: 'Clássico Equilibrado', match: 91, origem: 'compra na loja', texto: 'Moagem no ponto certo para prensa e nada amargo. Já virou o café de todo dia aqui em casa.' },
  { id: 'av-5', cafeId: 'cafe-6', cliente: 'Camila Rocha', data: '08/08/2026', estrelas: 3, metodo: 'Aeropress', perfilCliente: 'Doce & Frutado', match: 61, origem: 'caixa de julho', texto: 'Café honesto, mas mais intenso do que eu esperava pelo meu perfil. Acho que não combinou comigo.' },
];

export const HISTORICO_SELECOES: HistoricoSelecao[] = [
  { id: 'h1', ciclo: 'ago/26', cafeId: 'cafe-2', perfilNome: 'Doce & Frutado', plano: 'Sommelier', pacotes: 168, decisao: 'IA', produtorId: 'prod-2' },
  { id: 'h2', ciclo: 'ago/26', cafeId: 'cafe-1', perfilNome: 'O Tradicional Intenso', plano: 'Descoberta', pacotes: 74, decisao: 'IA', produtorId: 'prod-1' },
  { id: 'h3', ciclo: 'jul/26', cafeId: 'cafe-2', perfilNome: 'Doce & Frutado', plano: 'Sommelier', pacotes: 152, decisao: 'IA', produtorId: 'prod-2' },
  { id: 'h4', ciclo: 'jul/26', cafeId: 'cafe-4', perfilNome: 'Ácido & Floral', plano: 'Colecionador', pacotes: 38, decisao: 'Override equipe', produtorId: 'prod-4' },
  { id: 'h5', ciclo: 'jun/26', cafeId: 'cafe-5', perfilNome: 'Clássico Equilibrado', plano: 'Descoberta', pacotes: 96, decisao: 'IA', produtorId: 'prod-5' },
  { id: 'h6', ciclo: 'jun/26', cafeId: 'cafe-1', perfilNome: 'O Tradicional Intenso', plano: 'Sommelier', pacotes: 61, decisao: 'Override equipe', produtorId: 'prod-1' },
];

export const RESERVAS_CURADORIA_SEED: ReservaCuradoria[] = [
  { id: 'res-1', cafeId: 'cafe-2', produtorId: 'prod-2', plano: 'Plano Sommelier', fonte: 'seleção por IA', qtd: '180 pacotes', torraAte: '28/08', valor: 'R$ 14.220,00', perfilNome: 'Doce & Frutado', match: 91, expira: '2 dias', motivo: 'Selecionado para 180 assinantes que marcaram doçura alta e notas de frutas vermelhas no onboarding. Maior compatibilidade do ciclo.', status: 'pendente' },
  { id: 'res-2', cafeId: 'cafe-7', produtorId: 'prod-2', plano: 'Plano Colecionador', fonte: 'override da equipe', qtd: '40 pacotes', torraAte: '29/08', valor: 'R$ 4.400,00', perfilNome: 'Ácido & Floral', match: 84, expira: '3 dias', motivo: 'Caixa de lotes fermentados raros. A equipe priorizou este Typica pela fermentação de 48h e pela acidez alta pedida por esses assinantes.', status: 'pendente' },
  { id: 'res-3', cafeId: 'cafe-2', produtorId: 'prod-2', plano: 'Plano Descoberta', fonte: 'seleção por IA', qtd: '60 pacotes', torraAte: '24/08', valor: 'R$ 4.740,00', perfilNome: 'Clássico Equilibrado', match: 78, expira: '—', motivo: 'Reserva confirmada anteriormente. Coleta agendada com o envio ENV-4812.', status: 'aceito' },
];

export const REGRAS_SELECAO_DEFAULT: RegraSelecao[] = [
  { id: 'g1', titulo: 'Respeitar restrições do cliente', desc: 'Restrições declaradas no onboarding (torra escura, fermentados, somente moído) são bloqueios rígidos — a IA nunca as ignora.', on: true, travada: true },
  { id: 'g2', titulo: 'Garantir variedade na caixa', desc: 'Nenhum café repete para o mesmo assinante dentro do intervalo mínimo definido abaixo.', on: true },
  { id: 'g3', titulo: 'Rotatividade entre vendedores', desc: 'Distribui as caixas entre os parceiros respeitando o teto de participação por ciclo.', on: true },
  { id: 'g4', titulo: 'Priorizar cadastros completos', desc: 'Cafés com perfil sensorial e certificações preenchidos ganham prioridade no desempate.', on: true },
  { id: 'g5', titulo: 'Impulsionar novos parceiros', desc: 'Reserva 10% das caixas do ciclo para vendedores com menos de 3 seleções no histórico.', on: false },
];

export const PESOS_CRITERIOS: PesoCriterio[] = [
  { nome: 'Compatibilidade sensorial', peso: 45 },
  { nome: 'Variedade vs. histórico do cliente', peso: 20 },
  { nome: 'Rotatividade entre vendedores', peso: 15 },
  { nome: 'Estoque e prazo de torra', peso: 12 },
  { nome: 'Avaliação do café', peso: 8 },
];

export const LOG_DECISOES_INICIAL: string[] = ['08:12 · IA montou 1.443 caixas para setembro'];

/** Conta de demonstração: mapeia o e-mail do login para uma entidade já rica em dados (vendedor/cliente). */
export const DEMO_VENDEDOR_EMAIL = 'contato@sitiobomjesus.com.br';
export const DEMO_VENDEDOR_PRODUTOR_ID = 'prod-2';
export const DEMO_CLIENTE_EMAIL = 'marina.prado@email.com';
export const DEMO_ADMIN_EMAIL = 'curadoria@pingado.com.br';
