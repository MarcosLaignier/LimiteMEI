import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoriaSelectorComponent } from '../../shared/components-commons/categoria-selector-component/categoria.selector.component';
import { PessoaSelectorComponent } from '../../shared/components-commons/pessoa-selector-component/pessoa.selector.component';
import { DateBoxComponent } from '../../shared/components-commons/infra/date-box-component/date.box.component';
import { MonthYearBoxComponent } from '../../shared/components-commons/infra/month-year-box-component/month.year.box.component';
import { SelectEnumComponent } from '../../shared/components-commons/infra/select-enum-component/select.enum.component';
import { TextBoxComponent } from '../../shared/components-commons/infra/text-box-component/text.box.component';
import { ToolbarComponent } from '../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';
import { ReportViewComponent } from '../../shared/components-commons/relatorio/report-view.component';
import { ReportColumn, ReportRow, ReportTotal, somaReport } from '../../shared/components-commons/relatorio/report.types';
import { competenciaAtual, periodoDaCompetencia, periodoLabel } from '../../shared/components-commons/relatorio/report-period.utils';
import { LancamentoFinanceiroDTO } from '../../dtos/lancamento/lancamento.financeiro';
import { PessoaDTO } from '../../dtos/pessoa/pessoa.dto';
import { LancamentoFinanceiroService } from '../../services/lancamento-financeiro.service';
import { AlertService } from '../../shared/components-commons/infra/alert-component/alert.service';
import { SituacaoLancamentoEnum, SITUACAO_LANCAMENTO_LABELS, TipoLancamentoEnum } from '../../enums/tipo.lancamento.enum';
import { TipoMovimentoEnum } from '../../enums/tipo.movimento.enum';

type RelatorioLancamentoTipo = 'lancamentos' | 'contas-receber' | 'contas-pagar';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToolbarComponent,
    MonthYearBoxComponent,
    DateBoxComponent,
    SelectEnumComponent,
    CategoriaSelectorComponent,
    PessoaSelectorComponent,
    TextBoxComponent,
    ReportViewComponent,
  ],
  template: `
    <toolbar-filter
      [tituloPagina]="titulo"
      [listMode]="true"
      [showNew]="false"
      [loading]="loading"
      (filtrar)="carregar()"
      (limpar)="limparFiltros()" />

    <section class="filters">
      <header>
        <span>FILTROS</span>
        <h1>{{titulo}}</h1>
        <p>Competência preenche o período automaticamente, mas as datas podem ser ajustadas.</p>
      </header>

      <div class="filter-stack">
        <div class="filter-row">
          <month-year-box-component label="Competência" width="210px" [(dataField)]="competencia" (dataFieldChange)="competenciaAlterada($event)" />
          <date-box-component label="Vencimento inicial" width="180px" [clearButton]="true" [(dataField)]="inicio" />
          <date-box-component label="Vencimento final" width="180px" [clearButton]="true" [(dataField)]="fim" />
        </div>

        <div class="filter-row">
          @if (!tipoFixo) {
            <select-enum label="Tipo" width="180px" [enumObject]="tiposLancamento" [(dataField)]="tipo" />
          }
          <select-enum label="Situação" width="180px" [enumObject]="situacoes" [optionLabels]="situacaoLabels" [(dataField)]="situacao" />
          <categoria-selector-component label="Categoria" width="280px" [tipo]="tipoCategoria" [(dataField)]="categoriaId" />
        </div>

        <div class="filter-row">
          <label class="number-field">
            <span>Valor mínimo</span>
            <input type="number" [(ngModel)]="valorMin" />
          </label>
          <label class="number-field">
            <span>Valor máximo</span>
            <input type="number" [(ngModel)]="valorMax" />
          </label>
        </div>

        <div class="filter-row">
          <pessoa-selector-component label="Pessoa" width="435px" [(pessoa)]="pessoa" />
        </div>

        <div class="filter-row">
          <text-box-component label="Descrição" width="435px" [(dataField)]="descricao" />
        </div>
      </div>
    </section>

    <report-view
      [loading]="loading"
      [titulo]="titulo"
      [subtitulo]="subtitulo"
      [fileName]="fileName"
      [colunas]="colunas"
      [linhas]="linhas"
      [totalizadores]="totalizadores" />
  `,
  styles: [`
    .filters{margin:1rem 0;padding:1.25rem;background:#fff;border:1px solid #e5e9ef;border-radius:12px}
    header{margin-bottom:1rem}header span{font-size:.75rem;color:#5570f1;font-weight:800}h1{margin:.2rem 0;color:#203746;font-size:1.25rem}p{margin:0;color:#687080}
    .filter-stack{display:flex;flex-direction:column;gap:15px}.filter-row{display:flex;align-items:end;flex-wrap:wrap;gap:15px}
    .number-field{display:flex;flex-direction:column;width:180px;max-width:100%;gap:.4rem}.number-field span{font-size:.875rem;font-weight:600}.number-field input{height:38px;border:1px solid #ced4da;border-radius:6px;padding:0 .65rem}
  `]
})
export class RelatorioLancamentosComponent implements OnInit {
  titulo = 'Lançamentos financeiros';
  fileName = 'lancamentos-financeiros';
  relatorioTipo: RelatorioLancamentoTipo = 'lancamentos';
  tipoFixo?: TipoLancamentoEnum;
  tipo?: TipoLancamentoEnum;
  situacao?: SituacaoLancamentoEnum;
  categoriaId?: number;
  pessoa?: PessoaDTO;
  competencia = competenciaAtual();
  inicio = '';
  fim = '';
  valorMin?: number;
  valorMax?: number;
  descricao = '';
  loading = false;
  subtitulo = '';
  linhas: ReportRow[] = [];
  totalizadores: ReportTotal[] = [];
  readonly tiposLancamento = TipoLancamentoEnum;
  readonly situacoes = SituacaoLancamentoEnum;
  readonly situacaoLabels = SITUACAO_LANCAMENTO_LABELS;
  readonly colunas: ReportColumn[] = [
    { key: 'descricao', label: 'Descrição' }, { key: 'tipo', label: 'Tipo' }, { key: 'categoria', label: 'Categoria' },
    { key: 'pessoa', label: 'Pessoa' }, { key: 'competencia', label: 'Competência' }, { key: 'vencimento', label: 'Vencimento' },
    { key: 'situacao', label: 'Situação' }, { key: 'valor', label: 'Valor', tipo: 'currency' },
    { key: 'liquidado', label: 'Liquidado', tipo: 'currency' }, { key: 'saldo', label: 'Saldo', tipo: 'currency' },
  ];

