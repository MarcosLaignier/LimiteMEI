export enum NaturezaReceitaEnum {
  COMERCIO = 'COMERCIO',
  INDUSTRIA = 'INDUSTRIA',
  SERVICOS = 'SERVICOS'
}

export const NATUREZA_RECEITA_LABELS: Record<NaturezaReceitaEnum, string> = {
  [NaturezaReceitaEnum.COMERCIO]: 'Comércio',
  [NaturezaReceitaEnum.INDUSTRIA]: 'Indústria',
  [NaturezaReceitaEnum.SERVICOS]: 'Serviços'
};
