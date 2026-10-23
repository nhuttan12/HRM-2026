import { Component, output, signal, viewChild } from '@angular/core';
import { LibCanvasComponent } from '../../../libs/lib-canvas/lib-canvas.component';
import { LibInputComponent } from '../../../libs/lib-input/lib-input.component';
import { LibTextComponent } from '../../../libs/lib-text/lib-text.component';
import { LibSaveButtonComponent } from '../../../libs/lib-command-button/lib-save-button/lib-save-button.component';
import { candidateListFieldConfigs } from '../candidate-profile-detail.config';
import { CandidateListSection } from '../candidate-profile-detail.model';
import { CandidateListRowSaveEvent } from './candidate-profile-edit-canvas.model';

@Component({
  selector: 'app-candidate-profile-edit-canvas',
  standalone: true,
  templateUrl: './candidate-profile-edit-canvas.component.html',
  imports: [LibCanvasComponent, LibInputComponent, LibTextComponent, LibSaveButtonComponent],
})
export class CandidateProfileEditCanvasComponent {
  private readonly canvas = viewChild(LibCanvasComponent);

  readonly section = signal<CandidateListSection | null>(null);
  readonly row = signal<Record<string, unknown> | null>(null);

  readonly fieldConfigs = candidateListFieldConfigs;

  readonly saveRow = output<CandidateListRowSaveEvent>();
  readonly closed = output<void>();

  open(section: CandidateListSection, row: Record<string, unknown>): void {
    this.section.set(section);
    this.row.set(structuredClone(row));
    this.canvas()?.open();
  }

  get title(): string {
    const section = this.section();
    if (!section) return 'Chỉnh sửa thông tin';

    const titles: Record<CandidateListSection, string> = {
      skills: 'Chỉnh sửa kỹ năng',
      certificates: 'Chỉnh sửa chứng chỉ',
      workHistories: 'Chỉnh sửa kinh nghiệm làm việc',
      degrees: 'Chỉnh sửa học vấn',
    };

    return titles[section];
  }

  onFieldChange(key: string, value: unknown): void {
    this.row.update((row) => (row ? { ...row, [key]: value } : null));
  }

  onSave(): void {
    const section = this.section();
    const row = this.row();

    if (!section || !row) return;

    this.saveRow.emit({ section, row });
  }

  onCanvasClosed(): void {
    this.section.set(null);
    this.row.set(null);
    this.closed.emit();
  }

  formatFieldValue(value: unknown): string {
    return value == null ? '' : String(value);
  }
}
