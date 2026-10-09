import { HrmTableColumn } from '../../libs/lib-hrm-table/lib-hrm-table.component';

export interface Candidate {
  id: number;
  candidateCode: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
}

export const hrmTableColumns: HrmTableColumn<Candidate>[] = [
  {
    field: 'candidateCode',
    header: 'Mã ứng viên',
    width: '150px',
  },
  {
    field: 'fullName',
    header: 'Họ và tên',
    width: '220px',
  },
  {
    field: 'email',
    header: 'Email',
    width: '260px',
  },
  {
    field: 'phone',
    header: 'Số điện thoại',
    width: '160px',
  },
  {
    field: 'position',
    header: 'Vị trí ứng tuyển',
    width: '220px',
  },
];

export const mockingCandidates: Candidate[] = [
  {
    id: 1,
    candidateCode: 'UV001',
    fullName: 'Nguyễn Văn An',
    email: 'nguyenvanan@example.com',
    phone: '0901234567',
    position: 'Frontend Developer',
  },
  {
    id: 2,
    candidateCode: 'UV002',
    fullName: 'Trần Thị Bình',
    email: 'tranthibinh@example.com',
    phone: '0912345678',
    position: 'Backend Developer',
  },
  {
    id: 3,
    candidateCode: 'UV003',
    fullName: 'Lê Minh Cường',
    email: 'leminhcuong@example.com',
    phone: '0923456789',
    position: 'UI/UX Designer',
  },
];
