import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import {
  ConfiguracaoAlertaLimiteDTO,
  ConfiguracaoAlertaLimiteUpdateDTO,
  ConfiguracaoGeralDTO,
  ConfiguracaoGeralUpdateDTO
} from '../dtos/configuracao/configuracao.alerta.limite';

@Injectable({ providedIn: 'root' })
export class ConfiguracaoService {
  private readonly url = `${environment.apiUrl}/configuracoes`;

  constructor(private http: HttpClient) {}

  listarAlertasLimite() {
    return this.http.get<ConfiguracaoAlertaLimiteDTO[]>(`${this.url}/alertas-limite`);
  }

  atualizarAlertasLimite(alertas: ConfiguracaoAlertaLimiteUpdateDTO[]) {
    return this.http.put<ConfiguracaoAlertaLimiteDTO[]>(`${this.url}/alertas-limite`, alertas);
  }

  carregarGerais() {
    return this.http.get<ConfiguracaoGeralDTO>(`${this.url}/gerais`);
  }

  atualizarGerais(configuracao: ConfiguracaoGeralUpdateDTO) {
    return this.http.put<ConfiguracaoGeralDTO>(`${this.url}/gerais`, configuracao);
  }
}
