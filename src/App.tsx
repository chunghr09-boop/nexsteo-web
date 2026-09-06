import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { JobSearchHero } from './components/JobSearchHero';
import { JobList } from './components/JobList';
import { JobDetailModal } from './components/JobDetailModal';
import { QuickApplyModal } from './components/QuickApplyModal';
import { ProfileManager } from './components/ProfileManager';
import { ApplicationTracker } from './components/ApplicationTracker';
import { SavedJobsView } from './components/SavedJobsView';
import { SalaryCalculatorView } from './components/SalaryCalculatorModal';
import { RecruiterPortal } from './components/RecruiterPortal';
import { RecruiterChatModal } from './components/RecruiterChatModal';
import { NextstepLogo } from './components/NextstepLogo';
import { QuickContactWidget } from './components/QuickContactWidget';
import { NEXTSTEP_COMPANY_INFO } from './data/companyInfo';
import { PhoneCall, Mail, MapPin, Sparkles, ShieldCheck, Megaphone, Bell, Building2, BarChart3, ChevronRight, Globe, User, LogIn, UserPlus, CheckCircle2, Bookmark, FileText, Briefcase } from 'lucide-react';

import { 
  Job, 
  FilterState, 
  CandidateProfile, 
  Application, 
  ApplicationStatus,
  RecruiterView, 
  ChatMessage, 
  SystemSettings,
  AdminNotificationItem,
  AdminChatConversation,
  AppNotification,
  NotificationType
} from './types';
import { INITIAL_JOBS } from './data/mockJobs';
import { 
  INITIAL_PROFILE, 
  INITIAL_PROFILES_MAP,
  INITIAL_APPLICATIONS, 
  INITIAL_RECRUITER_VIEWS, 
  INITIAL_MESSAGES,
  TEST_USER_IDS,
  isTestAccount,
  createCleanCandidateProfile,
  EMPTY_GUEST_PROFILE
} from './data/initialProfile';
import { 
  INITIAL_ADMIN_NOTIFICATIONS, 
  INITIAL_CANDIDATE_NOTIFICATIONS,
  INITIAL_RECRUITER_NOTIFICATIONS,
  INITIAL_ADMIN_CONVERSATIONS 
} from './data/adminSupportData';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { AdminPortal } from './components/AdminPortal';
import { AccessDeniedModal } from './components/AccessDeniedModal';
import { AdminHelpdeskChatModal } from './components/AdminHelpdeskChatModal';
import { RecruiterAdminChatModal } from './components/RecruiterAdminChatModal';
import { RecruiterAnalyticsDashboard } from './components/RecruiterAnalyticsDashboard';
import { RecruiterApplicationsManager } from './components/RecruiterApplicationsManager';
import { RecruiterProfileManager } from './components/RecruiterProfileManager';
import { NotificationToast } from './components/NotificationToast';
import { NotificationDetailModal } from './components/NotificationDetailModal';
import { ChatConversationItem } from './utils/chatConversations';

const STORAGE_KEYS = {
  PROFILE: 'jobsgo_candidate_profile_v1',
  APPLICATIONS: 'jobsgo_applications_v1',
  SAVED_JOBS: 'jobsgo_saved_jobs_v1',
  CUSTOM_JOBS: 'jobsgo_custom_jobs_v1',
  MESSAGES: 'jobsgo_chat_messages_v1',
  SYSTEM_SETTINGS: 'jobsgo_system_settings_v1',
  ADMIN_NOTIFICATIONS: 'jobsgo_admin_notifications_v1',
  ADMIN_CONVERSATIONS: 'jobsgo_admin_conversations_v1'
};

const getProfileStorageKey = (userId?: string) => `jobsgo_candidate_profile_${userId || 'guest'}`;
const getSavedJobsStorageKey = (userId?: string) => `jobsgo_saved_jobs_${userId || 'guest'}`;
const getSearchHistoryStorageKey = (userId?: string) => `jobsgo_search_history_${userId || 'guest'}`;
const getNotificationsStorageKey = (userId?: string) => `jobsgo_user_notifications_${userId || 'guest'}`;

const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  companyName: NEXTSTEP_COMPANY_INFO.companyName,
  brandSlogan: NEXTSTEP_COMPANY_INFO.tagline,
  hotline: NEXTSTEP_COMPANY_INFO.phone,
  hotlineClean: NEXTSTEP_COMPANY_INFO.phoneClean,
  email: NEXTSTEP_COMPANY_INFO.email,
  address: NEXTSTEP_COMPANY_INFO.address,
  workingHours: 'Thứ Hai – Thứ Sáu (8:00 – 17:30), Thứ Bảy (8:00 – 12:00)',
  systemAnnouncement: 'Hệ thống Nextstep hỗ trợ đa kênh xác thực (Google, Zalo, SĐT OTP) và quản trị viên song song 2026',
  isMaintenanceMode: false,
  primaryDomain: 'nextstep.vn',
  subDomain: 'tuyendung.nextstep.vn',
  serverIp: '103.179.188.88',
  sslProvider: "Let's Encrypt Wildcard SSL (TLS 1.3)",
  sslStatus: 'active',
  dnsStatus: 'connected',
  cloudflareProxied: true,
  domainOwnerName: 'Công ty Cổ phần Giải pháp Tuyển dụng Nextstep',
  vnnicRegistrationNo: 'VNNIC-2026-NXT-8899VN',
  bctNoticeStatus: 'registered',
  bctNoticeCode: 'BCT-WEB-2026-99881',
  webPort: 5173
};

const GuestAuthPrompt: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  onLogin: () => void;
  onRegister: () => void;
  onGoHome: () => void;
}> = ({ title, description, icon, onLogin, onRegister, onGoHome }) => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12">
      <div className="max-w-md mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0D2B52] to-[#137E8F] flex items-center justify-center text-white mx-auto shadow-md">
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-900">{title}</h3>
          <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
            {description}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
          <button
            onClick={onLogin}
            className="px-5 py-2.5 bg-gradient-to-r from-[#0D2B52] to-[#137E8F] hover:opacity-95 text-white font-bold rounded-xl text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Đăng Nhập Ngay</span>
          </button>
          <button
            onClick={onRegister}
            className="px-5 py-2.5 bg-teal-50 hover:bg-teal-100 text-[#0D2B52] font-bold rounded-xl text-xs transition-colors border border-teal-200/80 cursor-pointer flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-[#137E8F]" />
            <span>Tạo Tài Khoản Mới</span>
          </button>
        </div>
        <div className="pt-3 border-t border-slate-100">
          <button
            onClick={onGoHome}
            className="text-xs font-semibold text-[#137E8F] hover:underline transition-colors cursor-pointer"
          >
            ← Quay lại trang chủ tìm việc làm
          </button>
        </div>
      </div>
    </div>
  );
};

