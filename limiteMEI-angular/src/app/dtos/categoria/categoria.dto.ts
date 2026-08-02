import {GridColumn} from '../../shared/utils/directives/grid.column.decorator';
import {TipoMovimentoEnum} from '../../enums/tipo.movimento.enum';
import {NATUREZA_RECEITA_LABELS, NaturezaReceitaEnum} from '../../enums/natureza.receita.enum';

export class CategoriaDTO {

  @GridColumn({ label: 'Codigo', type: 'number', ordem: 1, width: "200px"})
  id!: number;

  @GridColumn({ label: 'Nome', type: 'texto', ordem: 2})
  nome!: string;

  @GridColumn({ label: 'Tipo', type: 'enum', ordem: 3, width: "180px"})
  tipo!: TipoMovimentoEnum;

  @GridColumn({ label: 'Natureza da receita', type: 'enum', ordem: 4, width: "210px", enumLabels: NATUREZA_RECEITA_LABELS})
  naturezaReceita?: NaturezaReceitaEnum;

  @GridColumn({ label: 'Ativa', type: 'boolean', ordem: 5, width: "100px"})
  ativo!: boolean;

}
