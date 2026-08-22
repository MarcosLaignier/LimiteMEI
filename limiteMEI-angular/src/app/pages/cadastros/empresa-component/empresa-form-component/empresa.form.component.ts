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
import { SwitchComponent } from '../../../../shared/components-commons/infra/switch-component/switch.component';

@Component({
  selector: 'empresa-form',
  standalone: true,
  imports: [ToolbarComponent, TextBoxComponent, DateBoxComponent, SelectEnumComponent, BadgeComponent, SwitchComponent],
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

  onAtivoChange(ativo: boolean): void {
    if (ativo) this.model.dataEncerramento = undefined;
  }

  override afterSave(saved?: EmpresaDTO): void {
    if (saved) {
      if (saved.ativo) {
        this.empresaAtiva.selecionar(saved);
      } else if (this.empresaAtiva.empresa()?.id === saved.id) {
        this.empresaAtiva.limpar();
      }
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
    if (!ValidationUtils.requiredFields(this.model, ['dataAbertura', 'dataInicioSimei', 'tipoEmpresa'])) {
      this.alertService.warning('Informe a data de abertura, o início no SIMEI e o tipo da empresa.');
      return false;
    }
    if (this.model.dataInicioSimei < this.model.dataAbertura) {
      this.alertService.warning('A data de início no SIMEI não pode ser anterior à data de abertura.');
      return false;
    }
    if (this.model.dataEncerramento && this.model.dataEncerramento < this.model.dataInicioSimei) {
      this.alertService.warning('A data de encerramento não pode ser anterior ao início no SIMEI.');
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
      dataInicioSimei: '',
      tipoEmpresa: TipoEmpresaEnum.MEI_GERAL,
      ativo: true
    };
  }
}
