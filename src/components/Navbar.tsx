import React, { useState } from 'react';
import { 
  Briefcase, 
  User, 
  FileText, 
  Bookmark, 
  Bell, 
  CheckCircle2, 
  Search, 
  Calculator, 
  ChevronDown, 
  Building2, 
  Eye, 
  MessageSquare,
  Sparkles,
  PhoneCall,
  Mail,
  MapPin,
  ShieldCheck,
  LogIn, 
  LogOut, 
  UserPlus, 
  KeyRound, 
  RotateCcw,
  BarChart3,
  Users,
  TrendingUp,
  ChevronRight,
  X
} from 'lucide-react';
import { CandidateProfile, RecruiterView, ChatMessage, SystemSettings, AdminNotificationItem, AppNotification, Application, AdminChatConversation } from '../types';
import { NextstepLogo } from './NextstepLogo';
import { NEXTSTEP_COMPANY_INFO } from '../data/companyInfo';
import { useAuth } from '../context/AuthContext';
import { getUnifiedConversations, ChatConversationItem } from '../utils/chatConversations';

interface NavbarProps {
  activeTab: 'jobs' | 'profile' | 'applications' | 'saved' | 'salary' | 'recruiter_portal' | 'admin';
  setActiveTab: (tab: 'jobs' | 'profile' | 'applications' | 'saved' | 'salary' | 'recruiter_portal' | 'admin') => void;
  profile: CandidateProfile;
  applicationsCount: number;
  savedCount: number;
  recruiterViews: RecruiterView[];
  messages: ChatMessage[];
  onOpenChat: () => void;
  onOpenAuthModal: (mode?: 'login' | 'register') => void;
  systemSettings?: SystemSettings;
  adminNotifications?: AdminNotificationItem[];
  adminUnreadChatCount?: number;
  notifications?: AppNotification[];
  onSelectNotification?: (notif: AppNotification) => void;
  onMarkAllNotificationsAsRead?: () => void;
  applications?: Application[];
  adminConversations?: AdminChatConversation[];
  onSelectConversation?: (conv: ChatConversationItem) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  applicationsCount,
  savedCount,
  recruiterViews,
  messages,
  onOpenChat,
  onOpenAuthModal,
  systemSettings,
  adminNotifications = [],
  adminUnreadChatCount = 1,
  notifications,
  onSelectNotification,
  onMarkAllNotificationsAsRead,
  applications = [],
  adminConversations = [],
  onSelectConversation
}) => {
  const { currentUser, isAuthenticated, isAdmin, isRecruiter, isCandidate, logout, loginAsUser } = useAuth();

  const TEST_ACCOUNTS = [
    {
      id: 'user-cand-001',
      name: 'Nguyễn Hoàng Minh',
      roleText: 'Frontend Tech Lead',
      badge: '3 đơn • 2 đã lưu',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
      targetTab: 'jobs' as const
    },
    {
      id: 'user-cand-002',
      name: 'Lê Thị Thu Thảo',
      roleText: 'UI/UX Product Designer',
      badge: 'Test nộp CV mới',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&auto=format&fit=crop&q=80',
      targetTab: 'jobs' as const
    },
    {
      id: 'user-cand-003',
      name: 'Trần Văn Đức',
      roleText: 'Backend Golang Engineer',
      badge: 'Hồ sơ độc lập',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&auto=format&fit=crop&q=80',
      targetTab: 'jobs' as const
    },
    {
      id: 'user-recruiter-001',
      name: 'Vũ Thu Trang (HR Director)',
      roleText: 'Tuyển dụng NextGen Tech',
      badge: 'Duyệt CV & PV',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&auto=format&fit=crop&q=80',
      targetTab: 'recruiter_portal' as const
    },
    {
      id: 'user-admin-001',
      name: 'Ban Quản Trị Hệ Thống',
      roleText: 'Super Admin Nextstep',
      badge: 'Toàn quyền',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
      targetTab: 'admin' as const
    }
  ];

  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessagesPopover, setShowMessagesPopover] = useState(false);
  const [messageSearchQuery, setMessageSearchQuery] = useState('');
  const [messageFilterCategory, setMessageFilterCategory] = useState<'all' | 'unread'>('all');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Lắng nghe phím Escape để đóng tất cả popover / menu đang mở
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowMessagesPopover(false);
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Danh sách thông báo theo vai trò và người dùng
  const displayNotifications: AppNotification[] = React.useMemo(() => {
    if (!isAuthenticated) {
      return [];
    }
    if (notifications && notifications.length > 0) {
      return notifications;
    }
    if (isAdmin) {
      return adminNotifications;
    }
    return [];
  }, [isAuthenticated, notifications, isAdmin, adminNotifications]);

  // Số lượng thông báo chưa đọc theo vai trò
  const unreadNotifCount = isAuthenticated ? displayNotifications.filter(n => n.isUnread).length : 0;

  // Danh sách tất cả các đoạn chat (Tách biệt theo vai trò & người dùng)
  const allChatConversations = React.useMemo(() => {
    if (!isAuthenticated) {
      return [];
    }
    return getUnifiedConversations({
      currentUser,
      applications,
      candidateMessages: messages,
      adminConversations,
      profile
    });
  }, [isAuthenticated, currentUser, applications, messages, adminConversations, profile]);

  // Lọc danh sách đoạn chat theo tìm kiếm & danh mục
  const filteredChatConversations = React.useMemo(() => {
    let list = allChatConversations;
    if (messageFilterCategory === 'unread') {
      list = list.filter(c => c.unreadCount > 0);
    }
    if (!messageSearchQuery.trim()) return list;
    const q = messageSearchQuery.toLowerCase().trim();
    return list.filter(c => 
      c.title.toLowerCase().includes(q) ||
      (c.subtitle && c.subtitle.toLowerCase().includes(q)) ||
      c.lastMessage.toLowerCase().includes(q)
    );
  }, [allChatConversations, messageFilterCategory, messageSearchQuery]);

  // Số lượng tin nhắn chưa đọc theo vai trò
  const unreadMessagesCount = React.useMemo(() => {
    if (!isAuthenticated) return 0;
    return allChatConversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  }, [isAuthenticated, allChatConversations]);

  const companyName = systemSettings?.companyName || NEXTSTEP_COMPANY_INFO.companyName;
  const companyPhone = systemSettings?.hotline || NEXTSTEP_COMPANY_INFO.phone;
  const companyPhoneClean = systemSettings?.hotlineClean || NEXTSTEP_COMPANY_INFO.phoneClean;
  const companyEmail = systemSettings?.email || NEXTSTEP_COMPANY_INFO.email;
  const companyAddress = systemSettings?.address || NEXTSTEP_COMPANY_INFO.address;

  // Active user data
  const displayName = currentUser ? currentUser.fullName : profile.fullName;
  const displayEmail = currentUser ? currentUser.email : profile.email;
  const displayAvatar = currentUser ? currentUser.avatar : profile.avatar;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
      {/* Admin Floating Notice Bar (Only visible when logged in as Admin and browsing other tabs) */}
      {isAdmin && activeTab !== 'admin' && (
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-purple-500/30 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="text-[11px] sm:text-xs text-purple-200">
              Bạn đang duyệt web với tư cách <strong>Quản Trị Viên (Super Admin)</strong>
            </span>
          </div>

          <button
            onClick={() => setActiveTab('admin')}
            className="px-2.5 py-0.5 rounded-lg bg-purple-500 hover:bg-purple-400 text-white text-[11px] font-black transition-all cursor-pointer shadow-2xs flex items-center gap-1"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Mở Bảng Quản Trị Admin</span>
          </button>
        </div>
      )}

      {/* Recruiter Floating Notice Bar (Only visible when logged in as Recruiter and browsing other tabs) */}
      {isRecruiter && activeTab !== 'recruiter_portal' && (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-blue-500/30 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[11px] sm:text-xs text-blue-200">
              Bạn đang đăng nhập với tư cách <strong>Nhà Tuyển Dụng ({currentUser?.companyName || 'Doanh Nghiệp'})</strong>
            </span>
          </div>

          <button
            onClick={() => setActiveTab('recruiter_portal')}
            className="px-2.5 py-0.5 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-[11px] font-black transition-all cursor-pointer shadow-2xs flex items-center gap-1"
          >
            <Building2 className="w-3 h-3" />
            <span>Vào Cổng Quản Lý Tuyển Dụng</span>
          </button>
        </div>
      )}

      {/* Top micro bar */}
      <div className="bg-[#0D2B52] text-slate-200 text-xs py-1.5 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-teal-300 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {companyName}
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden lg:flex items-center gap-1 text-slate-300">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>{companyAddress}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs">
            <a
              href={`tel:${companyPhoneClean}`}
              className="flex items-center gap-1 text-emerald-300 hover:text-emerald-200 font-bold transition-colors cursor-pointer"
              title="Hotline Tuyển Dụng Nextstep"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Hotline: {companyPhone}</span>
            </a>
            <span className="text-slate-600">|</span>
            <a
              href={`mailto:${companyEmail}`}
              className="hidden sm:flex items-center gap-1 text-teal-300 hover:text-teal-200 transition-colors cursor-pointer"
              title="Gửi CV tới HR Nextstep"
            >
              <Mail className="w-3 h-3" />
              <span>{companyEmail}</span>
            </a>
            {/* Cổng Tuyển Dụng & Quản Trị - CHỈ DÀNH RIÊNG VÀ HIỂN THỊ CHO TÀI KHOẢN ADMIN */}
            {isAdmin && (
              <>
                <span className="text-slate-600">|</span>
                <button 
                  id="nav-recruiter-portal-btn"
                  onClick={() => setActiveTab('recruiter_portal')}
                  className="flex items-center gap-1.5 text-teal-300 hover:text-white font-bold transition-colors cursor-pointer px-2 py-0.5 rounded bg-teal-500/15 border border-teal-400/30"
                >
                  <Building2 className="w-3 h-3 text-teal-300" />
                  <span>Cổng Tuyển Dụng</span>
                </button>
                <span className="text-slate-600">|</span>
                <button 
                  id="top-admin-portal-btn"
                  onClick={() => setActiveTab('admin')}
                  className="flex items-center gap-1.5 text-purple-200 hover:text-white font-black transition-colors cursor-pointer px-2 py-0.5 rounded bg-purple-600/30 border border-purple-400/40"
                >
                  <ShieldCheck className="w-3 h-3 text-purple-300" />
                  <span>Quản Trị Admin</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 h-18 flex items-center justify-between">
        {/* Logo & Main Nav */}
        <div className="flex items-center gap-8">
          <button 
            id="brand-logo-btn"
            onClick={() => setActiveTab('jobs')} 
            className="flex items-center gap-1 text-left focus:outline-hidden group cursor-pointer hover:opacity-90 transition-opacity"
          >
            <NextstepLogo variant="full" size="md" showCompany={true} />
          </button>

          {/* Nav links - PHÂN BIỆT RẠCH RÒI GIỮA ADMIN VÀ ỨNG VIÊN */}
          <nav className="hidden md:flex items-center gap-1">
            {isAdmin ? (
              /* MENU DÀNH RIÊNG CHO QUẢN TRỊ VIÊN (ADMIN) */
              <>
                <button
                  id="nav-jobs-btn"
                  onClick={() => setActiveTab('jobs')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'jobs'
                      ? 'bg-teal-50 text-[#0D2B52] border border-teal-200 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Search className="w-4 h-4 text-[#137E8F]" />
                  Tin tuyển dụng công khai
                </button>

                <button
                  id="nav-recruiter-portal-main-btn"
                  onClick={() => setActiveTab('recruiter_portal')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'recruiter_portal'
                      ? 'bg-teal-600 text-white font-bold shadow-xs'
                      : 'text-teal-800 hover:bg-teal-50 border border-teal-200/80 bg-teal-50/50'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Cổng Đăng Tin Tuyển Dụng</span>
                  <span className="text-[10px] bg-teal-200/70 text-teal-950 font-black px-1.5 py-0.2 rounded-full">
                    Đăng tin
                  </span>
                </button>

                <button
                  id="nav-admin-btn"
                  onClick={() => setActiveTab('admin')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-purple-700 text-white font-bold shadow-xs'
                      : 'text-purple-800 hover:bg-purple-100/70 border border-purple-300 bg-purple-50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Bảng Quản Trị Hệ Thống</span>
                  <span className="text-[10px] bg-purple-200 text-purple-900 font-extrabold px-1.5 py-0.2 rounded-full">
                    Super Admin
                  </span>
                </button>

                <button
                  id="nav-salary-btn"
                  onClick={() => setActiveTab('salary')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'salary'
                      ? 'bg-teal-50 text-[#0D2B52] border border-teal-200 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Calculator className="w-4 h-4 text-[#137E8F]" />
                  Tra cứu lương
                </button>
              </>
            ) : isRecruiter ? (
              /* MENU DÀNH CHO NHÀ TUYỂN DỤNG (RECRUITER) */
              <>
                {/* 1. Cổng Tuyển Dụng */}
                <button
                  id="nav-recruiter-portal-btn"
                  onClick={() => setActiveTab('recruiter_portal')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'recruiter_portal'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-blue-800 hover:bg-blue-100/70 border border-blue-200 bg-blue-50/50'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Cổng Tuyển Dụng</span>
                </button>

                {/* 2. Quản lý hồ sơ nhà tuyển dụng */}
                <button
                  id="nav-recruiter-profile-btn"
                  onClick={() => setActiveTab('profile')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-teal-50 text-[#0D2B52] border border-teal-200 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>Hồ Sơ Doanh Nghiệp &amp; HR</span>
                </button>

                {/* 3. Phần Đã ứng tuyển thay bằng Quản lý CV nộp */}
                <button
                  id="nav-recruiter-applications-btn"
                  onClick={() => setActiveTab('applications')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'applications'
                      ? 'bg-teal-50 text-[#0D2B52] border border-teal-200 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4 text-teal-600" />
                  <span>Hồ Sơ Ứng Tuyển</span>
                  {applicationsCount > 0 && (
                    <span className="ml-1 text-[11px] bg-teal-100 text-teal-900 font-bold px-1.5 py-0.5 rounded-full">
                      {applicationsCount}
                    </span>
                  )}
                </button>

                {/* 4. Phần Việc đã lưu thay bằng Biểu đồ thống kê tuyển dụng */}
                <button
                  id="nav-recruiter-saved-btn"
                  onClick={() => setActiveTab('saved')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'saved'
                      ? 'bg-teal-50 text-[#0D2B52] border border-teal-200 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                  <span>Thống Kê Tuyển Dụng</span>
                  <span className="ml-1 text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.2 rounded-full">
                    Biểu đồ
                  </span>
                </button>

                {/* 5. Tin nhắn & Hỗ trợ tuyển dụng */}
                <button
                  id="nav-recruiter-chat-btn"
                  onClick={onOpenChat}
                  className="px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                  title="Mở tất cả đoạn chat & Hỗ trợ BQT"
                >
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span>Tin Nhắn Tuyển Dụng</span>
                  {unreadMessagesCount > 0 && (
                    <span className="ml-1 text-[10px] bg-orange-500 text-white font-black px-1.5 py-0.2 rounded-full shadow-2xs">
                      {unreadMessagesCount}
                    </span>
                  )}
                </button>

                {/* 6. Tra cứu lương */}
                <button
                  id="nav-salary-btn"
                  onClick={() => setActiveTab('salary')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'salary'
                      ? 'bg-teal-50 text-[#0D2B52] border border-teal-200 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Calculator className="w-4 h-4 text-[#137E8F]" />
                  <span>Tra cứu lương</span>
                </button>
              </>
            ) : (
              /* MENU DÀNH CHO ỨNG VIÊN (CANDIDATE) / KHÁCH (GUEST) */
              <>
                <button
                  id="nav-jobs-btn"
                  onClick={() => setActiveTab('jobs')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'jobs'
                      ? 'bg-teal-50 text-[#0D2B52] border border-teal-200 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Search className="w-4 h-4 text-[#137E8F]" />
                  Tìm việc làm
                </button>

                <button
                  id="nav-profile-btn"
                  onClick={() => setActiveTab('profile')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-teal-50 text-[#0D2B52] border border-teal-200 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-4 h-4 text-[#137E8F]" />
                  Quản lý hồ sơ &amp; CV
                  {isAuthenticated && profile.profileStrength > 0 && (
                    <span className="ml-1 text-[11px] bg-teal-100 text-[#0D2B52] font-bold px-1.5 py-0.5 rounded-full">
                      {profile.profileStrength}%
                    </span>
                  )}
                </button>

                <button
                  id="nav-applications-btn"
                  onClick={() => setActiveTab('applications')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'applications'
                      ? 'bg-teal-50 text-[#0D2B52] border border-teal-200 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-[#137E8F]" />
                  Đã ứng tuyển
                  {isAuthenticated && applicationsCount > 0 && (
                    <span className="ml-1 text-[11px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full">
                      {applicationsCount}
                    </span>
                  )}
                </button>

                <button
                  id="nav-saved-btn"
                  onClick={() => setActiveTab('saved')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'saved'
                      ? 'bg-teal-50 text-[#0D2B52] border border-teal-200 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Bookmark className="w-4 h-4 text-[#137E8F]" />
                  Việc đã lưu
                  {isAuthenticated && savedCount > 0 && (
                    <span className="ml-1 text-[11px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded-full">
                      {savedCount}
                    </span>
                  )}
                </button>

                <button
                  id="nav-salary-btn"
                  onClick={() => setActiveTab('salary')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'salary'
                      ? 'bg-teal-50 text-[#0D2B52] border border-teal-200 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Calculator className="w-4 h-4 text-[#137E8F]" />
                  Tra cứu lương
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Right Action Icons & User Info */}
        <div className="flex items-center gap-3">
          {/* Direct chat button: Hiện tất cả các đoạn chat khi ấn vào */}
          <div className="relative">
            <button
              id="nav-chat-btn"
              onClick={() => {
                if (!isAuthenticated) {
                  onOpenAuthModal('login');
                  return;
                }
                setShowMessagesPopover(!showMessagesPopover);
                setShowNotifications(false);
                setShowUserMenu(false);
              }}
              className={`relative p-2.5 rounded-full transition-colors cursor-pointer ${
                isAdmin 
                  ? 'text-purple-700 hover:text-purple-900 hover:bg-purple-100/70' 
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
              title={isAdmin ? "Hộp thư Giải đáp & Hỗ trợ Tuyển dụng (Admin Helpdesk)" : "Tin nhắn & Tất cả đoạn chat"}
            >
              <MessageSquare className="w-5 h-5" />
              {unreadMessagesCount > 0 && (
                <span className={`absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full ring-2 ring-white text-[10px] font-bold text-white flex items-center justify-center ${
                  isAdmin ? 'bg-purple-600' : 'bg-orange-500'
                }`}>
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {/* Messages Popover: HIỆN RA TẤT CẢ ĐOẠN CHAT */}
            {showMessagesPopover && (
              <>
                <div 
                  className="fixed inset-0 z-40 cursor-default" 
                  onClick={() => setShowMessagesPopover(false)} 
                />
                <div 
                  id="messages-popover"
                  className="absolute right-0 mt-2 w-88 sm:w-110 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                      <h3 className="text-sm font-bold text-slate-900">Tất cả đoạn chat</h3>
                      <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        {allChatConversations.length} cuộc hội thoại
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setShowMessagesPopover(false);
                          onOpenChat();
                        }}
                        className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline flex items-center gap-1"
                      >
                        <span>Mở rộng</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        id="messages-popover-close-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowMessagesPopover(false);
                        }}
                        className="p-1 px-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold border border-slate-200"
                        title="Đóng bảng tin nhắn"
                      >
                        <X className="w-3.5 h-3.5 pointer-events-none" />
                        <span className="pointer-events-none">Đóng</span>
                      </button>
                    </div>
                  </div>

                {/* Search Bar */}
                <div className="mt-3 relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm đoạn chat, công ty, ứng viên..."
                    value={messageSearchQuery}
                    onChange={(e) => setMessageSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  />
                  {messageSearchQuery && (
                    <button
                      onClick={() => setMessageSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Filter Tabs */}
                <div className="mt-2.5 flex items-center gap-1">
                  <button
                    onClick={() => setMessageFilterCategory('all')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      messageFilterCategory === 'all'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Tất cả ({allChatConversations.length})
                  </button>
                  <button
                    onClick={() => setMessageFilterCategory('unread')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      messageFilterCategory === 'unread'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Chưa đọc ({unreadMessagesCount})
                  </button>
                </div>

                {/* Conversation List */}
                <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto mt-2 pr-0.5">
                  {filteredChatConversations.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 space-y-1.5">
                      <MessageSquare className="w-8 h-8 text-slate-300 mx-auto stroke-1" />
                      <p className="text-xs font-semibold text-slate-600">
                        {messageSearchQuery ? 'Không tìm thấy đoạn chat phù hợp' : 'Chưa có đoạn chat nào'}
                      </p>
                      <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                        {messageSearchQuery
                          ? 'Thử tìm kiếm với tên công ty hoặc vị trí ứng tuyển khác'
                          : 'Khi bạn nộp hồ sơ hoặc nhận phản hồi từ nhà tuyển dụng, các đoạn chat sẽ xuất hiện tại đây'}
                      </p>
                    </div>
                  ) : (
                    filteredChatConversations.map((conv) => {
                      const badgeBg = 
                        conv.badgeColor === 'purple' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                        conv.badgeColor === 'emerald' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                        conv.badgeColor === 'cyan' ? 'bg-cyan-100 text-cyan-800 border-cyan-200' :
                        'bg-amber-100 text-amber-800 border-amber-200';

                      return (
                        <div
                          key={conv.id}
                          onClick={() => {
                            setShowMessagesPopover(false);
                            if (onSelectConversation) {
                              onSelectConversation(conv);
                            } else {
                              onOpenChat();
                            }
                          }}
                          className={`py-3 flex items-start gap-3 rounded-xl p-2 transition-all cursor-pointer group ${
                            conv.unreadCount > 0 ? 'bg-blue-50/50 hover:bg-blue-50/90' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="relative shrink-0">
                            <img
                              src={conv.avatar}
                              alt={conv.title}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 bg-white shadow-2xs"
                            />
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white"></span>
                            {conv.unreadCount > 0 && (
                              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full ring-2 ring-white"></span>
                            )}
                          </div>

                          <div className="text-xs space-y-1 min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="text-slate-900 font-bold text-xs truncate group-hover:text-blue-600 transition-colors">
                                {conv.title}
                              </h4>
                              <span className="text-[10px] text-slate-400 shrink-0">{conv.lastTimestamp}</span>
                            </div>

                            {conv.subtitle && (
                              <p className="text-[11px] text-slate-500 font-medium truncate">
                                {conv.subtitle}
                              </p>
                            )}

                            <p className="text-slate-600 text-[11px] leading-snug line-clamp-1">
                              {conv.lastMessage}
                            </p>

                            <div className="flex items-center justify-between pt-0.5">
                              {conv.badge && (
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${badgeBg}`}>
                                  {conv.badge}
                                </span>
                              )}
                              <span className="text-[10px] text-blue-600 font-bold group-hover:underline ml-auto">
                                Nhắn tin &rarr;
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer button */}
                <div className="pt-3 mt-1 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Kênh trao đổi trực tiếp &amp; bảo mật
                  </span>
                  <button
                    onClick={() => {
                      setShowMessagesPopover(false);
                      onOpenChat();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <span>Mở hộp thư đầy đủ</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </>
          )}
          </div>

          {/* Notifications bell */}
          <div className="relative">
            <button
              id="nav-notifications-btn"
              onClick={() => {
                if (!isAuthenticated) {
                  onOpenAuthModal('login');
                  return;
                }
                setShowNotifications(!showNotifications);
                setShowMessagesPopover(false);
                setShowUserMenu(false);
              }}
              className="relative p-2.5 rounded-full text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
              title={isAdmin ? "Thông báo Hệ Thống Quản Trị" : "Thông báo tuyển dụng"}
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className={`absolute top-1.5 right-1.5 min-w-4 h-4 px-1 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white ${
                  isAdmin ? 'bg-purple-600' : 'bg-red-500'
                }`}>
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Notification popup: DẪN ĐẾN THÔNG TIN THÔNG BÁO CỤ THỂ CHO TẤT CẢ VAI TRÒ */}
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40 cursor-default" 
                  onClick={() => setShowNotifications(false)} 
                />
                <div 
                  id="notifications-popover"
                  className="absolute right-0 mt-2 w-88 sm:w-110 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    {isAdmin ? (
                      <>
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        <h3 className="text-sm font-bold text-slate-900">Thông báo Quản Trị Hệ Thống</h3>
                        <span className="text-[10px] font-black bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                          Admin
                        </span>
                      </>
                    ) : isRecruiter ? (
                      <>
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <h3 className="text-sm font-bold text-slate-900">Thông báo Tuyển Dụng</h3>
                        <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          Doanh Nghiệp
                        </span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-4 h-4 text-blue-600" />
                        <h3 className="text-sm font-bold text-slate-800">Thông báo tuyển dụng</h3>
                        <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/60">
                          {displayName}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadNotifCount > 0 && onMarkAllNotificationsAsRead && (
                      <button 
                        onClick={onMarkAllNotificationsAsRead}
                        className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline"
                      >
                        Đánh dấu đã đọc
                      </button>
                    )}
                    <button
                      type="button"
                      id="notifications-popover-close-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowNotifications(false);
                      }}
                      className="p-1 px-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold border border-slate-200"
                      title="Đóng bảng thông báo"
                    >
                      <X className="w-3.5 h-3.5 pointer-events-none" />
                      <span className="pointer-events-none">Đóng</span>
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto mt-2">
                  {displayNotifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 space-y-1.5">
                      <Bell className="w-8 h-8 text-slate-300 mx-auto stroke-1" />
                      <p className="text-xs font-semibold text-slate-600">Bạn chưa có thông báo mới nào</p>
                      <p className="text-[11px] text-slate-400">Các hoạt động tuyển dụng và ứng tuyển sẽ hiển thị tại đây</p>
                    </div>
                  ) : (
                    displayNotifications.map((notif) => {
                      const isInterview = notif.type === 'interview_invitation';
                      const isViewed = notif.type === 'recruiter_view';
                      const isApp = notif.type === 'application_submitted';
                      const isJob = notif.type === 'job_posted' || notif.type === 'job_recommendation';

                      const badgeText = isInterview ? '📅 Thư Mời PV' :
                                        isViewed ? '🏢 Xem Hồ Sơ' :
                                        isApp ? '📄 CV Mới Nộp' :
                                        isJob ? '✨ Việc Làm Mới' : '🔔 Thông Báo';

                      const badgeBg = isInterview ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                                      isViewed ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                      isApp ? 'bg-purple-100 text-purple-800 border-purple-200' :
                                      isJob ? 'bg-amber-100 text-amber-900 border-amber-200' :
                                      'bg-slate-100 text-slate-700 border-slate-200';

                      return (
                        <div 
                          key={notif.id} 
                          onClick={() => {
                            setShowNotifications(false);
                            if (onSelectNotification) {
                              onSelectNotification(notif);
                            }
                          }}
                          className={`py-3 flex items-start gap-3 rounded-xl p-2 transition-all cursor-pointer group ${
                            notif.isUnread ? 'bg-blue-50/50 hover:bg-blue-50/90' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="relative shrink-0">
                            <img 
                              src={notif.senderAvatar || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80'} 
                              alt={notif.senderName} 
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 bg-white shadow-2xs" 
                            />
                            {notif.isUnread && (
                              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-600 rounded-full ring-2 ring-white"></span>
                            )}
                          </div>
                          
                          <div className="text-xs space-y-1 min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${badgeBg}`}>
                                {badgeText}
                              </span>
                              <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                            </div>

                            <p className="text-slate-900 font-bold text-xs leading-snug line-clamp-1">
                              {notif.title}
                            </p>

                            <p className="text-slate-600 text-[11px] leading-snug line-clamp-2">
                              {notif.content}
                            </p>

                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[10px] text-slate-500 font-semibold truncate max-w-[180px]">
                                {notif.targetName || notif.senderName}
                              </span>
                              <span className="text-[11px] font-bold text-[#137E8F] group-hover:text-blue-700 flex items-center gap-0.5 transition-colors">
                                <span>Xem chi tiết cụ thể</span>
                                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 text-center">
                  {isAdmin ? (
                    <button 
                      onClick={() => { setShowNotifications(false); setActiveTab('admin'); }}
                      className="text-xs text-purple-700 hover:text-purple-900 font-bold cursor-pointer flex items-center justify-center gap-1.5 w-full py-1.5 hover:bg-purple-50 rounded-xl transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                      <span>Mở Bảng Quản Trị Hệ Thống Toàn Diện</span>
                    </button>
                  ) : isRecruiter ? (
                    <button 
                      onClick={() => { setShowNotifications(false); setActiveTab('recruiter_portal'); }}
                      className="text-xs text-blue-700 hover:text-blue-900 font-bold cursor-pointer flex items-center justify-center gap-1.5 w-full py-1.5 hover:bg-blue-50 rounded-xl transition-colors"
                    >
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Vào Cổng Quản Lý &amp; Tuyển Dụng</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => { setShowNotifications(false); setActiveTab('applications'); }}
                      className="text-xs text-[#0D2B52] hover:text-[#137E8F] font-bold cursor-pointer flex items-center justify-center gap-1.5 w-full py-1.5 hover:bg-teal-50 rounded-xl transition-colors"
                    >
                      <Briefcase className="w-3.5 h-3.5 text-[#137E8F]" />
                      <span>Xem Tất Cả Việc Làm Đã Ứng Tuyển</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

          {/* USER AUTHENTICATION SECTION */}
          {!isAuthenticated ? (
            /* Guest Buttons: Standard Login & Register */
            <div className="flex items-center gap-2">
              <button
                id="nav-login-btn"
                onClick={() => onOpenAuthModal('login')}
                className="px-3.5 py-2 text-xs font-bold text-[#0D2B52] hover:bg-teal-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-teal-200 flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-[#137E8F]" />
                <span>Đăng nhập</span>
              </button>

              <button
                id="nav-register-btn"
                onClick={() => onOpenAuthModal('register')}
                className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#0D2B52] to-[#137E8F] hover:opacity-95 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Đăng ký</span>
              </button>
            </div>
          ) : (
            /* Logged in User Profile Mini Pill */
            <div className="relative">
              <button
                id="user-profile-menu-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-slate-100 border transition-colors cursor-pointer ${
                  isAdmin 
                    ? 'border-purple-300 bg-purple-50/50' 
                    : isRecruiter
                      ? 'border-blue-300 bg-blue-50/50'
                      : 'border-slate-200'
                }`}
              >
                <img 
                  src={displayAvatar} 
                  alt={displayName} 
                  className={`w-8 h-8 rounded-full object-cover ring-2 ${
                    isAdmin ? 'ring-purple-600' : isRecruiter ? 'ring-blue-600' : 'ring-[#137E8F]'
                  }`} 
                />
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight max-w-[120px] truncate">
                    {displayName}
                  </p>
                  <div className="flex items-center gap-1">
                    {isAdmin ? (
                      <span className="text-[10px] text-purple-700 font-extrabold flex items-center gap-0.5">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        Admin
                      </span>
                    ) : isRecruiter ? (
                      <span className="text-[10px] text-blue-700 font-extrabold flex items-center gap-0.5">
                        <Building2 className="w-2.5 h-2.5" />
                        Doanh Nghiệp
                      </span>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span className="text-[10px] text-emerald-600 font-medium">Bật tìm việc</span>
                      </>
                    )}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div 
                  id="user-dropdown-menu"
                  className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className={`p-3 rounded-xl mb-2 border ${
                    isAdmin 
                      ? 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200'
                      : isRecruiter
                        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
                        : 'bg-gradient-to-br from-slate-50 to-teal-50/60 border-teal-100/50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-[#0D2B52] truncate">{displayName}</p>
                      <span className={`text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded border ${
                        isAdmin 
                          ? 'bg-purple-600 text-white border-purple-600'
                          : isRecruiter
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white/80 text-slate-600 border-slate-200'
                      }`}>
                        {isAdmin ? 'Super Admin' : isRecruiter ? 'Nhà Tuyển Dụng' : (currentUser?.provider || 'Ứng Viên')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{displayEmail}</p>

                    {isAdmin ? (
                      <div className="mt-2 text-[11px] font-bold text-purple-700 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                        <span>Toàn quyền Quản Trị Viên</span>
                      </div>
                    ) : isRecruiter ? (
                      <div className="mt-2 text-[11px] font-bold text-blue-800 flex items-center gap-1 bg-white/80 p-1.5 rounded-lg border border-blue-100">
                        <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{currentUser?.companyName || 'Doanh Nghiệp Tuyển Dụng'}</span>
                      </div>
                    ) : (
                      <>
                        <div className="mt-2.5 flex items-center justify-between text-xs">
                          <span className="text-slate-600">Độ mạnh hồ sơ:</span>
                          <span className="font-bold text-[#137E8F]">{profile.profileStrength}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-[#0D2B52] to-[#137E8F] h-full rounded-full transition-all" 
                            style={{ width: `${profile.profileStrength}%` }}
                          ></div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-0.5 text-xs">
                    {/* MENU CHO TÀI KHOẢN QUẢN TRỊ VIÊN (ADMIN) */}
                    {isAdmin ? (
                      <>
                        <button
                          onClick={() => { setActiveTab('admin'); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer transition-colors shadow-2xs mb-1"
                        >
                          <ShieldCheck className="w-4 h-4 text-purple-200" />
                          <span>Bảng Quản Trị Admin Toàn Diện</span>
                        </button>

                        <button
                          onClick={() => { setActiveTab('recruiter_portal'); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-teal-800 hover:bg-teal-50 font-bold cursor-pointer"
                        >
                          <Building2 className="w-4 h-4 text-teal-600" />
                          <span>Cổng Đăng Tin Tuyển Dụng</span>
                        </button>

                        <button
                          onClick={() => { setActiveTab('jobs'); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
                        >
                          <Search className="w-4 h-4 text-slate-600" />
                          <span>Xem tin tuyển dụng ngoài web</span>
                        </button>
                      </>
                    ) : isRecruiter ? (
                      /* MENU CHO TÀI KHOẢN NHÀ TUYỂN DỤNG (RECRUITER) */
                      <>
                        <button
                          onClick={() => { setActiveTab('saved'); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold cursor-pointer transition-colors shadow-2xs mb-1"
                        >
                          <BarChart3 className="w-4 h-4 text-purple-600" />
                          <span>Biểu Đồ Thống Kê Tuyển Dụng</span>
                        </button>

                        <button
                          onClick={() => { setActiveTab('recruiter_portal'); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer transition-colors shadow-2xs mb-1"
                        >
                          <Building2 className="w-4 h-4 text-blue-100" />
                          <span>Cổng Quản Lý &amp; Đăng Tin Tuyển Dụng</span>
                        </button>

                        <button
                          onClick={() => { setActiveTab('applications'); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-900 font-medium cursor-pointer"
                        >
                          <Users className="w-4 h-4 text-teal-600" />
                          <span>Hồ Sơ Ứng Tuyển &amp; Đánh Giá CV ({applicationsCount})</span>
                        </button>

                        <button
                          id="menu-recruiter-chat-btn"
                          onClick={() => { onOpenChat(); setShowUserMenu(false); }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-900 font-medium cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <MessageSquare className="w-4 h-4 text-blue-600" />
                            <span>Tin Nhắn &amp; Trao Đổi Tuyển Dụng</span>
                          </div>
                          {unreadMessagesCount > 0 && (
                            <span className="text-[10px] bg-orange-500 text-white font-black px-1.5 py-0.2 rounded-full">
                              {unreadMessagesCount} mới
                            </span>
                          )}
                        </button>

                        <button
                          onClick={() => { setActiveTab('profile'); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-900 font-medium cursor-pointer"
                        >
                          <Building2 className="w-4 h-4 text-blue-600" />
                          <span>Hồ Sơ Doanh Nghiệp &amp; HR</span>
                        </button>

                        <button
                          onClick={() => { setActiveTab('jobs'); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
                        >
                          <Search className="w-4 h-4 text-slate-600" />
                          <span>Xem tin tuyển dụng công khai</span>
                        </button>

                        <button
                          onClick={() => { setActiveTab('salary'); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
                        >
                          <Calculator className="w-4 h-4 text-slate-600" />
                          <span>Tra cứu lương Gross - Net</span>
                        </button>
                      </>
                    ) : (
                      /* MENU CHO TÀI KHOẢN ỨNG VIÊN (CANDIDATE) */
                      <>
                        <button
                          onClick={() => { setActiveTab('profile'); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-teal-50/60 hover:text-[#0D2B52] font-medium cursor-pointer"
                        >
                          <User className="w-4 h-4 text-[#137E8F]" />
                          Cập nhật hồ sơ &amp; CV online
                        </button>
                        <button
                          onClick={() => { setActiveTab('applications'); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-teal-50/60 hover:text-[#0D2B52] font-medium cursor-pointer"
                        >
                          <Briefcase className="w-4 h-4 text-emerald-600" />
                          Việc làm đã ứng tuyển ({applicationsCount})
                        </button>
                        <button
                          onClick={() => { setActiveTab('saved'); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-teal-50/60 hover:text-[#0D2B52] font-medium cursor-pointer"
                        >
                          <Bookmark className="w-4 h-4 text-teal-600" />
                          Việc làm đã lưu ({savedCount})
                        </button>
                        <button
                          onClick={() => { setActiveTab('salary'); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-teal-50/60 hover:text-[#0D2B52] font-medium cursor-pointer"
                        >
                          <Calculator className="w-4 h-4 text-[#137E8F]" />
                          Tra cứu lương Gross - Net
                        </button>
                      </>
                    )}

                    {/* CHỈ HIỂN THỊ DANH SÁCH TÀI KHOẢN THỬ NGHIỆM CHO DUY NHẤT QUẢN TRỊ VIÊN (ADMIN) */}
                    {isAdmin && (
                      <div className="pt-2.5 pb-1 border-t border-slate-100 mt-2">
                        <div className="flex items-center justify-between px-2 mb-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-purple-600" />
                            Chuyển Tài Khoản Demo (Chỉ Admin Thấy)
                          </span>
                          <span className="text-[9px] font-bold text-purple-700 bg-purple-50 border border-purple-200/60 px-1.5 py-0.5 rounded-full">
                            Super Admin
                          </span>
                        </div>
                        <div className="space-y-1">
                          {TEST_ACCOUNTS.map(acc => {
                            const isActive = currentUser?.id === acc.id;
                            return (
                              <button
                                key={acc.id}
                                onClick={() => {
                                  loginAsUser(acc.id);
                                  setShowUserMenu(false);
                                  setActiveTab(acc.targetTab);
                                }}
                                className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer ${
                                  isActive 
                                    ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 text-purple-950 font-semibold shadow-2xs' 
                                    : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <img
                                    src={acc.avatar}
                                    alt={acc.name}
                                    className={`w-7 h-7 rounded-full object-cover shrink-0 ring-1.5 ${
                                      isActive ? 'ring-purple-600' : 'ring-slate-200'
                                    }`}
                                  />
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold truncate leading-tight flex items-center gap-1">
                                      <span>{acc.name}</span>
                                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0"></span>}
                                    </p>
                                    <p className="text-[10px] text-slate-500 truncate leading-tight">
                                      {acc.roleText}
                                    </p>
                                  </div>
                                </div>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ml-1.5 ${
                                  isActive
                                    ? 'bg-purple-600 text-white shadow-2xs'
                                    : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {acc.badge}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    {/* Switch / Relogin button */}
                    <button
                      onClick={() => { onOpenAuthModal('login'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4 text-blue-600" />
                      Đổi tài khoản / Đăng nhập khác
                    </button>

                    {/* Logout button */}
                    <button
                      onClick={() => { logout(); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      Đăng xuất khỏi hệ thống
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav pills bar */}
      <div className="md:hidden flex items-center overflow-x-auto py-2 px-4 border-t border-slate-100 gap-2 no-scrollbar">
        {isAdmin ? (
          <>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                activeTab === 'jobs' ? 'bg-[#0D2B52] text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Tin tuyển dụng
            </button>
            <button
              onClick={() => setActiveTab('recruiter_portal')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'recruiter_portal' ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-800 border border-teal-200'
              }`}
            >
              <Building2 className="w-3 h-3" />
              Cổng Đăng Tin
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'admin' ? 'bg-purple-700 text-white' : 'bg-purple-100 text-purple-900 border border-purple-300'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              Bảng Admin
            </button>
            <button
              onClick={() => setActiveTab('salary')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                activeTab === 'salary' ? 'bg-[#0D2B52] text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Tra cứu lương
            </button>
          </>
        ) : isRecruiter ? (
          <>
            <button
              onClick={() => setActiveTab('recruiter_portal')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'recruiter_portal' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-800 border border-blue-200'
              }`}
            >
              <Building2 className="w-3 h-3" />
              Cổng Tuyển Dụng
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                activeTab === 'profile' ? 'bg-[#0D2B52] text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Hồ sơ Doanh nghiệp &amp; HR
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                activeTab === 'applications' ? 'bg-[#0D2B52] text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Hồ sơ ứng tuyển ({applicationsCount})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                activeTab === 'saved' ? 'bg-[#0D2B52] text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Thống kê tuyển dụng
            </button>
            <button
              id="mobile-nav-recruiter-chat-btn"
              onClick={onOpenChat}
              className="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1 cursor-pointer"
            >
              <MessageSquare className="w-3 h-3 text-blue-600" />
              <span>Tin nhắn</span>
              {unreadMessagesCount > 0 && (
                <span className="text-[10px] bg-orange-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                  {unreadMessagesCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('salary')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                activeTab === 'salary' ? 'bg-[#0D2B52] text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Tra cứu lương
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                activeTab === 'jobs' ? 'bg-[#0D2B52] text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Tìm việc làm
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                activeTab === 'profile' ? 'bg-[#0D2B52] text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Quản lý hồ sơ
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                activeTab === 'applications' ? 'bg-[#0D2B52] text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Đã ứng tuyển ({applicationsCount})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                activeTab === 'saved' ? 'bg-[#0D2B52] text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Việc đã lưu ({savedCount})
            </button>
            <button
              onClick={() => setActiveTab('salary')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                activeTab === 'salary' ? 'bg-[#0D2B52] text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Tra cứu lương
            </button>
          </>
        )}
      </div>
    </header>
  );
};
