export interface ConfiguracaoAlertaLimiteDTO {
  id?: number;
  percentual: number;
  ativo: boolean;
  obrigatorio: boolean;
}

export interface ConfiguracaoAlertaLimiteUpdateDTO {
  id?: number;
  percentual: number;
  ativo: boolean;
}

export interface ConfiguracaoGeralDTO {
  id?: number;
  contaPadraoBaixaId?: number;
  contaPadraoBaixaNome?: string;
  formaPagamentoPadrao?: string;
}

export interface ConfiguracaoGeralUpdateDTO {
  contaPadraoBaixaId?: number;
  formaPagamentoPadrao?: string;
}
