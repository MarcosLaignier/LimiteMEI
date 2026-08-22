import {GridColumn} from '../../shared/utils/directives/grid.column.decorator';import {TipoPessoaEnum,TIPO_PESSOA_LABELS} from '../../enums/tipo.pessoa.enum';import {PapelPessoaEnum} from '../../enums/papel.pessoa.enum';
export interface RelatorioPessoaFiltroDTO{nome?:string;documento?:string;tipoPessoa?:TipoPessoaEnum;}
export class PessoaDTO{
 @GridColumn({label:'Código',type:'number',ordem:1,width:'90px'}) id!:number;
 @GridColumn({label:'Nome / Razão social',type:'texto',ordem:2}) nomeRazaoSocial!:string;
 @GridColumn({label:'Tipo',type:'enum',ordem:3,width:'150px',enumLabels:TIPO_PESSOA_LABELS}) tipoPessoa!:TipoPessoaEnum;
 @GridColumn({label:'CPF / CNPJ',type:'documento',ordem:4,width:'190px'}) cpfCnpj?:string;
 @GridColumn({label:'E-mail',type:'texto',ordem:5}) email?:string;
 @GridColumn({label:'Ativa',type:'boolean',ordem:6,width:'90px'}) ativo!:boolean;
 nomeFantasia?:string;telefone?:string;papeis:PapelPessoaEnum[]=[];
}
