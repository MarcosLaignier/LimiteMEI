import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MonthYearBoxComponent } from '../../shared/components-commons/infra/month-year-box-component/month.year.box.component';
import { ToolbarComponent } from '../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';
import { ReportViewComponent } from '../../shared/components-commons/relatorio/report-view.component';
import { ReportColumn, ReportRow, ReportTotal } from '../../shared/components-commons/relatorio/report.types';
import { competenciaAtual } from '../../shared/components-commons/relatorio/report-period.utils';
import { DashboardService } from '../../services/dashboard.service';
import { AlertService } from '../../shared/components-commons/infra/alert-component/alert.service';

@Component({
  standalone: true,
  imports: [CommonModule, ToolbarComponent, MonthYearBoxComponent, ReportViewComponent],
  template: `
    <toolbar-filter tituloPagina="Resumo financeiro mensal" [listMode]="true" [showNew]="false" [loading]="loading" (filtrar)="carregar()" (limpar)="limparFiltros()" />
    <section class="filters">
      <header><span>FILTROS</span><h1>Resumo financeiro mensal</h1><p>Indicadores financeiros consolidados por competência.</p></header>
      <div class="filter-row">
        <month-year-box-component label="Competência" width="210px" [(dataField)]="competencia" />
      </div>
    </section>
    <report-view [loading]="loading" titulo="Resumo financeiro mensal" [subtitulo]="subtitulo" fileName="resumo-financeiro-mensal" [colunas]="colunas" [linhas]="linhas" [totalizadores]="totalizadores" />
  `,
  styles: [`
    .filters{margin:1rem 0;padding:1.25rem;background:#fff;border:1px solid #e5e9ef;border-radius:12px}
    header{margin-bottom:1rem}header span{font-size:.75rem;color:#5570f1;font-weight:800}h1{margin:.2rem 0;color:#203746;font-size:1.25rem}p{margin:0;color:#687080}.filter-row{display:flex;align-items:end;flex-wrap:wrap;gap:15px}
  `]
})
export class RelatorioResumoFinanceiroComponent implements OnInit {
  competencia = competenciaAtual();
  loading = false;
  subtitulo = '';
  linhas: ReportRow[] = [];
  totalizadores: ReportTotal[] = [];
  readonly colunas: ReportColumn[] = [{ key: 'indicador', label: 'Indicador' }, { key: 'valor', label: 'Valor', tipo: 'currency' }];

  constructor(private route: ActivatedRoute, private service: DashboardService, private alerts: AlertService,
              private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    this.competencia = this.route.snapshot.queryParamMap.get('competencia') ?? this.competencia;
    this.carregar();
  }

  limparFiltros() {
    this.competencia = competenciaAtual();
    this.carregar();
  }

  carregar() {
    const [ano, mes] = (this.competencia || competenciaAtual()).split('-').map(Number);
    this.loading = true;
    this.service.carregar(ano, mes).subscribe({
      next: r => {
        this.subtitulo = `Competência ${String(mes).padStart(2, '0')}/${ano}`;
        this.linhas = [
          { indicador: 'Saldo total', valor: r.saldoTotal },
          { indicador: 'Entradas no mês', valor: r.entradasMes },
          { indicador: 'Saídas no mês', valor: r.saidasMes },
          { indicador: 'Contas a receber', valor: r.contasReceber },
          { indicador: 'Contas a pagar', valor: r.contasPagar },
          { indicador: 'Vencido a receber', valor: r.vencidoReceber },
          { indicador: 'Vencido a pagar', valor: r.vencidoPagar },
        ];
        this.totalizadores = [
          { label: 'Saldo total', valor: r.saldoTotal, currency: true },
          { label: 'Resultado do mês', valor: r.entradasMes - r.saidasMes, currency: true },
          { label: 'Vencidos', valor: r.quantidadeVencidos },
        ];
        this.loading = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.alerts.error('Não foi possível carregar o resumo financeiro.');
        this.changeDetector.detectChanges();
      },
    });
  }
}
