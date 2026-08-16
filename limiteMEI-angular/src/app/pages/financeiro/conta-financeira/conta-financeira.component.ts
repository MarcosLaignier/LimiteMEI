import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseListCrud } from '../../../shared/components-commons/core/base.list.crud';
import { ContaFinanceiraCreateDTO, ContaFinanceiraDTO } from '../../../dtos/conta/conta.financeira';
import { ContaFinanceiraService } from '../../../services/conta-financeira.service';
import { ToolbarComponent } from '../../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';
import { GridComponent } from '../../../shared/components-commons/infra/grid-column-component/grid.component';
@Component({
  standalone: true,
  imports: [ToolbarComponent, GridComponent],
  templateUrl: './conta-financeira.component.html',
  styleUrl: './conta-financeira.component.scss',
})
export class ContaFinanceiraComponent
  extends BaseListCrud<ContaFinanceiraDTO, ContaFinanceiraCreateDTO>
  implements OnInit
{
  ContaFinanceiraDTO = ContaFinanceiraDTO;
  protected service: ContaFinanceiraService;
  protected routeBase = '/app/financeiro/contas';
  constructor(service: ContaFinanceiraService, router: Router) {
    super(router);
    this.service = service;
  }
  ngOnInit() {
    this.load();
  }
}
