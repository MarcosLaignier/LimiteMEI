import { Directive } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import {BaseCrud} from './base.crud';


@Directive()
export abstract class BaseFormCrud<D, C, F = any, ID = number> extends BaseCrud<D, C, F, ID> {

  id?: ID;

  constructor(
    router: Router,
    protected route: ActivatedRoute
  ) {
    super(router);
  }

  /** inicializa formulário */

  initForm(): void {

    const idParam = this.route.snapshot.paramMap.get("id");

    if (idParam) {

      this.id = idParam as unknown as ID;

      this.loadById(this.id);

    }

  }

  /** carrega registro */

  loadById(id: ID): void {

    this.service.getById(id).subscribe(res => {

      if (res.body) {

        this.model = res.body as unknown as C;

      }

    });

  }

  /** validação antes de salvar */

  validateSave(): boolean {
    return true;
  }

  /** hook antes do save */

  beforeSave(): Observable<any> | null {
    return null;
  }

  /** hook depois do save */

  afterSave(): void {}

  /** salvar */

  save(): void {

    if (!this.validateSave()) return;

    const before = this.beforeSave();

    if (before) {

      before.subscribe(() => this.executeSave());

    } else {

      this.executeSave();

    }

  }

  private executeSave(): void {

    let request$;

    if (this.id) {

      request$ = this.service.update(this.id, this.model);

    } else {

      request$ = this.service.create(this.model);

    }

    request$.subscribe({

      next: () => {

        this.afterSave();

      },

      error: err => {

        console.error("Erro ao salvar", err);

      }

    });

  }

  /** limpar formulário */

  clear(): void {

    this.model = {} as C;

  }

}
