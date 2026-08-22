import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
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
  logoPreview?: string;
  logoFile?: File;
  removendoLogo = false;

  constructor(service: EmpresaService, router: Router, route: ActivatedRoute,
              private empresaAtiva: EmpresaAtivaService) {
    super(router, route);
    this.service = service;
    this.setInitialModel();
  }

  ngOnInit(): void {
    this.initForm();
  }

  override loadById(id: number): void {
    this.loading = true;
    this.service.getById(id).subscribe({
      next: res => {
        if (res.body) {
          this.model = { ...res.body } as unknown as EmpresaCreateDTO;
          this.logoPreview = res.body.logoDataUrl;
        }
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.alertService.error(this.errorMessage(err, 'Não foi possível carregar a empresa.'));
      }
    });
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
    this.logoPreview = undefined;
    this.logoFile = undefined;
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

  override save(): void {
    if (this.loading) return;
    if (!this.validateSave()) return;

    this.loading = true;
    const request$ = this.id
      ? this.service.update(this.id, this.model)
      : this.service.create(this.model);

    request$.pipe(
      switchMap(response => {
        const empresa = response.body;
        if (!empresa?.id || !this.logoFile) return of(empresa);
        return this.service.salvarLogo(empresa.id, this.logoFile);
      })
    ).subscribe({
      next: empresa => {
        this.loading = false;
        this.logoFile = undefined;
        this.alertService.success(this.id ? 'Empresa atualizada com sucesso.' : 'Empresa cadastrada com sucesso.');
        this.afterSave(empresa ?? undefined);
      },
      error: err => {
        this.loading = false;
        this.alertService.error(this.errorMessage(err, 'Não foi possível salvar a empresa.'));
      }
    });
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      this.alertService.warning('A logo deve ser PNG, JPG ou WEBP.');
      return;
    }
    if (file.size > 1024 * 1024) {
      this.alertService.warning('A logo deve ter no máximo 1MB.');
      return;
    }
    this.logoFile = file;
    const reader = new FileReader();
    reader.onload = () => this.logoPreview = String(reader.result);
    reader.readAsDataURL(file);
  }

  removerLogo(): void {
    if (!this.id) {
      this.logoFile = undefined;
      this.logoPreview = undefined;
      return;
    }
    if (this.removendoLogo || this.loading) return;
    this.removendoLogo = true;
    this.service.removerLogo(Number(this.id)).subscribe({
      next: empresa => {
        this.removendoLogo = false;
        this.logoFile = undefined;
        this.logoPreview = empresa.logoDataUrl;
        if (this.empresaAtiva.empresa()?.id === empresa.id) {
          this.empresaAtiva.atualizarSeAtiva(empresa);
        }
        this.alertService.success('Logo removida com sucesso.');
      },
      error: err => {
        this.removendoLogo = false;
        this.alertService.error(this.errorMessage(err, 'Não foi possível remover a logo.'));
      }
    });
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
