import {Component} from '@angular/core';
import {FormFieldBase} from "../../../utils/form.field.base";

@Component({
  selector: 'switch-component',
  standalone: true,
  templateUrl: './switch.component.html'
})
export class SwitchComponent extends FormFieldBase<boolean> {

  id = `switch-${crypto.randomUUID()}`;

  onToggle(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.dataField = checked;
    this.dataFieldChange.emit(checked);
  }
}
