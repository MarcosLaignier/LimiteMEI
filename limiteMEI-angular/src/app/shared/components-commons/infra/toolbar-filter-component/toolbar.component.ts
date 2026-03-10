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
    console.log(value)
    this._listMode = value;
  }

  @Input() tituloPagina = '';
  private _listMode = true;

  @Output() filtrar = new EventEmitter<void>();
  @Output() novo = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<void>();
  @Output() limpar = new EventEmitter<void>();
  @Output() fechar = new EventEmitter<void>();

  constructor(private location: Location,
              private router: Router) {}

  filtrarClick() { this.filtrar.emit(); }

  novoClick() {
    const currentUrl = this.router.url;
    const newUrl = `${currentUrl}/create`;

    this.router.navigateByUrl(newUrl);
    this.novo.emit();
  }

  salvarClick() { this.salvar.emit(); }

  limparClick() { this.limpar.emit(); }

  fecharClick() {
    this.fechar.emit();
    this.location.back();
  }
}
