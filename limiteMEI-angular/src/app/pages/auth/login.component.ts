import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { EmpresaAtivaService } from '../../core/empresa-ativa.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  registerMode = false;
  loading = false;
  error = '';
  nome = '';
  email = '';
  senha = '';

  constructor(private auth: AuthService, private empresaAtiva: EmpresaAtivaService,
              private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) this.router.navigate(['/app/inicio']);
    this.registerMode = this.route.snapshot.queryParamMap.get('cadastro') === 'true';
  }

  submit(): void {
    this.error = '';
    if (!this.email || !this.senha || (this.registerMode && !this.nome)) {
      this.error = 'Preencha todos os campos para continuar.';
      return;
    }
    this.loading = true;
    const request$ = this.registerMode
      ? this.auth.register({ nome: this.nome, email: this.email, senha: this.senha })
      : this.auth.login(this.email, this.senha);

    request$.pipe(finalize(() => this.loading = false)).subscribe({
      next: () => this.empresaAtiva.resolverAposLogin().subscribe({
        next: destination => {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          if (destination === '/app/selecionar-empresa' && returnUrl) {
            this.router.navigate(['/app/selecionar-empresa'], { queryParams: { returnUrl } });
            return;
          }
          const target = destination === '/app/dashboard' && returnUrl ? returnUrl : destination;
          this.router.navigateByUrl(target);
        },
        error: () => this.error = 'Não foi possível carregar suas empresas.'
      }),
      error: error => this.error = error.error?.messages?.[0] || 'Não foi possível entrar. Verifique os dados informados.'
    });
  }

  toggleMode(): void {
    this.registerMode = !this.registerMode;
    this.error = '';
  }
}
