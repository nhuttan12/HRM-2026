import { RecruitmentBatch } from "./recruitment-batch-header/recruitment-batch-header.config";

export const recruitmentBatchesData: RecruitmentBatch[] = [
  {
    id: 1,
    code: 'TD-2026-001',
    name: 'Tuyển dụng lập trình viên tháng 8',
    position: 'Frontend Developer',
    quantity: 3,
    startDate: '01/08/2026',
    endDate: '31/08/2026',
    status: 'Đang tuyển',
  },
  {
    id: 2,
    code: 'TD-2026-002',
    name: 'Tuyển dụng Backend Developer',
    position: 'Backend Developer',
    quantity: 2,
    startDate: '05/08/2026',
    endDate: '15/09/2026',
    status: 'Đang tuyển',
  },
  {
    id: 3,
    code: 'TD-2026-003',
    name: 'Tuyển dụng nhân viên kinh doanh',
    position: 'Sales Executive',
    quantity: 5,
    startDate: '10/07/2026',
    endDate: '10/08/2026',
    status: 'Đã kết thúc',
  },
];
