import { Component, computed, input, output, signal } from '@angular/core';
import {
  Candidate,
  hrmTableColumns,
  mockingCandidates,
} from '../../candidate-profile/candidate-profile-table/candidate-profile-table.model';
import { LibCanvasComponent } from '../../libs/lib-canvas/lib-canvas.component';
import { LibHrmTableComponent } from '../../libs/lib-hrm-table/lib-hrm-table.component';
import { LibInputComponent } from '../../libs/lib-input/lib-input.component';
import { LibSaveButtonComponent } from '../../libs/lib-command-button/lib-save-button/lib-save-button.component';
import { LibTextComponent } from '../../libs/lib-text/lib-text.component';

@Component({
  selector: 'app-recruitment-tracking-add-candidate',
  standalone: true,
  imports: [
    LibCanvasComponent,
    LibHrmTableComponent,
    LibInputComponent,
    LibSaveButtonComponent,
    LibTextComponent,
  ],
  templateUrl: './recruitment-tracking-add-candidate.component.html',
})
export class RecruitmentTrackingAddCandidateComponent {
  readonly opened = input(false);
  readonly excludedIds = input<number[]>([]);
  readonly closed = output<void>();
  readonly added = output<Candidate[]>();
  readonly columns = hrmTableColumns;
  readonly keyword = signal('');
  readonly selected = signal<Candidate[]>([]);
  readonly candidates = computed(() => {
    const excluded = new Set(this.excludedIds());
    const keyword = this.keyword().trim().toLocaleLowerCase('vi');
    return mockingCandidates.filter(
      (candidate) =>
        !excluded.has(candidate.id) &&
        [
          candidate.candidateCode,
          candidate.fullName,
          candidate.email,
          candidate.phone,
          candidate.position,
        ].some((value) => value.toLocaleLowerCase('vi').includes(keyword)),
    );
  });

  addSelected(): void {
    const excluded = new Set(this.excludedIds());
    const candidates = this.selected().filter((candidate) => !excluded.has(candidate.id));
    if (!candidates.length) return;
    this.added.emit(candidates);
    this.reset();
  }

  close(): void {
    this.reset();
    this.closed.emit();
  }

  private reset(): void {
    this.selected.set([]);
    this.keyword.set('');
  }
}
