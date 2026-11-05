import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { RecruitmentBatchDetail } from './recruitment-batch-detail.model';

export const mockRecruitmentBatchDetails: RecruitmentBatchDetail[] = [
  {
    id: 1,
    code: 'TD-2026-001',
    name: 'Tuyển dụng lập trình viên tháng 8',
    position: 'Frontend Developer',
    quantity: 3,
    startDate: '01/08/2026',
    endDate: '31/08/2026',
    status: 'Đang mở',
    experienceYears: 3,

    proposalDate: '2026-10-15',
    approvedBy: 'Trần Văn A',

    openedBy: 'Nguyễn Thị B',
    openedDate: '2026-10-20',
    approvedDate: '2026-10-18',
    closedDate: null,

    createdBy: 'Hệ thống',
    updatedBy: 'Nguyễn Thị B',
    hiringManager: 'Lê Văn C',
    hrOwner: 'Phan Thị D',
    department: 'Phát triển phần mềm',
    location: 'Tp. Hồ Chí Minh',
    salaryRange: '15-25 triệu',
    priority: 'Cao',
    note: 'Cần nhân viên có kinh nghiệm Angular và TypeScript',

    skills: [
      { skill: 'Angular', yearsOfExperience: 3, companyName: 'ABC Technology' },
      { skill: 'TypeScript', yearsOfExperience: 2, companyName: 'XYZ Solutions' },
      { skill: 'RxJS', yearsOfExperience: 2, companyName: 'ABC Technology' },
    ],
    degrees: [
      {
        schoolName: 'Đại học Công nghệ Thông tin',
        graduationType: 'Tốt nghiệp loại Giỏi',
        studyYear: 2016,
        graduationYear: 2020,
        major: 'Công nghệ phần mềm',
      },
    ],
    certificates: [
      {
        certificateName: 'Angular Developer',
        certificateType: 'Chuyên môn',
        issueDate: '2024-03-15',
        expiryDate: null,
        issuingOrganization: 'Example Training Center',
      },
    ],
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
    experienceYears: 5,

    proposalDate: '2026-10-10',
    approvedBy: 'Trần Văn A',

    openedBy: null,
    openedDate: null,
    approvedDate: '2026-10-12',
    closedDate: null,

    createdBy: 'Hệ thống',
    updatedBy: 'Trần Văn A',
    hiringManager: 'Lê Văn C',
    hrOwner: 'Phan Thị D',
    department: 'Phát triển phần mềm',
    location: 'Hà Nội',
    salaryRange: '20-30 triệu',
    priority: 'Trung bình',
    note: 'Cần nhân viên có kinh nghiệm Node.js và NestJS',

    skills: [
      { skill: 'Node.js', yearsOfExperience: 5, companyName: 'Tech Solutions' },
      { skill: 'NestJS', yearsOfExperience: 3, companyName: 'Tech Solutions' },
      { skill: 'PostgreSQL', yearsOfExperience: 4, companyName: 'Data Systems' },
    ],
    degrees: [
      {
        schoolName: 'Cao đẳng Kỹ thuật Cao Thắng',
        graduationType: 'Tốt nghiệp loại Khá',
        studyYear: 2016,
        graduationYear: 2019,
        major: 'Công nghệ thông tin',
      },
    ],
    certificates: [],
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
    experienceYears: 2,

    proposalDate: '2026-09-01',
    approvedBy: 'Trần Văn A',

    openedBy: 'Nguyễn Thị B',
    openedDate: '2026-09-05',
    approvedDate: '2026-09-03',
    closedDate: '2026-08-15',

    createdBy: 'Hệ thống',
    updatedBy: 'Nguyễn Thị B',
    hiringManager: 'Lê Văn C',
    hrOwner: 'Phan Thị D',
    department: 'Kinh doanh',
    location: 'Đà Nẵng',
    salaryRange: '12-18 triệu',
    priority: 'Cao',
    note: 'Cần nhân viên kinh doanh có kinh nghiệm bán hàng',

    skills: [
      { skill: 'Tư vấn bán hàng', yearsOfExperience: 2, companyName: 'Công ty ABC' },
      { skill: 'Chăm sóc khách hàng', yearsOfExperience: 3, companyName: 'Công ty XYZ' },
    ],
    degrees: [
      {
        schoolName: 'Đại học Kinh tế Quốc dân',
        graduationType: 'Tốt nghiệp loại Khá',
        studyYear: 2018,
        graduationYear: 2022,
        major: 'Kinh doanh',
      },
    ],
    certificates: [
      {
        certificateName: 'Chứng chỉ tư vấn bán hàng',
        certificateType: 'Chuyên môn',
        issueDate: '2023-06-01',
        expiryDate: null,
        issuingOrganization: 'Trung tâm đào tạo bán hàng',
      },
    ],
  },
];

@Injectable({
  providedIn: 'root',
})
export class RecruitmentBatchDetailService {
  getByCode(batchCode?: string | null): Observable<RecruitmentBatchDetail> {
    console.log('[Service] Mã đợt tuyển dụng nhận được:', batchCode);

    const batch = mockRecruitmentBatchDetails.find(
      (item) => item.code === batchCode,
    );

    if (!batch) {
      throw new Error('Không tìm thấy dữ liệu mẫu cho mã đợt tuyển dụng.');
    }

    console.log('[Service] Trả về dữ liệu mẫu:', batch);

    return of({ ...batch }).pipe(delay(1000));
  }
}