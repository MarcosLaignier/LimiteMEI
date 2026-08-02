import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseListCrud } from '../../../shared/components-commons/core/base.list.crud';
import { ToolbarComponent } from '../../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';
import { GridComponent } from '../../../shared/components-commons/infra/grid-column-component/grid.component';
import { EmpresaDTO } from '../../../dtos/empresa/empresa.dto';
import { EmpresaCreateDTO } from '../../../dtos/empresa/empresa.create.dto';
import { EmpresaService } from '../../../services/empresa.service';
import { AuthService } from '../../../core/auth.service';
import { EmpresaAtivaService } from '../../../core/empresa-ativa.service';
import { EmpresaCardComponent } from '../../../shared/components-commons/empresa-card-component/empresa.card.component';

@Component({
  selector: 'empresa-component',
  standalone: true,
  imports: [ToolbarComponent, GridComponent, EmpresaCardComponent],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.scss'
})
export class EmpresaComponent extends BaseListCrud<EmpresaDTO, EmpresaCreateDTO> {
  EmpresaDTO = EmpresaDTO;
  protected service: EmpresaService;
  protected routeBase = '/app/cadastros/empresa';

  constructor(service: EmpresaService, router: Router, private auth: AuthService,
              protected empresaAtiva: EmpresaAtivaService) {
    super(router);
    this.service = service;
  }

  ngOnInit(): void {
    const empresaEmContexto = this.empresaAtiva.empresa();
    if (!this.isAdmin && empresaEmContexto) this.dataSource = [empresaEmContexto];
    this.load();
  }

  get isAdmin(): boolean { return this.auth.user()?.role === 'ADMIN'; }
  selecionarEmpresa(empresa: EmpresaDTO): void { this.empresaAtiva.selecionar(empresa); }
}
