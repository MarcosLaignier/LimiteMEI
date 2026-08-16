import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LancamentoFinanceiroDTO, GrupoLancamentoUpdateDTO } from '../../../dtos/lancamento/lancamento.financeiro';
import { LancamentoFinanceiroService } from '../../../services/lancamento-financeiro.service';
import { ToolbarComponent } from '../../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';
import { TextBoxComponent } from '../../../shared/components-commons/infra/text-box-component/text.box.component';
import { TextAreaComponent } from '../../../shared/components-commons/infra/text-area-component/text.area.component';
import { NumberBoxComponent } from '../../../shared/components-commons/infra/number-box-component/number.box.component';
import { DateBoxComponent } from '../../../shared/components-commons/infra/date-box-component/date.box.component';
import { MonthYearBoxComponent } from '../../../shared/components-commons/infra/month-year-box-component/month.year.box.component';
import { CategoriaSelectorComponent } from '../../../shared/components-commons/categoria-selector-component/categoria.selector.component';
import { PessoaSelectorComponent } from '../../../shared/components-commons/pessoa-selector-component/pessoa.selector.component';
import { SwitchComponent } from '../../../shared/components-commons/infra/switch-component/switch.component';
import { AlertService } from '../../../shared/components-commons/infra/alert-component/alert.service';
import { ConfirmDialogService } from '../../../shared/components-commons/infra/confirm-dialog-component/confirm.dialog.service';
import { TipoMovimentoEnum } from '../../../enums/tipo.movimento.enum';
import { PessoaDTO } from '../../../dtos/pessoa/pessoa.dto';

@Component({
  standalone: true,
  imports: [CommonModule, ToolbarComponent, TextBoxComponent, TextAreaComponent, NumberBoxComponent,
    DateBoxComponent, MonthYearBoxComponent, CategoriaSelectorComponent, PessoaSelectorComponent, SwitchComponent],
  template: `
    <toolbar-filter [tituloPagina]="titulo" [listMode]="false" [loading]="salvando" (salvar)="salvar()" (limpar)="carregar()" />
    <section class="card">
      <div class="heading"><div><span>GESTÃO DO GRUPO</span><h2>{{titulo}}</h2><p>Ocorrências com baixa permanecem bloqueadas para preservar o histórico financeiro.</p></div><div class="actions"><button class="cancel" (click)="cancelar()">Cancelar grupo</button><button class="delete" (click)="excluir()">Excluir grupo</button></div></div>
      <div class="form-row"><text-box-component label="Descrição base" width="435px" [(dataField)]="model.descricao" [disabled]="salvando"/></div>
      <div class="form-row"><categoria-selector-component width="280px" [tipo]="tipoCategoria" [(dataField)]="model.categoriaId" [disabled]="salvando"/><pessoa-selector-component [pessoa]="pessoa" (pessoaChange)="setPessoa($event)" [disabled]="salvando"/></div>
      <div class="form-row"><text-area-component label="Observação" width="435px" [(dataField)]="model.observacao" [disabled]="salvando"/></div>
      <div class="form-row"><switch-component label="Grupo ativo" [(dataField)]="model.ativo" [disabled]="salvando"/></div>
      @if (itens[0]?.tipo === 'RECEBER') { <div class="form-row"><switch-component label="Documento fiscal emitido" [(dataField)]="model.documentoFiscalEmitido" [disabled]="salvando"/></div> }
    </section>
    <section class="card"><div class="summary"><article><span>Total do grupo</span><strong>{{totalGrupo|currency:'BRL'}}</strong></article><article><span>Total baixado</span><strong>{{totalBaixado|currency:'BRL'}}</strong></article><article><span>Saldo aberto</span><strong>{{saldoAberto|currency:'BRL'}}</strong></article></div>
      <div class="items"><header><span>Item</span><span>Valor</span><span>Competência</span><span>Vencimento</span><span>Situação</span></header>
      @for(item of itens;track item.id){<div class="item-row"><strong>{{rotulo(item)}}</strong><number-box-component width="150px" [(dataField)]="item.valor" [disabled]="bloqueado(item)||salvando"/><month-year-box-component [(dataField)]="item.dataCompetencia" [disabled]="bloqueado(item)||salvando"/><date-box-component [clearButton]="true" [(dataField)]="item.dataVencimento" [disabled]="bloqueado(item)||salvando"/><span [class.locked]="bloqueado(item)">{{bloqueado(item)?'Bloqueado por baixa':'Editável'}}</span></div>}
      </div>
    </section>
  `,
  styles: [`
    .card{margin-top:1rem;padding:1.5rem;border:0;border-radius:12px;background:#fff}.heading{display:flex;justify-content:space-between;gap:1rem}.heading span{font-size:.75rem;color:#5570f1;font-weight:700}.heading h2{margin:.2rem 0}.heading p{color:#687080}.actions{display:flex;gap:.6rem;align-items:start}.actions button{padding:.55rem .8rem;border-radius:6px;background:#fff}.cancel{border:1px solid #d5a51e;color:#916b00}.delete{border:1px solid #dc3545;color:#b02a37}.form-row{display:flex;align-items:end;gap:1rem;flex-wrap:wrap;margin-top:1rem}.summary{display:grid;grid-template-columns:repeat(3,minmax(160px,1fr));gap:1rem;margin-bottom:1rem}.summary article{padding:1rem;border:1px solid #e3e6ee;border-radius:8px}.summary span{display:block;color:#687080}.summary strong{font-size:1.2rem}.items{overflow:auto}.items header,.item-row{display:grid;grid-template-columns:160px 150px 210px 210px 150px;gap:1rem;align-items:end;min-width:930px;padding:.7rem 0;border-bottom:1px solid #eceef3}.items header{font-size:.8rem;color:#687080}.item-row>span{height:38px;display:flex;align-items:center;color:#198754}.item-row>span.locked{color:#a06a00}@media(max-width:800px){.heading{flex-direction:column}.summary{grid-template-columns:1fr}}
  `],
})
export class GrupoLancamentoComponent implements OnInit {
  loading = false;
  salvando = false;
  tipo!: 'parcelamento' | 'recorrencia';
  grupoId = '';
  itens: LancamentoFinanceiroDTO[] = [];
  pessoa?: PessoaDTO;
  model: GrupoLancamentoUpdateDTO = { descricao: '', categoriaId: 0, observacao: '', ativo: true, documentoFiscalEmitido: false, itens: [] };

