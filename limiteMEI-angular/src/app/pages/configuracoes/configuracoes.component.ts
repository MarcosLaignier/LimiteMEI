import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, forkJoin, timeout } from 'rxjs';
import { ConfiguracaoAlertaLimiteDTO, ConfiguracaoGeralDTO } from '../../dtos/configuracao/configuracao.alerta.limite';
import { FormaPagamentoEnum, FORMA_PAGAMENTO_LABELS } from '../../enums/forma.pagamento.enum';
import { ConfiguracaoService } from '../../services/configuracao.service';
import { ContaFinanceiraSelectorComponent } from '../../shared/components-commons/conta-financeira-selector-component/conta-financeira.selector.component';
import { AlertService } from '../../shared/components-commons/infra/alert-component/alert.service';
import { NumberBoxComponent } from '../../shared/components-commons/infra/number-box-component/number.box.component';
import { SelectEnumComponent } from '../../shared/components-commons/infra/select-enum-component/select.enum.component';
import { TabComponent } from '../../shared/components-commons/infra/tabs-component/tab.component';
import { TabsComponent } from '../../shared/components-commons/infra/tabs-component/tabs.component';
import { ToolbarComponent } from '../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToolbarComponent,
    TabsComponent,
    TabComponent,
    ContaFinanceiraSelectorComponent,
    NumberBoxComponent,
    SelectEnumComponent
  ],
  template: `
    <toolbar-filter
      tituloPagina="Configurações"
      [listMode]="false"
      [showNew]="false"
      [loading]="saving"
      (salvar)="salvar()"
      (limpar)="carregar()" />

    <section class="page">
      <tabs-component>
        <tab title="Gerais" icon="bi-sliders">
          <header>
            <span>GERAIS</span>
            <h1>Preferências padrão</h1>
            <p>Defina os valores sugeridos automaticamente nas rotinas operacionais.</p>
          </header>

          @if (loading) {
            <div class="state"><i class="bi bi-arrow-repeat spin"></i><span>Carregando configurações...</span></div>
          } @else {
            <div class="form-section">
              <conta-financeira-selector-component
                label="Conta padrão para baixas"
                width="435px"
                [(dataField)]="gerais.contaPadraoBaixaId"
                [disabled]="saving" />

              <select-enum
                label="Forma de pagamento padrão"
                width="280px"
                [enumObject]="formasPagamento"
                [optionLabels]="formaPagamentoLabels"
                [(dataField)]="gerais.formaPagamentoPadrao"
                [disabled]="saving" />

              <number-box-component
                label="Valor padrão do DAS"
                width="220px"
                [dataField]="gerais.valorPadraoDas ?? 0"
                (dataFieldChange)="gerais.valorPadraoDas = $event"
                [disabled]="saving" />
            </div>

            <div class="rules">
              <i class="bi bi-info-circle"></i>
              <span>Essas preferências serão usadas como sugestão nas baixas financeiras. O usuário ainda poderá alterar os campos no momento da baixa.</span>
            </div>
          }
        </tab>

        <tab title="MEI" icon="bi-speedometer2">
          <header>
            <span>MEI</span>
            <h1>Alertas do limite</h1>
            <p>Configure as faixas usadas no dashboard, apuração e acompanhamento do teto anual.</p>
          </header>

          @if (loading) {
            <div class="state"><i class="bi bi-arrow-repeat spin"></i><span>Carregando configurações...</span></div>
          } @else {
            <div class="alert-list">
              @for (alerta of alertas; track alerta.id ?? alerta.percentual) {
                <article [class.required]="alerta.obrigatorio" [class.inactive]="!alerta.ativo">
                  <div class="alert-main">
                    <label>
                      <span>Percentual</span>
                      <input type="number" min="1" max="999" step="0.01"
                             [(ngModel)]="alerta.percentual"
                             [disabled]="saving || alerta.obrigatorio" />
                    </label>
                    <div>
                      <strong>{{ alerta.percentual | number:'1.0-2' }}%</strong>
                      <small>{{ alerta.obrigatorio ? 'Obrigatório do sistema' : 'Alerta configurável' }}</small>
                    </div>
                  </div>

                  <label class="switch">
                    <input type="checkbox" [(ngModel)]="alerta.ativo" [disabled]="saving || alerta.obrigatorio" />
                    <span>{{ alerta.ativo ? 'Ativo' : 'Inativo' }}</span>
                  </label>
                </article>
              }
            </div>

            <div class="rules">
              <i class="bi bi-info-circle"></i>
              <span>Os alertas de 100% e 120% são obrigatórios e permanecem ativos. As demais faixas podem ser ajustadas ou desativadas conforme a rotina da empresa.</span>
            </div>
          }
        </tab>

      </tabs-component>
    </section>
  `,
  styles: [`
    .page{margin-top:1rem;padding:1.5rem;background:#fff;border:1px solid #e5e9ef;border-radius:12px}
    header{margin-bottom:1.2rem}header span{font-size:.75rem;color:#5570f1;font-weight:800}h1{margin:.2rem 0;color:#203746;font-size:1.35rem}p{margin:0;color:#687080}
    .alert-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem;max-width:900px}
    article{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem;border:1px solid #e2e6ef;border-radius:8px;background:#fff}
    article.required{border-color:#c9d4ff;background:#f8f9ff}article.inactive{opacity:.62}
    .alert-main{display:flex;align-items:end;gap:.8rem}label{margin:0}.alert-main label{display:flex;flex-direction:column;gap:.35rem}
    label span,small{font-size:.76rem;color:#687080}input[type=number]{width:110px;height:38px;padding:0 .55rem;border:1px solid #ced4da;border-radius:6px}
    input:disabled{background:#f3f5f8;color:#6c757d}strong{display:block;color:#203746;font-size:1.05rem}
    .switch{display:flex;align-items:center;gap:.45rem;white-space:nowrap}.switch input{width:1rem;height:1rem}
    .rules,.state{display:flex;align-items:center;gap:.65rem;max-width:900px;margin-top:1rem;padding:.85rem;border-radius:8px;background:#f8f9fb;color:#5d6872}
    .state{justify-content:center;padding:2rem}.spin{display:inline-block;animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
    .form-section{display:flex;align-items:end;flex-wrap:wrap;gap:15px;max-width:900px}
    @media(max-width:640px){article{align-items:flex-start;flex-direction:column}.alert-list{grid-template-columns:1fr}}
  `]
})
export class ConfiguracoesComponent implements OnInit {
  alertas: ConfiguracaoAlertaLimiteDTO[] = [];
  gerais: ConfiguracaoGeralDTO = {};
  loading = false;
  saving = false;
  readonly formasPagamento = FormaPagamentoEnum;
  readonly formaPagamentoLabels = FORMA_PAGAMENTO_LABELS;

