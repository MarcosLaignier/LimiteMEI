// import {Component, ElementRef, HostListener, Input, Output} from '@angular/core';
// import {NgClass} from "@angular/common";
// import {FormFieldBase} from "../../../utils/form.field.base";
// import {TextBoxComponent} from "../text-box-component/text.box.component";
//
// @Component({
//   selector: 'autocomplete-component',
//   imports: [
//     NgClass,
//     TextBoxComponent
//   ],
//   templateUrl: './autocomplete.component.html',
//   styleUrl: './autocomplete.component.scss',
// })
// export class AutocompleteComponent extends FormFieldBase<any> {
//   @Input() dataSource: any[] = []
//   @Input() displayKey: string;
//   @Input() filterKeys: string[];
//   protected showDataSource: any[] = []
//   protected suggestionVisible: boolean = false;
//   textBoxData: string = '';
//   @Output() value: any;
//
//   constructor(private eRef: ElementRef) {
//     super();
//   }
//
//   protected filterData() {
//     const query = this.textBoxData.toLowerCase().trim();
//     if (!query) {
//       this.suggestionVisible = false;
//       return;
//     }
//
//     this.suggestionVisible = true;
//
//     this.showDataSource = this.dataSource.filter(item => {
//       // Se for objeto, busca nas filterKeys
//       if (typeof item === 'object' && item !== null) {
//         return this.filterKeys.some(key =>
//           String(item[key]).toLowerCase().includes(query)
//         );
//       }
//       // Se for string ou número, busca diretamente no valor
//       return String(item).toLowerCase().includes(query);
//     });
//   }
//
// // Exibir o texto correto dependendo se é objeto ou tipo nativo
//   getDisplayLabel(item: any): string {
//     if (typeof item === 'object' && item !== null) {
//       return item[this.displayKey];
//     }
//     return item;
//   }
//
//   selectSuggestion(item: any) {
//     this.textBoxData = this.getDisplayLabel(item);
//     this.suggestionVisible = false;
//     this.value = item;
//     console.log(this.value)
//   }
//
//   /* Esse foi total Gemini, mas achei o conceito interessante */
//   @HostListener('document:click', ['$event'])
//   clickout(event: any) {
//     // Se o clique foi fora deste componente, fecha as sugestões
//     if (!this.eRef.nativeElement.contains(event.target)) {
//       this.suggestionVisible = false;
//     }
//   }
// }
