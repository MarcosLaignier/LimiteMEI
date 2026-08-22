import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ContaFinanceiraSelectorComponent } from '../../shared/components-commons/conta-financeira-selector-component/conta-financeira.selector.component';
import { DateBoxComponent } from '../../shared/components-commons/infra/date-box-component/date.box.component';
import { MonthYearBoxComponent } from '../../shared/components-commons/infra/month-year-box-component/month.year.box.component';
import { ToolbarComponent } from '../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';
import { AlertService } from '../../shared/components-commons/infra/alert-component/alert.service';

type AbaRelatorio = 'financeiro' | 'fiscal' | 'pessoas' | 'mei';
type ModoRelatorio = 'periodo' | 'competencia' | 'cadastro' | 'fluxo' | 'mei-mensal';

interface RelatorioCentral {
  tipo: string;
  aba: AbaRelatorio;
  grupo: string;
  titulo: string;
  descricao: string;
  icone: string;
  modo: ModoRelatorio;
  filtro: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, ToolbarComponent, MonthYearBoxComponent, DateBoxComponent, ContaFinanceiraSelectorComponent],
  template: `
    <toolbar-filter
      tituloPagina="Relatórios"
      [listMode]="true"
      [showNew]="false"
      [loading]="false"
      (filtrar)="abrirRelatorioPadrao()"
      (limpar)="periodoAtual()" />

    <section class="page">
      <header class="page-header">
        <div>
          <span>RELATÓRIOS</span>
          <h1>Central de relatórios</h1>
          <p>Use os filtros uma vez e gere os relatórios por área.</p>
        </div>
      </header>

      <section class="filter-panel">
        <div class="filter-title">
          <i class="bi bi-funnel"></i>
          <div>
            <strong>Filtros principais</strong>
            <small>Competência define automaticamente o período do mês. As datas continuam editáveis para relatórios por data.</small>
          </div>
        </div>

        <div class="filter-fields">
          <month-year-box-component
            label="Competência"
            width="210px"
            [(dataField)]="competenciaMei"
            (dataFieldChange)="atualizarPeriodoPorCompetencia($event)" />
          <date-box-component label="Data inicial" width="180px" [clearButton]="true" [(dataField)]="inicioFluxo" />
          <date-box-component label="Data final" width="180px" [clearButton]="true" [(dataField)]="fimFluxo" />
          <conta-financeira-selector-component label="Conta financeira" width="375px" [(dataField)]="contaFluxoId" />
        </div>
      </section>

      <nav class="report-tabs" aria-label="Categorias de relatórios">
        @for(aba of abas; track aba.id) {
          <button type="button" [class.active]="abaAtiva === aba.id" (click)="selecionarAba(aba.id)">
            <i [class]="'bi ' + aba.icone"></i>
            <span>{{aba.label}}</span>
          </button>
        }
      </nav>

      <section class="report-list">
        @for(relatorio of relatoriosDaAba(); track relatorio.tipo) {
          <article>
            <div class="report-icon">
              <i [class]="relatorio.icone"></i>
            </div>
            <div class="report-content">
              <span>{{relatorio.grupo}}</span>
              <h2>{{relatorio.titulo}}</h2>
              <p>{{relatorio.descricao}}</p>
              <small class="filter-badge"><i class="bi bi-sliders"></i>{{relatorio.filtro}}</small>
            </div>
            <div class="report-actions">
              <button type="button" (click)="abrirRelatorio(relatorio)">
                <i class="bi bi-printer"></i>
                <span>Visualizar</span>
              </button>
            </div>
          </article>
        }
      </section>
    </section>
  `,
  styles: [`
    .page{margin-top:1rem;padding:1.5rem;background:#fff;border:1px solid #e5e9ef;border-radius:12px}
    .page-header{display:flex;justify-content:space-between;gap:1rem;margin-bottom:1.2rem}
    .page-header span,.report-content span{font-size:.75rem;color:#5570f1;font-weight:800;letter-spacing:.02em}
    h1{margin:.2rem 0;color:#203746;font-size:1.45rem}
    h2{margin:.15rem 0;color:#203746;font-size:1rem}
    p{margin:0;color:#687080}
    .filter-panel{margin-bottom:1rem;padding:1rem;border:1px solid #e7ebf2;border-radius:10px;background:#f8f9fc}
    .filter-title{display:flex;align-items:center;gap:.7rem;margin-bottom:.85rem;color:#203746}
    .filter-title i{display:grid;place-items:center;width:34px;height:34px;border-radius:8px;background:#eef1ff;color:#5570f1}
    .filter-title strong{display:block;font-size:.95rem}.filter-title small{color:#687080}
    .filter-fields{display:flex;align-items:end;flex-wrap:wrap;gap:15px}
    .report-tabs{display:flex;gap:.5rem;margin:0 0 1rem;border-bottom:1px solid #e1e6ef;overflow:auto}
    .report-tabs button{display:flex;align-items:center;gap:.45rem;margin-bottom:-1px;padding:.75rem .95rem;border:0;border-bottom:2px solid transparent;background:transparent;color:#667085;font-weight:700;white-space:nowrap}
    .report-tabs button.active{border-color:#5570f1;color:#5570f1;background:#f8f9ff}
    .report-list{display:grid;gap:.65rem;max-width:1040px}
    article{display:grid;grid-template-columns:44px minmax(0,1fr) auto;align-items:center;gap:1rem;padding:.85rem 1rem;border:1px solid #e1e6ef;border-radius:10px;background:#fff;transition:border-color .15s,box-shadow .15s}
    article:hover{border-color:#cfd7ef;box-shadow:0 8px 20px #20374612}
    .report-icon{display:grid;place-items:center;width:44px;height:44px;border-radius:8px;background:#eef1ff;color:#5570f1;font-size:1.15rem}
    .report-content p{font-size:.9rem}.filter-badge{display:inline-flex;align-items:center;gap:.35rem;margin-top:.45rem;padding:.22rem .48rem;border-radius:999px;background:#f1f4f9;color:#5f6f82;font-size:.72rem;font-weight:700}
    .report-actions{display:flex;justify-content:flex-end}
    .report-actions button{display:flex;align-items:center;gap:.45rem;height:36px;padding:0 .85rem;border:1px solid #5570f1;border-radius:6px;background:#5570f1;color:#fff;font-weight:700}
    @media(max-width:760px){article{grid-template-columns:44px minmax(0,1fr)}.report-actions{grid-column:1/-1;justify-content:flex-start}.filter-fields>*{width:100%}}
  `]
})
export class RelatoriosComponent {
  competenciaMei = '';
  inicioFluxo = '';
  fimFluxo = '';
  contaFluxoId?: number;
  abaAtiva: AbaRelatorio = 'financeiro';

