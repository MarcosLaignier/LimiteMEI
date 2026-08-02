import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {GridColumnExpand} from "../../../utils/directives/grid.column.decorator";
import { MaskUtils } from '../../../utils/mask.utils';


@Component({
  selector: 'grid-component',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent {

  gridColumnConfig: any[] = [];
  @Input() titleGridVisible: boolean = false;
  @Input() titleGrid: string = '';
  @Input() dataSource: any[] = [];
  @Input() columns: string[] = [];
  @Input() routerByEditDblClick: boolean = false;
  @Input() loading = false;
  @Input() emptyTitle = 'Nenhum registro encontrado';
  @Input() emptyMessage = 'Cadastre um novo registro ou ajuste os filtros da consulta.';
  @Input() showRowActions = false;
  @Input() showEditAction = true;
  @Input() showDeleteAction = true;
  @Input() deletingIds: ReadonlySet<any> = new Set<any>();

  @Output() dblClickLine = new EventEmitter<any>();
  @Output() editLine = new EventEmitter<any>();
  @Output() deleteLine = new EventEmitter<any>();

  private _typeDataSource: any;


  get typeDataSource(): any {
    return this._typeDataSource;
  }


  @Input()
  set typeDataSource(value: new () => any) {
    if (!value || value === this._typeDataSource) return;

    this._typeDataSource = value;

    const constructorClasse = value as any;// To construindo a classe principal que recebe via atributo pelo TypeDataSource
    let colunasAnotadas = (constructorClasse.__grid_columns__ ?? []) as any[]; // Aqui vou ler todas as colunas que tem o decorator @GridColumn
    const extendColumn = colunasAnotadas.find(c => c.isObject && c.isExtendsConstructor); // Aqui to buscando que expand(tem objeto)
    if (extendColumn?.expandColumns?.length) { // Aqui verifico se existe se tem colunas para expandir( dentro da anotacao @GridColumn tem expandColumns...)

      // Vou montar uma chave exemplo se é pessoa a classe expandida e tem nome la dentro, vai montar pessoa.nome
      // com a chave extendida digo que seja o nome do atributo por exemplo PessoaPapel tem pessoa:Pessoa, vai pegar pessoa como key
      const expandedCols = extendColumn.expandColumns.map(
        (ec: GridColumnExpand) => ({...ec,
          key: `${extendColumn.key}.${ec.key}`
        })
      );
      colunasAnotadas = colunasAnotadas.filter(c => c != extendColumn);

      colunasAnotadas = [...expandedCols, ...colunasAnotadas];
    }

    this.gridColumnConfig = colunasAnotadas
      .filter(c => !c.hidden)
      .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));

    this.columns = this.gridColumnConfig.map(c => c.key);
  }




  constructor(private router: Router) {

  }

  /** Metodo responsavel por formatar datas
   *
   * @param value
   */
  formatDate(value: any): string {
    if (!value) {
      return '';
    }

    let date: Date;

    // Se já for Date
    if (value instanceof Date) {
      date = value;
    }
    // Se vier como string yyyy-MM-dd ou yyyy-MM-ddTHH:mm:ss
    else if (typeof value === 'string') {
      const parsed = new Date(value);
      if (isNaN(parsed.getTime())) {
        return value;
      }
      date = parsed;
    }
    // Se vier como timestamp
    else if (typeof value === 'number') {
      date = new Date(value);
    } else {
      return value;
    }

    if (isNaN(date.getTime())) {
      return '';
    }

    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();

    return `${d}/${m}/${y}`;
  }

  formatTitle(col: string): string {
    if (!col) return '';
    return col.replace(/[._]/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
  }

  editItem(row: any) {
    if (this.routerByEditDblClick && row?.id) {
      const currentUrl = this.router.url;
      const newUrl = `${currentUrl}/editar/${row?.id}`;
      this.router.navigateByUrl(newUrl);

    }
    this.dblClickLine.emit(row);
  }

  /** Metodo acessorio para quando for um atributo que tenha o expandable, que tem o path completo pessoa.nome por exmeplo
   *
   * @param obj
   * @param path
   */
  resolveValue(obj: any, path: string): any {
    if (!obj || !path) return null;
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }

  formatByType(value: any, col: any): any {
    if (value == null) return '';

    if (col.isObject && col.displayProperty) {
      const displayValue = value[col.displayProperty];
      // Aplica recursivamente o formatByType caso necessário
      return this.formatByType(displayValue, {...col, isObject: false});
    }

    switch (col.type) {

      case 'date':
        return this.formatDate(value);

      case 'documento':
        if (value.toString().replace(/\D/g, '').length <= 11 && !/[A-Z]/i.test(value.toString())) {
          return MaskUtils.apply(value, col.mask ?? '000.000.000-00');
        } else {
          return MaskUtils.apply(value, col.mask ?? 'AA.AAA.AAA/AAAA-00');
        }

      case 'telefone':
        return MaskUtils.formatField(value, 'telefone');

      case 'enum':
        return value;

      case 'boolean':
        return value == true ? 'Sim' : 'Não'

      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(value);

      default:
        return value;
    }
  }

  editarLinha(row: any, event: Event): void {
    event.stopPropagation();
    this.editLine.emit(row);
  }

  excluirLinha(row: any, event: Event): void {
    event.stopPropagation();
    if (!this.deletingIds.has(row?.id)) this.deleteLine.emit(row);
  }
}
