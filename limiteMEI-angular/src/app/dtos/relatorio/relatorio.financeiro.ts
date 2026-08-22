import { MovimentoFinanceiroDTO } from '../movimento/movimento.financeiro';

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
