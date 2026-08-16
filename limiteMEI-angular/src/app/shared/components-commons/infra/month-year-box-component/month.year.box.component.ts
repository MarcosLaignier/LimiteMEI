import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'month-year-box-component',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './month.year.box.component.html',
  styleUrl: './month.year.box.component.scss',
})
export class MonthYearBoxComponent {
  @Input() label = 'Competência';
  @Input() disabled = false;
  @Input() clearButton = true;
  @Input() width = '210px';
  @Output() dataFieldChange = new EventEmitter<string>();
  private value = '';
  @Input() get dataField() {
    return this.value;
  }
  set dataField(value: string) {
    this.value = value?.slice(0, 7) ?? '';
  }
  change(value: string) {
    this.value = value;
    this.dataFieldChange.emit(value ? `${value}-01` : '');
  }
  clear() {
    this.change('');
  }
}
