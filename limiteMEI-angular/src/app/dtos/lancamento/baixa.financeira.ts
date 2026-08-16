import { FormaPagamentoEnum } from '../../enums/forma.pagamento.enum';
export interface BaixaFinanceiraCreateDTO {
  contaFinanceiraId?: number;
  valor: number;
  dataLiquidacao: string;
  formaPagamento?: FormaPagamentoEnum;
  observacao?: string;
}
export interface BaixaFinanceiraDTO extends BaixaFinanceiraCreateDTO {
  id: number;
  lancamentoId: number;
  valor: number;
  formaPagamento: FormaPagamentoEnum;
  contaFinanceiraId: number;
  contaFinanceiraNome: string;
}
