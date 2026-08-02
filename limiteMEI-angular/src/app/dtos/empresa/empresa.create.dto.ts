import { TipoEmpresaEnum } from '../../enums/tipo.empresa.enum';

export interface EmpresaCreateDTO {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  dataAbertura: string;
  tipoEmpresa: TipoEmpresaEnum;
}
