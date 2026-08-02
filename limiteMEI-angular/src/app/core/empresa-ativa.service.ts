import { Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { EmpresaDTO } from '../dtos/empresa/empresa.dto';
import { EmpresaService } from '../services/empresa.service';
import { AuthService } from './auth.service';

export type EmpresaLoginDestination =
  | '/app/dashboard'
  | '/app/selecionar-empresa'
  | '/app/cadastros/empresa/create?onboarding=true';

@Injectable({ providedIn: 'root' })
export class EmpresaAtivaService {
  readonly empresa = signal<EmpresaDTO | null>(this.readStoredCompany());
  readonly empresas = signal<EmpresaDTO[]>([]);

  constructor(private empresaService: EmpresaService, private auth: AuthService) {}

  carregarEmpresas(): Observable<EmpresaDTO[]> {
    return this.empresaService.getAll().pipe(
      map(response => response.body ?? []),
      tap(empresas => this.empresas.set(empresas))
    );
  }

  resolverAposLogin(): Observable<EmpresaLoginDestination> {
    return this.carregarEmpresas().pipe(
      map(empresas => {
        if (empresas.length === 0) {
          this.limpar();
          return '/app/cadastros/empresa/create?onboarding=true';
        }

        if (empresas.length === 1) {
          this.selecionar(empresas[0]);
          return '/app/dashboard';
        }

        this.limpar();
        return '/app/selecionar-empresa';
      })
    );
  }

  selecionar(empresa: EmpresaDTO): void {
    this.empresa.set(empresa);
    localStorage.setItem(this.storageKey(), JSON.stringify(empresa));
  }

  atualizarSeAtiva(empresa: EmpresaDTO): void {
    if (this.empresa()?.id === empresa.id) {
      this.selecionar(empresa);
    }
  }

  limpar(): void {
    this.empresa.set(null);
    localStorage.removeItem(this.storageKey());
  }

  possuiEmpresaAtiva(): boolean {
    return !!this.empresa();
  }

  private readStoredCompany(): EmpresaDTO | null {
    const currentUser = localStorage.getItem('limitemei_user');
    if (!currentUser) return null;

    try {
      const email = JSON.parse(currentUser)?.email ?? 'anonymous';
      const stored = localStorage.getItem(`limitemei_empresa_ativa_${email}`);
      return stored ? JSON.parse(stored) as EmpresaDTO : null;
    } catch {
      return null;
    }
  }

  private storageKey(): string {
    return `limitemei_empresa_ativa_${this.auth.user()?.email ?? 'anonymous'}`;
  }
}