  readonly abas: { id: AbaRelatorio; label: string; icone: string }[] = [
    { id: 'financeiro', label: 'Financeiro', icone: 'bi-cash-coin' },
    { id: 'fiscal', label: 'Fiscal', icone: 'bi-receipt' },
    { id: 'pessoas', label: 'Pessoas', icone: 'bi-people' },
    { id: 'mei', label: 'MEI', icone: 'bi-speedometer2' },
  ];

  readonly relatorios: RelatorioCentral[] = [
    {
      tipo: 'fluxo-caixa',
      aba: 'financeiro',
      grupo: 'FINANCEIRO',
      titulo: 'Fluxo de caixa / extrato por conta',
      descricao: 'Entradas, saídas e saldo por período, com filtro opcional por conta financeira.',
      icone: 'bi bi-cash-coin',
      modo: 'fluxo',
      filtro: 'Competência + conta',
    },
    {
      tipo: 'lancamentos',
      aba: 'financeiro',
      grupo: 'FINANCEIRO',
      titulo: 'Lançamentos financeiros',
      descricao: 'Relação de lançamentos com categoria, pessoa, situação, valor, liquidado e saldo.',
      icone: 'bi bi-list-check',
      modo: 'periodo',
      filtro: 'Data',
    },
    {
      tipo: 'contas-receber',
      aba: 'financeiro',
      grupo: 'FINANCEIRO',
      titulo: 'Contas a receber',
      descricao: 'Lançamentos de entrada, baixados ou em aberto, dentro do período informado.',
      icone: 'bi bi-arrow-down-circle',
      modo: 'periodo',
      filtro: 'Data',
    },
    {
      tipo: 'contas-pagar',
      aba: 'financeiro',
      grupo: 'FINANCEIRO',
      titulo: 'Contas a pagar',
      descricao: 'Lançamentos de saída, baixados ou em aberto, dentro do período informado.',
      icone: 'bi bi-arrow-up-circle',
      modo: 'periodo',
      filtro: 'Data',
    },
    {
      tipo: 'resumo-financeiro',
      aba: 'financeiro',
      grupo: 'DASHBOARD',
      titulo: 'Resumo financeiro mensal',
      descricao: 'Indicadores mensais de saldo, entradas, saídas, contas a receber e contas a pagar.',
      icone: 'bi bi-bar-chart',
      modo: 'competencia',
      filtro: 'Competência',
    },
    {
      tipo: 'documentos-fiscais',
      aba: 'fiscal',
      grupo: 'FISCAL',
      titulo: 'Documentos fiscais',
      descricao: 'Notas emitidas, valores vinculados aos lançamentos e saldo pendente de vínculo.',
      icone: 'bi bi-receipt',
      modo: 'periodo',
      filtro: 'Data',
    },
    {
      tipo: 'clientes',
      aba: 'pessoas',
      grupo: 'PESSOAS',
      titulo: 'Clientes',
      descricao: 'Listagem de pessoas vinculadas como clientes.',
      icone: 'bi bi-person-lines-fill',
      modo: 'cadastro',
      filtro: 'Sem filtro',
    },
    {
      tipo: 'fornecedores',
      aba: 'pessoas',
      grupo: 'PESSOAS',
      titulo: 'Fornecedores',
      descricao: 'Listagem de pessoas vinculadas como fornecedores.',
      icone: 'bi bi-truck',
      modo: 'cadastro',
      filtro: 'Sem filtro',
    },
    {
      tipo: 'relatorio-mei',
      aba: 'mei',
      grupo: 'MEI',
      titulo: 'Relatório mensal de receitas brutas',
      descricao: 'Documento mensal com receitas por comércio, indústria e serviços.',
      icone: 'bi bi-file-earmark-text',
      modo: 'mei-mensal',
      filtro: 'Competência',
    },
    {
      tipo: 'apuracao-anual',
      aba: 'mei',
      grupo: 'MEI',
      titulo: 'Apuração MEI anual',
      descricao: 'Resumo anual de faturamento, acumulado e percentual de uso do teto.',
      icone: 'bi bi-speedometer2',
      modo: 'competencia',
      filtro: 'Competência',
    },
  ];

