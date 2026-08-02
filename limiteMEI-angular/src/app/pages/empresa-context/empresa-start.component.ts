import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresaAtivaService } from '../../core/empresa-ativa.service';

@Component({
  standalone: true,
  template: `
    <div class="context-loading">
      <span class="spinner-border text-success" aria-hidden="true"></span>
      <h1>Preparando sua empresa</h1>
      <p>Estamos carregando o seu ambiente de gestão.</p>
    </div>
  `,
  styles: [`
    .context-loading { min-height: 60vh; display: grid; place-items: center; align-content: center; text-align: center; }
    h1 { margin: 1rem 0 .25rem; color: #17384a; font-size: 1.35rem; font-weight: 800; }
    p { color: #718493; }
  `]
})
export class EmpresaStartComponent implements OnInit {
  constructor(private context: EmpresaAtivaService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.context.resolverAposLogin().subscribe({
      next: destination => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        if (destination === '/app/selecionar-empresa' && returnUrl) {
          this.router.navigate(['/app/selecionar-empresa'], { queryParams: { returnUrl } });
          return;
        }
        const target = destination === '/app/dashboard' && returnUrl ? returnUrl : destination;
        this.router.navigateByUrl(target);
      },
      error: () => this.router.navigate(['/login'])
    });
  }
}
