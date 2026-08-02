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
  { path:'pessoa', canActivate:[empresaAtivaGuard], children:[
    {path:'',loadComponent:()=>import('./pessoa-component/pessoa.component').then(c=>c.PessoaComponent)},
    {path:'create',loadComponent:()=>import('./pessoa-component/pessoa-form-component/pessoa.form.component').then(c=>c.PessoaFormComponent)},
    {path:'editar/:id',loadComponent:()=>import('./pessoa-component/pessoa-form-component/pessoa.form.component').then(c=>c.PessoaFormComponent)}]},
  { path:'cliente', canActivate:[empresaAtivaGuard], data:{papel:'CLIENTE',titulo:'Clientes'}, children:[
    {path:'',data:{papel:'CLIENTE',titulo:'Clientes'},loadComponent:()=>import('./pessoa-papel-component/pessoa-papel.component').then(c=>c.PessoaPapelComponent)},
    {path:'create',data:{papel:'CLIENTE',singular:'Cliente'},loadComponent:()=>import('./pessoa-papel-component/pessoa-papel-form.component').then(c=>c.PessoaPapelFormComponent)}]},
  { path:'fornecedor', canActivate:[empresaAtivaGuard], data:{papel:'FORNECEDOR',titulo:'Fornecedores'}, children:[
    {path:'',data:{papel:'FORNECEDOR',titulo:'Fornecedores'},loadComponent:()=>import('./pessoa-papel-component/pessoa-papel.component').then(c=>c.PessoaPapelComponent)},
    {path:'create',data:{papel:'FORNECEDOR',singular:'Fornecedor'},loadComponent:()=>import('./pessoa-papel-component/pessoa-papel-form.component').then(c=>c.PessoaPapelFormComponent)}]},
  { path:'funcionario', canActivate:[empresaAtivaGuard], children:[
    {path:'',loadComponent:()=>import('./funcionario-component/funcionario.component').then(c=>c.FuncionarioComponent)},
    {path:'create',loadComponent:()=>import('./funcionario-component/funcionario-form-component/funcionario.form.component').then(c=>c.FuncionarioFormComponent)},
    {path:'editar/:id',loadComponent:()=>import('./funcionario-component/funcionario-form-component/funcionario.form.component').then(c=>c.FuncionarioFormComponent)}]},

];
