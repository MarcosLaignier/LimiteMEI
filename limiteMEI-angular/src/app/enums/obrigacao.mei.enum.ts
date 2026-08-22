export enum TipoObrigacaoMeiEnum {
  DAS_MENSAL = 'DAS_MENSAL',
}

export const TIPO_OBRIGACAO_MEI_LABELS: Record<TipoObrigacaoMeiEnum, string> = {
  [TipoObrigacaoMeiEnum.DAS_MENSAL]: 'DAS mensal',
};

export enum SituacaoObrigacaoMeiEnum {
  PENDENTE = 'PENDENTE',
  PAGO = 'PAGO',
  ATRASADO = 'ATRASADO',
}

export const SITUACAO_OBRIGACAO_MEI_LABELS: Record<SituacaoObrigacaoMeiEnum, string> = {
  [SituacaoObrigacaoMeiEnum.PENDENTE]: 'Pendente',
  [SituacaoObrigacaoMeiEnum.PAGO]: 'Pago',
  [SituacaoObrigacaoMeiEnum.ATRASADO]: 'Atrasado',
};
