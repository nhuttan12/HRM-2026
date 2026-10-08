import { HrmTableColumn } from '../../libs/lib-hrm-table/lib-hrm-table.component';

export interface Candidate {
  id: number;
  candidateCode: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  status: string;
}

export const hrmTableColumns: HrmTableColumn<Candidate>[] = [
  {
    field: 'candidateCode',
    header: 'Candidate Code',
    width: '150px',
  },
  {
    field: 'fullName',
    header: 'Full Name',
    width: '220px',
  },
  {
    field: 'email',
    header: 'Email',
    width: '260px',
  },
  {
    field: 'phone',
    header: 'Phone',
    width: '160px',
  },
  {
    field: 'position',
    header: 'Position',
    width: '220px',
  },
  {
    field: 'status',
    header: 'Status',
    width: '140px',
  },
];

export const mockingCandidates: Candidate[] = [
  {
    id: 1,
    candidateCode: 'CAN001',
    fullName: 'Nguyễn Văn An',
    email: 'nguyenvanan@example.com',
    phone: '0901234567',
    position: 'Frontend Developer',
    status: 'Active',
  },
  {
    id: 2,
    candidateCode: 'CAN002',
    fullName: 'Trần Thị Bình',
    email: 'tranthibinh@example.com',
    phone: '0912345678',
    position: 'Backend Developer',
    status: 'Active',
  },
  {
    id: 3,
    candidateCode: 'CAN003',
    fullName: 'Lê Minh Cường',
    email: 'leminhcuong@example.com',
    phone: '0923456789',
    position: 'UI/UX Designer',
    status: 'Inactive',
  },
];
