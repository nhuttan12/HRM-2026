import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { LibHrmTableComponent } from '../../libs/lib-hrm-table/lib-hrm-table.component';
import { LibInputComponent } from '../../libs/lib-input/lib-input.component';
import { LibSkeletonComponent } from '../../libs/lib-skeleton/lib-skeleton.component';
import { CandidateProfileDetailSidebarComponent } from './candidate-profile-detail-sidebar/candidate-profile-detail-sidebar.component';
import { CandidateDetailService } from './candidate-profile-detail.service';
import { candidateCertificateColumns, candidateDegreeColumns, candidateProfileFields, candidateSkillColumns, candidateWorkHistoryColumns } from './candidate-profile-detail.config';
import { CandidateProfileDetail, CandidateSkillRow } from './candidate-profile-detail.model';

@Component({
  selector: 'app-candidate-profile-detail',
  standalone: true,
  templateUrl: './candidate-profile-detail.component.html',
  styleUrl: './candidate-profile-detail.component.scss',
  imports: [
    LibSkeletonComponent,
    CandidateProfileDetailSidebarComponent,
    LibInputComponent,
    LibHrmTableComponent,
  ],
})
export class CandidateProfileDetailComponent {
  private readonly candidateService = inject(CandidateDetailService);
  readonly candidateCode = input<string | null>(null);
  readonly candidate = signal<CandidateProfileDetail | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly fields = candidateProfileFields;
  readonly activeSection = signal('overview');

  readonly skillColumns = candidateSkillColumns;
  readonly workHistoryColumns = candidateWorkHistoryColumns;
  readonly degreeColumns = candidateDegreeColumns;
  readonly certificateColumns = candidateCertificateColumns;

  readonly skillRows = computed<CandidateSkillRow[]>(() => this.candidate()?.skills ?? []);

  constructor() {
    effect((onCleanup) => {
      const code = this.candidateCode();

      this.candidate.set(null);
      this.error.set(null);

      if (!code) {
        this.loading.set(false);
        return;
      }

      this.loading.set(true);

      const subscription = this.candidateService.getByCode(code).subscribe({
        next: (data) => {
          this.candidate.set(data);
          this.loading.set(false);
        },
        error: (err: unknown) => {
          this.error.set(err instanceof Error ? err.message : 'Không thể tải thông tin ứng viên.');

          this.loading.set(false);
        },
      });

      onCleanup(() => subscription.unsubscribe());
    });
  }

  formatValue(value: unknown): string {
    if (value === null || value === undefined || value === '') {
      return '—';
    }

    if (typeof value === 'object') {
      return '—';
    }

    return String(value);
  }

  onSectionChange(section: string): void {
    this.activeSection.set(section);
  }
}