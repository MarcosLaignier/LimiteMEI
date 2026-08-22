import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../shared/utils/base.service';
import { DocumentoFiscalCreateDTO, DocumentoFiscalDTO, DocumentoFiscalXmlPreviewDTO, RelatorioDocumentoFiscalFiltroDTO } from '../dtos/documento-fiscal/documento.fiscal';
@Injectable({providedIn:'root'})
export class DocumentoFiscalService extends BaseService<DocumentoFiscalDTO,DocumentoFiscalCreateDTO>{
  constructor(http:HttpClient){super(http,'documentos-fiscais');}
  relatorio(filtro:RelatorioDocumentoFiscalFiltroDTO){return this.http.post<DocumentoFiscalDTO[]>(`${this.url}/relatorio`,filtro);}
  importarXml(arquivo:File){const dados=new FormData();dados.append('arquivo',arquivo);return this.http.post<DocumentoFiscalXmlPreviewDTO>(`${this.url}/importar-xml`,dados);}
}
