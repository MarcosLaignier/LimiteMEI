import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../shared/utils/base.service';
import { EmpresaDTO } from '../dtos/empresa/empresa.dto';
import { EmpresaCreateDTO } from '../dtos/empresa/empresa.create.dto';

@Injectable({ providedIn: 'root' })
export class EmpresaService extends BaseService<EmpresaDTO, EmpresaCreateDTO> {
  constructor(http: HttpClient) {
    super(http, 'empresas');
  }

  salvarLogo(id: number, arquivo: File) {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    return this.http.post<EmpresaDTO>(`${this.url}/${id}/logo`, formData);
  }

  removerLogo(id: number) {
    return this.http.delete<EmpresaDTO>(`${this.url}/${id}/logo`);
  }
}
