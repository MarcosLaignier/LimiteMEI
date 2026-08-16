import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ParcelaLancamentoCreateDTO } from '../../../dtos/lancamento/lancamento.financeiro';
import { NumberBoxComponent } from '../infra/number-box-component/number.box.component';
import { DateBoxComponent } from '../infra/date-box-component/date.box.component';
import { MonthYearBoxComponent } from '../infra/month-year-box-component/month.year.box.component';
import { AlertService } from '../infra/alert-component/alert.service';

@Component({
  selector: 'parcelamento-editor-component',
  standalone: true,
  imports: [CommonModule, FormsModule, NumberBoxComponent, DateBoxComponent, MonthYearBoxComponent],
  template: `
    <section class="installment-editor">
      <div class="config-row">
        <number-box-component label="Quantidade de parcelas" width="190px" [(dataField)]="quantidade" />
        <number-box-component label="Intervalo em meses" width="180px" [(dataField)]="intervaloMeses" />
        <number-box-component label="Valor da entrada" width="180px" [(dataField)]="valorEntrada" />
        <date-box-component label="Primeiro vencimento" [clearButton]="true" [(dataField)]="primeiroVencimento" />
        <button type="button" class="secondary" (click)="gerar()">Gerar parcelas</button>
      </div>
      @if (parcelas.length) {
        <div class="summary"><span>Total distribuído</span><strong>{{ totalDistribuido | currency: 'BRL' }}</strong><small>Valor informado: {{ total | currency: 'BRL' }}</small></div>
        <div class="installments">
          <header><span>Parcela</span><span>Valor</span><span>Competência</span><span>Vencimento</span><span></span></header>
          @for (parcela of parcelas; track $index) {
            <div class="installment-row">
              <strong>{{ parcela.entrada ? 'Entrada' : numeroParcela($index) + '/' + quantidade }}</strong>
              <number-box-component width="150px" [(dataField)]="parcela.valor" (dataFieldChange)="emitir()" />
              <month-year-box-component [(dataField)]="parcela.dataCompetencia" (dataFieldChange)="emitir()" />
              <date-box-component [clearButton]="true" [(dataField)]="parcela.dataVencimento" (dataFieldChange)="emitir()" />
              <button type="button" class="remove" title="Remover parcela" (click)="remover($index)"><i class="bi bi-trash"></i></button>
            </div>
          }
        </div>
      }
    </section>
  `,
  styles: [`
    .installment-editor{margin-top:1rem;padding:1rem;border:1px solid #dce2f5;border-radius:10px;background:#f8f9ff}.config-row,.installment-row{display:flex;align-items:end;gap:1rem;flex-wrap:wrap}.secondary{height:38px;padding:0 1rem;border:1px solid #5570f1;border-radius:6px;background:#fff;color:#4056c8}.summary{display:inline-flex;flex-direction:column;margin:1rem 0;padding:.7rem 1rem;border-radius:8px;background:#fff}.summary span,.summary small{color:#687080}.installments{overflow:auto}.installments header,.installment-row{display:grid;grid-template-columns:100px 150px 210px 210px 40px;gap:1rem;align-items:end;min-width:790px;padding:.6rem 0;border-bottom:1px solid #e2e5ee}.installments header{font-size:.78rem;color:#687080;font-weight:600}.remove{height:38px;border:0;background:none;color:#c33}
  `],
})
export class ParcelamentoEditorComponent {
  @Input() total = 0;
  @Input() competencia = '';
  @Input() primeiroVencimento = '';
  @Output() parcelasChange = new EventEmitter<ParcelaLancamentoCreateDTO[]>();
  quantidade = 2;
  intervaloMeses = 1;
  valorEntrada = 0;
  parcelas: ParcelaLancamentoCreateDTO[] = [];

  constructor(private alerts: AlertService) {}

  get totalDistribuido() {
    return this.parcelas.reduce((total, parcela) => total + Number(parcela.valor || 0), 0);
  }

  gerar() {
    const quantidade = Math.trunc(Number(this.quantidade));
    const intervalo = Math.trunc(Number(this.intervaloMeses));
    const entrada = Number(this.valorEntrada || 0);
    if (!this.total || quantidade < 1 || intervalo < 1 || !this.primeiroVencimento || !this.competencia) {
      this.alerts.warning('Informe valor total, competência, primeiro vencimento, quantidade e intervalo.');
      return;
    }
    if (entrada < 0 || entrada >= this.total) {
      this.alerts.warning('A entrada deve ser menor que o valor total.');
      return;
    }
    const restanteCentavos = Math.round((this.total - entrada) * 100);
    const base = Math.floor(restanteCentavos / quantidade);
    const diferenca = restanteCentavos - base * quantidade;
    const itens: ParcelaLancamentoCreateDTO[] = [];
    if (entrada > 0) {
      itens.push({ valor: entrada, dataCompetencia: this.competencia, dataVencimento: this.primeiroVencimento, entrada: true });
    }
    for (let indice = 0; indice < quantidade; indice++) {
      itens.push({
        valor: (base + (indice === quantidade - 1 ? diferenca : 0)) / 100,
        dataCompetencia: this.adicionarMeses(this.competencia, indice * intervalo),
        dataVencimento: this.adicionarMeses(this.primeiroVencimento, indice * intervalo),
        entrada: false,
      });
    }
    this.parcelas = itens;
    this.emitir();
  }

  numeroParcela(indice: number) {
    return indice + (this.parcelas[0]?.entrada ? 0 : 1);
  }

  remover(indice: number) {
    this.parcelas.splice(indice, 1);
    this.quantidade = this.parcelas.filter(item => !item.entrada).length;
    this.emitir();
  }

  emitir() {
    this.parcelasChange.emit(this.parcelas.map(item => ({ ...item })));
  }

  private adicionarMeses(valor: string, meses: number) {
    const data = new Date(`${valor.slice(0, 10)}T12:00:00`);
    const dia = data.getDate();
    data.setDate(1);
    data.setMonth(data.getMonth() + meses);
    const ultimoDia = new Date(data.getFullYear(), data.getMonth() + 1, 0).getDate();
    data.setDate(Math.min(dia, ultimoDia));
    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
  }
}
