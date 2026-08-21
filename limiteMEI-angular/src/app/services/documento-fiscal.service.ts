import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../shared/utils/base.service';
import { DocumentoFiscalCreateDTO, DocumentoFiscalDTO } from '../dtos/documento-fiscal/documento.fiscal';
@Injectable({providedIn:'root'})
export class DocumentoFiscalService extends BaseService<DocumentoFiscalDTO,DocumentoFiscalCreateDTO>{constructor(http:HttpClient){super(http,'documentos-fiscais');}}
