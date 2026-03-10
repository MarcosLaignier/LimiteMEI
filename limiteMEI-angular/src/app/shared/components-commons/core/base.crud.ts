import { Directive } from "@angular/core";
import { Router } from "@angular/router";
import { BaseService } from '../../utils/base.service';

@Directive()
export abstract class BaseCrud<D, C, F = any, ID = number> {

  /** service do CRUD */
  protected abstract service: BaseService<D, C, ID>;

  /** rota base da tela */
  protected abstract routeBase: string;

  /** model do formulário */
  model: C = {} as C;

  /** lista de dados */
  dataSource: D[] = [];

  /** filtro */
  filter: F = {} as F;

  /** modo somente leitura */
  readOnly = false;

  /** loading da tela */
  loading = false;

  constructor(protected router: Router) {}


  /** limpa o model */
  resetModel(): void {
    this.model = {} as C;
  }

}
