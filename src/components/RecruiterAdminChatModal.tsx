import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  X, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  CheckCheck, 
  FileText, 
  HelpCircle, 
  BadgeCheck, 
  Phone, 
  Mail, 
  Clock, 
  Zap,
  Building2,
  ExternalLink,
  Search,
  MessageSquare,
  Users,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
  User
} from 'lucide-react';
import { AdminChatConversation, AuthUser, Application, Job, ChatMessage } from '../types';
import { CandidateProfileDetailModal } from './CandidateProfileDetailModal';
import { CompanyProfileModal } from './CompanyProfileModal';
import { getCandidateProfileForApplicant } from '../utils/candidateProfileHelper';

interface RecruiterAdminChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: AdminChatConversation[];
  onSendMessage: (conversationId: string, text: string) => void;
  currentUser: AuthUser | null;
  applications?: Application[];
  allJobs?: Job[];
  onSelectJob?: (job: Job) => void;
  onApplyJob?: (job: Job) => void;
  selectedChatTarget?: string;
  candidateMessages?: ChatMessage[];
  onSendCandidateMessage?: (msg: ChatMessage) => void;
}

export const RecruiterAdminChatModal: React.FC<RecruiterAdminChatModalProps> = ({
  isOpen,
  onClose,
  conversations = [],
  onSendMessage,
  currentUser,
  applications = [],
  allJobs = [],
  onSelectJob,
  onApplyJob,
  selectedChatTarget,
  candidateMessages = [],
  onSendCandidateMessage
}) => {
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConvKey, setSelectedConvKey] = useState<string>('admin-helpdesk');
  const [mobileShowThread, setMobileShowThread] = useState(false);
  const [showCandidateProfileModal, setShowCandidateProfileModal] = useState(false);
  const [showCompanyProfileModal, setShowCompanyProfileModal] = useState(false);
  const [selectedCompanyForModal, setSelectedCompanyForModal] = useState<string>('');
  const [viewingAppForProfile, setViewingAppForProfile] = useState<Application | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cuộc hội thoại với Ban Quản Trị Nextstep
  const targetConv = (conversations || []).find(
    c => c && c.partnerType === 'recruiter' && 
         (c.id === 'conv-recruiter-1' || 
          (currentUser?.companyName && c.partnerCompany && (c.partnerCompany || '').toLowerCase().includes((currentUser.companyName || '').toLowerCase())))
  ) || (conversations || []).find(c => c && c.partnerType === 'recruiter') || (conversations || [])[0];

  const convId = targetConv?.id || 'conv-recruiter-1';
  const adminMessages = targetConv?.messages || [];

  // Lọc các ứng viên ứng tuyển vào công ty này
  const companyName = currentUser?.companyName || 'Công ty Cổ phần Công nghệ NextGen';
  const companyApplicants = useMemo(() => {
    const targetCompLower = (companyName || '').toLowerCase().trim();
    const list = (applications || []).filter(a => {
      if (!a) return false;
      const aComp = (a.company || '').toLowerCase().trim();
      return (
        (aComp.length > 0 && aComp === targetCompLower) ||
        aComp.includes('nextgen') ||
        (a.jobTitle && a.jobTitle.toLowerCase().includes('nextgen'))
      );
    });
    // Nhóm theo ứng viên
    const map = new Map<string, Application>();
    list.forEach(app => {
      const key = app.applicantName || app.applicantId || app.id;
      if (!map.has(key)) map.set(key, app);
    });
    return Array.from(map.values());
  }, [applications, companyName]);

  // Tự động đồng bộ đoạn chat được chọn dựa trên selectedChatTarget
  useEffect(() => {
    if (!isOpen) return;
    if (!selectedChatTarget || selectedChatTarget === 'Ban Quản Trị Nextstep' || selectedChatTarget === 'admin-helpdesk') {
      setSelectedConvKey('admin-helpdesk');
    } else {
      const targetLower = selectedChatTarget.toLowerCase().trim();
      const match = companyApplicants.find(a => 
        `applicant-${a.id}` === selectedChatTarget ||
        `applicant-chat-${a.id}` === selectedChatTarget ||
        a.id === selectedChatTarget ||
        (a.applicantName && a.applicantName.toLowerCase().trim() === targetLower) ||
        (a.applicantId && a.applicantId === selectedChatTarget)
      );
      if (match) {
        setSelectedConvKey(`applicant-${match.id}`);
        setMobileShowThread(true);
      }
    }
  }, [isOpen, selectedChatTarget, companyApplicants]);

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, adminMessages.length, selectedConvKey]);

  // Lắng nghe phím Escape để đóng cửa sổ tin nhắn
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Ứng viên đang được chọn (nếu không phải là admin-helpdesk)
  const activeApplicant = companyApplicants.find(a => `applicant-${a.id}` === selectedConvKey);

  // Tin nhắn giữa nhà tuyển dụng và ứng viên đang chọn
  const activeApplicantMessages = useMemo(() => {
    if (!activeApplicant) return [];
    const candId = activeApplicant.applicantId || activeApplicant.id;
    const candName = (activeApplicant.applicantName || '').toLowerCase().trim();
    const appCompany = (activeApplicant.company || currentUser?.companyName || 'Công ty Cổ phần Công nghệ NextGen').toLowerCase().trim();

    return (candidateMessages || []).filter(m => {
      if (!m) return false;
      const matchCand = (m.candidateId && m.candidateId === candId) ||
                        (m.senderName && m.senderName.toLowerCase().trim() === candName);
      const matchComp = !m.company || (m.company || '').toLowerCase().trim() === appCompany || (m.company || '').toLowerCase().includes('nextgen');
      return matchCand || (matchComp && m.sender === 'candidate');
    });
  }, [candidateMessages, activeApplicant, currentUser?.companyName]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (selectedConvKey === 'admin-helpdesk') {
      onSendMessage(convId, inputText.trim());
    } else if (activeApplicant && onSendCandidateMessage) {
      const text = inputText.trim();
      const newMsg: ChatMessage = {
        id: `msg-rec-${Date.now()}`,
        sender: 'recruiter',
        senderName: currentUser?.fullName || 'Vũ Thu Trang (NextGen Tech)',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&auto=format&fit=crop&q=80',
        text,
        timestamp: 'Vừa xong',
        jobTitle: activeApplicant.jobTitle,
        company: activeApplicant.company || currentUser?.companyName || 'Công ty Cổ phần Công nghệ NextGen',
        candidateId: activeApplicant.applicantId || activeApplicant.id
      };
      onSendCandidateMessage(newMsg);

      // Tự động ứng viên phản hồi sau 1.2s
      setTimeout(() => {
        const replies = [
          `Em chào Chị Trang! Em cảm ơn phản hồi của Quý công ty về vị trí ${activeApplicant.jobTitle}. Em rất sẵn lòng tham gia phỏng vấn ạ!`,
          `Dạ em đã nhận được tin nhắn trao đổi từ NextGen Tech rồi ạ. Em sẽ chuẩn bị tài liệu và có mặt đúng hẹn!`,
          `Em chào Chị, em rất cảm ơn nhà tuyển dụng đã quan tâm đến hồ sơ của em. Em mong sớm được trao đổi chi tiết hơn về công việc ạ.`
        ];
        const replyText = replies[Math.floor(Math.random() * replies.length)];
        const replyMsg: ChatMessage = {
          id: `msg-cand-reply-${Date.now()}`,
          sender: 'candidate',
          senderName: activeApplicant.applicantName || 'Nguyễn Hoàng Minh',
          avatar: activeApplicant.applicantAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
          text: replyText,
          timestamp: 'Vừa xong',
          jobTitle: activeApplicant.jobTitle,
          company: activeApplicant.company || currentUser?.companyName || 'Công ty Cổ phần Công nghệ NextGen',
          candidateId: activeApplicant.applicantId || activeApplicant.id
        };
        onSendCandidateMessage(replyMsg);
      }, 1200);
    }
    setInputText('');
  };

  const handleQuickPrompt = (text: string) => {
    if (selectedConvKey === 'admin-helpdesk') {
      onSendMessage(convId, text);
    } else if (activeApplicant && onSendCandidateMessage) {
      const newMsg: ChatMessage = {
        id: `msg-rec-${Date.now()}`,
        sender: 'recruiter',
        senderName: currentUser?.fullName || 'Vũ Thu Trang (NextGen Tech)',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&auto=format&fit=crop&q=80',
        text,
        timestamp: 'Vừa xong',
        jobTitle: activeApplicant.jobTitle,
        company: activeApplicant.company || currentUser?.companyName || 'Công ty Cổ phần Công nghệ NextGen',
        candidateId: activeApplicant.applicantId || activeApplicant.id
      };
      onSendCandidateMessage(newMsg);
    }
  };

  // Profile đầy đủ của ứng viên đang xem
  const activeCandidateProfile = useMemo(() => {
    const targetApp = viewingAppForProfile || activeApplicant;
    if (!targetApp) return null;
    return getCandidateProfileForApplicant({
      applicantName: targetApp.applicantName,
      applicantId: targetApp.id,
      application: targetApp
    });
  }, [viewingAppForProfile, activeApplicant]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/65 backdrop-blur-xs flex justify-end animate-in fade-in duration-150 cursor-pointer"
      onClick={onClose}
    >
      <div 
        id="recruiter-admin-chat-drawer"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl lg:max-w-5xl bg-white h-full shadow-2xl flex flex-col md:flex-row animate-in slide-in-from-right duration-200 cursor-default"
      >
        {/* ========================================================================= */}
        {/* CỘT TRÁI: TẤT CẢ ĐOẠN CHAT (BQT NEXTSTEP & ỨNG VIÊN TUYỂN DỤNG) */}
        {/* ========================================================================= */}
        <div className={`w-full md:w-80 lg:w-88 border-r border-slate-200 bg-slate-50/70 flex flex-col shrink-0 ${
          mobileShowThread ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Header Cột Trái */}
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Tất cả đoạn chat</h3>
                  <p className="text-[11px] text-slate-500">
                    Hỗ trợ BQT &amp; Ứng viên tuyển dụng
                  </p>
                </div>
              </div>

              {/* Nút đóng cửa sổ tin nhắn trên cả Desktop & Mobile */}
              <button
                type="button"
                id="recruiter-admin-chat-close-left"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onClose();
                }}
                className="p-1.5 px-3 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold border border-slate-200 shadow-2xs relative z-30"
                title="Đóng cửa sổ tin nhắn (Phím Esc)"
              >
                <X className="w-4 h-4 pointer-events-none" />
                <span className="pointer-events-none">Đóng</span>
              </button>
            </div>

            {/* Ô tìm kiếm */}
            <div className="mt-3 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm đoạn chat, ứng viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Danh sách các đoạn chat */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-100">
            {/* 1. Ban Quản Trị Nextstep */}
            <div
              onClick={() => {
                setSelectedConvKey('admin-helpdesk');
                setMobileShowThread(true);
              }}
              className={`p-3 rounded-2xl transition-all cursor-pointer border flex items-start gap-3 ${
                selectedConvKey === 'admin-helpdesk'
                  ? 'bg-white border-teal-500 shadow-sm ring-1 ring-teal-500/20'
                  : 'bg-white/60 hover:bg-white border-transparent hover:border-slate-200'
              }`}
            >
              <div className="relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80"
                  alt="Admin Nextstep"
                  className="w-11 h-11 rounded-xl object-cover border border-teal-200 bg-white"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white"></span>
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className={`text-xs font-bold truncate flex items-center gap-1 ${
                    selectedConvKey === 'admin-helpdesk' ? 'text-teal-800' : 'text-slate-900'
                  }`}>
                    <span>Ban Quản Trị Nextstep</span>
                    <BadgeCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  </h4>
                  <span className="text-[10px] text-slate-400 shrink-0">10:30</span>
                </div>

                <p className="text-[10px] text-teal-700 font-semibold truncate">
                  Kênh giải đáp hỗ trợ doanh nghiệp 24/7
                </p>

                <p className="text-[11px] text-slate-600 line-clamp-1 leading-snug">
                  {targetConv?.lastMessage || 'Nextstep luôn sẵn sàng hỗ trợ nhà tuyển dụng.'}
                </p>

                <div className="pt-0.5 flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full border bg-purple-100 text-purple-800 border-purple-200">
                    BQT Hỗ Trợ
                  </span>
                  {selectedConvKey === 'admin-helpdesk' && (
                    <span className="text-[10px] text-teal-600 font-bold flex items-center gap-0.5">
                      <span>Đang mở</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Danh sách các ứng viên đã nộp đơn */}
            {companyApplicants.map((app) => {
              const itemKey = `applicant-${app.id}`;
              const isSelected = selectedConvKey === itemKey;
              const isInterview = app.status === 'interview';
              const isViewed = app.status === 'viewed';

              const statusBadge = isInterview ? 'Đã mời PV' : isViewed ? 'Đã xem CV' : 'Mới nộp CV';
              const statusBg = isInterview ? 'bg-purple-100 text-purple-800 border-purple-200' :
                               isViewed ? 'bg-cyan-100 text-cyan-800 border-cyan-200' :
                               'bg-amber-100 text-amber-800 border-amber-200';

              return (
                <div
                  key={app.id}
                  onClick={() => {
                    setSelectedConvKey(itemKey);
                    setMobileShowThread(true);
                  }}
                  className={`p-3 rounded-2xl transition-all cursor-pointer border flex items-start gap-3 ${
                    isSelected
                      ? 'bg-white border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                      : 'bg-white/60 hover:bg-white border-transparent hover:border-slate-200'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={app.applicantAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80'}
                      alt={app.applicantName}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 bg-white"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white"></span>
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className={`text-xs font-bold truncate ${
                        isSelected ? 'text-blue-700' : 'text-slate-900'
                      }`}>
                        {app.applicantName || 'Ứng viên'}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {app.appliedAt ? app.appliedAt.split(' ')[0] : 'Vừa xong'}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-500 font-medium truncate">
                      Vị trí: {app.jobTitle}
                    </p>

                    <p className="text-[11px] text-slate-600 line-clamp-1 leading-snug">
                      {app.notes || `Đơn ứng tuyển gửi lúc ${app.appliedAt}`}
                    </p>

                    <div className="pt-0.5 flex items-center justify-between">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${statusBg}`}>
                        {statusBadge}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedConvKey(`applicant-${app.id}`);
                          setMobileShowThread(true);
                          setViewingAppForProfile(app);
                          setShowCandidateProfileModal(true);
                        }}
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
                        title="Bấm xem trang hồ sơ CV ứng viên"
                      >
                        <User className="w-3 h-3" />
                        <span>Hồ sơ</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CỘT PHẢI: CHI TIẾT CUỘC TRÒ CHUYỆN (ACTIVE CHAT THREAD) */}
        {/* ========================================================================= */}
        <div className={`flex-1 flex flex-col bg-white min-w-0 ${
          !mobileShowThread ? 'hidden md:flex' : 'flex'
        }`}>
          {selectedConvKey === 'admin-helpdesk' ? (
            /* KHUNG CHAT VỚI BAN QUẢN TRỊ NEXTSTEP */
            <>
              {/* HEADER */}
              <div className="p-4 bg-gradient-to-r from-[#0D2B52] via-[#103E6B] to-[#137E8F] text-white shrink-0 relative">
                <button
                  type="button"
                  id="recruiter-admin-chat-close-right-admin"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClose();
                  }}
                  className="absolute top-4 right-4 p-2 px-3 rounded-xl bg-white/10 hover:bg-rose-600 text-white font-bold transition-all cursor-pointer z-30 flex items-center gap-1.5 border border-white/20 shadow-xs"
                  title="Đóng cửa sổ tin nhắn (Phím Esc)"
                >
                  <X className="w-4 h-4 pointer-events-none" />
                  <span className="text-xs pointer-events-none">Đóng</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMobileShowThread(false)}
                    className="md:hidden p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer shrink-0 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Đoạn chat</span>
                  </button>

                  <div 
                    onClick={() => {
                      setSelectedCompanyForModal('Ban Quản Trị Nextstep');
                      setShowCompanyProfileModal(true);
                    }}
                    className="flex items-center gap-3 min-w-0 cursor-pointer group"
                    title="Bấm để xem thông tin hồ sơ Ban Quản Trị Nextstep"
                  >
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-2xl bg-white p-0.5 flex items-center justify-center shadow-md group-hover:ring-2 group-hover:ring-teal-300 transition-all">
                        <img 
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80" 
                          alt="Admin Nextstep"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0D2B52] rounded-full"></span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-white group-hover:text-teal-200 flex items-center gap-1.5 transition-colors">
                          Ban Quản Trị Nextstep
                          <BadgeCheck className="w-4 h-4 text-teal-300 inline" />
                        </h3>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-200 border border-teal-300/30 flex items-center gap-1">
                          <span>Hồ sơ BQT</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      </div>
                      <p className="text-xs text-teal-100/90 flex items-center gap-2 mt-0.5">
                        <span>admin@nextstep.vn</span>
                        <span>•</span>
                        <span>Hotline TA: 0988 999 888</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Notice Pill */}
                <div className="mt-3 py-1.5 px-3 rounded-xl bg-white/10 backdrop-blur-xs text-[11px] text-teal-100 flex items-center justify-between border border-white/10">
                  <button 
                    type="button"
                    onClick={() => {
                      setSelectedCompanyForModal(companyName);
                      setShowCompanyProfileModal(true);
                    }}
                    className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors text-left"
                    title="Bấm xem trang hồ sơ doanh nghiệp của bạn"
                  >
                    <Building2 className="w-3.5 h-3.5 text-teal-300 shrink-0" />
                    <span>Doanh nghiệp: <strong className="text-white font-bold underline decoration-dotted">{companyName}</strong></span>
                    <ExternalLink className="w-2.5 h-2.5 text-teal-300" />
                  </button>
                  <span className="text-[10px] text-emerald-300 font-bold flex items-center gap-1 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Admin Đang Online
                  </span>
                </div>
              </div>

              {/* QUICK SUGGESTIONS */}
              <div className="p-2.5 bg-slate-50 border-b border-slate-200 shrink-0">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" /> Câu hỏi nhanh thường gặp:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleQuickPrompt('Admin hỗ trợ kích hoạt huy hiệu "Tuyển Gấp" và đẩy tin lên Top giúp công ty mình với nhé!')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700 hover:border-teal-400 hover:text-teal-700 hover:bg-teal-50/50 transition-colors font-medium cursor-pointer shadow-2xs"
                  >
                    🔥 Đẩy tin Tuyển Gấp lên Top
                  </button>
                  <button
                    onClick={() => handleQuickPrompt('Bên mình cần xuất hóa đơn VAT điện tử cho gói tin tuyển dụng vừa thanh toán.')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700 hover:border-teal-400 hover:text-teal-700 hover:bg-teal-50/50 transition-colors font-medium cursor-pointer shadow-2xs"
                  >
                    📄 Yêu cầu xuất hóa đơn VAT
                  </button>
                  <button
                    onClick={() => handleQuickPrompt('Cho mình hỏi cách tải hàng loạt CV ứng viên dạng file zip để gửi cho ban phỏng vấn.')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700 hover:border-teal-400 hover:text-teal-700 hover:bg-teal-50/50 transition-colors font-medium cursor-pointer shadow-2xs"
                  >
                    📦 Hướng dẫn tải CV hàng loạt
                  </button>
                </div>
              </div>

              {/* MESSAGES LIST */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F8FAFC]">
                {adminMessages.map((msg) => {
                  const isPartner = msg.sender === 'partner';
                  return (
                    <div 
                      key={msg.id}
                      className={`flex gap-2.5 max-w-[88%] ${isPartner ? 'ml-auto flex-row-reverse' : ''}`}
                    >
                      {!isPartner && (
                        <img 
                          src={msg.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80'}
                          alt="Admin"
                          className="w-8 h-8 rounded-xl object-cover shrink-0 mt-0.5 border border-purple-200 shadow-2xs"
                        />
                      )}
                      {isPartner && (
                        <img 
                          src={currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&auto=format&fit=crop&q=80'}
                          alt="Recruiter"
                          className="w-8 h-8 rounded-xl object-cover shrink-0 mt-0.5 border border-teal-200 shadow-2xs"
                        />
                      )}

                      <div>
                        <div className={`flex items-center gap-1.5 mb-1 text-[11px] ${isPartner ? 'justify-end' : ''}`}>
                          <span className="font-bold text-slate-800">
                            {isPartner ? (currentUser?.fullName || 'Vũ Thu Trang (NextGen Tech)') : 'Ban Quản Trị Nextstep'}
                          </span>
                          <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                        </div>

                        <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                          isPartner 
                            ? 'bg-gradient-to-r from-[#0D2B52] to-[#137E8F] text-white rounded-tr-xs' 
                            : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* INPUT FORM */}
              <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <input 
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Nhập tin nhắn gửi tới Ban Quản Trị Nextstep..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#137E8F] focus:border-transparent outline-hidden"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-4 py-2.5 bg-[#0D2B52] hover:bg-[#137E8F] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>Gửi</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          ) : activeApplicant ? (
            /* KHUNG TRAO ĐỔI VỚI ỨNG VIÊN ĐÃ ỨNG TUYỂN */
            <>
              {/* TOP HEADER */}
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setMobileShowThread(false)}
                    className="md:hidden p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-bold cursor-pointer shrink-0 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Đoạn chat</span>
                  </button>

                  <div 
                    onClick={() => {
                      setViewingAppForProfile(activeApplicant);
                      setShowCandidateProfileModal(true);
                    }}
                    className="flex items-center gap-3 min-w-0 cursor-pointer group"
                    title="Bấm để xem toàn bộ hồ sơ CV ứng viên"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={activeApplicant.applicantAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80'}
                        alt={activeApplicant.applicantName}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500 group-hover:ring-blue-600 bg-white transition-all shadow-xs"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white"></span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 truncate transition-colors">
                          {activeApplicant.applicantName}
                        </h3>
                        <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200/80 group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center gap-0.5 shrink-0">
                          <User className="w-2.5 h-2.5" />
                          <span>Hồ sơ ứng viên</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        Vị trí ứng tuyển: <strong className="text-blue-600">{activeApplicant.jobTitle}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  id="recruiter-admin-chat-close-right-cand"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClose();
                  }}
                  className="p-2 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border border-slate-200 shadow-2xs relative z-30"
                  title="Đóng cửa sổ tin nhắn (Phím Esc)"
                >
                  <X className="w-4 h-4 pointer-events-none" />
                  <span className="text-xs pointer-events-none">Đóng</span>
                </button>
              </div>

              {/* THÔNG TIN HỒ SƠ ỨNG VIÊN */}
              <div className="p-3.5 px-4 bg-blue-50/60 border-b border-blue-100 flex items-center justify-between gap-3 text-xs">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap text-slate-700">
                    <span>Email: <strong>{activeApplicant.applicantEmail || 'Chưa cung cấp'}</strong></span>
                    <span>•</span>
                    <span>SĐT: <strong>{activeApplicant.applicantPhone || '0988 765 432'}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Hồ sơ đính kèm: <strong>{activeApplicant.cvName}</strong></span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setViewingAppForProfile(activeApplicant);
                    setShowCandidateProfileModal(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white border border-blue-200 hover:border-blue-400 hover:bg-blue-50 text-blue-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Xem hồ sơ chi tiết</span>
                  <ExternalLink className="w-3 h-3 text-blue-500" />
                </button>
              </div>

              {/* QUICK PROMPT CHIPS CHO NHÀ TUYỂN DỤNG */}
              <div className="px-4 py-2 bg-slate-100/80 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  Gợi ý nhanh:
                </span>
                {[
                  'Chào bạn, NextGen Tech đã nhận được CV và muốn mời bạn tham gia phỏng vấn online nhé!',
                  'Hồ sơ của bạn rất phù hợp với vị trí này, bạn có thể trao đổi mức lương dự kiến mong muốn không?',
                  'Bạn có thể gửi thêm link GitHub hoặc Portfolio các dự án thực tế bạn từng thực hiện không?'
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickPrompt(prompt)}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-slate-700 text-[11px] font-medium border border-slate-200 shrink-0 transition-all cursor-pointer shadow-2xs"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* MESSAGES THREAD VỚI ỨNG VIÊN */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F8FAFC]">
                {/* Banner trạng thái ban đầu */}
                <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-slate-900">
                        Đơn ứng tuyển vị trí {activeApplicant.jobTitle}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Nộp hồ sơ lúc {activeApplicant.appliedAt || 'gần đây'} • Trạng thái: <strong>{activeApplicant.status === 'interview' ? 'Đã lên lịch phỏng vấn' : activeApplicant.status === 'offered' ? 'Đã trúng tuyển' : 'Đã duyệt hồ sơ'}</strong>
                      </p>
                    </div>
                  </div>
                  {activeApplicant.interviewDate && (
                    <span className="text-[11px] bg-purple-50 text-purple-800 font-bold px-2.5 py-1 rounded-xl border border-purple-200 shrink-0 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-purple-600" />
                      <span>Lịch PV: {activeApplicant.interviewDate}</span>
                    </span>
                  )}
                </div>

                {/* Danh sách tin nhắn */}
                {activeApplicantMessages.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 space-y-2 max-w-sm mx-auto">
                    <MessageSquare className="w-10 h-10 text-blue-200 mx-auto stroke-1" />
                    <p className="text-xs font-bold text-slate-700">
                      Bắt đầu cuộc trò chuyện với {activeApplicant.applicantName}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Hãy gửi lời chào, đặt lịch phỏng vấn hoặc giải đáp thắc mắc của ứng viên qua khung chat bảo mật này.
                    </p>
                  </div>
                ) : (
                  activeApplicantMessages.map((msg) => {
                    const isMe = msg.sender === 'recruiter';
                    return (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <img
                          src={isMe ? (currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&auto=format&fit=crop&q=80') : (activeApplicant.applicantAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80')}
                          alt={msg.senderName}
                          className="w-8 h-8 rounded-xl object-cover shrink-0 mt-0.5 border border-slate-200 shadow-2xs"
                        />
                        <div className={`max-w-[78%] space-y-1 ${isMe ? 'text-right' : 'text-left'}`}>
                          <div className={`flex items-center gap-1.5 text-[11px] ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <span className="font-bold text-slate-800">
                              {isMe ? (currentUser?.fullName || 'Vũ Thu Trang (HR Director)') : msg.senderName}
                            </span>
                            <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                          </div>
                          <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-2xs inline-block text-left ${
                            isMe
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs'
                              : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* INPUT BAR */}
              <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <input 
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Nhập tin nhắn gửi tới ${activeApplicant.applicantName}...`}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-hidden"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>Gửi</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          ) : null}
        </div>
      </div>

      {/* MODAL TRANG HỒ SƠ ỨNG VIÊN */}
      {activeCandidateProfile && (
        <CandidateProfileDetailModal
          isOpen={showCandidateProfileModal}
          onClose={() => setShowCandidateProfileModal(false)}
          profile={activeCandidateProfile}
          currentApplication={viewingAppForProfile || activeApplicant || undefined}
          onOpenChatWithCandidate={() => setShowCandidateProfileModal(false)}
        />
      )}

      {/* MODAL TRANG HỒ SƠ DOANH NGHIỆP / BQT NEXTSTEP */}
      <CompanyProfileModal
        isOpen={showCompanyProfileModal}
        onClose={() => setShowCompanyProfileModal(false)}
        companyName={selectedCompanyForModal || 'Ban Quản Trị Nextstep'}
        allJobs={allJobs}
        onSelectJob={onSelectJob}
        onApplyJob={onApplyJob}
      />
    </div>
  );
};
