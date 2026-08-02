import { ChangeDetectorRef, Directive, inject } from "@angular/core";
import { Router } from "@angular/router";
import {BaseCrud} from './base.crud';
import { AlertService } from '../infra/alert-component/alert.service';
import { ConfirmDialogService } from '../infra/confirm-dialog-component/confirm.dialog.service';
import { finalize } from 'rxjs';

@Directive()
export abstract class BaseListCrud<D, C, F = any, ID = number> extends BaseCrud<D, C, F, ID> {
  protected readonly alertService = inject(AlertService);
  protected readonly confirmDialog = inject(ConfirmDialogService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  readonly deletingIds = new Set<ID>();

  /** rota base do CRUD */
  protected abstract override routeBase: string;

  constructor(protected override router: Router) {
    super(router);
  }

  /** carregamento padrão */

  load(): void {
    this.loading = true;
    this.service.getAll().subscribe({
      next: res => {
        this.dataSource = res.body ?? [];
        this.loading = false;
        this.changeDetector.detectChanges();
      },
      error: err => {
        this.loading = false;
        this.changeDetector.detectChanges();
        this.alertService.error(this.errorMessage(err, 'Não foi possível carregar os registros.'));
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

  async delete(id: ID): Promise<void> {
    if (this.deletingIds.has(id)) return;
    const confirmed = await this.confirmDialog.confirm({
      title: 'Excluir registro', message: 'Deseja realmente excluir este registro? Esta ação não poderá ser desfeita.',
      confirmText: 'Excluir', cancelText: 'Cancelar'
    });
    if (!confirmed) return;

    this.deletingIds.add(id);
    this.service.delete(id).pipe(finalize(() => this.deletingIds.delete(id))).subscribe({
      next: () => {
        this.alertService.success('Registro excluído com sucesso.');
        this.load();
      },
      error: err => this.alertService.error(this.errorMessage(err, 'Não foi possível excluir o registro.'))
    });
  }

  protected errorMessage(error: any, fallback: string): string {
    return error?.error?.messages?.join('<br>') || fallback;
  }

}
