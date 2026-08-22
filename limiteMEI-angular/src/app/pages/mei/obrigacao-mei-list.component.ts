import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ObrigacaoMeiCreateDTO, ObrigacaoMeiDTO } from '../../dtos/mei/obrigacao-mei.dto';
import { SituacaoObrigacaoMeiEnum, SITUACAO_OBRIGACAO_MEI_LABELS } from '../../enums/obrigacao.mei.enum';
import { ObrigacaoMeiService } from '../../services/obrigacao-mei.service';
import { DateBoxComponent } from '../../shared/components-commons/infra/date-box-component/date.box.component';
import { AlertService } from '../../shared/components-commons/infra/alert-component/alert.service';
import { NumberBoxComponent } from '../../shared/components-commons/infra/number-box-component/number.box.component';
import { SwitchComponent } from '../../shared/components-commons/infra/switch-component/switch.component';
import { ToolbarComponent } from '../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ToolbarComponent, NumberBoxComponent, DateBoxComponent, SwitchComponent],
  template: `
    <toolbar-filter tituloPagina="Obrigações MEI" [listMode]="true" [showNew]="false" [loading]="loading" (filtrar)="carregar()" (limpar)="exercicioAtual()" />

    <section class="obligation-page">
      <header>
        <div>
          <span>CALENDÁRIO DO MEI</span>
          <h1>DAS mensal por exercício</h1>
          <p>Escolha o ano e controle o pagamento de cada referência. O vencimento é sempre dia 20.</p>
        </div>
        <label class="year-field">
          <span>Exercício</span>
          <input type="number" min="2000" max="2100" [(ngModel)]="ano" [disabled]="loading">
        </label>
      </header>

      @if(loading){
        <div class="state"><span class="spinner-border spinner-border-sm"></span> Carregando obrigações...</div>
      } @else if(!itens.length) {
        <div class="state"><i class="bi bi-info-circle"></i> Nenhuma referência MEI encontrada para este exercício.</div>
      } @else {
        <div class="cards">
          @for(item of itens; track item.competencia){
            <article [class.paid]="isPago(item)" [class.late]="isAtrasado(item)">
              <div class="card-head">
                <div>
                  <span>{{item.competencia | date:'MMM/yyyy':'UTC'}}</span>
                  <h2>DAS mensal</h2>
                </div>
                <strong [class]="item.situacao.toLowerCase()">{{situacaoLabels[item.situacao]}}</strong>
              </div>

              <div class="due">
                <span>Vencimento</span>
                <b>{{item.vencimento | date:'dd/MM/yyyy':'UTC'}}</b>
              </div>

              <div class="fields">
                <number-box-component label="Valor" width="160px" [(dataField)]="item.valor" [disabled]="salvando[item.competencia]" />
                <switch-component label="Pago" [dataField]="isPago(item)" (dataFieldChange)="setPago(item,$event)" [disabled]="salvando[item.competencia]" />
                <date-box-component label="Data de pagamento" [clearButton]="true" [dataField]="item.dataPagamento??''" (dataFieldChange)="item.dataPagamento=$event||undefined" [disabled]="salvando[item.competencia] || !isPago(item)" />
              </div>

              <label class="obs">
                <span>Observação</span>
                <input type="text" [(ngModel)]="item.observacao" [disabled]="salvando[item.competencia]">
              </label>

              <div class="receipt">
                @if(item.id && item.possuiComprovante){
                  <small><i class="bi bi-paperclip"></i> {{item.comprovanteNome || 'Comprovante anexado'}}</small>
                } @else if(item.id) {
                  <small>Sem comprovante.</small>
                } @else {
                  <small>Salve a referência para anexar comprovante.</small>
                }
                @if(item.id){
                  <input type="file" (change)="selecionarComprovante(item,$event)" [disabled]="salvando[item.competencia]">
                }
              </div>

              <button type="button" class="primary" [disabled]="salvando[item.competencia]" (click)="salvar(item)">
                {{salvando[item.competencia] ? 'Salvando...' : 'Salvar referência'}}
              </button>
            </article>
          }
        </div>
      }
    </section>
  `,
  styles: [`
    .obligation-page{margin-top:1rem}
    header{display:flex;justify-content:space-between;align-items:end;gap:1rem;margin-bottom:1rem}
    header span,.year-field span{font-size:.72rem;letter-spacing:.12em;color:#5570f1;font-weight:800}
    h1{font-size:1.45rem;font-weight:800;color:#18384a;margin:.25rem 0}
    p{margin:0;color:#718493}.year-field{display:flex;flex-direction:column;gap:.35rem}.year-field input{width:140px;height:38px;border:1px solid #ced4da;border-radius:8px;padding:0 .65rem}
    .cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(285px,1fr));gap:1rem}
    article{padding:1rem;background:#fff;border:1px solid #e5e9ef;border-radius:14px;box-shadow:0 6px 20px rgba(27,69,58,.04)}
    article.paid{border-color:#bfe8d1;background:#fbfffd}article.late{border-color:#ffd59d;background:#fffaf3}
    .card-head{display:flex;justify-content:space-between;gap:1rem;align-items:start}.card-head span{font-size:.8rem;color:#5570f1;font-weight:800;text-transform:uppercase}.card-head h2{font-size:1rem;margin:.15rem 0;color:#18384a}.card-head strong{padding:.25rem .55rem;border-radius:999px;background:#eef1ff;color:#4055ba;font-size:.75rem}.card-head strong.pago{background:#eaf8f0;color:#187747}.card-head strong.atrasado{background:#fff0f0;color:#b02a37}
    .due{display:flex;justify-content:space-between;margin:1rem 0;padding:.65rem;border-radius:9px;background:#f8f9fb}.due span{color:#718493}.due b{color:#18384a}
    .fields{display:flex;align-items:end;gap:.8rem;flex-wrap:wrap}.obs{display:block;margin:.9rem 0}.obs span{display:block;margin-bottom:.35rem;color:#34495e;font-size:.8rem;font-weight:700}.obs input{width:100%;height:38px;border:1px solid #ced4da;border-radius:8px;padding:0 .65rem}
    .receipt{display:flex;flex-direction:column;gap:.5rem;margin:.8rem 0;color:#718493}.receipt input{max-width:100%}
    .primary{width:100%;border:0;border-radius:9px;background:#5570f1;color:#fff;padding:.6rem;font-weight:800}
    .state{display:flex;align-items:center;justify-content:center;gap:.6rem;padding:2rem;background:#fff;border:1px solid #e5e9ef;border-radius:12px;color:#718493}
    @media(max-width:700px){header{align-items:flex-start;flex-direction:column}.cards{grid-template-columns:1fr}}
  `],
})
export class ObrigacaoMeiListComponent implements OnInit {
  ano = new Date().getFullYear();
  itens: ObrigacaoMeiDTO[] = [];
  loading = false;
  salvando: Record<string, boolean> = {};
  readonly situacaoLabels = SITUACAO_OBRIGACAO_MEI_LABELS;

