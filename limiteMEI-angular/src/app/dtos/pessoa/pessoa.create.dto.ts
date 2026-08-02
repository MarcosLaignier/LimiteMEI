import {TipoPessoaEnum} from '../../enums/tipo.pessoa.enum';
export interface PessoaCreateDTO{tipoPessoa:TipoPessoaEnum;nomeRazaoSocial:string;nomeFantasia:string;cpfCnpj:string;email:string;telefone:string;ativo:boolean;}
