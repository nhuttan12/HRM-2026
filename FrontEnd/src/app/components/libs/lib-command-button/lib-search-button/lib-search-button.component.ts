import { Component, input, output } from '@angular/core';
import { LibCommandButtonComponent } from '../lib-command-button.component';
import { LibInputComponent } from '../../lib-input/lib-input.component';

@Component({
  selector: 'lib-search-button',
  standalone: true,
  imports: [LibCommandButtonComponent, LibInputComponent],
  templateUrl: './lib-search-button.component.html',
})
export class LibSearchButtonComponent {
  placeholder = input('Tìm kiếm...');
  keyword = input('');

  keywordChange = output<string>();
  searchAction = output<void>();

  onKeywordChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.keywordChange.emit(value);
  }

  onSearch(): void {
    this.searchAction.emit();
  }
}