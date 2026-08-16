import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';
import {
  MovimentoFinanceiroCreateDTO,
  MovimentoFinanceiroDTO,
  TransferenciaFinanceiraDTO,
} from '../dtos/movimento/movimento.financeiro';
import { BaseService } from '../shared/utils/base.service';
@Injectable({ providedIn: 'root' })
export class MovimentoFinanceiroService extends BaseService<MovimentoFinanceiroDTO, MovimentoFinanceiroCreateDTO> {
  constructor(http: HttpClient) {
    super(http, 'movimentos');
  }
  extrato(contaId: number, inicio?: string, fim?: string) {
    let params = new HttpParams();
    if (inicio) params = params.set('inicio', inicio);
    if (fim) params = params.set('fim', fim);
    return this.http.get<MovimentoFinanceiroDTO[]>(`${this.url}/extrato/${contaId}`, { params });
  }
  saldo(contaId: number) {
    return this.http.get<number>(`${this.url}/saldo/${contaId}`);
  }
  transferir(dto: TransferenciaFinanceiraDTO) {
    return this.http.post<MovimentoFinanceiroDTO[]>(`${this.url}/transferencias`, dto);
  }
  excluirTransferencia(id: string) {
    return this.http.delete<void>(`${this.url}/transferencias/${id}`);
  }
}
