import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertMessage {
  type: AlertType;
  message: string;
  duration?: number;
}

@Injectable({providedIn: 'root'})
export class AlertService {
  timerPadrao= 5000;
  private alertSubject = new Subject<AlertMessage>();
  alertState$ = this.alertSubject.asObservable();

  show(type: AlertType, message: string, duration: number = 4000) {
    this.alertSubject.next({ type, message, duration });
  }

  success(msg: string, alertTime?:number) { this.show('success', msg, alertTime ?? this.timerPadrao); }
  error(msg: string, alertTime?:number) { this.show('error', msg, alertTime ?? this.timerPadrao); }
  warning(msg: string, alertTime?:number) { this.show('warning', msg, alertTime ?? this.timerPadrao); }
  info(msg: string, alertTime?:number) { this.show('info', msg, alertTime ?? this.timerPadrao); }

}
