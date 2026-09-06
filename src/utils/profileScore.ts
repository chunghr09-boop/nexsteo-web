import { CandidateProfile } from '../types';

export interface ScoreBreakdown {
  score: number;
  completedTasks: string[];
  pendingSuggestions: string[];
}

export function calculateProfileStrength(profile: CandidateProfile): ScoreBreakdown {
  let score = 0;
  const completedTasks: string[] = [];
  const pendingSuggestions: string[] = [];

  // Personal Info (25 points)
  if (profile.fullName && profile.email && profile.phone) {
    score += 15;
    completedTasks.push('Thông tin liên hệ cơ bản (Họ tên, SĐT, Email)');
  } else {
    pendingSuggestions.push('Điền đầy đủ họ tên, số điện thoại và email liên hệ');
  }

  if (profile.avatar) {
    score += 5;
    completedTasks.push('Ảnh đại diện chân dung chuyên nghiệp');
  } else {
    pendingSuggestions.push('Thêm ảnh đại diện để tăng 30% tỷ lệ mở hồ sơ');
  }

  if (profile.bio && profile.bio.length > 50) {
    score += 5;
    completedTasks.push('Đoạn giới thiệu bản thân chi tiết');
  } else {
    pendingSuggestions.push('Viết ít nhất 50 ký tự giới thiệu bản thân');
  }

  // Work Experience (25 points)
  if (profile.experiences && profile.experiences.length > 0) {
    score += 20;
    completedTasks.push(`Kinh nghiệm làm việc (${profile.experiences.length} vị trí)`);
    if (profile.experiences.some(e => e.achievements && e.achievements.length > 20)) {
      score += 5;
      completedTasks.push('Thành tựu và số liệu định lượng trong công việc');
    } else {
      pendingSuggestions.push('Bổ sung thêm thành tựu / số liệu đo lường ở kinh nghiệm');
    }
  } else {
    pendingSuggestions.push('Thêm ít nhất 1 kinh nghiệm làm việc hoặc dự án thực tập');
  }

  // Education (15 points)
  if (profile.educations && profile.educations.length > 0) {
    score += 15;
    completedTasks.push('Trình độ học vấn và bằng cấp');
  } else {
    pendingSuggestions.push('Thêm thông tin trường đại học / cao đẳng hoặc bằng cấp');
  }

  // Skills (15 points)
  if (profile.skills && profile.skills.length >= 5) {
    score += 15;
    completedTasks.push(`Kỹ năng chuyên môn & kỹ năng mềm (${profile.skills.length} kỹ năng)`);
  } else if (profile.skills && profile.skills.length > 0) {
    score += 8;
    pendingSuggestions.push('Thêm ít nhất 5 kỹ năng chuyên môn để nhà tuyển dụng dễ tìm thấy');
  } else {
    pendingSuggestions.push('Thêm các kỹ năng bạn thành thạo');
  }

  // Projects & Portfolio (10 points)
  if (profile.projects && profile.projects.length > 0) {
    score += 10;
    completedTasks.push('Dự án tiêu biểu & sản phẩm thực tế');
  } else {
    pendingSuggestions.push('Bổ sung dự án cá nhân hoặc link portfolio/GitHub');
  }

  // Certifications (5 points)
  if (profile.certificates && profile.certificates.length > 0) {
    score += 5;
    completedTasks.push('Chứng chỉ chuyên môn hoặc giải thưởng');
  } else {
    pendingSuggestions.push('Thêm chứng chỉ quốc tế / khóa học để tạo điểm nhấn');
  }

  // File CV đính kèm
  if (profile.attachedCvName) {
    score += 10;
    completedTasks.push(`Đã tải lên file CV đính kèm (${profile.attachedCvName})`);
  } else {
    pendingSuggestions.push('Tải lên file CV (PDF/DOCX) cá nhân để nộp nhanh cho nhà tuyển dụng');
  }

  const finalScore = Math.min(100, score);
  return {
    score: finalScore,
    completedTasks,
    pendingSuggestions
  };
}
