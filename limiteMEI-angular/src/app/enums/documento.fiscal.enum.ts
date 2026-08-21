export enum TipoDocumentoFiscalEnum { NFSE='NFSE', NFE='NFE', NFCE='NFCE', OUTRO='OUTRO' }
export const TIPO_DOCUMENTO_FISCAL_LABELS: Record<string,string> = {NFSE:'NFS-e',NFE:'NF-e',NFCE:'NFC-e',OUTRO:'Outro'};
export enum SituacaoDocumentoFiscalEnum { EMITIDO='EMITIDO', CANCELADO='CANCELADO', SUBSTITUIDO='SUBSTITUIDO' }
export const SITUACAO_DOCUMENTO_FISCAL_LABELS: Record<string,string> = {EMITIDO:'Emitido',CANCELADO:'Cancelado',SUBSTITUIDO:'Substituído'};
