import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../shared/utils/base.service';
import { ContaFinanceiraCreateDTO, ContaFinanceiraDTO } from '../dtos/conta/conta.financeira';
@Injectable({ providedIn: 'root' })
export class ContaFinanceiraService extends BaseService<
  ContaFinanceiraDTO,
  ContaFinanceiraCreateDTO
> {
  constructor(http: HttpClient) {
    super(http, 'contas-financeiras');
  }
}
