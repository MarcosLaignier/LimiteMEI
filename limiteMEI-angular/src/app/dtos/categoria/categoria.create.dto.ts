import {TipoMovimentoEnum} from '../../enums/tipo.movimento.enum';
import {NaturezaReceitaEnum} from '../../enums/natureza.receita.enum';
import {ExigenciaPessoaEnum} from '../../enums/exigencia.pessoa.enum';
import {PapelPessoaEnum} from '../../enums/papel.pessoa.enum';

export interface CategoriaCreateDTO {

  nome: string;

  tipo?: TipoMovimentoEnum;

  naturezaReceita?: NaturezaReceitaEnum;

  exigenciaPessoa: ExigenciaPessoaEnum;

  papelPessoa?: PapelPessoaEnum;

  compoeFaturamentoMei: boolean;

  exigeDocumentoFiscal: boolean;

  ativo: boolean;

}
