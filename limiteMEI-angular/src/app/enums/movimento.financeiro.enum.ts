export enum TipoFluxoCaixaEnum {
  ENTRADA = 'ENTRADA',
  SAIDA = 'SAIDA',
}
export enum OrigemMovimentoEnum {
  BAIXA = 'BAIXA',
  APORTE = 'APORTE',
  RETIRADA = 'RETIRADA',
  EMPRESTIMO = 'EMPRESTIMO',
  TARIFA = 'TARIFA',
  AJUSTE = 'AJUSTE',
  TRANSFERENCIA = 'TRANSFERENCIA',
  ESTORNO = 'ESTORNO',
}
export const TIPO_FLUXO_LABELS: Record<string, string> = { ENTRADA: 'Entrada', SAIDA: 'Saída' };
export const ORIGEM_MOVIMENTO_LABELS: Record<string, string> = {
  BAIXA: 'Baixa financeira',
  APORTE: 'Aporte',
  RETIRADA: 'Retirada',
  EMPRESTIMO: 'Empréstimo',
  TARIFA: 'Tarifa',
  AJUSTE: 'Ajuste',
  TRANSFERENCIA: 'Transferência',
  ESTORNO: 'Estorno',
};
