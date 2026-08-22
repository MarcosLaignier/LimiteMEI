import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { EmpresaAtivaComponent } from '../empresa-ativa-component/empresa.ativa.component';

interface MenuItem {
  label: string;
  icon?: string;
  route?: string;
  children?: MenuItem[];
  expanded?: boolean;
  section?: boolean;
}

@Component({
  selector: 'side-bar-component',
  standalone: true,
  imports: [RouterModule, EmpresaAtivaComponent],
  templateUrl: './side.bar.component.html',
  styleUrls: ['./side.bar.component.scss']
})
export class SideBarComponent implements OnInit {

  sidebarOpen = false;
  isMobile = false;

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'bi-house', route: '/app/dashboard' },

    {
      label: 'Cadastros Base',
      icon: 'bi-box',
      children: [
        { label: 'Empresa', icon: 'bi-building', route: '/app/cadastros/empresa' },
        { label: 'Categorias', icon: 'bi-tags', route: '/app/cadastros/categoria' },

      ]
    },

    {
      label: 'Pessoas',
      icon: 'bi-people',
      children: [
        {label: 'Cadastros', section: true},
        {label: 'Pessoas', icon: 'bi-person-vcard', route: '/app/cadastros/pessoa'},
        {label: 'Clientes', icon: 'bi-person-check', route: '/app/cadastros/cliente'},
        {label: 'Fornecedores', icon: 'bi-building-check', route: '/app/cadastros/fornecedor'},
        {label: 'Funcionários', icon: 'bi-person-badge', route: '/app/cadastros/funcionario'},
        {label: 'Relatórios', section: true},
        { label: 'Relatório de clientes', icon: 'bi-file-earmark-person', route: '/app/relatorios/clientes' },
        { label: 'Relatório de fornecedores', icon: 'bi-file-earmark-person', route: '/app/relatorios/fornecedores' }
      ]
    },
    {
      label: 'Caixa e bancos',
      icon: 'bi-bank',
      children: [
        {label: 'Contas financeiras', icon: 'bi-wallet2', route: '/app/financeiro/contas'},
        {label: 'Movimentações e extrato', icon: 'bi-arrow-left-right', route: '/app/financeiro/movimentacoes'}
      ]
    },

    {
      label: 'Financeiro',
      icon: 'bi-cash-stack',
      children: [
        { label: 'Operação', section: true },
        { label: 'Lançamentos', icon: 'bi-journal-plus', route: '/app/financeiro/lancamentos' },
        { label: 'Monitor de lançamentos', icon: 'bi-display', route: '/app/financeiro/monitor-lancamentos' },
        { label: 'Relatórios', section: true },
        { label: 'Relatório fluxo de caixa', icon: 'bi-file-earmark-bar-graph', route: '/app/relatorios/fluxo-caixa' },
        { label: 'Relatório lançamentos', icon: 'bi-file-earmark-text', route: '/app/relatorios/lancamentos' },
        { label: 'Relatório contas a receber', icon: 'bi-file-earmark-arrow-down', route: '/app/relatorios/contas-receber' },
        { label: 'Relatório contas a pagar', icon: 'bi-file-earmark-arrow-up', route: '/app/relatorios/contas-pagar' },
        { label: 'Relatório resumo financeiro', icon: 'bi-file-earmark-ruled', route: '/app/relatorios/resumo-financeiro' }
      ]
    },

    {
      label: 'MEI',
      icon: 'bi-graph-up-arrow',
      children: [
        { label: 'Operação', section: true },
        { label: 'Apuração e limite', icon: 'bi-speedometer2', route: '/app/financeiro/mei/apuracao' },
        { label: 'Obrigações MEI', icon: 'bi-calendar-event', route: '/app/financeiro/mei/obrigacoes' },
        { label: 'Histórico de apurações', icon: 'bi-calendar-check', route: '/app/financeiro/mei/historico' },
        { label: 'Relatórios', section: true },
        { label: 'Relatório apuração anual', icon: 'bi-file-earmark-spreadsheet', route: '/app/relatorios/apuracao-anual' }
      ]
    },
    {
      label: 'Fiscal',
      icon: 'bi-receipt',
      children: [
        { label: 'Operação', section: true },
        { label: 'Documentos fiscais', icon: 'bi-file-earmark-text', route: '/app/fiscal/documentos' },
        { label: 'Relatórios', section: true },
        { label: 'Relatório documentos fiscais', icon: 'bi-file-earmark-ruled', route: '/app/relatorios/documentos-fiscais' },
      ]
    },

    { label: 'Configurações', icon: 'bi-gear', route: '/app/configuracoes' }
  ];

  constructor(private router: Router, public auth: AuthService) {}

  ngOnInit() {
    this.checkScreen();
    window.addEventListener('resize', () => this.checkScreen());
    this.router.events.subscribe(() => this.expandMenuByRoute());
  }

  @Output()
  sidebarToggle = new EventEmitter<boolean>();

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    this.sidebarToggle.emit(this.sidebarOpen);
  }

  toggleSubmenu(item: MenuItem) {

    if (!this.sidebarOpen) {
      this.sidebarOpen = true;
      this.sidebarToggle.emit(true);

      this.menuItems.forEach(menu => menu.expanded = false);

      setTimeout(() => {
        item.expanded = true;
      }, 250);

      return;
    }

    this.menuItems.forEach(menu => {
      if (menu != item) {
        menu.expanded = false;
      }
    });

      item.expanded = !item.expanded;
  }

  expandMenuByRoute() {
    const currentUrl = this.router.url;

    this.menuItems.forEach(menu => {
      if (!menu.children) {
        menu.expanded = false;
        return;
      }

      menu.expanded = menu.children.some(child =>
        child.route && currentUrl.startsWith(child.route)
      );
    });
  }


  checkScreen() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.sidebarOpen = false;
    }
  }

  onNavigate() {
    if (this.isMobile) {
      this.sidebarOpen = false;
    }
  }
}
