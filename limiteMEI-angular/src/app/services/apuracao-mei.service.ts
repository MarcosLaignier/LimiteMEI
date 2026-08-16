import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import { ApuracaoMeiDTO, HistoricoApuracaoMeiDTO, RelatorioMensalMeiDTO } from '../dtos/mei/apuracao-mei.dto';

@Injectable({ providedIn: 'root' })
export class ApuracaoMeiService {
  private readonly url = `${environment.apiUrl}/mei/apuracao`;

  constructor(private http: HttpClient) {}

  apurar(ano: number, mes: number) {
    return this.http.get<ApuracaoMeiDTO>(this.url, { params: { ano, mes } });
  }
  fechar(ano: number, mes: number) {
    return this.http.post<ApuracaoMeiDTO>(`${this.url}/fechamento`, null, { params: { ano, mes } });
  }
  reabrir(ano: number, mes: number, motivo: string) {
    return this.http.post<ApuracaoMeiDTO>(`${this.url}/reabertura`, { motivo }, { params: { ano, mes } });
  }
  relatorio(ano: number, mes: number) {
    return this.http.get<RelatorioMensalMeiDTO>(`${this.url}/relatorio`, { params: { ano, mes } });
  }
  historico(ano: number) {
    return this.http.get<HistoricoApuracaoMeiDTO>(`${this.url}/historico`, { params: { ano } });
  }
}
