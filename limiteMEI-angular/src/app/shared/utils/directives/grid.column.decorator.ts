import {GridColumnType} from "./grid.column.type";

export const GRID_COLUMNS_KEY = '__grid_columns__';

export interface GridColumnOptions {
  label?: string;
  type?: GridColumnType;
  mask?: string;
  ordem?: number;
  hidden?: boolean;
  width?: string;
  isObject?: boolean;           // true se quiser passar um objeto
  displayProperty?: string;     // qual propriedade do objeto exibir
  isExtendsConstructor?: boolean;
  expandColumns?: GridColumnExpand[];
}

export interface GridColumnExpand {
  key: string;
  label?: string;
  type?: GridColumnType;
  ordem?: number;
  mask?: string;
  hidden?: boolean;
  width?: string;
}

export function GridColumn(options: GridColumnOptions = {}) {
  return function (target: any, propertyKey: string) {

    const ctor = target.constructor as any;

    if (!ctor[GRID_COLUMNS_KEY]) {
      ctor[GRID_COLUMNS_KEY] = [];
    }

    ctor[GRID_COLUMNS_KEY].push({
      key: propertyKey,
      ...options
    });
  };
}
