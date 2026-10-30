import { RecruitmentBatchField } from "./recruitment-batch-detail.model";

export const recruitmentBatchFields: RecruitmentBatchField[] = [
  { key: 'code', label: 'Mã đợt tuyển dụng', width: 'half' },
  { key: 'name', label: 'Tên đợt tuyển dụng', width: 'half' },
  { key: 'position', label: 'Vị trí tuyển dụng', width: 'half' },
  { key: 'quantity', label: 'Số lượng', width: 'half' },
  { key: 'startDate', label: 'Ngày bắt đầu', width: 'half' },
  { key: 'endDate', label: 'Ngày kết thúc', width: 'half' },
  { key: 'status', label: 'Trạng thái', width: 'half' },
  { key: 'experienceYears', label: 'Số năm kinh nghiệm', width: 'half' },
];
