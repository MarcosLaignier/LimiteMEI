import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseListCrud } from '../../../shared/components-commons/core/base.list.crud';
import { ToolbarComponent } from '../../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';
import { GridComponent } from '../../../shared/components-commons/infra/grid-column-component/grid.component';
import { EmpresaDTO } from '../../../dtos/empresa/empresa.dto';
import { EmpresaCreateDTO } from '../../../dtos/empresa/empresa.create.dto';
import { EmpresaService } from '../../../services/empresa.service';

@Component({
  selector: 'empresa-component',
  standalone: true,
  imports: [ToolbarComponent, GridComponent],
  templateUrl: './empresa.component.html'
})
export class EmpresaComponent extends BaseListCrud<EmpresaDTO, EmpresaCreateDTO> {
  EmpresaDTO = EmpresaDTO;
  protected service: EmpresaService;
  protected routeBase = '/app/cadastros/empresa';

  constructor(service: EmpresaService, router: Router) {
    super(router);
    this.service = service;
  }

  ngOnInit(): void {
    this.load();
  }
}
