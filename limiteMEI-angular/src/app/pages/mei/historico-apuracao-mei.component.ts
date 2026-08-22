import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { HistoricoApuracaoMeiDTO, HistoricoApuracaoMeiItemDTO } from '../../dtos/mei/apuracao-mei.dto';
import { ApuracaoMeiService } from '../../services/apuracao-mei.service';
import { AlertService } from '../../shared/components-commons/infra/alert-component/alert.service';
import { ConfirmDialogService } from '../../shared/components-commons/infra/confirm-dialog-component/confirm.dialog.service';
import { NumberBoxComponent } from '../../shared/components-commons/infra/number-box-component/number.box.component';
import { ToolbarComponent } from '../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';
import { MeiLimitAlertComponent } from '../../shared/components-commons/mei-limit-alert-component/mei-limit-alert.component';

@Component({
  standalone: true,
  imports: [CommonModule, NumberBoxComponent, ToolbarComponent, MeiLimitAlertComponent],
  template: `
    <toolbar-filter tituloPagina="Histórico de apurações" [listMode]="true" [showNew]="false"
      [loading]="loading" (filtrar)="carregar()" (limpar)="anoAtual()" />
    <section class="page">
      <header><span>CONTROLE ANUAL DO MEI</span><h1>Histórico de apurações</h1><p>Acompanhe o faturamento, os fechamentos e o consumo do limite em cada competência.</p></header>
      <div class="filter"><number-box-component label="Ano" width="150px" [(dataField)]="ano" /></div>
      @if (historico) {
        <div class="cards"><article><span>Faturamento no ano</span><strong>{{historico.totalAno|currency:'BRL'}}</strong></article><article><span>Limite aplicável</span><strong>{{historico.limiteAplicavel|currency:'BRL'}}</strong></article><article [class.danger]="historico.percentualUtilizado>=100"><span>Limite utilizado</span><strong>{{historico.percentualUtilizado|number:'1.2-2'}}%</strong></article></div>
        <mei-limit-alert [percentual]="historico.percentualUtilizado" [alerta]="historico.alertaLimite" />
        <div class="table-responsive"><table><thead><tr><th>Competência</th><th>Situação</th><th>Faturamento mensal</th><th>Acumulado anual</th><th>Uso do teto</th><th>Fechamento</th><th class="actions-head">Ações</th></tr></thead><tbody>
          @for(item of historico.meses;track item.mes){<tr><td><strong>{{nomeMes(item.mes)}}/{{historico.ano}}</strong></td><td><span class="badge" [class.closed]="item.situacao==='FECHADA'" [class.reopened]="item.situacao==='REABERTA'">{{situacao(item)}}</span></td><td>{{item.totalMes|currency:'BRL'}}</td><td>{{item.acumuladoAno|currency:'BRL'}}</td><td><span [class.over]="item.percentualUtilizado>=100">{{item.percentualUtilizado|number:'1.2-2'}}%</span></td><td>@if(item.dataFechamento){<small>{{item.dataFechamento|date:'dd/MM/yyyy HH:mm'}}<br>{{item.usuarioFechamento}}</small>}@else{<span>—</span>}</td><td class="actions"><button title="Visualizar apuração" (click)="visualizar(item)"><i class="bi bi-eye"></i></button><button title="Abrir relatório" (click)="relatorio(item)"><i class="bi bi-printer"></i></button>@if(item.situacao==='FECHADA'){<button class="warning" title="Reabrir" (click)="reabrir(item)"><i class="bi bi-unlock"></i></button>}@else{<button class="success" title="Fechar" (click)="fechar(item)"><i class="bi bi-lock"></i></button>}</td></tr>}
        </tbody></table></div>
      } @else if(loading) { <div class="state"><span class="spinner-border spinner-border-sm"></span> Carregando histórico...</div> }
    </section>
  `,
  styles: [`
    .page{margin-top:1rem;padding:1.5rem;background:#fff;border-radius:12px}.page>header>span{font-size:.75rem;color:#5570f1;font-weight:700}.page h1{margin:.2rem 0}.page header p,.cards span{color:#687080}.filter{margin:1.5rem 0}.cards{display:grid;grid-template-columns:repeat(3,minmax(180px,1fr));gap:1rem;margin-bottom:1.5rem}.cards article{display:flex;flex-direction:column;padding:1rem;border:1px solid #e5e8ef;border-radius:10px}.cards strong{font-size:1.25rem}.danger strong,.over{color:#c33}.table-responsive{overflow:auto}table{width:100%;border-collapse:collapse}th,td{padding:.75rem;border-bottom:1px solid #eceef3;text-align:left;white-space:nowrap}th{font-size:.8rem;color:#687080}.badge{display:inline-block;padding:.3rem .55rem;border-radius:12px;background:#eef0f5;color:#596070}.badge.closed{background:#eaf8f0;color:#187747}.badge.reopened{background:#fff4d6;color:#806000}.actions-head,.actions{text-align:right}.actions{display:flex;justify-content:flex-end;gap:.35rem}.actions button{width:34px;height:34px;border:1px solid #d8dce5;border-radius:6px;background:#fff}.actions .success{color:#187747;border-color:#9bd1b5}.actions .warning{color:#806000;border-color:#e4c96f}.state{padding:3rem;text-align:center;color:#687080}@media(max-width:800px){.cards{grid-template-columns:1fr}}
  `],
})
export class HistoricoApuracaoMeiComponent implements OnInit {
  ano = new Date().getFullYear();
  loading = false;
  historico?: HistoricoApuracaoMeiDTO;
  private readonly meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  constructor(private service: ApuracaoMeiService, private router: Router, private alerts: AlertService,
              private confirm: ConfirmDialogService, private changeDetector: ChangeDetectorRef) {}
  ngOnInit() { this.carregar(); }
  anoAtual() { this.ano = new Date().getFullYear(); this.carregar(); }
  nomeMes(mes: number) { return this.meses[mes - 1]; }
  situacao(item: HistoricoApuracaoMeiItemDTO) { return item.situacao === 'FECHADA' ? 'Fechada' : item.situacao === 'REABERTA' ? 'Reaberta' : 'Aberta'; }
  carregar() {
    if (!this.ano || this.ano < 2000) { this.alerts.error('Informe um ano válido.'); return; }
    this.loading = true;
    this.service.historico(this.ano).pipe(finalize(() => { this.loading = false; this.changeDetector.detectChanges(); })).subscribe({
      next: resultado => { this.historico = resultado; this.changeDetector.detectChanges(); },
      error: e => this.alerts.error(e?.error?.messages?.join('<br>') || 'Não foi possível carregar o histórico.'),
    });
  }
  visualizar(item: HistoricoApuracaoMeiItemDTO) { this.router.navigate(['/app/financeiro/mei/apuracao'], { queryParams: { ano: this.ano, mes: item.mes } }); }
  relatorio(item: HistoricoApuracaoMeiItemDTO) { this.router.navigate(['/app/financeiro/mei/relatorio', this.ano, item.mes]); }
  async fechar(item: HistoricoApuracaoMeiItemDTO) {
    if (!await this.confirm.confirm({title:`Fechar ${this.nomeMes(item.mes)}/${this.ano}`,message:`Faturamento do mês: ${this.moeda(item.totalMes)}. Deseja confirmar o fechamento?`,confirmText:'Confirmar fechamento',cancelText:'Voltar'})) return;
    this.loading = true;
    this.service.fechar(this.ano, item.mes).pipe(finalize(() => {this.loading=false;this.changeDetector.detectChanges();})).subscribe({next:()=>{this.alerts.success('Apuração fechada.');this.carregar();},error:e=>this.alerts.error(e?.error?.messages?.join('<br>')||'Não foi possível fechar a apuração.')});
  }
  async reabrir(item: HistoricoApuracaoMeiItemDTO) {
    const motivo = await this.confirm.requestText({title:`Reabrir ${this.nomeMes(item.mes)}/${this.ano}`,message:'Informe o motivo da reabertura.',inputLabel:'Motivo',confirmText:'Reabrir'}); if(!motivo)return;
    this.loading = true;
    this.service.reabrir(this.ano,item.mes,motivo).pipe(finalize(()=>{this.loading=false;this.changeDetector.detectChanges();})).subscribe({next:()=>{this.alerts.success('Apuração reaberta.');this.carregar();},error:e=>this.alerts.error(e?.error?.messages?.join('<br>')||'Não foi possível reabrir a apuração.')});
  }
  private moeda(valor:number){return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(valor??0);}
}
