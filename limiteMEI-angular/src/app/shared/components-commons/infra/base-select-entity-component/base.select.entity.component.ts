// import {Directive, Input, OnInit} from '@angular/core';
// import {FormFieldBase} from "../../../utils/form.field.base";
// import {CrudServicePadrao} from "../../../utils/service/crud.service.padrao";
//
// @Directive()
// export abstract class BaseSelectEntityComponent<T> extends FormFieldBase<T> implements OnInit {
//
//   @Input() items: T[] = [];
//   @Input() displayField: keyof T = 'nome' as keyof T;
//   @Input() compareField: string = 'id';
//
//   ngOnInit(): void {
//     this.load();
//   }
//
//   /**
//    * Servico padrão para carregar os itens dos seletores.
//    */
//   protected load(): void {
//     this.getMainService().getByFiltro().subscribe(response => {
//       this.items = response.body ?? [];
//     });
//   }
//
//
//   protected abstract getMainService(): CrudServicePadrao<T, any>;
//
//   /** Atenção -> essencial para o funcionamento correto do select em modo edição.
//    * Compara o identificador do objeto retornado pelo backend com os itens carregados,
//    * permitindo que os seletores selecione corretamente a opção correspondente.
//    */
//   compareFn = (a: any, b: any): boolean => {
//     if (!a || !b) {
//       return a == b;
//     }
//     return a[this.compareField] === b[this.compareField];
//   };
//
// }
// /**
//  * Template padrao para Utilização nos seletores
//  * Caso necessário, criar template personalizado...
//  */
// export function getSeletorBaseTemplateDefault() : string {
//   return `
//         <div [ngClass]="colClass">
//   @if (label) {
//     <label class="form-label">{{ label }}</label>
//   }
//
//   <select class="form-select"
//           [(ngModel)]="dataField"
//           [compareWith]="compareFn"
//           [disabled]="disabled">
//     <option [ngValue]="null">
//       {{ placeholder }}
//     </option>
//
//     @for (item of items; track item) {
//       <option [ngValue]="item">
//         {{ item[displayField] }}
//       </option>
//     }
//   </select>
// </div>
//
//     `
// }
