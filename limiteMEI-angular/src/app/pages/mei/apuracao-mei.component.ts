import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, timeout } from 'rxjs';
import { ApuracaoMeiDTO } from '../../dtos/mei/apuracao-mei.dto';
import { ApuracaoMeiService } from '../../services/apuracao-mei.service';
import { AlertService } from '../../shared/components-commons/infra/alert-component/alert.service';
import { MonthYearBoxComponent } from '../../shared/components-commons/infra/month-year-box-component/month.year.box.component';
import { ToolbarComponent } from '../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';
import { ConfirmDialogService } from '../../shared/components-commons/infra/confirm-dialog-component/confirm.dialog.service';
import { MeiLimitAlertComponent } from '../../shared/components-commons/mei-limit-alert-component/mei-limit-alert.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, MonthYearBoxComponent, ToolbarComponent, MeiLimitAlertComponent],
  template: `
    <toolbar-filter tituloPagina="Apuração do MEI" [listMode]="true" [showNew]="false"
      [loading]="loading" (filtrar)="carregar()" (limpar)="periodoAtual()" />
    <section class="page">
      <header class="page-heading"><div><span>FATURAMENTO E LIMITE</span><h1>Apuração do MEI</h1><p>Receitas por competência que compõem o faturamento da empresa.</p></div>@if(apuracao){<div class="closing-actions"><button (click)="abrirRelatorio()"><i class="bi bi-file-earmark-text"></i> Relatório mensal</button>@if(apuracao.situacaoFechamento==='FECHADA'){<button class="warning" (click)="reabrir()">Reabrir apuração</button>}@else{<button class="success" (click)="fechar()">Fechar apuração</button>}</div>}</header>
      <div class="filter"><month-year-box-component label="Período de referência" [clearButton]="false" [(dataField)]="competencia" /></div>
      @if (apuracao) {
        <div class="cards">
          <article class="clickable" (click)="mostrarIncluidos()"><span>Faturamento do mês</span><strong>{{apuracao.totalMes|currency:'BRL'}}</strong><small>{{nomeMes(apuracao.mesReferencia)}}/{{apuracao.ano}} · ver composição</small></article>
          <article><span>Acumulado no ano</span><strong>{{apuracao.acumuladoAno|currency:'BRL'}}</strong><small>Até o período selecionado</small></article>
          <article><span>Limite aplicável</span><strong>{{apuracao.limiteAplicavel|currency:'BRL'}}</strong><small>{{apuracao.mesesLimite}} meses considerados</small></article>
          <article [class.danger]="apuracao.saldoDisponivel < 0"><span>Saldo disponível</span><strong>{{apuracao.saldoDisponivel|currency:'BRL'}}</strong><small>Antes de atingir o teto</small></article>
        </div>
        @if(apuracao.situacaoFechamento==='FECHADA'){<div class="closed"><i class="bi bi-lock"></i><div><strong>Apuração fechada</strong><span>Fechada em {{apuracao.dataFechamento|date:'dd/MM/yyyy HH:mm'}} por {{apuracao.usuarioFechamento}}. O relatório usa a fotografia deste fechamento.</span></div></div>}@else if(apuracao.situacaoFechamento==='REABERTA'){<div class="reopened"><i class="bi bi-unlock"></i><div><strong>Apuração reaberta</strong><span>{{apuracao.motivoReabertura}}</span></div></div>}
        <mei-limit-alert [percentual]="apuracao.percentualUtilizado" [projecaoAnual]="apuracao.projecaoAnual" [alerta]="apuracao.alertaLimite" />
        <div class="limit-card">
          <div><span>Uso do limite anual</span><strong>{{apuracao.percentualUtilizado|number:'1.2-2'}}%</strong></div>
          <div class="progress"><i [style.width.%]="percentualBarra" [class.warning]="apuracao.percentualUtilizado >= 75" [class.danger]="apuracao.percentualUtilizado >= 100"></i></div>
          <small>Projeção anual: <strong>{{apuracao.projecaoAnual|currency:'BRL'}}</strong> · Capacidade média restante: <strong>{{apuracao.mediaMensalDisponivel|currency:'BRL'}} por mês</strong></small>
        </div>
        @if(apuracao.competenciasAnterioresAbertas.length){<div class="sequence-warning"><i class="bi bi-calendar-x"></i><div><strong>Existem competências anteriores abertas</strong><span>Feche primeiro: {{competenciasAbertasLabel}}. O fechamento deve seguir a ordem mensal.</span></div></div>}
        @if(apuracao.quantidadeLancamentosAbertos){<div class="financial-warning"><i class="bi bi-clock-history"></i><div><strong>{{apuracao.quantidadeLancamentosAbertos}} lançamento(s) financeiro(s) ainda aberto(s)</strong><span>@if(apuracao.quantidadeLancamentosVencidos){Destes, {{apuracao.quantidadeLancamentosVencidos}} estão vencidos.} A situação financeira não impede a apuração por competência, mas merece conferência.</span></div></div>}
        @if (apuracao.quantidadePendencias) { <div class="fiscal-warning"><i class="bi bi-exclamation-triangle"></i><div><strong>{{apuracao.quantidadePendencias}} pendência(s) fiscal(is)</strong><span>Existem receitas cuja categoria exige documento fiscal sem emissão informada.</span></div><button (click)="mostrarPendencias()">Conferir</button></div> }
        <section class="fiscal-check"><div class="fiscal-heading"><div><span>CONFERÊNCIA FISCAL</span><h2>Documentos da competência</h2><p>Compare as notas emitidas com os lançamentos que formam o faturamento.</p></div><a routerLink="/app/fiscal/documentos">Ver documentos fiscais <i class="bi bi-arrow-right"></i></a></div>
          <div class="fiscal-cards"><article><span>Faturamento documentado</span><strong>{{apuracao.conferenciaFiscal.percentualDocumentado|number:'1.2-2'}}%</strong><small>{{apuracao.comDocumentoFiscalMes|currency:'BRL'}} de {{apuracao.totalMes|currency:'BRL'}}</small></article><article><span>Notas emitidas</span><strong>{{apuracao.conferenciaFiscal.quantidadeEmitidos}}</strong><small>{{apuracao.conferenciaFiscal.valorEmitidos|currency:'BRL'}}</small></article><article><span>Notas canceladas</span><strong>{{apuracao.conferenciaFiscal.quantidadeCancelados}}</strong><small>{{apuracao.conferenciaFiscal.valorCancelados|currency:'BRL'}}</small></article><article [class.attention]="apuracao.conferenciaFiscal.quantidadeDivergencias"><span>Divergências de vínculo</span><strong>{{apuracao.conferenciaFiscal.quantidadeDivergencias}}</strong><small>Valor da nota diferente do vinculado</small></article></div>
          @if(apuracao.conferenciaFiscal.documentos.length){<div class="table-responsive"><table><thead><tr><th>Emissão</th><th>Documento</th><th>Cliente</th><th>Situação</th><th>Valor</th><th>Vinculado</th><th>Diferença</th></tr></thead><tbody>@for(doc of apuracao.conferenciaFiscal.documentos;track doc.id){<tr><td>{{doc.dataEmissao|date:'dd/MM/yyyy':'UTC'}}</td><td><strong>{{doc.tipo}} {{doc.numero}}</strong></td><td>{{doc.cliente||'Não informado'}}</td><td><span class="status" [class.ok]="doc.situacao==='EMITIDO'">{{doc.situacao==='EMITIDO'?'Emitido':doc.situacao==='CANCELADO'?'Cancelado':'Substituído'}}</span></td><td>{{doc.valorTotal|currency:'BRL'}}</td><td>{{doc.valorVinculado|currency:'BRL'}}</td><td [class.difference]="doc.diferenca!==0">{{doc.diferenca|currency:'BRL'}}</td></tr>}</tbody></table></div>}@else{<div class="fiscal-empty"><i class="bi bi-receipt"></i> Nenhum documento fiscal emitido nesta competência.</div>}
        </section>
        <div class="naturezas"><button (click)="filtrarNatureza('COMERCIO')"><i class="bi bi-shop"></i><span>Comércio</span><strong>{{apuracao.comercioMes|currency:'BRL'}}</strong></button><button (click)="filtrarNatureza('INDUSTRIA')"><i class="bi bi-gear"></i><span>Indústria</span><strong>{{apuracao.industriaMes|currency:'BRL'}}</strong></button><button (click)="filtrarNatureza('SERVICOS')"><i class="bi bi-briefcase"></i><span>Serviços</span><strong>{{apuracao.servicosMes|currency:'BRL'}}</strong></button><button (click)="filtrarDocumento(true)"><i class="bi bi-receipt"></i><span>Com documento fiscal</span><strong>{{apuracao.comDocumentoFiscalMes|currency:'BRL'}}</strong></button><button (click)="filtrarDocumento(false)"><i class="bi bi-receipt-cutoff"></i><span>Sem documento fiscal</span><strong>{{apuracao.semDocumentoFiscalMes|currency:'BRL'}}</strong></button></div>
        <div class="table-responsive"><table><thead><tr><th>Mês</th><th>Comércio</th><th>Indústria</th><th>Serviços</th><th>Com documento</th><th>Sem documento</th><th>Total</th></tr></thead><tbody>@for(item of apuracao.meses;track item.mes){<tr [class.selected]="item.mes===apuracao.mesReferencia"><td>{{nomeMes(item.mes)}}</td><td>{{item.comercio|currency:'BRL'}}</td><td>{{item.industria|currency:'BRL'}}</td><td>{{item.servicos|currency:'BRL'}}</td><td>{{item.comDocumentoFiscal|currency:'BRL'}}</td><td>{{item.semDocumentoFiscal|currency:'BRL'}}</td><td><strong>{{item.total|currency:'BRL'}}</strong></td></tr>}</tbody></table></div>
        <section class="details"><div class="details-heading"><div><h2>Composição de {{nomeMes(apuracao.mesReferencia)}}</h2><p>Confira quais lançamentos formaram a apuração e quais ficaram de fora.</p></div><div class="detail-filters"><button [class.active]="filtroSituacao==='TODOS'" (click)="limparFiltroDetalhe()">Todos</button><button [class.active]="filtroSituacao==='INCLUIDOS'" (click)="mostrarIncluidos()">Computados</button><button [class.active]="filtroSituacao==='PENDENCIAS'" (click)="mostrarPendencias()">Pendências</button><button [class.active]="filtroSituacao==='NAO_INCLUIDOS'" (click)="mostrarNaoIncluidos()">Não computados</button></div></div>
          <div class="table-responsive"><table><thead><tr><th>Lançamento</th><th>Categoria</th><th>Natureza</th><th>Valor</th><th>Documento fiscal</th><th>Apuração</th><th>Ação</th></tr></thead><tbody>@if(!detalhesFiltrados.length){<tr><td colspan="7" class="state">Nenhum lançamento encontrado neste filtro.</td></tr>}@else{@for(item of detalhesFiltrados;track item.lancamentoId){<tr><td><strong>{{item.descricao}}</strong>@if(item.pendenciaFiscal){<small class="pending">{{item.descricaoPendencia}}</small>}</td><td>{{item.categoria}}</td><td>{{naturezaLabel(item.natureza)}}</td><td>{{item.valor|currency:'BRL'}}</td><td><span class="status" [class.ok]="item.documentoFiscalEmitido">{{item.documentoFiscalEmitido?'Emitido':'Não emitido'}}</span></td><td><span class="status" [class.ok]="item.incluido" [title]="item.motivoNaoInclusao||''">{{item.incluido?'Computado':item.motivoNaoInclusao}}</span></td><td><button class="edit" (click)="abrirLancamento(item.lancamentoId)" title="Editar lançamento"><i class="bi bi-pencil"></i></button></td></tr>}}</tbody></table></div>
        </section>
      } @else if (loading) { <div class="state"><span class="spinner-border spinner-border-sm"></span> Calculando apuração...</div> }
    </section>
  `,
  styles: [`
    .page{margin-top:1rem;padding:1.5rem;background:#fff;border-radius:12px}.page>header span,.fiscal-heading>div>span{font-size:.75rem;color:#5570f1;font-weight:700}.page h1{margin:.2rem 0}.page>header p,.cards span,.cards small,.limit-card span,.limit-card small,.naturezas span,.details p,.fiscal-heading p,.fiscal-cards span,.fiscal-cards small{color:#687080}.page-heading{display:flex;justify-content:space-between;gap:1rem}.closing-actions{display:flex;align-items:start;gap:.5rem}.closing-actions button{padding:.55rem .8rem;border:1px solid #d6dce9;border-radius:6px;background:#fff}.closing-actions .success{border-color:#198754;color:#187747}.closing-actions .warning{border-color:#d5a51e;color:#806000}.closed,.reopened,.sequence-warning,.financial-warning{display:flex;gap:.7rem;padding:1rem;border-radius:9px}.closed div,.reopened div,.sequence-warning div,.financial-warning div{display:flex;flex-direction:column}.closed{background:#eaf8f0;color:#187747}.reopened{background:#fff9e8;color:#806000}.sequence-warning{margin-top:1rem;background:#fff0f0;color:#a12a35}.financial-warning{margin-top:1rem;background:#eef4ff;color:#365b91}.filter{margin-top:1.5rem}.cards{display:grid;grid-template-columns:repeat(4,minmax(170px,1fr));gap:1rem;margin:1.5rem 0}.cards article,.naturezas button{display:flex;flex-direction:column;padding:1rem;border:1px solid #e5e8ef;border-radius:10px;background:#fff;text-align:left}.clickable,.naturezas button{cursor:pointer}.clickable:hover,.naturezas button:hover{border-color:#8fa0f5;background:#fafbff}.cards strong{font-size:1.25rem}.cards .danger strong{color:#c33}.limit-card{padding:1rem;border:1px solid #dce2f5;border-radius:10px;background:#f8f9ff}.limit-card>div:first-child{display:flex;justify-content:space-between}.limit-card>div>strong{font-size:1.25rem}.progress{height:12px;margin:.8rem 0;background:#e2e6f2;border-radius:8px;overflow:hidden}.progress i{display:block;height:100%;background:#5570f1}.progress i.warning{background:#e0a800}.progress i.danger{background:#dc3545}.naturezas{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:1rem;margin:1.5rem 0}.naturezas i{color:#5570f1}.naturezas strong{font-size:1.15rem}.fiscal-warning{display:flex;align-items:center;gap:.8rem;margin-top:1rem;padding:1rem;border:1px solid #f0d58a;border-radius:10px;background:#fff9e8;color:#765800}.fiscal-warning div{display:flex;flex:1;flex-direction:column}.fiscal-warning button,.detail-filters button{border:1px solid #d6dce9;border-radius:6px;background:#fff;padding:.45rem .7rem}.fiscal-check{margin-top:1.5rem;padding:1rem;border:1px solid #e2e6ef;border-radius:10px}.fiscal-heading{display:flex;justify-content:space-between;gap:1rem}.fiscal-heading h2{font-size:1.1rem;margin:.2rem 0}.fiscal-heading p{margin:0}.fiscal-heading a{color:#5570f1;text-decoration:none;font-size:.85rem}.fiscal-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:.7rem;margin:1rem 0}.fiscal-cards article{display:flex;flex-direction:column;padding:.8rem;background:#f8f9fb;border-radius:8px}.fiscal-cards strong{font-size:1.15rem}.fiscal-cards .attention{background:#fff4df}.fiscal-cards .attention strong,.difference{color:#a15c00;font-weight:700}.fiscal-empty{padding:1.5rem;text-align:center;color:#687080}.table-responsive{overflow:auto}table{width:100%;border-collapse:collapse}th,td{padding:.8rem;border-bottom:1px solid #eceef3;text-align:left;white-space:nowrap}th{font-size:.8rem;color:#687080}.selected{background:#f4f6ff}.state{padding:3rem;text-align:center;color:#687080}.details{margin-top:2rem;padding-top:1.5rem;border-top:1px solid #e5e8ef}.details-heading{display:flex;justify-content:space-between;gap:1rem}.details h2{font-size:1.1rem;margin:0}.detail-filters{display:flex;gap:.4rem;flex-wrap:wrap}.detail-filters button.active{border-color:#5570f1;background:#5570f1;color:#fff}.status{display:inline-block;padding:.25rem .5rem;border-radius:12px;background:#fff0f0;color:#a12a35;font-size:.78rem}.status.ok{background:#eaf8f0;color:#187747}.pending{display:block;color:#a06a00}.edit{width:34px;height:34px;border:1px solid #d8dce5;border-radius:6px;background:#fff}@media(max-width:900px){.cards,.fiscal-cards{grid-template-columns:repeat(2,1fr)}.naturezas{grid-template-columns:1fr}.details-heading,.page-heading,.fiscal-heading{flex-direction:column}}
  `],
})
export class ApuracaoMeiComponent implements OnInit, OnDestroy {
  loading = false;
  competencia = '';
  apuracao?: ApuracaoMeiDTO;
  filtroSituacao: 'TODOS' | 'INCLUIDOS' | 'PENDENCIAS' | 'NAO_INCLUIDOS' = 'TODOS';
  filtroNatureza?: 'COMERCIO' | 'INDUSTRIA' | 'SERVICOS';
  filtroDocumento?: boolean;
  private readonly meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  private loadingWatchdog?: ReturnType<typeof setTimeout>;

