import {GridColumn} from '../../shared/utils/directives/grid.column.decorator';import {PessoaDTO} from '../pessoa/pessoa.dto';
export class FuncionarioDTO{
 @GridColumn({label:'Código',type:'number',ordem:1,width:'90px'}) id!:number;
 @GridColumn({label:'Pessoa',type:'texto',ordem:2,isObject:true,displayProperty:'nomeRazaoSocial'}) pessoa!:PessoaDTO;
 @GridColumn({label:'Cargo',type:'texto',ordem:3}) cargo?:string;
 @GridColumn({label:'Admissão',type:'date',ordem:4,width:'130px'}) dataAdmissao!:string;
 @GridColumn({label:'Salário',type:'currency',ordem:5,width:'150px'}) salario?:number;
 @GridColumn({label:'Ativo',type:'boolean',ordem:6,width:'90px'}) ativo!:boolean;
 dataDemissao?:string;
}