  constructor(private router: Router, private alerts: AlertService) {
    this.periodoAtual();
  }

  periodoAtual() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    this.competenciaMei = `${ano}-${String(mes + 1).padStart(2, '0')}-01`;
    this.definirPeriodoDaCompetencia(ano, mes + 1);
    this.contaFluxoId = undefined;
  }

  atualizarPeriodoPorCompetencia(competencia: string) {
    this.competenciaMei = competencia;
    const [ano, mes] = competencia.split('-').map(Number);
    if (!ano || !mes) {
      this.inicioFluxo = '';
      this.fimFluxo = '';
      return;
    }
    this.definirPeriodoDaCompetencia(ano, mes);
  }

  private definirPeriodoDaCompetencia(ano: number, mes: number) {
    this.inicioFluxo = `${ano}-${String(mes).padStart(2, '0')}-01`;
    this.fimFluxo = new Date(ano, mes, 0).toISOString().slice(0, 10);
  }

  selecionarAba(aba: AbaRelatorio) {
    this.abaAtiva = aba;
  }

  relatoriosDaAba() {
    return this.relatorios.filter(relatorio => relatorio.aba === this.abaAtiva);
  }

  abrirRelatorioPadrao() {
    const relatorio = this.relatoriosDaAba()[0];
    if (relatorio) this.abrirRelatorio(relatorio);
  }

  abrirRelatorio(relatorio: RelatorioCentral) {
    switch (relatorio.modo) {
      case 'fluxo':
        return this.abrirFluxoCaixa();
      case 'periodo':
        return this.abrirRelatorioPeriodo(relatorio.tipo);
      case 'competencia':
        return this.abrirRelatorioCompetencia(relatorio.tipo);
      case 'cadastro':
        return this.abrirRelatorioCadastro(relatorio.tipo);
      case 'mei-mensal':
        return this.abrirRelatorioMei();
    }
  }

  abrirRelatorioMei() {
    const [ano, mes] = this.competenciaMei.split('-').map(Number);
    if (!ano || !mes) {
      this.alerts.warning('Informe a competência do relatório mensal.');
      return;
    }
    this.router.navigate(['/app/financeiro/mei/relatorio', ano, mes]);
  }

  abrirFluxoCaixa() {
    if (!this.inicioFluxo || !this.fimFluxo) {
      this.alerts.warning('Informe o período do fluxo de caixa.');
      return;
    }
    this.router.navigate(['/app/relatorios/fluxo-caixa'], {
      queryParams: {
        inicio: this.inicioFluxo,
        fim: this.fimFluxo,
        contaFinanceiraId: this.contaFluxoId || undefined,
      },
    });
  }

  abrirRelatorioPeriodo(tipo: string) {
    if (!this.inicioFluxo || !this.fimFluxo) {
      this.alerts.warning('Informe o período do relatório.');
      return;
    }
    this.router.navigate(['/app/relatorios', tipo], {
      queryParams: { competencia: this.competenciaMei, inicio: this.inicioFluxo, fim: this.fimFluxo },
    });
  }

  abrirRelatorioCompetencia(tipo: string) {
    const [ano, mes] = this.competenciaMei.split('-').map(Number);
    if (!ano || !mes) {
      this.alerts.warning('Informe a competência do relatório.');
      return;
    }
    this.router.navigate(['/app/relatorios', tipo], {
      queryParams: { competencia: this.competenciaMei },
    });
  }

  abrirRelatorioCadastro(tipo: string) {
    this.router.navigate(['/app/relatorios', tipo]);
  }
}
