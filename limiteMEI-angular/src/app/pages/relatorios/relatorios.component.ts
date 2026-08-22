import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ContaFinanceiraSelectorComponent } from '../../shared/components-commons/conta-financeira-selector-component/conta-financeira.selector.component';
import { DateBoxComponent } from '../../shared/components-commons/infra/date-box-component/date.box.component';
import { MonthYearBoxComponent } from '../../shared/components-commons/infra/month-year-box-component/month.year.box.component';
import { ToolbarComponent } from '../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';
import { AlertService } from '../../shared/components-commons/infra/alert-component/alert.service';

@Component({
  standalone: true,
  imports: [CommonModule, ToolbarComponent, MonthYearBoxComponent, DateBoxComponent, ContaFinanceiraSelectorComponent],
  template: `
    <toolbar-filter tituloPagina="Relatórios" [listMode]="true" [showNew]="false" [loading]="false" (filtrar)="abrirFluxoCaixa()" (limpar)="periodoAtual()" />

    <section class="page">
      <header>
        <span>RELATÓRIOS</span>
        <h1>Central de relatórios</h1>
        <p>Gere relatórios para conferência, impressão e exportação de dados.</p>
      </header>

      <div class="report-grid">
        <article>
          <i class="bi bi-file-earmark-text"></i>
          <div>
            <span>MEI</span>
            <h2>Relatório mensal de receitas brutas</h2>
            <p>Documento mensal com receitas por comércio, indústria e serviços.</p>
            <month-year-box-component label="Competência" width="210px" [(dataField)]="competenciaMei" />
            <button (click)="abrirRelatorioMei()"><i class="bi bi-printer"></i> Visualizar relatório</button>
          </div>
        </article>

        <article>
          <i class="bi bi-cash-coin"></i>
          <div>
            <span>FINANCEIRO</span>
            <h2>Fluxo de caixa</h2>
            <p>Entradas, saídas e saldo por período, com opção de filtro por conta.</p>
            <div class="fields">
              <date-box-component label="Data inicial" width="180px" [clearButton]="true" [(dataField)]="inicioFluxo" />
              <date-box-component label="Data final" width="180px" [clearButton]="true" [(dataField)]="fimFluxo" />
            </div>
            <conta-financeira-selector-component label="Conta financeira" width="375px" [(dataField)]="contaFluxoId" />
            <button (click)="abrirFluxoCaixa()"><i class="bi bi-printer"></i> Visualizar relatório</button>
          </div>
        </article>
      </div>
    </section>
  `,
  styles: [`
    .page{margin-top:1rem;padding:1.5rem;background:#fff;border:1px solid #e5e9ef;border-radius:12px}
    header{margin-bottom:1.4rem}header span,.report-grid article span{font-size:.75rem;color:#5570f1;font-weight:800}h1{margin:.2rem 0;color:#203746;font-size:1.45rem}p{margin:0;color:#687080}
    .report-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:1rem;max-width:980px}
    article{display:flex;gap:1rem;padding:1rem;border:1px solid #e1e6ef;border-radius:8px;background:#fff}
    article>i{display:grid;place-items:center;flex:0 0 44px;width:44px;height:44px;border-radius:8px;background:#eef1ff;color:#5570f1;font-size:1.2rem}
    article h2{margin:.2rem 0;color:#203746;font-size:1.1rem}.fields{display:flex;gap:15px;flex-wrap:wrap;margin-top:1rem}
    month-year-box-component,conta-financeira-selector-component{display:block;margin-top:1rem}
    button{height:38px;margin-top:1rem;padding:0 .85rem;border:1px solid #5570f1;border-radius:6px;background:#5570f1;color:#fff}
    @media(max-width:640px){article{flex-direction:column}.report-grid{grid-template-columns:1fr}}
  `]
})
export class RelatoriosComponent {
  competenciaMei = '';
  inicioFluxo = '';
  fimFluxo = '';
  contaFluxoId?: number;

  constructor(private router: Router, private alerts: AlertService) {
    this.periodoAtual();
  }

  periodoAtual() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    this.competenciaMei = `${ano}-${String(mes + 1).padStart(2, '0')}-01`;
    this.inicioFluxo = `${ano}-${String(mes + 1).padStart(2, '0')}-01`;
    this.fimFluxo = new Date(ano, mes + 1, 0).toISOString().slice(0, 10);
    this.contaFluxoId = undefined;
  }

  abrirRelatorioMei() {
    const [ano, mes] = this.competenciaMei.split('-').map(Number);
    if (!ano || !mes) {
      this.alerts.warning('Informe a competência do relatório mensal.');
      return;
    }
    this.router.navigate(['/app/financeiro/mei/relatorio', ano, mes]);
  }

  abrirFluxoCaixa() {
    if (!this.inicioFluxo || !this.fimFluxo) {
      this.alerts.warning('Informe o período do fluxo de caixa.');
      return;
    }
    this.router.navigate(['/app/relatorios/fluxo-caixa'], {
      queryParams: {
        inicio: this.inicioFluxo,
        fim: this.fimFluxo,
        contaFinanceiraId: this.contaFluxoId || undefined,
      },
    });
  }
}
