import { HrmTableColumn } from "../../libs/lib-hrm-table/lib-hrm-table.component";

export interface RecruitmentBatch {
  id: number;
  code: string;
  name: string;
  position: string;
  quantity: number;
  startDate: string;
  endDate: string;
  status: string;
}

export const columnsConfig: HrmTableColumn<RecruitmentBatch>[] = [
  {
    field: 'code',
    header: 'Mã đợt tuyển dụng',
    width: '160px',
  },
  {
    field: 'name',
    header: 'Tên đợt tuyển dụng',
    width: '280px',
  },
  {
    field: 'position',
    header: 'Vị trí tuyển dụng',
    width: '200px',
  },
  {
    field: 'quantity',
    header: 'Số lượng',
    width: '100px',
  },
  {
    field: 'startDate',
    header: 'Ngày bắt đầu',
    width: '130px',
  },
  {
    field: 'endDate',
    header: 'Ngày kết thúc',
    width: '130px',
  },
  {
    field: 'status',
    header: 'Trạng thái',
    width: '140px',
  },
];
