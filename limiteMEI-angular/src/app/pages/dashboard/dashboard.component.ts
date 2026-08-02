import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor(public auth: AuthService) {}
}
