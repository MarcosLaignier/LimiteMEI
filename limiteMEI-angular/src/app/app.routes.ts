import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { empresaAtivaGuard } from './core/empresa-ativa.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/private-layout.component').then((m) => m.PrivateLayoutComponent),
    children: [
      {
        path: 'dashboard',
        canActivate: [empresaAtivaGuard],
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'inicio',
        loadComponent: () =>
          import('./pages/empresa-context/empresa-start.component').then(
            (m) => m.EmpresaStartComponent,
          ),
      },
      {
        path: 'selecionar-empresa',
        loadComponent: () =>
          import('./pages/empresa-context/empresa-select.component').then(
            (m) => m.EmpresaSelectComponent,
          ),
      },
      {
        path: 'cadastros',
        loadChildren: () =>
          import('./pages/cadastros/cadastros.routes').then((m) => m.CADASTROS_ROUTES),
      },
      {
        path: 'financeiro',
        canActivate: [empresaAtivaGuard],
        children: [
          {
            path: 'lancamentos',
            loadComponent: () =>
              import('./pages/financeiro/lancamento-financeiro-list.component').then(
                (m) => m.LancamentoFinanceiroListComponent,
              ),
          },
          {
            path: 'monitor-lancamentos',
            loadComponent: () =>
              import('./pages/financeiro/lancamento-financeiro.component').then(
                (m) => m.LancamentoFinanceiroComponent,
              ),
          },
          {
            path: 'lancamentos/create',
            loadComponent: () =>
              import('./pages/financeiro/lancamento-financeiro-form.component').then(
                (m) => m.LancamentoFinanceiroFormComponent,
              ),
          },
          {
            path: 'lancamentos/editar/:id',
            loadComponent: () =>
              import('./pages/financeiro/lancamento-financeiro-form.component').then(
                (m) => m.LancamentoFinanceiroFormComponent,
              ),
          },
          {
            path: 'contas',
            loadComponent: () =>
              import('./pages/financeiro/conta-financeira/conta-financeira.component').then(
                (m) => m.ContaFinanceiraComponent,
              ),
          },
          {
            path: 'contas/create',
            loadComponent: () =>
              import('./pages/financeiro/conta-financeira/conta-financeira-form.component').then(
                (m) => m.ContaFinanceiraFormComponent,
              ),
          },
          {
            path: 'contas/editar/:id',
            loadComponent: () =>
              import('./pages/financeiro/conta-financeira/conta-financeira-form.component').then(
                (m) => m.ContaFinanceiraFormComponent,
              ),
          },
        ],
      },
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
    ],
  },
  { path: '**', redirectTo: '' },
];
