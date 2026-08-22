import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import { RelatorioFluxoCaixaDTO } from '../dtos/relatorio/relatorio.financeiro';
import { competenciaAtual, periodoDaCompetencia } from '../shared/components-commons/relatorio/report-period.utils';

@Injectable({ providedIn: 'root' })
export class RelatorioService {
  private readonly url = `${environment.apiUrl}/relatorios`;

  constructor(private http: HttpClient) {}

  fluxoCaixa(inicio: string, fim: string, contaFinanceiraId?: number) {
    const periodoPadrao = periodoDaCompetencia(competenciaAtual());
    let params = new HttpParams()
      .set('inicio', inicio || periodoPadrao.inicio)
      .set('fim', fim || periodoPadrao.fim);
    if (contaFinanceiraId) params = params.set('contaFinanceiraId', contaFinanceiraId);
    return this.http.get<RelatorioFluxoCaixaDTO>(`${this.url}/fluxo-caixa`, { params });
  }
}
