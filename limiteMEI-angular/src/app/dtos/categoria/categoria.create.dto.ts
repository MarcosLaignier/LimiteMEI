import {TipoMovimentoEnum} from '../../enums/tipo.movimento.enum';
import {NaturezaReceitaEnum} from '../../enums/natureza.receita.enum';

export interface CategoriaCreateDTO {

  nome: string;

  tipo?: TipoMovimentoEnum;

  naturezaReceita?: NaturezaReceitaEnum;

  ativo: boolean;

}
