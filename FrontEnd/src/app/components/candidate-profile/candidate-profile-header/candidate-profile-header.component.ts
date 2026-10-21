import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LibAddButtonComponent } from '../../libs/lib-command-button/lib-add-button/lib-add-button.component';
import { LibSearchButtonComponent } from '../../libs/lib-command-button/lib-search-button/lib-search-button.component';
import { LibRemoveButtonComponent } from '../../libs/lib-command-button/lib-remove-button/lib-remove-button.component';
import { LibTextComponent } from '../../libs/lib-text/lib-text.component';


@Component({
  selector: 'app-candidate-profile-header',
  standalone: true,
  imports: [FormsModule, LibAddButtonComponent, LibSearchButtonComponent, LibRemoveButtonComponent, LibTextComponent],
  templateUrl: './candidate-profile-header.component.html',
})
export class LibCandidateProfileHeaderComponent {
  searchKeyword = signal('');

  readonly searchAction = output<string>();
  readonly addAction = output<void>();
  readonly removeAction = output<void>();

  onSearch(): void {
    this.searchAction.emit(this.searchKeyword().trim());
  }

  onAdd(): void {
    this.addAction.emit();
  }

  onRemove(): void {
    this.removeAction.emit();
  }
}