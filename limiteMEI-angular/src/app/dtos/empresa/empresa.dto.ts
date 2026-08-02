import { GridColumn } from '../../shared/utils/directives/grid.column.decorator';
import { TipoEmpresaEnum } from '../../enums/tipo.empresa.enum';

export class EmpresaDTO {
  @GridColumn({ label: 'Código', type: 'number', ordem: 1, width: '100px' })
  id!: number;

  @GridColumn({ label: 'CNPJ', type: 'documento', ordem: 2, width: '190px' })
  cnpj!: string;

  @GridColumn({ label: 'Razão Social', type: 'texto', ordem: 3 })
  razaoSocial!: string;

  @GridColumn({ label: 'Nome Fantasia', type: 'texto', ordem: 4 })
  nomeFantasia?: string;

  @GridColumn({ label: 'Abertura', type: 'date', ordem: 5, width: '130px' })
  dataAbertura!: string;

  @GridColumn({ label: 'Tipo', type: 'enum', ordem: 6, width: '180px' })
  tipoEmpresa!: TipoEmpresaEnum;

  @GridColumn({ label: 'Limite anual', type: 'currency', ordem: 7, width: '160px' })
  limiteAnual!: number;

  @GridColumn({ label: 'Ativa', type: 'boolean', ordem: 8, width: '90px' })
  ativo!: boolean;
}
