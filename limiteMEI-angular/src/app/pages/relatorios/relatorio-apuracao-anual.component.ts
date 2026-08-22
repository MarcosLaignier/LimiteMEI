import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MonthYearBoxComponent } from '../../shared/components-commons/infra/month-year-box-component/month.year.box.component';
import { ToolbarComponent } from '../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';
import { ReportViewComponent } from '../../shared/components-commons/relatorio/report-view.component';
import { ReportColumn, ReportRow, ReportTotal } from '../../shared/components-commons/relatorio/report.types';
import { competenciaAtual } from '../../shared/components-commons/relatorio/report-period.utils';
import { ApuracaoMeiService } from '../../services/apuracao-mei.service';
import { AlertService } from '../../shared/components-commons/infra/alert-component/alert.service';

@Component({
  standalone: true,
  imports: [CommonModule, ToolbarComponent, MonthYearBoxComponent, ReportViewComponent],
  template: `
    <toolbar-filter tituloPagina="Apuração MEI anual" [listMode]="true" [showNew]="false" [loading]="loading" (filtrar)="carregar()" (limpar)="limparFiltros()" />
    <section class="filters">
      <header><span>FILTROS</span><h1>Apuração MEI anual</h1><p>A competência define o ano da apuração.</p></header>
      <div class="filter-row">
        <month-year-box-component label="Competência" width="210px" [(dataField)]="competencia" />
      </div>
    </section>
    <report-view [loading]="loading" titulo="Apuração MEI anual" [subtitulo]="subtitulo" fileName="apuracao-mei-anual" [colunas]="colunas" [linhas]="linhas" [totalizadores]="totalizadores" />
  `,
  styles: [`
    .filters{margin:1rem 0;padding:1.25rem;background:#fff;border:1px solid #e5e9ef;border-radius:12px}
    header{margin-bottom:1rem}header span{font-size:.75rem;color:#5570f1;font-weight:800}h1{margin:.2rem 0;color:#203746;font-size:1.25rem}p{margin:0;color:#687080}.filter-row{display:flex;align-items:end;flex-wrap:wrap;gap:15px}
  `]
})
export class RelatorioApuracaoAnualComponent implements OnInit {
  competencia = competenciaAtual();
  loading = false;
  subtitulo = '';
  linhas: ReportRow[] = [];
  totalizadores: ReportTotal[] = [];
  readonly colunas: ReportColumn[] = [
    { key: 'mes', label: 'Mês' }, { key: 'situacao', label: 'Situação' },
    { key: 'total', label: 'Faturamento', tipo: 'currency' }, { key: 'acumulado', label: 'Acumulado', tipo: 'currency' },
    { key: 'percentual', label: 'Uso do teto', tipo: 'number' },
  ];

  constructor(private route: ActivatedRoute, private service: ApuracaoMeiService, private alerts: AlertService,
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
    const ano = Number((this.competencia || competenciaAtual()).slice(0, 4));
    this.loading = true;
    this.service.historico(ano).subscribe({
      next: r => {
        this.subtitulo = `Ano ${ano}`;
        this.linhas = r.meses.map(item => ({
          mes: `${String(item.mes).padStart(2, '0')}/${ano}`,
          situacao: item.situacao ?? 'Aberta',
          total: item.totalMes,
          acumulado: item.acumuladoAno,
          percentual: item.percentualUtilizado,
        }));
        this.totalizadores = [
          { label: 'Total no ano', valor: r.totalAno, currency: true },
          { label: 'Limite aplicável', valor: r.limiteAplicavel, currency: true },
          { label: 'Uso do teto', valor: `${r.percentualUtilizado}%` },
        ];
        this.loading = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.alerts.error('Não foi possível carregar a apuração anual.');
        this.changeDetector.detectChanges();
      },
    });
  }
}