  constructor(private service: ObrigacaoMeiService, private alerts: AlertService, private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    this.carregar();
  }

  exercicioAtual() {
    this.ano = new Date().getFullYear();
    this.carregar();
  }

  carregar() {
    if (!this.ano || this.ano < 2000) {
      this.alerts.warning('Informe um exercício válido.');
      return;
    }
    this.loading = true;
    this.service.listarExercicio(this.ano).pipe(finalize(() => {
      this.loading = false;
      this.changeDetector.detectChanges();
    })).subscribe({
      next: res => {
        this.itens = res.body ?? [];
        this.changeDetector.detectChanges();
      },
      error: e => {
        this.alerts.error(e?.error?.messages?.join('<br>') || 'Não foi possível carregar as obrigações.');
        this.changeDetector.detectChanges();
      },
    });
  }

  isPago(item: ObrigacaoMeiDTO) {
    return item.situacao === SituacaoObrigacaoMeiEnum.PAGO;
  }

  isAtrasado(item: ObrigacaoMeiDTO) {
    return item.situacao === SituacaoObrigacaoMeiEnum.ATRASADO;
  }

  setPago(item: ObrigacaoMeiDTO, pago: boolean) {
    item.situacao = pago ? SituacaoObrigacaoMeiEnum.PAGO : SituacaoObrigacaoMeiEnum.PENDENTE;
    if (!pago) item.dataPagamento = undefined;
    if (pago && !item.dataPagamento) item.dataPagamento = new Date().toISOString().slice(0, 10);
  }

  salvar(item: ObrigacaoMeiDTO) {
    if ((item.valor ?? 0) < 0) {
      this.alerts.warning('O valor não pode ser negativo.');
      return;
    }
    if (item.situacao !== SituacaoObrigacaoMeiEnum.PAGO) {
      this.alerts.warning('Marque a referência como paga antes de salvar.');
      return;
    }
    if (!item.dataPagamento) {
      this.alerts.warning('Informe a data de pagamento.');
      return;
    }
    const dto: ObrigacaoMeiCreateDTO = {
      tipo: item.tipo,
      competencia: item.competencia,
      situacao: item.situacao === SituacaoObrigacaoMeiEnum.PAGO ? SituacaoObrigacaoMeiEnum.PAGO : SituacaoObrigacaoMeiEnum.PENDENTE,
      valor: item.valor ?? 0,
      dataPagamento: item.dataPagamento,
      observacao: item.observacao ?? '',
    };
    this.salvando[item.competencia] = true;
    const request$ = item.id ? this.service.update(item.id, dto) : this.service.create(dto);
    request$.pipe(finalize(() => {
      this.salvando[item.competencia] = false;
      this.changeDetector.detectChanges();
    })).subscribe({
      next: res => {
        Object.assign(item, res.body);
        this.alerts.success('Referência salva com sucesso.');
        this.changeDetector.detectChanges();
      },
      error: e => {
        this.alerts.error(e?.error?.messages?.join('<br>') || 'Não foi possível salvar a referência.');
        this.changeDetector.detectChanges();
      },
    });
  }

  selecionarComprovante(item: ObrigacaoMeiDTO, event: Event) {
    const arquivo = (event.target as HTMLInputElement).files?.[0];
    if (!item.id || !arquivo) return;
    this.salvando[item.competencia] = true;
    this.service.salvarComprovante(item.id, arquivo).pipe(finalize(() => {
      this.salvando[item.competencia] = false;
      this.changeDetector.detectChanges();
    })).subscribe({
      next: res => {
        Object.assign(item, res.body);
        this.alerts.success('Comprovante enviado com sucesso.');
        this.changeDetector.detectChanges();
      },
      error: e => {
        this.alerts.error(e?.error?.messages?.join('<br>') || 'Não foi possível enviar o comprovante.');
        this.changeDetector.detectChanges();
      },
    });
  }
}
