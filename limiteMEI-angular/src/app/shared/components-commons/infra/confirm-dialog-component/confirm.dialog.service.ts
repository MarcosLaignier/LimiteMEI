import {ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, Injectable} from '@angular/core';
import {ConfirmDialogComponent} from "./confirm.dialog.component";
import {ConfirmOptions} from "./confirm.options";

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {

  private dialogRef?: ComponentRef<ConfirmDialogComponent>;

  constructor(private appRef: ApplicationRef,
              private injector: EnvironmentInjector) {

  }

  confirm(title: string, message: string): Promise<boolean>;

  confirm(options: ConfirmOptions): Promise<boolean>;

  confirm(titleOrOptions: string | ConfirmOptions, message?: string): Promise<boolean> {

    const options: ConfirmOptions = typeof titleOrOptions == 'string' ? { title: titleOrOptions, message: message ?? '' } : titleOrOptions;

    return new Promise<boolean>(resolve => {

      this.dialogRef = createComponent(ConfirmDialogComponent, {
        environmentInjector: this.injector
      });

      Object.assign(this.dialogRef.instance, {
        title: options.title ?? 'Confirmação',
        message: options.message,
        confirmText: options.confirmText ?? 'Sim',
        cancelText: options.cancelText ?? 'Não'
      });

      this.dialogRef.instance.confirm.subscribe(() => {
        this.close();
        resolve(true);
      });

      this.dialogRef.instance.cancel.subscribe(() => {
        this.close();
        resolve(false);
      });

      this.appRef.attachView(this.dialogRef.hostView);
      document.body.appendChild(this.dialogRef.location.nativeElement);
    });
  }

  private close() {
    if (!this.dialogRef) return;

    this.appRef.detachView(this.dialogRef.hostView);
    this.dialogRef.destroy();
    this.dialogRef = undefined;
  }
}
