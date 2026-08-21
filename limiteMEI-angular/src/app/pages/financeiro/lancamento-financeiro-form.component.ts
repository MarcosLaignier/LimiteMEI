import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BaseFormCrud } from '../../shared/components-commons/core/base.form.crud';
import {
  LancamentoFinanceiroCreateDTO,
  LancamentoFinanceiroDTO,
  HistoricoFinanceiroDTO,
} from '../../dtos/lancamento/lancamento.financeiro';
import { LancamentoFinanceiroService } from '../../services/lancamento-financeiro.service';
import { BaixaFinanceiraService } from '../../services/baixa-financeira.service';
import {
  BaixaFinanceiraCreateDTO,
  BaixaFinanceiraDTO,
} from '../../dtos/lancamento/baixa.financeira';
import { ToolbarComponent } from '../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';
import { TextBoxComponent } from '../../shared/components-commons/infra/text-box-component/text.box.component';
import { NumberBoxComponent } from '../../shared/components-commons/infra/number-box-component/number.box.component';
import { DateBoxComponent } from '../../shared/components-commons/infra/date-box-component/date.box.component';
import { MonthYearBoxComponent } from '../../shared/components-commons/infra/month-year-box-component/month.year.box.component';
import { TextAreaComponent } from '../../shared/components-commons/infra/text-area-component/text.area.component';
import { SelectEnumComponent } from '../../shared/components-commons/infra/select-enum-component/select.enum.component';
import { CategoriaSelectorComponent } from '../../shared/components-commons/categoria-selector-component/categoria.selector.component';
import { PessoaSelectorComponent } from '../../shared/components-commons/pessoa-selector-component/pessoa.selector.component';
import { PessoaDTO } from '../../dtos/pessoa/pessoa.dto';
import { TipoLancamentoEnum } from '../../enums/tipo.lancamento.enum';
import { TipoMovimentoEnum } from '../../enums/tipo.movimento.enum';
import { FormaPagamentoEnum, FORMA_PAGAMENTO_LABELS } from '../../enums/forma.pagamento.enum';
import { SwitchComponent } from '../../shared/components-commons/infra/switch-component/switch.component';
import { AlertService } from '../../shared/components-commons/infra/alert-component/alert.service';
import { ConfirmDialogService } from '../../shared/components-commons/infra/confirm-dialog-component/confirm.dialog.service';
import { ContaFinanceiraSelectorComponent } from '../../shared/components-commons/conta-financeira-selector-component/conta-financeira.selector.component';
import { ParcelamentoEditorComponent } from '../../shared/components-commons/parcelamento-editor-component/parcelamento.editor.component';
import { RecorrenciaEditorComponent, ConfiguracaoRecorrencia } from '../../shared/components-commons/recorrencia-editor-component/recorrencia.editor.component';
import { DocumentoFiscalSelectorComponent } from '../../shared/components-commons/documento-fiscal-selector-component/documento-fiscal.selector.component';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToolbarComponent,
    TextBoxComponent,
    NumberBoxComponent,
    DateBoxComponent,
    MonthYearBoxComponent,
    TextAreaComponent,
    SelectEnumComponent,
    CategoriaSelectorComponent,
    PessoaSelectorComponent,
    SwitchComponent,
    ContaFinanceiraSelectorComponent,
    ParcelamentoEditorComponent,
    RecorrenciaEditorComponent,
    DocumentoFiscalSelectorComponent,
  ],
  template: `<toolbar-filter
      tituloPagina="Lançamento financeiro"
      [listMode]="false"
      [loading]="loading"
      (salvar)="save()"
      (limpar)="clear()"
    />
    <section class="card">
      <h2>Dados do lançamento</h2>
      @if (model.situacao === 'CANCELADO') {
        <div class="cancelled"><strong>Lançamento cancelado</strong><span>{{ model.motivoCancelamento }}</span><small>{{ model.dataCancelamento | date: 'dd/MM/yyyy HH:mm' }} por {{ model.usuarioCancelamento }}</small></div>
      }
      <div class="form-row">
        <text-box-component
          label="Descrição"
          width="435px"
          [(dataField)]="model.descricao"
          [disabled]="loading"
        />
        <number-box-component
          label="Valor"
          width="180px"
          [(dataField)]="model.valor"
          [disabled]="loading"
        />
      </div>
      <div class="form-row">
        <select-enum
          label="Tipo"
          width="200px"
          [enumObject]="tipoEnum"
          [(dataField)]="model.tipo"
          (dataFieldChange)="tipoChanged()"
          [disabled]="loading"
        /><categoria-selector-component
          [tipo]="tipoCategoria"
          [(dataField)]="model.categoriaId"
          [disabled]="loading"
        />
      </div>
      <div class="form-row">
        <month-year-box-component
          label="Competência"
          [clearButton]="true"
          [(dataField)]="model.dataCompetencia"
          [disabled]="loading"
        /><date-box-component
          label="Vencimento"
          [clearButton]="true"
          [(dataField)]="model.dataVencimento"
          [disabled]="loading"
        />
      </div>
      <div class="form-row full-row">
        <pessoa-selector-component
          label="Pessoa vinculada"
          [pessoa]="pessoa"
          (pessoaChange)="setPessoa($event)"
          [disabled]="loading"
        />
      </div>
      <div class="form-row full-row">
        <text-area-component
          label="Observação"
          width="435px"
          [(dataField)]="model.observacao"
          [disabled]="loading"
        />
      </div>
      <div class="form-row">
        <switch-component
          label="Lançamento ativo"
          [(dataField)]="model.ativo"
          [disabled]="loading"
        />
        @if (model.tipo === tipoEnum.RECEBER) {
          <switch-component
            label="Documento fiscal emitido"
            [(dataField)]="model.documentoFiscalEmitido"
            (dataFieldChange)="documentoFiscalChanged($event)"
            [disabled]="loading"
          />
        }
      </div>
      @if (model.tipo === tipoEnum.RECEBER && model.documentoFiscalEmitido) {
        <div class="form-row fiscal-link">
          <documento-fiscal-selector-component [(documentoId)]="model.documentoFiscalId" [disabled]="loading" />
          <number-box-component label="Valor vinculado à nota" width="220px" [(dataField)]="model.valorDocumentoFiscal" [disabled]="loading" />
          <small>A nota deve ser cadastrada previamente no módulo Fiscal.</small>
        </div>
      }
      @if (!id) {
        <div class="installment-option">
          <switch-component
            label="Parcelar lançamento"
            [(dataField)]="parcelado"
            [disabled]="loading"
            (dataFieldChange)="parcelamentoChanged($event)"
          />
          <small>Permite entrada, parcelas mensais e valores ou vencimentos personalizados.</small>
          @if (parcelado) {
            <parcelamento-editor-component
              [total]="model.valor"
              [competencia]="model.dataCompetencia"
              [primeiroVencimento]="model.dataVencimento"
              (parcelasChange)="model.parcelas = $event"
            />
          }
        </div>
        <div class="installment-option">
          <switch-component
            label="Lançamento recorrente"
            [(dataField)]="recorrente"
            [disabled]="loading"
            (dataFieldChange)="recorrenciaChanged($event)"
          />
          <small>Gera lançamentos independentes em uma frequência e período definidos.</small>
          @if (recorrente) {
            <recorrencia-editor-component
              [valor]="model.valor"
              [competencia]="model.dataCompetencia"
              [primeiroVencimento]="model.dataVencimento"
              (configuracaoChange)="setRecorrencia($event)"
            />
          }
        </div>
      }
      @if (!id && !parcelado && !recorrente) {
        <div class="automatic-payment">
          <switch-component
            label="Baixar automaticamente ao salvar"
            [(dataField)]="model.baixarAutomaticamente"
            [disabled]="loading"
            (dataFieldChange)="automaticPaymentChanged($event)"
          />
          <small>Cria uma baixa no valor total e deixa o lançamento como liquidado.</small>
          @if (model.baixarAutomaticamente) {
            <div class="form-row">
              <date-box-component
                label="Data da liquidação"
                [clearButton]="true"
                [dataField]="model.dataLiquidacao ?? ''"
                (dataFieldChange)="model.dataLiquidacao = $event || undefined"
                [disabled]="loading"
              />
              <select-enum
                label="Forma de pagamento"
                width="240px"
                [enumObject]="formaEnum"
                [optionLabels]="formaLabels"
                [(dataField)]="model.formaPagamento"
                [disabled]="loading"
              />
              <conta-financeira-selector-component
                [(dataField)]="model.contaFinanceiraId"
                [disabled]="loading"
              />
            </div>
          }
        </div>
      }
    </section>
    @if (id) {
      <section class="card">
        <div class="section-heading"><h2>Baixas financeiras</h2>@if(model.situacao !== 'CANCELADO'){<button class="danger-outline" (click)="cancelarLancamento()">Cancelar lançamento</button>}</div>
        <div class="fields">
          <number-box-component
            label="Valor principal"
            width="180px"
            [(dataField)]="baixa.valorPrincipal"
            [disabled]="baixando"
          /><number-box-component
            label="Juros"
            width="150px"
            [(dataField)]="baixa.juros"
            [disabled]="baixando"
          /><number-box-component
            label="Multa"
            width="150px"
            [(dataField)]="baixa.multa"
            [disabled]="baixando"
          /><number-box-component
            label="Desconto"
            width="150px"
            [(dataField)]="baixa.desconto"
            [disabled]="baixando"
          /><date-box-component
            label="Data"
            [clearButton]="true"
            [(dataField)]="baixa.dataLiquidacao"
            [disabled]="baixando"
          /><select-enum
            label="Forma de pagamento"
            width="240px"
            [enumObject]="formaEnum"
            [optionLabels]="formaLabels"
            [(dataField)]="baixa.formaPagamento"
            [disabled]="baixando"
          /><conta-financeira-selector-component
            [(dataField)]="baixa.contaFinanceiraId"
            [disabled]="baixando"
          /><button class="primary" [disabled]="baixando" (click)="baixar()">
            {{ baixando ? 'Baixando...' : 'Registrar baixa' }}
          </button>
        </div>
        <div class="payment-total"><span>Valor efetivamente pago</span><strong>{{valorEfetivoBaixa|currency:'BRL'}}</strong><small>Principal + juros + multa − desconto</small></div>
        @if (baixas.length) {
          <div class="baixas">
            @for (item of baixas; track item.id) {
              <div>
                <span>{{ item.dataLiquidacao }}</span
                ><strong>{{ item.valorPago | currency: 'BRL' }}</strong
                ><span title="Principal + juros + multa − desconto">Principal: {{item.valorPrincipal|currency:'BRL'}}</span
                ><span>{{ formaLabels[item.formaPagamento] }}</span
                ><span>{{ item.contaFinanceiraNome || 'Conta não informada' }}</span
                >@if(item.ativo){<button (click)="estornarBaixa(item)">Estornar</button>}@else{<span class="reversed" title="{{item.motivoEstorno}}">Estornada</span>}
              </div>
            }
          </div>
        } @else {
          <p class="empty">Nenhuma baixa registrada.</p>
        }
      </section>
      <section class="card">
        <h2>Histórico</h2>
        @if (historico.length) {
          <div class="history">@for(item of historico;track item.id){<article><i class="bi bi-clock-history"></i><div><strong>{{eventoLabels[item.evento]}}</strong><span>{{item.descricao}}</span><small>{{item.dataHora|date:'dd/MM/yyyy HH:mm'}} · {{item.usuario}}</small></div></article>}</div>
        } @else { <p class="empty">Nenhum evento registrado.</p> }
      </section>
    }`,
  styles: [
    `
      .card {
        background: #fff;
        border: 0;
        border-radius: 12px;
        padding: 1.5rem;
        margin-top: 1rem;
      }
      .fields {
        display: flex;
        align-items: end;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .form-row {
        display: flex;
        align-items: end;
        gap: 1rem;
        flex-wrap: wrap;
        margin-top: 1rem;
      }
      .full-row {
        width: 100%;
      }
      .full-row pessoa-selector-component,
      .full-row text-area-component {
        width: 100%;
      }
      .automatic-payment {
        margin-top: 1.5rem;
        padding: 1rem;
        border: 1px solid #dce2f5;
        border-radius: 10px;
        background: #f8f9ff;
      }
      .installment-option{margin-top:1.5rem;padding:1rem;border:1px solid #dce2f5;border-radius:10px;background:#fff}.installment-option>small{display:block;color:#687080;margin-top:.35rem}
      .automatic-payment small {
        display: block;
        color: #687080;
        margin-top: 0.35rem;
      }
      .fields pessoa-selector-component,
      .fields text-area-component {
        flex-basis: 100%;
      }
      .primary {
        height: 38px;
        background: #5570f1;
        color: white;
        border: 0;
        border-radius: 6px;
        padding: 0 1.2rem;
      }
      .baixas {
        margin-top: 1rem;
      }
      .baixas > div {
        display: grid;
        grid-template-columns: 120px 130px 190px 180px 1fr 80px;
        padding: 0.75rem;
        border-top: 1px solid #eee;
      }
      .baixas button {
        border: 0;
        background: none;
        color: #c33;
      }
      .section-heading{display:flex;align-items:center;justify-content:space-between;gap:1rem}.danger-outline{border:1px solid #dc3545;background:#fff;color:#dc3545;border-radius:6px;padding:.5rem .8rem}.cancelled{display:flex;flex-direction:column;gap:.25rem;margin:1rem 0;padding:1rem;border:1px solid #efb8bd;background:#fff6f7;border-radius:8px;color:#842029}.cancelled small{color:#687080}.reversed{color:#687080;font-size:.85rem}.history article{display:flex;gap:.75rem;padding:.8rem 0;border-top:1px solid #eee}.history article div{display:flex;flex-direction:column}.history span,.history small{color:#687080}.history small{font-size:.78rem;margin-top:.2rem}
      .payment-total{display:inline-flex;flex-direction:column;margin-top:1rem;padding:.8rem 1rem;border:1px solid #dce2f5;border-radius:8px;background:#f8f9ff}.payment-total span,.payment-total small{color:#687080}.payment-total strong{font-size:1.2rem;color:#334bc4}
      .fiscal-link{padding:1rem;border:1px solid #dce2f5;border-radius:8px;background:#f8f9ff}.fiscal-link small{max-width:260px;color:#687080}
      .empty {
        color: #687080;
        margin-top: 1rem;
      }
    `,
  ],
})
export class LancamentoFinanceiroFormComponent
  extends BaseFormCrud<LancamentoFinanceiroDTO, LancamentoFinanceiroCreateDTO>
  implements OnInit
{
  protected service: LancamentoFinanceiroService;
  protected routeBase = '/app/financeiro/lancamentos';
  readonly tipoEnum = TipoLancamentoEnum;
  readonly formaEnum = FormaPagamentoEnum;
  readonly formaLabels = FORMA_PAGAMENTO_LABELS;
  pessoa?: PessoaDTO;
  baixas: BaixaFinanceiraDTO[] = [];
  historico: HistoricoFinanceiroDTO[] = [];
  readonly eventoLabels: Record<string, string> = {
    CRIACAO_LANCAMENTO: 'Lançamento criado', ALTERACAO_LANCAMENTO: 'Lançamento alterado',
    CANCELAMENTO_LANCAMENTO: 'Lançamento cancelado', EXCLUSAO_LANCAMENTO: 'Lançamento excluído',
    BAIXA_REALIZADA: 'Baixa realizada', BAIXA_ESTORNADA: 'Baixa estornada'
  };
  baixa: BaixaFinanceiraCreateDTO = this.novaBaixa();
  baixando = false;
  parcelado = false;
  recorrente = false;
  constructor(
    service: LancamentoFinanceiroService,
    router: Router,
    route: ActivatedRoute,
    private baixaService: BaixaFinanceiraService,
    private alerts: AlertService,
    private confirmDialog: ConfirmDialogService,
  ) {
    super(router, route);
    this.service = service;
    this.clear();
  }
  ngOnInit() {
    this.initForm();
    if (this.route.snapshot.paramMap.get('id')) {
      this.carregarBaixas();
      this.carregarHistorico();
    }
  }
  get tipoCategoria() {
    return this.model.tipo === TipoLancamentoEnum.RECEBER
      ? TipoMovimentoEnum.RECEITA
      : this.model.tipo === TipoLancamentoEnum.PAGAR
        ? TipoMovimentoEnum.DESPESA
        : undefined;
  }
  override clear() {
    this.parcelado = false;
    this.recorrente = false;
    this.model = {
      descricao: '',
      valor: 0,
      dataCompetencia: '',
      dataVencimento: '',
      ativo: true,
      observacao: '',
      baixarAutomaticamente: false,
      documentoFiscalEmitido: false,
      valorDocumentoFiscal: 0,
    };
    this.pessoa = undefined;
  }
  override loadById(id: number) {
    this.loading = true;
    this.service.getById(id).subscribe({
      next: (r) => {
        if (r.body) {
          this.model = {
            ...r.body,
            observacao: r.body.observacao ?? '',
            baixarAutomaticamente: false,
            valorDocumentoFiscal: r.body.valorDocumentoFiscal ?? 0,
          };
          if (r.body.pessoaId)
            this.pessoa = { id: r.body.pessoaId, nomeRazaoSocial: r.body.pessoaNome } as PessoaDTO;
        }
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        this.alerts.error(
          e?.error?.messages?.join('<br>') || 'Não foi possível carregar o lançamento.',
        );
      },
    });
  }
  tipoChanged() {
    this.model.categoriaId = undefined;
    if (this.model.tipo !== TipoLancamentoEnum.RECEBER) {
      this.model.documentoFiscalEmitido = false;
      this.model.documentoFiscalId = undefined;
      this.model.valorDocumentoFiscal = 0;
    }
  }
  documentoFiscalChanged(enabled: boolean) {
    if (enabled) {
      this.model.valorDocumentoFiscal = this.model.valor;
      return;
    }
    this.model.documentoFiscalId = undefined;
    this.model.valorDocumentoFiscal = 0;
  }
  setPessoa(p?: PessoaDTO) {
    this.pessoa = p;
    this.model.pessoaId = p?.id;
  }
  automaticPaymentChanged(enabled: boolean) {
    if (enabled) {
      this.model.dataLiquidacao = new Date().toISOString().slice(0, 10);
      return;
    }
    this.model.dataLiquidacao = undefined;
    this.model.formaPagamento = undefined;
    this.model.contaFinanceiraId = undefined;
  }
  parcelamentoChanged(enabled: boolean) {
    this.model.parcelas = [];
    if (enabled) {
      this.recorrente = false;
      this.documentoFiscalChanged(false);
      this.model.documentoFiscalEmitido = false;
      this.model.recorrencias = [];
      this.model.baixarAutomaticamente = false;
      this.automaticPaymentChanged(false);
    }
  }
  recorrenciaChanged(enabled: boolean) {
    this.model.recorrencias = [];
    this.model.periodicidadeRecorrencia = undefined;
    if (enabled) {
      this.parcelado = false;
      this.documentoFiscalChanged(false);
      this.model.documentoFiscalEmitido = false;
      this.model.parcelas = [];
      this.model.baixarAutomaticamente = false;
      this.automaticPaymentChanged(false);
    }
  }
  setRecorrencia(configuracao: ConfiguracaoRecorrencia) {
    this.model.periodicidadeRecorrencia = configuracao.periodicidade;
    this.model.recorrencias = configuracao.ocorrencias;
  }
  override validateSave() {
    if (this.model.situacao === 'CANCELADO') {
      this.alerts.warning('Um lançamento cancelado não pode ser alterado.');
      return false;
    }
    if (
      !this.model.descricao ||
      !this.model.tipo ||
      !this.model.categoriaId ||
      !this.model.valor ||
      !this.model.dataCompetencia ||
      !this.model.dataVencimento
    ) {
      this.alerts.warning('Preencha descrição, tipo, categoria, valor e datas.');
      return false;
    }
    if (this.model.documentoFiscalEmitido && (!this.model.documentoFiscalId || !this.model.valorDocumentoFiscal)) {
      this.alerts.warning('Selecione a nota fiscal e informe o valor vinculado.');
      return false;
    }
    if (this.parcelado) {
      if (!this.model.parcelas || this.model.parcelas.length < 2) {
        this.alerts.warning('Gere ao menos duas parcelas, ou uma entrada e uma parcela.');
        return false;
      }
      const totalParcelas = Math.round(this.model.parcelas.reduce((s, p) => s + Number(p.valor || 0), 0) * 100);
      if (totalParcelas !== Math.round(this.model.valor * 100)) {
        this.alerts.warning('A soma da entrada e das parcelas deve ser igual ao valor total.');
        return false;
      }
    }
    if (this.recorrente && (!this.model.periodicidadeRecorrencia || !this.model.recorrencias || this.model.recorrencias.length < 2)) {
      this.alerts.warning('Gere ao menos duas ocorrências para o lançamento recorrente.');
      return false;
    }
    if (
      this.model.baixarAutomaticamente &&
      (!this.model.dataLiquidacao || !this.model.formaPagamento || !this.model.contaFinanceiraId)
    ) {
      this.alerts.warning('Informe a data, a forma de pagamento e a conta da baixa automática.');
      return false;
    }
    return true;
  }
  carregarBaixas() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.baixaService.listar(id).subscribe({
      next: (r) => (this.baixas = r),
      error: () => this.alerts.error('Não foi possível carregar as baixas.'),
    });
  }
  carregarHistorico() {
    this.service.historico(Number(this.id)).subscribe({
      next: (r) => (this.historico = r),
      error: () => this.alerts.error('Não foi possível carregar o histórico.'),
    });
  }
  baixar() {
    const id = Number(this.id);
    if (
      !this.baixa.valorPrincipal ||
      !this.baixa.dataLiquidacao ||
      !this.baixa.formaPagamento ||
      !this.baixa.contaFinanceiraId
    ) {
      this.alerts.warning('Preencha os dados da baixa.');
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
    this.baixaService.criar(id, this.baixa).subscribe({
      next: () => {
        this.baixando = false;
        this.baixa = this.novaBaixa();
        this.carregarBaixas();
        this.carregarHistorico();
        this.loadById(id);
        this.alerts.success('Baixa registrada com sucesso.');
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
  async estornarBaixa(item: BaixaFinanceiraDTO) {
    const motivo = await this.confirmDialog.requestText({
      title: 'Estornar baixa',
      message: 'O estorno preservará a baixa e criará uma movimentação inversa no caixa.',
      inputLabel: 'Motivo do estorno',
      confirmText: 'Estornar',
    });
    if (!motivo) return;
    this.baixaService.estornar(Number(this.id), item.id, motivo).subscribe({
      next: () => {
        this.carregarBaixas();
        this.carregarHistorico();
        this.loadById(Number(this.id));
        this.alerts.success('Baixa estornada com sucesso.');
      },
      error: (e) => this.alerts.error(e?.error?.messages?.join('<br>') || 'Não foi possível estornar a baixa.'),
    });
  }
  async cancelarLancamento() {
    const motivo = await this.confirmDialog.requestText({
      title: this.model.parcelamentoId
        ? 'Cancelar parcelamento'
        : this.model.recorrenciaId ? 'Cancelar recorrência' : 'Cancelar lançamento',
      message: this.model.parcelamentoId
        ? 'Todas as parcelas serão canceladas e deixarão de aceitar novas baixas.'
        : this.model.recorrenciaId
          ? 'Todas as ocorrências serão canceladas e deixarão de aceitar novas baixas.'
          : 'O lançamento deixará de aceitar alterações e novas baixas.',
      inputLabel: 'Motivo do cancelamento',
      confirmText: 'Cancelar lançamento',
    });
    if (!motivo) return;
    if (this.model.parcelamentoId) {
      this.service.cancelarParcelamento(this.model.parcelamentoId, motivo).subscribe({
        next: () => {
          this.loadById(Number(this.id));
          this.carregarHistorico();
          this.alerts.success('Parcelamento cancelado.');
        },
        error: (e) => this.alerts.error(e?.error?.messages?.join('<br>') || 'Não foi possível cancelar o parcelamento.'),
      });
      return;
    }
    if (this.model.recorrenciaId) {
      this.service.cancelarRecorrencia(this.model.recorrenciaId, motivo).subscribe({
        next: () => {
          this.loadById(Number(this.id));
          this.carregarHistorico();
          this.alerts.success('Recorrência cancelada.');
        },
        error: (e) => this.alerts.error(e?.error?.messages?.join('<br>') || 'Não foi possível cancelar a recorrência.'),
      });
      return;
    }
    this.service.cancelar(Number(this.id), motivo).subscribe({
      next: (r) => {
        this.model = { ...r, observacao: r.observacao ?? '', baixarAutomaticamente: false };
        this.carregarHistorico();
        this.alerts.success('Lançamento cancelado.');
      },
      error: (e) => this.alerts.error(e?.error?.messages?.join('<br>') || 'Não foi possível cancelar o lançamento.'),
    });
  }
  private novaBaixa(): BaixaFinanceiraCreateDTO {
    return {
      valorPrincipal: 0,
      juros: 0,
      multa: 0,
      desconto: 0,
      dataLiquidacao: new Date().toISOString().slice(0, 10),
    };
  }
}
