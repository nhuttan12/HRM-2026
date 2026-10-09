import { Component, output, signal } from '@angular/core';
import { LibHrmTableComponent } from '../../libs/lib-hrm-table/lib-hrm-table.component';
import { LibSkeletonComponent } from '../../libs/lib-skeleton/lib-skeleton.component';
import { Candidate, hrmTableColumns, mockingCandidates } from './candidate-profile-table.model';

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

  readonly selectionAction = output<Candidate[]>();
  readonly candidateClick = output<Candidate>();

  constructor() {
    setTimeout(() => {
      this.loading.set(false);
    }, 2000);
  }

  onSelectionChange(selected: Candidate[]): void {
    this.selectedCandidates = selected;

    this.selectionAction.emit(selected);
  }

  onCandidateClick(candidate: Candidate): void {
    this.candidateClick.emit(candidate);
  }
}
