import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RecorrenciaLancamentoCreateDTO } from '../../../dtos/lancamento/lancamento.financeiro';
import { PeriodicidadeRecorrenciaEnum, PERIODICIDADE_RECORRENCIA_LABELS } from '../../../enums/periodicidade.recorrencia.enum';
import { NumberBoxComponent } from '../infra/number-box-component/number.box.component';
import { DateBoxComponent } from '../infra/date-box-component/date.box.component';
import { MonthYearBoxComponent } from '../infra/month-year-box-component/month.year.box.component';
import { SelectEnumComponent } from '../infra/select-enum-component/select.enum.component';
import { AlertService } from '../infra/alert-component/alert.service';

export interface ConfiguracaoRecorrencia {
  periodicidade: PeriodicidadeRecorrenciaEnum;
  ocorrencias: RecorrenciaLancamentoCreateDTO[];
}

@Component({
  selector: 'recorrencia-editor-component',
  standalone: true,
  imports: [CommonModule, NumberBoxComponent, DateBoxComponent, MonthYearBoxComponent, SelectEnumComponent],
  template: `
    <section class="recurrence-editor">
      <div class="base-data">
        <span [class.missing]="!valor">Valor-base: <strong>{{valor ? (valor|currency:'BRL') : 'não informado'}}</strong></span>
        <span [class.missing]="!competencia">Competência inicial: <strong>{{competencia ? (competencia|date:'MM/yyyy':'UTC') : 'não informada'}}</strong></span>
        <span [class.missing]="!primeiroVencimento">Primeiro vencimento: <strong>{{primeiroVencimento ? (primeiroVencimento|date:'dd/MM/yyyy':'UTC') : 'não informado'}}</strong></span>
      </div>
      <div class="config-row">
        <select-enum label="Periodicidade" width="190px" [enumObject]="periodicidades" [optionLabels]="periodicidadeLabels" [(dataField)]="periodicidade" />
        <select-enum label="Término" width="180px" [enumObject]="terminos" [optionLabels]="terminoLabels" [(dataField)]="termino" />
        @if (termino === 'QUANTIDADE') {
          <number-box-component label="Quantidade" width="150px" [(dataField)]="quantidade" />
        } @else {
          <date-box-component label="Data final" [clearButton]="true" [(dataField)]="dataFinal" />
        }
        <button type="button" class="secondary" (click)="gerar()">Gerar recorrências</button>
      </div>
      @if (ocorrencias.length) {
        <div class="occurrences">
          <header><span>Ocorrência</span><span>Valor</span><span>Competência</span><span>Vencimento</span><span></span></header>
          @for (item of ocorrencias; track $index) {
            <div class="occurrence-row">
              <strong>{{ $index + 1 }}/{{ ocorrencias.length }}</strong>
              <number-box-component width="150px" [(dataField)]="item.valor" (dataFieldChange)="emitir()" />
              <month-year-box-component [(dataField)]="item.dataCompetencia" (dataFieldChange)="emitir()" />
              <date-box-component [clearButton]="true" [(dataField)]="item.dataVencimento" (dataFieldChange)="emitir()" />
              <button type="button" class="remove" title="Remover ocorrência" (click)="remover($index)"><i class="bi bi-trash"></i></button>
            </div>
          }
        </div>
      }
    </section>
  `,
  styles: [`
    .recurrence-editor{margin-top:1rem;padding:1rem;border:1px solid #dce2f5;border-radius:10px;background:#f8f9ff}.base-data{display:flex;gap:.6rem;flex-wrap:wrap;margin-bottom:1rem}.base-data span{padding:.45rem .65rem;border-radius:6px;background:#fff;color:#687080;font-size:.82rem}.base-data .missing{background:#fff3cd;color:#856404}.config-row{display:flex;align-items:end;gap:1rem;flex-wrap:wrap}.secondary{height:38px;padding:0 1rem;border:1px solid #5570f1;border-radius:6px;background:#fff;color:#4056c8}.occurrences{margin-top:1rem;overflow:auto}.occurrences header,.occurrence-row{display:grid;grid-template-columns:100px 150px 210px 210px 40px;gap:1rem;align-items:end;min-width:790px;padding:.6rem 0;border-bottom:1px solid #e2e5ee}.occurrences header{font-size:.78rem;color:#687080;font-weight:600}.remove{height:38px;border:0;background:none;color:#c33}
  `],
})
export class RecorrenciaEditorComponent {
  @Input() valor = 0;
  @Input() competencia = '';
  @Input() primeiroVencimento = '';
  @Output() configuracaoChange = new EventEmitter<ConfiguracaoRecorrencia>();
  readonly periodicidades = PeriodicidadeRecorrenciaEnum;
  readonly periodicidadeLabels = PERIODICIDADE_RECORRENCIA_LABELS;
  readonly terminos = { QUANTIDADE: 'QUANTIDADE', DATA_FINAL: 'DATA_FINAL' };
  readonly terminoLabels = { QUANTIDADE: 'Por quantidade', DATA_FINAL: 'Até uma data' };
  periodicidade = PeriodicidadeRecorrenciaEnum.MENSAL;
  termino: 'QUANTIDADE' | 'DATA_FINAL' = 'QUANTIDADE';
  quantidade = 12;
  dataFinal = '';
  ocorrencias: RecorrenciaLancamentoCreateDTO[] = [];

