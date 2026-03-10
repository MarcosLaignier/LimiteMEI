import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {FormFieldBase} from '../../../utils/form.field.base';

@Directive()
export abstract class BaseAutocompleteEntityComponent<T> extends FormFieldBase<T> {

  @Input() displayField: keyof T = 'nome' as keyof T;
  @Input() minLength = 3;

  protected filteredItems: T[] = [];
  protected suggestionVisible = false;
  protected alreadyAsked = false;

  textBoxData = '';

  private subjectSearch = new Subject<string>();

  protected constructor(protected eRef: ElementRef) {
    super();

    this.subjectSearch.pipe(debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.load(term)))
      .subscribe(items => {
        this.filteredItems = items ?? [];
        this.suggestionVisible = true;
      });
  }

  protected filterData(): void {
    const query = this.textBoxData?.trim();

    this.alreadyAsked = false;

    if (!query || query.length < this.minLength) {
      this.filteredItems = [];
      this.suggestionVisible = false;
      return;
    }

    this.subjectSearch.next(query);
  }

  protected selectItem(item: T): void {
    this.textBoxData = String(item[this.displayField]);
    this.dataField = item;
    this.suggestionVisible = false;
  }

  protected getDisplayLabel(item: T): string {
    return String(item[this.displayField]);
  }

  @HostListener('document:click', ['$event'])
  protected clickOut(event: MouseEvent): void {
    if (!this.eRef.nativeElement.contains(event.target)) {

      const query = this.textBoxData?.trim();

      if (query && query.length >= this.minLength && !this.dataField && !this.alreadyAsked) {
        this.alreadyAsked = true;
        this.onNoSelectedAndBlur(query);
      }

      this.suggestionVisible = false;
    }
  }

  /** Cada autocomplete decide como buscar, deverá implementar */
  protected abstract load(text: string): Observable<T[]>;

  /** Hook para caso clique fora sem selecionar nada */
  protected async onNoSelectedAndBlur(query: string): Promise<void> {
  }


}

/**
 * Template padrao para Utilização nos seletores
 * Caso necessário, criar template personalizado...
 */
export function getAutocompleteBaseTemplate(): string {
  return `
<div [ngClass]="colClass">

  <div class="position-relative w-100 autocomplete-container">

    <text-box-component
      [label]="label"
      [placeholder]="placeholder"
      [colClass]="'col-12'"
      [(dataField)]="textBoxData"
      (keyup)="filterData()"
      [disabled]="disabled">
    </text-box-component>

    @if (suggestionVisible) {
      <div class="list-group autocomplete-suggestions position-absolute w-100">
        @for (item of filteredItems; track item) {
          <button type="button"
                  class="list-group-item list-group-item-action"
                  (click)="selectItem(item)">
            {{ getDisplayLabel(item) }}
          </button>
        } @empty {
          <div class="list-group-item disabled">
            Nenhum resultado encontrado
          </div>
        }
      </div>
    }

  </div>

</div>
`;
}


// export function getAutocompleteBaseTemplate(): string {
//   return `
// <div class="position-relative w-100" [ngClass]="colClass">
//   <text-box-component [label]="label"
//                       [placeholder]="placeholder"
//                       [colClass]="colClass"
//                       [(dataField)]="textBoxData"
//                       (keyup)="filterData()"
//                       [disabled]="disabled">
//   </text-box-component>
//
//   @if (suggestionVisible) {
//     <div class="list-group autocomplete-suggestions position-absolute w-100">
//           @for (item of filteredItems; track item) {
//         <button type="button"
//                 class="list-group-item list-group-item-action"
//                 (click)="selectItem(item)">
//           {{ getDisplayLabel(item) }}
//         </button>
//       } @empty {
//         <div class="list-group-item disabled">
//           Nenhum resultado encontrado
//         </div>
//       }
//     </div>
//   }
// </div>
// `;
// }
