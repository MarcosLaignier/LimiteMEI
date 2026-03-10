import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BaseService} from '../shared/utils/base.service';
import {CategoriaDTO} from '../dtos/categoria/categoria.dto';
import {CategoriaCreateDTO} from '../dtos/categoria/categoria.create.dto';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService extends BaseService<CategoriaDTO, CategoriaCreateDTO> {

  constructor(http: HttpClient) {
    super(http, 'categorias');
  }

}
