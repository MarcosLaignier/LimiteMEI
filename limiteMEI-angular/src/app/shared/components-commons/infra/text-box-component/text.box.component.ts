import {Component, Input} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {FormFieldBase} from "../../../utils/form.field.base";
import { FieldMask, MaskUtils } from '../../../utils/mask.utils';

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

  @Input() mask: FieldMask | null = null;

  get displayValue(): string {
    return this.mask ? MaskUtils.formatField(this.dataField ?? '', this.mask) : (this.dataField ?? '');
  }

  onValueChange(value: string): void {
    this.dataField = this.mask ? MaskUtils.normalizeField(value, this.mask) : value;
  }

  get inputMaxLength(): number | null { return this.mask ? MaskUtils.maxLength(this.mask) : null; }

}
