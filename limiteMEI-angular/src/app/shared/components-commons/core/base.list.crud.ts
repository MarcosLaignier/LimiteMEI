import { Directive } from "@angular/core";
import { Router } from "@angular/router";
import {BaseCrud} from './base.crud';

@Directive()
export abstract class BaseListCrud<D, C, F = any, ID = number> extends BaseCrud<D, C, F, ID> {

  /** rota base do CRUD */
  protected abstract override routeBase: string;

  constructor(protected override router: Router) {
    super(router);
  }

  /** carregamento padrão */

  load(): void {

    this.service.getAll().subscribe(res => {

      if (res.body) {
        this.dataSource = res.body;
      }

    });

  }

  /** filtro */

  doFilter(): void {
    this.load();
  }

  /** novo */

  novo(): void {
    this.router.navigate([`${this.routeBase}/create`]);
  }

  /** editar */

  editar(id: ID): void {
    this.router.navigate([`${this.routeBase}/editar`, id]);
  }

  /** delete */

  delete(id: ID): void {

    if (!confirm("Deseja realmente excluir?")) return;

    this.service.delete(id).subscribe(() => {
      this.load();
    });

  }

}
