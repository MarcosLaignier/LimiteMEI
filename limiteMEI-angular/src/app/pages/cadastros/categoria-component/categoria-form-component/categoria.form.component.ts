import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CategoriaService } from '../../../../services/categoria.service';
import { ToolbarComponent } from '../../../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';
import { BaseFormCrud } from '../../../../shared/components-commons/core/base.form.crud';

import { CategoriaDTO } from '../../../../dtos/categoria/categoria.dto';
import { CategoriaCreateDTO } from '../../../../dtos/categoria/categoria.create.dto';

import { TextAreaComponent } from '../../../../shared/components-commons/infra/text-area-component/text.area.component';
import { TextBoxComponent } from '../../../../shared/components-commons/infra/text-box-component/text.box.component';

@Component({
  selector: 'categoria-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ToolbarComponent,
    TextAreaComponent,
    TextBoxComponent
  ],
  templateUrl: './categoria.form.component.html'
})
export class CategoriaFormComponent
  extends BaseFormCrud<CategoriaDTO, CategoriaCreateDTO>
  implements OnInit {

  protected service: CategoriaService;

  protected routeBase = '/cadastros/categoria';

  constructor(
    service: CategoriaService,
    router: Router,
    route: ActivatedRoute
  ) {
    super(router, route);
    this.service = service;

    /** garante model inicializado */
    this.model = {} as CategoriaCreateDTO;
  }

  ngOnInit(): void {
    this.initForm();
  }

}
