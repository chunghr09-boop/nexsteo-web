import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  Building2, 
  CheckCheck, 
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  AlertCircle,
  Search,
  ChevronRight,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  BadgeCheck,
  ExternalLink
} from 'lucide-react';
import { ChatMessage, CandidateProfile, Application, Job } from '../types';
import { CompanyProfileModal } from './CompanyProfileModal';

interface RecruiterChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (msg: ChatMessage) => void;
  profile: CandidateProfile;
  activeRecruiterCompany?: string;
  applications?: Application[];
  onSelectCompany?: (company: string) => void;
  allJobs?: Job[];
  onSelectJob?: (job: Job) => void;
  onApplyJob?: (job: Job) => void;
}

export const RecruiterChatModal: React.FC<RecruiterChatModalProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  profile,
  activeRecruiterCompany,
  applications = [],
  onSelectCompany,
  allJobs = [],
  onSelectJob,
  onApplyJob
}) => {
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'unread'>('all');
  const [mobileShowThread, setMobileShowThread] = useState(false);
  const [showCompanyProfile, setShowCompanyProfile] = useState(false);
  const [profileModalCompany, setProfileModalCompany] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const candidateId = profile.id.startsWith('user-') ? profile.id : `user-${profile.id}`;
  const isDefaultCandidate = profile.id === 'cand-001' || profile.id === 'user-cand-001';

  // Lọc tin nhắn thuộc về ứng viên này
  const candidateMessages = useMemo(() => {
    return messages.filter(m => {
      if (m.candidateId) {
        return m.candidateId === profile.id || m.candidateId === candidateId || profile.id.includes(m.candidateId);
      }
      return isDefaultCandidate;
    });
  }, [messages, profile.id, candidateId, isDefaultCandidate]);

  // Thu thập tất cả các đối tác hội thoại (Công ty đã ứng tuyển / đã nhắn tin + Ban Quản Trị Nextstep)
  const availableCompanies = useMemo(() => {
    const list: string[] = [];
    if (activeRecruiterCompany && !list.includes(activeRecruiterCompany)) {
      list.push(activeRecruiterCompany);
    }
    applications.forEach(app => {
      if (app.company && !list.includes(app.company)) {
        list.push(app.company);
      }
    });
    candidateMessages.forEach(msg => {
      if (msg.company && !list.includes(msg.company)) {
        list.push(msg.company);
      }
    });
    // Luôn bao gồm Ban Quản Trị Nextstep trong danh sách chat
    if (!list.includes('Ban Quản Trị Nextstep')) {
      list.push('Ban Quản Trị Nextstep');
    }
    if (list.length === 1 && !list.includes('Công ty Cổ phần Công nghệ NextGen')) {
      list.unshift('Công ty Cổ phần Công nghệ NextGen');
    }
    return list;
  }, [activeRecruiterCompany, applications, candidateMessages]);

  const [selectedCompany, setSelectedCompany] = useState<string>(
    activeRecruiterCompany || availableCompanies[0] || 'Công ty Cổ phần Công nghệ NextGen'
  );

  useEffect(() => {
    if (activeRecruiterCompany) {
      setSelectedCompany(activeRecruiterCompany);
      setMobileShowThread(true);
    } else if (!selectedCompany && availableCompanies.length > 0) {
      setSelectedCompany(availableCompanies[0]);
    } else if (!availableCompanies.includes(selectedCompany) && availableCompanies.length > 0) {
      setSelectedCompany(availableCompanies[0]);
    }
  }, [activeRecruiterCompany, availableCompanies, selectedCompany]);

  const handleSwitchCompany = (company: string) => {
    setSelectedCompany(company);
    setMobileShowThread(true);
    if (onSelectCompany) {
      onSelectCompany(company);
    }
  };

  // Thông tin đơn ứng tuyển tương ứng với công ty đang chọn
  const currentApp = useMemo(() => {
    return applications.find(
      a => a.company.toLowerCase().trim() === selectedCompany.toLowerCase().trim()
    );
  }, [applications, selectedCompany]);

  // Lọc tin nhắn của cuộc trò chuyện đang chọn
  const companyMessages = useMemo(() => {
    return candidateMessages.filter(m => {
      if (m.company) {
        return m.company.toLowerCase().trim() === selectedCompany.toLowerCase().trim();
      }
      if (isDefaultCandidate && (m.id === 'msg-1' || m.id === 'msg-2' || m.text.includes('VNG') || m.text.includes('Lan Anh'))) {
        return selectedCompany.toLowerCase().includes('vng');
      }
      return false;
    });
  }, [candidateMessages, selectedCompany, isDefaultCandidate]);

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, companyMessages.length, selectedCompany]);

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

  // Chuẩn bị thông tin tóm tắt cho từng cuộc hội thoại ở thanh danh sách
  const conversationSummaries = useMemo(() => {
    return availableCompanies.map(comp => {
      const isCompAdmin = comp.includes('Ban Quản Trị') || comp.includes('Nextstep');
      const compApp = applications.find(a => a.company.toLowerCase().trim() === comp.toLowerCase().trim());
      
      const compMsgs = candidateMessages.filter(m => {
        if (m.company) return m.company.toLowerCase().trim() === comp.toLowerCase().trim();
        if (isDefaultCandidate && comp.toLowerCase().includes('vng') && (m.id === 'msg-1' || m.id === 'msg-2')) return true;
        return false;
      });

      const lastMsg = compMsgs.length > 0 ? compMsgs[compMsgs.length - 1] : null;
      const unreadCount = compMsgs.filter(m => m.sender === 'recruiter' || m.sender === 'admin').length;

      let previewText = 'Chưa có tin nhắn. Nhấp để bắt đầu trao đổi...';
      if (lastMsg) {
        previewText = lastMsg.text;
      } else if (compApp) {
        previewText = `Hồ sơ ứng tuyển vị trí "${compApp.jobTitle}" đã được gửi thành công.`;
      } else if (isCompAdmin) {
        previewText = 'Nextstep luôn sẵn sàng hỗ trợ giải đáp mọi thắc mắc và tối ưu CV của bạn.';
      }

      const avatar = isCompAdmin 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80'
        : (compApp?.companyLogo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&auto=format&fit=crop&q=80');

      let statusBadge = isCompAdmin ? 'Hỗ trợ 24/7' : 'Đang thẩm định';
      let statusColor: 'purple' | 'cyan' | 'emerald' | 'amber' = isCompAdmin ? 'purple' : 'amber';

      if (compApp) {
        if (compApp.status === 'interview') {
          statusBadge = 'Đã mời phỏng vấn';
          statusColor = 'purple';
        } else if (compApp.status === 'offered') {
          statusBadge = 'Đã trúng tuyển';
          statusColor = 'emerald';
        } else if (compApp.status === 'viewed') {
          statusBadge = 'Đã xem hồ sơ';
          statusColor = 'cyan';
        }
      }

      return {
        company: comp,
        isAdmin: isCompAdmin,
        jobTitle: compApp?.jobTitle,
        avatar,
        previewText,
        lastTime: lastMsg ? lastMsg.timestamp : (compApp?.appliedAt ? compApp.appliedAt.split(' ')[0] : 'Vừa xong'),
        unreadCount,
        statusBadge,
        statusColor
      };
    });
  }, [availableCompanies, applications, candidateMessages, isDefaultCandidate]);

  // Lọc danh sách theo tìm kiếm và tab
  const filteredSummaries = useMemo(() => {
    let list = conversationSummaries;
    if (filterTab === 'unread') {
      list = list.filter(c => c.unreadCount > 0);
    }
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(c => 
      c.company.toLowerCase().includes(q) ||
      (c.jobTitle && c.jobTitle.toLowerCase().includes(q)) ||
      c.previewText.toLowerCase().includes(q)
    );
  }, [conversationSummaries, filterTab, searchQuery]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText.trim();
    const activeCandId = profile.id.startsWith('user-') ? profile.id : `user-${profile.id}`;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'candidate',
      senderName: profile.fullName,
      avatar: profile.avatar,
      text: textToSend,
      timestamp: 'Vừa xong',
      company: selectedCompany,
      jobTitle: currentApp?.jobTitle,
      candidateId: activeCandId
    };

    onSendMessage(newMsg);
    setInputText('');

    // Tự động phản hồi mô phỏng (Phân biệt Admin Nextstep vs Nhà tuyển dụng)
    setTimeout(() => {
      const isCompAdmin = selectedCompany.includes('Ban Quản Trị') || selectedCompany.includes('Nextstep');
      
      let replyText = '';
      let senderName = `Tuyển dụng ${selectedCompany}`;
      let avatar = currentApp?.companyLogo || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&auto=format&fit=crop&q=80";

      if (isCompAdmin) {
        senderName = 'Ban Quản Trị Nextstep';
        avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80';
        const adminReplies = [
          `Chào bạn ${profile.fullName}! Ban Quản Trị Nextstep đã nhận được câu hỏi. Đội ngũ hỗ trợ chuyên môn đang xử lý và sẽ phản hồi chi tiết tới bạn nhé!`,
          `Cảm ơn bạn đã liên hệ! Nextstep cam kết hỗ trợ ứng viên kết nối với nhà tuyển dụng phù hợp và bảo vệ quyền lợi ứng viên 24/7.`,
          `Chào bạn, hồ sơ và các thắc mắc của bạn đã được ghi nhận vào hệ thống hỗ trợ ưu tiên của Nextstep rồi nhé!`
        ];
        replyText = adminReplies[Math.floor(Math.random() * adminReplies.length)];
      } else {
        const isInterview = currentApp?.status === 'interview';
        const screeningReplies = [
          `Chào bạn ${profile.fullName}! Ban tuyển dụng ${selectedCompany} đã nhận được tin nhắn. Hồ sơ của bạn đang được bộ phận nhân sự thẩm định sơ bộ và sẽ thông báo kết quả sớm nhất nhé!`,
          `Cảm ơn bạn đã liên hệ! Chúng mình đã ghi nhận thông tin và sẽ phản hồi bạn trong giờ hành chính sớm nhất có thể.`,
          `Chào bạn, hiện tại CV của bạn đang trong quy trình đánh giá chuyên môn sơ bộ. Khi có cập nhật mới, nhà tuyển dụng sẽ liên hệ trực tiếp với bạn nhé.`
        ];

        const interviewReplies = [
          `Chào bạn ${profile.fullName}! Ban tuyển dụng ${selectedCompany} đã ghi nhận trao đổi của bạn. Bạn vui lòng chuẩn bị sẵn sàng cho lịch phỏng vấn đã được thông báo nhé!`,
          `Cảm ơn bạn! Ban tuyển dụng rất mong đợi được trao đổi chi tiết hơn với bạn trong buổi phỏng vấn sắp tới.`,
          `Chào bạn, nếu có bất kỳ thay đổi nào về thời gian phỏng vấn, nhà tuyển dụng sẽ gửi email hoặc liên hệ trực tiếp cho bạn nhé!`
        ];

        const replies = isInterview ? interviewReplies : screeningReplies;
        replyText = replies[Math.floor(Math.random() * replies.length)];
      }

      const recruiterMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: isCompAdmin ? 'admin' : 'recruiter',
        senderName,
        avatar,
        text: replyText,
        timestamp: 'Vừa xong',
        company: selectedCompany,
        jobTitle: currentApp?.jobTitle,
        candidateId: activeCandId
      };

      onSendMessage(recruiterMsg);
    }, 1200);
  };

  const handleQuickPrompt = (promptText: string) => {
    setInputText(promptText);
  };

  const isSelectedAdmin = selectedCompany.includes('Ban Quản Trị') || selectedCompany.includes('Nextstep');

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-150 cursor-pointer"
      onClick={onClose}
    >
      <div 
        id="recruiter-chat-drawer"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl lg:max-w-5xl bg-white h-full shadow-2xl flex flex-col md:flex-row animate-in slide-in-from-right duration-200 cursor-default"
      >
        {/* ========================================================================= */}
        {/* CỘT TRÁI: TẤT CẢ ĐOẠN CHAT (DANH SÁCH TOÀN BỘ CUỘC HỘI THOẠI) */}
        {/* ========================================================================= */}
        <div className={`w-full md:w-80 lg:w-88 border-r border-slate-200 bg-slate-50/70 flex flex-col shrink-0 ${
          mobileShowThread ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Header Cột Trái */}
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Tất cả đoạn chat</h3>
                  <p className="text-[11px] text-slate-500">
                    {availableCompanies.length} cuộc hội thoại
                  </p>
                </div>
              </div>

              {/* Nút đóng cửa sổ tin nhắn (Hiển thị rõ ràng trên cả Desktop & Mobile) */}
              <button
                type="button"
                id="recruiter-chat-close-left"
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

            {/* Ô tìm kiếm đoạn chat */}
            <div className="mt-3 relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm công ty, vị trí..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
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

            {/* Bộ lọc Tabs */}
            <div className="mt-2.5 flex items-center gap-1">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  filterTab === 'all'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả ({availableCompanies.length})
              </button>
              <button
                onClick={() => setFilterTab('unread')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  filterTab === 'unread'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Chưa đọc
              </button>
            </div>
          </div>

          {/* Danh sách các thẻ hội thoại */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
            {filteredSummaries.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2 px-4">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto stroke-1" />
                <p className="text-xs font-semibold text-slate-600">Không tìm thấy đoạn chat phù hợp</p>
                <p className="text-[11px] text-slate-400">Thử tìm kiếm với tên công ty khác</p>
              </div>
            ) : (
              filteredSummaries.map((item) => {
                const isSelected = item.company.toLowerCase().trim() === selectedCompany.toLowerCase().trim();
                const badgeBg = 
                  item.statusColor === 'purple' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                  item.statusColor === 'emerald' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                  item.statusColor === 'cyan' ? 'bg-cyan-100 text-cyan-800 border-cyan-200' :
                  'bg-amber-100 text-amber-800 border-amber-200';

                return (
                  <div
                    key={item.company}
                    onClick={() => handleSwitchCompany(item.company)}
                    className={`p-3 rounded-2xl transition-all cursor-pointer border flex items-start gap-3 ${
                      isSelected
                        ? 'bg-white border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                        : 'bg-white/60 hover:bg-white border-transparent hover:border-slate-200'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={item.avatar}
                        alt={item.company}
                        className={`w-11 h-11 rounded-xl object-cover border bg-white ${
                          isSelected ? 'ring-2 ring-blue-500 border-blue-200' : 'border-slate-200'
                        }`}
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white"></span>
                      {item.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full ring-2 ring-white"></span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className={`text-xs font-bold truncate ${
                          isSelected ? 'text-blue-700' : 'text-slate-900'
                        }`}>
                          {item.isAdmin ? item.company : `Tuyển dụng ${item.company}`}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0">{item.lastTime}</span>
                      </div>

                      {item.jobTitle && (
                        <p className="text-[10px] text-slate-500 font-medium truncate">
                          {item.jobTitle}
                        </p>
                      )}

                      <p className="text-[11px] text-slate-600 line-clamp-1 leading-snug">
                        {item.previewText}
                      </p>

                      <div className="pt-0.5 flex items-center justify-between">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${badgeBg}`}>
                          {item.statusBadge}
                        </span>
                        <div className="flex items-center gap-1.5 ml-auto">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProfileModalCompany(item.company);
                              setShowCompanyProfile(true);
                            }}
                            className="text-[10px] text-blue-600 hover:text-blue-800 font-bold hover:underline flex items-center gap-0.5 cursor-pointer bg-blue-50/80 hover:bg-blue-100 px-1.5 py-0.5 rounded transition-colors"
                            title="Bấm để xem trang hồ sơ doanh nghiệp"
                          >
                            <span>Hồ sơ</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                          {isSelected && (
                            <span className="text-[10px] text-blue-600 font-bold flex items-center gap-0.5">
                              <ChevronRight className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CỘT PHẢI: NỘI DUNG CUỘC TRÒ CHUYỆN (ACTIVE CHAT THREAD) */}
        {/* ========================================================================= */}
        <div className={`flex-1 flex flex-col bg-white min-w-0 ${
          !mobileShowThread ? 'hidden md:flex' : 'flex'
        }`}>
          {/* Top Header */}
          <div className="p-3.5 sm:p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              {/* Nút quay lại danh sách trên mobile */}
              <button
                onClick={() => setMobileShowThread(false)}
                className="md:hidden p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer shrink-0 flex items-center gap-1 text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Đoạn chat</span>
              </button>

              {/* Thông tin đối tác: Bấm vào tên hoặc avatar để mở trang hồ sơ doanh nghiệp */}
              <div 
                onClick={() => {
                  setProfileModalCompany(selectedCompany);
                  setShowCompanyProfile(true);
                }}
                className="flex items-center gap-3 min-w-0 cursor-pointer group hover:opacity-90 transition-opacity"
                title="Bấm để xem trang hồ sơ doanh nghiệp"
              >
                <div className="relative shrink-0">
                  <img
                    src={
                      isSelectedAdmin
                        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80'
                        : (currentApp?.companyLogo || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&auto=format&fit=crop&q=80")
                    }
                    alt={selectedCompany}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500 group-hover:ring-blue-600 bg-white transition-all shadow-xs"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white"></span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 truncate transition-colors">
                      {isSelectedAdmin ? selectedCompany : `Tuyển dụng ${selectedCompany}`}
                    </h3>
                    {isSelectedAdmin ? (
                      <BadgeCheck className="w-4 h-4 text-purple-600 shrink-0 inline" />
                    ) : (
                      <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200/80 group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center gap-0.5 shrink-0">
                        <Building2 className="w-2.5 h-2.5" />
                        <span className="hidden sm:inline">Trang hồ sơ</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span>{isSelectedAdmin ? 'Kênh hỗ trợ ứng viên Nextstep 24/7' : 'Trực tuyến hỗ trợ ứng viên (Bấm xem hồ sơ)'}</span>
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              id="recruiter-chat-close-right"
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

          {/* Application Status Banner Bar */}
          {currentApp && (
            <div className="px-4 py-2 bg-blue-50/70 border-b border-blue-100/80 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-blue-900 truncate pr-2">
                <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">Vị trí: <strong>{currentApp.jobTitle}</strong></span>
              </div>
              <div>
                {currentApp.status === 'interview' ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold border border-purple-200 text-[10px] flex items-center gap-1 whitespace-nowrap">
                    <Calendar className="w-3 h-3" /> Đã mời phỏng vấn
                  </span>
                ) : currentApp.status === 'viewed' ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-bold border border-cyan-200 text-[10px] flex items-center gap-1 whitespace-nowrap">
                    <Clock className="w-3 h-3" /> Đã xem hồ sơ
                  </span>
                ) : currentApp.status === 'offered' ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 text-[10px] flex items-center gap-1 whitespace-nowrap">
                    <CheckCircle2 className="w-3 h-3" /> Đã trúng tuyển
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200 text-[10px] flex items-center gap-1 whitespace-nowrap">
                    <Clock className="w-3 h-3" /> Đang thẩm định sơ bộ
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Messages List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 text-xs">
            {companyMessages.length === 0 ? (
              <div className="text-center py-10 px-4 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 mx-auto flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm">
                    Chưa có tin nhắn với {selectedCompany}
                  </h4>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto">
                    {isSelectedAdmin
                      ? 'Bạn có thể gửi câu hỏi về quy trình tuyển dụng, cách tạo CV chuẩn hoặc hỗ trợ tài khoản tại đây.'
                      : `Bạn có thể gửi câu hỏi hoặc lời nhắn tại đây. Bộ phận tuyển dụng của ${selectedCompany} sẽ phản hồi sớm nhất.`}
                  </p>
                </div>

                {/* Quick Prompt Chips */}
                <div className="pt-2 flex flex-col gap-2 max-w-sm mx-auto text-left">
                  {isSelectedAdmin ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleQuickPrompt('Dạ em chào Admin, cho em hỏi làm sao để gắn huy hiệu Đã xác thực OTP vào hồ sơ ạ?')}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-purple-400 text-slate-700 text-xs hover:bg-purple-50/50 transition-colors text-left shadow-2xs"
                      >
                        🛡️ Hướng dẫn xác thực hồ sơ và gắn tích xanh...
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickPrompt('Dạ admin ơi, sau khi nộp CV thì khoảng bao lâu nhà tuyển dụng sẽ phản hồi kết quả ạ?')}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-purple-400 text-slate-700 text-xs hover:bg-purple-50/50 transition-colors text-left shadow-2xs"
                      >
                        ⏱️ Hỏi về thời gian phản hồi kết quả ứng tuyển...
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleQuickPrompt(`Dạ em chào Ban tuyển dụng ${selectedCompany}, em muốn hỏi thêm về tiến độ thẩm định hồ sơ ạ.`)}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 text-slate-700 text-xs hover:bg-blue-50/50 transition-colors text-left shadow-2xs"
                      >
                        💬 Hỏi về tiến độ thẩm định hồ sơ...
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickPrompt(`Dạ em đã nộp CV ứng tuyển, rất mong nhận được phản hồi từ quý công ty!`)}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 text-slate-700 text-xs hover:bg-blue-50/50 transition-colors text-left shadow-2xs"
                      >
                        📄 Xác nhận thông tin hồ sơ ứng tuyển...
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="text-center my-2">
                  <span className="px-2.5 py-1 rounded-full bg-slate-200/80 text-[10px] font-semibold text-slate-600">
                    Cuộc trò chuyện được mã hóa &amp; bảo mật
                  </span>
                </div>

                {companyMessages.map((msg) => {
                  const isMe = msg.sender === 'candidate';
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isMe && (
                        <button
                          type="button"
                          onClick={() => {
                            setProfileModalCompany(selectedCompany);
                            setShowCompanyProfile(true);
                          }}
                          className="group relative cursor-pointer focus:outline-hidden"
                          title="Xem trang hồ sơ doanh nghiệp"
                        >
                          <img
                            src={msg.avatar}
                            alt={msg.senderName}
                            className="w-7 h-7 rounded-full object-cover shrink-0 bg-white shadow-2xs group-hover:ring-2 group-hover:ring-blue-500 transition-all"
                          />
                        </button>
                      )}
                      <div
                        className={`max-w-[82%] p-3 rounded-2xl space-y-1 shadow-2xs ${
                          isMe
                            ? 'bg-blue-600 text-white rounded-br-xs'
                            : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                        }`}
                      >
                        {!isMe && (
                          <div className="flex items-center gap-1 mb-1 pb-1 border-b border-slate-100">
                            <button
                              type="button"
                              onClick={() => {
                                setProfileModalCompany(selectedCompany);
                                setShowCompanyProfile(true);
                              }}
                              className="text-[10px] font-bold text-slate-800 hover:text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
                              title="Bấm để xem trang hồ sơ doanh nghiệp"
                            >
                              <span>{msg.senderName || selectedCompany}</span>
                              <ExternalLink className="w-2.5 h-2.5 text-blue-500 inline" />
                            </button>
                          </div>
                        )}
                        <p className="text-[11px] leading-relaxed whitespace-pre-line">{msg.text}</p>
                        <div className={`flex items-center justify-end gap-1 text-[9px] ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                          <span>{msg.timestamp}</span>
                          {isMe && <CheckCheck className="w-3 h-3 text-blue-200" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input bar */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <input
              type="text"
              placeholder={isSelectedAdmin ? "Nhắn tin tới Ban Quản Trị Nextstep..." : `Nhắn tin với Tuyển dụng ${selectedCompany}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer shrink-0 shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Modal trang hồ sơ doanh nghiệp */}
      <CompanyProfileModal
        isOpen={showCompanyProfile}
        onClose={() => setShowCompanyProfile(false)}
        companyName={profileModalCompany || selectedCompany}
        allJobs={allJobs}
        onSelectJob={onSelectJob}
        onApplyJob={onApplyJob}
      />
    </div>
  );
};
