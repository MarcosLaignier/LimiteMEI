import { GridColumn } from '../../shared/utils/directives/grid.column.decorator';
import {
  TipoContaFinanceiraEnum,
  TIPO_CONTA_FINANCEIRA_LABELS,
} from '../../enums/tipo.conta.financeira.enum';
import { BancoEnum, BANCO_LABELS } from '../../enums/banco.enum';
export interface ContaFinanceiraCreateDTO {
  nome: string;
  tipo?: TipoContaFinanceiraEnum;
  instituicao?: BancoEnum;
  agencia: string;
  numeroConta: string;
  saldoInicial: number;
  ativo: boolean;
}
export class ContaFinanceiraDTO {
  @GridColumn({ label: 'Código', type: 'number', ordem: 1, width: '90px' }) id!: number;
  @GridColumn({ label: 'Nome', type: 'texto', ordem: 2 }) nome!: string;
  @GridColumn({
    label: 'Tipo',
    type: 'enum',
    ordem: 3,
    width: '170px',
    enumLabels: TIPO_CONTA_FINANCEIRA_LABELS,
  })
  tipo!: TipoContaFinanceiraEnum;
  @GridColumn({ label: 'Banco', type: 'enum', ordem: 4, width: '220px', enumLabels: BANCO_LABELS })
  instituicao?: BancoEnum;
  @GridColumn({ label: 'Agência', type: 'texto', ordem: 5, width: '110px' }) agencia?: string;
  @GridColumn({ label: 'Conta', type: 'texto', ordem: 6, width: '140px' }) numeroConta?: string;
  @GridColumn({ label: 'Saldo inicial', type: 'currency', ordem: 7, width: '150px' })
  saldoInicial!: number;
  @GridColumn({ label: 'Ativa', type: 'boolean', ordem: 8, width: '90px' }) ativo!: boolean;
}
