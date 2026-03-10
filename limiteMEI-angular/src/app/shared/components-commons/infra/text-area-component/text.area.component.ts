import {Component, Input} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {FormFieldBase} from "../../../utils/form.field.base";

@Component({
  selector: 'text-area-component',
  standalone:true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './text.area.component.html',
  styleUrls: ['./text.area.component.scss'],
})
export class TextAreaComponent extends FormFieldBase<string> {

  /** Atributo responsavel pela altura em linhas do component
   *
   */
  @Input() rows: number = 3;

}
