export interface Cupom {
  codigo: string;
  percentualDesconto: number;
}

const CUPONS_VALIDOS: Record<string, Cupom> = {
  PINGADO15: { codigo: 'PINGADO15', percentualDesconto: 15 },
};

export interface ValidarCupomResultado {
  valido: boolean;
  cupom?: Cupom;
}

/** Validação "server-side": a UI nunca decide sozinha se o cupom existe. */
export function validarCupom(codigoDigitado: string): ValidarCupomResultado {
  const codigo = codigoDigitado.trim().toUpperCase();
  const cupom = CUPONS_VALIDOS[codigo];
  return cupom ? { valido: true, cupom } : { valido: false };
}

/** Simula uma chamada assíncrona a um endpoint de validação de cupom. */
export function validarCupomAsync(codigoDigitado: string): Promise<ValidarCupomResultado> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(validarCupom(codigoDigitado)), 400);
  });
}
