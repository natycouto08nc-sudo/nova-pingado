const WHATSAPP_NUMERO = '5521974392753';

export interface DadosPedidoWhatsApp {
  nomeUsuario: string;
  codigoPedido: string;
  valorPedido: number;
  metodoPagamento: string;
}

function formatarValor(valor: number) {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

/** Simula a montagem da mensagem no backend a partir dos dados do pedido. */
export function montarMensagemPedido(dados: DadosPedidoWhatsApp): string {
  return [
    'Olá! Realizei uma compra na Pingado e desejo realizar o pagamento. Segue as informações do pedido:',
    '',
    `Nome do usuário: ${dados.nomeUsuario}`,
    `Código do pedido: ${dados.codigoPedido}`,
    `Valor do pedido: ${formatarValor(dados.valorPedido)}`,
    `Método de pagamento: ${dados.metodoPagamento}`,
    '',
    'Obrigado!',
  ].join('\n');
}

/** Simula um endpoint de backend que retorna o link pronto do WhatsApp para o pedido. */
export function montarLinkWhatsApp(dados: DadosPedidoWhatsApp): string {
  const mensagem = montarMensagemPedido(dados);
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}
