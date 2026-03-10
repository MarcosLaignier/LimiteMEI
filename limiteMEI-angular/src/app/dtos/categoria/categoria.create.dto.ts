import {TipoMovimentoEnum} from '../../enums/tipo.movimento.enum';

export interface CategoriaCreateDTO {

  nome: string;

  tipo?: TipoMovimentoEnum;

}
