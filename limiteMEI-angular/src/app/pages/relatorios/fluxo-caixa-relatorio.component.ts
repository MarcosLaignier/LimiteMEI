import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriaSelectorComponent } from '../../shared/components-commons/categoria-selector-component/categoria.selector.component';
import { ContaFinanceiraSelectorComponent } from '../../shared/components-commons/conta-financeira-selector-component/conta-financeira.selector.component';
import { DateBoxComponent } from '../../shared/components-commons/infra/date-box-component/date.box.component';
import { MonthYearBoxComponent } from '../../shared/components-commons/infra/month-year-box-component/month.year.box.component';
import { SelectEnumComponent } from '../../shared/components-commons/infra/select-enum-component/select.enum.component';
import { ToolbarComponent } from '../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';
import { RelatorioFluxoCaixaDTO } from '../../dtos/relatorio/relatorio.financeiro';
import { FORMA_PAGAMENTO_LABELS, FormaPagamentoEnum } from '../../enums/forma.pagamento.enum';
import { OrigemMovimentoEnum, ORIGEM_MOVIMENTO_LABELS, TipoFluxoCaixaEnum, TIPO_FLUXO_LABELS } from '../../enums/movimento.financeiro.enum';
import { TipoMovimentoEnum } from '../../enums/tipo.movimento.enum';
import { RelatorioService } from '../../services/relatorio.service';
import { AlertService } from '../../shared/components-commons/infra/alert-component/alert.service';
import { competenciaAtual, periodoDaCompetencia, periodoLabel } from '../../shared/components-commons/relatorio/report-period.utils';
import { ReportViewComponent } from '../../shared/components-commons/relatorio/report-view.component';
import { ReportColumn, ReportFilter, ReportRow, ReportTotal } from '../../shared/components-commons/relatorio/report.types';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ToolbarComponent,
    MonthYearBoxComponent,
    DateBoxComponent,
    ContaFinanceiraSelectorComponent,
    SelectEnumComponent,
    CategoriaSelectorComponent,
    ReportViewComponent,
  ],
  template: `
    <toolbar-filter
      tituloPagina="Fluxo de caixa"
      [listMode]="true"
      [showNew]="false"
      [loading]="loading"
      (filtrar)="carregar()"
      (limpar)="limparFiltros()" />

    <section class="filters">
      <header>
        <span>FILTROS</span>
        <h1>Fluxo de caixa / extrato por conta</h1>
        <p>Competência preenche o período automaticamente. Os demais filtros refinam o extrato.</p>
      </header>

      <div class="filter-stack">
        <div class="filter-row">
          <month-year-box-component label="Competência" width="210px" [(dataField)]="competencia" (dataFieldChange)="competenciaAlterada($event)" />
          <date-box-component label="Data inicial" width="180px" [clearButton]="true" [(dataField)]="inicio" />
          <date-box-component label="Data final" width="180px" [clearButton]="true" [(dataField)]="fim" />
        </div>

        <div class="filter-row">
          <conta-financeira-selector-component label="Conta financeira" width="375px" [(dataField)]="contaFinanceiraId" />
        </div>

        <div class="filter-row">
          <select-enum label="Tipo" width="180px" [enumObject]="tiposFluxo" [optionLabels]="tipoLabels" [(dataField)]="tipo" />
          <select-enum label="Origem" width="240px" [enumObject]="origens" [optionLabels]="origemLabels" [(dataField)]="origem" />
          <select-enum label="Forma de pagamento" width="260px" [enumObject]="formasPagamento" [optionLabels]="formaLabels" [(dataField)]="formaPagamento" />
          <categoria-selector-component label="Categoria" width="280px" [tipo]="tipoCategoria" [(dataField)]="categoriaId" />
        </div>
      </div>
    </section>

    <report-view
      [loading]="loading"
      titulo="Relatório de fluxo de caixa"
      [subtitulo]="subtitulo"
      fileName="fluxo-caixa"
      [filtros]="filtrosRelatorio"
      [colunas]="colunas"
      [linhas]="linhas"
      [totalizadores]="totalizadores" />
  `,
  styles: [`
    .filters{margin:1rem 0;padding:1.25rem;background:#fff;border:1px solid #e5e9ef;border-radius:12px}
    .filters header{margin-bottom:1rem}.filters header span{font-size:.75rem;color:#5570f1;font-weight:800}.filters h1{margin:.2rem 0;color:#203746;font-size:1.25rem}.filters p{margin:0;color:#687080}
    .filter-stack{display:flex;flex-direction:column;gap:15px}.filter-row{display:flex;align-items:end;flex-wrap:wrap;gap:15px}
  `]
})
export class FluxoCaixaRelatorioComponent implements OnInit {
  relatorio?: RelatorioFluxoCaixaDTO;
  competencia = competenciaAtual();
  inicio = '';
  fim = '';
  contaFinanceiraId?: number;
  tipo?: TipoFluxoCaixaEnum;
  origem?: OrigemMovimentoEnum;
  formaPagamento?: FormaPagamentoEnum;
  categoriaId?: number;
  loading = false;
  subtitulo = '';
  linhas: ReportRow[] = [];
  totalizadores: ReportTotal[] = [];
  readonly origens = OrigemMovimentoEnum;
  readonly origemLabels = ORIGEM_MOVIMENTO_LABELS;
  readonly tiposFluxo = TipoFluxoCaixaEnum;
  readonly tipoLabels = TIPO_FLUXO_LABELS;
  readonly formasPagamento = FormaPagamentoEnum;
  readonly formaLabels = FORMA_PAGAMENTO_LABELS;
  readonly colunas: ReportColumn[] = [
    { key: 'data', label: 'Data' }, { key: 'descricao', label: 'Descrição' }, { key: 'origem', label: 'Origem' },
    { key: 'conta', label: 'Conta' }, { key: 'forma', label: 'Forma' }, { key: 'categoria', label: 'Categoria' },
    { key: 'tipo', label: 'Tipo' }, { key: 'valor', label: 'Valor', tipo: 'currency' },
  ];