  constructor(private service: ConfiguracaoService, private alerts: AlertService,
              private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.loading = true;
    forkJoin({
      alertas: this.service.listarAlertasLimite(),
      gerais: this.service.carregarGerais()
    }).pipe(
      timeout(15000),
      finalize(() => {
        this.loading = false;
        this.changeDetector.detectChanges();
      })
    ).subscribe({
      next: resultado => {
        this.alertas = resultado.alertas;
        this.gerais = resultado.gerais ?? {};
        this.changeDetector.detectChanges();
      },
      error: e => this.alerts.error(e?.error?.messages?.join('<br>') || 'Não foi possível carregar as configurações.')
    });
  }

  salvar() {
    if (this.alertas.some(item => !item.percentual || item.percentual <= 0)) {
      this.alerts.warning('Informe percentuais válidos para os alertas.');
      return;
    }
    this.saving = true;
    forkJoin({
      alertas: this.service.atualizarAlertasLimite(this.alertas.map(item => ({
        id: item.id,
        percentual: item.percentual,
        ativo: item.ativo
      }))),
      gerais: this.service.atualizarGerais({
        contaPadraoBaixaId: this.gerais.contaPadraoBaixaId,
        formaPagamentoPadrao: this.gerais.formaPagamentoPadrao || undefined,
        valorPadraoDas: this.gerais.valorPadraoDas ?? undefined
      })
    }).pipe(finalize(() => {
      this.saving = false;
      this.changeDetector.detectChanges();
    })).subscribe({
      next: resultado => {
        this.alertas = resultado.alertas;
        this.gerais = resultado.gerais ?? {};
        this.alerts.success('Configurações salvas com sucesso.');
        this.changeDetector.detectChanges();
      },
      error: e => this.alerts.error(e?.error?.messages?.join('<br>') || 'Não foi possível salvar as configurações.')
    });
  }
}
