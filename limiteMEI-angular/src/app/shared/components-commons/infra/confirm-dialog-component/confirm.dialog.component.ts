import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'confirmation-dialog',
  standalone: true,
  templateUrl:'./confirm.dialog.component.html',
  styleUrls: ['./confirm.dialog.component.scss']
})
export class ConfirmDialogComponent {

  @Input() title = 'Confirmação';
  @Input() message = '';
  @Input() confirmText = 'Sim';
  @Input() cancelText = 'Não';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
