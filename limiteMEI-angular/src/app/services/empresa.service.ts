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
}
