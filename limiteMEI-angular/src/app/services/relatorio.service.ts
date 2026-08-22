import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import { RelatorioFluxoCaixaDTO, RelatorioFluxoCaixaFiltroDTO } from '../dtos/relatorio/relatorio.financeiro';
import { competenciaAtual, periodoDaCompetencia } from '../shared/components-commons/relatorio/report-period.utils';

@Injectable({ providedIn: 'root' })
export class RelatorioService {
  private readonly url = `${environment.apiUrl}/relatorios`;

  constructor(private http: HttpClient) {}

  fluxoCaixa(filtro: RelatorioFluxoCaixaFiltroDTO) {
    const periodoPadrao = periodoDaCompetencia(competenciaAtual());
    return this.http.post<RelatorioFluxoCaixaDTO>(`${this.url}/fluxo-caixa`, {
      ...filtro,
      inicio: filtro.inicio || periodoPadrao.inicio,
      fim: filtro.fim || periodoPadrao.fim,
    });
  }
}
