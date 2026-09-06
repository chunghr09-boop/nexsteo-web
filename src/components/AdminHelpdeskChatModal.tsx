import React, { useState, useMemo } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  Building2, 
  User, 
  CheckCheck, 
  ShieldCheck, 
  HelpCircle, 
  Sparkles,
  Search,
  BadgeCheck,
  ExternalLink
} from 'lucide-react';
import { AdminChatConversation, Job, Application } from '../types';
import { CandidateProfileDetailModal } from './CandidateProfileDetailModal';
import { CompanyProfileModal } from './CompanyProfileModal';
import { getCandidateProfileForApplicant } from '../utils/candidateProfileHelper';
import { INITIAL_PROFILE } from '../data/initialProfile';

interface AdminHelpdeskChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: AdminChatConversation[];
  onSendMessage: (conversationId: string, text: string) => void;
  allJobs?: Job[];
  applications?: Application[];
  onSelectJob?: (job: Job) => void;
  onApplyJob?: (job: Job) => void;
}

export const AdminHelpdeskChatModal: React.FC<AdminHelpdeskChatModalProps> = ({
  isOpen,
  onClose,
  conversations,
  onSendMessage,
  allJobs = [],
  applications = [],
  onSelectJob,
  onApplyJob
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'recruiter' | 'candidate'>('all');
  const [selectedId, setSelectedId] = useState<string>(() => conversations[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string>('');

  const filteredConversations = conversations.filter(c => {
    if (activeCategory === 'all') return true;
    return c.partnerType === activeCategory;
  });

  const activeConv = conversations.find(c => c.id === selectedId) || conversations[0];

  const activeCandidateProfile = useMemo(() => {
    if (!activeConv || activeConv.partnerType !== 'candidate') {
      return INITIAL_PROFILE;
    }
    const candApp = applications.find(a => 
      (a.applicantName && a.applicantName.toLowerCase().includes(activeConv.partnerName.toLowerCase())) ||
      (activeConv.partnerName && activeConv.partnerName.toLowerCase().includes((a.applicantName || '').toLowerCase()))
    );
    return getCandidateProfileForApplicant({
      applicantName: activeConv.partnerName,
      application: candApp
    });
  }, [activeConv, applications]);

  // Lắng nghe phím Escape để đóng cửa sổ tin nhắn
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    onSendMessage(activeConv.id, inputText.trim());
    setInputText('');
  };

  const handleQuickTemplate = (text: string) => {
    if (!activeConv) return;
    onSendMessage(activeConv.id, text);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/65 backdrop-blur-xs flex justify-end animate-in fade-in duration-150 cursor-pointer"
      onClick={onClose}
    >
      <div 
        id="admin-helpdesk-chat-drawer"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col md:flex-row animate-in slide-in-from-right duration-200 cursor-default"
      >
        {/* LEFT COLUMN: CONVERSATION LIST (NHÀ TUYỂN DỤNG & ỨNG VIÊN) */}
        <div className="w-full md:w-72 border-r border-slate-200 bg-slate-50/70 flex flex-col h-1/3 md:h-full shrink-0">
          {/* Top Admin Branding */}
          <div className="p-4 border-b border-slate-200/80 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-600 text-white">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <span className="text-xs font-black tracking-wide uppercase">Admin Helpdesk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30 hidden sm:inline">
                  24/7 Support
                </span>
                <button
                  type="button"
                  id="admin-helpdesk-close-left"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClose();
                  }}
                  className="p-1 px-2.5 rounded-lg bg-white/10 hover:bg-rose-600 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border border-white/20 shadow-2xs relative z-30"
                  title="Đóng cửa sổ tin nhắn (Phím Esc)"
                >
                  <X className="w-3.5 h-3.5 pointer-events-none" />
                  <span className="pointer-events-none">Đóng</span>
                </button>
              </div>
            </div>
            <h3 className="text-sm font-bold text-white mt-2">Hộp Thư Giải Đáp Thắc Mắc</h3>
            <p className="text-[11px] text-purple-200/80">Kênh giải đáp trực tiếp với Nhà Tuyển Dụng &amp; Ứng Viên</p>
          </div>

          {/* Filter Categories */}
          <div className="p-2 border-b border-slate-200 bg-white flex gap-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer text-center ${
                activeCategory === 'all'
                  ? 'bg-purple-100 text-purple-900 border border-purple-300'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Tất cả ({conversations.length})
            </button>
            <button
              onClick={() => setActiveCategory('recruiter')}
              className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer text-center ${
                activeCategory === 'recruiter'
                  ? 'bg-teal-100 text-teal-950 border border-teal-300'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Doanh nghiệp
            </button>
            <button
              onClick={() => setActiveCategory('candidate')}
              className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer text-center ${
                activeCategory === 'candidate'
                  ? 'bg-blue-100 text-blue-950 border border-blue-300'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Ứng viên
            </button>
          </div>

          {/* Conversations Scroll */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.map((conv) => {
              const isSelected = activeConv?.id === conv.id;
              const isRecruiter = conv.partnerType === 'recruiter';
              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className={`p-3 transition-colors cursor-pointer flex items-start gap-2.5 ${
                    isSelected ? 'bg-purple-50/90 border-l-4 border-purple-600' : 'hover:bg-white'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.partnerAvatar}
                      alt={conv.partnerName}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <span className={`absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full text-white ${
                      isRecruiter ? 'bg-teal-600' : 'bg-blue-600'
                    }`}>
                      {isRecruiter ? <Building2 className="w-2.5 h-2.5" /> : <User className="w-2.5 h-2.5" />}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-purple-950' : 'text-slate-900'}`}>
                        {conv.partnerName}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">{conv.lastTimestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {conv.partnerCompany || conv.partnerRole}
                    </p>
                    <div className="flex items-center justify-between gap-1 mt-1">
                      <p className="text-[11px] text-slate-600 truncate italic text-slate-700 font-medium flex-1">
                        "{conv.lastMessage}"
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(conv.id);
                          if (conv.partnerType === 'recruiter') {
                            setSelectedCompany(conv.partnerCompany || conv.partnerName);
                            setShowCompanyModal(true);
                          } else {
                            setShowCandidateModal(true);
                          }
                        }}
                        className="text-[10px] font-bold text-purple-700 hover:underline flex items-center gap-0.5 shrink-0"
                        title="Xem trang hồ sơ"
                      >
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

        {/* RIGHT COLUMN: ACTIVE CHAT CONVERSATION */}
        <div className="flex-1 flex flex-col h-2/3 md:h-full bg-white">
          {/* Header */}
          <div className="p-3.5 px-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 shadow-2xs">
            <div className="flex items-center gap-3 min-w-0">
              {activeConv && (
                <div 
                  onClick={() => {
                    if (activeConv.partnerType === 'recruiter') {
                      setSelectedCompany(activeConv.partnerCompany || activeConv.partnerName);
                      setShowCompanyModal(true);
                    } else {
                      setShowCandidateModal(true);
                    }
                  }}
                  className="flex items-center gap-3 min-w-0 cursor-pointer group"
                  title={activeConv.partnerType === 'recruiter' ? 'Bấm để xem trang hồ sơ doanh nghiệp' : 'Bấm để xem trang hồ sơ CV ứng viên'}
                >
                  <div className="relative shrink-0">
                    <img
                      src={activeConv.partnerAvatar}
                      alt={activeConv.partnerName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-400 group-hover:ring-purple-600 transition-all shadow-xs"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 truncate transition-colors">
                        {activeConv.partnerName}
                      </h3>
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                        activeConv.partnerType === 'recruiter' 
                          ? 'bg-teal-100 text-teal-900 border border-teal-200 group-hover:bg-teal-700 group-hover:text-white' 
                          : 'bg-blue-100 text-blue-900 border border-blue-200 group-hover:bg-blue-700 group-hover:text-white'
                      } transition-colors`}>
                        {activeConv.partnerType === 'recruiter' ? <Building2 className="w-2.5 h-2.5" /> : <User className="w-2.5 h-2.5" />}
                        <span>{activeConv.partnerType === 'recruiter' ? 'Hồ sơ Công ty' : 'Hồ sơ CV'}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {activeConv.partnerRole} {activeConv.partnerCompany && `• ${activeConv.partnerCompany}`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              id="admin-helpdesk-close-right"
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

          {/* Topic Banner */}
          {activeConv?.topic && (
            <div className="bg-purple-50/80 px-4 py-2 border-b border-purple-100 text-[11px] text-purple-900 flex items-center gap-1.5 shrink-0">
              <HelpCircle className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span><strong>Nội dung thắc mắc:</strong> {activeConv.topic}</span>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 text-xs">
            <div className="text-center my-1">
              <span className="px-3 py-1 rounded-full bg-slate-200/70 text-[10px] font-semibold text-slate-600">
                Hội thoại hỗ trợ trực tiếp từ Ban Quản Trị Nextstep
              </span>
            </div>

            {activeConv?.messages.map((msg) => {
              const isAdminMsg = msg.sender === 'admin';
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${isAdminMsg ? 'justify-end' : 'justify-start'}`}
                >
                  {!isAdminMsg && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeConv.partnerType === 'recruiter') {
                          setSelectedCompany(activeConv.partnerCompany || activeConv.partnerName);
                          setShowCompanyModal(true);
                        } else {
                          setShowCandidateModal(true);
                        }
                      }}
                      className="group cursor-pointer shrink-0"
                      title="Xem trang hồ sơ"
                    >
                      <img
                        src={msg.avatar}
                        alt={msg.senderName}
                        className="w-7 h-7 rounded-full object-cover group-hover:ring-2 group-hover:ring-purple-400 transition-all"
                      />
                    </button>
                  )}

                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl space-y-1 shadow-2xs ${
                      isAdminMsg
                        ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 pb-0.5">
                      {isAdminMsg ? (
                        <span className="text-[10px] font-bold text-purple-200">
                          {msg.senderName}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (activeConv.partnerType === 'recruiter') {
                              setSelectedCompany(activeConv.partnerCompany || activeConv.partnerName);
                              setShowCompanyModal(true);
                            } else {
                              setShowCandidateModal(true);
                            }
                          }}
                          className="text-[10px] font-bold text-slate-700 hover:text-purple-700 hover:underline cursor-pointer flex items-center gap-1"
                          title="Bấm để xem trang hồ sơ"
                        >
                          <span>{msg.senderName}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-purple-500 inline" />
                        </button>
                      )}
                    </div>
                    <p className="text-[12px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <div className={`flex items-center justify-end gap-1 text-[9px] pt-1 ${
                      isAdminMsg ? 'text-purple-200' : 'text-slate-400'
                    }`}>
                      <span>{msg.timestamp}</span>
                      {isAdminMsg && <CheckCheck className="w-3 h-3 text-purple-300" />}
                    </div>
                  </div>

                  {isAdminMsg && (
                    <div className="w-7 h-7 rounded-full bg-purple-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick template suggestions */}
          <div className="p-2 px-3 border-t border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Trả lời nhanh:
            </span>
            {activeConv?.partnerType === 'recruiter' ? (
              <>
                <button
                  type="button"
                  onClick={() => handleQuickTemplate('Dạ Ban Quản Trị đã kích hoạt trạng thái duyệt tin tuyển dụng thành công cho đơn vị rồi nhé ạ!')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-900 rounded-lg text-[11px] whitespace-nowrap cursor-pointer transition-colors border border-slate-200"
                >
                  Đã duyệt tin đăng
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickTemplate('Chị vào mục Quản trị đơn ứng tuyển -> Xuất dữ liệu / Tải CV để lấy file zip nhé ạ.')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-900 rounded-lg text-[11px] whitespace-nowrap cursor-pointer transition-colors border border-slate-200"
                >
                  Hướng dẫn xuất CV zip
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleQuickTemplate('Chào bạn, bạn vào mục Quản lý hồ sơ -> Xác thực SĐT qua mã OTP là tài khoản sẽ được gắn tích xanh uy tín nhé!')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 rounded-lg text-[11px] whitespace-nowrap cursor-pointer transition-colors border border-slate-200"
                >
                  Hướng dẫn OTP tích xanh
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickTemplate('Thông thường các doanh nghiệp đối tác cam kết phản hồi trong 24 - 48 giờ làm việc bạn nhé!')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 rounded-lg text-[11px] whitespace-nowrap cursor-pointer transition-colors border border-slate-200"
                >
                  Thời gian phản hồi CV
                </button>
              </>
            )}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Trả lời giải đáp thắc mắc cho ${activeConv?.partnerName || 'đối tác'}...`}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-hidden bg-slate-50"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 disabled:opacity-50 text-white rounded-xl transition-all cursor-pointer shadow-sm shrink-0"
              title="Gửi câu trả lời"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* MODAL TRANG HỒ SƠ ỨNG VIÊN */}
      <CandidateProfileDetailModal
        isOpen={showCandidateModal}
        onClose={() => setShowCandidateModal(false)}
        profile={activeCandidateProfile}
      />

      {/* MODAL TRANG HỒ SƠ DOANH NGHIỆP */}
      <CompanyProfileModal
        isOpen={showCompanyModal}
        onClose={() => setShowCompanyModal(false)}
        companyName={selectedCompany || activeConv?.partnerCompany || activeConv?.partnerName || 'Doanh nghiệp'}
        allJobs={allJobs}
        onSelectJob={onSelectJob}
        onApplyJob={onApplyJob}
      />
    </div>
  );
};
