import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../shared/utils/base.service';
import { ObrigacaoMeiCreateDTO, ObrigacaoMeiDTO } from '../dtos/mei/obrigacao-mei.dto';

@Injectable({ providedIn: 'root' })
export class ObrigacaoMeiService extends BaseService<ObrigacaoMeiDTO, ObrigacaoMeiCreateDTO> {
  constructor(http: HttpClient) {
    super(http, 'obrigacoes-mei');
  }

  listarExercicio(ano: number) {
    return this.http.get<ObrigacaoMeiDTO[]>(`${this.url}/exercicio/${ano}`, { observe: 'response' });
  }

  salvarComprovante(id: number, arquivo: File) {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    return this.http.post<ObrigacaoMeiDTO>(`${this.url}/${id}/comprovante`, formData, { observe: 'response' });
  }

  removerComprovante(id: number) {
    return this.http.delete<void>(`${this.url}/${id}/comprovante`, { observe: 'response' });
  }
}
