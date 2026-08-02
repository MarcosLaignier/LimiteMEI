import {ChangeDetectorRef, Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PessoaDTO} from '../../../dtos/pessoa/pessoa.dto';
import {PapelPessoaEnum} from '../../../enums/papel.pessoa.enum';
import {PessoaPapelService} from '../../../services/pessoa-papel.service';
import {ToolbarComponent} from '../../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';
import {GridComponent} from '../../../shared/components-commons/infra/grid-column-component/grid.component';

@Component({
  standalone: true,
  imports: [ToolbarComponent, GridComponent],
  templateUrl: './pessoa-papel.component.html'
})
export class PessoaPapelComponent {
  PessoaDTO = PessoaDTO;
  dataSource: PessoaDTO[] = [];
  loading = false;
  titulo = '';
  papel!: PapelPessoaEnum;

  constructor(
    private service: PessoaPapelService,
    private route: ActivatedRoute,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.titulo = this.route.snapshot.data['titulo'];
    this.papel = this.route.snapshot.data['papel'];
    this.load();
  }

  load(): void {
    this.loading = true;
    this.service.listar(this.papel).subscribe({
      next: response => {
        this.dataSource = response.body ?? [];
        this.loading = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.dataSource = [];
        this.loading = false;
        this.changeDetector.detectChanges();
      }
    });
  }

  novo(): void {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  editar(row: PessoaDTO): void {
    this.router.navigate(['/app/cadastros/pessoa/editar', row.id]);
  }
}
