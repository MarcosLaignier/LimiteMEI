import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'tab',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (active) {
      <div class="tab-pane fade show active">
        <ng-content />
      </div>
    }
  `
})
export class TabComponent {
  @Input() title!: string;
  @Input() icon?: string;
  @Input() disabled: boolean = false;

  active: boolean = false;
}
