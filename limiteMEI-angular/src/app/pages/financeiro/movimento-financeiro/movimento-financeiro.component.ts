import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  MovimentoFinanceiroCreateDTO,
  MovimentoFinanceiroDTO,
  TransferenciaFinanceiraDTO,
} from '../../../dtos/movimento/movimento.financeiro';
import { ConfiguracaoGeralDTO } from '../../../dtos/configuracao/configuracao.alerta.limite';
import { MovimentoFinanceiroService } from '../../../services/movimento-financeiro.service';
import { ConfiguracaoService } from '../../../services/configuracao.service';
import { ToolbarComponent } from '../../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';
import { TabsComponent } from '../../../shared/components-commons/infra/tabs-component/tabs.component';
import { TabComponent } from '../../../shared/components-commons/infra/tabs-component/tab.component';
import { ContaFinanceiraSelectorComponent } from '../../../shared/components-commons/conta-financeira-selector-component/conta-financeira.selector.component';
import { CategoriaSelectorComponent } from '../../../shared/components-commons/categoria-selector-component/categoria.selector.component';
import { TextBoxComponent } from '../../../shared/components-commons/infra/text-box-component/text.box.component';
import { TextAreaComponent } from '../../../shared/components-commons/infra/text-area-component/text.area.component';
import { NumberBoxComponent } from '../../../shared/components-commons/infra/number-box-component/number.box.component';
import { DateBoxComponent } from '../../../shared/components-commons/infra/date-box-component/date.box.component';
import { SelectEnumComponent } from '../../../shared/components-commons/infra/select-enum-component/select.enum.component';
import { BadgeComponent } from '../../../shared/components-commons/infra/badge-component/badge.component';
import { AlertService } from '../../../shared/components-commons/infra/alert-component/alert.service';
import { ConfirmDialogService } from '../../../shared/components-commons/infra/confirm-dialog-component/confirm.dialog.service';
import {
  OrigemMovimentoEnum,
  ORIGEM_MOVIMENTO_LABELS,
  TipoFluxoCaixaEnum,
  TIPO_FLUXO_LABELS,
} from '../../../enums/movimento.financeiro.enum';
import { FormaPagamentoEnum, FORMA_PAGAMENTO_LABELS } from '../../../enums/forma.pagamento.enum';
import { TipoMovimentoEnum } from '../../../enums/tipo.movimento.enum';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    ToolbarComponent,
    TabsComponent,
    TabComponent,
    ContaFinanceiraSelectorComponent,
    CategoriaSelectorComponent,
    TextBoxComponent,
    TextAreaComponent,
    NumberBoxComponent,
    DateBoxComponent,
    SelectEnumComponent,
    BadgeComponent,
  ],
  templateUrl: './movimento-financeiro.component.html',
  styleUrl: './movimento-financeiro.component.scss',
})
export class MovimentoFinanceiroComponent implements OnInit {
  loading = false;
  salvando = false;
  contaExtratoId?: number;
  inicio = '';
  fim = '';
  saldo = 0;
  movimentos: MovimentoFinanceiroDTO[] = [];
  manual: MovimentoFinanceiroCreateDTO = this.novoManual();
  configuracaoGeral: ConfiguracaoGeralDTO = {};
  transferencia: TransferenciaFinanceiraDTO = this.novaTransferencia();
  readonly origens = {
    APORTE: 'APORTE',
    RETIRADA: 'RETIRADA',
    EMPRESTIMO: 'EMPRESTIMO',
    TARIFA: 'TARIFA',
    AJUSTE: 'AJUSTE',
  };
  readonly origemLabels = ORIGEM_MOVIMENTO_LABELS;
  readonly tipos = TipoFluxoCaixaEnum;
  readonly tipoLabels = TIPO_FLUXO_LABELS;
  readonly formas = FormaPagamentoEnum;
  readonly formaLabels = FORMA_PAGAMENTO_LABELS;
  constructor(
    private service: MovimentoFinanceiroService,
    private configuracoes: ConfiguracaoService,
    private alerts: AlertService,
    private confirmDialog: ConfirmDialogService,
  ) {}
  ngOnInit() {
    this.carregarConfiguracoes();
  }
  carregarConfiguracoes() {
    this.configuracoes.carregarGerais().subscribe({
      next: configuracao => {
        this.configuracaoGeral = configuracao ?? {};
        this.manual = this.novoManual();
      },
      error: () => this.configuracaoGeral = {},
    });
  }
  get tipoCategoriaManual() {
    const tipo = this.tipoManual();
    return tipo === TipoFluxoCaixaEnum.ENTRADA
      ? TipoMovimentoEnum.RECEITA
      : tipo === TipoFluxoCaixaEnum.SAIDA
        ? TipoMovimentoEnum.DESPESA
        : undefined;
  }
  origemChanged() {
    if (this.manual.origem !== OrigemMovimentoEnum.AJUSTE) this.manual.tipo = undefined;
    this.manual.categoriaId = undefined;
  }
  carregarExtrato() {
    if (!this.contaExtratoId) {
      this.alerts.warning('Selecione uma conta financeira.');
      return;
    }
    this.loading = true;
    this.service.extrato(this.contaExtratoId, this.inicio, this.fim).subscribe({
      next: (r) => {
        this.movimentos = r;
        this.service.saldo(this.contaExtratoId!).subscribe({
          next: (s) => {
            this.saldo = s;
            this.loading = false;
          },
          error: () => (this.loading = false),
        });
      },
      error: () => {
        this.loading = false;
        this.alerts.error('Não foi possível carregar o extrato.');
      },
    });
  }
  limpar() {
    this.inicio = '';
    this.fim = '';
    this.movimentos = [];
    this.saldo = 0;
    this.contaExtratoId = undefined;
  }
  salvarManual() {
    if (
      !this.manual.descricao ||
      !this.manual.valor ||
      !this.manual.data ||
      !this.manual.origem ||
      !this.manual.contaFinanceiraId ||
      (this.manual.origem === OrigemMovimentoEnum.AJUSTE && !this.manual.tipo)
    ) {
      this.alerts.warning('Preencha os campos obrigatórios da movimentação.');
      return;
    }
    this.salvando = true;
    this.service.create(this.manual).subscribe({
      next: () => {
        this.salvando = false;
        this.alerts.success('Movimentação registrada com sucesso.');
        const conta = this.manual.contaFinanceiraId;
        this.manual = this.novoManual();
        if (this.contaExtratoId === conta) this.carregarExtrato();
      },
      error: (e) => {
        this.salvando = false;
        this.alerts.error(
          e?.error?.messages?.join('<br>') || 'Não foi possível registrar a movimentação.',
        );
      },
    });
  }
  salvarTransferencia() {
    const t = this.transferencia;
    if (!t.contaOrigemId || !t.contaDestinoId || !t.valor || !t.data) {
      this.alerts.warning('Informe as contas, o valor e a data da transferência.');
      return;
    }
    this.salvando = true;
    this.service.transferir(t).subscribe({
      next: () => {
        this.salvando = false;
        this.alerts.success('Transferência realizada com sucesso.');
        this.transferencia = this.novaTransferencia();
        if (this.contaExtratoId) this.carregarExtrato();
      },
      error: (e) => {
        this.salvando = false;
        this.alerts.error(
          e?.error?.messages?.join('<br>') || 'Não foi possível realizar a transferência.',
        );
      },
    });
  }
  async excluir(m: MovimentoFinanceiroDTO) {
    if (!m.editavel) return;
    if (
      !(await this.confirmDialog.confirm(
        'Excluir movimentação',
        'Deseja excluir esta movimentação manual?',
      ))
    )
      return;
    this.service.delete(m.id).subscribe({
      next: () => {
        this.alerts.success('Movimentação excluída.');
        this.carregarExtrato();
      },
      error: (e) =>
        this.alerts.error(
          e?.error?.messages?.join('<br>') || 'Não foi possível excluir a movimentação.',
        ),
    });
  }
  badgeColor(tipo: TipoFluxoCaixaEnum) {
    return tipo === TipoFluxoCaixaEnum.ENTRADA ? 'success' : 'danger';
  }
  private tipoManual() {
    if (
      this.manual.origem === OrigemMovimentoEnum.APORTE ||
      this.manual.origem === OrigemMovimentoEnum.EMPRESTIMO
    )
      return TipoFluxoCaixaEnum.ENTRADA;
    if (
      this.manual.origem === OrigemMovimentoEnum.RETIRADA ||
      this.manual.origem === OrigemMovimentoEnum.TARIFA
    )
      return TipoFluxoCaixaEnum.SAIDA;
    return this.manual.tipo;
  }
  private novoManual(): MovimentoFinanceiroCreateDTO {
    return {
      descricao: '',
      valor: 0,
      data: this.hoje(),
      observacao: '',
      formaPagamento: this.configuracaoGeral?.formaPagamentoPadrao as FormaPagamentoEnum | undefined,
      contaFinanceiraId: this.configuracaoGeral?.contaPadraoBaixaId,
    };
  }
  private novaTransferencia(): TransferenciaFinanceiraDTO {
    return { valor: 0, data: this.hoje(), descricao: 'Transferência entre contas', observacao: '' };
  }
  private hoje() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}
