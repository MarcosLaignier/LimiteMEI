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
            path: 'mei/obrigacoes',
            loadComponent: () =>
              import('./pages/mei/obrigacao-mei-list.component').then((m) => m.ObrigacaoMeiListComponent),
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
        pathMatch: 'full',
        redirectTo: 'relatorios/fluxo-caixa',
      },
      {
        path: 'relatorios/fluxo-caixa',
        canActivate: [empresaAtivaGuard],
        loadComponent: () =>
          import('./pages/relatorios/fluxo-caixa-relatorio.component').then((m) => m.FluxoCaixaRelatorioComponent),
      },
      {
        path: 'relatorios/lancamentos',
        canActivate: [empresaAtivaGuard],
        loadComponent: () =>
          import('./pages/relatorios/relatorio-lancamentos.component').then((m) => m.RelatorioLancamentosComponent),
        data: { relatorioTipo: 'lancamentos' },
      },
      {
        path: 'relatorios/contas-receber',
        canActivate: [empresaAtivaGuard],
        loadComponent: () =>
          import('./pages/relatorios/relatorio-lancamentos.component').then((m) => m.RelatorioLancamentosComponent),
        data: { relatorioTipo: 'contas-receber' },
      },
      {
        path: 'relatorios/contas-pagar',
        canActivate: [empresaAtivaGuard],
        loadComponent: () =>
          import('./pages/relatorios/relatorio-lancamentos.component').then((m) => m.RelatorioLancamentosComponent),
        data: { relatorioTipo: 'contas-pagar' },
      },
      {
        path: 'relatorios/documentos-fiscais',
        canActivate: [empresaAtivaGuard],
        loadComponent: () =>
          import('./pages/relatorios/relatorio-documentos-fiscais.component').then((m) => m.RelatorioDocumentosFiscaisComponent),
      },
      {
        path: 'relatorios/clientes',
        canActivate: [empresaAtivaGuard],
        loadComponent: () =>
          import('./pages/relatorios/relatorio-pessoas.component').then((m) => m.RelatorioPessoasComponent),
        data: { papel: 'CLIENTE' },
      },
      {
        path: 'relatorios/fornecedores',
        canActivate: [empresaAtivaGuard],
        loadComponent: () =>
          import('./pages/relatorios/relatorio-pessoas.component').then((m) => m.RelatorioPessoasComponent),
        data: { papel: 'FORNECEDOR' },
      },
      {
        path: 'relatorios/apuracao-anual',
        canActivate: [empresaAtivaGuard],
        loadComponent: () =>
          import('./pages/relatorios/relatorio-apuracao-anual.component').then((m) => m.RelatorioApuracaoAnualComponent),
      },
      {
        path: 'relatorios/resumo-financeiro',
        canActivate: [empresaAtivaGuard],
        loadComponent: () =>
          import('./pages/relatorios/relatorio-resumo-financeiro.component').then((m) => m.RelatorioResumoFinanceiroComponent),
      },
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
    ],
  },
  { path: '**', redirectTo: '' },
];
