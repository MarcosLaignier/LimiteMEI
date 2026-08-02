import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmpresaDTO } from '../../../dtos/empresa/empresa.dto';
import { TIPO_EMPRESA_LABELS } from '../../../enums/tipo.empresa.enum';
import { BadgeComponent } from '../infra/badge-component/badge.component';

@Component({
  selector: 'empresa-card-component', standalone: true, imports: [BadgeComponent],
  templateUrl: './empresa.card.component.html', styleUrl: './empresa.card.component.scss'
})
export class EmpresaCardComponent {
  @Input({ required: true }) empresa!: EmpresaDTO;
  @Input() selecionada = false;
  @Input() permitirSelecao = false;
  @Output() editar = new EventEmitter<number>();
  @Output() selecionar = new EventEmitter<EmpresaDTO>();

  tipoEmpresa(): string { return TIPO_EMPRESA_LABELS[this.empresa.tipoEmpresa] ?? this.empresa.tipoEmpresa; }
  cnpjFormatado(): string {
    const value = this.empresa.cnpj?.replace(/[^A-Z\d]/gi, '').toUpperCase() ?? '';
    return value.length === 14 ? `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5, 8)}/${value.slice(8, 12)}-${value.slice(12)}` : this.empresa.cnpj;
  }
  dataAberturaFormatada(): string {
    const [ano, mes, dia] = (this.empresa.dataAbertura ?? '').split('-');
    return ano && mes && dia ? `${dia}/${mes}/${ano}` : this.empresa.dataAbertura;
  }
  limiteFormatado(): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(this.empresa.limiteAnual);
  }
}
