import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmSummaryItem } from './confirm.options';

@Component({
  selector: 'confirmation-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl:'./confirm.dialog.component.html',
  styleUrls: ['./confirm.dialog.component.scss']
})
export class ConfirmDialogComponent {

  @Input() title = 'Confirmação';
  @Input() message = '';
  @Input() confirmText = 'Sim';
  @Input() cancelText = 'Não';
  @Input() inputLabel?: string;
  @Input() inputPlaceholder = '';
  @Input() inputRequired = false;
  @Input() summaryItems: ConfirmSummaryItem[] = [];
  inputValue = '';

  @Output() confirm = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();
}