  constructor(private alerts: AlertService) {}

  gerar() {
    const faltantes = [!this.valor && 'Valor', !this.competencia && 'Competência',
      !this.primeiroVencimento && 'Vencimento', !this.periodicidade && 'Periodicidade'].filter(Boolean);
    if (faltantes.length) {
      this.alerts.warning(`Preencha nos Dados do lançamento: ${faltantes.join(', ')}.`);
      return;
    }
    const limite = this.termino === 'QUANTIDADE' ? Math.trunc(Number(this.quantidade)) : 240;
    if (limite < 2 || (this.termino === 'DATA_FINAL' && !this.dataFinal)) {
      this.alerts.warning('A recorrência deve possuir ao menos duas ocorrências e uma condição de término válida.');
      return;
    }
    const itens: RecorrenciaLancamentoCreateDTO[] = [];
    for (let indice = 0; indice < limite; indice++) {
      const vencimento = this.avancar(this.primeiroVencimento, indice);
      if (this.termino === 'DATA_FINAL' && vencimento > this.dataFinal) break;
      itens.push({ valor: this.valor, dataCompetencia: this.avancar(this.competencia, indice), dataVencimento: vencimento });
    }
    if (itens.length < 2) {
      this.alerts.warning('A data final deve permitir ao menos duas ocorrências.');
      return;
    }
    this.ocorrencias = itens;
    this.emitir();
  }

  remover(indice: number) {
    this.ocorrencias.splice(indice, 1);
    this.emitir();
  }

  emitir() {
    this.configuracaoChange.emit({ periodicidade: this.periodicidade, ocorrencias: this.ocorrencias.map(item => ({ ...item })) });
  }

  private avancar(valor: string, indice: number) {
    const data = new Date(`${valor.slice(0, 10)}T12:00:00`);
    const dia = data.getDate();
    if (this.periodicidade === PeriodicidadeRecorrenciaEnum.SEMANAL) data.setDate(data.getDate() + indice * 7);
    else if (this.periodicidade === PeriodicidadeRecorrenciaEnum.QUINZENAL) data.setDate(data.getDate() + indice * 15);
    else {
      const meses = this.mesesPeriodicidade() * indice;
      data.setDate(1);
      data.setMonth(data.getMonth() + meses);
      const ultimoDia = new Date(data.getFullYear(), data.getMonth() + 1, 0).getDate();
      data.setDate(Math.min(dia, ultimoDia));
    }
    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
  }

  private mesesPeriodicidade() {
    return this.periodicidade === PeriodicidadeRecorrenciaEnum.BIMESTRAL ? 2
      : this.periodicidade === PeriodicidadeRecorrenciaEnum.TRIMESTRAL ? 3
        : this.periodicidade === PeriodicidadeRecorrenciaEnum.SEMESTRAL ? 6
          : this.periodicidade === PeriodicidadeRecorrenciaEnum.ANUAL ? 12 : 1;
  }
}
