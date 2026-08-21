import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseListCrud } from '../../shared/components-commons/core/base.list.crud';
import { GridComponent } from '../../shared/components-commons/infra/grid-column-component/grid.component';
import { ToolbarComponent } from '../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';
import { DocumentoFiscalCreateDTO, DocumentoFiscalDTO } from '../../dtos/documento-fiscal/documento.fiscal';
import { DocumentoFiscalService } from '../../services/documento-fiscal.service';
@Component({standalone:true,imports:[GridComponent,ToolbarComponent],template:`
<toolbar-filter tituloPagina="Documentos fiscais" [listMode]="true" [loading]="loading" (novo)="novo()" (filtrar)="doFilter()" />
<section class="page"><header><span>MÓDULO FISCAL</span><h1>Documentos fiscais</h1><p>Controle as notas emitidas e confira os vínculos com as receitas.</p></header><grid-component [dataSource]="dataSource" [loading]="loading" [typeDataSource]="DocumentoFiscalDTO" [routerByEditDblClick]="true" emptyTitle="Nenhum documento fiscal" emptyMessage="Cadastre a primeira nota emitida pela empresa." /></section>`,styles:[`.page{margin-top:1rem;padding:1.5rem;background:#fff;border-radius:12px}.page header{margin-bottom:1rem}.page header span{font-size:.75rem;color:#5570f1;font-weight:700}.page h1{margin:.2rem 0}.page p{color:#687080}`]})
export class DocumentoFiscalListComponent extends BaseListCrud<DocumentoFiscalDTO,DocumentoFiscalCreateDTO>{DocumentoFiscalDTO=DocumentoFiscalDTO;protected service:DocumentoFiscalService;protected routeBase='/app/fiscal/documentos';constructor(service:DocumentoFiscalService,router:Router){super(router);this.service=service;}ngOnInit(){this.load();}}
