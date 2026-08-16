import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContaFinanceiraDTO } from '../../../dtos/conta/conta.financeira';
import { ContaFinanceiraService } from '../../../services/conta-financeira.service';
@Component({
  selector: 'conta-financeira-selector-component',
  standalone: true,
  imports: [FormsModule],
  template: `<div class="field">
    <label>{{ label }}:</label
    ><select [disabled]="disabled" [ngModel]="dataField" (ngModelChange)="change($event)">
      <option [ngValue]="undefined">Selecione</option>
      @for (item of contas; track item.id) {
        <option [ngValue]="item.id">
          {{ item.nome }}{{ item.instituicao ? ' — ' + item.instituicao : '' }}
        </option>
      }
    </select>
  </div>`,
  styles: [
    `
      .field {
        display: flex;
        flex-direction: column;
        width: 280px;
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
export class ContaFinanceiraSelectorComponent implements OnInit {
  @Input() label = 'Conta financeira';
  @Input() disabled = false;
  @Input() dataField?: number;
  @Output() dataFieldChange = new EventEmitter<number | undefined>();
  contas: ContaFinanceiraDTO[] = [];
  constructor(private service: ContaFinanceiraService) {}
  ngOnInit() {
    this.service.getAll().subscribe((r) => (this.contas = (r.body ?? []).filter((c) => c.ativo)));
  }
  change(id?: number) {
    this.dataField = id;
    this.dataFieldChange.emit(id);
  }
}
