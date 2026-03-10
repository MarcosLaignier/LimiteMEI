import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Location} from '@angular/common';
import {Router, RouterModule} from "@angular/router";

@Component({
  selector: 'toolbar-filter-component',
  standalone: true,
  imports: [
    RouterModule
],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']

})
export class ToolbarComponent {

  @Input() tituloPagina: string = '';
  @Input() listMode: boolean = true;

  @Output() filtrar = new EventEmitter<void>();
  @Output() novo = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<void>();
  @Output() limpar = new EventEmitter<void>();
  @Output() fechar = new EventEmitter<void>();

  constructor(private location: Location,
              private router: Router) {}

  filtrarClick(event: Event) {
    event.preventDefault();
    this.filtrar.emit();
  }

  novoClick(event: Event) {
    event.preventDefault();
    const currentUrl = this.router.url;
    const newUrl = `${currentUrl}/create`;

    this.router.navigateByUrl(newUrl);
    this.novo.emit();
  }

  salvarClick(event: Event) {
    event.preventDefault();
    this.salvar.emit();
  }
  limparClick(event: Event) {
    event.preventDefault();
    this.limpar.emit();
  }

  fecharClick(event: Event) {
    event.preventDefault();
    this.fechar.emit();
    this.location.back();
  }
}
