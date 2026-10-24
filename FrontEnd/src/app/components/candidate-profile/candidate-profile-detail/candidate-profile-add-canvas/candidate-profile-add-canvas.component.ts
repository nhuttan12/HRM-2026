import { Component, output, signal, viewChild } from '@angular/core';

import { LibCanvasComponent } from '../../../libs/lib-canvas/lib-canvas.component';
import { LibInputComponent } from '../../../libs/lib-input/lib-input.component';
import { LibTextComponent } from '../../../libs/lib-text/lib-text.component';
import { LibSaveButtonComponent } from '../../../libs/lib-command-button/lib-save-button/lib-save-button.component';

import { candidateListFieldConfigs } from '../candidate-profile-detail.config';
import type { CandidateListSection } from '../candidate-profile-detail.model';
import { CandidateListRowAddEvent } from './candidate-profile-add-canvas.model';

@Component({
  selector: 'app-candidate-profile-add-canvas',
  standalone: true,
  templateUrl: './candidate-profile-add-canvas.component.html',
  imports: [LibCanvasComponent, LibInputComponent, LibTextComponent, LibSaveButtonComponent],
})
export class CandidateProfileAddCanvasComponent {
  private readonly canvas = viewChild(LibCanvasComponent);

  readonly section = signal<CandidateListSection | null>(null);

  readonly row = signal<Record<string, unknown> | null>(null);

  readonly addRow = output<CandidateListRowAddEvent>();

  readonly fieldConfigs = candidateListFieldConfigs;

  readonly titles: Record<CandidateListSection, string> = {
    skills: 'Thêm kỹ năng',
    certificates: 'Thêm chứng chỉ',
    workHistories: 'Thêm kinh nghiệm làm việc',
    degrees: 'Thêm học vấn',
  };

  readonly title = signal('Thêm thông tin');

  /**
   * Mở canvas với form trắng theo loại dữ liệu được chọn.
   */
  open(section: CandidateListSection): void {
    const fields = this.fieldConfigs[section];

    const emptyRow = Object.fromEntries(fields.map((field) => [field.key, '']));

    this.section.set(section);
    this.row.set(emptyRow);
    this.title.set(this.titles[section]);

    this.canvas()?.open();
  }

  formatFieldValue(value: unknown): string {
    return value == null ? '' : String(value);
  }

  onFieldChange(key: string, value: unknown): void {
    this.row.update((current) => (current ? { ...current, [key]: value } : null));
  }

  onSave(): void {
    const section = this.section();
    const row = this.row();

    if (!section || !row) {
      return;
    }

    this.addRow.emit({
      section,
      row,
    });

    this.canvas()?.close();
  }

  onCanvasClosed(): void {
    this.section.set(null);
    this.row.set(null);
  }
}
