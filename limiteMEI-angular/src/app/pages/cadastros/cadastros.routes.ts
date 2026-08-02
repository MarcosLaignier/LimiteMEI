import {Routes} from "@angular/router";
import {empresaAtivaGuard} from '../../core/empresa-ativa.guard';

export const CADASTROS_ROUTES: Routes = [
  {
    path: 'empresa',
    children: [
      {path: '', loadComponent: () => import('./empresa-component/empresa.component').then(c => c.EmpresaComponent)},
      {path: 'create', loadComponent: () => import('./empresa-component/empresa-form-component/empresa.form.component').then(c => c.EmpresaFormComponent)},
      {path: 'editar/:id', loadComponent: () => import('./empresa-component/empresa-form-component/empresa.form.component').then(c => c.EmpresaFormComponent)}
    ]
  },

  {
    path: 'categoria',
    canActivate: [empresaAtivaGuard],
    children: [
      {path: '', loadComponent: () => import('./categoria-component/categoria.component').then(c => c.CategoriaComponent)},
       {path: 'create', loadComponent: () => import('./categoria-component/categoria-form-component/categoria.form.component').then(c => c.CategoriaFormComponent)},
       {path: 'editar/:id', loadComponent: () => import('./categoria-component/categoria-form-component/categoria.form.component').then(c => c.CategoriaFormComponent)}
    ]
  },

];