  constructor(private route: ActivatedRoute, private service: LancamentoFinanceiroService,
              private alerts: AlertService, private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    this.relatorioTipo = this.route.snapshot.data['relatorioTipo'] ?? 'lancamentos';
    this.configurarTipo();
    this.competencia = this.route.snapshot.queryParamMap.get('competencia') ?? this.competencia;
    this.competenciaAlterada(this.competencia);
    this.inicio = this.route.snapshot.queryParamMap.get('inicio') ?? this.inicio;
    this.fim = this.route.snapshot.queryParamMap.get('fim') ?? this.fim;
    this.carregar();
  }

  get tipoCategoria() {
    const tipo = this.tipoFixo ?? this.tipo;
    if (tipo === TipoLancamentoEnum.RECEBER) return TipoMovimentoEnum.RECEITA;
    if (tipo === TipoLancamentoEnum.PAGAR) return TipoMovimentoEnum.DESPESA;
    return undefined;
  }

  configurarTipo() {
    if (this.relatorioTipo === 'contas-receber') {
      this.titulo = 'Contas a receber';
      this.fileName = 'contas-a-receber';
      this.tipoFixo = TipoLancamentoEnum.RECEBER;
      this.tipo = TipoLancamentoEnum.RECEBER;
      return;
    }
    if (this.relatorioTipo === 'contas-pagar') {
      this.titulo = 'Contas a pagar';
      this.fileName = 'contas-a-pagar';
      this.tipoFixo = TipoLancamentoEnum.PAGAR;
      this.tipo = TipoLancamentoEnum.PAGAR;
      return;
    }
    this.titulo = 'Lançamentos financeiros';
    this.fileName = 'lancamentos-financeiros';
    this.tipoFixo = undefined;
  }

  competenciaAlterada(competencia: string) {
    this.competencia = competencia;
    const periodo = periodoDaCompetencia(competencia);
    this.inicio = periodo.inicio;
    this.fim = periodo.fim;
  }

  limparFiltros() {
    this.tipo = this.tipoFixo;
    this.situacao = undefined;
    this.categoriaId = undefined;
    this.pessoa = undefined;
    this.valorMin = undefined;
    this.valorMax = undefined;
    this.descricao = '';
    this.competencia = competenciaAtual();
    this.competenciaAlterada(this.competencia);
    this.carregar();
  }

  carregar() {
    this.loading = true;
    this.service.relatorio({
      inicio: this.inicio,
      fim: this.fim,
      tipo: this.tipoFixo ?? this.tipo,
      situacao: this.situacao,
      categoriaId: this.categoriaId,
      pessoaId: this.pessoa?.id,
      valorMin: this.valorMin,
      valorMax: this.valorMax,
      descricao: this.descricao,
    }).subscribe({
      next: itens => {
        this.montarLinhas(itens);
        this.loading = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.alerts.error('Não foi possível carregar os lançamentos.');
        this.changeDetector.detectChanges();
      },
    });
  }

  montarLinhas(itens: LancamentoFinanceiroDTO[]) {
    this.subtitulo = periodoLabel(this.inicio, this.fim);
    this.linhas = itens.map(item => ({
      descricao: item.descricao,
      tipo: item.tipo === TipoLancamentoEnum.RECEBER ? 'Receber' : 'Pagar',
      categoria: item.categoriaNome,
      pessoa: item.pessoaNome ?? '',
      competencia: item.dataCompetencia,
      vencimento: item.dataVencimento,
      situacao: SITUACAO_LANCAMENTO_LABELS[item.situacao] ?? item.situacao,
      valor: item.valor,
      liquidado: item.valorLiquidado,
      saldo: item.saldoAberto,
    }));
    this.totalizadores = [
      { label: 'Total', valor: somaReport(this.linhas, 'valor'), currency: true },
      { label: 'Liquidado', valor: somaReport(this.linhas, 'liquidado'), currency: true },
      { label: 'Saldo aberto', valor: somaReport(this.linhas, 'saldo'), currency: true },
    ];
  }
}
