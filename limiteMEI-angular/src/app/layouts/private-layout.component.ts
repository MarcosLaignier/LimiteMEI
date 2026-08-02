import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBarComponent } from '../shared/components-commons/side-bar-component/side.bar.component';
import { AlertComponent } from '../shared/components-commons/infra/alert-component/alert.component';

@Component({
  standalone: true,
  imports: [RouterOutlet, SideBarComponent, AlertComponent],
  template: `
    <div class="app-layout" [class.sidebar-collapsed]="!sidebarOpen">
      <side-bar-component (sidebarToggle)="sidebarOpen = $event" />
      <main class="app-content"><router-outlet /></main>
      <alert-component />
    </div>
  `,
  styles: [`
    .app-layout { display: flex; min-height: 100vh; background: #f5f7fb; }
    .app-content { margin-left: 260px; padding: 1.5rem; transition: margin-left .3s ease; width: 100%; }
    .sidebar-collapsed .app-content { margin-left: 72px; }
    @media (max-width: 768px) { .app-content { margin-left: 0; padding: 1rem; } }
  `]
})
export class PrivateLayoutComponent {
  sidebarOpen = false;
}
