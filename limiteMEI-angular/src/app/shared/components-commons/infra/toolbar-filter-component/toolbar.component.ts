import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Location } from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'toolbar-filter',
  standalone: true,
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  get listMode(): boolean {
    return this._listMode;
  }

  @Input()
  set listMode(value: boolean) {
    this._listMode = value;
  }

  @Input() tituloPagina = '';
  @Input() loading = false;
  @Input() showNew = true;
  private _listMode = true;

  @Output() filtrar = new EventEmitter<void>();
  @Output() novo = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<void>();
  @Output() limpar = new EventEmitter<void>();
  @Output() fechar = new EventEmitter<void>();

  constructor(private location: Location,
              private router: Router) {}

  filtrarClick() { if (!this.loading) this.filtrar.emit(); }

  novoClick() {
    if (!this.loading) this.novo.emit();
  }

  salvarClick() { if (!this.loading) this.salvar.emit(); }

  limparClick() { if (!this.loading) this.limpar.emit(); }

  fecharClick() {
    this.fechar.emit();
    this.location.back();
  }
}
