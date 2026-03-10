import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'select-enum',
  standalone:true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './select.enum.component.html',
  styleUrls: ['./select.enum.component.scss']

})
export class SelectEnumComponent  {

  @Input() enumObject: any;
  @Input() placeholder: string = 'Selecione';
  @Input() disabled: boolean = false;

  @Output() dataFieldChange = new EventEmitter<any>();

  /** Responsavel por aplicar o css do bootstrap na div externa ao component
   *
   */
  @Input() colClass: string = 'col-md-2';

  /** Responsavel por aplicar o label no component
   *
   */
  @Input() label: string = ''


  private _dataField!: any;

  /** dataField dos componentes, com two-way dataBind
   *
   * @private
   */
  @Input()
  get dataField(): any {
    return this._dataField;
  }

  set dataField(val: any) {
      if (val && typeof val === 'string' && this.enumObject) {
        const enumKeys = Object.keys(this.enumObject);

        // se for chave válida do enum, mantém
        if (enumKeys.includes(val)) {
          this._dataField = val;
        } else {
          // se veio valor do enum,  encontra a chave correspondente
          const foundKey = enumKeys.find(k => this.enumObject[k] === val);
          this._dataField = foundKey || val;
        }
      } else {
        this._dataField = val;
      }

      this.dataFieldChange.emit(this._dataField);

  }

  get enumOptions(): { value: unknown; key: string }[] {
    return Object.entries(this.enumObject).map(([key, value]) => ({ key, value }));
  }


}
