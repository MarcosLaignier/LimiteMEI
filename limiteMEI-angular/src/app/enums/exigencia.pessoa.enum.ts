export enum ExigenciaPessoaEnum {
  NAO_UTILIZA = 'NAO_UTILIZA',
  OPCIONAL = 'OPCIONAL',
  OBRIGATORIA = 'OBRIGATORIA'
}

export const EXIGENCIA_PESSOA_LABELS: Record<string, string> = {
  NAO_UTILIZA: 'Não utiliza pessoa',
  OPCIONAL: 'Pessoa opcional',
  OBRIGATORIA: 'Pessoa obrigatória'
};
