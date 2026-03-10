import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AlertMessage, AlertService} from './alert.service';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'alert-component',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {

  toasts: AlertMessage[] = [];
  private sub!: Subscription;

  icons: Record<string, string> = {
    success: '✔️',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.sub = this.alertService.alertState$.subscribe((toast) => {
      this.toasts.push(toast);

      setTimeout(() => this.removeToast(toast), toast.duration || 4000);
    });
  }

  removeToast(t: AlertMessage) {
    this.toasts = this.toasts.filter(x => x !== t);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  pageSize = 3;
  currentPage = 0;

  getLines(message: string): string[] {
    return message.split('<br>').map(l => l.trim());
  }

  getPages(message: string): string[][] {
    const lines = this.getLines(message);
    const pages = [];
    for (let i = 0; i < lines.length; i += this.pageSize) {
      pages.push(lines.slice(i, i + this.pageSize));
    }
    return pages;
  }


}
