import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmpresaAtivaService } from '../../core/empresa-ativa.service';
import { EmpresaDTO } from '../../dtos/empresa/empresa.dto';
import { BadgeComponent } from '../../shared/components-commons/infra/badge-component/badge.component';
import { TIPO_EMPRESA_LABELS } from '../../enums/tipo.empresa.enum';

@Component({
  standalone: true,
  imports: [RouterLink, BadgeComponent],
  templateUrl: './empresa-select.component.html',
  styleUrl: './empresa-select.component.scss'
})
export class EmpresaSelectComponent implements OnInit {
  loading = true;
  protected readonly tipoEmpresaLabels = TIPO_EMPRESA_LABELS;

  constructor(public context: EmpresaAtivaService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.context.carregarEmpresas().subscribe({
      next: empresas => {
        this.loading = false;
        if (empresas.length === 0) {
          this.router.navigateByUrl('/app/cadastros/empresa/create?onboarding=true');
        }
      },
      error: () => this.loading = false
    });
  }

  selecionar(empresa: EmpresaDTO): void {
    this.context.selecionar(empresa);
    this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('returnUrl') || '/app/dashboard');
  }

  tipoLabel(empresa: EmpresaDTO): string {
    return this.tipoEmpresaLabels[empresa.tipoEmpresa] ?? empresa.tipoEmpresa;
  }
}
