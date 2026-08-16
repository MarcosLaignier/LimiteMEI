import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../shared/utils/base.service';
import {
  LancamentoFinanceiroCreateDTO,
  LancamentoFinanceiroDTO,
} from '../dtos/lancamento/lancamento.financeiro';
@Injectable({ providedIn: 'root' })
export class LancamentoFinanceiroService extends BaseService<
  LancamentoFinanceiroDTO,
  LancamentoFinanceiroCreateDTO
> {
  constructor(http: HttpClient) {
    super(http, 'lancamentos-financeiros');
  }
}
