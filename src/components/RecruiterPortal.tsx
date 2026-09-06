import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Users, 
  FileText, 
  CheckCircle2, 
  DollarSign, 
  MapPin, 
  Eye, 
  Send, 
  Briefcase, 
  Search, 
  Calendar, 
  Clock, 
  Mail, 
  Phone, 
  Filter, 
  Trash2, 
  ExternalLink, 
  ChevronRight, 
  Sparkles, 
  Award, 
  GraduationCap, 
  MessageSquare, 
  AlertCircle, 
  X, 
  Edit3, 
  Bookmark, 
  Share2, 
  ThumbsUp, 
  UserCheck, 
  UserX, 
  Video, 
  BarChart3, 
  TrendingUp 
} from 'lucide-react';
import { Job, CandidateProfile, Application, ApplicationStatus, TalentCandidate } from '../types';
import { CITIES, INDUSTRIES } from '../data/mockJobs';
import { MOCK_TALENT_POOL } from '../data/mockTalentPool';
import { useAuth } from '../context/AuthContext';
import { isTestAccount } from '../data/initialProfile';

interface RecruiterPortalProps {
  jobs: Job[];
  onPostNewJob: (newJob: Job) => void;
  onUpdateJob?: (updatedJob: Job) => void;
  onDeleteJob?: (jobId: string) => void;
  candidateProfile: CandidateProfile;
  applications: Application[];
  onUpdateApplicationStatus?: (appId: string, newStatus: ApplicationStatus, notes?: string, interviewDate?: string) => void;
  onBackToCandidateMode: () => void;
  onOpenChatWithCandidate?: (candidateName: string, jobTitle?: string) => void;
  onOpenAdminChat?: () => void;
  onNavigateToAnalytics?: () => void;
}

