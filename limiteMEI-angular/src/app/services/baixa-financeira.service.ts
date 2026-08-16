import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';
import { BaixaFinanceiraCreateDTO, BaixaFinanceiraDTO } from '../dtos/lancamento/baixa.financeira';
@Injectable({ providedIn: 'root' })
export class BaixaFinanceiraService {
  constructor(private http: HttpClient) {}
  private url(id: number) {
    return `${environment.apiUrl}/lancamentos-financeiros/${id}/baixas`;
  }
  listar(id: number) {
    return this.http.get<BaixaFinanceiraDTO[]>(this.url(id));
  }
  criar(id: number, dto: BaixaFinanceiraCreateDTO) {
    return this.http.post<BaixaFinanceiraDTO>(this.url(id), dto);
  }
  excluir(id: number, baixaId: number) {
    return this.http.delete<void>(`${this.url(id)}/${baixaId}`);
  }
}
