import { FormaPagamentoEnum } from '../../enums/forma.pagamento.enum';
import { OrigemMovimentoEnum, TipoFluxoCaixaEnum } from '../../enums/movimento.financeiro.enum';
export interface MovimentoFinanceiroCreateDTO {
  descricao: string;
  valor: number;
  data: string;
  origem?: OrigemMovimentoEnum;
  tipo?: TipoFluxoCaixaEnum;
  contaFinanceiraId?: number;
  categoriaId?: number;
  formaPagamento?: FormaPagamentoEnum;
  observacao: string;
}
export interface MovimentoFinanceiroDTO extends MovimentoFinanceiroCreateDTO {
  id: number;
  origem: OrigemMovimentoEnum;
  tipo: TipoFluxoCaixaEnum;
  contaFinanceiraId: number;
  contaFinanceiraNome: string;
  categoriaNome?: string;
  baixaFinanceiraId?: number;
  transferenciaId?: string;
  editavel: boolean;
  estornado: boolean;
  movimentoOrigemId?: number;
}
export interface TransferenciaFinanceiraDTO {
  contaOrigemId?: number;
  contaDestinoId?: number;
  valor: number;
  data: string;
  descricao: string;
  observacao: string;
}
