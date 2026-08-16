import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import { DashboardDTO } from '../dtos/dashboard/dashboard.dto';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly url = `${environment.apiUrl}/dashboard`;
  constructor(private http: HttpClient) {}
  carregar(ano: number, mes: number) {
    return this.http.get<DashboardDTO>(this.url, { params: { ano, mes } });
  }
}
