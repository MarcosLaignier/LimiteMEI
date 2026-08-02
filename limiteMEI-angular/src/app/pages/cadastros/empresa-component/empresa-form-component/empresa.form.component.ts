import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormCrud } from '../../../../shared/components-commons/core/base.form.crud';
import { ToolbarComponent } from '../../../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';
import { TextBoxComponent } from '../../../../shared/components-commons/infra/text-box-component/text.box.component';
import { DateBoxComponent } from '../../../../shared/components-commons/infra/date-box-component/date.box.component';
import { SelectEnumComponent } from '../../../../shared/components-commons/infra/select-enum-component/select.enum.component';
import { BadgeComponent } from '../../../../shared/components-commons/infra/badge-component/badge.component';
import { EmpresaDTO } from '../../../../dtos/empresa/empresa.dto';
import { EmpresaCreateDTO } from '../../../../dtos/empresa/empresa.create.dto';
import { EmpresaService } from '../../../../services/empresa.service';
import { LIMITE_ANUAL_POR_TIPO, TIPO_EMPRESA_LABELS, TipoEmpresaEnum } from '../../../../enums/tipo.empresa.enum';
import { EmpresaAtivaService } from '../../../../core/empresa-ativa.service';
import { ValidationUtils } from '../../../../shared/utils/validation.utils';

@Component({
  selector: 'empresa-form',
  standalone: true,
  imports: [ToolbarComponent, TextBoxComponent, DateBoxComponent, SelectEnumComponent, BadgeComponent],
  templateUrl: './empresa.form.component.html',
  styleUrl: './empresa.form.component.scss'
})
export class EmpresaFormComponent extends BaseFormCrud<EmpresaDTO, EmpresaCreateDTO> {
  protected service: EmpresaService;
  protected routeBase = '/app/cadastros/empresa';
  protected readonly tipoEmpresaEnum = TipoEmpresaEnum;
  protected readonly tipoEmpresaLabels = TIPO_EMPRESA_LABELS;

  constructor(service: EmpresaService, router: Router, route: ActivatedRoute,
              private empresaAtiva: EmpresaAtivaService) {
    super(router, route);
    this.service = service;
    this.setInitialModel();
  }

  ngOnInit(): void {
    this.initForm();
  }

  get limiteAnual(): number {
    return LIMITE_ANUAL_POR_TIPO[this.model.tipoEmpresa] ?? 0;
  }

  get limiteAnualFormatado(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(this.limiteAnual);
  }

  override clear(): void {
    this.setInitialModel();
  }

  override afterSave(saved?: EmpresaDTO): void {
    if (saved) {
      this.empresaAtiva.selecionar(saved);
    }

    if (this.route.snapshot.queryParamMap.get('onboarding') === 'true') {
      this.router.navigate(['/app/dashboard']);
      return;
    }

    super.afterSave(saved);
  }

  override validateSave(): boolean {
    if (!ValidationUtils.requiredFields(this.model, ['cnpj', 'razaoSocial'])) {
      this.alertService.warning('Informe o CNPJ e a razão social.');
      return false;
    }
    if (!ValidationUtils.cnpj(this.model.cnpj)) {
      this.alertService.warning('Informe um CNPJ válido com 14 caracteres e os dois dígitos verificadores numéricos.');
      return false;
    }
    if (!ValidationUtils.requiredFields(this.model, ['dataAbertura', 'tipoEmpresa'])) {
      this.alertService.warning('Informe a data de abertura e o tipo da empresa.');
      return false;
    }
    return true;
  }

  private setInitialModel(): void {
    this.model = {
      cnpj: '',
      razaoSocial: '',
      nomeFantasia: '',
      dataAbertura: '',
      tipoEmpresa: TipoEmpresaEnum.MEI_GERAL
    };
  }
}
