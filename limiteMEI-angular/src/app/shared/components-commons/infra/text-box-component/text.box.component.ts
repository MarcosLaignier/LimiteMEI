import {Component, Input} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {FormFieldBase} from "../../../utils/form.field.base";

@Component({
  selector: 'text-box-component',
  standalone:true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './text.box.component.html',
  styleUrls: ['./text.box.component.scss'],
})
export class TextBoxComponent extends FormFieldBase<string> {

  @Input() mask: 'cnpj' | null = null;

  get displayValue(): string {
    return this.mask === 'cnpj' ? this.formatCnpj(this.dataField ?? '') : (this.dataField ?? '');
  }

  onValueChange(value: string): void {
    this.dataField = this.mask === 'cnpj' ? this.normalizeCnpj(value) : value;
  }

  private normalizeCnpj(value: string): string {
    const characters = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const base = characters.slice(0, 12);
    const checkDigits = characters.slice(12).replace(/\D/g, '').slice(0, 2);
    return `${base}${checkDigits}`;
  }

  private formatCnpj(value: string): string {
    const normalized = this.normalizeCnpj(value);
    const parts = [
      normalized.slice(0, 2),
      normalized.slice(2, 5),
      normalized.slice(5, 8),
      normalized.slice(8, 12),
      normalized.slice(12, 14)
    ];

    let formatted = parts[0];
    if (parts[1]) formatted += `.${parts[1]}`;
    if (parts[2]) formatted += `.${parts[2]}`;
    if (parts[3]) formatted += `/${parts[3]}`;
    if (parts[4]) formatted += `-${parts[4]}`;
    return formatted;
  }

}
