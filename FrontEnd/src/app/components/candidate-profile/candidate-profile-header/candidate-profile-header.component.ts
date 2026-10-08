import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LibAddButtonComponent } from '../../libs/lib-command-button/lib-add-button/lib-add-button.component';
import { LibSearchButtonComponent } from '../../libs/lib-command-button/lib-search-button/lib-search-button.component';


@Component({
  selector: 'app-candidate-profile-header',
  standalone: true,
  imports: [
    FormsModule,
    LibAddButtonComponent,
    LibSearchButtonComponent,
  ],
  templateUrl: './candidate-profile-header.component.html',
})
export class LibCandidateProfileHeaderComponent {
  searchKeyword = signal('');

  searchAction = output<string>();
  addAction = output<void>();

  onSearch(): void {
    this.searchAction.emit(this.searchKeyword().trim());
  }

  onAdd(): void {
    this.addAction.emit();
  }
}