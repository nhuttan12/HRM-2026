import { Component, input, output } from '@angular/core';
import { LibCommandButtonComponent } from '../lib-command-button.component';

@Component({
  selector: 'lib-search-button',
  standalone: true,
  imports: [LibCommandButtonComponent],
  templateUrl: './lib-search-button.component.html',
  styleUrl: './lib-search-button.component.scss'
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