import { GridColumn } from '../../shared/utils/directives/grid.column.decorator';
import { SituacaoDocumentoFiscalEnum, SITUACAO_DOCUMENTO_FISCAL_LABELS, TipoDocumentoFiscalEnum, TIPO_DOCUMENTO_FISCAL_LABELS } from '../../enums/documento.fiscal.enum';

export interface DocumentoFiscalVinculoDTO { lancamentoId:number; descricao:string; competencia:string; valorLancamento:number; valorVinculado:number; }
export interface DocumentoFiscalVinculoCreateDTO { lancamentoId:number; valorVinculado:number; }
export interface DocumentoFiscalCreateDTO { tipo:TipoDocumentoFiscalEnum; numero:string; serie:string; chaveAcesso:string; dataEmissao:string; valorTotal:number; situacao:SituacaoDocumentoFiscalEnum; clienteId?:number; observacao:string; vinculos:DocumentoFiscalVinculoCreateDTO[]; }
export interface DocumentoFiscalXmlPreviewDTO { tipo:TipoDocumentoFiscalEnum; numero:string; serie?:string; chaveAcesso?:string; dataEmissao:string; valorTotal:number; clienteId?:number; clienteNome?:string; clienteDocumento?:string; clienteEncontrado:boolean; }
export class DocumentoFiscalDTO {
  @GridColumn({label:'Código',type:'number',ordem:1,width:'90px'}) id!:number;
  @GridColumn({label:'Tipo',type:'enum',ordem:2,width:'110px',enumLabels:TIPO_DOCUMENTO_FISCAL_LABELS}) tipo!:TipoDocumentoFiscalEnum;
  @GridColumn({label:'Número',type:'texto',ordem:3}) numero!:string;
  serie!:string;
  @GridColumn({label:'Emissão',type:'date',ordem:4,width:'130px'}) dataEmissao!:string;
  @GridColumn({label:'Cliente',type:'texto',ordem:5}) clienteNome?:string;
  @GridColumn({label:'Valor',type:'currency',ordem:6,width:'150px'}) valorTotal!:number;
  valorVinculado!:number;
  saldoVincular!:number;
  @GridColumn({label:'Situação',type:'enum',ordem:7,width:'130px',enumLabels:SITUACAO_DOCUMENTO_FISCAL_LABELS}) situacao!:SituacaoDocumentoFiscalEnum;
  chaveAcesso?:string; clienteId?:number; observacao?:string; vinculos!:DocumentoFiscalVinculoDTO[];
}
