import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { empresaAtivaGuard } from './core/empresa-ativa.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/private-layout.component').then(m => m.PrivateLayoutComponent),
    children: [
      {
        path: 'dashboard',
        canActivate: [empresaAtivaGuard],
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'inicio',
        loadComponent: () => import('./pages/empresa-context/empresa-start.component').then(m => m.EmpresaStartComponent)
      },
      {
        path: 'selecionar-empresa',
        loadComponent: () => import('./pages/empresa-context/empresa-select.component').then(m => m.EmpresaSelectComponent)
      },
      {
        path: 'cadastros',
        loadChildren: () => import('./pages/cadastros/cadastros.routes').then(m => m.CADASTROS_ROUTES)
      },
      { path: '', pathMatch: 'full', redirectTo: 'inicio' }
    ]
  },
  { path: '**', redirectTo: '' }
];
