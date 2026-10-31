import { Component, computed, effect, inject, input, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LibHrmTableComponent } from '../../libs/lib-hrm-table/lib-hrm-table.component';
import { LibInputComponent } from '../../libs/lib-input/lib-input.component';
import { LibEditButtonComponent } from '../../libs/lib-command-button/lib-edit-button/lib-edit-button.component';
import { LibSaveButtonComponent } from '../../libs/lib-command-button/lib-save-button/lib-save-button.component';
import { LibTextComponent } from '../../libs/lib-text/lib-text.component';
import { RecruitmentBatch } from '../recruitment-batch.model';
import {
  CandidateCertificate,
  CandidateDegree,
  CandidateSkillRow,
} from '../../candidate-profile/candidate-profile-detail/candidate-profile-detail.model';
import {
  RecruitmentBatchDetail,
  RecruitmentBatchField,
  RecruitmentBatchSection,
} from './recruitment-batch-detail.model';
import {
  recruitmentBatchCertificateColumns,
  recruitmentBatchDegreeColumns,
  recruitmentBatchFields,
  recruitmentBatchSkillColumns,
} from './recruitment-batch-detail.config';
import { RecruitmentBatchDetailSidebarComponent } from './recruitment-batch-detail-sidebar/recruitment-batch-detail-sidebar.component';
import { CandidateProfileAddCanvasComponent } from '../../candidate-profile/candidate-profile-detail/candidate-profile-add-canvas/candidate-profile-add-canvas.component';
import { CandidateListRowAddEvent } from '../../candidate-profile/candidate-profile-detail/candidate-profile-add-canvas/candidate-profile-add-canvas.model';
import type { CandidateListSection } from '../../candidate-profile/candidate-profile-detail/candidate-profile-detail.model';

@Component({
  selector: 'lib-recruitment-batch-detail',
  standalone: true,
  imports: [ReactiveFormsModule, LibTextComponent, LibHrmTableComponent, LibInputComponent, LibEditButtonComponent, LibSaveButtonComponent, RecruitmentBatchDetailSidebarComponent, CandidateProfileAddCanvasComponent],
  templateUrl: './recruitment-batch-detail.component.html',
})
export class RecruitmentBatchDetailComponent {
  private readonly fb = inject(FormBuilder);
  data = input<RecruitmentBatch | null>(null);

  readonly addCanvas = viewChild(CandidateProfileAddCanvasComponent);
  readonly selectedRows = signal<Partial<Record<CandidateListSection, unknown[]>>>({});

  readonly activeSection = signal<RecruitmentBatchSection>('overview');
  readonly isEditingOverview = signal(false);
  readonly detail = signal<RecruitmentBatchDetail | null>(null);

  readonly overviewFields = recruitmentBatchFields.filter(
    (field) => field.key !== 'skills' && field.key !== 'degrees' && field.key !== 'certificates',
  );

  readonly skillColumns = recruitmentBatchSkillColumns;
  readonly degreeColumns = recruitmentBatchDegreeColumns;
  readonly certificateColumns = recruitmentBatchCertificateColumns;

  readonly overviewForm: FormGroup;
  readonly skillForm: FormGroup;
  readonly degreeForm: FormGroup;
  readonly certificateForm: FormGroup;

  readonly skillRows = computed<CandidateSkillRow[]>(() => this.detail()?.skills ?? []);
  readonly degreeRows = computed<CandidateDegree[]>(() => this.detail()?.degrees ?? []);
  readonly certificateRows = computed<CandidateCertificate[]>(() => this.detail()?.certificates ?? []);

  constructor() {
    this.overviewForm = this.fb.group(
      this.overviewFields.reduce<Record<string, unknown>>((acc, field) => {
        acc[field.key] = [''];
        return acc;
      }, {}),
    );

    this.skillForm = this.fb.group({
      skill: [''],
      yearsOfExperience: [0],
      companyName: [''],
    });

    this.degreeForm = this.fb.group({
      schoolName: [''],
      graduationType: [''],
      studyYear: [null],
      graduationYear: [null],
      major: [''],
    });

    this.certificateForm = this.fb.group({
      certificateName: [''],
      certificateType: [''],
      issueDate: [''],
      expiryDate: [null],
      issuingOrganization: [''],
    });

    effect(() => {
      const item = this.data();
      if (!item) {
        this.detail.set(null);
        this.overviewForm.reset({}, { emitEvent: false });
        return;
      }

      const nextDetail: RecruitmentBatchDetail = {
        ...(item as unknown as RecruitmentBatchDetail),
        skills: Array.isArray((item as unknown as Record<string, unknown>)['skills'])
          ? ((item as unknown as Record<string, unknown>)['skills'] as CandidateSkillRow[])
          : [],
        degrees: Array.isArray((item as unknown as Record<string, unknown>)['degrees'])
          ? ((item as unknown as Record<string, unknown>)['degrees'] as CandidateDegree[])
          : [],
        certificates: Array.isArray((item as unknown as Record<string, unknown>)['certificates'])
          ? ((item as unknown as Record<string, unknown>)['certificates'] as CandidateCertificate[])
          : [],
      };

      this.detail.set(nextDetail);
      this.overviewForm.patchValue(nextDetail as unknown as Record<string, unknown>, {
        emitEvent: false,
      });
      this.resetRowForms();
    });
  }

  onSectionChange(section: RecruitmentBatchSection): void {
    this.activeSection.set(section);
  }

  onAddSectionItem(section: CandidateListSection): void {
    this.addCanvas()?.open(section);
  }

