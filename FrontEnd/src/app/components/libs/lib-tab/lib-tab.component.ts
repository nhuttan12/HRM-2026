import { Component, input, output } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { Tab } from './lib-tab.model';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'lib-tab',
  standalone: true,
  imports: [TabsModule, NgTemplateOutlet],
  templateUrl: './lib-tab.component.html',
})
export class LibTabComponent<T> {
  tabs = input<Tab<T>[]>([]);
  value = input<string | number | undefined>(undefined);
  lazy = input(false);
  scrollable = input(false);
  showNavigators = input(true);

  valueChange = output<string | number | undefined>();
}
