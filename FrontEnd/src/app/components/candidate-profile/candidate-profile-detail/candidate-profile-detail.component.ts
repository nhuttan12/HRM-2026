import { Component, computed, effect, inject, input, signal, viewChild } from '@angular/core';
import { LibAddButtonComponent } from '../../libs/lib-command-button/lib-add-button/lib-add-button.component';
import { LibEditButtonComponent } from '../../libs/lib-command-button/lib-edit-button/lib-edit-button.component';
import { LibRemoveButtonComponent } from '../../libs/lib-command-button/lib-remove-button/lib-remove-button.component';
import { LibSaveButtonComponent } from '../../libs/lib-command-button/lib-save-button/lib-save-button.component';
import { LibHrmTableComponent } from '../../libs/lib-hrm-table/lib-hrm-table.component';
import { LibInputComponent } from '../../libs/lib-input/lib-input.component';
import { LibSkeletonComponent } from '../../libs/lib-skeleton/lib-skeleton.component';
import { LibTextComponent } from '../../libs/lib-text/lib-text.component';
import { CandidateProfileDetailSidebarComponent } from './candidate-profile-detail-sidebar/candidate-profile-detail-sidebar.component';
import { candidateCertificateColumns, candidateDegreeColumns, candidateListFieldConfigs, candidateProfileFields, candidateSkillColumns, candidateWorkHistoryColumns } from './candidate-profile-detail.config';
import { CandidateEditableSection, CandidateListSection, CandidateProfileDetail, CandidateProfileSection, CandidateSkillRow } from './candidate-profile-detail.model';
import { CandidateDetailService } from './candidate-profile-detail.service';
import { CandidateProfileEditCanvasComponent } from './candidate-profile-edit-canvas/candidate-profile-edit-canvas.component';
import { CandidateListRowSaveEvent } from './candidate-profile-edit-canvas/candidate-profile-edit-canvas.model';

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
    LibSaveButtonComponent,
    CandidateProfileEditCanvasComponent,
  ],
})
export class CandidateProfileDetailComponent {
  private readonly candidateService = inject(CandidateDetailService);
  readonly candidateCode = input<string | null>(null);
  readonly candidate = signal<CandidateProfileDetail | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly fields = candidateProfileFields;
  readonly activeSection = signal<CandidateProfileSection>('overview');
  readonly editingSection = signal<CandidateEditableSection | null>(null);
  readonly editingDraft = signal<CandidateProfileDetail | null>(null);
  readonly editingListSection = signal<CandidateListSection | null>(null);
  readonly editingListRow = signal<Record<string, unknown> | null>(null);
  readonly editCanvas = viewChild(CandidateProfileEditCanvasComponent);

  readonly skillColumns = candidateSkillColumns;
  readonly workHistoryColumns = candidateWorkHistoryColumns;
  readonly degreeColumns = candidateDegreeColumns;
  readonly certificateColumns = candidateCertificateColumns;
  readonly listFieldConfigs = candidateListFieldConfigs;

  readonly skillRows = computed<CandidateSkillRow[]>(() => this.candidate()?.skills ?? []);
  readonly selectedRows = signal<Partial<Record<CandidateListSection, unknown[]>>>({});

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
    if (!this.editingDraft()) {
      const current = this.candidate();

      if (current) {
        this.editingDraft.set(structuredClone(current));
      }
    }

    this.editingSection.set(section);
  }

  onAddSectionItem(section: CandidateListSection): void {
    console.log('Thêm dữ liệu vào section:', section);

    // TODO: Mở form thêm dữ liệu tương ứng.
  }

  onRemoveSectionItem(section: CandidateListSection): void {
    const selected = this.selectedRows()[section] ?? [];

    if (selected.length === 0) {
      return;
    }

    console.log(`Xóa dữ liệu trong section: ${section}`, selected);
  }

  onSelectionChange(section: CandidateListSection, rows: unknown[]): void {
    this.selectedRows.update((current) => ({
      ...current,
      [section]: rows,
    }));
  }

  onSave(): void {
    // TODO: Gọi service lưu dữ liệu đã chỉnh sửa.
    console.log('Lưu hồ sơ ứng viên');
  }

  isSectionEditing(section: CandidateEditableSection): boolean {
    return this.editingSection() === section;
  }

  resetEditState(): void {
    this.editingSection.set(null);
    this.selectedRows.set({});

    // Reset dữ liệu chỉnh sửa chưa lưu.
    // Giá trị hiển thị sẽ lấy lại từ candidate() gốc.
    this.editingDraft.set(null);
  }

  onEditRow(section: CandidateListSection, row: unknown): void {
    if (!row || typeof row !== 'object') return;

    this.editCanvas()?.open(section, row as Record<string, unknown>);
  }

  onCloseRowCanvas(): void {
    this.editingListSection.set(null);
    this.editingListRow.set(null);
  }

  getListSectionTitle(section: CandidateListSection): string {
    const titles: Record<CandidateListSection, string> = {
      skills: 'Chỉnh sửa kỹ năng',
      certificates: 'Chỉnh sửa chứng chỉ',
      workHistories: 'Chỉnh sửa kinh nghiệm làm việc',
      degrees: 'Chỉnh sửa học vấn',
    };

    return titles[section];
  }

  onListFieldChange(key: string, value: unknown): void {
    this.editingListRow.update((row) => (row ? { ...row, [key]: value } : null));
  }

  onSaveListRow(event: CandidateListRowSaveEvent): void {
    const { section, row } = event;
    console.log('Lưu dữ liệu:', section, row);
  }
}