export type SalaryType = 'range' | 'up_to' | 'from' | 'negotiable';

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  companySize: string;
  verifiedCompany: boolean;
  location: string;
  city: string;
  district: string;
  salaryText: string;
  minSalary?: number; // in million VND
  maxSalary?: number; // in million VND
  salaryType: SalaryType;
  level: string; // Thực tập sinh, Nhân viên, Trưởng nhóm, Trưởng phòng, Giám đốc
  experience: string; // Chưa có kinh nghiệm, Dưới 1 năm, 1 - 2 năm, 2 - 3 năm, 3 - 5 năm, Trên 5 năm
  jobType: string; // Toàn thời gian, Bán thời gian, Thực tập, Remote, Hybrid
  industry: string; // CNTT / Phần mềm, Marketing, Kinh doanh, Thiết kế, Tài chính, Nhân sự, v.v.
  tags: string[];
  requiredSkills: string[];
  deadline: string;
  postedAt: string;
  isHot?: boolean;
  isUrgent?: boolean;
  applicantsCount: number;
  viewsCount: number;
  description: string[];
  requirements: string[];
  benefits: string[];
  address: string;
  companyOverview: string;
  contactEmail: string;
}

export interface FilterState {
  keyword: string;
  city: string;
  industry: string;
  salaryRange: string;
  experience: string;
  level: string;
  jobType: string;
  isUrgentOnly: boolean;
  isRemoteOnly: boolean;
  sortBy: 'relevant' | 'newest' | 'salary_high' | 'deadline';
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  achievements?: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  grade: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1 to 5
  category: 'technical' | 'soft' | 'language';
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  link?: string;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  link?: string;
  description: string;
  techStack: string[];
}

export interface JobPreference {
  desiredTitle: string;
  desiredLevel: string;
  desiredMinSalary: number; // million VND
  desiredLocations: string[];
  desiredJobTypes: string[];
  desiredIndustries: string[];
}

export interface CandidateProfile {
  id: string;
  fullName: string;
  title: string;
  email: string;
  phone: string;
  birthday: string;
  gender: 'Nam' | 'Nữ' | 'Khác' | '';
  address: string;
  city: string;
  avatar: string;
  bio: string;
  careerObjective: string;
  website?: string;
  github?: string;
  linkedin?: string;
  experiences: WorkExperience[];
  educations: Education[];
  skills: Skill[];
  certificates: Certificate[];
  projects: Project[];
  preferences: JobPreference;
  isLookingForJob: boolean;
  allowRecruitersSearch: boolean;
  emailNotifications: boolean;
  profileStrength: number; // 0 - 100
  attachedCvName?: string;
  attachedCvSize?: string;
  attachedCvUpdatedAt?: string;
}

export type ApplicationStatus = 'applied' | 'viewed' | 'interview' | 'offered' | 'rejected';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  companyLogo: string;
  location: string;
  salaryText: string;
  appliedAt: string;
  status: ApplicationStatus;
  cvType: 'profile' | 'custom';
  cvName: string;
  coverLetter?: string;
  notes?: string;
  interviewDate?: string;
  applicantId?: string;
  applicantName?: string;
  applicantEmail?: string;
  applicantPhone?: string;
  applicantAvatar?: string;
}

export interface RecruiterView {
  id: string;
  companyName: string;
  companyLogo: string;
  viewedAt: string;
  jobTitleSearched: string;
  city: string;
}

export interface ChatMessage {
  id: string;
  sender: 'recruiter' | 'candidate' | 'admin';
  senderName: string;
  avatar: string;
  text: string;
  timestamp: string;
  jobTitle?: string;
  company?: string;
  candidateId?: string;
}

export type NotificationType = 
  | 'application_submitted' 
  | 'job_posted' 
  | 'application_status' 
  | 'recruiter_view' 
  | 'interview_invitation' 
  | 'job_recommendation' 
  | 'system_alert' 
  | 'new_message';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  targetName?: string;
  timestamp: string;
  isUnread: boolean;
  targetType?: 'job' | 'application' | 'recruiter_view' | 'chat' | 'url';
  targetId?: string;
  jobId?: string;
  applicationId?: string;
  companyName?: string;
  companyLogo?: string;
  candidateName?: string;
  candidateAvatar?: string;
  interviewDate?: string;
  notes?: string;
  salaryText?: string;
  location?: string;
  recipientRole?: 'candidate' | 'recruiter' | 'admin' | 'all';
  recipientUserId?: string;
}

export type AdminNotificationItem = AppNotification;

export interface AdminChatConversation {
  id: string;
  partnerType: 'recruiter' | 'candidate';
  partnerName: string;
  partnerRole: string;
  partnerAvatar: string;
  partnerCompany?: string;
  topic: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  messages: {
    id: string;
    sender: 'admin' | 'partner';
    senderName: string;
    avatar: string;
    text: string;
    timestamp: string;
  }[];
}

export type UserRole = 'guest' | 'candidate' | 'recruiter' | 'admin';

export type AuthProvider = 'google' | 'zalo' | 'phone' | 'facebook' | 'email';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  provider: AuthProvider;
  createdAt: string;
  status: 'active' | 'suspended';
  profileId?: string;
  companyName?: string;
  recruiterPosition?: string;
  companySize?: string;
}

export interface AdminActivityLog {
  id: string;
  action: string;
  target: string;
  performedBy: string;
  timestamp: string;
  type: 'job' | 'user' | 'application' | 'system';
}

export interface SystemSettings {
  companyName: string;
  brandSlogan: string;
  hotline: string;
  hotlineClean: string;
  email: string;
  address: string;
  workingHours: string;
  systemAnnouncement: string;
  isMaintenanceMode: boolean;

  // Khai báo & Vận hành Tên miền (Domain & Web Operations)
  primaryDomain?: string;
  subDomain?: string;
  serverIp?: string;
  sslProvider?: string;
  sslStatus?: 'active' | 'pending' | 'expired';
  dnsStatus?: 'connected' | 'checking' | 'error';
  cloudflareProxied?: boolean;
  domainOwnerName?: string;
  vnnicRegistrationNo?: string;
  bctNoticeStatus?: 'registered' | 'pending' | 'exempt';
  bctNoticeCode?: string;
  webPort?: number;
}

export interface TalentCandidate {
  id: string;
  fullName: string;
  title: string;
  avatar: string;
  city: string;
  experienceYears: string;
  desiredSalary: string;
  skills: string[];
  bio: string;
  education: string;
  profileStrength: number;
  isOpenForJob: boolean;
  contactEmail: string;
}
