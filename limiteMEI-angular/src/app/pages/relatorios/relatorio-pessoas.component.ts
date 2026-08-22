import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SelectEnumComponent } from '../../shared/components-commons/infra/select-enum-component/select.enum.component';
import { TextBoxComponent } from '../../shared/components-commons/infra/text-box-component/text.box.component';
import { ToolbarComponent } from '../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';
import { ReportViewComponent } from '../../shared/components-commons/relatorio/report-view.component';
import { ReportColumn, ReportRow, ReportTotal } from '../../shared/components-commons/relatorio/report.types';
import { PessoaPapelService } from '../../services/pessoa-papel.service';
import { AlertService } from '../../shared/components-commons/infra/alert-component/alert.service';
import { PapelPessoaEnum } from '../../enums/papel.pessoa.enum';
import { TipoPessoaEnum, TIPO_PESSOA_LABELS } from '../../enums/tipo.pessoa.enum';

@Component({
  standalone: true,
  imports: [CommonModule, ToolbarComponent, TextBoxComponent, SelectEnumComponent, ReportViewComponent],
  template: `
    <toolbar-filter [tituloPagina]="titulo" [listMode]="true" [showNew]="false" [loading]="loading" (filtrar)="carregar()" (limpar)="limparFiltros()" />
    <section class="filters">
      <header><span>FILTROS</span><h1>{{titulo}}</h1><p>Filtre por nome, documento e tipo de pessoa.</p></header>
      <div class="filter-grid">
        <text-box-component label="Nome / Razão social" width="435px" [(dataField)]="nome" />
        <text-box-component label="CPF / CNPJ" width="240px" [(dataField)]="documento" />
        <select-enum label="Tipo pessoa" width="220px" [enumObject]="tiposPessoa" [optionLabels]="tipoPessoaLabels" [(dataField)]="tipoPessoa" />
      </div>
    </section>
    <report-view [loading]="loading" [titulo]="titulo" subtitulo="Pessoas vinculadas ao papel selecionado" [fileName]="fileName" [colunas]="colunas" [linhas]="linhas" [totalizadores]="totalizadores" />
  `,
  styles: [`
    .filters{margin:1rem 0;padding:1.25rem;background:#fff;border:1px solid #e5e9ef;border-radius:12px}
    header{margin-bottom:1rem}header span{font-size:.75rem;color:#5570f1;font-weight:800}h1{margin:.2rem 0;color:#203746;font-size:1.25rem}p{margin:0;color:#687080}
    .filter-grid{display:flex;align-items:end;flex-wrap:wrap;gap:15px}
  `]
})
export class RelatorioPessoasComponent implements OnInit {
  titulo = 'Clientes';
  fileName = 'clientes';
  papel = PapelPessoaEnum.CLIENTE;
  nome = '';
  documento = '';
  tipoPessoa?: TipoPessoaEnum;
  loading = false;
  linhas: ReportRow[] = [];
  totalizadores: ReportTotal[] = [];
  readonly tiposPessoa = TipoPessoaEnum;
  readonly tipoPessoaLabels = TIPO_PESSOA_LABELS;
  readonly colunas: ReportColumn[] = [
    { key: 'nome', label: 'Nome / Razão social' }, { key: 'tipo', label: 'Tipo' },
    { key: 'documento', label: 'CPF / CNPJ' }, { key: 'email', label: 'E-mail' }, { key: 'telefone', label: 'Telefone' },
  ];

  constructor(private route: ActivatedRoute, private service: PessoaPapelService,
              private alerts: AlertService, private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    this.papel = this.route.snapshot.data['papel'] ?? PapelPessoaEnum.CLIENTE;
    this.titulo = this.papel === PapelPessoaEnum.FORNECEDOR ? 'Fornecedores' : 'Clientes';
    this.fileName = this.papel === PapelPessoaEnum.FORNECEDOR ? 'fornecedores' : 'clientes';
    this.carregar();
  }

  limparFiltros() {
    this.nome = '';
    this.documento = '';
    this.tipoPessoa = undefined;
    this.carregar();
  }

  carregar() {
    this.loading = true;
    this.service.listar(this.papel).subscribe({
      next: r => {
        const nomeFiltro = this.nome.trim().toLowerCase();
        const documentoFiltro = this.documento.trim().toLowerCase();
        const itens = (r.body ?? []).filter(item =>
          (!nomeFiltro || item.nomeRazaoSocial.toLowerCase().includes(nomeFiltro)) &&
          (!documentoFiltro || (item.cpfCnpj ?? '').toLowerCase().includes(documentoFiltro)) &&
          (!this.tipoPessoa || item.tipoPessoa === this.tipoPessoa));
        this.linhas = itens.map(item => ({
          nome: item.nomeRazaoSocial,
          tipo: TIPO_PESSOA_LABELS[item.tipoPessoa] ?? item.tipoPessoa,
          documento: item.cpfCnpj ?? '',
          email: item.email ?? '',
          telefone: item.telefone ?? '',
        }));
        this.totalizadores = [{ label: 'Quantidade', valor: this.linhas.length }];
        this.loading = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.alerts.error(`Não foi possível carregar ${this.titulo.toLowerCase()}.`);
        this.changeDetector.detectChanges();
      },
    });
  }
}
