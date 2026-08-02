import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const token = auth.token();
  const empresaAtiva = readEmpresaAtivaId(auth.user()?.email);
  const authenticatedRequest = token
    ? request.clone({ setHeaders: {
        Authorization: `Bearer ${token}`,
        ...(empresaAtiva ? { 'X-Empresa-Id': String(empresaAtiva) } : {})
      } })
    : request;

  return next(authenticatedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !request.url.includes('/auth/login')) {
        auth.logout();
      }
      return throwError(() => error);
    })
  );
};

function readEmpresaAtivaId(email?: string): number | null {
  if (!email) return null;
  try {
    return JSON.parse(localStorage.getItem(`limitemei_empresa_ativa_${email}`) ?? 'null')?.id ?? null;
  } catch {
    return null;
  }
}
