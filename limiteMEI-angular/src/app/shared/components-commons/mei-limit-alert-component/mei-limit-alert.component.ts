import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'mei-limit-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (deveMostrar) {
      <div class="alert" [class.level-80]="percentualDisparo>=80" [class.level-90]="percentualDisparo>=90" [class.level-100]="percentualDisparo>=100" [class.level-120]="percentualDisparo>=120">
        <i class="bi" [class.bi-exclamation-triangle]="percentualDisparo<100" [class.bi-x-octagon]="percentualDisparo>=100"></i>
        <div><strong>{{titulo}}</strong><span>{{mensagem}}</span>@if(projecaoAnual!==undefined){<small>Projeção anual: {{projecaoAnual|currency:'BRL'}}.</small>}</div>
      </div>
    }
  `,
  styles: [`
    .alert{display:flex;gap:.8rem;margin:1rem 0;padding:1rem;border:1px solid #e3cd72;border-radius:9px;background:#fff9e8;color:#735d00}.alert i{font-size:1.25rem}.alert div{display:flex;flex-direction:column}.level-80{border-color:#e9ac58;background:#fff4e6;color:#8a4c00}.level-90{border-color:#e98585;background:#fff0f0;color:#a12a35}.level-100{border-color:#cf5353;background:#fbe7e7;color:#8c1822}.level-120{border-color:#9f3030;background:#f8d7da;color:#6f111a}.alert small{margin-top:.2rem}
  `],
})
export class MeiLimitAlertComponent {
  @Input() percentual = 0;
  @Input() projecaoAnual?: number;
  @Input() alerta?: { percentual: number; obrigatorio: boolean };
  get percentualDisparo() { return this.alerta?.percentual ?? 75; }
  get deveMostrar() { return this.percentual >= this.percentualDisparo; }
  get titulo() {
    if (this.percentualDisparo >= 120) return 'Excesso acima de 120% do limite';
    if (this.percentualDisparo >= 100) return 'Limite do MEI excedido';
    if (this.percentualDisparo >= 90) return `Faixa crítica: ${this.percentualDisparo}% do limite`;
    if (this.percentualDisparo >= 80) return `Alerta: ${this.percentualDisparo}% do limite`;
    return `Atenção: ${this.percentualDisparo}% do limite`;
  }
  get mensagem() {
    if (this.percentualDisparo >= 120) return 'O faturamento passou da faixa de excesso ampliado. Avalie o desenquadramento e os impactos com seu contador.';
    if (this.percentualDisparo >= 100) return 'O faturamento acumulado ultrapassou o teto aplicável. Avalie o desenquadramento com seu contador.';
    if (this.percentualDisparo >= 90) return 'O faturamento está muito próximo do teto. Revise a projeção antes de emitir novas receitas.';
    if (this.percentualDisparo >= 80) return 'A margem disponível está reduzida. Acompanhe o faturamento com maior frequência.';
    return 'O faturamento entrou na primeira faixa de acompanhamento preventivo.';
  }
}
