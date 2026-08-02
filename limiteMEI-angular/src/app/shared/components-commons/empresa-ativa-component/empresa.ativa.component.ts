import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmpresaAtivaService } from '../../../core/empresa-ativa.service';

@Component({
  selector: 'empresa-ativa-component',
  standalone: true,
  templateUrl: './empresa.ativa.component.html',
  styleUrl: './empresa.ativa.component.scss'
})
export class EmpresaAtivaComponent {
  constructor(public context: EmpresaAtivaService, private router: Router) {}

  trocar(): void {
    this.router.navigate(['/app/selecionar-empresa']);
  }
}
