import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DateBoxComponent } from '../../shared/components-commons/infra/date-box-component/date.box.component';
import { MonthYearBoxComponent } from '../../shared/components-commons/infra/month-year-box-component/month.year.box.component';
import { SelectEnumComponent } from '../../shared/components-commons/infra/select-enum-component/select.enum.component';
import { TextBoxComponent } from '../../shared/components-commons/infra/text-box-component/text.box.component';
import { ToolbarComponent } from '../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';
import { ReportViewComponent } from '../../shared/components-commons/relatorio/report-view.component';
import { ReportColumn, ReportRow, ReportTotal, somaReport } from '../../shared/components-commons/relatorio/report.types';
import { competenciaAtual, periodoDaCompetencia, periodoLabel } from '../../shared/components-commons/relatorio/report-period.utils';
import { DocumentoFiscalService } from '../../services/documento-fiscal.service';
import { AlertService } from '../../shared/components-commons/infra/alert-component/alert.service';
import { SituacaoDocumentoFiscalEnum, SITUACAO_DOCUMENTO_FISCAL_LABELS, TipoDocumentoFiscalEnum, TIPO_DOCUMENTO_FISCAL_LABELS } from '../../enums/documento.fiscal.enum';

@Component({
  standalone: true,
  imports: [CommonModule, ToolbarComponent, MonthYearBoxComponent, DateBoxComponent, SelectEnumComponent, TextBoxComponent, ReportViewComponent],
  template: `
    <toolbar-filter tituloPagina="Documentos fiscais" [listMode]="true" [showNew]="false" [loading]="loading" (filtrar)="carregar()" (limpar)="limparFiltros()" />
    <section class="filters">
      <header><span>FILTROS</span><h1>Documentos fiscais</h1><p>Filtre por emissão, tipo, situação e cliente.</p></header>
      <div class="filter-stack">
        <div class="filter-row">
          <month-year-box-component label="Competência" width="210px" [(dataField)]="competencia" (dataFieldChange)="competenciaAlterada($event)" />
          <date-box-component label="Emissão inicial" width="180px" [clearButton]="true" [(dataField)]="inicio" />
          <date-box-component label="Emissão final" width="180px" [clearButton]="true" [(dataField)]="fim" />
        </div>
        <div class="filter-row">
          <select-enum label="Tipo" width="180px" [enumObject]="tipos" [optionLabels]="tipoLabels" [(dataField)]="tipo" />
          <select-enum label="Situação" width="180px" [enumObject]="situacoes" [optionLabels]="situacaoLabels" [(dataField)]="situacao" />
        </div>
        <div class="filter-row">
          <text-box-component label="Cliente" width="435px" [(dataField)]="cliente" />
        </div>
      </div>
    </section>
    <report-view [loading]="loading" titulo="Documentos fiscais" [subtitulo]="subtitulo" fileName="documentos-fiscais" [colunas]="colunas" [linhas]="linhas" [totalizadores]="totalizadores" />
  `,
  styles: [`
    .filters{margin:1rem 0;padding:1.25rem;background:#fff;border:1px solid #e5e9ef;border-radius:12px}
    header{margin-bottom:1rem}header span{font-size:.75rem;color:#5570f1;font-weight:800}h1{margin:.2rem 0;color:#203746;font-size:1.25rem}p{margin:0;color:#687080}
    .filter-stack{display:flex;flex-direction:column;gap:15px}.filter-row{display:flex;align-items:end;flex-wrap:wrap;gap:15px}
  `]
})
export class RelatorioDocumentosFiscaisComponent implements OnInit {
  competencia = competenciaAtual();
  inicio = '';
  fim = '';
  tipo?: TipoDocumentoFiscalEnum;
  situacao?: SituacaoDocumentoFiscalEnum;
  cliente = '';
  loading = false;
  subtitulo = '';
  linhas: ReportRow[] = [];
  totalizadores: ReportTotal[] = [];
  readonly tipos = TipoDocumentoFiscalEnum;
  readonly tipoLabels = TIPO_DOCUMENTO_FISCAL_LABELS;
  readonly situacoes = SituacaoDocumentoFiscalEnum;
  readonly situacaoLabels = SITUACAO_DOCUMENTO_FISCAL_LABELS;
  readonly colunas: ReportColumn[] = [
    { key: 'emissao', label: 'Emissão' }, { key: 'tipo', label: 'Tipo' }, { key: 'numero', label: 'Número' },
    { key: 'cliente', label: 'Cliente' }, { key: 'situacao', label: 'Situação' },
    { key: 'valor', label: 'Valor', tipo: 'currency' }, { key: 'vinculado', label: 'Vinculado', tipo: 'currency' },
    { key: 'saldo', label: 'Saldo', tipo: 'currency' },
  ];

  constructor(private route: ActivatedRoute, private service: DocumentoFiscalService, private alerts: AlertService,
              private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    this.competencia = this.route.snapshot.queryParamMap.get('competencia') ?? this.competencia;
    this.competenciaAlterada(this.competencia);
    this.inicio = this.route.snapshot.queryParamMap.get('inicio') ?? this.inicio;
    this.fim = this.route.snapshot.queryParamMap.get('fim') ?? this.fim;
    this.carregar();
  }

  competenciaAlterada(competencia: string) {
    this.competencia = competencia;
    const periodo = periodoDaCompetencia(competencia);
    this.inicio = periodo.inicio;
    this.fim = periodo.fim;
  }

  limparFiltros() {
    this.competencia = competenciaAtual();
    this.competenciaAlterada(this.competencia);
    this.tipo = undefined;
    this.situacao = undefined;
    this.cliente = '';
    this.carregar();
  }

  carregar() {
    this.loading = true;
    this.service.relatorio({
      inicio: this.inicio,
      fim: this.fim,
      tipo: this.tipo,
      situacao: this.situacao,
      cliente: this.cliente,
    }).subscribe({
      next: itens => {
        this.subtitulo = periodoLabel(this.inicio, this.fim);
        this.linhas = itens.map(item => ({
          emissao: item.dataEmissao,
          tipo: TIPO_DOCUMENTO_FISCAL_LABELS[item.tipo] ?? item.tipo,
          numero: item.numero,
          cliente: item.clienteNome ?? '',
          situacao: SITUACAO_DOCUMENTO_FISCAL_LABELS[item.situacao] ?? item.situacao,
          valor: item.valorTotal,
          vinculado: item.valorVinculado,
          saldo: item.saldoVincular,
        }));
        this.totalizadores = [
          { label: 'Quantidade', valor: this.linhas.length },
          { label: 'Valor total', valor: somaReport(this.linhas, 'valor'), currency: true },
          { label: 'Saldo a vincular', valor: somaReport(this.linhas, 'saldo'), currency: true },
        ];
        this.loading = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.alerts.error('Não foi possível carregar os documentos fiscais.');
        this.changeDetector.detectChanges();
      },
    });
  }
}
