import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import { ApuracaoMeiDTO } from '../dtos/mei/apuracao-mei.dto';

@Injectable({ providedIn: 'root' })
export class ApuracaoMeiService {
  private readonly url = `${environment.apiUrl}/mei/apuracao`;

  constructor(private http: HttpClient) {}

  apurar(ano: number, mes: number) {
    return this.http.get<ApuracaoMeiDTO>(this.url, { params: { ano, mes } });
  }
}
