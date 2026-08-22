import { CommonModule, Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { DocumentoFiscalService } from '../../services/documento-fiscal.service';
import { LancamentoFinanceiroService } from '../../services/lancamento-financeiro.service';
import { PessoaPapelService } from '../../services/pessoa-papel.service';
import { ApuracaoMeiService } from '../../services/apuracao-mei.service';
import { AlertService } from '../../shared/components-commons/infra/alert-component/alert.service';
import { PapelPessoaEnum } from '../../enums/papel.pessoa.enum';
import { TipoLancamentoEnum } from '../../enums/tipo.lancamento.enum';
import { SITUACAO_DOCUMENTO_FISCAL_LABELS, TIPO_DOCUMENTO_FISCAL_LABELS } from '../../enums/documento.fiscal.enum';
import { SITUACAO_LANCAMENTO_LABELS } from '../../enums/tipo.lancamento.enum';

interface LinhaRelatorio {
  [key: string]: string | number;
}

interface ColunaRelatorio {
  key: string;
  label: string;
  tipo?: 'currency' | 'number';
}

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="screen-actions">
      <button type="button" (click)="voltar()"><i class="bi bi-arrow-left"></i> Voltar</button>
      <button type="button" (click)="exportarCsv()" [disabled]="loading"><i class="bi bi-download"></i> Exportar CSV</button>
      <button type="button" class="primary" (click)="imprimir()" [disabled]="loading"><i class="bi bi-printer"></i> Imprimir / Salvar PDF</button>
    </div>

    @if (!loading) {
      <main class="report-page">
        <header class="report-header">
          <div>
            <span>RELATÓRIO</span>
            <h1>{{titulo}}</h1>
            <p>{{subtitulo}}</p>
          </div>
        </header>

        <section class="totals">
          @for(total of totalizadores; track total.label) {
            <article>
              <span>{{total.label}}</span>
              <strong>{{total.currency ? (total.valor|currency:'BRL') : total.valor}}</strong>
            </article>
          }
        </section>

        <section class="table-card">
          <div class="table-title">
            <strong>Registros</strong>
            <span>{{linhas.length}} item(ns)</span>
          </div>
          <div class="table-scroll">
            <table>
              <thead><tr>@for(coluna of colunas; track coluna.key){<th>{{coluna.label}}</th>}</tr></thead>
              <tbody>
                @if(!linhas.length){<tr><td [attr.colspan]="colunas.length" class="empty">Nenhum registro encontrado.</td></tr>}
                @else {
                  @for(linha of linhas; track $index) {
                    <tr>@for(coluna of colunas; track coluna.key){<td [class.numeric]="coluna.tipo">{{formatar(linha[coluna.key], coluna)}}</td>}</tr>
                  }
                }
              </tbody>
            </table>
          </div>
        </section>
      </main>
    } @else {
      <div class="loading">
        <span class="spinner-border spinner-border-sm"></span>
        <span>Gerando relatório...</span>
      </div>
    }
  `,
  styles: [`
    .screen-actions{position:sticky;top:.75rem;z-index:5;display:flex;justify-content:flex-end;gap:.6rem;margin-bottom:1rem;padding:.7rem;background:#ffffffd9;border:1px solid #e5e9ef;border-radius:10px;backdrop-filter:blur(6px)}
    .screen-actions button{display:flex;align-items:center;gap:.45rem;height:36px;padding:0 .85rem;border:1px solid #ccd2df;border-radius:6px;background:#fff;color:#344054;font-weight:700}
    .screen-actions .primary{border-color:#5570f1;background:#5570f1;color:#fff}.screen-actions button:disabled{opacity:.65}
    .report-page{padding:1.25rem;background:#fff;border:1px solid #e5e9ef;border-radius:12px;color:#203746}
    .report-header{display:flex;justify-content:space-between;gap:1rem;margin-bottom:1rem;padding-bottom:1rem;border-bottom:1px solid #edf0f5}
    .report-header span{font-size:.75rem;color:#5570f1;font-weight:800;letter-spacing:.02em}.report-header h1{margin:.2rem 0;color:#203746;font-size:1.35rem}.report-header p{margin:0;color:#687080}
    .totals{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:.75rem;margin-bottom:1rem}
    .totals article{padding:.85rem;border:1px solid #e1e6ef;border-radius:10px;background:#f8f9fc}
    .totals span{display:block;margin-bottom:.25rem;font-size:.76rem;color:#687080}.totals strong{font-size:1.1rem;color:#203746}
    .table-card{border:1px solid #e1e6ef;border-radius:10px;overflow:hidden;background:#fff}
    .table-title{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.8rem 1rem;border-bottom:1px solid #e1e6ef;background:#f8f9fc}.table-title span{color:#687080;font-size:.85rem}
    .table-scroll{overflow:auto}table{width:100%;border-collapse:collapse;font-size:.86rem}th,td{padding:.7rem .8rem;border-bottom:1px solid #edf0f5;text-align:left;white-space:nowrap}
    th{background:#f8f9fc;color:#475467;font-weight:800}tbody tr:hover{background:#fafbff}.numeric{text-align:right}.empty{text-align:center;color:#666;padding:2rem}
    .loading{display:flex;align-items:center;justify-content:center;gap:.55rem;min-height:220px;padding:4rem;color:#687080}
    @media print{
      .screen-actions{display:none}
      .report-page{padding:0;border:0;border-radius:0}
      .report-header{display:block;text-align:center}
      .report-header span{display:none}
      .report-header h1{font-size:18px;text-transform:uppercase}
      .totals{grid-template-columns:repeat(3,1fr)}
      .totals article,.table-card{border-color:#333;border-radius:0}
      .table-title{background:#fff;border-color:#333}
      th,td{padding:5px;border:1px solid #999;font-size:10px}
      th{background:#e9ecef!important}
      @page{size:A4 landscape;margin:8mm}
    }
  `]
})
export class RelatorioTabularComponent implements OnInit {
  loading = true;
  tipo = '';
  inicio = '';
  fim = '';
  competencia = '';
  titulo = 'Relatório';
  subtitulo = '';
  linhas: LinhaRelatorio[] = [];
  colunas: ColunaRelatorio[] = [];
  totalizadores: { label: string; valor: number | string; currency?: boolean }[] = [];

  constructor(private route: ActivatedRoute, private lancamentos: LancamentoFinanceiroService,
              private papeis: PessoaPapelService, private documentos: DocumentoFiscalService,
              private apuracao: ApuracaoMeiService, private dashboard: DashboardService,
              private alerts: AlertService, private changeDetector: ChangeDetectorRef,
              private location: Location) {}

  ngOnInit() {
    this.tipo = this.route.snapshot.paramMap.get('tipo') ?? '';
    this.inicio = this.route.snapshot.queryParamMap.get('inicio') ?? '';
    this.fim = this.route.snapshot.queryParamMap.get('fim') ?? '';
    this.competencia = this.route.snapshot.queryParamMap.get('competencia') ?? '';
    this.carregar();
  }

  carregar() {
    switch (this.tipo) {
      case 'lancamentos': return this.carregarLancamentos();
      case 'contas-receber': return this.carregarLancamentos(TipoLancamentoEnum.RECEBER, 'Contas a receber');
      case 'contas-pagar': return this.carregarLancamentos(TipoLancamentoEnum.PAGAR, 'Contas a pagar');
      case 'clientes': return this.carregarPessoas(PapelPessoaEnum.CLIENTE, 'Clientes');
      case 'fornecedores': return this.carregarPessoas(PapelPessoaEnum.FORNECEDOR, 'Fornecedores');
      case 'documentos-fiscais': return this.carregarDocumentos();
      case 'apuracao-anual': return this.carregarApuracaoAnual();
      case 'resumo-financeiro': return this.carregarResumoFinanceiro();
      default:
        this.loading = false;
        this.alerts.error('Relatório não encontrado.');
    }
  }

  carregarLancamentos(tipo?: TipoLancamentoEnum, titulo = 'Lançamentos financeiros') {
    this.titulo = titulo;
    this.subtitulo = this.periodoLabel();
    this.colunas = [
      { key: 'descricao', label: 'Descrição' }, { key: 'tipo', label: 'Tipo' }, { key: 'categoria', label: 'Categoria' },
      { key: 'pessoa', label: 'Pessoa' }, { key: 'competencia', label: 'Competência' }, { key: 'vencimento', label: 'Vencimento' },
      { key: 'situacao', label: 'Situação' }, { key: 'valor', label: 'Valor', tipo: 'currency' },
      { key: 'liquidado', label: 'Liquidado', tipo: 'currency' }, { key: 'saldo', label: 'Saldo', tipo: 'currency' },
    ];
    this.lancamentos.getAll().subscribe({
      next: r => {
        const itens = (r.body ?? []).filter(item =>
          (!tipo || item.tipo === tipo) &&
          (!this.inicio || item.dataVencimento >= this.inicio) &&
          (!this.fim || item.dataVencimento <= this.fim));
        this.linhas = itens.map(item => ({
          descricao: item.descricao, tipo: item.tipo === 'RECEBER' ? 'Receber' : 'Pagar',
          categoria: item.categoriaNome, pessoa: item.pessoaNome ?? '', competencia: item.dataCompetencia,
          vencimento: item.dataVencimento, situacao: SITUACAO_LANCAMENTO_LABELS[item.situacao] ?? item.situacao,
          valor: item.valor, liquidado: item.valorLiquidado, saldo: item.saldoAberto,
        }));
        this.totalizadores = [
          { label: 'Total', valor: soma(this.linhas, 'valor'), currency: true },
          { label: 'Liquidado', valor: soma(this.linhas, 'liquidado'), currency: true },
          { label: 'Saldo aberto', valor: soma(this.linhas, 'saldo'), currency: true },
        ];
        this.finalizar();
      },
      error: () => this.erro('Não foi possível carregar os lançamentos.'),
    });
  }

  carregarPessoas(papel: PapelPessoaEnum, titulo: string) {
    this.titulo = titulo;
    this.subtitulo = 'Pessoas ativas vinculadas ao papel selecionado';
    this.colunas = [
      { key: 'nome', label: 'Nome / Razão social' }, { key: 'tipo', label: 'Tipo' },
      { key: 'documento', label: 'CPF / CNPJ' }, { key: 'email', label: 'E-mail' }, { key: 'telefone', label: 'Telefone' },
    ];
    this.papeis.listar(papel).subscribe({
      next: r => {
        this.linhas = (r.body ?? []).map(item => ({
          nome: item.nomeRazaoSocial, tipo: item.tipoPessoa, documento: item.cpfCnpj ?? '',
          email: item.email ?? '', telefone: item.telefone ?? '',
        }));
        this.totalizadores = [{ label: 'Quantidade', valor: this.linhas.length }];
        this.finalizar();
      },
      error: () => this.erro(`Não foi possível carregar ${titulo.toLowerCase()}.`),
    });
  }

  carregarDocumentos() {
    this.titulo = 'Documentos fiscais';
    this.subtitulo = this.periodoLabel();
    this.colunas = [
      { key: 'emissao', label: 'Emissão' }, { key: 'tipo', label: 'Tipo' }, { key: 'numero', label: 'Número' },
      { key: 'cliente', label: 'Cliente' }, { key: 'situacao', label: 'Situação' },
      { key: 'valor', label: 'Valor', tipo: 'currency' }, { key: 'vinculado', label: 'Vinculado', tipo: 'currency' },
      { key: 'saldo', label: 'Saldo', tipo: 'currency' },
    ];
    this.documentos.getAll().subscribe({
      next: r => {
        const itens = (r.body ?? []).filter(item => (!this.inicio || item.dataEmissao >= this.inicio) && (!this.fim || item.dataEmissao <= this.fim));
        this.linhas = itens.map(item => ({
          emissao: item.dataEmissao, tipo: TIPO_DOCUMENTO_FISCAL_LABELS[item.tipo] ?? item.tipo,
          numero: item.numero, cliente: item.clienteNome ?? '', situacao: SITUACAO_DOCUMENTO_FISCAL_LABELS[item.situacao] ?? item.situacao,
          valor: item.valorTotal, vinculado: item.valorVinculado, saldo: item.saldoVincular,
        }));
        this.totalizadores = [
          { label: 'Quantidade', valor: this.linhas.length },
          { label: 'Valor total', valor: soma(this.linhas, 'valor'), currency: true },
          { label: 'Saldo a vincular', valor: soma(this.linhas, 'saldo'), currency: true },
        ];
        this.finalizar();
      },
      error: () => this.erro('Não foi possível carregar os documentos fiscais.'),
    });
  }

  carregarApuracaoAnual() {
    const ano = Number((this.competencia || this.inicio || new Date().getFullYear().toString()).slice(0, 4));
    this.titulo = 'Apuração MEI anual';
    this.subtitulo = `Ano ${ano}`;
    this.colunas = [
      { key: 'mes', label: 'Mês' }, { key: 'situacao', label: 'Situação' },
      { key: 'total', label: 'Faturamento', tipo: 'currency' }, { key: 'acumulado', label: 'Acumulado', tipo: 'currency' },
      { key: 'percentual', label: 'Uso do teto', tipo: 'number' },
    ];
    this.apuracao.historico(ano).subscribe({
      next: r => {
        this.linhas = r.meses.map(item => ({
          mes: `${String(item.mes).padStart(2, '0')}/${ano}`, situacao: item.situacao ?? 'Aberta',
          total: item.totalMes, acumulado: item.acumuladoAno, percentual: item.percentualUtilizado,
        }));
        this.totalizadores = [
          { label: 'Total no ano', valor: r.totalAno, currency: true },
          { label: 'Limite aplicável', valor: r.limiteAplicavel, currency: true },
          { label: 'Uso do teto', valor: `${r.percentualUtilizado}%` },
        ];
        this.finalizar();
      },
      error: () => this.erro('Não foi possível carregar a apuração anual.'),
    });
  }

  carregarResumoFinanceiro() {
    const [ano, mes] = (this.competencia || new Date().toISOString().slice(0, 7)).split('-').map(Number);
    this.titulo = 'Resumo financeiro mensal';
    this.subtitulo = `Competência ${String(mes).padStart(2, '0')}/${ano}`;
    this.colunas = [{ key: 'indicador', label: 'Indicador' }, { key: 'valor', label: 'Valor', tipo: 'currency' }];
    this.dashboard.carregar(ano, mes).subscribe({
      next: r => {
        this.linhas = [
          { indicador: 'Saldo total', valor: r.saldoTotal },
          { indicador: 'Entradas no mês', valor: r.entradasMes },
          { indicador: 'Saídas no mês', valor: r.saidasMes },
          { indicador: 'Contas a receber', valor: r.contasReceber },
          { indicador: 'Contas a pagar', valor: r.contasPagar },
          { indicador: 'Vencido a receber', valor: r.vencidoReceber },
          { indicador: 'Vencido a pagar', valor: r.vencidoPagar },
        ];
        this.totalizadores = [
          { label: 'Saldo total', valor: r.saldoTotal, currency: true },
          { label: 'Resultado do mês', valor: r.entradasMes - r.saidasMes, currency: true },
          { label: 'Vencidos', valor: r.quantidadeVencidos },
        ];
        this.finalizar();
      },
      error: () => this.erro('Não foi possível carregar o resumo financeiro.'),
    });
  }

  periodoLabel() {
    if (this.inicio && this.fim) return `Período de ${this.inicio} a ${this.fim}`;
    return 'Todos os registros disponíveis';
  }

  formatar(valor: string | number, coluna: ColunaRelatorio) {
    if (coluna.tipo === 'currency') return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    if (coluna.tipo === 'number') return Number(valor || 0).toLocaleString('pt-BR');
    return valor ?? '';
  }

  voltar() { this.location.back(); }
  imprimir() { window.print(); }

  exportarCsv() {
    const csv = [this.colunas.map(c => c.label), ...this.linhas.map(l => this.colunas.map(c => l[c.key] ?? ''))]
      .map(l => l.map(c => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${this.tipo}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  finalizar() { this.loading = false; this.changeDetector.detectChanges(); }
  erro(mensagem: string) { this.loading = false; this.alerts.error(mensagem); this.changeDetector.detectChanges(); }
}

function soma(linhas: LinhaRelatorio[], chave: string) {
  return linhas.reduce((total, linha) => total + Number(linha[chave] || 0), 0);
}
