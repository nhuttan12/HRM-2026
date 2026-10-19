import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { CandidateProfileDetail } from './candidate-profile-detail.data';

export const mockCandidateDetails: CandidateProfileDetail[] = [
  {
    candidateCode: 'UV003',
    fullName: 'Nguyễn Văn Cường',
    email: 'cuong.nguyen@example.com',
    phone: '0901234567',
    position: 'Frontend Developer',

    applicationDate: '2026-10-01',
    dateOfBirth: '1998-05-15',
    gender: 'male',
    address: 'Quận 1, TP. Hồ Chí Minh',
    educationLevel: 'Đại học',

    experienceYears: 4,
    currentCompany: 'ABC Technology',
    expectedSalary: 25000000,
    noticePeriod: '30 ngày',

    workHistories: [
      {
        jobTitle: 'Frontend Developer',
        companyName: 'ABC Technology',
        startDate: '2023-06-01',
        endDate: null,
        description: 'Phát triển ứng dụng web bằng Angular và TypeScript.',
      },
      {
        jobTitle: 'Junior Frontend Developer',
        companyName: 'XYZ Solutions',
        startDate: '2021-07-01',
        endDate: '2023-05-31',
        description: 'Phát triển giao diện và tích hợp REST API.',
      },
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
      {
        certificateName: 'IELTS',
        certificateType: 'Ngoại ngữ',
        issueDate: '2024-06-20',
        expiryDate: '2026-06-20',
        issuingOrganization: 'British Council',
      },
    ],

    relatives: [
      {
        fullName: 'Nguyễn Văn Bình',
        relationship: 'Cha',
        birthYear: 1970,
        currentOccupation: 'Kỹ sư',
      },
      {
        fullName: 'Trần Thị Hoa',
        relationship: 'Mẹ',
        birthYear: 1973,
        currentOccupation: 'Giáo viên',
      },
    ],

    socialLinks: {
      facebook: 'https://www.facebook.com/',
      linkedin: 'https://www.linkedin.com/',
      github: 'https://github.com/',
      portfolio: 'https://portfolio.example.com',
    },

    skills: ['Angular', 'TypeScript', 'RxJS', 'HTML', 'SCSS'],
    cvUrl: 'https://example.com/cv/UV001.pdf',
    note: 'Có kinh nghiệm phát triển ứng dụng Angular.',
  },
  {
    candidateCode: 'UV002',
    fullName: 'Trần Thị Bình',
    email: 'tranthibinh@example.com',
    phone: '0912345678',
    position: 'Backend Developer',

    applicationDate: '2026-10-05',
    dateOfBirth: '1997-08-20',
    gender: 'female',
    address: 'TP. Thủ Đức, TP. Hồ Chí Minh',
    educationLevel: 'Cao đẳng',

    experienceYears: 5,
    currentCompany: 'XYZ Solutions',
    expectedSalary: 30000000,
    noticePeriod: '45 ngày',

    workHistories: [
      {
        jobTitle: 'Backend Developer',
        companyName: 'XYZ Solutions',
        startDate: '2022-01-01',
        endDate: null,
        description: 'Xây dựng REST API bằng Node.js và NestJS.',
      },
      {
        jobTitle: 'Junior Backend Developer',
        companyName: 'ABC Software',
        startDate: '2020-07-01',
        endDate: '2021-12-31',
        description: 'Phát triển API và làm việc với cơ sở dữ liệu.',
      },
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

    certificates: [
      {
        certificateName: 'AWS Certified Cloud Practitioner',
        certificateType: 'Điện toán đám mây',
        issueDate: '2025-02-10',
        expiryDate: '2028-02-10',
        issuingOrganization: 'Amazon Web Services',
      },
    ],

    relatives: [
      {
        fullName: 'Trần Văn Nam',
        relationship: 'Cha',
        birthYear: 1968,
        currentOccupation: 'Kinh doanh',
      },
    ],

    socialLinks: {
      facebook: null,
      linkedin: 'https://www.linkedin.com/',
      github: 'https://github.com/',
      portfolio: null,
    },

    skills: ['Node.js', 'NestJS', 'PostgreSQL', 'Docker'],
    cvUrl: 'https://example.com/cv/UV002.pdf',
    note: 'Có kinh nghiệm thiết kế REST API và microservices.',
  },
];

@Injectable({
  providedIn: 'root',
})
export class CandidateDetailService {
  getByCode(candidateCode?: string | null): Observable<CandidateProfileDetail> {
    console.log('[Service] Mã ứng viên nhận được:', candidateCode);

    const candidate = mockCandidateDetails[0];

    if (!candidate) {
      throw new Error('Danh sách mockCandidateDetails đang trống.');
    }

    console.log('[Service] Trả về dữ liệu mẫu:', candidate);

    return of({
      ...candidate,
    }).pipe(delay(1000));
  }
}