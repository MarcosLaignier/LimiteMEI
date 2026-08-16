import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
import { ConfirmDialogService } from '../../shared/components-commons/infra/confirm-dialog-component/confirm.dialog.service';
import { TabsComponent } from '../../shared/components-commons/infra/tabs-component/tabs.component';
import { TabComponent } from '../../shared/components-commons/infra/tabs-component/tab.component';
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
    TabsComponent,
    TabComponent,
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
    private confirmDialog: ConfirmDialogService,
    private router: Router,
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
  get gruposFinanceiros() {
    const grupos = new Map<string, { item: LancamentoFinanceiroDTO; quantidade: number; total: number; baixado: number; saldo: number }>();
    for (const item of this.filtrados.filter(i => i.parcelamentoId || i.recorrenciaId)) {
      const chave = item.parcelamentoId ?? item.recorrenciaId!;
      const grupo = grupos.get(chave) ?? { item, quantidade: 0, total: 0, baixado: 0, saldo: 0 };
      grupo.quantidade++;
      grupo.total += Number(item.valor);
      grupo.baixado += Number(item.valorLiquidado);
      grupo.saldo += Number(item.saldoAberto);
      grupos.set(chave, grupo);
    }
    return [...grupos.values()];
  }
  get parcelamentos() {
    return this.gruposFinanceiros.filter((grupo) => !!grupo.item.parcelamentoId);
  }
  get recorrencias() {
    return this.gruposFinanceiros.filter((grupo) => !!grupo.item.recorrenciaId);
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
    this.baixa = { ...this.novaBaixa(), valorPrincipal: item.saldoAberto };
  }
  fecharBaixa() {
    this.selecionado = undefined;
    this.baixa = this.novaBaixa();
  }
  confirmarBaixa() {
    if (!this.selecionado) return;
    if (
      !this.baixa.valorPrincipal ||
      !this.baixa.dataLiquidacao ||
      !this.baixa.formaPagamento ||
      !this.baixa.contaFinanceiraId
    ) {
      this.alerts.warning('Informe valor, data, forma de pagamento e conta financeira.');
      return;
    }
    if (this.baixa.juros < 0 || this.baixa.multa < 0 || this.baixa.desconto < 0) {
      this.alerts.warning('Juros, multa e desconto não podem ser negativos.');
      return;
    }
    if (this.valorEfetivoBaixa <= 0) {
      this.alerts.warning('O valor efetivamente pago deve ser maior que zero.');
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
  get valorEfetivoBaixa() {
    return this.baixa.valorPrincipal + this.baixa.juros + this.baixa.multa - this.baixa.desconto;
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
  primeiraDoParcelamento(item: LancamentoFinanceiroDTO) {
    return !!item.parcelamentoId && (item.parcelaEntrada || item.numeroParcela === 1);
  }
  primeiraDaRecorrencia(item: LancamentoFinanceiroDTO) {
    return !!item.recorrenciaId && item.numeroRecorrencia === 1;
  }
  async cancelarParcelamento(item: LancamentoFinanceiroDTO) {
    if (!item.parcelamentoId) return;
    const motivo = await this.confirmDialog.requestText({
      title: 'Cancelar parcelamento',
      message: 'Todas as parcelas sem baixa serão canceladas. Baixas ativas devem ser estornadas antes.',
      inputLabel: 'Motivo do cancelamento',
      confirmText: 'Cancelar parcelamento',
    });
    if (!motivo) return;
    this.service.cancelarParcelamento(item.parcelamentoId, motivo).subscribe({
      next: () => {
        this.alerts.success('Parcelamento cancelado.');
        this.carregar();
      },
      error: (e) => this.alerts.error(e?.error?.messages?.join('<br>') || 'Não foi possível cancelar o parcelamento.'),
    });
  }
  async cancelarRecorrencia(item: LancamentoFinanceiroDTO) {
    if (!item.recorrenciaId) return;
    const motivo = await this.confirmDialog.requestText({
      title: 'Cancelar recorrência',
      message: 'Todas as ocorrências sem baixa serão canceladas. Baixas ativas devem ser estornadas antes.',
      inputLabel: 'Motivo do cancelamento',
      confirmText: 'Cancelar recorrência',
    });
    if (!motivo) return;
    this.service.cancelarRecorrencia(item.recorrenciaId, motivo).subscribe({
      next: () => {
        this.alerts.success('Recorrência cancelada.');
        this.carregar();
      },
      error: (e) => this.alerts.error(e?.error?.messages?.join('<br>') || 'Não foi possível cancelar a recorrência.'),
    });
  }
  gerenciarGrupo(item: LancamentoFinanceiroDTO) {
    const tipo = item.parcelamentoId ? 'parcelamento' : 'recorrencia';
    const id = item.parcelamentoId ?? item.recorrenciaId;
    if (!id) return;
    const itens = this.lancamentos.filter((lancamento) =>
      tipo === 'parcelamento'
        ? lancamento.parcelamentoId === id
        : lancamento.recorrenciaId === id,
    );
    this.router.navigate(
      ['/app/financeiro/lancamentos/grupo', tipo, id],
      { state: { itens } },
    );
  }
  private novaBaixa(): BaixaFinanceiraCreateDTO {
    return { valorPrincipal: 0, juros: 0, multa: 0, desconto: 0, dataLiquidacao: this.hoje() };
  }
  private hoje() {
    const data = new Date();
    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
  }
}
