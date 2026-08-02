import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

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
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'cadastros',
        loadChildren: () => import('./pages/cadastros/cadastros.routes').then(m => m.CADASTROS_ROUTES)
      },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
    ]
  },
  { path: '**', redirectTo: '' }
];
