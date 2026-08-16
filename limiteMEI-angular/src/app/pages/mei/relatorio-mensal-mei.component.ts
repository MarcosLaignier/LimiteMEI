import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RelatorioMensalMeiDTO } from '../../dtos/mei/apuracao-mei.dto';
import { ApuracaoMeiService } from '../../services/apuracao-mei.service';
import { AlertService } from '../../shared/components-commons/infra/alert-component/alert.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="screen-actions"><button onclick="history.back()"><i class="bi bi-arrow-left"></i> Voltar</button><button class="primary" (click)="imprimir()"><i class="bi bi-printer"></i> Imprimir / Salvar PDF</button></div>
    @if (relatorio) {
      <main class="sheet">
        <header><h1>RELATÓRIO MENSAL DAS RECEITAS BRUTAS</h1><div class="company-data"><span><strong>CNPJ:</strong> {{formatarCnpj(relatorio.cnpj)}}</span><span><strong>Razão social:</strong> {{relatorio.razaoSocial}}</span>@if(relatorio.nomeFantasia){<span><strong>Nome fantasia:</strong> {{relatorio.nomeFantasia}}</span>}<span><strong>Data de abertura:</strong> {{relatorio.dataAbertura|date:'dd/MM/yyyy':'UTC'}}</span><span><strong>Período de apuração:</strong> {{nomeMes(relatorio.mes)}} de {{relatorio.ano}}</span></div></header>
        @if(!relatorio.situacao){<div class="draft">PRÉVIA — APURAÇÃO AINDA NÃO FECHADA</div>}
        <section><h2>RECEITA BRUTA MENSAL — REVENDA DE MERCADORIAS (COMÉRCIO)</h2><p><span>Com dispensa de emissão de documento fiscal</span><strong>{{relatorio.comercioSemDocumento|currency:'BRL'}}</strong></p><p><span>Com documento fiscal emitido</span><strong>{{relatorio.comercioComDocumento|currency:'BRL'}}</strong></p><p class="total"><span>Total das receitas com revenda de mercadorias</span><strong>{{relatorio.comercioSemDocumento+relatorio.comercioComDocumento|currency:'BRL'}}</strong></p></section>
        <section><h2>RECEITA BRUTA MENSAL — VENDA DE PRODUTOS INDUSTRIALIZADOS</h2><p><span>Com dispensa de emissão de documento fiscal</span><strong>{{relatorio.industriaSemDocumento|currency:'BRL'}}</strong></p><p><span>Com documento fiscal emitido</span><strong>{{relatorio.industriaComDocumento|currency:'BRL'}}</strong></p><p class="total"><span>Total das receitas com produtos industrializados</span><strong>{{relatorio.industriaSemDocumento+relatorio.industriaComDocumento|currency:'BRL'}}</strong></p></section>
        <section><h2>RECEITA BRUTA MENSAL — PRESTAÇÃO DE SERVIÇOS</h2><p><span>Com dispensa de emissão de documento fiscal</span><strong>{{relatorio.servicosSemDocumento|currency:'BRL'}}</strong></p><p><span>Com documento fiscal emitido</span><strong>{{relatorio.servicosComDocumento|currency:'BRL'}}</strong></p><p class="total"><span>Total das receitas com prestação de serviços</span><strong>{{relatorio.servicosSemDocumento+relatorio.servicosComDocumento|currency:'BRL'}}</strong></p></section>
        <div class="grand-total"><span>TOTAL GERAL DAS RECEITAS BRUTAS NO MÊS</span><strong>{{relatorio.total|currency:'BRL'}}</strong></div>
        <div class="year-total"><span>RECEITA BRUTA ACUMULADA NO ANO</span><strong>{{relatorio.acumuladoAno|currency:'BRL'}}</strong></div>
        <footer>@if(relatorio.situacao){<p>Apuração fechada em {{relatorio.dataFechamento|date:'dd/MM/yyyy HH:mm'}} por {{relatorio.usuarioFechamento}}.</p>}<div class="signature"><span></span><p>Assinatura do empresário</p></div><small>Os documentos fiscais relativos às entradas e saídas devem permanecer anexados a este relatório, quando aplicável.</small></footer>
      </main>
    } @else { <div class="loading"><span class="spinner-border spinner-border-sm"></span> Gerando relatório...</div> }
  `,
  styles: [`
    .screen-actions{display:flex;justify-content:flex-end;gap:.6rem;margin-bottom:1rem}.screen-actions button{padding:.6rem 1rem;border:1px solid #ccd2df;border-radius:6px;background:#fff}.screen-actions .primary{border-color:#5570f1;background:#5570f1;color:#fff}.sheet{width:210mm;min-height:297mm;margin:auto;padding:14mm;background:#fff;color:#111;box-shadow:0 2px 14px #0002}.sheet header h1{text-align:center;font-size:18px}.company-data{display:grid!important;grid-template-columns:1fr 1fr;gap:5px 20px!important;margin:18px 0!important}.draft{text-align:center;padding:8px;border:2px solid #b77900;color:#8a5900;font-weight:700}.sheet section{margin-top:14px;border:1px solid #333}.sheet section h2{margin:0;padding:7px;background:#e9ecef;font-size:12px}.sheet section p{display:flex;justify-content:space-between;margin:0;padding:7px;border-top:1px solid #777;font-size:12px}.sheet section .total{font-weight:700;background:#f5f5f5}.grand-total,.year-total{display:flex;justify-content:space-between;margin-top:14px;padding:10px;border:2px solid #111;font-weight:700}.year-total{margin-top:0;border-top:0;background:#f5f5f5}.sheet footer{margin-top:25px;font-size:11px}.signature{width:280px;margin:45px auto 20px;text-align:center}.signature span{display:block;border-top:1px solid #111}.signature p{margin-top:5px}.loading{text-align:center;padding:4rem}@media print{.screen-actions{display:none}.sheet{width:auto;min-height:auto;margin:0;padding:6mm;box-shadow:none}@page{size:A4;margin:8mm}}
  `],
})
export class RelatorioMensalMeiComponent implements OnInit {
  relatorio?: RelatorioMensalMeiDTO;
  private readonly meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  constructor(private route: ActivatedRoute, private service: ApuracaoMeiService,
              private alerts: AlertService, private changeDetector: ChangeDetectorRef) {}
  ngOnInit() {
    const ano = Number(this.route.snapshot.paramMap.get('ano'));
    const mes = Number(this.route.snapshot.paramMap.get('mes'));
    this.service.relatorio(ano, mes).subscribe({
      next: r => { this.relatorio = r; this.changeDetector.detectChanges(); },
      error: () => { this.alerts.error('Não foi possível gerar o relatório mensal.'); this.changeDetector.detectChanges(); },
    });
  }
  nomeMes(mes:number){return this.meses[mes-1];}
  formatarCnpj(cnpj:string){return cnpj?.replace(/^(..)(...)(...)(....)(..)$/, '$1.$2.$3/$4-$5') ?? '';}
  imprimir(){window.print();}
}
