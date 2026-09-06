import { CandidateProfile, Application } from '../types';
import { 
  INITIAL_PROFILE, 
  INITIAL_PROFILE_THAO, 
  INITIAL_PROFILE_DUC,
  INITIAL_PROFILES_MAP 
} from '../data/initialProfile';

export const getCandidateProfileForApplicant = (params: {
  applicantName?: string;
  applicantId?: string;
  application?: Application;
  activeProfile?: CandidateProfile;
}): CandidateProfile => {
  const { applicantName = '', applicantId = '', application, activeProfile } = params;

  // 1. Kiểm tra ID trong INITIAL_PROFILES_MAP
  if (applicantId && INITIAL_PROFILES_MAP[applicantId]) {
    return INITIAL_PROFILES_MAP[applicantId];
  }
  if (applicantId && INITIAL_PROFILES_MAP[`user-${applicantId}`]) {
    return INITIAL_PROFILES_MAP[`user-${applicantId}`];
  }

  // 2. Kiểm tra theo tên ứng viên
  const lowerName = applicantName.toLowerCase().trim();
  if (lowerName.includes('hoàng minh') || lowerName.includes('nguyễn hoàng minh')) {
    return INITIAL_PROFILE;
  }
  if (lowerName.includes('thu thảo') || lowerName.includes('lê thị thu thảo')) {
    return INITIAL_PROFILE_THAO;
  }
  if (lowerName.includes('văn đức') || lowerName.includes('trần văn đức')) {
    return INITIAL_PROFILE_DUC;
  }

  // 3. Kiểm tra activeProfile nếu trùng tên
  if (activeProfile && (activeProfile.fullName.toLowerCase().trim() === lowerName || activeProfile.id === applicantId)) {
    return activeProfile;
  }

  // 4. Tạo profile từ Application nếu là ứng viên mới
  return {
    id: applicantId || `cand-${Date.now()}`,
    fullName: applicantName || 'Ứng viên Nextstep',
    title: application?.jobTitle ? `Chuyên viên ${application.jobTitle}` : 'Ứng viên tiềm năng',
    email: application?.applicantEmail || 'ungvien@nextstep.vn',
    phone: application?.applicantPhone || '0988 765 432',
    birthday: '1996-05-15',
    gender: 'Nam',
    address: 'Hà Nội / TP. Hồ Chí Minh',
    city: 'TP. Hồ Chí Minh',
    avatar: application?.applicantAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
    bio: application?.coverLetter || 'Ứng viên tài năng trên nền tảng Nextstep, sở hữu tinh thần học hỏi cao và kỹ năng chuyên môn vững chắc.',
    careerObjective: 'Mong muốn cống hiến hết mình cho sự phát triển của quý doanh nghiệp.',
    experiences: [
      {
        id: 'exp-dyn-1',
        company: application?.company || 'Doanh nghiệp Công nghệ',
        position: application?.jobTitle || 'Chuyên viên kỹ thuật',
        startDate: '2023-01',
        endDate: 'Hiện tại',
        isCurrent: true,
        description: 'Phụ trách công việc chuyên môn và phối hợp liên phòng ban để hoàn thành các mục tiêu dự án xuất sắc.'
      }
    ],
    educations: [
      {
        id: 'edu-dyn-1',
        school: 'Đại học Quốc Gia',
        degree: 'Cử nhân / Kỹ sư',
        major: 'Chuyên ngành kỹ thuật',
        startDate: '2015-09',
        endDate: '2019-06',
        grade: 'Giỏi'
      }
    ],
    skills: [
      { id: 'sk-1', name: 'Kỹ năng chuyên môn', level: 5, category: 'technical' },
      { id: 'sk-2', name: 'Làm việc nhóm & Giao tiếp', level: 4, category: 'soft' },
      { id: 'sk-3', name: 'Tiếng Anh giao tiếp', level: 4, category: 'language' }
    ],
    certificates: [],
    projects: [],
    preferences: {
      desiredTitle: application?.jobTitle || 'Chuyên viên',
      desiredLevel: 'Nhân viên / Chuyên viên',
      desiredMinSalary: 20,
      desiredLocations: ['Hà Nội', 'TP. Hồ Chí Minh'],
      desiredJobTypes: ['Toàn thời gian'],
      desiredIndustries: ['CNTT / Phần mềm']
    },
    isLookingForJob: true,
    allowRecruitersSearch: true,
    emailNotifications: true,
    profileStrength: 90,
    attachedCvName: application?.cvName || 'CV_Ung_Vien.pdf',
    attachedCvSize: '2.5 MB',
    attachedCvUpdatedAt: application?.appliedAt ? application.appliedAt.split(' ')[0] : '2026-03-01'
  };
};
