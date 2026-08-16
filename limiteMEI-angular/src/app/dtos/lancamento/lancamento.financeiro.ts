import { GridColumn } from '../../shared/utils/directives/grid.column.decorator';
import {
  SituacaoLancamentoEnum,
  SITUACAO_LANCAMENTO_LABELS,
  TipoLancamentoEnum,
} from '../../enums/tipo.lancamento.enum';
import { FormaPagamentoEnum } from '../../enums/forma.pagamento.enum';

export interface LancamentoFinanceiroCreateDTO {
  descricao: string;
  tipo?: TipoLancamentoEnum;
  categoriaId?: number;
  pessoaId?: number;
  valor: number;
  dataCompetencia: string;
  dataVencimento: string;
  ativo: boolean;
  observacao: string;
  baixarAutomaticamente: boolean;
  dataLiquidacao?: string;
  formaPagamento?: FormaPagamentoEnum;
  contaFinanceiraId?: number;
  situacao?: SituacaoLancamentoEnum;
  dataCancelamento?: string;
  motivoCancelamento?: string;
  usuarioCancelamento?: string;
}
export class LancamentoFinanceiroDTO {
  @GridColumn({ label: 'Código', type: 'number', ordem: 1, width: '90px' }) id!: number;
  @GridColumn({ label: 'Descrição', type: 'texto', ordem: 2 }) descricao!: string;
  @GridColumn({ label: 'Tipo', type: 'enum', ordem: 3, width: '110px' }) tipo!: TipoLancamentoEnum;
  @GridColumn({ label: 'Categoria', type: 'texto', ordem: 4, width: '180px' })
  categoriaNome!: string;
  @GridColumn({ label: 'Pessoa', type: 'texto', ordem: 5, width: '200px' }) pessoaNome?: string;
  @GridColumn({ label: 'Valor', type: 'currency', ordem: 6, width: '130px' }) valor!: number;
  @GridColumn({ label: 'Saldo', type: 'currency', ordem: 7, width: '130px' }) saldoAberto!: number;
  @GridColumn({ label: 'Vencimento', type: 'date', ordem: 8, width: '130px' })
  dataVencimento!: string;
  @GridColumn({
    label: 'Situação',
    type: 'enum',
    ordem: 9,
    width: '130px',
    enumLabels: SITUACAO_LANCAMENTO_LABELS,
  })
  situacao!: SituacaoLancamentoEnum;
  categoriaId!: number;
  pessoaId?: number;
  valorLiquidado!: number;
  dataCompetencia!: string;
  ativo!: boolean;
  observacao?: string;
  dataCancelamento?: string;
  motivoCancelamento?: string;
  usuarioCancelamento?: string;
}

export type EventoFinanceiro =
  | 'CRIACAO_LANCAMENTO'
  | 'ALTERACAO_LANCAMENTO'
  | 'CANCELAMENTO_LANCAMENTO'
  | 'EXCLUSAO_LANCAMENTO'
  | 'BAIXA_REALIZADA'
  | 'BAIXA_ESTORNADA';

export interface HistoricoFinanceiroDTO {
  id: number;
  lancamentoId: number;
  baixaId?: number;
  evento: EventoFinanceiro;
  dataHora: string;
  usuario: string;
  descricao: string;
}
