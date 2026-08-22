import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../shared/utils/base.service';
import {
  LancamentoFinanceiroCreateDTO,
  LancamentoFinanceiroDTO,
  HistoricoFinanceiroDTO,
  GrupoLancamentoUpdateDTO,
  RelatorioLancamentoFiltroDTO,
} from '../dtos/lancamento/lancamento.financeiro';
@Injectable({ providedIn: 'root' })
export class LancamentoFinanceiroService extends BaseService<
  LancamentoFinanceiroDTO,
  LancamentoFinanceiroCreateDTO
> {
  constructor(http: HttpClient) {
    super(http, 'lancamentos-financeiros');
  }

  cancelar(id: number, motivo: string) {
    return this.http.post<LancamentoFinanceiroDTO>(`${this.url}/${id}/cancelamento`, { motivo });
  }

  relatorio(filtro: RelatorioLancamentoFiltroDTO) {
    return this.http.post<LancamentoFinanceiroDTO[]>(`${this.url}/relatorio`, filtro);
  }

  historico(id: number) {
    return this.http.get<HistoricoFinanceiroDTO[]>(`${this.url}/${id}/historico`);
  }

  parcelas(parcelamentoId: string) {
    return this.http.get<LancamentoFinanceiroDTO[]>(`${this.url}/parcelamentos/${parcelamentoId}`);
  }

  cancelarParcelamento(parcelamentoId: string, motivo: string) {
    return this.http.post<void>(`${this.url}/parcelamentos/${parcelamentoId}/cancelamento`, { motivo });
  }

  excluirParcelamento(parcelamentoId: string) {
    return this.http.delete<void>(`${this.url}/parcelamentos/${parcelamentoId}`);
  }

  recorrencias(recorrenciaId: string) {
    return this.http.get<LancamentoFinanceiroDTO[]>(`${this.url}/recorrencias/${recorrenciaId}`);
  }

  cancelarRecorrencia(recorrenciaId: string, motivo: string) {
    return this.http.post<void>(`${this.url}/recorrencias/${recorrenciaId}/cancelamento`, { motivo });
  }

  excluirRecorrencia(recorrenciaId: string) {
    return this.http.delete<void>(`${this.url}/recorrencias/${recorrenciaId}`);
  }

  atualizarParcelamento(parcelamentoId: string, dto: GrupoLancamentoUpdateDTO) {
    return this.http.put<LancamentoFinanceiroDTO[]>(`${this.url}/parcelamentos/${parcelamentoId}`, dto);
  }

  atualizarRecorrencia(recorrenciaId: string, dto: GrupoLancamentoUpdateDTO) {
    return this.http.put<LancamentoFinanceiroDTO[]>(`${this.url}/recorrencias/${recorrenciaId}`, dto);
  }
}
