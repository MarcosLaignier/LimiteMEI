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
            path: 'lancamentos/grupo/:tipo/:id',
            loadComponent: () =>
              import('./pages/financeiro/grupo-lancamento/grupo-lancamento.component').then(
                (m) => m.GrupoLancamentoComponent,
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
            path: 'movimentacoes',
            loadComponent: () =>
              import('./pages/financeiro/movimento-financeiro/movimento-financeiro.component').then(
                (m) => m.MovimentoFinanceiroComponent,
              ),
          },
          {
            path: 'mei/apuracao',
            loadComponent: () =>
              import('./pages/mei/apuracao-mei.component').then((m) => m.ApuracaoMeiComponent),
          },
          {
            path: 'mei/relatorio/:ano/:mes',
            loadComponent: () =>
              import('./pages/mei/relatorio-mensal-mei.component').then((m) => m.RelatorioMensalMeiComponent),
          },
          {
            path: 'mei/historico',
            loadComponent: () =>
              import('./pages/mei/historico-apuracao-mei.component').then((m) => m.HistoricoApuracaoMeiComponent),
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
      {
        path: 'fiscal/documentos',
        canActivate: [empresaAtivaGuard],
        loadComponent: () => import('./pages/fiscal/documento-fiscal-list.component').then(m => m.DocumentoFiscalListComponent),
      },
      {
        path: 'fiscal/documentos/create',
        canActivate: [empresaAtivaGuard],
        loadComponent: () => import('./pages/fiscal/documento-fiscal-form.component').then(m => m.DocumentoFiscalFormComponent),
      },
      {
        path: 'fiscal/documentos/editar/:id',
        canActivate: [empresaAtivaGuard],
        loadComponent: () => import('./pages/fiscal/documento-fiscal-form.component').then(m => m.DocumentoFiscalFormComponent),
      },
      {
        path: 'configuracoes',
        canActivate: [empresaAtivaGuard],
        loadComponent: () =>
          import('./pages/configuracoes/configuracoes.component').then((m) => m.ConfiguracoesComponent),
      },
      {
        path: 'relatorios',
        canActivate: [empresaAtivaGuard],
        loadComponent: () =>
          import('./pages/relatorios/relatorios.component').then((m) => m.RelatoriosComponent),
      },
      {
        path: 'relatorios/fluxo-caixa',
        canActivate: [empresaAtivaGuard],
        loadComponent: () =>
          import('./pages/relatorios/fluxo-caixa-relatorio.component').then((m) => m.FluxoCaixaRelatorioComponent),
      },
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
    ],
  },
  { path: '**', redirectTo: '' },
];
