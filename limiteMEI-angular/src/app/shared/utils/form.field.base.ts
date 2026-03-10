import {Directive, EventEmitter, Input, Output} from '@angular/core';

@Directive()
export abstract class FormFieldBase<T> {

  /** Responsavel por aplicar o css do bootstrap na div externa ao component */
  @Input() colClass: string = 'col-md-2';

  /** Responsavel por aplicar o label no component */
  @Input() label: string = ''

  @Input() placeholder: string = '';

  /** Desabilita os campos */
  @Input() disabled: boolean = false;

  private _dataField!: T;

  /** dataField dos componentes, com two-way dataBind
   *
   * @private
   */
  @Input()
  get dataField(): T {
    return this._dataField;
  }

  set dataField(val: T) {
    this._dataField = val;
    this.dataFieldChange.emit(this._dataField);
  }

  @Output() dataFieldChange = new EventEmitter<T>();
}
