import { Component, EventEmitter, Output, signal } from '@angular/core';
import { Candidate, hrmTableColumns, mockingCandidates } from './candidate-profile-table.model';
import { LibHrmTableComponent } from '../../libs/lib-hrm-table/lib-hrm-table.component';
import { LibSkeletonComponent } from '../../libs/lib-skeleton/lib-skeleton.component';

@Component({
  selector: 'app-candidate-profile-table',
  standalone: true,
  imports: [LibHrmTableComponent, LibSkeletonComponent],
  templateUrl: './candidate-profile-table.component.html',
  styleUrl: './candidate-profile-table.component.scss',
})
export class CandidateProfileTableComponent {
  loading = signal(true);

  readonly skeletonRows = Array.from({ length: 7 });
  readonly columns = hrmTableColumns;
  readonly candidates = mockingCandidates;

  selectedCandidates: Candidate[] = [];

  @Output() selectionAction = new EventEmitter<Candidate[]>();

  constructor() {
    setTimeout(() => {
      this.loading.set(false);
    }, 2000);
  }

  onSelectionChange(selected: Candidate[]): void {
    this.selectedCandidates = selected;

    this.selectionAction.emit(selected);
  }
}
