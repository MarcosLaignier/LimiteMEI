export enum TipoEmpresaEnum {
  MEI_GERAL = 'MEI_GERAL',
  MEI_CAMINHONEIRO = 'MEI_CAMINHONEIRO'
}

export const TIPO_EMPRESA_LABELS: Record<TipoEmpresaEnum, string> = {
  [TipoEmpresaEnum.MEI_GERAL]: 'MEI Geral',
  [TipoEmpresaEnum.MEI_CAMINHONEIRO]: 'MEI Caminhoneiro'
};

export const LIMITE_ANUAL_POR_TIPO: Record<TipoEmpresaEnum, number> = {
  [TipoEmpresaEnum.MEI_GERAL]: 81000,
  [TipoEmpresaEnum.MEI_CAMINHONEIRO]: 251600
};