  onSelectionChange(section: CandidateListSection, rows: unknown[]): void {
    this.selectedRows.update((current) => ({
      ...current,
      [section]: rows,
    }));
  }

  onRemoveSectionItem(section: CandidateListSection): void {
    const selected = this.selectedRows()[section] ?? [];
    if (selected.length === 0) return;
    console.log(`Xóa dữ liệu trong section: ${section}`, selected);
  }

  onAddListRow(event: CandidateListRowAddEvent): void {
    const current = this.detail();
    if (!current) return;

    const row = event.row;
    if (event.section === 'skills') {
      const next: CandidateSkillRow = {
        skill: String(row['skill'] ?? row['name'] ?? ''),
        yearsOfExperience: Number(row['yearsOfExperience'] ?? 0),
        companyName: String(row['companyName'] ?? row['company'] ?? ''),
      };
      this.detail.set({ ...current, skills: [...current.skills, next] });
    } else if (event.section === 'degrees') {
      const next: CandidateDegree = {
        schoolName: String(row['schoolName'] ?? ''),
        graduationType: String(row['graduationType'] ?? row['degreeName'] ?? ''),
        studyYear: row['studyYear'] == null ? null : Number(row['studyYear']),
        graduationYear: row['graduationYear'] == null ? null : Number(row['graduationYear']),
        major: row['major'] == null ? null : String(row['major']),
      };
      this.detail.set({ ...current, degrees: [...current.degrees, next] });
    } else if (event.section === 'certificates') {
      const next: CandidateCertificate = {
        certificateName: String(row['certificateName'] ?? row['name'] ?? ''),
        certificateType: String(row['certificateType'] ?? row['type'] ?? ''),
        issueDate: String(row['issueDate'] ?? ''),
        expiryDate: row['expiryDate'] == null ? null : String(row['expiryDate']),
        issuingOrganization: row['issuingOrganization'] == null ? null : String(row['issuingOrganization'] ?? row['issuedBy']),
      };
      this.detail.set({ ...current, certificates: [...current.certificates, next] });
    }
  }

  getFieldLabel(key: RecruitmentBatchField['key']): string {
    return recruitmentBatchFields.find((field) => field.key === key)?.label ?? String(key);
  }

  removeSkillRow(row: CandidateSkillRow): void {
    const current = this.detail();
    if (!current) return;
    const index = current.skills.findIndex((item) => item === row);
    if (index >= 0) this.removeSkill(index);
  }

  removeDegreeRow(row: CandidateDegree): void {
    const current = this.detail();
    if (!current) return;
    const index = current.degrees.findIndex((item) => item === row);
    if (index >= 0) this.removeDegree(index);
  }

  removeCertificateRow(row: CandidateCertificate): void {
    const current = this.detail();
    if (!current) return;
    const index = current.certificates.findIndex((item) => item === row);
    if (index >= 0) this.removeCertificate(index);
  }

  resetRowForms(): void {
    this.skillForm.reset({ skill: '', yearsOfExperience: 0, companyName: '' }, { emitEvent: false });
    this.degreeForm.reset(
      { schoolName: '', graduationType: '', studyYear: null, graduationYear: null, major: '' },
      { emitEvent: false },
    );
    this.certificateForm.reset(
      { certificateName: '', certificateType: '', issueDate: '', expiryDate: null, issuingOrganization: '' },
      { emitEvent: false },
    );
  }

  onEditOverview(): void {
    this.isEditingOverview.set(true);
  }

  saveOverview(): void {
    const current = this.detail();
    if (!current || this.overviewForm.invalid) {
      return;
    }

    this.detail.set({
      ...current,
      ...(this.overviewForm.value as Partial<RecruitmentBatchDetail>),
    });
    this.isEditingOverview.set(false);
  }

  addSkill(): void {
    const current = this.detail();
    if (!current || this.skillForm.invalid) {
      return;
    }

    const row = this.skillForm.value as CandidateSkillRow;
    this.detail.set({ ...current, skills: [...current.skills, row] });
    this.skillForm.reset({ skill: '', yearsOfExperience: 0, companyName: '' }, { emitEvent: false });
  }

  removeSkill(index: number): void {
    const current = this.detail();
    if (!current) {
      return;
    }

    this.detail.set({
      ...current,
      skills: current.skills.filter((_, i) => i !== index),
    });
  }

  addDegree(): void {
    const current = this.detail();
    if (!current || this.degreeForm.invalid) {
      return;
    }

    const row = this.degreeForm.value as CandidateDegree;
    this.detail.set({ ...current, degrees: [...current.degrees, row] });
    this.degreeForm.reset(
      { schoolName: '', graduationType: '', studyYear: null, graduationYear: null, major: '' },
      { emitEvent: false },
    );
  }

  removeDegree(index: number): void {
    const current = this.detail();
    if (!current) {
      return;
    }

    this.detail.set({
      ...current,
      degrees: current.degrees.filter((_, i) => i !== index),
    });
  }

  addCertificate(): void {
    const current = this.detail();
    if (!current || this.certificateForm.invalid) {
      return;
    }

    const row = this.certificateForm.value as CandidateCertificate;
    this.detail.set({ ...current, certificates: [...current.certificates, row] });
    this.certificateForm.reset(
      { certificateName: '', certificateType: '', issueDate: '', expiryDate: null, issuingOrganization: '' },
      { emitEvent: false },
    );
  }

  removeCertificate(index: number): void {
    const current = this.detail();
    if (!current) {
      return;
    }

    this.detail.set({
      ...current,
      certificates: current.certificates.filter((_, i) => i !== index),
    });
  }
}