  constructor(private route: ActivatedRoute, private router: Router,
              private service: LancamentoFinanceiroService, private alerts: AlertService,
              private confirm: ConfirmDialogService) {}

  ngOnInit() {
    this.tipo = this.route.snapshot.paramMap.get('tipo') as 'parcelamento' | 'recorrencia';
    this.grupoId = this.route.snapshot.paramMap.get('id') ?? '';
    const itensNavegacao = history.state?.itens as LancamentoFinanceiroDTO[] | undefined;
    if (itensNavegacao?.length) {
      this.preencher(itensNavegacao);
    }
    this.carregar();
  }
  get titulo() { return this.tipo === 'parcelamento' ? 'Gerenciar parcelamento' : 'Gerenciar recorrência'; }
  get tipoCategoria() { return this.itens[0]?.tipo === 'RECEBER' ? TipoMovimentoEnum.RECEITA : TipoMovimentoEnum.DESPESA; }
  get totalGrupo() { return this.itens.reduce((s, i) => s + Number(i.valor), 0); }
  get totalBaixado() { return this.itens.reduce((s, i) => s + Number(i.valorLiquidado), 0); }
  get saldoAberto() { return this.itens.reduce((s, i) => s + Number(i.saldoAberto), 0); }
  carregar() {
    this.loading = true;
    const request$ = this.tipo === 'parcelamento' ? this.service.parcelas(this.grupoId) : this.service.recorrencias(this.grupoId);
    request$.subscribe({
      next: itens => {
        this.loading = false;
        if (!itens?.length) {
          this.alerts.warning('Nenhum lançamento foi encontrado neste grupo.');
          return;
        }
        this.preencher(itens);
      },
      error: e => {
        this.loading = false;
        if (!this.itens.length) {
          this.alerts.error(e?.error?.messages?.join('<br>') || 'Não foi possível carregar o grupo.');
        } else {
          this.alerts.warning('Os dados foram carregados do monitor, mas não foi possível sincronizar o grupo com a API.');
        }
      },
    });
  }
  salvar() {
    if (!this.model.descricao || !this.model.categoriaId) { this.alerts.warning('Informe descrição e categoria.'); return; }
    const itemSemVencimento = this.itens.find((item) => !item.dataVencimento);
    if (itemSemVencimento) {
      this.alerts.warning(`Informe a data de vencimento do item ${this.rotulo(itemSemVencimento)}.`);
      return;
    }
    const itemSemCompetencia = this.itens.find((item) => !item.dataCompetencia);
    if (itemSemCompetencia) {
      this.alerts.warning(`Informe a competência do item ${this.rotulo(itemSemCompetencia)}.`);
      return;
    }
    const itemComValorInvalido = this.itens.find((item) => !item.valor || Number(item.valor) <= 0);
    if (itemComValorInvalido) {
      this.alerts.warning(`Informe um valor maior que zero para o item ${this.rotulo(itemComValorInvalido)}.`);
      return;
    }
    this.model.itens = this.itens.map(i => ({id:i.id, valor:i.valor, dataCompetencia:i.dataCompetencia, dataVencimento:i.dataVencimento}));
    this.salvando=true;
    const request$ = this.tipo==='parcelamento'?this.service.atualizarParcelamento(this.grupoId,this.model):this.service.atualizarRecorrencia(this.grupoId,this.model);
    request$.subscribe({next:itens=>{this.preencher(itens);this.salvando=false;this.alerts.success('Grupo atualizado com sucesso.');},error:e=>{this.salvando=false;this.alerts.error(e?.error?.messages?.join('<br>')||'Não foi possível atualizar o grupo.');}});
  }
  async cancelar() { const motivo=await this.confirm.requestText({title:`Cancelar ${this.tipo}`,message:'Itens já baixados serão preservados; apenas os pendentes serão cancelados.',inputLabel:'Motivo',confirmText:'Cancelar pendentes'}); if(!motivo)return; const request$=this.tipo==='parcelamento'?this.service.cancelarParcelamento(this.grupoId,motivo):this.service.cancelarRecorrencia(this.grupoId,motivo); request$.subscribe({next:()=>{this.alerts.success('Itens pendentes cancelados.');this.carregar();},error:e=>this.alerts.error(e?.error?.messages?.join('<br>')||'Não foi possível cancelar o grupo.')}); }
  async excluir() { if(!(await this.confirm.confirm('Excluir grupo','Todos os lançamentos do grupo serão excluídos logicamente. Deseja continuar?')))return; const request$=this.tipo==='parcelamento'?this.service.excluirParcelamento(this.grupoId):this.service.excluirRecorrencia(this.grupoId); request$.subscribe({next:()=>{this.alerts.success('Grupo excluído.');this.router.navigate(['/app/financeiro/monitor-lancamentos']);},error:e=>this.alerts.error(e?.error?.messages?.join('<br>')||'Não foi possível excluir o grupo.')}); }
  setPessoa(pessoa?:PessoaDTO){this.pessoa=pessoa;this.model.pessoaId=pessoa?.id;}
  bloqueado(item:LancamentoFinanceiroDTO){return item.valorLiquidado>0||item.situacao==='CANCELADO';}
  rotulo(item:LancamentoFinanceiroDTO){return item.parcelamentoId?(item.parcelaEntrada?'Entrada':`${item.numeroParcela}/${item.totalParcelas}`):`${item.numeroRecorrencia}/${item.totalRecorrencias}`;}
  private descricaoBase(item:LancamentoFinanceiroDTO){return item.descricao.replace(/ — (Entrada|\d+\/\d+|Recorrência \d+\/\d+)$/,'');}
  private preencher(itens: LancamentoFinanceiroDTO[]) {
    const primeiro = itens[0];
    if (!primeiro) return;
    this.itens = itens;
    this.model = {
      descricao: this.descricaoBase(primeiro),
      categoriaId: primeiro.categoriaId,
      pessoaId: primeiro.pessoaId,
      observacao: primeiro.observacao ?? '',
      ativo: primeiro.ativo,
      documentoFiscalEmitido: primeiro.documentoFiscalEmitido,
      itens: [],
    };
    this.pessoa = primeiro.pessoaId
      ? { id: primeiro.pessoaId, nomeRazaoSocial: primeiro.pessoaNome } as PessoaDTO
      : undefined;
  }
}
