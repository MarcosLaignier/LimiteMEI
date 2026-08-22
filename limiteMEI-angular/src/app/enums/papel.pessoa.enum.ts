export enum PapelPessoaEnum { CLIENTE='CLIENTE', FORNECEDOR='FORNECEDOR', FUNCIONARIO='FUNCIONARIO' }

export const PAPEL_PESSOA_LABELS: Record<PapelPessoaEnum, string> = {
  [PapelPessoaEnum.CLIENTE]: 'Cliente',
  [PapelPessoaEnum.FORNECEDOR]: 'Fornecedor',
  [PapelPessoaEnum.FUNCIONARIO]: 'Funcionário',
};