export const RecruiterPortal: React.FC<RecruiterPortalProps> = ({
  jobs,
  onPostNewJob,
  onUpdateJob,
  onDeleteJob,
  candidateProfile,
  applications,
  onUpdateApplicationStatus,
  onBackToCandidateMode,
  onOpenChatWithCandidate,
  onOpenAdminChat,
  onNavigateToAnalytics
}) => {
  const { currentUser, isRecruiter, isAdmin } = useAuth();

  // Tab navigation: 'overview' | 'jobs' | 'post' | 'candidates' | 'talent' | 'company'
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'post' | 'candidates' | 'talent' | 'company'>('overview');
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Filter states
  const [candidateFilterJob, setCandidateFilterJob] = useState<string>('all');
  const [candidateFilterStatus, setCandidateFilterStatus] = useState<string>('all');
  const [jobSearchTerm, setJobSearchTerm] = useState<string>('');
  const [talentSearchTerm, setTalentSearchTerm] = useState<string>('');
  const [talentCityFilter, setTalentCityFilter] = useState<string>('all');

  const getCvSearchKey = (uid?: string) => `jobsgo_cv_search_history_${uid || 'guest'}`;
  const getRecruiterProfileKey = (uid?: string) => `jobsgo_recruiter_company_profile_${uid || 'guest'}`;

  // Lịch sử tìm kiếm ứng viên / CV (Tách biệt theo từng tài khoản nhà tuyển dụng)
  const [cvSearchHistory, setCvSearchHistory] = useState<string[]>(() => {
    const uid = currentUser?.id;
    if (uid) {
      const saved = localStorage.getItem(getCvSearchKey(uid));
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {}
      }
    }
    if (currentUser?.id === 'user-recruiter-001') {
      return ['React', 'UI/UX Designer', 'NodeJS'];
    }
    return [];
  });

  // Tự động chuyển đổi lịch sử tìm kiếm CV khi đổi tài khoản
  useEffect(() => {
    const uid = currentUser?.id;
    if (uid) {
      const saved = localStorage.getItem(getCvSearchKey(uid));
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setCvSearchHistory(parsed);
            return;
          }
        } catch (e) {}
      }
    }
    if (currentUser?.id === 'user-recruiter-001') {
      setCvSearchHistory(['React', 'UI/UX Designer', 'NodeJS']);
    } else {
      setCvSearchHistory([]);
    }
  }, [currentUser?.id]);

  const handleRecordCvSearch = (kw: string) => {
    const clean = kw.trim();
    if (!clean) return;
    setCvSearchHistory(prev => {
      const filtered = prev.filter(k => k.toLowerCase() !== clean.toLowerCase());
      const nextList = [clean, ...filtered].slice(0, 8);
      if (currentUser?.id) {
        localStorage.setItem(getCvSearchKey(currentUser.id), JSON.stringify(nextList));
      }
      return nextList;
    });
  };

  const handleClearCvSearchHistory = () => {
    setCvSearchHistory([]);
    if (currentUser?.id) {
      localStorage.removeItem(getCvSearchKey(currentUser.id));
    }
  };

  // Modals state
  const [selectedCandidateDetail, setSelectedCandidateDetail] = useState<{
    application: Application;
    profile: CandidateProfile;
  } | null>(null);

  const [selectedTalentDetail, setSelectedTalentDetail] = useState<TalentCandidate | null>(null);

  const [scheduleInterviewApp, setScheduleInterviewApp] = useState<Application | null>(null);
  const [interviewDate, setInterviewDate] = useState('2026-03-12T10:00');
  const [interviewFormat, setInterviewFormat] = useState<'online' | 'office'>('online');
  const [interviewLocation, setInterviewLocation] = useState('Google Meet (https://meet.google.com/nxt-jobs-step)');
  const [interviewNotes, setInterviewNotes] = useState('Phỏng vấn vòng 1 Chuyên môn kỹ thuật với Trưởng bộ phận.');

  const [inviteTalentCandidate, setInviteTalentCandidate] = useState<TalentCandidate | null>(null);
  const [inviteJobId, setInviteJobId] = useState<string>('');
  const [inviteMessage, setInviteMessage] = useState('Chào bạn, chúng tôi rất ấn tượng với hồ sơ của bạn và trân trọng mời bạn tham gia ứng tuyển vào vị trí công việc của công ty.');
  const [showInviteSuccess, setShowInviteSuccess] = useState(false);

  // Post new job form fields
  const [isSuccess, setIsSuccess] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState(
    isRecruiter 
      ? (currentUser?.companyName || 'Công ty Tuyển Dụng') 
      : 'Công ty Cổ phần Công nghệ Nextstep'
  );
  const [companyLogo, setCompanyLogo] = useState(
    'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&auto=format&fit=crop&q=80'
  );
  const [city, setCity] = useState('TP. Hồ Chí Minh');
  const [district, setDistrict] = useState('Quận 1');
  const [industry, setIndustry] = useState('CNTT / Phần mềm');
  const [salaryText, setSalaryText] = useState('25 - 40 triệu');
  const [minSalary, setMinSalary] = useState(25);
  const [maxSalary, setMaxSalary] = useState(40);
  const [experience, setExperience] = useState('2 - 3 năm');
  const [level, setLevel] = useState('Nhân viên');
  const [jobType, setJobType] = useState('Toàn thời gian');
  const [deadline, setDeadline] = useState('2026-06-30');
  const [description, setDescription] = useState(
    '• Tham gia phân tích, thiết kế và phát triển các sản phẩm công nghệ chất lượng cao.\n• Phối hợp chặt chẽ với Product Owner và đội ngũ thiết kế UI/UX để hiện thực hóa tính năng.\n• Đảm bảo mã nguồn sạch, tối ưu hiệu năng và tuân thủ các tiêu chuẩn kỹ thuật.'
  );
  const [requirements, setRequirements] = useState(
    '• Tối thiểu 2 năm kinh nghiệm thực chiến ở vị trí tương đương.\n• Nắm vững các công nghệ, framework và công cụ cốt lõi của ngành nghề.\n• Tinh thần trách nhiệm cao, chủ động giải quyết vấn đề và giao tiếp nhóm tốt.'
  );
  const [benefitsList, setBenefitsList] = useState<string[]>([
    'Lương thưởng cạnh tranh và đánh giá tăng lương định kỳ',
    'Chế độ bảo hiểm sức khỏe cao cấp và bảo hiểm nhà nước đầy đủ',
    'Môi trường làm việc trẻ trung, sáng tạo, trang thiết bị hiện đại'
  ]);
  const [newBenefitInput, setNewBenefitInput] = useState('');
  const [skills, setSkills] = useState('React, TypeScript, CSS, Git, RESTful API');

  // Company profile settings state: Tách biệt hoàn toàn giữa các tài khoản
  const [companyProfileData, setCompanyProfileData] = useState(() => {
    const uid = currentUser?.id;
    if (uid) {
      const saved = localStorage.getItem(getRecruiterProfileKey(uid));
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    if (isRecruiter) {
      if (isTestAccount(uid)) {
        return {
          name: currentUser?.companyName || 'Công ty Cổ phần Công nghệ NextGen',
          website: 'https://nextgen-tech.vn',
          size: currentUser?.companySize || '100 - 499 nhân viên',
          address: 'Tầng 12, Tòa nhà Pearl Plaza, 561A Điện Biên Phủ, Phường 25, Bình Thạnh, TP.HCM',
          industry: 'Công nghệ thông tin & Phần mềm',
          description: 'Doanh nghiệp tiên phong trong lĩnh vực giải pháp số hóa, cung cấp nền tảng quản trị và chuyển đổi số cho hơn 500 đối tác trong và ngoài nước.',
          contactEmail: currentUser?.email || 'hr@nextgen-tech.vn',
          phone: '028 7300 8888'
        };
      } else {
        return {
          name: currentUser?.companyName || 'Doanh nghiệp tuyển dụng mới',
          website: '',
          size: currentUser?.companySize || '10 - 50 nhân viên',
          address: 'Chưa cập nhật địa chỉ trụ sở',
          industry: 'Đa ngành nghề',
          description: `Hồ sơ thông tin tuyển dụng chính thức của ${currentUser?.companyName || 'Doanh nghiệp'} tại nền tảng Nextstep.`,
          contactEmail: currentUser?.email || 'hr@doanhnghiep.vn',
          phone: currentUser?.phone || 'Chưa cập nhật SĐT'
        };
      }
    }
    return {
      name: 'Công ty Cổ phần Công nghệ Nextstep',
      website: 'https://nextstep.vn',
      size: '100 - 499 nhân viên',
      address: 'Tòa nhà Landmark 81, 720A Điện Biên Phủ, Phường 22, Bình Thạnh, TP.HCM',
      industry: 'Công nghệ thông tin & Phần mềm',
      description: 'Doanh nghiệp công nghệ tiên phong, cung cấp hệ sinh thái tuyển dụng thông minh hàng đầu tại Việt Nam.',
      contactEmail: 'contact@nextstep.vn',
      phone: '028 7300 8888'
    };
  });

  // Tự động load companyProfileData khi đổi tài khoản
  useEffect(() => {
    const uid = currentUser?.id;
    if (uid) {
      const saved = localStorage.getItem(getRecruiterProfileKey(uid));
      if (saved) {
        try {
          setCompanyProfileData(JSON.parse(saved));
          return;
        } catch (e) {}
      }
    }
    if (isRecruiter) {
      if (isTestAccount(uid)) {
        setCompanyProfileData({
          name: currentUser?.companyName || 'Công ty Cổ phần Công nghệ NextGen',
          website: 'https://nextgen-tech.vn',
          size: currentUser?.companySize || '100 - 499 nhân viên',
          address: 'Tầng 12, Tòa nhà Pearl Plaza, 561A Điện Biên Phủ, Phường 25, Bình Thạnh, TP.HCM',
          industry: 'Công nghệ thông tin & Phần mềm',
          description: 'Doanh nghiệp tiên phong trong lĩnh vực giải pháp số hóa, cung cấp nền tảng quản trị và chuyển đổi số cho hơn 500 đối tác trong và ngoài nước.',
          contactEmail: currentUser?.email || 'hr@nextgen-tech.vn',
          phone: '028 7300 8888'
        });
      } else {
        setCompanyProfileData({
          name: currentUser?.companyName || 'Doanh nghiệp tuyển dụng mới',
          website: '',
          size: currentUser?.companySize || '10 - 50 nhân viên',
          address: 'Chưa cập nhật địa chỉ trụ sở',
          industry: 'Đa ngành nghề',
          description: `Hồ sơ thông tin tuyển dụng chính thức của ${currentUser?.companyName || 'Doanh nghiệp'} tại nền tảng Nextstep.`,
          contactEmail: currentUser?.email || 'hr@doanhnghiep.vn',
          phone: currentUser?.phone || 'Chưa cập nhật SĐT'
        });
      }
    }
  }, [currentUser?.id, isRecruiter]);

  const [isSavedCompanyProfile, setIsSavedCompanyProfile] = useState(false);

  // Filter jobs: Tài khoản mới đăng ký chưa đăng bài thì hiển thị 0 tin, không lấy nhầm tin của NextGen
  const companyJobs = useMemo(() => {
    if (!isRecruiter) return jobs;
    const curCompany = currentUser?.companyName?.toLowerCase().trim();
    if (!curCompany) return [];
    const filtered = jobs.filter(j => j.company.toLowerCase().includes(curCompany) || curCompany.includes(j.company.toLowerCase()));
    return filtered;
  }, [jobs, isRecruiter, currentUser]);

  // Filter applications: Tài khoản mới đăng ký chưa có người apply thì hiển thị 0 hồ sơ
  const companyApplications = useMemo(() => {
    if (!isRecruiter) return applications;
    const curCompany = currentUser?.companyName?.toLowerCase().trim();
    if (!curCompany) return [];
    const filtered = applications.filter(a => a.company.toLowerCase().includes(curCompany) || curCompany.includes(a.company.toLowerCase()));
    return filtered;
  }, [applications, isRecruiter, currentUser]);

  // Displayed applications with filters
  const filteredApplications = useMemo(() => {
    return companyApplications.filter(app => {
      if (candidateFilterJob !== 'all' && app.jobId !== candidateFilterJob) {
        return false;
      }
      if (candidateFilterStatus !== 'all' && app.status !== candidateFilterStatus) {
        return false;
      }
      return true;
    });
  }, [companyApplications, candidateFilterJob, candidateFilterStatus]);

  // Filtered talent candidates
  const filteredTalents = useMemo(() => {
    return MOCK_TALENT_POOL.filter(t => {
      if (talentSearchTerm.trim()) {
        const kw = talentSearchTerm.toLowerCase();
        const matchName = t.fullName.toLowerCase().includes(kw);
        const matchTitle = t.title.toLowerCase().includes(kw);
        const matchSkills = t.skills.some(s => s.toLowerCase().includes(kw));
        if (!matchName && !matchTitle && !matchSkills) return false;
      }
      if (talentCityFilter !== 'all' && !t.city.includes(talentCityFilter)) {
        return false;
      }
      return true;
    });
  }, [talentSearchTerm, talentCityFilter]);

  // Handle start editing a job
  const handleStartEditJob = (job: Job) => {
    setEditingJob(job);
    setJobTitle(job.title);
    setCompanyName(job.company || (isRecruiter ? (currentUser?.companyName || 'Công ty Cổ phần Công nghệ NextGen') : 'Công ty Cổ phần Công nghệ Nextstep'));
    setCity(job.city || 'TP. Hồ Chí Minh');
    setDistrict(job.district || 'Quận 1');
    setIndustry(job.industry || 'CNTT / Phần mềm');
    setSalaryText(job.salaryText || '25 - 40 triệu');
    setMinSalary(job.minSalary || 25);
    setMaxSalary(job.maxSalary || 40);
    setExperience(job.experience || '2 - 3 năm');
    setLevel(job.level || 'Nhân viên');
    setJobType(job.jobType || 'Toàn thời gian');
    setDeadline(job.deadline || '2026-06-30');
    setDescription(Array.isArray(job.description) ? job.description.join('\n') : (job.description || ''));
    setRequirements(Array.isArray(job.requirements) ? job.requirements.join('\n') : (job.requirements || ''));
    setBenefitsList(job.benefits || []);
    setSkills((job.requiredSkills || job.tags || []).join(', '));
    setActiveTab('post');
  };

  const handleCancelEditJob = () => {
    setEditingJob(null);
    setJobTitle('');
    setDescription('• Tham gia phân tích, thiết kế và phát triển các sản phẩm công nghệ chất lượng cao.\n• Phối hợp chặt chẽ với Product Owner và đội ngũ thiết kế UI/UX để hiện thực hóa tính năng.\n• Đảm bảo mã nguồn sạch, tối ưu hiệu năng và tuân thủ các tiêu chuẩn kỹ thuật.');
    setRequirements('• Tối thiểu 2 năm kinh nghiệm thực chiến ở vị trí tương đương.\n• Nắm vững các công nghệ, framework và công cụ cốt lõi của ngành nghề.\n• Tinh thần trách nhiệm cao, chủ động giải quyết vấn đề và giao tiếp nhóm tốt.');
  };

  // Handle post or update job
  const handleSubmitJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) return;

    if (editingJob) {
      const updatedJob: Job = {
        ...editingJob,
        title: jobTitle,
        company: companyName,
        companyLogo: companyLogo,
        location: city,
        city: city,
        district: district,
        salaryText: salaryText,
        minSalary: minSalary,
        maxSalary: maxSalary,
        level: level,
        experience: experience,
        jobType: jobType,
        industry: industry,
        tags: skills.split(',').map(s => s.trim()).filter(Boolean),
        requiredSkills: skills.split(',').map(s => s.trim()).filter(Boolean),
        deadline: deadline,
        description: description.split('\n').filter(Boolean),
        requirements: requirements.split('\n').filter(Boolean),
        benefits: benefitsList,
        address: `${district}, ${city}`,
      };
      if (onUpdateJob) {
        onUpdateJob(updatedJob);
      }
      setIsSuccess(true);
      setEditingJob(null);
      setTimeout(() => {
        setIsSuccess(false);
        setActiveTab('jobs');
      }, 1500);
      return;
    }

    const newJob: Job = {
      id: `job-rec-${Date.now()}`,
      title: jobTitle,
      company: companyName,
      companyLogo: companyLogo,
      companySize: companyProfileData.size,
      verifiedCompany: true,
      location: city,
      city: city,
      district: district,
      salaryText: salaryText,
      minSalary: minSalary,
      maxSalary: maxSalary,
      salaryType: 'range',
      level: level,
      experience: experience,
      jobType: jobType,
      industry: industry,
      tags: skills.split(',').map(s => s.trim()).filter(Boolean),
      requiredSkills: skills.split(',').map(s => s.trim()).filter(Boolean),
      deadline: deadline,
      postedAt: 'Vừa xong',
      isHot: true,
      applicantsCount: 0,
      viewsCount: 1,
      description: description.split('\n').filter(Boolean),
      requirements: requirements.split('\n').filter(Boolean),
      benefits: benefitsList,
      address: `${district}, ${city}`,
      companyOverview: companyProfileData.description,
      contactEmail: isRecruiter ? (currentUser?.email || 'hr@nextgen-tech.vn') : 'contact@nextstep.vn'
    };

    onPostNewJob(newJob);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setActiveTab('jobs');
    }, 2000);
    setJobTitle('');
  };

  // Add a benefit tag
  const handleAddBenefit = () => {
    if (newBenefitInput.trim()) {
      setBenefitsList(prev => [...prev, newBenefitInput.trim()]);
      setNewBenefitInput('');
    }
  };

  // Remove a benefit tag
  const handleRemoveBenefit = (idx: number) => {
    setBenefitsList(prev => prev.filter((_, i) => i !== idx));
  };

  // Submit interview schedule
  const handleSaveScheduleInterview = () => {
    if (!scheduleInterviewApp) return;
    const noteText = `Lịch phỏng vấn: ${new Date(interviewDate).toLocaleString('vi-VN')} • Hình thức: ${interviewFormat === 'online' ? 'Trực tuyến' : 'Tại văn phòng'} (${interviewLocation}). ${interviewNotes}`;
    
    if (onUpdateApplicationStatus) {
      onUpdateApplicationStatus(scheduleInterviewApp.id, 'interview', noteText, interviewDate);
    }
    alert(`Đã đặt lịch phỏng vấn và gửi thông báo tới ứng viên ${candidateProfile.fullName}!`);
    setScheduleInterviewApp(null);
  };

  // Send invitation to talent
  const handleSendTalentInvitation = () => {
    if (!inviteTalentCandidate) return;
    setShowInviteSuccess(true);
    setTimeout(() => {
      setShowInviteSuccess(false);
      setInviteTalentCandidate(null);
    }, 2000);
  };

  // Save company profile
  const handleSaveCompanyProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.id) {
      localStorage.setItem(getRecruiterProfileKey(currentUser.id), JSON.stringify(companyProfileData));
    }
    setIsSavedCompanyProfile(true);
    setTimeout(() => setIsSavedCompanyProfile(false), 3000);
  };

  // Status badge helper
  const renderStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'applied':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1"><Clock className="w-3 h-3" /> Chờ duyệt</span>;
      case 'viewed':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1"><Eye className="w-3 h-3" /> Đã xem hồ sơ</span>;
      case 'interview':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1"><Calendar className="w-3 h-3" /> Hẹn phỏng vấn</span>;
      case 'offered':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Trúng tuyển / Đã gửi Offer</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1"><X className="w-3 h-3" /> Đã từ chối</span>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0D2B52] via-[#103D73] to-[#0A2240] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-800/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-400/20 text-blue-300 border border-blue-400/30">
            <Building2 className="w-4 h-4 text-blue-300" />
            {isRecruiter 
              ? `Cổng Doanh Nghiệp • ${currentUser?.companyName || 'Nhà Tuyển Dụng'}` 
              : 'Cổng Tuyển Dụng • Phân Hệ Quản Trị Viên (Admin)'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Trung Tâm Tuyển Dụng &amp; Quản Lý Nhân Tài
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/80 max-w-2xl leading-relaxed">
            {isRecruiter 
              ? `Quản lý tin đăng, theo dõi hồ sơ ứng viên và kết nối nguồn nhân lực chất lượng cao cho ${currentUser?.companyName || 'doanh nghiệp'}.`
              : 'Quản lý, đăng tải tin tuyển dụng và điều phối quy trình tuyển dụng ứng viên trên toàn hệ thống Nextstep.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs text-blue-200">
              <Briefcase className="w-3.5 h-3.5 text-blue-300" />
              <span><strong>{companyJobs.length}</strong> Tin đang tuyển</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs text-blue-200">
              <Users className="w-3.5 h-3.5 text-emerald-300" />
              <span><strong>{companyApplications.length}</strong> Hồ sơ ứng tuyển</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs text-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span><strong>{MOCK_TALENT_POOL.length}+</strong> Nhân tài mở hồ sơ</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
          <button
            onClick={() => {
              setEditingJob(null);
              setActiveTab('post');
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 text-xs font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Đăng Tin Tuyển Dụng Mới</span>
          </button>

          {isRecruiter && onOpenAdminChat && (
            <button
              onClick={onOpenAdminChat}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Nhắn tin với Admin Nextstep</span>
            </button>
          )}

          <button
            onClick={onBackToCandidateMode}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Quay lại trang Tìm việc làm</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Information Callout: CHỈ HIỂN THỊ CHO NHÀ TUYỂN DỤNG (ADMIN KHÔNG CẦN VÀ TRẢ LẠI GIAO DIỆN NGUYÊN BẢN CỦA HÔM QUA) */}
      {isRecruiter && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-50 via-teal-50/40 to-blue-50/40 border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-blue-100 text-blue-800 shrink-0">
              <Building2 className="w-4 h-4" />
            </span>
            <div>
              <span className="font-black text-slate-900">Không Gian Tuyển Dụng Doanh Nghiệp: </span>
              <span className="text-slate-600">
                Bạn đang xem dữ liệu và ứng viên trực thuộc <strong>{currentUser?.companyName || 'Công ty Cổ phần Công nghệ NextGen'}</strong>. Thống kê toàn cảnh của toàn bộ hệ thống việc làm trên website chỉ được cấp quyền cho <strong>Super Admin</strong>.
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onNavigateToAnalytics && (
              <button
                onClick={onNavigateToAnalytics}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-[11px] font-bold shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
              >
                <BarChart3 className="w-3.5 h-3.5 text-purple-200" />
                <span>Biểu Đồ Thống Kê Tuyển Dụng</span>
              </button>
            )}
            {onOpenAdminChat && (
              <button
                onClick={onOpenAdminChat}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-[11px] font-bold shrink-0 flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                <span>Chat với Admin Nextstep</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#0D2B52] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Tổng Quan &amp; Báo Cáo</span>
        </button>

        {isRecruiter && onNavigateToAnalytics && (
          <button
            onClick={onNavigateToAnalytics}
            className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 shadow-2xs"
          >
            <BarChart3 className="w-4 h-4 text-purple-600" />
            <span>Biểu Đồ Thống Kê Tuyển Dụng</span>
            <span className="text-[10px] bg-purple-200 text-purple-900 px-1.5 py-0.2 rounded-full font-extrabold">
              5 Chỉ Số
            </span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'jobs'
              ? 'bg-[#0D2B52] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Tin Tuyển Dụng ({companyJobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('candidates')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'candidates'
              ? 'bg-[#0D2B52] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Hồ Sơ Ứng Tuyển ({companyApplications.length})</span>
        </button>

        {onOpenAdminChat && (
          <button
            id="recruiter-portal-chat-tab-btn"
            onClick={onOpenAdminChat}
            className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer bg-white hover:bg-blue-50 text-blue-900 border border-blue-200 shadow-2xs"
            title="Mở tin nhắn trao đổi với ứng viên & Ban Quản Trị"
          >
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>Tin Nhắn &amp; Hỗ Trợ Tuyển Dụng</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('post')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'post'
              ? 'bg-[#0D2B52] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Đăng Tin Mới</span>
        </button>

        <button
          onClick={() => setActiveTab('talent')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'talent'
              ? 'bg-[#0D2B52] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Săn Nhân Tài (Talent Pool)</span>
        </button>

        <button
          onClick={() => setActiveTab('company')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'company'
              ? 'bg-[#0D2B52] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Hồ Sơ Doanh Nghiệp</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              onClick={() => setActiveTab('jobs')}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tin đang tuyển</span>
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Briefcase className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{companyJobs.length}</div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <span>● Đang hoạt động trên hệ thống</span>
              </p>
            </div>

            <div 
              onClick={() => setActiveTab('candidates')}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-teal-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hồ sơ đã nộp</span>
                <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{companyApplications.length}</div>
              <p className="text-[11px] text-blue-600 font-semibold mt-1 flex items-center gap-1">
                <span>{companyApplications.filter(a => a.status === 'applied').length} hồ sơ mới chờ duyệt</span>
              </p>
            </div>

            <div 
              onClick={() => { setActiveTab('candidates'); setCandidateFilterStatus('interview'); }}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lịch phỏng vấn</span>
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {companyApplications.filter(a => a.status === 'interview').length}
              </div>
              <p className="text-[11px] text-purple-600 font-semibold mt-1">
                Đã lên lịch mời ứng viên
              </p>
            </div>

            <div 
              onClick={() => setActiveTab('talent')}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ứng viên tiềm năng</span>
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{MOCK_TALENT_POOL.length}</div>
              <p className="text-[11px] text-amber-700 font-semibold mt-1">
                Sẵn sàng nhận lời mời tuyển dụng
              </p>
            </div>
          </div>

          {/* RECRUITMENT STATS FUNNEL HIGHLIGHT BAR (5 CHỈ SỐ VÀNG) - CHỈ HIỂN THỊ KHI ĐĂNG NHẬP NHÀ TUYỂN DỤNG */}
          {isRecruiter && (
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-[#0D2B52] text-white rounded-3xl p-6 shadow-xl border border-indigo-800/40 relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                <div className="space-y-1.5 max-w-md">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30">
                    <BarChart3 className="w-3.5 h-3.5 text-purple-300" />
                    <span>Biểu Đồ &amp; Phễu Thống Kê Tuyển Dụng</span>
                  </div>
                  <h3 className="text-lg font-black text-white">
                    5 Chỉ Số Tuyển Dụng Doanh Nghiệp Của Bạn
                  </h3>
                  <p className="text-xs text-indigo-200/80 leading-relaxed">
                    Dữ liệu thống kê hiệu suất thực tế của các vị trí tuyển dụng đang đăng tải trên hệ thống Nextstep.
                  </p>
                </div>

                {/* 5 metrics inline pills */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 flex-1 max-w-2xl text-center">
                  {/* Metric 1 */}
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                    <span className="text-xl font-black text-cyan-300">
                      {companyJobs.reduce((sum, j) => sum + (j.viewsCount || 150), 0)}
                    </span>
                    <span className="block text-[10px] font-semibold text-cyan-100/70 mt-0.5">Truy Cập Tin</span>
                  </div>
                  {/* Metric 2 */}
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                    <span className="text-xl font-black text-teal-300">{companyApplications.length}</span>
                    <span className="block text-[10px] font-semibold text-teal-100/70 mt-0.5">Lượng Apply</span>
                  </div>
                  {/* Metric 3 */}
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                    <span className="text-xl font-black text-amber-300">
                      {companyApplications.filter(a => a.status === 'viewed' || a.status === 'interview' || a.status === 'offered').length}
                    </span>
                    <span className="block text-[10px] font-semibold text-amber-100/70 mt-0.5">Pass CV</span>
                  </div>
                  {/* Metric 4 */}
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                    <span className="text-xl font-black text-purple-300">
                      {companyApplications.filter(a => a.status === 'interview' || a.status === 'offered').length}
                    </span>
                    <span className="block text-[10px] font-semibold text-purple-100/70 mt-0.5">Phỏng Vấn</span>
                  </div>
                  {/* Metric 5 */}
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs col-span-2 sm:col-span-1">
                    <span className="text-xl font-black text-emerald-300">
                      {Math.max(1, companyApplications.filter(a => a.status === 'offered').length)}
                    </span>
                    <span className="block text-[10px] font-semibold text-emerald-100/70 mt-0.5">Nhận Việc</span>
                  </div>
                </div>

                {onNavigateToAnalytics && (
                  <button
                    onClick={onNavigateToAnalytics}
                    className="px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white text-xs font-black shrink-0 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl transition-all"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Xem Chi Tiết Biểu Đồ</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions & Recent Applications */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Recent Applications */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Hồ Sơ Ứng Tuyển Mới Nhận</h3>
                  <p className="text-xs text-slate-500">Các ứng viên vừa nộp đơn vào vị trí tuyển dụng của bạn</p>
                </div>
                <button
                  onClick={() => setActiveTab('candidates')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Xem tất cả ({companyApplications.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {companyApplications.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Chưa có hồ sơ ứng tuyển nào. Khi ứng viên nộp CV, thông tin sẽ hiển thị tại đây.
                </div>
              ) : (
                <div className="space-y-3">
                  {companyApplications.slice(0, 3).map(app => (
                    <div 
                      key={app.id} 
                      className="p-4 rounded-xl border border-slate-100 hover:border-blue-200 bg-slate-50/50 hover:bg-blue-50/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={candidateProfile.avatar}
                          alt={candidateProfile.fullName}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900">{candidateProfile.fullName}</h4>
                            {renderStatusBadge(app.status)}
                          </div>
                          <p className="text-xs font-semibold text-blue-700 truncate">{app.jobTitle}</p>
                          <p className="text-[11px] text-slate-500">
                            CV: {app.cvName} • Nộp lúc: {app.appliedAt}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setSelectedCandidateDetail({ application: app, profile: candidateProfile })}
                          className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
                        >
                          Xem CV
                        </button>
                        <button
                          onClick={() => setScheduleInterviewApp(app)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          Hẹn PV
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Col: Quick Tool Box & Tips */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-5 border border-blue-800/40 shadow-md space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-blue-300">
                  Thao Tác Nhanh Tuyển Dụng
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setEditingJob(null);
                      setActiveTab('post');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Đăng tin tuyển dụng mới
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {isRecruiter && onOpenAdminChat && (
                    <button
                      onClick={onOpenAdminChat}
                      className="w-full py-2.5 px-3 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-100 border border-purple-500/30 text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-purple-300" />
                        Nhắn tin hỗ trợ với Admin Nextstep
                      </span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => setActiveTab('talent')}
                    className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-amber-400" />
                      Tìm kiếm nhân tài mở hồ sơ
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setActiveTab('company')}
                    className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-teal-400" />
                      Chỉnh sửa thông tin công ty
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs text-xs space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Mẹo Tăng Tỷ Lệ Tuyển Dụng Thành Công</span>
                </div>
                <ul className="space-y-2 text-slate-600 leading-relaxed text-[11px]">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>Phản hồi hồ sơ ứng viên trong vòng <strong>24-48 giờ</strong> để giữ chân ứng viên tốt.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>Nêu rõ khoảng lương cụ thể thay vì "Thỏa thuận" giúp tăng <strong>45%</strong> lượt nộp CV.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>Chủ động gửi lời mời tới ứng viên trong <strong>Talent Pool</strong> khi có vị trí gấp.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MY JOBS MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Danh Sách Tin Tuyển Dụng Của Doanh Nghiệp</h2>
              <p className="text-xs text-slate-500">Quản lý, theo dõi số lượt xem và ứng viên cho từng vị trí</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm tin tuyển dụng..."
                  value={jobSearchTerm}
                  onChange={(e) => setJobSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-900 w-48 sm:w-60 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={() => setActiveTab('post')}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm tin mới</span>
              </button>
            </div>
          </div>

          {/* Jobs List */}
          <div className="space-y-3">
            {companyJobs
              .filter(j => jobSearchTerm ? j.title.toLowerCase().includes(jobSearchTerm.toLowerCase()) : true)
              .map(job => (
                <div 
                  key={job.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-200 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-xs shrink-0"
                    />
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">
                          {job.title}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Đang tuyển dụng
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span className="font-bold text-orange-600">{job.salaryText}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {job.city}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3 text-slate-400" /> {job.experience}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> Hạn nộp: {job.deadline}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Metrics */}
                  <div className="flex flex-wrap items-center gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                    <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-50 rounded-xl text-xs text-slate-600">
                      <span className="flex items-center gap-1" title="Lượt xem">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <strong>{job.viewsCount || 128}</strong>
                      </span>
                      <span>|</span>
                      <span className="flex items-center gap-1 text-blue-700 font-bold" title="Hồ sơ đã nộp">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        <span>{companyApplications.filter(a => a.jobId === job.id).length || job.applicantsCount || 0} nộp</span>
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setCandidateFilterJob(job.id);
                        setActiveTab('candidates');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Xem ứng viên
                    </button>

                    <button
                      onClick={() => handleStartEditJob(job)}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                      title="Chỉnh sửa tin tuyển dụng này"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                      <span>Chỉnh sửa</span>
                    </button>

                    {onDeleteJob && (
                      <button
                        onClick={() => {
                          if (confirm(`Bạn có chắc chắn muốn xóa tin tuyển dụng "${job.title}"?`)) {
                            onDeleteJob(job.id);
                          }
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Xóa tin này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CANDIDATES MANAGEMENT (APPLICATIONS PIPELINE) */}
      {/* ========================================================================= */}
      {activeTab === 'candidates' && (
        <div className="space-y-4">
          {/* Header & Filter Controls */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Phễu Quản Lý Hồ Sơ Ứng Viên</h2>
                <p className="text-xs text-slate-500">Đánh giá, phân loại và lên lịch phỏng vấn với các ứng viên</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={candidateFilterJob}
                  onChange={(e) => setCandidateFilterJob(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-800 bg-white font-medium"
                >
                  <option value="all">Tất cả vị trí tuyển dụng ({companyJobs.length})</option>
                  {companyJobs.map(j => (
                    <option key={j.id} value={j.id}>{j.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status Pills Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
              {[
                { key: 'all', label: 'Tất cả hồ sơ', count: companyApplications.length },
                { key: 'applied', label: 'Chờ duyệt', count: companyApplications.filter(a => a.status === 'applied').length },
                { key: 'viewed', label: 'Đã xem', count: companyApplications.filter(a => a.status === 'viewed').length },
                { key: 'interview', label: 'Hẹn phỏng vấn', count: companyApplications.filter(a => a.status === 'interview').length },
                { key: 'offered', label: 'Trúng tuyển / Offer', count: companyApplications.filter(a => a.status === 'offered').length },
                { key: 'rejected', label: 'Từ chối', count: companyApplications.filter(a => a.status === 'rejected').length },
              ].map(st => (
                <button
                  key={st.key}
                  onClick={() => setCandidateFilterStatus(st.key)}
                  className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                    candidateFilterStatus === st.key
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {st.label} ({st.count})
                </button>
              ))}
            </div>
          </div>

          {/* Applications Cards */}
          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">Chưa có ứng viên nào trong mục này</h3>
              <p className="text-xs text-slate-500">
                Hãy chuyển bộ lọc hoặc đăng thêm các tin tuyển dụng hấp dẫn để thu hút ứng viên.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApplications.map(app => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-200 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={candidateProfile.avatar}
                        alt={candidateProfile.fullName}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500 shrink-0 shadow-sm"
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">{candidateProfile.fullName}</h3>
                          {renderStatusBadge(app.status)}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Điểm hồ sơ: {candidateProfile.profileStrength}%
                          </span>
                        </div>
                        <p className="text-xs font-bold text-blue-700">
                          Vị trí ứng tuyển: {app.jobTitle}
                        </p>
                        <p className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                          <span>Nộp file: <strong>{app.cvName}</strong></span>
                          <span>•</span>
                          <span>Thời gian: {app.appliedAt}</span>
                          <span>•</span>
                          <span>Địa điểm: {candidateProfile.city}</span>
                        </p>
                      </div>
                    </div>

                    {/* Quick Status Changer */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        onClick={() => setSelectedCandidateDetail({ application: app, profile: candidateProfile })}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>Xem CV chi tiết</span>
                      </button>

                      <button
                        onClick={() => setScheduleInterviewApp(app)}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Hẹn Phỏng Vấn</span>
                      </button>

                      {onUpdateApplicationStatus && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onUpdateApplicationStatus(app.id, 'offered', 'Đã thông qua và gửi offer tuyển dụng')}
                            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors cursor-pointer"
                            title="Đánh dấu trúng tuyển / Gửi offer"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onUpdateApplicationStatus(app.id, 'rejected', 'Hồ sơ chưa phù hợp trong đợt tuyển này')}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                            title="Từ chối hồ sơ này"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cover letter snippet or interview notes */}
                  {app.coverLetter && (
                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 leading-relaxed border border-slate-100">
                      <span className="font-semibold text-slate-800">Thư giới thiệu của ứng viên:</span> "{app.coverLetter}"
                    </div>
                  )}

                  {app.notes && (
                    <div className="p-2.5 bg-purple-50/60 rounded-xl text-xs text-purple-900 border border-purple-200/60 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-600 shrink-0" />
                      <span><strong>Ghi chú phỏng vấn:</strong> {app.notes}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: POST NEW JOB WITH LIVE PREVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'post' && (
        <div className="space-y-6">
          {isSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-3 shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-bold">Đăng tin tuyển dụng thành công!</p>
                <p className="text-xs text-emerald-700 font-normal">
                  Tin tuyển dụng đã được kích hoạt trực tiếp và hiển thị ngay tới hàng ngàn ứng viên trên hệ thống Nextstep.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Column */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {editingJob ? 'Chỉnh Sửa Tin Tuyển Dụng' : 'Thông Tin Tin Tuyển Dụng Mới'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {editingJob 
                      ? 'Cập nhật lại quyền lợi, yêu cầu và mức lương cho bài đăng này'
                      : 'Điền thông tin chi tiết để thu hút những ứng viên chất lượng nhất'}
                  </p>
                </div>
                {editingJob && (
                  <button
                    type="button"
                    onClick={handleCancelEditJob}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Hủy chỉnh sửa
                  </button>
                )}
              </div>

              {editingJob && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-amber-600" />
                    <span>Bạn đang chỉnh sửa tin tuyển dụng: <strong>{editingJob.title}</strong></span>
                  </span>
                  <span className="text-[10px] bg-amber-200/80 px-2 py-0.5 rounded-full font-bold">
                    ID: {editingJob.id}
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmitJob} className="space-y-5 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Tiêu đề tin tuyển dụng *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Senior React Developer (Lương tới 45 triệu)"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-900 font-bold text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">Tên công ty / Doanh nghiệp *</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">Mức lương hiển thị *</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: 25 - 40 triệu"
                      value={salaryText}
                      onChange={(e) => setSalaryText(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-orange-600 font-black focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">Tỉnh / Thành phố *</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 bg-white"
                    >
                      {CITIES.filter(c => c !== 'Tất cả địa điểm').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">Quận / Huyện</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="VD: Quận 1, Cầu Giấy..."
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">Ngành nghề *</label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 bg-white"
                    >
                      {INDUSTRIES.filter(i => i !== 'Tất cả ngành nghề').map(i => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">Kinh nghiệm</label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 bg-white"
                    >
                      <option value="Chưa có kinh nghiệm">Chưa có kinh nghiệm</option>
                      <option value="Dưới 1 năm">Dưới 1 năm</option>
                      <option value="1 - 2 năm">1 - 2 năm</option>
                      <option value="2 - 3 năm">2 - 3 năm</option>
                      <option value="3 - 5 năm">3 - 5 năm</option>
                      <option value="Trên 5 năm">Trên 5 năm</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">Cấp bậc</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 bg-white"
                    >
                      <option value="Thực tập sinh">Thực tập sinh</option>
                      <option value="Nhân viên">Nhân viên</option>
                      <option value="Trưởng nhóm">Trưởng nhóm</option>
                      <option value="Trưởng phòng">Trưởng phòng</option>
                      <option value="Giám đốc">Giám đốc</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">Hạn nộp hồ sơ</label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Kỹ năng yêu cầu (phân cách bằng dấu phẩy)</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, TypeScript, Next.js, Git..."
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Mô tả công việc</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3.5 border border-slate-200 rounded-xl text-slate-900 leading-relaxed font-normal"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Yêu cầu ứng viên</label>
                  <textarea
                    rows={3}
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    className="w-full p-3.5 border border-slate-200 rounded-xl text-slate-900 leading-relaxed font-normal"
                  />
                </div>

                {/* Benefits */}
                <div className="space-y-2">
                  <label className="block font-bold text-slate-800">Quyền lợi &amp; Chế độ đãi ngộ</label>
                  <div className="flex flex-wrap gap-2">
                    {benefitsList.map((b, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-medium">
                        <span>{b}</span>
                        <button type="button" onClick={() => handleRemoveBenefit(idx)} className="text-teal-600 hover:text-rose-600 cursor-pointer">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Thêm quyền lợi khác (VD: Thưởng lương tháng 13, Du lịch hàng năm...)"
                      value={newBenefitInput}
                      onChange={(e) => setNewBenefitInput(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddBenefit(); } }}
                    />
                    <button
                      type="button"
                      onClick={handleAddBenefit}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Thêm
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  {editingJob ? (
                    <button
                      type="button"
                      onClick={handleCancelEditJob}
                      className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Hủy Chỉnh Sửa
                    </button>
                  ) : <div></div>}
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>{editingJob ? 'Lưu Thay Đổi Bài Đăng' : 'Đăng Tin Tuyển Dụng Ngay'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Live Preview Column */}
            <div className="lg:col-span-4 space-y-4">
              <div className="sticky top-20 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    Xem trước thẻ tin tuyển dụng
                  </span>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                    Thời gian thực
                  </span>
                </div>

                {/* Simulated Job Card */}
                <div className="bg-white rounded-2xl p-5 border border-blue-300 shadow-md space-y-3 relative overflow-hidden">
                  <div className="flex items-start gap-3">
                    <img
                      src={companyLogo}
                      alt={companyName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{companyName || 'Tên công ty'}</span>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-2">
                        {jobTitle || 'Tiêu đề vị trí tuyển dụng (VD: Senior Frontend Developer)'}
                      </h4>
                      <div className="text-xs font-black text-orange-600 mt-1">
                        {salaryText || '25 - 40 triệu'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {skills.split(',').slice(0, 3).map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
                        {s.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {city}</span>
                    <span>Hạn nộp: {deadline}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/70 text-xs text-blue-900 space-y-1.5 leading-relaxed">
                  <p className="font-bold flex items-center gap-1.5 text-blue-950">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    Đăng tin không giới hạn
                  </p>
                  <p className="text-[11px] text-blue-800">
                    Với tài khoản Nhà tuyển dụng, mọi tin tuyển dụng sau khi đăng sẽ được tự động kích hoạt và ưu tiên xếp hạng tìm kiếm.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: TALENT POOL (SĂN NHÂN TÀI) */}
      {/* ========================================================================= */}
      {activeTab === 'talent' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2 className="text-base font-bold text-slate-900">Nguồn Nhân Tài Đang Mở Tìm Việc (Talent Pool)</h2>
              </div>
              <p className="text-xs text-slate-500">
                Chủ động tiếp cận và gửi lời mời ứng tuyển trực tiếp đến các ứng viên tiềm năng
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Kỹ năng, tên ứng viên..."
                    value={talentSearchTerm}
                    onChange={(e) => setTalentSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleRecordCvSearch(talentSearchTerm);
                      }
                    }}
                    className="pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-900 w-44 sm:w-56 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <select
                  value={talentCityFilter}
                  onChange={(e) => setTalentCityFilter(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-800 bg-white"
                >
                  <option value="all">Tất cả địa điểm</option>
                  <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                </select>
              </div>

              {/* Lịch sử tìm kiếm CV gần đây (Chỉ hiển thị khi đã có lịch sử tìm kiếm) */}
              {cvSearchHistory && cvSearchHistory.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
                  <span className="text-slate-500 flex items-center gap-1 font-semibold text-[10px]">
                    <Clock className="w-3 h-3 text-blue-500" />
                    Lịch sử tìm CV:
                  </span>
                  {cvSearchHistory.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setTalentSearchTerm(item);
                        handleRecordCvSearch(item);
                      }}
                      className="px-2 py-0.5 rounded-md bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-all cursor-pointer text-[10px] font-medium"
                    >
                      {item}
                    </button>
                  ))}
                  <button
                    onClick={handleClearCvSearchHistory}
                    className="text-slate-400 hover:text-rose-500 underline text-[10px] ml-1 cursor-pointer"
                    title="Xóa toàn bộ lịch sử tìm kiếm CV"
                  >
                    Xóa
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Talent Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTalents.map(talent => (
              <div
                key={talent.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3.5">
                    <img
                      src={talent.avatar}
                      alt={talent.fullName}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-400 shadow-xs shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-bold text-slate-900 truncate">{talent.fullName}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                          Sẵn sàng đi làm
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-blue-700 truncate">{talent.title}</p>
                      <div className="flex flex-wrap items-center gap-x-3 text-[11px] text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {talent.city}</span>
                        <span>•</span>
                        <span>{talent.experienceYears} KN</span>
                        <span>•</span>
                        <span className="text-orange-600 font-bold">{talent.desiredSalary}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {talent.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {talent.skills.map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedTalentDetail(talent)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Xem hồ sơ
                  </button>

                  <button
                    onClick={() => {
                      setInviteTalentCandidate(talent);
                      if (companyJobs.length > 0) {
                        setInviteJobId(companyJobs[0].id);
                      }
                    }}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Mời Ứng Tuyển</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: COMPANY PROFILE */}
      {/* ========================================================================= */}
      {activeTab === 'company' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs max-w-4xl space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Hồ Sơ Doanh Nghiệp Của Bạn</h2>
            <p className="text-xs text-slate-500">Thông tin này sẽ được hiển thị công khai trên các tin tuyển dụng</p>
          </div>

          {isSavedCompanyProfile && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Đã lưu cập nhật thông tin doanh nghiệp thành công!</span>
            </div>
          )}

          <form onSubmit={handleSaveCompanyProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Tên công ty / Doanh nghiệp *</label>
                <input
                  type="text"
                  required
                  value={companyProfileData.name}
                  onChange={(e) => setCompanyProfileData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Website công ty</label>
                <input
                  type="url"
                  value={companyProfileData.website}
                  onChange={(e) => setCompanyProfileData(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Quy mô nhân sự</label>
                <select
                  value={companyProfileData.size}
                  onChange={(e) => setCompanyProfileData(prev => ({ ...prev, size: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 bg-white"
                >
                  <option value="Dưới 20 nhân viên">Dưới 20 nhân viên</option>
                  <option value="20 - 99 nhân viên">20 - 99 nhân viên</option>
                  <option value="100 - 499 nhân viên">100 - 499 nhân viên</option>
                  <option value="Trên 500 nhân viên">Trên 500 nhân viên</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Email liên hệ tuyển dụng</label>
                <input
                  type="email"
                  value={companyProfileData.contactEmail}
                  onChange={(e) => setCompanyProfileData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-800 mb-1">Địa chỉ trụ sở</label>
                <input
                  type="text"
                  value={companyProfileData.address}
                  onChange={(e) => setCompanyProfileData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-800 mb-1">Giới thiệu về doanh nghiệp &amp; Môi trường làm việc</label>
                <textarea
                  rows={4}
                  value={companyProfileData.description}
                  onChange={(e) => setCompanyProfileData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3.5 border border-slate-200 rounded-xl text-slate-900 leading-relaxed"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CANDIDATE DETAIL CV MODAL */}
      {/* ========================================================================= */}
      {selectedCandidateDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCandidateDetail.profile.avatar}
                  alt={selectedCandidateDetail.profile.fullName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedCandidateDetail.profile.fullName}
                  </h3>
                  <p className="text-xs text-blue-700 font-semibold">
                    {selectedCandidateDetail.profile.title}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCandidateDetail(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 text-xs text-slate-700">
              {/* Contact info box */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-[11px] text-slate-400 block">Email:</span>
                  <span className="font-semibold text-slate-900">{selectedCandidateDetail.profile.email}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Số điện thoại:</span>
                  <span className="font-semibold text-slate-900">{selectedCandidateDetail.profile.phone}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Địa chỉ:</span>
                  <span className="font-semibold text-slate-900">{selectedCandidateDetail.profile.city}</span>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-sm">Giới thiệu bản thân</h4>
                <p className="text-slate-600 leading-relaxed">{selectedCandidateDetail.profile.bio}</p>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Kỹ năng chuyên môn</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidateDetail.profile.skills.map((s) => (
                    <span key={s.id} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-medium text-xs">
                      {s.name} (Cấp độ {s.level}/5)
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">Kinh nghiệm làm việc</h4>
                {selectedCandidateDetail.profile.experiences.map((exp) => (
                  <div key={exp.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{exp.position}</span>
                      <span className="text-[11px] text-slate-500">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p className="text-blue-700 font-semibold text-[11px]">{exp.company}</p>
                    <p className="text-slate-600 text-xs">{exp.description}</p>
                  </div>
                ))}
              </div>

              {/* Education */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Học vấn</h4>
                {selectedCandidateDetail.profile.educations.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <p className="font-bold text-slate-900">{edu.school}</p>
                    <p className="text-slate-600">{edu.degree} • Chuyên ngành: {edu.major} ({edu.grade})</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 rounded-b-3xl">
              <button
                onClick={() => {
                  const app = selectedCandidateDetail.application;
                  setSelectedCandidateDetail(null);
                  setScheduleInterviewApp(app);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Hẹn Phỏng Vấn Ứng Viên
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: SCHEDULE INTERVIEW MODAL */}
      {/* ========================================================================= */}
      {scheduleInterviewApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">Lên Lịch Hẹn Phỏng Vấn</h3>
              </div>
              <button onClick={() => setScheduleInterviewApp(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-purple-50 rounded-xl text-purple-900 space-y-1">
                <p><strong>Ứng viên:</strong> {candidateProfile.fullName}</p>
                <p><strong>Vị trí:</strong> {scheduleInterviewApp.jobTitle}</p>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Thời gian phỏng vấn *</label>
                <input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Hình thức phỏng vấn</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setInterviewFormat('online');
                      setInterviewLocation('Google Meet (https://meet.google.com/nxt-jobs-step)');
                    }}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      interviewFormat === 'online' ? 'bg-purple-600 text-white border-purple-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Trực tuyến (Online)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setInterviewFormat('office');
                      setInterviewLocation(companyProfileData.address);
                    }}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      interviewFormat === 'office' ? 'bg-purple-600 text-white border-purple-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Tại văn phòng</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Địa điểm / Đường dẫn cuộc họp</label>
                <input
                  type="text"
                  value={interviewLocation}
                  onChange={(e) => setInterviewLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Nội dung / Ghi chú gửi ứng viên</label>
                <textarea
                  rows={3}
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setScheduleInterviewApp(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveScheduleInterview}
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                Xác Nhận &amp; Gửi Lịch Hẹn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: INVITE TALENT CANDIDATE MODAL */}
      {/* ========================================================================= */}
      {inviteTalentCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Mời Ứng Tuyển Công Việc</h3>
              </div>
              <button onClick={() => setInviteTalentCandidate(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {showInviteSuccess ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Đã gửi lời mời thành công!</h4>
                <p className="text-xs text-slate-500">
                  Lời mời ứng tuyển đã được chuyển đến ứng viên {inviteTalentCandidate.fullName}.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-3 p-3 bg-blue-50/60 rounded-xl">
                  <img
                    src={inviteTalentCandidate.avatar}
                    alt={inviteTalentCandidate.fullName}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900">{inviteTalentCandidate.fullName}</h4>
                    <p className="text-blue-700 font-semibold">{inviteTalentCandidate.title}</p>
                    <p className="text-[11px] text-slate-500">{inviteTalentCandidate.city} • {inviteTalentCandidate.experienceYears} KN</p>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Chọn vị trí công việc mời ứng tuyển *</label>
                  <select
                    value={inviteJobId}
                    onChange={(e) => setInviteJobId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 bg-white"
                  >
                    {companyJobs.map(j => (
                      <option key={j.id} value={j.id}>{j.title} ({j.salaryText})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Lời nhắn trân trọng gửi ứng viên</label>
                  <textarea
                    rows={4}
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-xl text-slate-900 leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setInviteTalentCandidate(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSendTalentInvitation}
                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    Gửi Lời Mời Ngay
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: TALENT PROFILE PREVIEW MODAL */}
      {/* ========================================================================= */}
      {selectedTalentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedTalentDetail.avatar}
                  alt={selectedTalentDetail.fullName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedTalentDetail.fullName}</h3>
                  <p className="text-xs text-blue-700 font-semibold">{selectedTalentDetail.title}</p>
                </div>
              </div>
              <button onClick={() => setSelectedTalentDetail(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-[11px] text-slate-400 block">Địa điểm:</span>
                  <span className="font-semibold text-slate-900">{selectedTalentDetail.city}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Kinh nghiệm:</span>
                  <span className="font-semibold text-slate-900">{selectedTalentDetail.experienceYears}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Mức lương mong muốn:</span>
                  <span className="font-bold text-orange-600">{selectedTalentDetail.desiredSalary}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Học vấn:</span>
                  <span className="font-semibold text-slate-900">{selectedTalentDetail.education}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Tóm tắt năng lực &amp; kinh nghiệm</h4>
                <p className="text-slate-600 leading-relaxed">{selectedTalentDetail.bio}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1.5">Kỹ năng cốt lõi</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTalentDetail.skills.map((sk, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 text-xs font-medium">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedTalentDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  const talent = selectedTalentDetail;
                  setSelectedTalentDetail(null);
                  setInviteTalentCandidate(talent);
                  if (companyJobs.length > 0) setInviteJobId(companyJobs[0].id);
                }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Mời Ứng Tuyển
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
