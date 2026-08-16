import { Component, Input } from '@angular/core';
import { TextBoxComponent } from '../infra/text-box-component/text.box.component';
import { NumberBoxComponent } from '../infra/number-box-component/number.box.component';
import { DateBoxComponent } from '../infra/date-box-component/date.box.component';
import { MonthYearBoxComponent } from '../infra/month-year-box-component/month.year.box.component';
import { SelectEnumComponent } from '../infra/select-enum-component/select.enum.component';
import { CategoriaSelectorComponent } from '../categoria-selector-component/categoria.selector.component';
import { PessoaSelectorComponent } from '../pessoa-selector-component/pessoa.selector.component';
import { PessoaDTO } from '../../../dtos/pessoa/pessoa.dto';
import { TipoLancamentoEnum } from '../../../enums/tipo.lancamento.enum';
import { TipoMovimentoEnum } from '../../../enums/tipo.movimento.enum';
import { TabsComponent } from '../infra/tabs-component/tabs.component';
import { TabComponent } from '../infra/tabs-component/tab.component';

export type SituacaoFiltroLancamento =
  | 'AGUARDANDO'
  | 'PARCIAL'
  | 'LIQUIDADO'
  | 'VENCIDO'
  | 'CANCELADO';
export interface LancamentoFiltro {
  tipo?: TipoLancamentoEnum;
  categoriaId?: number;
  competencia: string;
  situacao?: SituacaoFiltroLancamento;
  valorMin?: number;
  valorMax?: number;
  vencimentoInicial: string;
  vencimentoFinal: string;
  pessoaId?: number;
  pessoaNome?: string;
  descricao: string;
}
export function novoLancamentoFiltro(): LancamentoFiltro {
  return { competencia: '', vencimentoInicial: '', vencimentoFinal: '', descricao: '' };
}

@Component({
  selector: 'lancamento-filter-component',
  standalone: true,
  imports: [
    TextBoxComponent,
    NumberBoxComponent,
    DateBoxComponent,
    MonthYearBoxComponent,
    SelectEnumComponent,
    CategoriaSelectorComponent,
    PessoaSelectorComponent,
    TabsComponent,
    TabComponent,
  ],
  templateUrl: './lancamento.filter.component.html',
  styleUrl: './lancamento.filter.component.scss',
})
export class LancamentoFilterComponent {
  @Input() disabled = false;
  pessoa?: PessoaDTO;
  private model: LancamentoFiltro = novoLancamentoFiltro();
  @Input() get filtro() {
    return this.model;
  }
  set filtro(value: LancamentoFiltro) {
    this.model = value;
    this.pessoa = value.pessoaId
      ? ({ id: value.pessoaId, nomeRazaoSocial: value.pessoaNome } as PessoaDTO)
      : undefined;
  }
  readonly tipos = TipoLancamentoEnum;
  readonly situacoes = {
    AGUARDANDO: 'AGUARDANDO',
    PARCIAL: 'PARCIAL',
    LIQUIDADO: 'LIQUIDADO',
    VENCIDO: 'VENCIDO',
    CANCELADO: 'CANCELADO',
  };
  readonly situacaoLabels: Record<string, string> = {
    AGUARDANDO: 'Aguardando baixa',
    PARCIAL: 'Baixado parcialmente',
    LIQUIDADO: 'Baixado',
    VENCIDO: 'Vencido',
    CANCELADO: 'Cancelado',
  };
  get tipoCategoria() {
    return this.model.tipo === TipoLancamentoEnum.RECEBER
      ? TipoMovimentoEnum.RECEITA
      : this.model.tipo === TipoLancamentoEnum.PAGAR
        ? TipoMovimentoEnum.DESPESA
        : undefined;
  }
  tipoChanged() {
    this.model.categoriaId = undefined;
  }
  pessoaChanged(p?: PessoaDTO) {
    this.pessoa = p;
    this.model.pessoaId = p?.id;
    this.model.pessoaNome = p?.nomeRazaoSocial;
  }
}
