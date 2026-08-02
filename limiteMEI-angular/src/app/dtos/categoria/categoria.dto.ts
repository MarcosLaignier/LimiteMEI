import {GridColumn} from '../../shared/utils/directives/grid.column.decorator';
import {TipoMovimentoEnum} from '../../enums/tipo.movimento.enum';

export class CategoriaDTO {

  @GridColumn({ label: 'Codigo', type: 'number', ordem: 1, width: "200px"})
  id!: number;

  @GridColumn({ label: 'Nome', type: 'texto', ordem: 2})
  nome!: string;

  @GridColumn({ label: 'Tipo', type: 'enum', ordem: 3, width: "180px"})
  tipo!: TipoMovimentoEnum;

}
