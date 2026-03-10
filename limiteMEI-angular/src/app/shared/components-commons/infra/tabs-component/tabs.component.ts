import {AfterContentInit, Component, ContentChildren, QueryList} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TabComponent} from './tab.component';

@Component({
  selector: 'tabs-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterContentInit {

  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;

  ngAfterContentInit(): void {
    const firstEnabled = this.tabs.find(t => !t.disabled);
    if (firstEnabled) {
      this.selectTab(firstEnabled);
    }
  }

  selectTab(tab: TabComponent): void {
    if (tab.disabled) return;

    this.tabs.forEach(t => (t.active = false));
    tab.active = true;
  }
}
