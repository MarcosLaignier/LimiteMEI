import { MovimentoFinanceiroDTO } from '../movimento/movimento.financeiro';
import { FormaPagamentoEnum } from '../../enums/forma.pagamento.enum';
import { OrigemMovimentoEnum, TipoFluxoCaixaEnum } from '../../enums/movimento.financeiro.enum';

export interface RelatorioFluxoCaixaDTO {
  empresa: string;
  cnpj: string;
  inicio: string;
  fim: string;
  contaFinanceiraId?: number;
  contaFinanceiraNome: string;
  totalEntradas: number;
  totalSaidas: number;
  saldoPeriodo: number;
  movimentos: MovimentoFinanceiroDTO[];
}

export interface RelatorioFluxoCaixaFiltroDTO {
  inicio?: string;
  fim?: string;
  contaFinanceiraId?: number;
  tipo?: TipoFluxoCaixaEnum;
  origem?: OrigemMovimentoEnum;
  formaPagamento?: FormaPagamentoEnum;
  categoriaId?: number;
}
