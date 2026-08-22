import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { DashboardDTO } from '../../dtos/dashboard/dashboard.dto';
import { DashboardService } from '../../services/dashboard.service';
import { AlertService } from '../../shared/components-commons/infra/alert-component/alert.service';
import { MonthYearBoxComponent } from '../../shared/components-commons/infra/month-year-box-component/month.year.box.component';
import { ToolbarComponent } from '../../shared/components-commons/infra/toolbar-filter-component/toolbar.component';
import { MeiLimitAlertComponent } from '../../shared/components-commons/mei-limit-alert-component/mei-limit-alert.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, MonthYearBoxComponent, ToolbarComponent, MeiLimitAlertComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  dashboard?: DashboardDTO;
  competencia = '';
  loading = false;
  readonly meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  constructor(public auth: AuthService, private service: DashboardService, private alerts: AlertService,
              private changeDetector: ChangeDetectorRef) {}
  ngOnInit() { this.periodoAtual(); }
  periodoAtual() {
    const hoje = new Date();
    this.competencia = `${hoje.getFullYear()}-${String(hoje.getMonth()+1).padStart(2,'0')}-01`;
    this.carregar();
  }
  carregar() {
    const [ano, mes] = this.competencia.split('-').map(Number);
    if (!ano || !mes) { this.alerts.error('Informe a competência do dashboard.'); return; }
    this.loading = true;
    this.service.carregar(ano, mes).pipe(finalize(()=>{this.loading=false;this.changeDetector.detectChanges();})).subscribe({
      next: resultado => {this.dashboard=resultado;this.changeDetector.detectChanges();},
      error: e => this.alerts.error(e?.error?.messages?.join('<br>')||'Não foi possível carregar o dashboard.'),
    });
  }
  alturaBarra(valor:number) {
    const maior = Math.max(...(this.dashboard?.mei.meses.map(item=>item.total)??[0]), 1);
    return Math.max(valor > 0 ? 8 : 2, Math.round(valor * 100 / maior));
  }
  saldoMes() { return (this.dashboard?.entradasMes??0)-(this.dashboard?.saidasMes??0); }
  get competenciaQueryParams() { return { competencia: this.competencia }; }
  get apuracaoQueryParams() {
    const [ano, mes] = this.competencia.split('-').map(Number);
    return { ano, mes };
  }
}
