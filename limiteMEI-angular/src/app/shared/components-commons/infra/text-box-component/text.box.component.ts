import {Component} from "@angular/core";
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

}
