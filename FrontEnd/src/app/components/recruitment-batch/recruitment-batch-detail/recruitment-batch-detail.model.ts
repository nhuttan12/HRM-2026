import { RecruitmentBatch } from "../recruitment-batch.model";

export interface RecruitmentBatchField {
  key: keyof RecruitmentBatch | 'experienceYears';
  label: string;
  width: 'half' | 'full';
}
