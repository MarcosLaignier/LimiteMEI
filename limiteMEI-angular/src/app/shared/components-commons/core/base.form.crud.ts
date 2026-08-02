import { Directive, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseCrud } from './base.crud';
import { AlertService } from '../infra/alert-component/alert.service';

@Directive()
export abstract class BaseFormCrud<D, C, F = any, ID = number> extends BaseCrud<D, C, F, ID> {
  id?: ID;
  protected readonly alertService = inject(AlertService);

  constructor(router: Router, protected route: ActivatedRoute) {
    super(router);
  }

  initForm(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = idParam as unknown as ID;
      this.loadById(this.id);
    }
  }

  loadById(id: ID): void {
    this.loading = true;
    this.service.getById(id).subscribe({
      next: res => {
        if (res.body) {
          this.model = { ...res.body } as unknown as C;
        }
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.alertService.error(this.errorMessage(err, 'Não foi possível carregar o registro.'));
      }
    });
  }

  validateSave(): boolean {
    return true;
  }

  beforeSave(): Observable<any> | null {
    return null;
  }

  afterSave(saved?: D): void {
    this.router.navigate([this.routeBase]);
  }

  save(): void {
    if (this.loading) return;
    if (!this.validateSave()) return;
    const before = this.beforeSave();
    if (before) {
      before.subscribe(() => this.executeSave());
    } else {
      this.executeSave();
    }
  }

  private executeSave(): void {
    this.loading = true;
    const request$ = this.id
      ? this.service.update(this.id, this.model)
      : this.service.create(this.model);

    request$.subscribe({
      next: response => {
        this.loading = false;
        this.alertService.success(this.id ? 'Registro atualizado com sucesso.' : 'Registro cadastrado com sucesso.');
        this.afterSave(response.body ?? undefined);
      },
      error: err => {
        this.loading = false;
        this.alertService.error(this.errorMessage(err, 'Não foi possível salvar o registro.'));
      }
    });
  }

  clear(): void {
    this.model = {} as C;
  }

  protected errorMessage(error: any, fallback: string): string {
    return error?.error?.messages?.join('<br>') || fallback;
  }
}
