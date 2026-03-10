import {TipoMovimentoEnum} from '../../enums/tipo.movimento.enum';

export interface CategoriaDTO {

  id: number;

  nome: string;

  tipo?: TipoMovimentoEnum;

}
