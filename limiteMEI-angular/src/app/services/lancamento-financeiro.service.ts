import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../shared/utils/base.service';
import {
  LancamentoFinanceiroCreateDTO,
  LancamentoFinanceiroDTO,
  HistoricoFinanceiroDTO,
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

  historico(id: number) {
    return this.http.get<HistoricoFinanceiroDTO[]>(`${this.url}/${id}/historico`);
  }
}
