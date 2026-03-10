import {Component} from "@angular/core";
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
  styles: [':host { display: contents; }']
})
export class DateBoxComponent extends FormFieldBase<Date> {


}
