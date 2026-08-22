import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RelatorioFluxoCaixaDTO } from '../../dtos/relatorio/relatorio.financeiro';
import { ORIGEM_MOVIMENTO_LABELS, TIPO_FLUXO_LABELS } from '../../enums/movimento.financeiro.enum';
import { FORMA_PAGAMENTO_LABELS } from '../../enums/forma.pagamento.enum';
import { RelatorioService } from '../../services/relatorio.service';
import { AlertService } from '../../shared/components-commons/infra/alert-component/alert.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="screen-actions">
      <button onclick="history.back()"><i class="bi bi-arrow-left"></i> Voltar</button>
      <button (click)="exportarCsv()"><i class="bi bi-download"></i> Exportar CSV</button>
      <button class="primary" (click)="imprimir()"><i class="bi bi-printer"></i> Imprimir / Salvar PDF</button>
    </div>

    @if (relatorio) {
      <main class="sheet">
        <header>
          <h1>Relatório de fluxo de caixa</h1>
          <div class="meta">
            <span><strong>Empresa:</strong> {{relatorio.empresa}}</span>
            <span><strong>CNPJ:</strong> {{formatarCnpj(relatorio.cnpj)}}</span>
            <span><strong>Período:</strong> {{relatorio.inicio|date:'dd/MM/yyyy':'UTC'}} a {{relatorio.fim|date:'dd/MM/yyyy':'UTC'}}</span>
            <span><strong>Conta:</strong> {{relatorio.contaFinanceiraNome}}</span>
          </div>
        </header>

        <section class="totals">
          <article><span>Entradas</span><strong>{{relatorio.totalEntradas|currency:'BRL'}}</strong></article>
          <article><span>Saídas</span><strong>{{relatorio.totalSaidas|currency:'BRL'}}</strong></article>
          <article [class.negative]="relatorio.saldoPeriodo<0"><span>Saldo do período</span><strong>{{relatorio.saldoPeriodo|currency:'BRL'}}</strong></article>
        </section>

        <table>
          <thead><tr><th>Data</th><th>Descrição</th><th>Origem</th><th>Conta</th><th>Forma</th><th>Categoria</th><th>Tipo</th><th>Valor</th></tr></thead>
          <tbody>
            @if(!relatorio.movimentos.length){<tr><td colspan="8" class="empty">Nenhuma movimentação encontrada no período.</td></tr>}
            @else {
              @for(item of relatorio.movimentos; track item.id) {
                <tr>
                  <td>{{item.data|date:'dd/MM/yyyy':'UTC'}}</td>
                  <td><strong>{{item.descricao}}</strong></td>
                  <td>{{origemLabels[item.origem]}}</td>
                  <td>{{item.contaFinanceiraNome}}</td>
                  <td>{{item.formaPagamento ? formaLabels[item.formaPagamento] : '—'}}</td>
                  <td>{{item.categoriaNome || '—'}}</td>
                  <td>{{tipoLabels[item.tipo]}}</td>
                  <td [class.entry]="item.tipo==='ENTRADA'" [class.exit]="item.tipo==='SAIDA'">{{item.valor|currency:'BRL'}}</td>
                </tr>
              }
            }
          </tbody>
        </table>
      </main>
    } @else {
      <div class="loading"><span class="spinner-border spinner-border-sm"></span> Gerando relatório...</div>
    }
  `,
  styles: [`
    .screen-actions{display:flex;justify-content:flex-end;gap:.6rem;margin-bottom:1rem}.screen-actions button{padding:.6rem 1rem;border:1px solid #ccd2df;border-radius:6px;background:#fff}.screen-actions .primary{border-color:#5570f1;background:#5570f1;color:#fff}
    .sheet{width:297mm;min-height:210mm;margin:auto;padding:12mm;background:#fff;color:#111;box-shadow:0 2px 14px #0002}.sheet h1{margin:0 0 1rem;text-align:center;font-size:20px;text-transform:uppercase}.meta{display:grid;grid-template-columns:1fr 1fr;gap:6px 18px;margin-bottom:1rem;font-size:12px}
    .totals{display:grid;grid-template-columns:repeat(3,1fr);gap:.6rem;margin-bottom:1rem}.totals article{padding:.8rem;border:1px solid #333}.totals span{display:block;font-size:11px;color:#555}.totals strong{font-size:16px}.negative strong,.exit{color:#b02a37}.entry{color:#187747}
    table{width:100%;border-collapse:collapse;font-size:10px}th,td{padding:6px;border:1px solid #aaa;text-align:left}th{background:#e9ecef}.empty{text-align:center;color:#666;padding:2rem}.loading{text-align:center;padding:4rem}
    @media print{.screen-actions{display:none}.sheet{width:auto;min-height:auto;margin:0;padding:6mm;box-shadow:none}@page{size:A4 landscape;margin:8mm}}
  `]
})
export class FluxoCaixaRelatorioComponent implements OnInit {
  relatorio?: RelatorioFluxoCaixaDTO;
  readonly origemLabels = ORIGEM_MOVIMENTO_LABELS;
  readonly tipoLabels = TIPO_FLUXO_LABELS;
  readonly formaLabels = FORMA_PAGAMENTO_LABELS;

  constructor(private route: ActivatedRoute, private service: RelatorioService,
              private alerts: AlertService, private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    const inicio = this.route.snapshot.queryParamMap.get('inicio') ?? '';
    const fim = this.route.snapshot.queryParamMap.get('fim') ?? '';
    const conta = Number(this.route.snapshot.queryParamMap.get('contaFinanceiraId'));
    this.service.fluxoCaixa(inicio, fim, conta || undefined).subscribe({
      next: relatorio => { this.relatorio = relatorio; this.changeDetector.detectChanges(); },
      error: e => {
        this.alerts.error(e?.error?.messages?.join('<br>') || 'Não foi possível gerar o fluxo de caixa.');
        this.changeDetector.detectChanges();
      },
    });
  }

  imprimir() { window.print(); }
  formatarCnpj(cnpj: string) { return cnpj?.replace(/^(..)(...)(...)(....)(..)$/, '$1.$2.$3/$4-$5') ?? ''; }

  exportarCsv() {
    if (!this.relatorio) return;
    const linhas = [
      ['Data','Descrição','Origem','Conta','Forma','Categoria','Tipo','Valor'],
      ...this.relatorio.movimentos.map(item => [
        item.data,
        item.descricao,
        this.origemLabels[item.origem],
        item.contaFinanceiraNome,
        item.formaPagamento ? this.formaLabels[item.formaPagamento] : '',
        item.categoriaNome ?? '',
        this.tipoLabels[item.tipo],
        String(item.valor).replace('.', ','),
      ]),
    ];
    const csv = linhas.map(linha => linha.map(campo => `"${String(campo).replace(/"/g, '""')}"`).join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `fluxo-caixa-${this.relatorio.inicio}-${this.relatorio.fim}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
