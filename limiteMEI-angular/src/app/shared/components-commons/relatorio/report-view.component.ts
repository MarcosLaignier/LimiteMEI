import { CommonModule, Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AuthService } from '../../../core/auth.service';
import { EmpresaAtivaService } from '../../../core/empresa-ativa.service';
import { ReportColumn, ReportFilter, ReportRow, ReportTotal } from './report.types';

@Component({
  selector: 'report-view',
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
          <div class="report-brand">
            @if(logoDataUrl) {
              <img [src]="logoDataUrl" alt="Logo da empresa">
            }
            <div>
              <strong>{{empresaNome}}</strong>
              <small>CNPJ: {{cnpjEmpresa || 'Não informado'}}</small>
            </div>
          </div>
          <div class="report-title">
            <span>RELATÓRIO</span>
            <h1>{{titulo}}</h1>
            <p>{{subtitulo}}</p>
          </div>
          <div class="report-emission">
            <span>Emitido em</span>
            <strong>{{emitidoEm}}</strong>
            <small>{{usuarioNome}}</small>
          </div>
        </header>

        @if(filtrosVisiveis.length) {
          <section class="report-filters">
            <strong>Filtros utilizados</strong>
            <div>
              @for(filtro of filtrosVisiveis; track filtro.label) {
                <span><b>{{filtro.label}}:</b> {{filtro.valor}}</span>
              }
            </div>
          </section>
        }

        @if (totalizadores.length) {
          <section class="totals">
            @for(total of totalizadores; track total.label) {
              <article>
                <span>{{total.label}}</span>
                <strong>{{total.currency ? (total.valor|currency:'BRL') : total.valor}}</strong>
              </article>
            }
          </section>
        }

        <section class="table-card">
          <div class="table-title">
            <strong>Registros</strong>
            <span>{{linhas.length}} item(ns)</span>
          </div>
          <div class="table-scroll">
            <table>
              <thead>
                <tr>
                  @for(coluna of colunas; track coluna.key) {
                    <th>{{coluna.label}}</th>
                  }
                </tr>
              </thead>
              <tbody>
                @if(!linhas.length) {
                  <tr><td [attr.colspan]="colunas.length" class="empty">Nenhum registro encontrado.</td></tr>
                } @else {
                  @for(linha of linhas; track $index) {
                    <tr>
                      @for(coluna of colunas; track coluna.key) {
                        <td [class.numeric]="coluna.tipo">{{formatar(linha[coluna.key], coluna)}}</td>
                      }
                    </tr>
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
    .report-header{display:grid;grid-template-columns:1fr 1.4fr 1fr;align-items:start;gap:1rem;margin-bottom:1rem;padding-bottom:1rem;border-bottom:1px solid #edf0f5}
    .report-brand{display:flex;align-items:center;gap:.75rem}.report-brand img{width:58px;height:58px;object-fit:contain;border:1px solid #e1e6ef;border-radius:8px}.report-brand div{display:flex;flex-direction:column}.report-brand strong{color:#203746}.report-brand small,.report-emission small{color:#687080}
    .report-title{text-align:center}.report-title span,.report-emission span{font-size:.75rem;color:#5570f1;font-weight:800;letter-spacing:.02em}.report-title h1{margin:.2rem 0;color:#203746;font-size:1.35rem}.report-title p{margin:0;color:#687080}
    .report-emission{text-align:right}.report-emission strong{display:block;color:#203746;font-size:.9rem}
    .report-filters{margin-bottom:1rem;padding:.75rem;border:1px solid #e1e6ef;border-radius:10px;background:#fbfcff}.report-filters>strong{display:block;margin-bottom:.45rem;color:#203746}.report-filters div{display:flex;flex-wrap:wrap;gap:.45rem .9rem}.report-filters span{font-size:.82rem;color:#475467}.report-filters b{color:#203746}
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
      .report-header{grid-template-columns:1fr 1.4fr 1fr;align-items:center;border-color:#333}
      .report-brand img{width:42px;height:42px}.report-title h1{font-size:18px;text-transform:uppercase}
      .report-filters{border-color:#333;border-radius:0;background:#fff}
      .totals{grid-template-columns:repeat(3,1fr)}
      .totals article,.table-card{border-color:#333;border-radius:0}
      .table-title{background:#fff;border-color:#333}
      th,td{padding:5px;border:1px solid #999;font-size:10px}
      th{background:#e9ecef!important}
      @page{size:A4 landscape;margin:8mm}
    }
  `]
})
export class ReportViewComponent {
  @Input() loading = false;
  @Input() titulo = 'Relatório';
  @Input() subtitulo = '';
  @Input() fileName = 'relatorio';
  @Input() linhas: ReportRow[] = [];
  @Input() colunas: ReportColumn[] = [];
  @Input() totalizadores: ReportTotal[] = [];
  @Input() filtros: ReportFilter[] = [];

  constructor(private location: Location, private empresaAtiva: EmpresaAtivaService, private auth: AuthService) {}

  voltar() { this.location.back(); }
  imprimir() {
    const tituloOriginal = document.title;
    document.title = this.nomeArquivoPadrao();
    window.print();
    setTimeout(() => document.title = tituloOriginal);
  }

  get empresaNome() {
    const empresa = this.empresaAtiva.empresa();
    return empresa?.nomeFantasia || empresa?.razaoSocial || 'Empresa não selecionada';
  }

  get cnpjEmpresa() { return this.empresaAtiva.empresa()?.cnpj ?? ''; }
  get logoDataUrl() { return this.empresaAtiva.empresa()?.logoDataUrl; }
  get usuarioNome() { return this.auth.user()?.nome || this.auth.user()?.email || 'Usuário não identificado'; }
  get emitidoEm() { return new Date().toLocaleString('pt-BR'); }
  get filtrosVisiveis() { return this.filtros.filter(f => f.valor !== undefined && f.valor !== null && String(f.valor).trim() !== ''); }

  formatar(valor: string | number, coluna: ReportColumn) {
    if (coluna.tipo === 'currency') return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    if (coluna.tipo === 'number') return Number(valor || 0).toLocaleString('pt-BR');
    return valor ?? '';
  }

  exportarCsv() {
    const metadados = [
      ['Relatório', this.titulo],
      ['Empresa', this.empresaNome],
      ['CNPJ', this.cnpjEmpresa || 'Não informado'],
      ['Emitido em', this.emitidoEm],
      ['Emitido por', this.usuarioNome],
      ['Filtros', this.filtrosVisiveis.map(f => `${f.label}: ${f.valor}`).join(' | ') || 'Nenhum filtro informado'],
      [],
    ];
    const dados = [this.colunas.map(c => c.label), ...this.linhas.map(l => this.colunas.map(c => this.formatar(l[c.key], c)))]
    const csv = [...metadados, ...dados]
      .map(l => l.map(c => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${this.nomeArquivoPadrao()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  private nomeArquivoPadrao() {
    const data = new Date();
    const stamp = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}_${String(data.getHours()).padStart(2, '0')}-${String(data.getMinutes()).padStart(2, '0')}`;
    return `limite-mei_${this.slug(this.fileName || this.titulo)}_${stamp}`;
  }

  private slug(valor: string) {
    return valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
}
