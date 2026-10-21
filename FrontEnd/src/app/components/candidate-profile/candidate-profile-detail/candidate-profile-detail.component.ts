import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { LibHrmTableComponent } from '../../libs/lib-hrm-table/lib-hrm-table.component';
import { LibInputComponent } from '../../libs/lib-input/lib-input.component';
import { LibSkeletonComponent } from '../../libs/lib-skeleton/lib-skeleton.component';
import { CandidateProfileDetailSidebarComponent } from './candidate-profile-detail-sidebar/candidate-profile-detail-sidebar.component';
import { CandidateDetailService } from './candidate-profile-detail.service';
import { candidateCertificateColumns, candidateDegreeColumns, candidateProfileFields, candidateSkillColumns, candidateWorkHistoryColumns } from './candidate-profile-detail.config';
import { CandidateEditableSection, CandidateListSection, CandidateProfileDetail, CandidateProfileSection, CandidateSkillRow } from './candidate-profile-detail.model';
import { LibEditButtonComponent } from '../../libs/lib-command-button/lib-edit-button/lib-edit-button.component';
import { LibAddButtonComponent } from '../../libs/lib-command-button/lib-add-button/lib-add-button.component';
import { LibRemoveButtonComponent } from '../../libs/lib-command-button/lib-remove-button/lib-remove-button.component';
import { LibTextComponent } from '../../libs/lib-text/lib-text.component';

@Component({
  selector: 'app-candidate-profile-detail',
  standalone: true,
  templateUrl: './candidate-profile-detail.component.html',
  imports: [
    LibSkeletonComponent,
    CandidateProfileDetailSidebarComponent,
    LibInputComponent,
    LibHrmTableComponent,
    LibEditButtonComponent,
    LibAddButtonComponent,
    LibRemoveButtonComponent,
    LibTextComponent,
  ],
})
export class CandidateProfileDetailComponent {
  private readonly candidateService = inject(CandidateDetailService);
  readonly candidateCode = input<string | null>(null);
  readonly candidate = signal<CandidateProfileDetail | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly fields = candidateProfileFields;
  readonly activeSection = signal <CandidateProfileSection>('overview');

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

  onSectionChange(section: CandidateProfileSection): void {
    this.activeSection.set(section);
  }

  onEditSection(section: CandidateEditableSection): void {
    console.log('Edit section:', section);
  }

  onAddSectionItem(section: CandidateListSection): void {
    console.log('Thêm dữ liệu vào section:', section);

    // TODO: Mở form thêm dữ liệu tương ứng.
  }

  onRemoveSectionItem(section: CandidateListSection): void {
    console.log('Xóa dữ liệu trong section:', section);

    // TODO: Xử lý chọn dòng và xác nhận xóa.
  }
}