  constructor(private service: ApuracaoMeiService, private alerts: AlertService,
              private router: Router, private route: ActivatedRoute, private changeDetector: ChangeDetectorRef,
              private confirm: ConfirmDialogService) {}
  ngOnInit() {
    const ano = Number(this.route.snapshot.queryParamMap.get('ano'));
    const mes = Number(this.route.snapshot.queryParamMap.get('mes'));
    if (ano >= 2000 && mes >= 1 && mes <= 12) {
      this.competencia = `${ano}-${String(mes).padStart(2, '0')}-01`;
      this.carregar();
    } else {
      this.periodoAtual();
    }
  }
  ngOnDestroy() { this.pararLoading(false); }
  get percentualBarra() { return Math.min(100, Math.max(0, this.apuracao?.percentualUtilizado ?? 0)); }
  get competenciasAbertasLabel() { return (this.apuracao?.competenciasAnterioresAbertas ?? []).map(mes => `${String(mes).padStart(2,'0')}/${this.apuracao?.ano}`).join(', '); }
  nomeMes(mes: number) { return this.meses[mes - 1]; }
  naturezaLabel(natureza?: string) { return natureza === 'COMERCIO' ? 'Comércio' : natureza === 'INDUSTRIA' ? 'Indústria' : natureza === 'SERVICOS' ? 'Serviços' : 'Não informada'; }
  get detalhesFiltrados() {
    return (this.apuracao?.detalhes ?? []).filter(item =>
      (this.filtroSituacao === 'TODOS' ||
        (this.filtroSituacao === 'INCLUIDOS' && item.incluido) ||
        (this.filtroSituacao === 'PENDENCIAS' && item.pendenciaFiscal) ||
        (this.filtroSituacao === 'NAO_INCLUIDOS' && !item.incluido)) &&
      (!this.filtroNatureza || item.natureza === this.filtroNatureza) &&
      (this.filtroDocumento === undefined || item.documentoFiscalEmitido === this.filtroDocumento));
  }
  limparFiltroDetalhe() { this.filtroSituacao = 'TODOS'; this.filtroNatureza = undefined; this.filtroDocumento = undefined; }
  mostrarIncluidos() { this.limparFiltroDetalhe(); this.filtroSituacao = 'INCLUIDOS'; }
  mostrarPendencias() { this.limparFiltroDetalhe(); this.filtroSituacao = 'PENDENCIAS'; }
  mostrarNaoIncluidos() { this.limparFiltroDetalhe(); this.filtroSituacao = 'NAO_INCLUIDOS'; }
  filtrarNatureza(natureza: 'COMERCIO' | 'INDUSTRIA' | 'SERVICOS') { this.mostrarIncluidos(); this.filtroNatureza = natureza; }
  filtrarDocumento(emitido: boolean) { this.mostrarIncluidos(); this.filtroDocumento = emitido; }
  abrirLancamento(id: number) { this.router.navigate(['/app/financeiro/lancamentos/editar', id]); }
  abrirRelatorio() { const [ano, mes] = this.competencia.split('-').map(Number); this.router.navigate(['/app/financeiro/mei/relatorio', ano, mes]); }
  async fechar() {
    if (!this.apuracao) return;
    if (this.apuracao.quantidadePendencias > 0) {
      this.alerts.error('Resolva as pendências fiscais antes de fechar a apuração.');
      this.mostrarPendencias();
      return;
    }
    if (this.apuracao.competenciasAnterioresAbertas.length > 0) {
      this.alerts.error(`Feche primeiro as competências anteriores: ${this.competenciasAbertasLabel}.`);
      return;
    }
    const confirmado = await this.confirm.confirm({
      title: `Fechar apuração de ${this.nomeMes(this.apuracao.mesReferencia)}/${this.apuracao.ano}`,
      message: 'Confira os totalizadores que serão congelados no fechamento:',
      confirmText: 'Confirmar fechamento',
      cancelText: 'Voltar',
      summaryItems: [
        { label: 'Comércio', value: this.moeda(this.apuracao.comercioMes) },
        { label: 'Indústria', value: this.moeda(this.apuracao.industriaMes) },
        { label: 'Serviços', value: this.moeda(this.apuracao.servicosMes) },
        { label: 'Com documento fiscal', value: this.moeda(this.apuracao.comDocumentoFiscalMes) },
        { label: 'Sem documento fiscal', value: this.moeda(this.apuracao.semDocumentoFiscalMes) },
        { label: 'Lançamentos ainda abertos', value: String(this.apuracao.quantidadeLancamentosAbertos) },
        { label: 'Lançamentos vencidos', value: String(this.apuracao.quantidadeLancamentosVencidos) },
        { label: 'Total do mês', value: this.moeda(this.apuracao.totalMes), highlight: true },
      ],
    });
    if (!confirmado) return;
    const [ano, mes] = this.competencia.split('-').map(Number); this.loading = true;
    this.service.fechar(ano, mes).pipe(finalize(() => this.pararLoading())).subscribe({next:async r=>{this.apuracao=r;this.alerts.success('Apuração fechada com sucesso.');const imprimir=await this.confirm.confirm({title:'Apuração fechada',message:'Deseja abrir o Relatório Mensal de Receitas Brutas para imprimir ou salvar em PDF?',confirmText:'Abrir relatório',cancelText:'Agora não'});if(imprimir)this.abrirRelatorio();},error:e=>this.alerts.error(e?.error?.messages?.join('<br>')||'Não foi possível fechar a apuração.')});
  }
  async reabrir() {
    const motivo = await this.confirm.requestText({title:'Reabrir apuração',message:'A apuração voltará a usar os valores atuais dos lançamentos.',inputLabel:'Motivo da reabertura',confirmText:'Reabrir'}); if(!motivo)return;
    const [ano, mes] = this.competencia.split('-').map(Number); this.loading = true;
    this.service.reabrir(ano, mes, motivo).pipe(finalize(() => this.pararLoading())).subscribe({next:r=>{this.apuracao=r;this.alerts.success('Apuração reaberta.');},error:e=>this.alerts.error(e?.error?.messages?.join('<br>')||'Não foi possível reabrir a apuração.')});
  }
  periodoAtual() {
    const hoje = new Date();
    this.competencia = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-01`;
    this.carregar();
  }
  carregar() {
    if (!this.competencia) { this.alerts.warning('Informe o período de referência.'); return; }
    if (this.loading) return;
    const [ano, mes] = this.competencia.split('-').map(Number);
    this.loading = true;
    this.loadingWatchdog = setTimeout(() => {
      if (!this.loading) return;
      this.loading = false;
      this.alerts.error('A apuração não iniciou corretamente. Atualize a página e tente novamente.');
      this.changeDetector.detectChanges();
    }, 21000);
    this.service.apurar(ano, mes).pipe(
      timeout(20000),
      finalize(() => this.pararLoading()),
    ).subscribe({
      next: resultado => {
        this.apuracao = resultado;
        this.changeDetector.detectChanges();
      },
      error: e => {
        const mensagem = e?.name === 'TimeoutError'
          ? 'A apuração excedeu 20 segundos. Verifique se a API está pausada no modo Debug e tente novamente.'
          : e?.error?.messages?.join('<br>') || 'Não foi possível calcular a apuração do MEI.';
        this.alerts.error(mensagem);
      },
    });
  }
  private pararLoading(atualizarTela = true) {
    this.loading = false;
    if (this.loadingWatchdog) clearTimeout(this.loadingWatchdog);
    this.loadingWatchdog = undefined;
    if (atualizarTela) this.changeDetector.detectChanges();
  }
  private moeda(valor: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor ?? 0);
  }
}
