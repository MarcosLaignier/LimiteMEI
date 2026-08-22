import { GridColumn } from '../../shared/utils/directives/grid.column.decorator';
import {
  SituacaoObrigacaoMeiEnum,
  SITUACAO_OBRIGACAO_MEI_LABELS,
  TipoObrigacaoMeiEnum,
  TIPO_OBRIGACAO_MEI_LABELS,
} from '../../enums/obrigacao.mei.enum';

export interface ObrigacaoMeiCreateDTO {
  tipo?: TipoObrigacaoMeiEnum;
  competencia: string;
  situacao?: SituacaoObrigacaoMeiEnum;
  valor: number;
  dataPagamento?: string;
  observacao: string;
}

export class ObrigacaoMeiDTO {
  @GridColumn({ label: 'Código', type: 'number', ordem: 1, width: '90px' }) id!: number;
  @GridColumn({ label: 'Tipo', type: 'enum', ordem: 2, width: '140px', enumLabels: TIPO_OBRIGACAO_MEI_LABELS })
  tipo!: TipoObrigacaoMeiEnum;
  @GridColumn({ label: 'Competência', type: 'date', ordem: 3, width: '130px' }) competencia!: string;
  @GridColumn({ label: 'Vencimento', type: 'date', ordem: 4, width: '130px' }) vencimento!: string;
  @GridColumn({ label: 'Situação', type: 'enum', ordem: 5, width: '120px', enumLabels: SITUACAO_OBRIGACAO_MEI_LABELS })
  situacao!: SituacaoObrigacaoMeiEnum;
  @GridColumn({ label: 'Valor', type: 'currency', ordem: 6, width: '130px' }) valor!: number;
  @GridColumn({ label: 'Pagamento', type: 'date', ordem: 7, width: '130px' }) dataPagamento?: string;
  @GridColumn({ label: 'Comprovante', type: 'boolean', ordem: 8, width: '120px' }) possuiComprovante!: boolean;
  observacao?: string;
  comprovanteNome?: string;
}

export interface DashboardObrigacaoMeiDTO {
  id?: number;
  competencia?: string;
  vencimento?: string;
  situacao?: SituacaoObrigacaoMeiEnum;
  valor: number;
  quantidadePendentes: number;
  quantidadeAtrasadas: number;
  quantidadePagas: number;
  quantidadeEmAberto: number;
}
