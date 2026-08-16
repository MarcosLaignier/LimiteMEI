import { FormaPagamentoEnum } from '../../enums/forma.pagamento.enum';
export interface BaixaFinanceiraCreateDTO {
  contaFinanceiraId?: number;
  valorPrincipal: number;
  juros: number;
  multa: number;
  desconto: number;
  dataLiquidacao: string;
  formaPagamento?: FormaPagamentoEnum;
  observacao?: string;
}
export interface BaixaFinanceiraDTO extends BaixaFinanceiraCreateDTO {
  id: number;
  lancamentoId: number;
  valorPrincipal: number;
  valorPago: number;
  formaPagamento: FormaPagamentoEnum;
  contaFinanceiraId: number;
  contaFinanceiraNome: string;
  ativo: boolean;
  dataEstorno?: string;
  motivoEstorno?: string;
  usuarioEstorno?: string;
}
