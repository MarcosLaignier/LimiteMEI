import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { EmpresaAtivaService } from './empresa-ativa.service';

export const empresaAtivaGuard: CanActivateFn = (_, state) => {
  const empresaAtiva = inject(EmpresaAtivaService);
  const router = inject(Router);

  return empresaAtiva.possuiEmpresaAtiva()
    ? true
    : router.createUrlTree(['/app/inicio'], { queryParams: { returnUrl: state.url } });
};