  constructor(private route: ActivatedRoute, private service: RelatorioService,
              private alerts: AlertService, private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    this.competencia = this.route.snapshot.queryParamMap.get('competencia') ?? this.competencia;
    this.competenciaAlterada(this.competencia);
    this.inicio = this.route.snapshot.queryParamMap.get('inicio') ?? this.inicio;
    this.fim = this.route.snapshot.queryParamMap.get('fim') ?? this.fim;
    this.contaFinanceiraId = Number(this.route.snapshot.queryParamMap.get('contaFinanceiraId')) || undefined;
    this.carregar();
  }

  get tipoCategoria() {
    if (this.tipo === TipoFluxoCaixaEnum.ENTRADA) return TipoMovimentoEnum.RECEITA;
    if (this.tipo === TipoFluxoCaixaEnum.SAIDA) return TipoMovimentoEnum.DESPESA;
    return undefined;
  }

  get filtrosRelatorio(): ReportFilter[] {
    return [
      { label: 'Competência', valor: this.competenciaLabel() },
      { label: 'Período', valor: periodoLabel(this.inicio, this.fim) },
      { label: 'Conta', valor: this.relatorio?.contaFinanceiraNome || 'Todas as contas' },
      { label: 'Tipo', valor: this.tipo ? this.tipoLabels[this.tipo] : 'Todos' },
      { label: 'Origem', valor: this.origem ? this.origemLabels[this.origem] : 'Todas' },
      { label: 'Forma de pagamento', valor: this.formaPagamento ? this.formaLabels[this.formaPagamento] : 'Todas' },
      { label: 'Categoria', valor: this.categoriaId ? `ID ${this.categoriaId}` : 'Todas' },
    ];
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
    this.contaFinanceiraId = undefined;
    this.tipo = undefined;
    this.origem = undefined;
    this.formaPagamento = undefined;
    this.categoriaId = undefined;
    this.carregar();
  }

  carregar() {
    if (!this.inicio || !this.fim) {
      this.alerts.warning('Informe o período do fluxo de caixa.');
      return;
    }
    this.loading = true;
    this.service.fluxoCaixa({
      inicio: this.inicio,
      fim: this.fim,
      contaFinanceiraId: this.contaFinanceiraId,
      tipo: this.tipo,
      origem: this.origem,
      formaPagamento: this.formaPagamento,
      categoriaId: this.categoriaId,
    }).subscribe({
      next: relatorio => {
        this.relatorio = relatorio;
        this.montarLinhas(relatorio);
        this.loading = false;
        this.changeDetector.detectChanges();
      },
      error: e => {
        this.loading = false;
        this.alerts.error(e?.error?.messages?.join('<br>') || 'Não foi possível gerar o fluxo de caixa.');
        this.changeDetector.detectChanges();
      },
    });
  }

  montarLinhas(relatorio: RelatorioFluxoCaixaDTO) {
    const movimentos = relatorio.movimentos.filter(item =>
      (!this.tipo || item.tipo === this.tipo) &&
      (!this.origem || item.origem === this.origem) &&
      (!this.formaPagamento || item.formaPagamento === this.formaPagamento) &&
      (!this.categoriaId || item.categoriaId === this.categoriaId));
    const entradas = movimentos.filter(item => item.tipo === TipoFluxoCaixaEnum.ENTRADA)
      .reduce((total, item) => total + Number(item.valor || 0), 0);
    const saidas = movimentos.filter(item => item.tipo === TipoFluxoCaixaEnum.SAIDA)
      .reduce((total, item) => total + Number(item.valor || 0), 0);
    this.subtitulo = `${periodoLabel(this.inicio, this.fim)} · Conta: ${relatorio.contaFinanceiraNome}`;
    this.linhas = movimentos.map(item => ({
      data: item.data,
      descricao: item.descricao,
      origem: this.origemLabels[item.origem] ?? item.origem,
      conta: item.contaFinanceiraNome,
      forma: item.formaPagamento ? this.formaLabels[item.formaPagamento] : '',
      categoria: item.categoriaNome ?? '',
      tipo: this.tipoLabels[item.tipo] ?? item.tipo,
      valor: item.valor,
    }));
    this.totalizadores = [
      { label: 'Entradas', valor: entradas, currency: true },
      { label: 'Saídas', valor: saidas, currency: true },
      { label: 'Saldo do período', valor: entradas - saidas, currency: true },
    ];
  }

  private competenciaLabel() {
    const [ano, mes] = (this.competencia || '').split('-');
    return ano && mes ? `${mes}/${ano}` : '';
  }
}
