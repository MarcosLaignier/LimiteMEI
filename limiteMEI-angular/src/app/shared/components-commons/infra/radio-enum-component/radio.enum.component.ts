import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";

@Component({
  selector: 'radio-enum',
  standalone:true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './radio.enum.component.html',
  styleUrls: ['./radio.enum.component.scss']
})
export class RadioEnumComponent {

  /** Responsavel por aplicar o css do bootstrap na div externa ao component
   *
   */
  @Input() colClass: string = 'col-md-4';

  @Input() enumObject: any;

  @Input() label: string = '';

  @Input() disabled: boolean = false;

  // Para alterar o layout: inline ou empilhado
  @Input() inline: boolean = true;

  // Two-way binding
  @Output() dataFieldChange = new EventEmitter<any>();

  private _dataField!: any;

  @Input()
  get dataField(): any {
    return this._dataField;
  }

  set dataField(val: any) {
    if (val && typeof val === 'string' && this.enumObject) {
      const enumKeys = Object.keys(this.enumObject);

      if (enumKeys.includes(val)) {
        this._dataField = val;
      } else {
        const foundKey = enumKeys.find(k => this.enumObject[k] === val);
        this._dataField = foundKey || val;
      }
    } else {
      this._dataField = val;
    }

    this.dataFieldChange.emit(this._dataField);
  }

  get enumOptions() {
    return Object.entries(this.enumObject).map(([key, value]) => ({
      key,
      value
    }));
  }
}
