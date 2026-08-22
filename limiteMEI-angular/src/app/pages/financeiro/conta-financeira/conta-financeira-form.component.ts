import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormCrud } from '../../../shared/components-commons/core/base.form.crud';
import { ContaFinanceiraCreateDTO, ContaFinanceiraDTO } from '../../../dtos/conta/conta.financeira';
import { ContaFinanceiraService } from '../../../services/conta-financeira.service';
import { ToolbarComponent } from '../../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';
import { TextBoxComponent } from '../../../shared/components-commons/infra/text-box-component/text.box.component';
import { NumberBoxComponent } from '../../../shared/components-commons/infra/number-box-component/number.box.component';
import { SelectEnumComponent } from '../../../shared/components-commons/infra/select-enum-component/select.enum.component';
import { SwitchComponent } from '../../../shared/components-commons/infra/switch-component/switch.component';
import {
  TipoContaFinanceiraEnum,
  TIPO_CONTA_FINANCEIRA_LABELS,
} from '../../../enums/tipo.conta.financeira.enum';
import { BancoEnum, BANCO_LABELS } from '../../../enums/banco.enum';
@Component({
  standalone: true,
  imports: [
    ToolbarComponent,
    TextBoxComponent,
    NumberBoxComponent,
    SelectEnumComponent,
    SwitchComponent,
  ],
  templateUrl: './conta-financeira-form.component.html',
  styleUrl: './conta-financeira-form.component.scss',
})
export class ContaFinanceiraFormComponent
  extends BaseFormCrud<ContaFinanceiraDTO, ContaFinanceiraCreateDTO>
  implements OnInit
{
  protected service: ContaFinanceiraService;
  protected routeBase = '/app/financeiro/contas';
  readonly tipos = TipoContaFinanceiraEnum;
  readonly tipoLabels = TIPO_CONTA_FINANCEIRA_LABELS;
  readonly bancos = BancoEnum;
  readonly bancoLabels = BANCO_LABELS;
  constructor(service: ContaFinanceiraService, router: Router, route: ActivatedRoute) {
    super(router, route);
    this.service = service;
    this.clear();
  }
  ngOnInit() {
    this.initForm();
  }
  override clear() {
    this.model = {
      nome: '',
      instituicao: undefined,
      agencia: '',
      numeroConta: '',
      saldoInicial: 0,
      ativo: true,
    };
  }
  override validateSave() {
    if (!this.model.nome || !this.model.tipo) {
      this.alertService.warning('Informe o nome e o tipo da conta.');
      return false;
    }
    return true;
  }
}
