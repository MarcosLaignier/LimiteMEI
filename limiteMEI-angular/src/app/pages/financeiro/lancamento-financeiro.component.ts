import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LancamentoFinanceiroDTO } from '../../dtos/lancamento/lancamento.financeiro';
import { BaixaFinanceiraCreateDTO } from '../../dtos/lancamento/baixa.financeira';
import { LancamentoFinanceiroService } from '../../services/lancamento-financeiro.service';
import { BaixaFinanceiraService } from '../../services/baixa-financeira.service';
import { DateBoxComponent } from '../../shared/components-commons/infra/date-box-component/date.box.component';
import { NumberBoxComponent } from '../../shared/components-commons/infra/number-box-component/number.box.component';
import { SelectEnumComponent } from '../../shared/components-commons/infra/select-enum-component/select.enum.component';
import { BadgeComponent } from '../../shared/components-commons/infra/badge-component/badge.component';
import { ContaFinanceiraSelectorComponent } from '../../shared/components-commons/conta-financeira-selector-component/conta-financeira.selector.component';
import { AlertService } from '../../shared/components-commons/infra/alert-component/alert.service';
import { TipoLancamentoEnum } from '../../enums/tipo.lancamento.enum';
import { FormaPagamentoEnum, FORMA_PAGAMENTO_LABELS } from '../../enums/forma.pagamento.enum';
import { ToolbarComponent } from '../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';
import {
  LancamentoFilterComponent,
  LancamentoFiltro,
  novoLancamentoFiltro,
  SituacaoFiltroLancamento,
} from '../../shared/components-commons/lancamento-filter-component/lancamento.filter.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    DateBoxComponent,
    NumberBoxComponent,
    SelectEnumComponent,
    BadgeComponent,
    LancamentoFilterComponent,
    ContaFinanceiraSelectorComponent,
    ToolbarComponent,
  ],
  templateUrl: './lancamento-financeiro.component.html',
  styleUrl: './lancamento-financeiro.component.scss',
})
export class LancamentoFinanceiroComponent implements OnInit {
  loading = false;
  baixando = false;
  lancamentos: LancamentoFinanceiroDTO[] = [];
  filtrados: LancamentoFinanceiroDTO[] = [];
  selecionado?: LancamentoFinanceiroDTO;
  baixa: BaixaFinanceiraCreateDTO = this.novaBaixa();
  filtro: LancamentoFiltro = novoLancamentoFiltro();
  readonly tipos = TipoLancamentoEnum;
  readonly formas = FormaPagamentoEnum;
  readonly formaLabels = FORMA_PAGAMENTO_LABELS;
  readonly situacaoLabels: Record<string, string> = {
    AGUARDANDO: 'Aguardando baixa',
    PARCIAL: 'Baixado parcialmente',
    LIQUIDADO: 'Baixado',
    VENCIDO: 'Vencido',
    CANCELADO: 'Cancelado',
  };

  constructor(
    private service: LancamentoFinanceiroService,
    private baixas: BaixaFinanceiraService,
    private alerts: AlertService,
  ) {}
  ngOnInit() {
    this.carregar();
  }
  get totalReceber() {
    return this.filtrados
      .filter((i) => i.tipo === TipoLancamentoEnum.RECEBER)
      .reduce((s, i) => s + i.saldoAberto, 0);
  }
  get totalPagar() {
    return this.filtrados
      .filter((i) => i.tipo === TipoLancamentoEnum.PAGAR)
      .reduce((s, i) => s + i.saldoAberto, 0);
  }
  get totalBaixado() {
    return this.filtrados.reduce((s, i) => s + i.valorLiquidado, 0);
  }
  get totalVencido() {
    return this.filtrados
      .filter((i) => this.situacao(i) === 'VENCIDO')
      .reduce((s, i) => s + i.saldoAberto, 0);
  }
  carregar() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (r) => {
        this.lancamentos = r.body ?? [];
        this.aplicarFiltros();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.alerts.error('Não foi possível carregar os lançamentos.');
      },
    });
  }
  aplicarFiltros() {
    const f = this.filtro;
    this.filtrados = this.lancamentos.filter(
      (i) =>
        (!f.descricao ||
          `${i.descricao} ${i.pessoaNome ?? ''}`
            .toLowerCase()
            .includes(f.descricao.toLowerCase())) &&
        (!f.tipo || i.tipo === f.tipo) &&
        (!f.categoriaId || i.categoriaId === f.categoriaId) &&
        (!f.competencia || i.dataCompetencia.slice(0, 7) === f.competencia.slice(0, 7)) &&
        (!f.situacao || this.situacao(i) === f.situacao) &&
        (f.valorMin == null || i.valor >= f.valorMin) &&
        (f.valorMax == null || i.valor <= f.valorMax) &&
        (!f.vencimentoInicial || i.dataVencimento >= f.vencimentoInicial) &&
        (!f.vencimentoFinal || i.dataVencimento <= f.vencimentoFinal) &&
        (!f.pessoaId || i.pessoaId === f.pessoaId),
    );
  }
  limparFiltros() {
    this.filtro = novoLancamentoFiltro();
    this.aplicarFiltros();
  }
  abrirBaixa(item: LancamentoFinanceiroDTO) {
    this.selecionado = item;
    this.baixa = { ...this.novaBaixa(), valor: item.saldoAberto };
  }
  fecharBaixa() {
    this.selecionado = undefined;
    this.baixa = this.novaBaixa();
  }
  confirmarBaixa() {
    if (!this.selecionado) return;
    if (
      !this.baixa.valor ||
      !this.baixa.dataLiquidacao ||
      !this.baixa.formaPagamento ||
      !this.baixa.contaFinanceiraId
    ) {
      this.alerts.warning('Informe valor, data, forma de pagamento e conta financeira.');
      return;
    }
    this.baixando = true;
    this.baixas.criar(this.selecionado.id, this.baixa).subscribe({
      next: () => {
        this.baixando = false;
        this.fecharBaixa();
        this.alerts.success('Baixa registrada com sucesso.');
        this.carregar();
      },
      error: (e) => {
        this.baixando = false;
        this.alerts.error(
          e?.error?.messages?.join('<br>') || 'Não foi possível registrar a baixa.',
        );
      },
    });
  }
  situacao(item: LancamentoFinanceiroDTO): SituacaoFiltroLancamento {
    if (item.situacao === 'CANCELADO') return 'CANCELADO';
    if (item.saldoAberto <= 0 || item.situacao === 'LIQUIDADO') return 'LIQUIDADO';
    if (item.dataVencimento < this.hoje()) return 'VENCIDO';
    if (item.valorLiquidado > 0) return 'PARCIAL';
    return 'AGUARDANDO';
  }
  badgeColor(
    item: LancamentoFinanceiroDTO,
  ): 'warning' | 'info' | 'success' | 'danger' | 'secondary' {
    const s = this.situacao(item);
    return s === 'LIQUIDADO'
      ? 'success'
      : s === 'PARCIAL'
        ? 'info'
        : s === 'VENCIDO'
          ? 'danger'
          : s === 'CANCELADO'
            ? 'secondary'
            : 'warning';
  }
  podeBaixar(item: LancamentoFinanceiroDTO) {
    return item.saldoAberto > 0 && item.situacao !== 'CANCELADO';
  }
  private novaBaixa(): BaixaFinanceiraCreateDTO {
    return { valor: 0, dataLiquidacao: this.hoje() };
  }
  private hoje() {
    const data = new Date();
    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
  }
}
