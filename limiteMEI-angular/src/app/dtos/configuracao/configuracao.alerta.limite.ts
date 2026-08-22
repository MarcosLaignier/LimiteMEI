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
  valorPadraoDas?: number;
}

export interface ConfiguracaoGeralUpdateDTO {
  contaPadraoBaixaId?: number;
  formaPagamentoPadrao?: string;
  valorPadraoDas?: number;
}
