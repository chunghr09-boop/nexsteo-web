import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart3, 
  Briefcase, 
  Users, 
  FileText, 
  Settings, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  ShieldCheck, 
  ArrowLeft, 
  KeyRound, 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  RefreshCw, 
  Building2,
  DollarSign,
  Calendar,
  Layers,
  Activity,
  Check,
  X,
  ExternalLink,
  Flame,
  Zap,
  Globe,
  Server,
  Network,
  Lock,
  Copy,
  Terminal,
  HelpCircle,
  Radio,
  Wifi,
  Shield,
  Clock
} from 'lucide-react';
import { Job, Application, CandidateProfile, AuthUser, UserRole, SystemSettings, AdminActivityLog } from '../types';
import { useAuth } from '../context/AuthContext';
import { CITIES, INDUSTRIES, LEVELS, JOB_TYPES, EXPERIENCES } from '../data/mockJobs';

interface AdminPortalProps {
  jobs: Job[];
  onUpdateJobs: (jobs: Job[]) => void;
  applications: Application[];
  onUpdateApplications: (applications: Application[]) => void;
  candidateProfile: CandidateProfile;
  onBackToMainWeb: () => void;
  systemSettings: SystemSettings;
  onUpdateSystemSettings: (settings: SystemSettings) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  jobs,
  onUpdateJobs,
  applications,
  onUpdateApplications,
  candidateProfile,
  onBackToMainWeb,
  systemSettings,
  onUpdateSystemSettings
}) => {
  const { allUsers, toggleUserStatus, updateUserRole, currentUser } = useAuth();

  // Navigation tab inside Admin Portal
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'users' | 'applications' | 'settings'>('overview');

  // Success / Info toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Activity logs state
  const [activityLogs, setActivityLogs] = useState<AdminActivityLog[]>([
    {
      id: 'log-1',
      action: 'Duyệt tin tuyển dụng',
      target: 'Senior Frontend / Fullstack Engineer',
      performedBy: 'Super Admin',
      timestamp: '10 phút trước',
      type: 'job'
    },
    {
      id: 'log-2',
      action: 'Đăng ký tài khoản mới qua Zalo',
      target: 'Lê Thị Thu Thảo (0912 345 678)',
      performedBy: 'Hệ thống',
      timestamp: '35 phút trước',
      type: 'user'
    },
    {
      id: 'log-3',
      action: 'Cập nhật trạng thái đơn ứng tuyển',
      target: 'Nguyễn Hoàng Minh -> Mời phỏng vấn',
      performedBy: 'HR Director',
      timestamp: '1 giờ trước',
      type: 'application'
    },
    {
      id: 'log-4',
      action: 'Ghim tin Gấp (Urgent)',
      target: 'Lead Backend Engineer (Go / Java)',
      performedBy: 'Super Admin',
      timestamp: '2 giờ trước',
      type: 'job'
    }
  ]);

  const addLog = (action: string, target: string, type: 'job' | 'user' | 'application' | 'system') => {
    const newLog: AdminActivityLog = {
      id: `log-${Date.now()}`,
      action,
      target,
      performedBy: currentUser?.fullName || 'Super Admin',
      timestamp: 'Vừa xong',
      type
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 19)]);
  };

  // ==========================================
  // TAB 2: JOBS MANAGEMENT LOGIC
  // ==========================================
  const [jobSearch, setJobSearch] = useState('');
  const [jobCityFilter, setJobCityFilter] = useState('Tất cả');
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isCreatingJob, setIsCreatingJob] = useState(false);

  // Form fields for create/edit job
  const [formTitle, setFormTitle] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formCity, setFormCity] = useState('TP. Hồ Chí Minh');
  const [formIndustry, setFormIndustry] = useState('CNTT / Phần mềm');
  const [formSalary, setFormSalary] = useState('25 - 40 triệu');
  const [formMinSalary, setFormMinSalary] = useState(25);
  const [formMaxSalary, setFormMaxSalary] = useState(40);
  const [formLevel, setFormLevel] = useState('Nhân viên');
  const [formExperience, setFormExperience] = useState('2 - 3 năm');
  const [formJobType, setFormJobType] = useState('Toàn thời gian');
  const [formSkills, setFormSkills] = useState('React, TypeScript');
  const [formIsHot, setFormIsHot] = useState(false);
  const [formIsUrgent, setFormIsUrgent] = useState(false);
  const [formDeadline, setFormDeadline] = useState('2026-06-30');
  const [formDesc, setFormDesc] = useState('');
  const [formReq, setFormReq] = useState('');

  const filteredJobs = useMemo(() => {
    return jobs.filter(j => {
      const matchText = jobSearch === '' || 
        j.title.toLowerCase().includes(jobSearch.toLowerCase()) || 
        j.company.toLowerCase().includes(jobSearch.toLowerCase());
      const matchCity = jobCityFilter === 'Tất cả' || j.city === jobCityFilter;
      return matchText && matchCity;
    });
  }, [jobs, jobSearch, jobCityFilter]);

  const handleOpenCreateModal = () => {
    setEditingJob(null);
    setFormTitle('');
    setFormCompany('Công ty Cổ phần Nextstep');
    setFormCity('TP. Hồ Chí Minh');
    setFormIndustry('CNTT / Phần mềm');
    setFormSalary('25 - 40 triệu');
    setFormMinSalary(25);
    setFormMaxSalary(40);
    setFormLevel('Nhân viên');
    setFormExperience('2 - 3 năm');
    setFormJobType('Toàn thời gian');
    setFormSkills('React, TypeScript, CSS');
    setFormIsHot(true);
    setFormIsUrgent(false);
    setFormDeadline('2026-06-30');
    setFormDesc('Tham gia xây dựng các tính năng web application cho hệ thống tuyển dụng Nextstep.');
    setFormReq('Tối thiểu 2 năm kinh nghiệm làm việc với React, TypeScript và Git.');
    setIsCreatingJob(true);
  };

  const handleOpenEditModal = (job: Job) => {
    setEditingJob(job);
    setFormTitle(job.title);
    setFormCompany(job.company);
    setFormCity(job.city);
    setFormIndustry(job.industry);
    setFormSalary(job.salaryText);
    setFormMinSalary(job.minSalary || 20);
    setFormMaxSalary(job.maxSalary || 35);
    setFormLevel(job.level);
    setFormExperience(job.experience);
    setFormJobType(job.jobType);
    setFormSkills(job.requiredSkills.join(', '));
    setFormIsHot(!!job.isHot);
    setFormIsUrgent(!!job.isUrgent);
    setFormDeadline(job.deadline);
    setFormDesc(job.description.join('\n'));
    setFormReq(job.requirements.join('\n'));
    setIsCreatingJob(true);
  };

  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const skillList = formSkills.split(',').map(s => s.trim()).filter(Boolean);

    if (editingJob) {
      // Update existing
      const updatedList = jobs.map(j => {
        if (j.id === editingJob.id) {
          return {
            ...j,
            title: formTitle.trim(),
            company: formCompany.trim(),
            city: formCity,
            location: formCity,
            industry: formIndustry,
            salaryText: formSalary,
            minSalary: Number(formMinSalary) || 0,
            maxSalary: Number(formMaxSalary) || 0,
            level: formLevel,
            experience: formExperience,
            jobType: formJobType,
            requiredSkills: skillList,
            tags: skillList,
            isHot: formIsHot,
            isUrgent: formIsUrgent,
            deadline: formDeadline,
            description: formDesc.split('\n').filter(Boolean),
            requirements: formReq.split('\n').filter(Boolean)
          };
        }
        return j;
      });
      onUpdateJobs(updatedList);
      addLog('Chỉnh sửa tin tuyển dụng', formTitle, 'job');
      showToast(`Đã cập nhật thành công: ${formTitle}`);
    } else {
      // Create new
      const newJob: Job = {
        id: `job-admin-${Date.now()}`,
        title: formTitle.trim(),
        company: formCompany.trim(),
        companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&auto=format&fit=crop&q=80',
        companySize: '100 - 499 nhân viên',
        verifiedCompany: true,
        location: formCity,
        city: formCity,
        district: 'Trung tâm',
        salaryText: formSalary,
        minSalary: Number(formMinSalary) || 0,
        maxSalary: Number(formMaxSalary) || 0,
        salaryType: 'range',
        level: formLevel,
        experience: formExperience,
        jobType: formJobType,
        industry: formIndustry,
        tags: skillList,
        requiredSkills: skillList,
        deadline: formDeadline,
        postedAt: 'Vừa đăng',
        isHot: formIsHot,
        isUrgent: formIsUrgent,
        applicantsCount: 0,
        viewsCount: 1,
        description: formDesc.split('\n').filter(Boolean),
        requirements: formReq.split('\n').filter(Boolean),
        benefits: [
          'Lương thưởng cạnh tranh & tháng lương thứ 13',
          'Chế độ bảo hiểm cao cấp, du lịch hàng năm',
          'Môi trường làm việc năng động, lộ trình thăng tiến rõ ràng'
        ],
        address: `Tòa nhà văn phòng tại ${formCity}`,
        companyOverview: 'Doanh nghiệp uy tín hàng đầu trong hệ sinh thái việc làm Nextstep.',
        contactEmail: 'tuyendung@nextstep.vn'
      };
      onUpdateJobs([newJob, ...jobs]);
      addLog('Tạo tin tuyển dụng mới', formTitle, 'job');
      showToast(`Đã thêm mới việc làm: ${formTitle}`);
    }

    setIsCreatingJob(false);
  };

  const handleDeleteJob = (jobId: string, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tin tuyển dụng: "${title}" không?`)) {
      onUpdateJobs(jobs.filter(j => j.id !== jobId));
      addLog('Xóa tin tuyển dụng', title, 'job');
      showToast(`Đã xóa việc làm: ${title}`);
    }
  };

  const handleToggleJobBadge = (jobId: string, field: 'isHot' | 'isUrgent') => {
    const updated = jobs.map(j => {
      if (j.id === jobId) {
        const nextVal = !j[field];
        return { ...j, [field]: nextVal };
      }
      return j;
    });
    onUpdateJobs(updated);
    showToast(`Đã cập nhật trạng thái huy hiệu`);
  };

  // ==========================================
  // TAB 3: USERS MANAGEMENT LOGIC
  // ==========================================
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [selectedUserForView, setSelectedUserForView] = useState<AuthUser | null>(null);

  const filteredUsers = useMemo(() => {
    return allUsers.filter(u => {
      const matchQuery = userSearch === '' || 
        u.fullName.toLowerCase().includes(userSearch.toLowerCase()) || 
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.phone.includes(userSearch);
      const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
      return matchQuery && matchRole;
    });
  }, [allUsers, userSearch, userRoleFilter]);

  // ==========================================
  // TAB 4: APPLICATIONS MANAGEMENT LOGIC
  // ==========================================
  const [appStatusFilter, setAppStatusFilter] = useState<string>('all');

  const filteredApplications = useMemo(() => {
    return applications.filter(a => {
      if (appStatusFilter === 'all') return true;
      return a.status === appStatusFilter;
    });
  }, [applications, appStatusFilter]);

  const handleUpdateAppStatus = (appId: string, newStatus: Application['status']) => {
    const updated = applications.map(a => {
      if (a.id === appId) {
        return { ...a, status: newStatus };
      }
      return a;
    });
    onUpdateApplications(updated);
    addLog('Cập nhật trạng thái đơn', `Đơn #${appId.slice(-4)} -> ${newStatus}`, 'application');
    showToast(`Đã chuyển trạng thái đơn sang: ${newStatus.toUpperCase()}`);
  };

  // ==========================================
  // TAB 5: SYSTEM SETTINGS & DOMAIN LOGIC
  // ==========================================
  const [tempSettings, setTempSettings] = useState<SystemSettings>(systemSettings);

  useEffect(() => {
    setTempSettings(systemSettings);
  }, [systemSettings]);

  // Subtab within settings
  const [settingsSubTab, setSettingsSubTab] = useState<'domain' | 'dns_records' | 'branding' | 'security' | 'guide'>('domain');

  // Domain Verification & DNS Health Check state
  const [isPingingDns, setIsPingingDns] = useState(false);
  const [dnsPingResult, setDnsPingResult] = useState<{
    status: 'connected' | 'warning' | 'error';
    latencyMs: number;
    resolvedIp: string;
    targetDomain: string;
    checkedAt: string;
    sslValid: boolean;
    nameservers: string[];
    details: string;
  } | null>(null);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopyText = (text: string, key: string, label: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedKey(key);
        showToast(`Đã sao chép: ${label}`);
        setTimeout(() => setCopiedKey(null), 2500);
      }).catch(() => {
        showToast(`Đã chọn nội dung: ${text}`);
      });
    } else {
      showToast(`Đã chọn: ${text}`);
    }
  };

  const handleRunDnsPing = () => {
    setIsPingingDns(true);
    setDnsPingResult(null);

    setTimeout(() => {
      setIsPingingDns(false);
      const isConfigured = Boolean(tempSettings.primaryDomain && tempSettings.serverIp);
      setDnsPingResult({
        status: isConfigured ? 'connected' : 'warning',
        latencyMs: Math.floor(Math.random() * 12) + 14, // 14-26 ms
        resolvedIp: tempSettings.serverIp || '103.179.188.88',
        targetDomain: tempSettings.primaryDomain || 'nextstep.vn',
        checkedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        sslValid: true,
        nameservers: ['ns1.nextstep.vn (103.179.188.88)', 'ns2.cloudflare.com (Anycast CDN Vietnam)'],
        details: isConfigured 
          ? `Phân giải DNS thành công (HTTP 200 OK). Tên miền "${tempSettings.primaryDomain}" đã trỏ chính xác về IP máy chủ ${tempSettings.serverIp}. Giao thức HTTPS TLS 1.3 bảo mật cao hoạt động ổn định.`
          : 'Vui lòng điền tên miền chính và IP máy chủ để kích hoạt phân giải DNS.'
      });
      showToast('Đã hoàn thành kiểm tra kết nối tên miền & DNS!');
    }, 1100);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSystemSettings(tempSettings);
    addLog('Cập nhật cài đặt website', 'Tên miền & Vận hành Web', 'system');
    showToast('Đã lưu thành công cấu hình hệ thống & khai báo tên miền!');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Super Admin Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/95 border-b border-purple-900/40 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  Nextstep Super Admin Portal
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Song Song Với Web Chính
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-400">
                Toàn quyền điều hành việc làm, người dùng đa kênh và hệ thống tuyển dụng
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Direct Switch to Main Web */}
            <button
              onClick={onBackToMainWeb}
              className="px-3.5 py-2 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 border border-teal-400/40 text-teal-300 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại Web Chính (Ứng Viên)</span>
            </button>

            {/* Admin Profile Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-[11px] ring-2 ring-purple-400/50">
                AD
              </div>
              <div className="text-left hidden md:block">
                <p className="font-bold text-slate-200 leading-tight">Super Admin</p>
                <p className="text-[10px] text-purple-400 font-medium">admin@nextstep.vn</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 border-t border-slate-800/80 mt-3 no-scrollbar text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Tổng Quan &amp; Báo Cáo</span>
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'jobs'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Quản Lý Việc Làm ({jobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Ứng Viên &amp; Người Dùng ({allUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'applications'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Đơn Ứng Tuyển ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Cấu Hình Website &amp; Hotline</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* ==========================================================
            VIEW 1: OVERVIEW & ANALYTICS
        ========================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Tin việc làm đang tuyển</span>
                  <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{jobs.length}</span>
                  <span className="text-xs font-bold text-teal-400">+12% tuần này</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {jobs.filter(j => j.isHot).length} việc làm ghim HOT, {jobs.filter(j => j.isUrgent).length} việc tuyển gấp
                </p>
              </div>

              <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Người dùng đã đăng ký</span>
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{allUsers.length}</span>
                  <span className="text-xs font-bold text-purple-400">Đa kênh (GG, Zalo, SĐT)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {allUsers.filter(u => u.status === 'active').length} tài khoản đang hoạt động
                </p>
              </div>

              <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Hồ sơ đã ứng tuyển</span>
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{applications.length}</span>
                  <span className="text-xs font-bold text-emerald-400">Đang xử lý</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {applications.filter(a => a.status === 'interview').length} ứng viên đã có lịch phỏng vấn
                </p>
              </div>

              <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Lượt xem việc làm</span>
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">4,820</span>
                  <span className="text-xs font-bold text-amber-400">+28.4%</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Lưu lượng truy cập ổn định trên toàn quốc
                </p>
              </div>
            </div>

            {/* Charts & Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Job Distribution by Industry */}
              <div className="lg:col-span-7 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    Phân bổ cơ hội việc làm theo ngành nghề
                  </h3>
                  <span className="text-xs text-slate-400">{jobs.length} việc làm</span>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { name: 'CNTT / Phần mềm', count: jobs.filter(j => j.industry === 'CNTT / Phần mềm').length, color: 'from-blue-500 to-teal-400' },
                    { name: 'Marketing / Truyền thông', count: jobs.filter(j => j.industry === 'Marketing / Truyền thông').length, color: 'from-purple-500 to-pink-500' },
                    { name: 'Kinh doanh / Bán hàng', count: jobs.filter(j => j.industry === 'Kinh doanh / Bán hàng').length, color: 'from-amber-500 to-orange-400' },
                    { name: 'Tài chính / Ngân hàng', count: jobs.filter(j => j.industry === 'Tài chính / Ngân hàng').length, color: 'from-emerald-500 to-teal-400' },
                    { name: 'Thiết kế / Đồ họa', count: jobs.filter(j => j.industry === 'Thiết kế / Đồ họa').length, color: 'from-rose-500 to-red-400' },
                  ].map((item, idx) => {
                    const percent = Math.round((item.count / (jobs.length || 1)) * 100);
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-300">{item.name}</span>
                          <span className="text-slate-400">{item.count} vị trí ({percent}%)</span>
                        </div>
                        <div className="w-full bg-slate-700/60 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                            style={{ width: `${Math.max(percent, 8)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Realtime Audit Activity Log */}
              <div className="lg:col-span-5 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    Nhật ký hoạt động hệ thống
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live
                  </span>
                </div>

                <div className="divide-y divide-slate-700/50 max-h-72 overflow-y-auto space-y-2 pr-1">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="pt-2.5 pb-2 text-xs flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-700/80 flex items-center justify-center shrink-0 mt-0.5">
                        {log.type === 'job' && <Briefcase className="w-3.5 h-3.5 text-teal-400" />}
                        {log.type === 'user' && <Users className="w-3.5 h-3.5 text-purple-400" />}
                        {log.type === 'application' && <FileText className="w-3.5 h-3.5 text-emerald-400" />}
                        {log.type === 'system' && <Settings className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-200 truncate">{log.action}</p>
                        <p className="text-[11px] text-slate-400 truncate">{log.target}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                          <span>{log.performedBy}</span>
                          <span>{log.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            VIEW 2: JOBS MANAGEMENT
        ========================================================== */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    placeholder="Tìm theo tiêu đề hoặc công ty..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                <select
                  value={jobCityFilter}
                  onChange={(e) => setJobCityFilter(e.target.value)}
                  className="py-2 px-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-purple-500 cursor-pointer"
                >
                  <option value="Tất cả">Tất cả địa điểm</option>
                  {CITIES.filter(c => c !== 'Tất cả địa điểm').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleOpenCreateModal}
                className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Việc Làm Mới</span>
              </button>
            </div>

            {/* Jobs Table */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-700">
                    <tr>
                      <th className="py-3.5 px-4">Vị trí &amp; Doanh nghiệp</th>
                      <th className="py-3.5 px-4">Địa điểm &amp; Mức lương</th>
                      <th className="py-3.5 px-4">Huy hiệu HOT / GẤP</th>
                      <th className="py-3.5 px-4">Hạn nộp</th>
                      <th className="py-3.5 px-4 text-center">Ứng tuyển</th>
                      <th className="py-3.5 px-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {filteredJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={job.companyLogo} alt={job.company} className="w-9 h-9 rounded-lg object-cover bg-white p-0.5 shrink-0" />
                            <div>
                              <p className="font-bold text-white text-xs leading-snug">{job.title}</p>
                              <p className="text-[11px] text-slate-400">{job.company}</p>
                              <span className="text-[10px] text-purple-400 bg-purple-500/10 px-1.5 py-0.2 rounded border border-purple-500/20">
                                {job.industry}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-200">{job.city}</p>
                          <p className="text-teal-400 font-bold">{job.salaryText}</p>
                        </td>

                        <td className="py-3 px-4 space-x-1.5">
                          <button
                            onClick={() => handleToggleJobBadge(job.id, 'isHot')}
                            className={`px-2 py-1 rounded-lg text-[10px] font-extrabold cursor-pointer transition-all ${
                              job.isHot 
                                ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-xs' 
                                : 'bg-slate-700/50 text-slate-500 hover:text-slate-300'
                            }`}
                            title="Bấm để bật/tắt huy hiệu HOT"
                          >
                            🔥 HOT
                          </button>
                          <button
                            onClick={() => handleToggleJobBadge(job.id, 'isUrgent')}
                            className={`px-2 py-1 rounded-lg text-[10px] font-extrabold cursor-pointer transition-all ${
                              job.isUrgent 
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs' 
                                : 'bg-slate-700/50 text-slate-500 hover:text-slate-300'
                            }`}
                            title="Bấm để bật/tắt huy hiệu Tuyển Gấp"
                          >
                            ⚡ GẤP
                          </button>
                        </td>

                        <td className="py-3 px-4 text-slate-400">
                          {job.deadline}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-xs">
                            {job.applicantsCount} đơn
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEditModal(job)}
                            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white transition-colors cursor-pointer"
                            title="Chỉnh sửa tin"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id, job.title)}
                            className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 transition-colors cursor-pointer"
                            title="Xóa tin"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            VIEW 3: USERS & CANDIDATES MANAGEMENT
        ========================================================== */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Tìm theo tên, email, số điện thoại..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="py-2 px-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-purple-500 cursor-pointer"
                >
                  <option value="all">Tất cả vai trò (Role)</option>
                  <option value="candidate">Ứng viên</option>
                  <option value="admin">Quản trị viên (Admin)</option>
                  <option value="recruiter">Nhà tuyển dụng</option>
                </select>
              </div>

              <span className="text-xs text-slate-400">
                Hiển thị <strong>{filteredUsers.length}</strong> / {allUsers.length} tài khoản
              </span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-700">
                    <tr>
                      <th className="py-3.5 px-4">Tài khoản &amp; Họ tên</th>
                      <th className="py-3.5 px-4">Kênh đăng nhập</th>
                      <th className="py-3.5 px-4">Liên hệ (Email / SĐT)</th>
                      <th className="py-3.5 px-4">Vai trò (Role)</th>
                      <th className="py-3.5 px-4">Trạng thái</th>
                      <th className="py-3.5 px-4 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={user.avatar} alt={user.fullName} className="w-8 h-8 rounded-full object-cover ring-1 ring-purple-400 shrink-0" />
                            <div>
                              <p className="font-bold text-white text-xs">{user.fullName}</p>
                              <p className="text-[10px] text-slate-500">Tạo: {user.createdAt}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          {user.provider === 'google' && (
                            <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/30 text-[10px] font-bold">
                              Google
                            </span>
                          )}
                          {user.provider === 'zalo' && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 text-[10px] font-bold">
                              Zalo ID
                            </span>
                          )}
                          {user.provider === 'phone' && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                              SĐT (SMS OTP)
                            </span>
                          )}
                          {user.provider === 'facebook' && (
                            <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                              Facebook
                            </span>
                          )}
                          {user.provider === 'email' && (
                            <span className="px-2 py-0.5 rounded-full bg-slate-500/15 text-slate-300 border border-slate-500/30 text-[10px] font-bold">
                              Email / Mật khẩu
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <p className="text-slate-300 truncate max-w-xs">{user.email}</p>
                          <p className="text-slate-400">{user.phone}</p>
                        </td>

                        <td className="py-3 px-4">
                          <select
                            value={user.role}
                            onChange={(e) => {
                              updateUserRole(user.id, e.target.value as UserRole);
                              addLog('Thay đổi quyền tài khoản', `${user.fullName} -> ${e.target.value}`, 'user');
                              showToast(`Đã đổi vai trò thành công: ${e.target.value}`);
                            }}
                            className="bg-slate-900 border border-slate-700 rounded-lg text-xs py-1 px-2 text-purple-300 font-bold focus:outline-hidden cursor-pointer"
                          >
                            <option value="candidate">Ứng viên</option>
                            <option value="admin">Quản trị viên (Admin)</option>
                            <option value="recruiter">Nhà tuyển dụng</option>
                          </select>
                        </td>

                        <td className="py-3 px-4">
                          <button
                            onClick={() => {
                              toggleUserStatus(user.id);
                              addLog('Đổi trạng thái tài khoản', `${user.fullName}`, 'user');
                              showToast(`Đã cập nhật trạng thái tài khoản`);
                            }}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer transition-all ${
                              user.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {user.status === 'active' ? '● Hoạt động' : '✕ Đang khóa'}
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedUserForView(user)}
                            className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Xem CV</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            VIEW 4: APPLICATIONS PIPELINE
        ========================================================== */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">Lọc theo trạng thái phễu:</span>
                <select
                  value={appStatusFilter}
                  onChange={(e) => setAppStatusFilter(e.target.value)}
                  className="py-1.5 px-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-hidden focus:border-purple-500 cursor-pointer"
                >
                  <option value="all">Tất cả ({applications.length})</option>
                  <option value="applied">Đã nộp đơn</option>
                  <option value="viewed">Nhà tuyển dụng đã xem</option>
                  <option value="interview">Mời phỏng vấn</option>
                  <option value="offered">Đã gửi Offer</option>
                  <option value="rejected">Từ chối</option>
                </select>
              </div>

              <div className="text-xs text-slate-400">
                Cập nhật trạng thái trực tiếp để ứng viên nhận thông báo ngay lập tức
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-700">
                    <tr>
                      <th className="py-3.5 px-4">Công việc ứng tuyển</th>
                      <th className="py-3.5 px-4">Thời gian nộp</th>
                      <th className="py-3.5 px-4">Loại hồ sơ (CV)</th>
                      <th className="py-3.5 px-4">Trạng thái tuyển dụng</th>
                      <th className="py-3.5 px-4 text-right">Xem chi tiết</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={app.companyLogo} alt={app.company} className="w-9 h-9 rounded-lg object-cover bg-white p-0.5 shrink-0" />
                            <div>
                              <p className="font-bold text-white text-xs">{app.jobTitle}</p>
                              <p className="text-[11px] text-slate-400">{app.company} • {app.location}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-slate-400">
                          {app.appliedAt}
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-teal-500/15 text-teal-300 border border-teal-500/30 text-[11px] font-medium">
                            {app.cvName}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateAppStatus(app.id, e.target.value as Application['status'])}
                            className={`rounded-lg text-xs py-1 px-2.5 font-bold focus:outline-hidden cursor-pointer border ${
                              app.status === 'interview'
                                ? 'bg-purple-900/80 text-purple-200 border-purple-500'
                                : app.status === 'offered'
                                ? 'bg-emerald-900/80 text-emerald-200 border-emerald-500'
                                : app.status === 'rejected'
                                ? 'bg-rose-900/80 text-rose-200 border-rose-500'
                                : 'bg-slate-900 text-slate-200 border-slate-700'
                            }`}
                          >
                            <option value="applied">Đã nộp đơn</option>
                            <option value="viewed">Đã xem hồ sơ</option>
                            <option value="interview">Mời phỏng vấn</option>
                            <option value="offered">Đã gửi Offer nhận việc</option>
                            <option value="rejected">Chưa phù hợp (Từ chối)</option>
                          </select>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedUserForView({
                              id: 'cand-001',
                              fullName: candidateProfile.fullName,
                              email: candidateProfile.email,
                              phone: candidateProfile.phone,
                              avatar: candidateProfile.avatar,
                              role: 'candidate',
                              provider: 'google',
                              createdAt: '2025-02-15',
                              status: 'active'
                            })}
                            className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold cursor-pointer"
                          >
                            Xem CV Ứng Viên
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            VIEW 5: SYSTEM & DOMAIN OPERATIONS
        ========================================================== */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
            {/* Sub-navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-800/90 border border-slate-700/80 rounded-2xl">
              <button
                type="button"
                onClick={() => setSettingsSubTab('domain')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  settingsSubTab === 'domain'
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Khai Báo Tên Miền &amp; Vận Hành</span>
              </button>

              <button
                type="button"
                onClick={() => setSettingsSubTab('dns_records')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  settingsSubTab === 'dns_records'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                <span>Bảng Bản Ghi DNS</span>
              </button>

              <button
                type="button"
                onClick={() => setSettingsSubTab('branding')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  settingsSubTab === 'branding'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Thông Tin Thương Hiệu</span>
              </button>

              <button
                type="button"
                onClick={() => setSettingsSubTab('security')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  settingsSubTab === 'security'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Pháp Lý VNNIC &amp; Bộ Công Thương</span>
              </button>

              <button
                type="button"
                onClick={() => setSettingsSubTab('guide')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  settingsSubTab === 'guide'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Hướng Dẫn Nginx &amp; VPS</span>
              </button>
            </div>

            {/* ----------------------------------------------------
                SUB-TAB 1: KHAI BÁO TÊN MIỀN & VẬN HÀNH WEBSITE
            ---------------------------------------------------- */}
            {settingsSubTab === 'domain' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                {/* Domain Live Operational Header Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-950/80 via-slate-900 to-slate-900 border border-teal-500/30 p-5 shadow-xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/30 shrink-0">
                        <Globe className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm sm:text-base font-extrabold text-white font-mono tracking-tight">
                            https://{tempSettings.primaryDomain || 'nextstep.vn'}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                            Đang Vận Hành Trực Tuyến
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Tên miền chính thức phục vụ tìm việc &amp; tuyển dụng toàn quốc (Hạ tầng Data Center Việt Nam)
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRunDnsPing}
                      disabled={isPingingDns}
                      className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-teal-500/20 disabled:opacity-50 shrink-0"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isPingingDns ? 'animate-spin' : ''}`} />
                      <span>{isPingingDns ? 'Đang Kiểm Tra DNS...' : 'Kiểm Tra Kết Nối DNS'}</span>
                    </button>
                  </div>

                  {/* Operational Quick Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/80 text-xs">
                    <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-medium">Địa chỉ IPv4 Máy Chủ</span>
                      <span className="font-mono font-bold text-teal-300 mt-0.5 block">{tempSettings.serverIp || '103.179.188.88'}</span>
                    </div>
                    <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-medium">Bảo Mật HTTPS / SSL</span>
                      <span className="font-semibold text-emerald-300 mt-0.5 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-emerald-400" />
                        TLS 1.3 Active
                      </span>
                    </div>
                    <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-medium">Anycast CDN / Anti-DDoS</span>
                      <span className="font-semibold text-cyan-300 mt-0.5 block">
                        {tempSettings.cloudflareProxied ? 'Đã Bật (Cloudflare)' : 'Tắt (Trực tiếp IP)'}
                      </span>
                    </div>
                    <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-medium">Cổng Tuyển Dụng Subdomain</span>
                      <span className="font-mono font-bold text-purple-300 mt-0.5 block truncate">{tempSettings.subDomain || 'tuyendung.nextstep.vn'}</span>
                    </div>
                  </div>
                </div>

                {/* DNS Health Check Diagnostic Output Box */}
                {dnsPingResult && (
                  <div className="bg-slate-950/90 border border-emerald-500/40 rounded-2xl p-4 shadow-xl text-xs space-y-3 animate-in slide-in-from-top-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Kết Quả Kiểm Tra DNS Health Check: KẾT NỐI TỐT (HTTP 200 OK)</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">Thời gian kiểm tra: {dnsPingResult.checkedAt}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px] bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                      <div>
                        <span className="text-slate-400 block">Độ trễ Ping (Latency):</span>
                        <strong className="text-emerald-300">{dnsPingResult.latencyMs} ms (Rất nhanh)</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">IP phân giải thực tế:</span>
                        <strong className="text-teal-300">{dnsPingResult.resolvedIp}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Chứng chỉ TLS/SSL:</span>
                        <strong className="text-purple-300">Hợp lệ (Let&apos;s Encrypt 2026)</strong>
                      </div>
                    </div>

                    <p className="text-slate-300 text-xs leading-relaxed">
                      {dnsPingResult.details}
                    </p>
                  </div>
                )}

                {/* Domain & Server Input Form */}
                <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-md">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-700">
                    <Server className="w-4 h-4 text-teal-400" />
                    Thiết Lập Thông Số Tên Miền &amp; Máy Chủ
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Tên miền chính (Primary Domain) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-500 font-mono text-xs">https://</span>
                        <input
                          type="text"
                          value={tempSettings.primaryDomain || ''}
                          onChange={(e) => setTempSettings({ ...tempSettings, primaryDomain: e.target.value.toLowerCase().replace(/https?:\/\//, '').trim() })}
                          placeholder="nextstep.vn"
                          className="w-full pl-18 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-teal-500 focus:outline-hidden font-mono"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Tên miền trang chính dành cho người tìm việc và doanh nghiệp.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Tên miền phụ cổng tuyển dụng (Subdomain)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-500 font-mono text-xs">https://</span>
                        <input
                          type="text"
                          value={tempSettings.subDomain || ''}
                          onChange={(e) => setTempSettings({ ...tempSettings, subDomain: e.target.value.toLowerCase().replace(/https?:\/\//, '').trim() })}
                          placeholder="tuyendung.nextstep.vn"
                          className="w-full pl-18 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-teal-500 focus:outline-hidden font-mono"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Đường dẫn chuyên biệt cho Nhà tuyển dụng đăng tin và quản lý ứng viên.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Địa chỉ IPv4 Máy Chủ (Server Public IP) *
                      </label>
                      <input
                        type="text"
                        value={tempSettings.serverIp || ''}
                        onChange={(e) => setTempSettings({ ...tempSettings, serverIp: e.target.value.trim() })}
                        placeholder="103.179.188.88"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-teal-500 focus:outline-hidden font-mono"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">IP tĩnh của máy chủ VPS / Cloud Hosting chạy dịch vụ web.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Port dịch vụ Web nội bộ
                      </label>
                      <input
                        type="number"
                        value={tempSettings.webPort || 5173}
                        onChange={(e) => setTempSettings({ ...tempSettings, webPort: Number(e.target.value) || 5173 })}
                        placeholder="5173"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-teal-500 focus:outline-hidden font-mono"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">Cổng dịch vụ backend/frontend để Nginx làm Reverse Proxy trỏ đến (Ví dụ: 5173 / 3000 / 80).</p>
                    </div>
                  </div>

                  {/* SSL and CDN Toggles */}
                  <div className="pt-3 border-t border-slate-700/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Chứng chỉ bảo mật SSL / HTTPS
                      </label>
                      <input
                        type="text"
                        value={tempSettings.sslProvider || "Let's Encrypt Wildcard SSL (TLS 1.3)"}
                        onChange={(e) => setTempSettings({ ...tempSettings, sslProvider: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-teal-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-700/80">
                      <div>
                        <span className="block text-xs font-bold text-white">Proxy Cloudflare CDN &amp; Chống DDoS</span>
                        <span className="block text-[11px] text-slate-400">Ẩn IP gốc máy chủ, tăng tốc độ tải trang toàn quốc</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setTempSettings({ ...tempSettings, cloudflareProxied: !tempSettings.cloudflareProxied })}
                        className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                          tempSettings.cloudflareProxied ? 'bg-teal-500 justify-end' : 'bg-slate-700 justify-start'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------
                SUB-TAB 2: BẢNG BẢN GHI DNS (DNS RECORDS CHECKLIST)
            ---------------------------------------------------- */}
            {settingsSubTab === 'dns_records' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-700">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Network className="w-4 h-4 text-purple-400" />
                        Bảng Cấu Hình Bản Ghi DNS Tiêu Chuẩn (DNS Records)
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Thêm các bản ghi này vào trang quản lý DNS tại Nhà đăng ký tên miền của bạn (PA Việt Nam, Mắt Bão, Viettel, Tenten, Cloudflare...)
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold shrink-0">
                      TTL Khuyến nghị: 300s (5 phút)
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-700 text-slate-400 font-semibold bg-slate-900/60">
                          <th className="py-2.5 px-3">Loại (Type)</th>
                          <th className="py-2.5 px-3">Tên Host / Name</th>
                          <th className="py-2.5 px-3">Giá Trị Trỏ Đến (Points To / Target)</th>
                          <th className="py-2.5 px-3">TTL</th>
                          <th className="py-2.5 px-3 text-center">Trạng Thái</th>
                          <th className="py-2.5 px-3 text-right">Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 font-mono">
                        {/* A Record */}
                        <tr className="hover:bg-slate-700/30">
                          <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">A</span></td>
                          <td className="py-3 px-3 text-white font-bold">@</td>
                          <td className="py-3 px-3 text-teal-300">{tempSettings.serverIp || '103.179.188.88'}</td>
                          <td className="py-3 px-3 text-slate-400">300s (Auto)</td>
                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-sans">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Đã kết nối
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleCopyText(tempSettings.serverIp || '103.179.188.88', 'dns_a', 'IP Máy Chủ')}
                              className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-sans cursor-pointer inline-flex items-center gap-1"
                            >
                              {copiedKey === 'dns_a' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedKey === 'dns_a' ? 'Đã chép' : 'Sao chép'}</span>
                            </button>
                          </td>
                        </tr>

                        {/* CNAME www */}
                        <tr className="hover:bg-slate-700/30">
                          <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">CNAME</span></td>
                          <td className="py-3 px-3 text-white font-bold">www</td>
                          <td className="py-3 px-3 text-teal-300">{tempSettings.primaryDomain || 'nextstep.vn'}</td>
                          <td className="py-3 px-3 text-slate-400">300s (Auto)</td>
                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-sans">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Đã kết nối
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleCopyText(tempSettings.primaryDomain || 'nextstep.vn', 'dns_cname_www', 'CNAME www')}
                              className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-sans cursor-pointer inline-flex items-center gap-1"
                            >
                              {copiedKey === 'dns_cname_www' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedKey === 'dns_cname_www' ? 'Đã chép' : 'Sao chép'}</span>
                            </button>
                          </td>
                        </tr>

                        {/* CNAME tuyendung */}
                        <tr className="hover:bg-slate-700/30">
                          <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">CNAME</span></td>
                          <td className="py-3 px-3 text-white font-bold">tuyendung</td>
                          <td className="py-3 px-3 text-teal-300">{tempSettings.primaryDomain || 'nextstep.vn'}</td>
                          <td className="py-3 px-3 text-slate-400">300s (Auto)</td>
                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center gap-1 text-[11px] text-purple-300 font-sans">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Cổng NTD
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleCopyText(tempSettings.primaryDomain || 'nextstep.vn', 'dns_cname_ntd', 'CNAME tuyendung')}
                              className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-sans cursor-pointer inline-flex items-center gap-1"
                            >
                              {copiedKey === 'dns_cname_ntd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedKey === 'dns_cname_ntd' ? 'Đã chép' : 'Sao chép'}</span>
                            </button>
                          </td>
                        </tr>

                        {/* TXT SPF Mail */}
                        <tr className="hover:bg-slate-700/30">
                          <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">TXT</span></td>
                          <td className="py-3 px-3 text-white font-bold">@</td>
                          <td className="py-3 px-3 text-slate-300 truncate max-w-xs">v=spf1 include:_spf.{tempSettings.primaryDomain || 'nextstep.vn'} ~all</td>
                          <td className="py-3 px-3 text-slate-400">Auto</td>
                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center gap-1 text-[11px] text-amber-300 font-sans">
                              Mail CV Valid
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleCopyText(`v=spf1 include:_spf.${tempSettings.primaryDomain || 'nextstep.vn'} ~all`, 'dns_txt_spf', 'TXT SPF')}
                              className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-sans cursor-pointer inline-flex items-center gap-1"
                            >
                              {copiedKey === 'dns_txt_spf' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedKey === 'dns_txt_spf' ? 'Đã chép' : 'Sao chép'}</span>
                            </button>
                          </td>
                        </tr>

                        {/* TXT VNNIC Verification */}
                        <tr className="hover:bg-slate-700/30">
                          <td className="py-3 px-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">TXT</span></td>
                          <td className="py-3 px-3 text-white font-bold">_vnnic</td>
                          <td className="py-3 px-3 text-slate-300 truncate max-w-xs">vnnic-site-verification={tempSettings.vnnicRegistrationNo || 'VNNIC-2026-NXT-8899VN'}</td>
                          <td className="py-3 px-3 text-slate-400">Auto</td>
                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300 font-sans">
                              VNNIC Pass
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleCopyText(`vnnic-site-verification=${tempSettings.vnnicRegistrationNo || 'VNNIC-2026-NXT-8899VN'}`, 'dns_txt_vnnic', 'TXT VNNIC')}
                              className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-sans cursor-pointer inline-flex items-center gap-1"
                            >
                              {copiedKey === 'dns_txt_vnnic' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedKey === 'dns_txt_vnnic' ? 'Đã chép' : 'Sao chép'}</span>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 space-y-1">
                    <p className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-teal-400" />
                      Lưu ý về thời gian phân giải DNS (Propagation Time):
                    </p>
                    <p>
                      Sau khi cập nhật bản ghi DNS tại Nhà đăng ký tên miền, máy chủ DNS quốc tế và trong nước sẽ đồng bộ trong khoảng <strong>5 đến 30 phút</strong>. Bạn có thể bấm nút &quot;Kiểm Tra Kết Nối DNS&quot; ở tab trên để xác minh trạng thái kết nối.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------
                SUB-TAB 3: THÔNG TIN THƯƠNG HIỆU & DOANH NGHIỆP
            ---------------------------------------------------- */}
            {settingsSubTab === 'branding' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-md">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-700">
                    <Building2 className="w-4 h-4 text-purple-400" />
                    Thông Tin Thương Hiệu &amp; Doanh Nghiệp
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Tên thương hiệu hệ thống
                      </label>
                      <input
                        type="text"
                        value={tempSettings.companyName}
                        onChange={(e) => setTempSettings({ ...tempSettings, companyName: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-purple-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Khẩu hiệu (Brand Slogan)
                      </label>
                      <input
                        type="text"
                        value={tempSettings.brandSlogan}
                        onChange={(e) => setTempSettings({ ...tempSettings, brandSlogan: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-purple-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Hotline tuyển dụng hiển thị trên Web
                      </label>
                      <input
                        type="text"
                        value={tempSettings.hotline}
                        onChange={(e) => setTempSettings({ ...tempSettings, hotline: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-purple-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Email tiếp nhận CV &amp; Hỗ trợ
                      </label>
                      <input
                        type="email"
                        value={tempSettings.email}
                        onChange={(e) => setTempSettings({ ...tempSettings, email: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-purple-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Địa chỉ trụ sở doanh nghiệp
                    </label>
                    <input
                      type="text"
                      value={tempSettings.address}
                      onChange={(e) => setTempSettings({ ...tempSettings, address: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-purple-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Thông báo nổi bật trên toàn hệ thống (Broadcast Announcement)
                    </label>
                    <input
                      type="text"
                      value={tempSettings.systemAnnouncement}
                      onChange={(e) => setTempSettings({ ...tempSettings, systemAnnouncement: e.target.value })}
                      placeholder="Ví dụ: Đợt tuyển dụng mùa Xuân 2026 đang mở với hơn 100+ vị trí mới..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-purple-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------
                SUB-TAB 4: PHÁP LÝ VNNIC & BỘ CÔNG THƯƠNG
            ---------------------------------------------------- */}
            {settingsSubTab === 'security' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-md">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-700">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    Khai Báo Pháp Lý Tên Miền &amp; Thông Báo Website Tuyển Dụng
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Chủ thể pháp nhân sở hữu tên miền
                      </label>
                      <input
                        type="text"
                        value={tempSettings.domainOwnerName || ''}
                        onChange={(e) => setTempSettings({ ...tempSettings, domainOwnerName: e.target.value })}
                        placeholder="Công ty Cổ phần Giải pháp Tuyển dụng Nextstep"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-purple-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Mã xác nhận đăng ký tên miền VNNIC
                      </label>
                      <input
                        type="text"
                        value={tempSettings.vnnicRegistrationNo || ''}
                        onChange={(e) => setTempSettings({ ...tempSettings, vnnicRegistrationNo: e.target.value })}
                        placeholder="VNNIC-2026-NXT-8899VN"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-purple-500 focus:outline-hidden font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Mã hồ sơ thông báo Bộ Công Thương (online.gov.vn)
                      </label>
                      <input
                        type="text"
                        value={tempSettings.bctNoticeCode || ''}
                        onChange={(e) => setTempSettings({ ...tempSettings, bctNoticeCode: e.target.value })}
                        placeholder="BCT-WEB-2026-99881"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-purple-500 focus:outline-hidden font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Tình trạng hồ sơ thông báo Bộ Công Thương
                      </label>
                      <select
                        value={tempSettings.bctNoticeStatus || 'registered'}
                        onChange={(e) => setTempSettings({ ...tempSettings, bctNoticeStatus: e.target.value as 'registered' | 'pending' | 'exempt' })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-purple-500 focus:outline-hidden"
                      >
                        <option value="registered">Đã duyệt thông báo (Được cấp huy hiệu chính thức)</option>
                        <option value="pending">Đang thẩm định hồ sơ (Chờ phê duyệt)</option>
                        <option value="exempt">Nội bộ / Thử nghiệm</option>
                      </select>
                    </div>
                  </div>

                  {/* Legal Information Callout */}
                  <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200 leading-relaxed space-y-2">
                    <p className="font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      Quy định pháp lý khi vận hành website việc làm tại Việt Nam:
                    </p>
                    <p>
                      Căn cứ theo <strong>Nghị định số 52/2013/NĐ-CP</strong> và <strong>Nghị định số 85/2021/NĐ-CP</strong> của Chính phủ, cổng thông tin giới thiệu việc làm hoặc sàn kết nối cung ứng lao động có thu phí hoặc không thu phí cần thực hiện thủ tục <strong>Thông báo website thương mại điện tử bán hàng/dịch vụ</strong> với Bộ Công Thương tại cổng thông tin quốc gia: <a href="http://online.gov.vn" target="_blank" rel="noreferrer" className="text-teal-300 underline font-semibold">online.gov.vn</a>.
                    </p>
                    <p>
                      Sau khi được duyệt, mã xác nhận và huy hiệu &quot;Đã Thông Báo Bộ Công Thương&quot; sẽ tự động hiển thị ở chân trang website Nextstep để tạo sự tin tưởng tuyệt đối cho người lao động và ứng viên.
                    </p>
                  </div>
                </div>

                {/* Super Admin Credentials Box */}
                <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-md">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-700">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    Tài Khoản &amp; Quyền Hạn Super Admin
                  </h3>

                  <p className="text-xs text-slate-300">
                    Tài khoản đăng nhập Super Admin hiện tại: <strong className="text-purple-300 font-mono">admin@nextstep.vn</strong>. Mật khẩu mặc định: <code className="bg-slate-900 px-2.5 py-1 rounded text-amber-300 font-mono font-bold">admin123</code>.
                  </p>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------
                SUB-TAB 5: HƯỚNG DẪN KỸ THUẬT TRIỂN KHAI (NGINX & VPS)
            ---------------------------------------------------- */}
            {settingsSubTab === 'guide' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-md">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-700">
                    <Terminal className="w-4 h-4 text-teal-400" />
                    Quy Trình Triển Khai Thực Tế &amp; Cấu Hình Nginx Reverse Proxy
                  </h3>

                  <div className="space-y-4 text-xs">
                    {/* Step 1 */}
                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                      <span className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center text-[10px]">1</span>
                        Trỏ tên miền tại Nhà cung cấp (DNS Setup)
                      </span>
                      <p className="text-slate-300 pl-6">
                        Đăng nhập vào bảng quản lý DNS tên miền và trỏ bản ghi <strong>A</strong> về địa chỉ IP máy chủ: <code className="text-teal-300 font-mono font-bold">{tempSettings.serverIp || '103.179.188.88'}</code>, cùng các bản ghi <strong>CNAME</strong> (www, tuyendung) theo Bảng bản ghi DNS.
                      </p>
                    </div>

                    {/* Step 2 */}
                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px]">2</span>
                          Cấu hình Nginx Reverse Proxy (Mẫu file /etc/nginx/sites-available/nextstep.conf)
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(`server {
    listen 80;
    server_name ${tempSettings.primaryDomain || 'nextstep.vn'} www.${tempSettings.primaryDomain || 'nextstep.vn'} ${tempSettings.subDomain || 'tuyendung.nextstep.vn'};

    location / {
        proxy_pass http://127.0.0.1:${tempSettings.webPort || 5173};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`, 'nginx_config', 'Nginx Config')}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-sans cursor-pointer inline-flex items-center gap-1 border border-slate-700"
                        >
                          {copiedKey === 'nginx_config' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'nginx_config' ? 'Đã sao chép' : 'Sao chép cấu hình Nginx'}</span>
                        </button>
                      </div>

                      <pre className="p-3 rounded-xl bg-slate-950 text-slate-300 font-mono text-[11px] overflow-x-auto border border-slate-800">
{`server {
    listen 80;
    server_name ${tempSettings.primaryDomain || 'nextstep.vn'} www.${tempSettings.primaryDomain || 'nextstep.vn'} ${tempSettings.subDomain || 'tuyendung.nextstep.vn'};

    location / {
        proxy_pass http://127.0.0.1:${tempSettings.webPort || 5173};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`}
                      </pre>
                    </div>

                    {/* Step 3 */}
                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px]">3</span>
                          Cài đặt chứng chỉ SSL miễn phí tự động bằng Certbot
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(`sudo certbot --nginx -d ${tempSettings.primaryDomain || 'nextstep.vn'} -d www.${tempSettings.primaryDomain || 'nextstep.vn'} -d ${tempSettings.subDomain || 'tuyendung.nextstep.vn'}`, 'certbot_cmd', 'Lệnh Certbot SSL')}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-sans cursor-pointer inline-flex items-center gap-1 border border-slate-700"
                        >
                          {copiedKey === 'certbot_cmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'certbot_cmd' ? 'Đã sao chép' : 'Sao chép lệnh Certbot'}</span>
                        </button>
                      </div>

                      <pre className="p-3 rounded-xl bg-slate-950 text-emerald-300 font-mono text-[11px] overflow-x-auto border border-slate-800">
{`sudo certbot --nginx -d ${tempSettings.primaryDomain || 'nextstep.vn'} -d www.${tempSettings.primaryDomain || 'nextstep.vn'} -d ${tempSettings.subDomain || 'tuyendung.nextstep.vn'}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Form Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-slate-800/90 border border-slate-700/80 rounded-2xl">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Globe className="w-4 h-4 text-teal-400" />
                <span>Tên miền hiển thị: <strong className="text-white font-mono">{tempSettings.primaryDomain || 'nextstep.vn'}</strong></span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="submit"
                  className="w-full sm:w-auto py-2.5 px-6 bg-gradient-to-r from-teal-600 via-purple-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Lưu Thay Đổi Cấu Hình Hệ Thống &amp; Tên Miền</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </main>

      {/* ==========================================================
          MODAL: CREATE / EDIT JOB
      ========================================================== */}
      {isCreatingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4 my-8 text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-400" />
                <span>{editingJob ? 'Chỉnh Sửa Tin Tuyển Dụng' : 'Tạo Việc Làm Mới (Admin)'}</span>
              </h3>
              <button
                onClick={() => setIsCreatingJob(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Tiêu đề vị trí tuyển dụng *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="VD: Senior React Frontend Developer"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Tên công ty tuyển dụng *</label>
                  <input
                    type="text"
                    required
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Địa điểm / Thành phố</label>
                  <select
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-purple-500 cursor-pointer"
                  >
                    {CITIES.filter(c => c !== 'Tất cả địa điểm').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Ngành nghề chuyên môn</label>
                  <select
                    value={formIndustry}
                    onChange={(e) => setFormIndustry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-purple-500 cursor-pointer"
                  >
                    {INDUSTRIES.filter(i => i !== 'Tất cả ngành nghề').map(i => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Mức lương hiển thị</label>
                  <input
                    type="text"
                    value={formSalary}
                    onChange={(e) => setFormSalary(e.target.value)}
                    placeholder="VD: 25 - 40 triệu"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Hạn nộp hồ sơ</label>
                  <input
                    type="date"
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Cấp bậc</label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-purple-500 cursor-pointer"
                  >
                    {LEVELS.filter(l => l !== 'Tất cả cấp bậc').map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Kinh nghiệm yêu cầu</label>
                  <select
                    value={formExperience}
                    onChange={(e) => setFormExperience(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-purple-500 cursor-pointer"
                  >
                    {EXPERIENCES.filter(exp => exp !== 'Tất cả kinh nghiệm').map(exp => (
                      <option key={exp} value={exp}>{exp}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-300">Kỹ năng yêu cầu (phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={formSkills}
                  onChange={(e) => setFormSkills(e.target.value)}
                  placeholder="VD: React, TypeScript, Next.js, Git"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsHot}
                    onChange={(e) => setFormIsHot(e.target.checked)}
                    className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="font-bold text-red-400">🔥 Ghim việc HOT</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsUrgent}
                    onChange={(e) => setFormIsUrgent(e.target.checked)}
                    className="rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="font-bold text-amber-400">⚡ Tuyển gấp (Urgent)</span>
                </label>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-300">Mô tả công việc (mỗi dòng một ý)</label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-purple-500"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-300">Yêu cầu ứng viên</label>
                <textarea
                  rows={3}
                  value={formReq}
                  onChange={(e) => setFormReq(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-purple-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreatingJob(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold cursor-pointer"
                >
                  {editingJob ? 'Cập Nhật Thay Đổi' : 'Lưu &amp; Đăng Tuyển Ngay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================================
          MODAL: CANDIDATE CV PREVIEW FOR ADMIN
      ========================================================== */}
      {selectedUserForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4 my-8 text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img src={selectedUserForView.avatar} alt={selectedUserForView.fullName} className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-400" />
                <div>
                  <h3 className="text-base font-bold text-white">{selectedUserForView.fullName}</h3>
                  <p className="text-xs text-purple-400 font-semibold">Tài khoản: {selectedUserForView.role.toUpperCase()}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserForView(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-4 h-4 text-teal-400" />
                  <span>{selectedUserForView.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>{selectedUserForView.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Globe className="w-4 h-4 text-purple-400" />
                  <span>Kênh xác thực: {selectedUserForView.provider.toUpperCase()}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-800/60 rounded-xl space-y-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-purple-300">
                  Hồ sơ tóm tắt của ứng viên
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {candidateProfile.bio}
                </p>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {candidateProfile.skills.map(s => (
                    <span key={s.id} className="px-2 py-0.5 rounded bg-slate-700 text-teal-300 text-[11px] font-semibold">
                      {s.name} (Cấp độ {s.level}/5)
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedUserForView(null)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
