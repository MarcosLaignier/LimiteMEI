import {Routes} from "@angular/router";

export const CADASTROS_ROUTES: Routes = [
  // {
  //   path: 'empresa',
  //   children: [
  //     {path: '', loadComponent: () => import('./empresa-component/empresa.component').then(c => c.EmpresaComponent)},
  //     {path: 'editar/:id', loadComponent: () => import('./empresa-component/empresa.component').then(c => c.EmpresaComponent)}
  //   ]
  // },

  {
    path: 'categoria',
    children: [
      {path: '', loadComponent: () => import('./categoria-component/categoria.component').then(c => c.CategoriaComponent)},
       {path: 'create', loadComponent: () => import('./categoria-component/categoria-form-component/categoria.form.component').then(c => c.CategoriaFormComponent)},
       {path: 'editar/:id', loadComponent: () => import('./categoria-component/categoria-form-component/categoria.form.component').then(c => c.CategoriaFormComponent)}
    ]
  },

];
