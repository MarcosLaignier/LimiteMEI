import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CategoriaService } from '../../../../services/categoria.service';
import { ToolbarComponent } from '../../../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';
import { BaseFormCrud } from '../../../../shared/components-commons/core/base.form.crud';

import { CategoriaDTO } from '../../../../dtos/categoria/categoria.dto';
import { CategoriaCreateDTO } from '../../../../dtos/categoria/categoria.create.dto';

import { TextBoxComponent } from '../../../../shared/components-commons/infra/text-box-component/text.box.component';
import { SelectEnumComponent } from '../../../../shared/components-commons/infra/select-enum-component/select.enum.component';
import { TipoMovimentoEnum } from '../../../../enums/tipo.movimento.enum';
import { ValidationUtils } from '../../../../shared/utils/validation.utils';
import { NATUREZA_RECEITA_LABELS, NaturezaReceitaEnum } from '../../../../enums/natureza.receita.enum';
import { SwitchComponent } from '../../../../shared/components-commons/infra/switch-component/switch.component';

@Component({
  selector: 'categoria-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ToolbarComponent,
    TextBoxComponent,
    SelectEnumComponent,
    SwitchComponent
  ],
  templateUrl: './categoria.form.component.html',
  styleUrl: './categoria.form.component.scss'
})
export class CategoriaFormComponent
  extends BaseFormCrud<CategoriaDTO, CategoriaCreateDTO>
  implements OnInit {

  protected service: CategoriaService;

  protected routeBase = '/app/cadastros/categoria';
  protected readonly tipoMovimentoEnum = TipoMovimentoEnum;
  protected readonly naturezaReceitaEnum = NaturezaReceitaEnum;
  protected readonly naturezaReceitaLabels = NATUREZA_RECEITA_LABELS;

  constructor(
    service: CategoriaService,
    router: Router,
    route: ActivatedRoute
  ) {
    super(router, route);
    this.service = service;

    /** garante model inicializado */
    this.setInitialModel();
  }

  ngOnInit(): void {
    this.initForm();
  }

  override clear(): void {
    this.setInitialModel();
  }

  override validateSave(): boolean {
    if (!ValidationUtils.required(this.model.nome)) {
      this.alertService.warning('Informe o nome da categoria.');
      return false;
    }
    if (!ValidationUtils.required(this.model.tipo)) {
      this.alertService.warning('Selecione o tipo da categoria.');
      return false;
    }
    if (this.model.tipo === TipoMovimentoEnum.RECEITA && !ValidationUtils.required(this.model.naturezaReceita)) {
      this.alertService.warning('Selecione a natureza da receita.');
      return false;
    }
    return true;
  }

  onTipoChange(tipo: TipoMovimentoEnum): void {
    if (tipo === TipoMovimentoEnum.DESPESA) this.model.naturezaReceita = undefined;
  }

  private setInitialModel(): void {
    this.model = { nome: '', ativo: true } as CategoriaCreateDTO;
  }

}
