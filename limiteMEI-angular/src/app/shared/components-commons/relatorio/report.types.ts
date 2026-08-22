export interface ReportRow {
  [key: string]: string | number;
}

export interface ReportColumn {
  key: string;
  label: string;
  tipo?: 'currency' | 'number';
}

export interface ReportTotal {
  label: string;
  valor: number | string;
  currency?: boolean;
}

export interface ReportFilter {
  label: string;
  valor?: string | number | null;
}

export function somaReport(linhas: ReportRow[], chave: string) {
  return linhas.reduce((total, linha) => total + Number(linha[chave] || 0), 0);
}
