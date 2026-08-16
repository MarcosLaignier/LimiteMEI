export enum TipoLancamentoEnum {
  RECEBER = 'RECEBER',
  PAGAR = 'PAGAR',
}
export enum SituacaoLancamentoEnum {
  ABERTO = 'ABERTO',
  PARCIAL = 'PARCIAL',
  LIQUIDADO = 'LIQUIDADO',
  CANCELADO = 'CANCELADO',
}
export const SITUACAO_LANCAMENTO_LABELS: Record<string, string> = {
  ABERTO: 'Em aberto',
  PARCIAL: 'Parcial',
  LIQUIDADO: 'Liquidado',
  CANCELADO: 'Cancelado',
};