function MainApp() {
  const { isAuthenticated, isAdmin, isRecruiter, isCandidate, currentUser } = useAuth();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'jobs' | 'profile' | 'applications' | 'saved' | 'salary' | 'recruiter_portal' | 'admin'>('jobs');

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [authModalMethod, setAuthModalMethod] = useState<'all' | 'phone' | 'email'>('all');
  const [pendingActionAfterAuth, setPendingActionAfterAuth] = useState<(() => void) | null>(null);

  // System Settings state (merging defaults so domain configs are present)
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SYSTEM_SETTINGS);
    if (saved) {
      try { 
        return { ...DEFAULT_SYSTEM_SETTINGS, ...JSON.parse(saved) }; 
      } catch (e) {}
    }
    return DEFAULT_SYSTEM_SETTINGS;
  });

  // Active loaded user ID ref to guard against writing stale state during user switch
  const activeLoadedUserIdRef = useRef<string | null>(currentUser?.id || null);

  // Candidate Profile State with LocalStorage (Tách biệt theo từng tài khoản đăng nhập)
  const [profile, setProfile] = useState<CandidateProfile>(() => {
    if (!currentUser) return EMPTY_GUEST_PROFILE;
    const activeUserId = currentUser.id;
    const userSaved = localStorage.getItem(getProfileStorageKey(activeUserId));
    if (userSaved) {
      try { 
        const parsed = JSON.parse(userSaved);
        if (parsed && (parsed.id === activeUserId || `user-${parsed.id}` === activeUserId)) {
          // Bảo vệ: Nếu là tài khoản mới (không phải test), loại bỏ dữ liệu nếu bị nhiễm dữ liệu mẫu của tài khoản test
          if (!isTestAccount(activeUserId) && parsed.experiences?.some((e: any) => e.company?.includes('VNG') || e.company?.includes('FPT'))) {
            return createCleanCandidateProfile(currentUser);
          }
          return parsed;
        }
      } catch (e) {}
    }
    if (isTestAccount(activeUserId)) {
      if (activeUserId === 'user-cand-001') {
        const savedLegacy = localStorage.getItem(STORAGE_KEYS.PROFILE);
        if (savedLegacy) {
          try { return JSON.parse(savedLegacy); } catch (e) {}
        }
      }
      return INITIAL_PROFILES_MAP[activeUserId] || INITIAL_PROFILE;
    }
    return createCleanCandidateProfile(currentUser);
  });

  // Applications State with LocalStorage
  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (saved) {
      try { 
        const parsed: Application[] = JSON.parse(saved);
        // Ensure NextGen applications exist
        const missing = INITIAL_APPLICATIONS.filter(ia => !parsed.some(p => p.id === ia.id));
        if (missing.length > 0) return [...parsed, ...missing];
        return parsed;
      } catch (e) {}
    }
    return INITIAL_APPLICATIONS;
  });

  // Candidate Saved Job IDs State with LocalStorage (Tách biệt theo từng ứng viên: khách/mới đăng ký = 0 việc)
  const [candidateSavedJobs, setCandidateSavedJobs] = useState<string[]>(() => {
    if (!currentUser) return [];
    const activeUserId = currentUser.id;
    const userSaved = localStorage.getItem(getSavedJobsStorageKey(activeUserId));
    if (userSaved) {
      try {
        const parsed = JSON.parse(userSaved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    if (isTestAccount(activeUserId)) {
      if (activeUserId === 'user-cand-001') {
        const savedLegacy = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
        if (savedLegacy) {
          try {
            const parsed = JSON.parse(savedLegacy);
            if (Array.isArray(parsed)) return parsed;
          } catch (e) {}
        }
        return ['job-1', 'job-5'];
      }
      if (activeUserId === 'user-cand-002') return ['job-nextgen-3'];
      if (activeUserId === 'user-cand-003') return ['job-nextgen-2'];
      return [];
    }
    // Tài khoản mới đăng ký hoàn toàn không có việc làm lưu sẵn
    return [];
  });

  // Lịch sử tìm kiếm việc làm (Tách biệt theo từng tài khoản: khách/mới không có lịch sử)
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    if (!currentUser) return [];
    const activeUserId = currentUser.id;
    const userSaved = localStorage.getItem(getSearchHistoryStorageKey(activeUserId));
    if (userSaved) {
      try {
        const parsed = JSON.parse(userSaved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    if (activeUserId === 'user-cand-001') {
      return ['ReactJS', 'Frontend Developer', 'Nextstep'];
    }
    return [];
  });

  // Tự động chuyển đổi Profile, Việc đã lưu & Lịch sử tìm kiếm khi đăng nhập/chuyển đổi tài khoản/đăng xuất
  useEffect(() => {
    if (!currentUser) {
      activeLoadedUserIdRef.current = 'guest';
      setProfile(EMPTY_GUEST_PROFILE);
      setCandidateSavedJobs([]);
      setSearchHistory([]);
      setNotifications([]);
      return;
    }
    const userId = currentUser.id;

    // 1. Load user profile
    const savedProf = localStorage.getItem(getProfileStorageKey(userId));
    if (savedProf) {
      try {
        const parsed = JSON.parse(savedProf);
        if (parsed && (parsed.id === userId || `user-${parsed.id}` === userId)) {
          // Nếu là tài khoản mới và bị dính dữ liệu của tài khoản test, tự động dọn dẹp về trắng tinh
          if (!isTestAccount(userId) && parsed.experiences?.some((e: any) => e.company?.includes('VNG') || e.company?.includes('FPT'))) {
            const clean = createCleanCandidateProfile(currentUser);
            setProfile(clean);
            localStorage.setItem(getProfileStorageKey(userId), JSON.stringify(clean));
          } else {
            setProfile(parsed);
          }
        } else {
          const fresh = isTestAccount(userId)
            ? (INITIAL_PROFILES_MAP[userId] || INITIAL_PROFILE)
            : createCleanCandidateProfile(currentUser);
          setProfile(fresh);
          localStorage.setItem(getProfileStorageKey(userId), JSON.stringify(fresh));
        }
      } catch (e) {
        const fresh = isTestAccount(userId)
          ? (INITIAL_PROFILES_MAP[userId] || INITIAL_PROFILE)
          : createCleanCandidateProfile(currentUser);
        setProfile(fresh);
      }
    } else if (isTestAccount(userId)) {
      if (userId === 'user-cand-001') {
        const legacyProf = localStorage.getItem(STORAGE_KEYS.PROFILE);
        if (legacyProf) {
          try {
            setProfile(JSON.parse(legacyProf));
          } catch (e) {
            setProfile(INITIAL_PROFILE);
          }
        } else {
          setProfile(INITIAL_PROFILE);
        }
      } else if (INITIAL_PROFILES_MAP[userId]) {
        setProfile(INITIAL_PROFILES_MAP[userId]);
      } else {
        setProfile(INITIAL_PROFILE);
      }
    } else {
      // Tài khoản vừa đăng ký: profile sạch sẽ 100%, không bị dính bất kỳ dữ liệu mẫu nào
      const clean = createCleanCandidateProfile(currentUser);
      setProfile(clean);
      localStorage.setItem(getProfileStorageKey(userId), JSON.stringify(clean));
    }

    // 2. Load user saved jobs
    const savedJobsStr = localStorage.getItem(getSavedJobsStorageKey(userId));
    if (savedJobsStr) {
      try {
        const parsed = JSON.parse(savedJobsStr);
        if (Array.isArray(parsed)) setCandidateSavedJobs(parsed);
      } catch (e) {
        setCandidateSavedJobs([]);
      }
    } else if (isTestAccount(userId)) {
      if (userId === 'user-cand-001') {
        const legacySaved = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
        if (legacySaved) {
          try {
            const parsed = JSON.parse(legacySaved);
            if (Array.isArray(parsed)) setCandidateSavedJobs(parsed);
          } catch (e) {
            setCandidateSavedJobs(['job-1', 'job-5']);
          }
        } else {
          setCandidateSavedJobs(['job-1', 'job-5']);
        }
      } else if (userId === 'user-cand-002') {
        setCandidateSavedJobs(['job-nextgen-3']);
      } else if (userId === 'user-cand-003') {
        setCandidateSavedJobs(['job-nextgen-2']);
      } else {
        setCandidateSavedJobs([]);
      }
    } else {
      // Tài khoản mới đăng ký chưa thao tác: rỗng 0 việc đã lưu
      setCandidateSavedJobs([]);
    }

    // 3. Load user search history
    const savedSearchStr = localStorage.getItem(getSearchHistoryStorageKey(userId));
    if (savedSearchStr) {
      try {
        const parsed = JSON.parse(savedSearchStr);
        if (Array.isArray(parsed)) setSearchHistory(parsed);
      } catch (e) {
        setSearchHistory([]);
      }
    } else if (userId === 'user-cand-001') {
      setSearchHistory(['ReactJS', 'Frontend Developer', 'Nextstep']);
    } else {
      // Tài khoản mới đăng ký chưa thao tác: rỗng 0 lịch sử tìm kiếm
      setSearchHistory([]);
    }

    // 4. Load user notifications (Tách biệt thông báo theo vai trò và người dùng)
    const savedNotifs = localStorage.getItem(getNotificationsStorageKey(userId));
    if (savedNotifs) {
      try {
        const parsed = JSON.parse(savedNotifs);
        if (Array.isArray(parsed)) setNotifications(parsed);
      } catch (e) {
        setNotifications([]);
      }
    } else if (currentUser?.role === 'admin') {
      setNotifications(INITIAL_ADMIN_NOTIFICATIONS);
    } else if (currentUser?.role === 'recruiter') {
      setNotifications(INITIAL_RECRUITER_NOTIFICATIONS);
    } else if (userId === 'user-cand-001') {
      setNotifications(INITIAL_CANDIDATE_NOTIFICATIONS);
    } else {
      setNotifications([]);
    }

    // Đánh dấu người dùng hiện tại đã load xong toàn bộ state tương ứng
    activeLoadedUserIdRef.current = userId;
  }, [currentUser?.id]);

  // Admin KHÔNG lưu việc làm mà chỉ quản lý các thông tin tuyển dụng đăng tải!
  // Chỉ ứng viên mới có danh sách việc làm đã lưu.
  const savedJobIds = useMemo(() => {
    if (isAdmin) return [];
    return candidateSavedJobs;
  }, [isAdmin, candidateSavedJobs]);

  // Access Denied Modal state
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false);
  const [deniedPortalName, setDeniedPortalName] = useState<string>('Cổng Tuyển Dụng & Quản Trị');

  // Jobs state (mock + custom jobs)
  const [jobs, setJobs] = useState<Job[]>(() => {
    const custom = localStorage.getItem(STORAGE_KEYS.CUSTOM_JOBS);
    if (custom) {
      try {
        const parsedCustom: Job[] = JSON.parse(custom);
        // Ensure NextGen seed jobs exist
        const missing = INITIAL_JOBS.filter(ij => !parsedCustom.some(p => p.id === ij.id));
        if (missing.length > 0) return [...parsedCustom, ...missing];
        return parsedCustom.length > 0 ? parsedCustom : INITIAL_JOBS;
      } catch (e) {}
    }
    return INITIAL_JOBS;
  });

  // Recruiter views (Dành riêng cho Ứng viên Hoàng Minh: lượt xem từ VNG, Shopee, FPT)
  const [recruiterViews] = useState<RecruiterView[]>(INITIAL_RECRUITER_VIEWS);

  // Chat messages của Ứng viên với Nhà tuyển dụng
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((m: ChatMessage) => {
            if (!m.company && (m.id === 'msg-1' || m.id === 'msg-2' || (m.text && (m.text.includes('VNG') || m.text.includes('Lan Anh'))))) {
              return { ...m, company: 'VNG Corporation' };
            }
            return m;
          });
        }
      } catch (e) {}
    }
    return INITIAL_MESSAGES;
  });

  // Thông báo của Admin: Ai đã nộp CV, ai đã đăng tin tuyển dụng mới
  const [adminNotifications, setAdminNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_NOTIFICATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_ADMIN_NOTIFICATIONS;
  });

  // Thông báo phân hệ theo người dùng hiện tại (Admin, Recruiter, Candidate)
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    if (!currentUser) return [];
    const activeUserId = currentUser.id;
    const userSaved = localStorage.getItem(getNotificationsStorageKey(activeUserId));
    if (userSaved) {
      try {
        const parsed = JSON.parse(userSaved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    if (currentUser.role === 'admin') return INITIAL_ADMIN_NOTIFICATIONS;
    if (currentUser.role === 'recruiter') return INITIAL_RECRUITER_NOTIFICATIONS;
    if (activeUserId === 'user-cand-001') return INITIAL_CANDIDATE_NOTIFICATIONS;
    return [];
  });

  // Toast thông báo nổi tức thì (Real-time Toast)
  const [activeToastNotification, setActiveToastNotification] = useState<AppNotification | null>(null);

  // Modal hiển thị chi tiết thông báo cụ thể
  const [selectedNotification, setSelectedNotification] = useState<AppNotification | null>(null);

  // Tin nhắn của Admin: Nói chuyện với nhà tuyển dụng và ứng viên để giải đáp thắc mắc
  const [adminConversations, setAdminConversations] = useState<AdminChatConversation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_CONVERSATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_ADMIN_CONVERSATIONS;
  });

  // Modals
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatCompany, setChatCompany] = useState<string>('');

  // Search Filters
  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    city: 'Tất cả địa điểm',
    industry: 'Tất cả ngành nghề',
    salaryRange: 'Tất cả mức lương',
    experience: 'Tất cả kinh nghiệm',
    level: 'Tất cả cấp bậc',
    jobType: 'Tất cả hình thức',
    isUrgentOnly: false,
    isRemoteOnly: false,
    sortBy: 'relevant'
  });

  // Sync to LocalStorage (Chỉ lưu khi state bộ nhớ đã đồng bộ và thực sự thuộc về người dùng đang đăng nhập)
  useEffect(() => {
    if (!currentUser?.id) return;
    // CRITICAL GUARD: Tránh lưu đè profile của tài khoản test cũ sang tài khoản mới vừa đăng ký
    if (profile.id !== currentUser.id && `user-${profile.id}` !== currentUser.id) {
      return;
    }
    if (activeLoadedUserIdRef.current !== currentUser.id) return;

    localStorage.setItem(getProfileStorageKey(currentUser.id), JSON.stringify(profile));
    if (currentUser.id === 'user-cand-001') {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    }
  }, [profile, currentUser?.id]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    const currentId = currentUser?.id || 'guest';
    if (activeLoadedUserIdRef.current !== currentId) return;

    if (currentUser?.id) {
      localStorage.setItem(getSavedJobsStorageKey(currentUser.id), JSON.stringify(candidateSavedJobs));
    }
    if (currentUser?.id === 'user-cand-001') {
      localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(candidateSavedJobs));
    }
  }, [candidateSavedJobs, currentUser?.id]);

  useEffect(() => {
    const currentId = currentUser?.id || 'guest';
    if (activeLoadedUserIdRef.current !== currentId) return;

    if (currentUser?.id) {
      localStorage.setItem(getSearchHistoryStorageKey(currentUser.id), JSON.stringify(searchHistory));
    }
  }, [searchHistory, currentUser?.id]);

  // Quản lý lịch sử tìm kiếm: Chỉ khi người dùng thực sự gõ tìm kiếm mới lưu vào lịch sử
  const handleRecordSearch = (kw: string) => {
    const clean = kw.trim();
    if (!clean) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== clean.toLowerCase());
      return [clean, ...filtered].slice(0, 8);
    });
  };

  const handleSelectSearchHistory = (kw: string) => {
    setFilters(prev => ({ ...prev, keyword: kw }));
    handleRecordSearch(kw);
  };

  const handleClearSearchHistory = () => {
    setSearchHistory([]);
    if (currentUser?.id) {
      localStorage.removeItem(getSearchHistoryStorageKey(currentUser.id));
    }
  };

  // Lọc riêng danh sách đơn ứng tuyển của tài khoản ứng viên đang đăng nhập (Tách biệt hoàn toàn)
  const candidateApplications = useMemo(() => {
    if (!currentUser) return [];
    if (isAdmin || isRecruiter) return applications;
    return applications.filter(a => 
      a.applicantId === currentUser.id ||
      (currentUser.profileId && a.applicantId === currentUser.profileId) ||
      (currentUser.email && a.applicantEmail?.toLowerCase().trim() === currentUser.email.toLowerCase().trim()) ||
      (currentUser.fullName && a.applicantName?.toLowerCase().trim() === currentUser.fullName.toLowerCase().trim())
    );
  }, [applications, currentUser, isAdmin, isRecruiter]);

  // Tin nhắn của Ứng viên: Tách biệt hoàn toàn, người mới đăng ký sẽ không có tin nhắn của tài khoản test
  const candidateMessages = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.id === 'user-cand-001') {
      return messages.filter(m => !m.candidateId || m.candidateId === 'user-cand-001');
    }
    return messages.filter(m => m.candidateId === currentUser.id);
  }, [messages, currentUser]);

  // Lượt xem hồ sơ tách biệt theo từng ứng viên: Người mới = 0 lượt xem
  const currentRecruiterViews = useMemo(() => {
    if (currentUser?.id === 'user-cand-001') {
      return recruiterViews;
    }
    if (currentUser?.id === 'user-cand-002') {
      return [
        {
          id: 'view-thao-1',
          companyName: 'Công ty Cổ phần Công nghệ NextGen',
          companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&auto=format&fit=crop&q=80',
          viewedAt: '1 giờ trước',
          jobTitleSearched: 'Tìm kiếm ứng viên "Senior UI/UX Product Designer"',
          city: 'TP. Hồ Chí Minh'
        }
      ];
    }
    return [];
  }, [currentUser, recruiterViews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_NOTIFICATIONS, JSON.stringify(adminNotifications));
  }, [adminNotifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_CONVERSATIONS, JSON.stringify(adminConversations));
  }, [adminConversations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_NOTIFICATIONS, JSON.stringify(adminNotifications));
  }, [adminNotifications]);

  useEffect(() => {
    const currentId = currentUser?.id || 'guest';
    localStorage.setItem(getNotificationsStorageKey(currentId), JSON.stringify(notifications));
  }, [notifications, currentUser?.id]);

  // Xử lý khi người dùng bấm vào thông báo cụ thể -> DẪN ĐẾN THÔNG TIN THÔNG BÁO CỤ THỂ
  const handleSelectNotification = (notif: AppNotification) => {
    // 1. Đánh dấu thông báo này là đã đọc
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isUnread: false } : n));
    setAdminNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isUnread: false } : n));

    // 2. Mở cửa sổ Modal Chi Tiết Thông Báo cụ thể
    setSelectedNotification(notif);

    // 3. Nếu thông báo dẫn đến Tin tuyển dụng cụ thể:
    if (notif.jobId || notif.targetType === 'job') {
      const targetJob = jobs.find(j => j.id === notif.jobId || j.title.toLowerCase().includes(notif.targetName?.toLowerCase() || ''));
      if (targetJob) {
        setSelectedJob(targetJob);
      }
    } 
    // 4. Nếu thông báo dẫn đến Hồ sơ ứng tuyển cụ thể:
    else if (notif.applicationId || notif.targetType === 'application') {
      if (isAdmin) {
        handleNavigateToTab('admin');
      } else if (isRecruiter) {
        handleNavigateToTab('recruiter_portal');
      } else {
        handleNavigateToTab('applications');
      }
    }
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
    setAdminNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SYSTEM_SETTINGS, JSON.stringify(systemSettings));
  }, [systemSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_JOBS, JSON.stringify(jobs));
  }, [jobs]);

  // Open Auth Modal helper
  const handleOpenAuthModal = (mode: 'login' | 'register' = 'login', method: 'all' | 'phone' | 'email' = 'all') => {
    setAuthModalMode(mode);
    setAuthModalMethod(method);
    setIsAuthModalOpen(true);
  };

  // Guard against unauthorized access to admin and recruiter_portal
  useEffect(() => {
    if (activeTab === 'admin' && !isAdmin) {
      setActiveTab('jobs');
    } else if (activeTab === 'recruiter_portal' && !isAdmin && !isRecruiter) {
      setActiveTab('jobs');
    }
  }, [isAdmin, isRecruiter, activeTab]);

  // Switch to tab check with strict role separation
  const handleNavigateToTab = (tab: 'jobs' | 'profile' | 'applications' | 'saved' | 'salary' | 'recruiter_portal' | 'admin') => {
    // BẢNG QUẢN TRỊ ADMIN CHỈ DÀNH CHO ADMIN
    if (tab === 'admin' && !isAdmin) {
      setDeniedPortalName('Bảng Quản Trị Hệ Thống (Admin)');
      setShowAccessDeniedModal(true);
      return;
    }

    // CỔNG TUYỂN DỤNG CHỈ DÀNH CHO NHÀ TUYỂN DỤNG & ADMIN
    if (tab === 'recruiter_portal' && !isAdmin && !isRecruiter) {
      setDeniedPortalName('Cổng Đăng Tin Tuyển Dụng Dành Cho Doanh Nghiệp');
      setShowAccessDeniedModal(true);
      return;
    }

    // NẾU CHƯA ĐĂNG NHẬP MÀ TRUY CẬP VÀO HỒ SƠ, ĐÃ ỨNG TUYỂN, VIỆC ĐÃ LƯU -> MỞ MODAL ĐĂNG NHẬP
    if (!isAuthenticated && (tab === 'profile' || tab === 'applications' || tab === 'saved')) {
      handleOpenAuthModal('login', 'all');
      setPendingActionAfterAuth(() => () => {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      return;
    }

    // ADMIN VÀ NHÀ TUYỂN DỤNG ĐIỀU HƯỚNG TAB
    if (tab === 'saved' && isAdmin) {
      setActiveTab('admin');
      return;
    }

    // Đối với Nhà tuyển dụng: tab 'saved' là "Thống Kê Tuyển Dụng" (Biểu đồ lượt xem, apply, pass CV, phỏng vấn, nhận việc) -> Hoàn toàn cho phép truy cập!
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter & Search Logic
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Keyword filter
      if (filters.keyword.trim()) {
        const kw = filters.keyword.toLowerCase().trim();
        const inTitle = job.title.toLowerCase().includes(kw);
        const inCompany = job.company.toLowerCase().includes(kw);
        const inTags = job.tags.some(t => t.toLowerCase().includes(kw));
        const inSkills = job.requiredSkills.some(s => s.toLowerCase().includes(kw));
        if (!inTitle && !inCompany && !inTags && !inSkills) {
          return false;
        }
      }

      // City filter
      if (filters.city !== 'Tất cả địa điểm') {
        if (filters.city === 'Toàn quốc') {
          // Allow all
        } else if (job.city !== filters.city && job.location !== filters.city) {
          return false;
        }
      }

      // Industry filter
      if (filters.industry !== 'Tất cả ngành nghề') {
        if (job.industry !== filters.industry) {
          return false;
        }
      }

      // Experience filter
      if (filters.experience !== 'Tất cả kinh nghiệm') {
        if (job.experience !== filters.experience) {
          return false;
        }
      }

      // Level filter
      if (filters.level !== 'Tất cả cấp bậc') {
        if (job.level !== filters.level) {
          return false;
        }
      }

      // Job Type filter
      if (filters.jobType !== 'Tất cả hình thức') {
        if (job.jobType !== filters.jobType) {
          return false;
        }
      }

      // Urgent only
      if (filters.isUrgentOnly && !job.isUrgent) {
        return false;
      }

      // Remote only
      if (filters.isRemoteOnly && job.jobType !== 'Remote' && !job.tags.includes('Remote')) {
        return false;
      }

      // Salary Range filter
      if (filters.salaryRange !== 'Tất cả mức lương') {
        const min = job.minSalary || 0;
        const max = job.maxSalary || min;

        if (filters.salaryRange === 'Dưới 10 triệu') {
          if (min > 10) return false;
        } else if (filters.salaryRange === '10 - 15 triệu') {
          if (max < 10 || min > 15) return false;
        } else if (filters.salaryRange === '15 - 25 triệu') {
          if (max < 15 || min > 25) return false;
        } else if (filters.salaryRange === '25 - 40 triệu') {
          if (max < 25 || min > 40) return false;
        } else if (filters.salaryRange === 'Trên 40 triệu') {
          if (max < 40) return false;
        } else if (filters.salaryRange === 'Thỏa thuận') {
          if (job.salaryType !== 'negotiable') return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'newest') {
        return b.id.localeCompare(a.id);
      } else if (filters.sortBy === 'salary_high') {
        const maxA = a.maxSalary || a.minSalary || 0;
        const maxB = b.maxSalary || b.minSalary || 0;
        return maxB - maxA;
      } else if (filters.sortBy === 'deadline') {
        return a.deadline.localeCompare(b.deadline);
      }
      // 'relevant' default: prioritize HOT and Urgent
      const weightA = (a.isHot ? 2 : 0) + (a.isUrgent ? 1 : 0);
      const weightB = (b.isHot ? 2 : 0) + (b.isUrgent ? 1 : 0);
      return weightB - weightA;
    });
  }, [jobs, filters]);

  // Saved Jobs list
  const savedJobs = useMemo(() => {
    return jobs.filter(j => savedJobIds.includes(j.id));
  }, [jobs, savedJobIds]);

  // Handlers
  const handleToggleSaveJob = (jobId: string) => {
    // Admin không lưu việc làm!
    if (isAdmin) {
      alert('Tài khoản Quản trị viên (Admin) không lưu việc làm. Bạn đang quản lý toàn bộ các thông tin tuyển dụng đăng tải trên hệ thống.');
      return;
    }

    if (!isAuthenticated) {
      handleOpenAuthModal('login', 'all');
      setPendingActionAfterAuth(() => () => {
        setCandidateSavedJobs(prev => prev.includes(jobId) ? prev : [...prev, jobId]);
      });
      return;
    }

    setCandidateSavedJobs(prev => {
      if (prev.includes(jobId)) {
        return prev.filter(id => id !== jobId);
      } else {
        return [...prev, jobId];
      }
    });
  };

  const handleStartApplyJob = (job: Job) => {
    if (isAdmin) {
      // Nếu là Admin thì mở trực tiếp Bảng Quản Trị để quản lý tin này
      setActiveTab('admin');
      return;
    }

    if (isRecruiter) {
      alert('Bạn đang đăng nhập với tư cách Nhà tuyển dụng. Chức năng nộp hồ sơ ứng tuyển dành riêng cho Ứng viên tìm việc.');
      return;
    }

    if (!isAuthenticated) {
      handleOpenAuthModal('login', 'all');
      setPendingActionAfterAuth(() => () => setApplyJob(job));
      return;
    }
    setApplyJob(job);
  };

  const handleResetFilters = () => {
    setFilters({
      keyword: '',
      city: 'Tất cả địa điểm',
      industry: 'Tất cả ngành nghề',
      salaryRange: 'Tất cả mức lương',
      experience: 'Tất cả kinh nghiệm',
      level: 'Tất cả cấp bậc',
      jobType: 'Tất cả hình thức',
      isUrgentOnly: false,
      isRemoteOnly: false,
      sortBy: 'relevant'
    });
  };

  const handlePostNewJob = (newJob: Job) => {
    setJobs(prev => [newJob, ...prev]);

    // Tạo thông báo mới cho Admin & Hệ thống: Doanh nghiệp đã đăng tin tuyển dụng mới
    const notif: AppNotification = {
      id: `admin-notif-${Date.now()}`,
      type: 'job_posted',
      title: 'Tin tuyển dụng mới đăng tải',
      senderName: newJob.company,
      senderAvatar: newJob.companyLogo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&auto=format&fit=crop&q=80',
      content: `Doanh nghiệp ${newJob.company} vừa đăng tin tuyển dụng mới: "${newJob.title}" (${newJob.salaryText}).`,
      targetName: newJob.title,
      timestamp: 'Vừa xong',
      isUnread: true,
      targetType: 'job',
      jobId: newJob.id,
      companyName: newJob.company,
      salaryText: newJob.salaryText
    };
    setAdminNotifications(prev => [notif, ...prev]);
    setNotifications(prev => [notif, ...prev]);
    setActiveToastNotification(notif);
  };

  const handleUpdateApplicationStatus = (appId: string, newStatus: ApplicationStatus, notes?: string, interviewDate?: string) => {
    let updatedApp: Application | undefined;

    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        updatedApp = {
          ...app,
          status: newStatus,
          notes: notes !== undefined ? notes : app.notes,
          interviewDate: interviewDate !== undefined ? interviewDate : app.interviewDate
        };
        return updatedApp;
      }
      return app;
    }));

    const app = updatedApp || applications.find(a => a.id === appId);
    if (!app) return;

    // Tạo thông báo đến Ứng viên về trạng thái mới của hồ sơ
    let notifTitle = 'Cập nhật trạng thái hồ sơ ứng tuyển';
    let notifContent = `Nhà tuyển dụng ${app.company} vừa cập nhật trạng thái hồ sơ ứng tuyển vị trí "${app.jobTitle}" của bạn.`;
    let notifType: NotificationType = 'application_status';

    if (newStatus === 'interview') {
      notifTitle = `📅 Thư mời phỏng vấn từ ${app.company}`;
      notifContent = notes 
        ? `Chúc mừng bạn! ${app.company} đã duyệt hồ sơ và trân trọng mời bạn phỏng vấn vị trí "${app.jobTitle}". Chi tiết: ${notes}`
        : `Chúc mừng bạn! ${app.company} đã duyệt hồ sơ và trân trọng mời bạn phỏng vấn vị trí "${app.jobTitle}". Vui lòng kiểm tra lịch hẹn.`;
      notifType = 'interview_invitation';
    } else if (newStatus === 'offered') {
      notifTitle = `🎉 Chúc mừng bạn đã trúng tuyển tại ${app.company}!`;
      notifContent = `Doanh nghiệp ${app.company} thông báo bạn đã trúng tuyển vị trí "${app.jobTitle}". Bộ phận nhân sự sẽ liên hệ bạn để hoàn tất thủ tục nhận việc.`;
    } else if (newStatus === 'viewed') {
      notifTitle = `🏢 ${app.company} đã xem hồ sơ của bạn`;
      notifContent = `Nhà tuyển dụng ${app.company} đã xem hồ sơ ứng tuyển vị trí "${app.jobTitle}" của bạn.`;
      notifType = 'recruiter_view';
    } else if (newStatus === 'rejected') {
      notifTitle = `Thông báo kết quả ứng tuyển từ ${app.company}`;
      notifContent = `Ban tuyển dụng ${app.company} cảm ơn bạn đã ứng tuyển vị trí "${app.jobTitle}". Rất tiếc hiện tại hồ sơ chưa phù hợp với tiêu chí tuyển dụng.`;
    }

    const appStatusNotif: AppNotification = {
      id: `notif-status-${Date.now()}`,
      type: notifType,
      title: notifTitle,
      senderName: app.company,
      senderAvatar: app.companyLogo,
      content: notifContent,
      targetName: `${app.company} • ${app.jobTitle}`,
      timestamp: 'Vừa xong',
      isUnread: true,
      targetType: 'application',
      applicationId: app.id,
      jobId: app.jobId,
      companyName: app.company,
      interviewDate: app.interviewDate,
      notes: app.notes
    };

    setNotifications(prev => [appStatusNotif, ...prev]);
    setActiveToastNotification(appStatusNotif);

    // Chỉ khi Nhà tuyển dụng duyệt và chính thức lên lịch phỏng vấn, lúc này mới tạo tin nhắn mời phỏng vấn!
    if (newStatus === 'interview') {
      const interviewNoticeText = notes 
        ? `📅 [THÔNG BÁO MỜI PHỎNG VẤN]\nChào bạn! Ban tuyển dụng ${app.company} thông báo hồ sơ ứng tuyển vị trí "${app.jobTitle}" của bạn đã đạt yêu cầu sơ tuyển. Chúng mình trân trọng mời bạn tham gia buổi phỏng vấn.\n\n📌 Chi tiết lịch hẹn: ${notes}`
        : `📅 [THÔNG BÁO MỜI PHỎNG VẤN]\nChào bạn! Ban tuyển dụng ${app.company} thông báo hồ sơ ứng tuyển vị trí "${app.jobTitle}" của bạn đã đạt yêu cầu sơ tuyển. Chúng mình trân trọng mời bạn tham gia buổi phỏng vấn trao đổi chi tiết hơn.`;

      const interviewMsg: ChatMessage = {
        id: `msg-interview-${Date.now()}`,
        sender: 'recruiter',
        senderName: `Tuyển dụng ${app.company}`,
        avatar: app.companyLogo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&auto=format&fit=crop&q=80',
        text: interviewNoticeText,
        timestamp: 'Vừa xong',
        jobTitle: app.jobTitle,
        company: app.company,
        candidateId: app.applicantId || 'user-cand-001'
      };
      setMessages(prev => [...prev, interviewMsg]);
    }
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
  };

  const handleWithdrawApplication = (appId: string) => {
    setApplications(prev => prev.filter(a => a.id !== appId));
  };

  const handleOpenChatWithRecruiter = (company: string, jobTitle?: string) => {
    setChatCompany(company);
    setIsChatOpen(true);
  };

  const handleSelectChatConversation = (conv: ChatConversationItem) => {
    if (isAdmin) {
      setIsChatOpen(true);
      return;
    }

    if (isRecruiter) {
      if (conv.type === 'admin_support') {
        setChatCompany('Ban Quản Trị Nextstep');
        setIsChatOpen(true);
      } else if (conv.applicantName) {
        // Nhà tuyển dụng mở chat với ứng viên hoặc xem hồ sơ
        setChatCompany(conv.applicantName);
        setIsChatOpen(true);
      } else if (conv.applicantId) {
        setChatCompany(conv.applicantId);
        setIsChatOpen(true);
      } else if (conv.id) {
        setChatCompany(conv.id);
        setIsChatOpen(true);
      } else {
        setChatCompany('');
        setIsChatOpen(true);
      }
      return;
    }

    // Ứng viên chọn đoạn chat
    if (conv.type === 'admin_support' || conv.companyName === 'Ban Quản Trị Nextstep') {
      setChatCompany('Ban Quản Trị Nextstep');
      setIsChatOpen(true);
    } else if (conv.companyName) {
      setChatCompany(conv.companyName);
      setIsChatOpen(true);
    } else {
      setChatCompany('');
      setIsChatOpen(true);
    }
  };

  // Admin gửi tin nhắn giải đáp thắc mắc cho Nhà tuyển dụng hoặc Ứng viên
  const handleAdminSendMessage = (conversationId: string, text: string) => {
    const adminMsg = {
      id: `msg-adm-${Date.now()}`,
      sender: 'admin' as const,
      senderName: 'Ban Quản Trị Nextstep',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
      text,
      timestamp: 'Vừa xong'
    };

    setAdminConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          lastMessage: text,
          lastTimestamp: 'Vừa xong',
          messages: [...c.messages, adminMsg]
        };
      }
      return c;
    }));

    // Mô phỏng đối tác (Nhà tuyển dụng / Ứng viên) phản hồi cảm ơn lại sau 1.5s
    setTimeout(() => {
      setAdminConversations(prev => prev.map(c => {
        if (c.id === conversationId) {
          const isRecruiter = c.partnerType === 'recruiter';
          const replies = isRecruiter ? [
            'Dạ cảm ơn Ban Quản Trị Nextstep đã hỗ trợ giải đáp rất nhanh và tận tình ạ!',
            'Cảm ơn Admin nhiều nhé, bên mình đã thực hiện theo hướng dẫn và hoàn tất rồi!',
            'Vâng bên mình đã nắm rõ thông tin, cảm ơn đội ngũ hỗ trợ Nextstep rất nhiều!'
          ] : [
            'Dạ em cảm ơn Ban Quản Trị Nextstep đã giải đáp thắc mắc cho em ạ!',
            'Em đã hiểu và làm theo hướng dẫn được rồi ạ, em cảm ơn admin nhiều!',
            'Tuyệt vời quá, em cảm ơn admin đã hỗ trợ ứng viên nhanh chóng như vậy ạ!'
          ];
          const replyText = replies[Math.floor(Math.random() * replies.length)];

          const partnerReply = {
            id: `msg-adm-reply-${Date.now()}`,
            sender: 'partner' as const,
            senderName: c.partnerName,
            avatar: c.partnerAvatar,
            text: replyText,
            timestamp: 'Vừa xong'
          };

          return {
            ...c,
            lastMessage: replyText,
            lastTimestamp: 'Vừa xong',
            messages: [...c.messages, partnerReply]
          };
        }
        return c;
      }));
    }, 1500);
  };

  // Nhà Tuyển Dụng gửi tin nhắn tới Ban Quản Trị Nextstep
  const handleRecruiterSendMessage = (conversationId: string, text: string) => {
    const recruiterMsg = {
      id: `msg-rec-${Date.now()}`,
      sender: 'partner' as const,
      senderName: currentUser?.fullName || 'Vũ Thu Trang (NextGen Tech)',
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&auto=format&fit=crop&q=80',
      text,
      timestamp: 'Vừa xong'
    };

    setAdminConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          lastMessage: text,
          lastTimestamp: 'Vừa xong',
          messages: [...c.messages, recruiterMsg]
        };
      }
      return c;
    }));

    // Ban Quản Trị Nextstep tự động phản hồi sau 1.2s
    setTimeout(() => {
      setAdminConversations(prev => prev.map(c => {
        if (c.id === conversationId) {
          const adminReplies = [
            'Chào chị Trang và Quý Doanh nghiệp NextGen! Ban Quản Trị Nextstep đã tiếp nhận yêu cầu và bộ phận chuyên môn đang hỗ trợ xử lý ngay ạ.',
            'Dạ Ban Quản Trị Nextstep xin chào! Tin tuyển dụng của NextGen Tech đã được ưu tiên kiểm duyệt và hiển thị nổi bật trên toàn hệ thống rồi nhé ạ!',
            'Chào chị Trang, Admin Nextstep đã ghi nhận yêu cầu và sẽ hỗ trợ kích hoạt đầy đủ các quyền lợi cho tài khoản nhà tuyển dụng của công ty ạ.'
          ];
          const replyText = adminReplies[Math.floor(Math.random() * adminReplies.length)];
          const adminReply = {
            id: `msg-adm-reply-to-rec-${Date.now()}`,
            sender: 'admin' as const,
            senderName: 'Ban Quản Trị Nextstep',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
            text: replyText,
            timestamp: 'Vừa xong'
          };
          return {
            ...c,
            lastMessage: replyText,
            lastTimestamp: 'Vừa xong',
            messages: [...c.messages, adminReply]
          };
        }
        return c;
      }));
    }, 1200);
  };

  // Cập nhật chỉnh sửa bài đăng tuyển dụng
  const handleUpdateJob = (updatedJob: Job) => {
    setJobs(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j));
  };

  // Auth success callback trigger
  const handleAuthSuccess = () => {
    if (pendingActionAfterAuth) {
      pendingActionAfterAuth();
      setPendingActionAfterAuth(null);
    }
  };

  // =========================================================================
  // VIEW MODE A: ADMIN PORTAL FULL VIEW (CHẠY SONG SONG VỚI WEB CHÍNH)
  // =========================================================================
  if (activeTab === 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <AdminPortal
          jobs={jobs}
          onUpdateJobs={setJobs}
          applications={applications}
          onUpdateApplications={setApplications}
          candidateProfile={profile}
          onBackToMainWeb={() => setActiveTab('jobs')}
          systemSettings={systemSettings}
          onUpdateSystemSettings={setSystemSettings}
        />

        {/* Global Auth Modal for switching accounts */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authModalMode}
          initialMethod={authModalMethod}
          onSuccess={handleAuthSuccess}
        />

        {/* Real-time Toast Notification */}
        <NotificationToast
          notification={activeToastNotification}
          onClose={() => setActiveToastNotification(null)}
          onViewDetail={handleSelectNotification}
        />

        {/* Notification Detail Modal */}
        <NotificationDetailModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
          onOpenJobDetail={(job) => {
            setSelectedNotification(null);
            setSelectedJob(job);
          }}
          onOpenApplicationDetail={(app) => {
            setSelectedNotification(null);
            handleNavigateToTab('applications');
          }}
          onOpenChat={(company, jobTitle) => {
            setSelectedNotification(null);
            handleOpenChatWithRecruiter(company, jobTitle);
          }}
          onNavigateToTab={(tab) => {
            setSelectedNotification(null);
            handleNavigateToTab(tab);
          }}
          allJobs={jobs}
          allApplications={applications}
          onMarkAsRead={(notifId) => {
            setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isUnread: false } : n));
            setAdminNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isUnread: false } : n));
            setSelectedNotification(prev => prev?.id === notifId ? { ...prev, isUnread: false } : prev);
          }}
        />
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE B: MAIN CANDIDATE / RECRUITER WEBSITE (GIAO DIỆN CHÍNH)
  // =========================================================================
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigateToTab}
        profile={profile}
        applicationsCount={isRecruiter || isAdmin ? applications.length : candidateApplications.length}
        savedCount={savedJobIds.length}
        recruiterViews={currentRecruiterViews}
        messages={isRecruiter || isAdmin ? messages : candidateMessages}
        onOpenChat={() => { setChatCompany(''); setIsChatOpen(true); }}
        onOpenAuthModal={handleOpenAuthModal}
        systemSettings={systemSettings}
        adminNotifications={adminNotifications}
        adminUnreadChatCount={adminConversations.reduce((sum, c) => sum + c.unreadCount, 0)}
        notifications={notifications}
        onSelectNotification={handleSelectNotification}
        onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
        applications={isRecruiter || isAdmin ? applications : candidateApplications}
        adminConversations={adminConversations}
        onSelectConversation={handleSelectChatConversation}
      />

      {/* Broadcast Announcement Bar from Admin if available */}
      {systemSettings.systemAnnouncement && (
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-[#0D2B52] text-white text-xs py-2 px-4 shadow-sm flex items-center justify-center gap-2 text-center">
          <Megaphone className="w-3.5 h-3.5 text-yellow-300 shrink-0 animate-bounce" />
          <span className="font-semibold">{systemSettings.systemAnnouncement}</span>
        </div>
      )}

      {/* Main Content Areas */}
      <main className="flex-1">
        {/* VIEW 1: JOB SEARCH & LISTINGS */}
        {activeTab === 'jobs' && (
          <div>
            {/* Search Hero with Filter Bar */}
            <JobSearchHero
              filters={filters}
              setFilters={setFilters}
              totalJobsFound={filteredJobs.length}
              onResetFilters={handleResetFilters}
              searchHistory={searchHistory}
              onRecordSearch={handleRecordSearch}
              onSelectSearchHistory={handleSelectSearchHistory}
              onClearSearchHistory={handleClearSearchHistory}
            />

            {/* Content Container */}
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Main Job Cards Feed */}
                <div className="lg:col-span-8">
                  <JobList
                    jobs={filteredJobs}
                    onSelectJob={(job) => setSelectedJob(job)}
                    onQuickApply={(job) => handleStartApplyJob(job)}
                    savedJobIds={savedJobIds}
                    onToggleSaveJob={handleToggleSaveJob}
                    filters={filters}
                    setFilters={setFilters}
                    profile={profile}
                  />
                </div>

                {/* Right Sticky Sidebar: Profile / Admin Control Box */}
                <div className="lg:col-span-4 space-y-4">
                  {isAdmin ? (
                    /* ADMIN CONTROL SIDEBAR: Khi đăng nhập Admin, không hiển thị hồ sơ tìm việc hay việc đã lưu của ứng viên */
                    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-6 border border-purple-800/40 shadow-xl space-y-5">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80'}
                            alt="Admin"
                            className="w-13 h-13 rounded-2xl object-cover ring-2 ring-purple-500 shadow-md"
                          />
                          <span className="absolute -bottom-1 -right-1 p-1 bg-purple-600 rounded-full text-white ring-2 ring-slate-900">
                            <ShieldCheck className="w-3 h-3" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300 border border-purple-400/30 inline-block mb-1">
                            Super Admin
                          </span>
                          <h4 className="text-sm font-bold text-white truncate">
                            {currentUser?.fullName || 'Ban Quản Trị Hệ Thống'}
                          </h4>
                          <p className="text-xs text-purple-200/80 truncate">
                            {currentUser?.email || 'admin@nextstep.vn'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 pt-1 border-t border-purple-800/40">
                        <h5 className="text-[11px] font-black uppercase tracking-wider text-purple-300">
                          Thống Kê Tuyển Dụng Hệ Thống
                        </h5>
                        <div className="grid grid-cols-2 gap-2 text-center text-xs">
                          <div 
                            onClick={() => handleNavigateToTab('recruiter_portal')}
                            className="p-3 rounded-2xl bg-purple-900/40 hover:bg-purple-900/60 border border-purple-700/40 cursor-pointer transition-all"
                          >
                            <span className="text-2xl font-black text-white">{jobs.length}</span>
                            <span className="block text-[11px] font-semibold text-purple-200 mt-0.5">Tin tuyển dụng</span>
                          </div>
                          <div 
                            onClick={() => handleNavigateToTab('admin')}
                            className="p-3 rounded-2xl bg-indigo-900/40 hover:bg-indigo-900/60 border border-indigo-700/40 cursor-pointer transition-all"
                          >
                            <span className="text-2xl font-black text-white">{applications.length}</span>
                            <span className="block text-[11px] font-semibold text-indigo-200 mt-0.5">Đơn ứng tuyển</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-1">
                        <button
                          onClick={() => handleNavigateToTab('recruiter_portal')}
                          className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-black rounded-xl text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                        >
                          <Building2 className="w-4 h-4" />
                          <span>Cổng Đăng Tin Tuyển Dụng Mới</span>
                        </button>

                        <button
                          onClick={() => handleNavigateToTab('admin')}
                          className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Vào Bảng Quản Trị Hệ Thống</span>
                        </button>
                      </div>

                      <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-800/30 text-[11px] text-purple-200/90 leading-relaxed">
                        💡 <em>Chế độ Quản trị viên: Bạn có quyền quản lý, kiểm duyệt tin đăng và hồ sơ ứng viên. Admin không sử dụng tính năng lưu việc làm của ứng viên.</em>
                      </div>
                    </div>
                  ) : isRecruiter ? (
                    /* RECRUITER CONTROL SIDEBAR: Khi đăng nhập Nhà tuyển dụng */
                    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 border border-blue-800/40 shadow-xl space-y-5">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&auto=format&fit=crop&q=80'}
                            alt="Recruiter"
                            className="w-13 h-13 rounded-2xl object-cover ring-2 ring-blue-500 shadow-md"
                          />
                          <span className="absolute -bottom-1 -right-1 p-1 bg-blue-600 rounded-full text-white ring-2 ring-slate-900">
                            <Building2 className="w-3 h-3" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-300 border border-blue-400/30 inline-block mb-1">
                            Nhà Tuyển Dụng
                          </span>
                          <h4 className="text-sm font-bold text-white truncate">
                            {currentUser?.fullName || 'Đại diện Doanh nghiệp'}
                          </h4>
                          <p className="text-xs text-blue-200/90 font-medium truncate">
                            {currentUser?.companyName || 'Công ty Tuyển dụng'}
                          </p>
                          {currentUser?.recruiterPosition && (
                            <p className="text-[11px] text-slate-300 truncate">
                              {currentUser.recruiterPosition}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 pt-1 border-t border-blue-800/40">
                        <div className="flex items-center justify-between">
                          <h5 className="text-[11px] font-black uppercase tracking-wider text-blue-300">
                            Thống Kê Tuyển Dụng
                          </h5>
                          <button
                            onClick={() => handleNavigateToTab('saved')}
                            className="text-[10px] font-bold text-teal-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span>Xem biểu đồ</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-center text-xs">
                          <div 
                            onClick={() => handleNavigateToTab('saved')}
                            className="p-3 rounded-2xl bg-blue-900/40 hover:bg-blue-900/60 border border-blue-700/40 cursor-pointer transition-all group"
                            title="Xem biểu đồ phân tích tuyển dụng"
                          >
                            <span className="text-2xl font-black text-white group-hover:text-teal-300 transition-colors">{jobs.length}</span>
                            <span className="block text-[11px] font-semibold text-blue-200 mt-0.5">Việc làm hiện có</span>
                          </div>
                          <div 
                            onClick={() => handleNavigateToTab('applications')}
                            className="p-3 rounded-2xl bg-indigo-900/40 hover:bg-indigo-900/60 border border-indigo-700/40 cursor-pointer transition-all group"
                            title="Xem danh sách hồ sơ ứng tuyển"
                          >
                            <span className="text-2xl font-black text-white group-hover:text-indigo-300 transition-colors">{applications.length}</span>
                            <span className="block text-[11px] font-semibold text-indigo-200 mt-0.5">Hồ sơ đã nộp</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-1">
                        <button
                          onClick={() => handleNavigateToTab('saved')}
                          className="w-full py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                        >
                          <BarChart3 className="w-4 h-4 text-purple-200" />
                          <span>Mở Biểu Đồ Thống Kê Tuyển Dụng</span>
                        </button>

                        <button
                          onClick={() => handleNavigateToTab('recruiter_portal')}
                          className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                        >
                          <Building2 className="w-4 h-4" />
                          <span>Mở Cổng Quản Lý &amp; Đăng Tin</span>
                        </button>
                      </div>

                      <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800/30 text-[11px] text-blue-200/90 leading-relaxed">
                        💡 <em>Chế độ Doanh nghiệp: Bạn có thể đăng tin tuyển dụng mới không giới hạn, tìm kiếm hồ sơ ứng viên và nhận đơn ứng tuyển trực tiếp.</em>
                      </div>
                    </div>
                  ) : !isAuthenticated ? (
                    /* GUEST SIDEBAR: Khách mới truy cập / Chưa đăng nhập */
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D2B52] to-[#137E8F] flex items-center justify-center text-white shadow-xs">
                          <User className="w-6 h-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-slate-900 leading-tight">
                            Chào bạn đến Nextstep!
                          </h4>
                          <p className="text-xs text-[#137E8F] font-semibold mt-0.5">
                            Việc làm &amp; Quản lý hồ sơ
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        Đăng nhập hoặc tạo tài khoản mới để nộp hồ sơ 1 chạm, lưu việc làm yêu thích và kết nối trực tiếp với nhà tuyển dụng.
                      </p>

                      <div className="space-y-2 pt-1">
                        <button
                          id="sidebar-guest-login-btn"
                          onClick={() => handleOpenAuthModal('login', 'all')}
                          className="w-full py-2.5 bg-gradient-to-r from-[#0D2B52] to-[#137E8F] hover:opacity-95 text-white font-bold rounded-xl text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                        >
                          <LogIn className="w-4 h-4" />
                          <span>Đăng Nhập Ngay</span>
                        </button>

                        <button
                          id="sidebar-guest-register-btn"
                          onClick={() => handleOpenAuthModal('register', 'all')}
                          className="w-full py-2.5 bg-teal-50 hover:bg-teal-100/80 text-[#0D2B52] font-bold rounded-xl text-xs transition-colors cursor-pointer border border-teal-200/80 flex items-center justify-center gap-2"
                        >
                          <UserPlus className="w-4 h-4 text-[#137E8F]" />
                          <span>Tạo Tài Khoản Mới</span>
                        </button>
                      </div>

                      <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-600">
                        <div className="flex items-center gap-2 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>Tạo CV Online chuẩn chuyên nghiệp</span>
                        </div>
                        <div className="flex items-center gap-2 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>Theo dõi trạng thái duyệt đơn tức thì</span>
                        </div>
                        <div className="flex items-center gap-2 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>Gợi ý việc làm phù hợp hàng ngày</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* CANDIDATE SIDEBAR: Hồ sơ ứng viên & Việc làm đã nộp / đã lưu */
                    <>
                      {/* Candidate Quick Profile Card */}
                      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={currentUser ? currentUser.avatar : profile.avatar}
                            alt={currentUser ? currentUser.fullName : profile.fullName}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-bold text-slate-900 truncate">
                              {currentUser ? currentUser.fullName : profile.fullName}
                            </h4>
                            <p className="text-xs text-[#137E8F] font-semibold truncate">
                              {profile.title}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-600">Độ mạnh hồ sơ:</span>
                            <span className="text-[#137E8F] font-bold">{profile.profileStrength}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#0D2B52] to-[#137E8F] h-full rounded-full transition-all"
                              style={{ width: `${profile.profileStrength}%` }}
                            ></div>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500">
                          Hồ sơ của bạn đang ở trạng thái <strong>{profile.isLookingForJob ? 'Bật tìm việc' : 'Ẩn tìm việc'}</strong>. Nhà tuyển dụng có thể chủ động liên hệ.
                        </p>

                        <button
                          id="sidebar-edit-profile-btn"
                          onClick={() => handleNavigateToTab('profile')}
                          className="w-full py-2.5 bg-teal-50 hover:bg-teal-100/80 text-[#0D2B52] font-bold rounded-xl text-xs transition-colors cursor-pointer border border-teal-200/60"
                        >
                          Cập nhật hồ sơ &amp; CV online
                        </button>
                      </div>

                      {/* Quick Application Status Box */}
                      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                          Tiến độ ứng tuyển của bạn
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-center text-xs">
                          <div 
                            onClick={() => handleNavigateToTab('applications')}
                            className="p-3 rounded-xl bg-teal-50/70 border border-teal-100 cursor-pointer hover:bg-teal-100/70 transition-colors"
                          >
                            <span className="text-xl font-black text-[#0D2B52]">{candidateApplications.length}</span>
                            <span className="block text-[11px] font-semibold text-slate-600 mt-0.5">Việc đã nộp</span>
                          </div>
                          <div 
                            onClick={() => handleNavigateToTab('saved')}
                            className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 cursor-pointer hover:bg-amber-100/70 transition-colors"
                          >
                            <span className="text-xl font-black text-amber-700">{savedJobIds.length}</span>
                            <span className="block text-[11px] font-semibold text-slate-600 mt-0.5">Việc đã lưu</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Gross to Net Quick Banner */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0D2B52] via-[#103D69] to-[#137E8F] text-white shadow-md space-y-2.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-teal-200">
                      Tiện ích Nextstep
                    </span>
                    <h4 className="text-sm font-bold">Tra cứu mức lương &amp; Tính Net</h4>
                    <p className="text-xs text-teal-100/85 leading-relaxed">
                      Biết chính xác số tiền thực nhận sau bảo hiểm &amp; thuế thu nhập cá nhân trước khi đàm phán hợp đồng.
                    </p>
                    <button
                      onClick={() => handleNavigateToTab('salary')}
                      className="w-full py-2 bg-white text-[#0D2B52] hover:bg-teal-50 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Mở công cụ tính lương
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: PROFILE MANAGEMENT */}
        {activeTab === 'profile' && (
          !isAuthenticated ? (
            <GuestAuthPrompt
              title="Quản Lý Hồ Sơ & CV Online"
              description="Vui lòng đăng nhập hoặc tạo tài khoản mới để tạo CV chuyên nghiệp, lưu thông tin học vấn, kinh nghiệm và nhận cơ hội việc làm hấp dẫn."
              icon={<FileText className="w-8 h-8" />}
              onLogin={() => handleOpenAuthModal('login', 'all')}
              onRegister={() => handleOpenAuthModal('register', 'all')}
              onGoHome={() => handleNavigateToTab('jobs')}
            />
          ) : isRecruiter ? (
            <RecruiterProfileManager
              jobs={jobs.filter(j => j.company.toLowerCase().includes(currentUser?.companyName?.toLowerCase() || 'nextgen'))}
              onNavigateToTab={handleNavigateToTab}
            />
          ) : (
            <ProfileManager
              profile={
                (!isTestAccount(currentUser?.id) && profile.id !== currentUser?.id && currentUser)
                  ? createCleanCandidateProfile(currentUser)
                  : profile
              }
              onUpdateProfile={setProfile}
            />
          )
        )}

        {/* VIEW 3: APPLICATION TRACKER / RECRUITER APPLICANT MANAGEMENT */}
        {activeTab === 'applications' && (
          !isAuthenticated ? (
            <GuestAuthPrompt
              title="Theo Dõi Hồ Sơ Ứng Tuyển"
              description="Vui lòng đăng nhập hoặc đăng ký tài khoản để theo dõi trạng thái các công việc bạn đã nộp đơn, nhận thư mời phỏng vấn và phản hồi từ nhà tuyển dụng."
              icon={<Briefcase className="w-8 h-8" />}
              onLogin={() => handleOpenAuthModal('login', 'all')}
              onRegister={() => handleOpenAuthModal('register', 'all')}
              onGoHome={() => handleNavigateToTab('jobs')}
            />
          ) : isRecruiter ? (
            <RecruiterApplicationsManager
              applications={applications}
              jobs={jobs}
              onUpdateApplicationStatus={handleUpdateApplicationStatus}
              onOpenChatWithCandidate={(name, jobTitle) => handleOpenChatWithRecruiter(name, jobTitle)}
            />
          ) : (
            <ApplicationTracker
              applications={candidateApplications}
              onWithdrawApplication={handleWithdrawApplication}
              onOpenChatWithRecruiter={handleOpenChatWithRecruiter}
            />
          )
        )}

        {/* VIEW 4: SAVED JOBS / RECRUITER ANALYTICS DASHBOARD */}
        {activeTab === 'saved' && (
          !isAuthenticated ? (
            <GuestAuthPrompt
              title="Danh Sách Việc Làm Đã Lưu"
              description="Đăng nhập để xem lại các công việc bạn quan tâm, nhận thông báo khi có thay đổi hạn nộp hồ sơ hoặc cập nhật mức lương mới."
              icon={<Bookmark className="w-8 h-8" />}
              onLogin={() => handleOpenAuthModal('login', 'all')}
              onRegister={() => handleOpenAuthModal('register', 'all')}
              onGoHome={() => handleNavigateToTab('jobs')}
            />
          ) : isRecruiter ? (
            <RecruiterAnalyticsDashboard
              jobs={jobs}
              applications={applications}
              onNavigateToApplications={(jobId) => {
                setActiveTab('applications');
              }}
              onNavigateToJobs={() => {
                setActiveTab('recruiter_portal');
              }}
            />
          ) : (
            <SavedJobsView
              savedJobs={savedJobs}
              onRemoveSaved={handleToggleSaveJob}
              onApply={(job) => handleStartApplyJob(job)}
              onSelectJob={(job) => setSelectedJob(job)}
              onExploreMore={() => handleNavigateToTab('jobs')}
            />
          )
        )}

        {/* VIEW 5: SALARY CALCULATOR */}
        {activeTab === 'salary' && (
          <SalaryCalculatorView
            currentUser={currentUser}
            onNavigateToJobs={(keyword) => {
              setFilters(prev => ({ ...prev, keyword }));
              handleNavigateToTab('jobs');
            }}
          />
        )}

        {/* VIEW 6: RECRUITER PORTAL */}
        {activeTab === 'recruiter_portal' && (
          <RecruiterPortal
            jobs={jobs}
            onPostNewJob={handlePostNewJob}
            onUpdateJob={handleUpdateJob}
            onDeleteJob={handleDeleteJob}
            candidateProfile={profile}
            applications={applications}
            onUpdateApplicationStatus={handleUpdateApplicationStatus}
            onBackToCandidateMode={() => handleNavigateToTab('jobs')}
            onOpenChatWithCandidate={(name) => handleOpenChatWithRecruiter(name)}
            onOpenAdminChat={() => setIsChatOpen(true)}
            onNavigateToAnalytics={() => handleNavigateToTab('saved')}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-gradient-to-b from-[#0F335A] via-[#0D2A4C] to-[#081B30] text-slate-200 text-xs border-t-4 border-[#137E8F] mt-16 shadow-2xl relative">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
            <div className="space-y-4">
              <div className="bg-white p-2 px-3.5 rounded-xl border border-teal-200/60 shadow-md inline-flex items-center">
                <NextstepLogo variant="full" size="md" showCompany={true} />
              </div>

              <p className="text-slate-300 text-xs leading-relaxed">
                {systemSettings.brandSlogan || 'Hệ sinh thái tuyển dụng thông minh hàng đầu. Kết nối ứng viên tài năng với các vị trí tuyển dụng chiến lược trên toàn quốc.'}
              </p>
              
              <div className="space-y-2 text-xs">
                <a 
                  href={`tel:${systemSettings.hotlineClean}`}
                  className="flex items-center gap-2.5 p-2.5 px-3 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/40 rounded-xl text-emerald-300 hover:text-emerald-200 font-bold transition-all cursor-pointer shadow-xs"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Hotline: {systemSettings.hotline}</span>
                </a>
                <a 
                  href={`mailto:${systemSettings.email}`}
                  className="flex items-center gap-2.5 p-2.5 px-3 bg-teal-500/15 hover:bg-teal-500/25 border border-teal-400/40 rounded-xl text-teal-200 hover:text-teal-100 font-medium transition-all cursor-pointer truncate shadow-xs"
                >
                  <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                  <span className="truncate">Email: {systemSettings.email}</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-3.5 pb-1.5 border-b border-white/10 flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-teal-400 rounded-full"></span>
                Dành cho Ứng viên
              </h4>
              <ul className="space-y-2.5 text-slate-300">
                <li><button onClick={() => handleNavigateToTab('jobs')} className="hover:text-teal-300 transition-colors cursor-pointer text-left">Tìm việc làm mới nhất</button></li>
                <li><button onClick={() => handleNavigateToTab('profile')} className="hover:text-teal-300 transition-colors cursor-pointer text-left">Tạo CV &amp; Quản lý hồ sơ số</button></li>
                <li><button onClick={() => handleNavigateToTab('salary')} className="hover:text-teal-300 transition-colors cursor-pointer text-left">Tính lương Gross - Net</button></li>
                <li><button onClick={() => handleNavigateToTab('applications')} className="hover:text-teal-300 transition-colors cursor-pointer text-left">Theo dõi việc đã nộp</button></li>
                <li><button onClick={() => handleNavigateToTab('saved')} className="hover:text-teal-300 transition-colors cursor-pointer text-left">Việc làm đã lưu</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-3.5 pb-1.5 border-b border-white/10 flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-emerald-400 rounded-full"></span>
                Dành cho Quản Trị &amp; Tuyển Dụng
              </h4>
              <ul className="space-y-2.5 text-slate-300">
                <li><button onClick={() => handleNavigateToTab('recruiter_portal')} className="hover:text-teal-300 transition-colors cursor-pointer text-left">Cổng Tuyển Dụng &amp; Đăng Tin Doanh Nghiệp</button></li>
                <li><button onClick={() => handleNavigateToTab('admin')} className="text-purple-300 hover:text-purple-200 font-bold transition-colors cursor-pointer text-left flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  Bảng Quản Trị Hệ Thống (Admin)
                </button></li>
                <li><button onClick={() => handleOpenAuthModal('login')} className="hover:text-teal-300 transition-colors cursor-pointer text-left">Đăng nhập tài khoản</button></li>
                <li><span className="hover:text-teal-300 transition-colors cursor-pointer">Giải pháp Talent Acquisition</span></li>
                <li><span className="hover:text-teal-300 transition-colors cursor-pointer">Chính sách bảo mật thông tin</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-3.5 pb-1.5 border-b border-white/10 flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-amber-400 rounded-full"></span>
                Trụ sở &amp; Pháp nhân
              </h4>
              <div className="space-y-3 text-xs leading-relaxed">
                <p className="text-white font-bold text-sm">
                  {systemSettings.companyName}
                </p>
                <p className="flex items-start gap-2 text-slate-200">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">Địa chỉ:</strong> {systemSettings.address}</span>
                </p>
                <p className="text-slate-300">
                  <strong className="text-white">Giờ làm việc:</strong> {systemSettings.workingHours}
                </p>
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-[10px]">
                    {systemSettings.primaryDomain && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                        <Globe className="w-3 h-3 text-emerald-400" />
                        https://{systemSettings.primaryDomain}
                      </span>
                    )}
                    {systemSettings.vnnicRegistrationNo && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
                        VNNIC: {systemSettings.vnnicRegistrationNo}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>© 2026 {systemSettings.companyName}</span>
                    <span className="text-emerald-400 font-semibold">• All Rights Reserved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING QUICK CONTACT WIDGET */}
      <QuickContactWidget onOpenRecruiterChat={() => handleOpenChatWithRecruiter(systemSettings.companyName)} />

      {/* MODAL 1: JOB DETAIL MODAL */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={(job) => {
            setSelectedJob(null);
            handleStartApplyJob(job);
          }}
          isSaved={savedJobIds.includes(selectedJob.id)}
          onToggleSave={handleToggleSaveJob}
          profile={profile}
        />
      )}

      {/* MODAL 2: QUICK APPLY MODAL */}
      {applyJob && (
        <QuickApplyModal
          job={applyJob}
          profile={profile}
          onClose={() => setApplyJob(null)}
          onNavigateToProfile={() => {
            setApplyJob(null);
            handleNavigateToTab('profile');
          }}
          onUpdateProfile={(updatedProfile) => {
            setProfile(updatedProfile);
          }}
          onSubmitApplication={(newApplication) => {
            const applicantName = currentUser ? currentUser.fullName : profile.fullName;
            const applicantAvatar = currentUser ? currentUser.avatar : profile.avatar;
            const applicantId = currentUser ? currentUser.id : (profile.id.startsWith('user-') ? profile.id : `user-${profile.id}`);
            const applicantEmail = currentUser ? currentUser.email : profile.email;
            const applicantPhone = currentUser ? currentUser.phone : profile.phone;

            const enrichedApp: Application = {
              ...newApplication,
              applicantId,
              applicantName,
              applicantEmail,
              applicantPhone,
              applicantAvatar
            };

            setApplications(prev => [enrichedApp, ...prev]);

            // 1. Tự động thêm tin nhắn nộp hồ sơ vào hộp thoại với công ty này (Trạng thái: Thẩm định sơ bộ, CHƯA mời phỏng vấn)
            const candidateApplyMsg: ChatMessage = {
              id: `msg-app-${Date.now()}`,
              sender: 'candidate',
              senderName: applicantName,
              avatar: applicantAvatar,
              text: `Chào Ban Tuyển Dụng ${enrichedApp.company}, tôi vừa nộp hồ sơ ứng tuyển vị trí "${enrichedApp.jobTitle}". Rất mong nhận được phản hồi từ quý công ty!`,
              timestamp: 'Vừa xong',
              jobTitle: enrichedApp.jobTitle,
              company: enrichedApp.company,
              candidateId: applicantId
            };

            const recruiterAckMsg: ChatMessage = {
              id: `msg-ack-${Date.now() + 1}`,
              sender: 'recruiter',
              senderName: `Tuyển dụng ${enrichedApp.company}`,
              avatar: enrichedApp.companyLogo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&auto=format&fit=crop&q=80',
              text: `Chào bạn ${applicantName}! Ban tuyển dụng ${enrichedApp.company} đã tiếp nhận hồ sơ ứng tuyển vị trí "${enrichedApp.jobTitle}". Hồ sơ của bạn đang trong trạng thái chờ bộ phận nhân sự thẩm định sơ bộ. Chúng mình sẽ liên hệ lại với bạn khi có kết quả duyệt hồ sơ nhé!`,
              timestamp: 'Vừa xong',
              jobTitle: enrichedApp.jobTitle,
              company: enrichedApp.company,
              candidateId: applicantId
            };

            setMessages(prev => [...prev, candidateApplyMsg, recruiterAckMsg]);

            // 2. Tự động tạo thông báo mới cho Admin: Ai đã nộp CV
            const adminNotif: AppNotification = {
              id: `admin-notif-${Date.now()}`,
              type: 'application_submitted',
              title: 'Hồ sơ ứng tuyển mới',
              senderName: applicantName,
              senderAvatar: applicantAvatar,
              content: `Ứng viên ${applicantName} vừa nộp CV ứng tuyển vị trí "${enrichedApp.jobTitle}" tại ${enrichedApp.company}.`,
              targetName: `${enrichedApp.company} • ${enrichedApp.jobTitle}`,
              timestamp: 'Vừa xong',
              isUnread: true,
              targetType: 'application',
              applicationId: enrichedApp.id,
              jobId: enrichedApp.jobId,
              companyName: enrichedApp.company,
              candidateName: applicantName
            };
            setAdminNotifications(prev => [adminNotif, ...prev]);

            // 3. Tự động tạo thông báo xác nhận cho Ứng viên (Hồ sơ đã nộp thành công):
            const candConfirmNotif: AppNotification = {
              id: `cand-notif-${Date.now()}`,
              type: 'application_status',
              title: 'Nộp hồ sơ ứng tuyển thành công!',
              senderName: enrichedApp.company,
              senderAvatar: enrichedApp.companyLogo,
              content: `Hồ sơ ứng tuyển của bạn cho vị trí "${enrichedApp.jobTitle}" đã được gửi tới Ban Tuyển Dụng ${enrichedApp.company}. Nhà tuyển dụng sẽ xem xét và phản hồi sớm nhất!`,
              targetName: `${enrichedApp.company} • ${enrichedApp.jobTitle}`,
              timestamp: 'Vừa xong',
              isUnread: true,
              targetType: 'application',
              applicationId: enrichedApp.id,
              jobId: enrichedApp.jobId,
              companyName: enrichedApp.company
            };
            setNotifications(prev => [candConfirmNotif, ...prev]);

            // 4. Hiển thị thông báo nổi tức thì (Real-time toast)
            setActiveToastNotification(candConfirmNotif);
          }}
        />
      )}

      {/* MODAL 3: PHÂN BIỆT TIN NHẮN THEO VAI TRÒ */}
      {isAdmin ? (
        /* TIN NHẮN ADMIN: NÓI CHUYỆN VỚI NHÀ TUYỂN DỤNG & ỨNG VIÊN, GIẢI ĐÁP THẮC MẮC */
        <AdminHelpdeskChatModal
          isOpen={isChatOpen}
          onClose={() => {
            setIsChatOpen(false);
            setChatCompany('');
          }}
          conversations={adminConversations}
          onSendMessage={handleAdminSendMessage}
          allJobs={jobs}
          applications={applications}
          onSelectJob={(job) => setSelectedJob(job)}
          onApplyJob={(job) => setApplyJob(job)}
        />
      ) : isRecruiter ? (
        /* TIN NHẮN NHÀ TUYỂN DỤNG: NÓI CHUYỆN VỚI BAN QUẢN TRỊ NEXTSTEP & ỨNG VIÊN */
        <RecruiterAdminChatModal
          isOpen={isChatOpen}
          onClose={() => {
            setIsChatOpen(false);
            setChatCompany('');
          }}
          conversations={adminConversations}
          onSendMessage={handleRecruiterSendMessage}
          currentUser={currentUser}
          applications={applications}
          allJobs={jobs}
          onSelectJob={(job) => setSelectedJob(job)}
          onApplyJob={(job) => setApplyJob(job)}
          selectedChatTarget={chatCompany}
          candidateMessages={messages}
          onSendCandidateMessage={(newMsg) => setMessages(prev => [...prev, newMsg])}
        />
      ) : (
        /* TIN NHẮN ỨNG VIÊN: NÓI CHUYỆN VỚI NHÀ TUYỂN DỤNG (TÁCH BIỆT THEO TỪNG ỨNG VIÊN) */
        <RecruiterChatModal
          isOpen={isChatOpen}
          onClose={() => {
            setIsChatOpen(false);
            setChatCompany('');
          }}
          messages={candidateMessages}
          onSendMessage={(newMsg) => setMessages(prev => [...prev, newMsg])}
          profile={profile}
          activeRecruiterCompany={chatCompany}
          applications={candidateApplications}
          onSelectCompany={(company) => setChatCompany(company)}
          allJobs={jobs}
          onSelectJob={(job) => setSelectedJob(job)}
          onApplyJob={(job) => setApplyJob(job)}
        />
      )}

      {/* MODAL 4: MULTI-CHANNEL AUTHENTICATION MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        initialMethod={authModalMethod}
        onSuccess={handleAuthSuccess}
      />

      {/* MODAL 5: ACCESS DENIED MODAL (CỔNG TUYỂN DỤNG & ADMIN CHỈ CHO ADMIN) */}
      <AccessDeniedModal
        isOpen={showAccessDeniedModal}
        onClose={() => setShowAccessDeniedModal(false)}
        portalName={deniedPortalName}
        onSwitchToAdminLogin={() => {
          handleOpenAuthModal('login', 'all');
          setPendingActionAfterAuth(() => () => setActiveTab('admin'));
        }}
      />

      {/* REAL-TIME TOAST NOTIFICATION BANNER */}
      <NotificationToast
        notification={activeToastNotification}
        onClose={() => setActiveToastNotification(null)}
        onViewDetail={handleSelectNotification}
      />

      {/* NOTIFICATION DETAIL MODAL: DẪN ĐẾN THÔNG TIN THÔNG BÁO CỤ THỂ */}
      <NotificationDetailModal
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
        onOpenJobDetail={(job) => {
          setSelectedNotification(null);
          setSelectedJob(job);
        }}
        onOpenApplicationDetail={(app) => {
          setSelectedNotification(null);
          handleNavigateToTab('applications');
        }}
        onOpenChat={(company, jobTitle) => {
          setSelectedNotification(null);
          handleOpenChatWithRecruiter(company, jobTitle);
        }}
        onNavigateToTab={(tab) => {
          setSelectedNotification(null);
          handleNavigateToTab(tab);
        }}
        allJobs={jobs}
        allApplications={applications}
        onMarkAsRead={(notifId) => {
          setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isUnread: false } : n));
          setAdminNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isUnread: false } : n));
          setSelectedNotification(prev => prev?.id === notifId ? { ...prev, isUnread: false } : prev);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
