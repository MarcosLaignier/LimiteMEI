import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseListCrud } from '../../shared/components-commons/core/base.list.crud';
import {
  LancamentoFinanceiroCreateDTO,
  LancamentoFinanceiroDTO,
} from '../../dtos/lancamento/lancamento.financeiro';
import { LancamentoFinanceiroService } from '../../services/lancamento-financeiro.service';
import { ToolbarComponent } from '../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';
import { GridComponent } from '../../shared/components-commons/infra/grid-column-component/grid.component';
import {
  LancamentoFilterComponent,
  LancamentoFiltro,
  novoLancamentoFiltro,
  SituacaoFiltroLancamento,
} from '../../shared/components-commons/lancamento-filter-component/lancamento.filter.component';

@Component({
  standalone: true,
  imports: [ToolbarComponent, GridComponent, LancamentoFilterComponent],
  template: `<toolbar-filter
      tituloPagina="Lançamentos financeiros"
      [listMode]="true"
      [loading]="loading"
      (novo)="novo()"
      (filtrar)="doFilter()"
      (limpar)="limparFiltro()"
    />
    <section class="page">
      <header>
        <span>CONTAS A PAGAR E RECEBER</span>
        <h1>Lançamentos financeiros</h1>
        <p>Cadastre e mantenha as receitas e despesas previstas da empresa.</p>
      </header>
      <lancamento-filter-component
        [filtro]="filtroLancamento"
        [disabled]="loading"
      /><grid-component
        [dataSource]="dataSource"
        [loading]="loading"
        [typeDataSource]="LancamentoFinanceiroDTO"
        [routerByEditDblClick]="true"
        emptyTitle="Nenhum lançamento financeiro cadastrado"
      />
    </section>`,
  styles: [
    `
      .page {
        margin-top: 1rem;
        background: #fff;
        border-radius: 12px;
        padding: 1.5rem;
      }
      .page header span {
        font-size: 0.75rem;
        color: #5570f1;
        font-weight: 700;
      }
      .page h1 {
        margin: 0.2rem 0;
      }
      .page p {
        color: #687080;
      }
    `,
  ],
})
export class LancamentoFinanceiroListComponent
  extends BaseListCrud<LancamentoFinanceiroDTO, LancamentoFinanceiroCreateDTO>
  implements OnInit
{
  LancamentoFinanceiroDTO = LancamentoFinanceiroDTO;
  protected service: LancamentoFinanceiroService;
  protected routeBase = '/app/financeiro/lancamentos';
  filtroLancamento: LancamentoFiltro = novoLancamentoFiltro();
  private todos: LancamentoFinanceiroDTO[] = [];
  constructor(service: LancamentoFinanceiroService, router: Router) {
    super(router);
    this.service = service;
  }
  ngOnInit() {
    this.load();
  }
  override load() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (r) => {
        this.todos = r.body ?? [];
        this.aplicarFiltro();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.alertService.error('Não foi possível carregar os lançamentos.');
      },
    });
  }
  override doFilter() {
    this.aplicarFiltro();
  }
  limparFiltro() {
    this.filtroLancamento = novoLancamentoFiltro();
    this.aplicarFiltro();
  }
  private aplicarFiltro() {
    const f = this.filtroLancamento;
    this.dataSource = this.todos.filter(
      (i) =>
        (!f.descricao || i.descricao.toLowerCase().includes(f.descricao.toLowerCase())) &&
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
  private situacao(i: LancamentoFinanceiroDTO): SituacaoFiltroLancamento {
    if (i.situacao === 'CANCELADO') return 'CANCELADO';
    if (i.saldoAberto <= 0 || i.situacao === 'LIQUIDADO') return 'LIQUIDADO';
    if (i.dataVencimento < this.hoje()) return 'VENCIDO';
    if (i.valorLiquidado > 0) return 'PARCIAL';
    return 'AGUARDANDO';
  }
  private hoje(){const data=new Date();return `${data.getFullYear()}-${String(data.getMonth()+1).padStart(2,'0')}-${String(data.getDate()).padStart(2,'0')}`;}
}
