import {Component, Input} from "@angular/core";
import {FormFieldBase} from "../../../utils/form.field.base";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'date-box-component',
  standalone:true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './date.box.component.html',
  styleUrls: ['./date.box.component.scss']
})
export class DateBoxComponent extends FormFieldBase<string> {

  @Input() clearButton = false;

  clearDate(): void {
    this.dataField = '';
  }
}
