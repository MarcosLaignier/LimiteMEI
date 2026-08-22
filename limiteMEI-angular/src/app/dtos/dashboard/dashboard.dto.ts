import { MovimentoFinanceiroDTO } from '../movimento/movimento.financeiro';
import { ApuracaoMeiDTO } from '../mei/apuracao-mei.dto';
import { DashboardObrigacaoMeiDTO } from '../mei/obrigacao-mei.dto';

export interface DashboardContaDTO {
  id: number;
  nome: string;
  saldo: number;
}

export interface DashboardDTO {
  empresa: string;
  ano: number;
  mes: number;
  saldoTotal: number;
  entradasMes: number;
  saidasMes: number;
  contasReceber: number;
  contasPagar: number;
  vencidoReceber: number;
  vencidoPagar: number;
  quantidadeVencidos: number;
  contas: DashboardContaDTO[];
  ultimasMovimentacoes: MovimentoFinanceiroDTO[];
  mei: ApuracaoMeiDTO;
  obrigacaoMei: DashboardObrigacaoMeiDTO;
}
