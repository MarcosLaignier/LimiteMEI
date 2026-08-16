import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriaDTO } from '../../../dtos/categoria/categoria.dto';
import { CategoriaService } from '../../../services/categoria.service';
import { TipoMovimentoEnum } from '../../../enums/tipo.movimento.enum';
@Component({
  selector: 'categoria-selector-component',
  standalone: true,
  imports: [FormsModule],
  template: `<div class="field" [style.width]="width">
    <label>{{ label }}</label
    ><select [disabled]="disabled" [ngModel]="dataField" (ngModelChange)="change($event)">
      <option [ngValue]="undefined">Selecione</option>
      @for (item of filtradas; track item.id) {
        <option [ngValue]="item.id">{{ item.nome }}</option>
      }
    </select>
  </div>`,
  styles: [
    `
      .field {
        display: flex;
        flex-direction: column;
        max-width: 100%;
      }
      .field label {
        font-size: 0.875rem;
        font-weight: 600;
        margin-bottom: 0.4rem;
      }
      .field select {
        height: 38px;
        border: 1px solid #ced4da;
        border-radius: 6px;
        padding: 0 0.65rem;
        background: #fff;
      }
    `,
  ],
})
export class CategoriaSelectorComponent implements OnInit, OnChanges {
  @Input() label = 'Categoria';
  @Input() disabled = false;
  @Input() width = '280px';
  @Input() tipo?: TipoMovimentoEnum;
  @Input() dataField?: number;
  @Output() dataFieldChange = new EventEmitter<number | undefined>();
  itens: CategoriaDTO[] = [];
  filtradas: CategoriaDTO[] = [];
  constructor(private service: CategoriaService) {}
  ngOnInit() {
    this.service.getAll().subscribe((r) => {
      this.itens = (r.body ?? []).filter((c) => c.ativo);
      this.filter();
    });
  }
  ngOnChanges() {
    this.filter();
  }
  change(id?: number) {
    this.dataField = id;
    this.dataFieldChange.emit(id);
  }
  private filter() {
    this.filtradas = this.itens.filter((c) => !this.tipo || c.tipo === this.tipo);
    if (this.dataField && !this.filtradas.some((c) => c.id === this.dataField))
      this.change(undefined);
  }
}
