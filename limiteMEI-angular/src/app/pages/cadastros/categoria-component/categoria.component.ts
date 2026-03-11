import {Component} from '@angular/core';
import {BaseListCrud} from '../../../shared/components-commons/core/base.list.crud';
import {CategoriaDTO} from '../../../dtos/categoria/categoria.dto';
import {CategoriaCreateDTO} from '../../../dtos/categoria/categoria.create.dto';
import {CategoriaService} from '../../../services/categoria.service';
import {ToolbarComponent} from '../../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';
import {ActivatedRoute, Router} from '@angular/router';
import {GridComponent} from '../../../shared/components-commons/infra/grid-column-component/grid.component';

@Component({
  selector: 'categoria-component',
  imports: [
    ToolbarComponent,
    GridComponent
  ],
  templateUrl: './categoria.component.html',
  standalone: true
})
export class CategoriaComponent extends BaseListCrud<CategoriaDTO, CategoriaCreateDTO> {

  CategoriaDTO = CategoriaDTO;

  protected service: CategoriaService;
  protected routeBase = '/cadastros/categoria';

  constructor(service: CategoriaService, router: Router, route: ActivatedRoute) {
    super(router);
    this.service = service;
  }

  ngOnInit() {
    this.load();
  }

}
