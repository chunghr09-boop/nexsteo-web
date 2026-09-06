import React, { useMemo } from 'react';
import { 
  X, 
  Bell, 
  Calendar, 
  Briefcase, 
  Eye, 
  Sparkles, 
  Building2, 
  MapPin, 
  DollarSign, 
  FileText, 
  MessageSquare, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { AppNotification, Job, Application, ApplicationStatus } from '../types';

interface NotificationDetailModalProps {
  notification: AppNotification | null;
  onClose: () => void;
  onOpenJobDetail: (job: Job) => void;
  onOpenApplicationDetail?: (app: Application) => void;
  onOpenChat: (company: string, jobTitle?: string) => void;
  onNavigateToTab: (tab: 'jobs' | 'profile' | 'applications' | 'saved' | 'salary' | 'recruiter_portal' | 'admin') => void;
  allJobs: Job[];
  allApplications: Application[];
  onMarkAsRead?: (notifId: string) => void;
}

export const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({
  notification,
  onClose,
  onOpenJobDetail,
  onOpenApplicationDetail,
  onOpenChat,
  onNavigateToTab,
  allJobs,
  allApplications,
  onMarkAsRead
}) => {
  if (!notification) return null;

  // Find linked job
  const linkedJob = useMemo(() => {
    if (notification.jobId) {
      return allJobs.find(j => j.id === notification.jobId) || null;
    }
    if (notification.targetName) {
      return allJobs.find(j => 
        notification.targetName?.toLowerCase().includes(j.title.toLowerCase()) || 
        j.title.toLowerCase().includes(notification.targetName?.toLowerCase() || '')
      ) || null;
    }
    return null;
  }, [notification, allJobs]);

  // Find linked application
  const linkedApplication = useMemo(() => {
    if (notification.applicationId) {
      return allApplications.find(a => a.id === notification.applicationId) || null;
    }
    if (notification.candidateName) {
      return allApplications.find(a => a.applicantName?.toLowerCase() === notification.candidateName?.toLowerCase()) || null;
    }
    return null;
  }, [notification, allApplications]);

  const getBadgeStyle = () => {
    switch (notification.type) {
      case 'interview_invitation':
        return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: '📅 Lịch Phỏng Vấn' };
      case 'recruiter_view':
        return { bg: 'bg-blue-100 text-blue-800 border-blue-200', label: '🏢 Nhà Tuyển Dụng Xem Hồ Sơ' };
      case 'application_submitted':
        return { bg: 'bg-purple-100 text-purple-800 border-purple-200', label: '📄 Hồ Sơ Ứng Tuyển Mới' };
      case 'job_recommendation':
        return { bg: 'bg-amber-100 text-amber-900 border-amber-200', label: '✨ Việc Làm Phù Hợp' };
      default:
        return { bg: 'bg-teal-100 text-teal-800 border-teal-200', label: '🔔 Thông Báo Tuyển Dụng' };
    }
  };

  const badge = getBadgeStyle();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-[#0D2B52] via-[#103D69] to-[#137E8F] text-white p-5 sm:p-6 flex items-start justify-between relative overflow-hidden">
          <div className="flex items-center gap-3.5 relative z-10">
            {notification.senderAvatar ? (
              <img 
                src={notification.senderAvatar} 
                alt={notification.senderName} 
                className="w-13 h-13 rounded-2xl object-cover ring-2 ring-white/40 shadow-md bg-white shrink-0" 
              />
            ) : (
              <div className="w-13 h-13 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/20 flex items-center justify-center shrink-0">
                <Bell className="w-6 h-6 text-teal-200" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${badge.bg}`}>
                  {badge.label}
                </span>
                <span className="text-teal-200/80 text-xs flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3" />
                  {notification.timestamp}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                {notification.title}
              </h2>
              <p className="text-xs text-teal-100/80 mt-0.5">
                Từ: <strong>{notification.senderName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer relative z-10"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Decorative background glow */}
          <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-teal-400/20 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* MODAL BODY */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Detailed content box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              Nội dung thông báo chi tiết
            </h4>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              {notification.content}
            </p>
            {notification.targetName && (
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500">Mục tiêu liên quan:</span>
                <span className="font-bold text-[#0D2B52] truncate max-w-[280px]">
                  {notification.targetName}
                </span>
              </div>
            )}
          </div>

          {/* CONTEXTUAL CARD 1: LINKED JOB CARD */}
          {(linkedJob || notification.targetType === 'job' || notification.jobId) && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-teal-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-teal-600" />
                  Tin Tuyển Dụng Cụ Thể
                </span>
                <span className="text-xs font-extrabold text-orange-600 flex items-center gap-0.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  {linkedJob ? linkedJob.salaryText : (notification.salaryText || 'Mức lương hấp dẫn')}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <img 
                  src={linkedJob?.companyLogo || notification.companyLogo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&auto=format&fit=crop&q=80'} 
                  alt="Company Logo"
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1 hover:text-[#137E8F] transition-colors">
                    {linkedJob?.title || notification.targetName || 'Vị trí tuyển dụng'}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium truncate mt-0.5 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {linkedJob?.company || notification.companyName || 'Doanh nghiệp'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    {linkedJob?.location || notification.location || 'Toàn quốc'}
                  </p>
                </div>
              </div>

              {linkedJob?.tags && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {linkedJob.tags.slice(0, 4).map((t, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Action button leading directly to this Job */}
              <button
                onClick={() => {
                  onClose();
                  if (linkedJob) {
                    onOpenJobDetail(linkedJob);
                  } else {
                    onNavigateToTab('jobs');
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#0D2B52] to-[#137E8F] hover:from-[#0a2342] hover:to-[#0f6775] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Mở Chi Tiết Tin Tuyển Dụng &amp; Ứng Tuyển Ngay</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {/* CONTEXTUAL CARD 2: LINKED APPLICATION CARD */}
          {(linkedApplication || notification.targetType === 'application' || notification.applicationId) && (
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-purple-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200 flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-purple-600" />
                  Hồ Sơ Ứng Tuyển Cụ Thể
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  (linkedApplication?.status || 'applied') === 'interview' ? 'bg-emerald-100 text-emerald-800' :
                  (linkedApplication?.status || 'applied') === 'offered' ? 'bg-amber-100 text-amber-800' :
                  (linkedApplication?.status || 'applied') === 'viewed' ? 'bg-purple-100 text-purple-800' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {linkedApplication?.status === 'interview' ? 'Mời phỏng vấn' :
                   linkedApplication?.status === 'offered' ? 'Đã trúng tuyển' :
                   linkedApplication?.status === 'viewed' ? 'NTD đã xem' : 'Đã nộp hồ sơ'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700">
                <p>
                  <strong>Ứng viên:</strong> {linkedApplication?.applicantName || notification.candidateName || notification.senderName}
                </p>
                <p>
                  <strong>Vị trí ứng tuyển:</strong> {linkedApplication?.jobTitle || notification.targetName}
                </p>
                <p>
                  <strong>Doanh nghiệp nhận hồ sơ:</strong> {linkedApplication?.company || notification.companyName}
                </p>
                {linkedApplication?.cvName && (
                  <p className="flex items-center gap-1 text-slate-500">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    File CV: <span className="font-semibold text-slate-800">{linkedApplication.cvName}</span>
                  </p>
                )}
              </div>

              {/* Interview Details if available */}
              {(notification.interviewDate || linkedApplication?.interviewDate || notification.notes || linkedApplication?.notes) && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>Lịch Phỏng Vấn &amp; Ghi Chú Phỏng Vấn</span>
                  </div>
                  {(notification.interviewDate || linkedApplication?.interviewDate) && (
                    <p className="font-semibold">
                      📅 Thời gian: {notification.interviewDate || linkedApplication?.interviewDate}
                    </p>
                  )}
                  {(notification.notes || linkedApplication?.notes) && (
                    <p className="text-emerald-900/90 leading-relaxed">
                      📌 Ghi chú: {notification.notes || linkedApplication?.notes}
                    </p>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToTab('applications');
                  }}
                  className="w-full py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Xem Trạng Thái Đơn Ứng Tuyển</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    const companyToChat = linkedApplication?.company || notification.companyName || 'VNG Corporation';
                    const jobTitleToChat = linkedApplication?.jobTitle || notification.targetName;
                    onOpenChat(companyToChat, jobTitleToChat);
                  }}
                  className="w-full py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Nhắn Tin Trực Tiếp Với NTD</span>
                </button>
              </div>
            </div>
          )}

          {/* CONTEXTUAL CARD 3: RECRUITER VIEW DETAILS */}
          {(notification.type === 'recruiter_view' || notification.targetType === 'recruiter_view') && (
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                  <Eye className="w-3 h-3 text-blue-600" />
                  Chi Tiết Lượt Xem Hồ Sơ
                </span>
                <span className="text-xs text-blue-700 font-semibold">{notification.timestamp}</span>
              </div>

              <div className="flex items-start gap-3">
                <img 
                  src={notification.senderAvatar || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80'} 
                  alt={notification.senderName} 
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-slate-900">{notification.senderName}</h4>
                  <p className="text-xs text-slate-600 font-medium">
                    Từ khóa tìm kiếm: <span className="font-bold text-blue-700">{notification.targetName || 'Ứng viên tiềm năng'}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Khu vực: {notification.location || 'TP. Hồ Chí Minh'}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 bg-white/80 p-3 rounded-xl border border-blue-100 leading-relaxed">
                💡 <em>Nhà tuyển dụng đã chủ động tra cứu và đánh giá cao hồ sơ chuyên môn của bạn. Hãy chủ động trao đổi hoặc khám phá ngay các việc làm của họ để nắm bắt cơ hội phỏng vấn!</em>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onOpenChat(notification.senderName, notification.targetName);
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Nhắn Tin Với Nhà Tuyển Dụng</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onNavigateToTab('jobs');
                  }}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#0D2B52] font-bold text-xs border border-slate-300 shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Briefcase className="w-3.5 h-3.5 text-teal-600" />
                  <span>Xem Việc Làm Đang Tuyển</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs text-slate-500">
              Thông báo chính thức từ Nextstep
            </span>
          </div>

          <div className="flex items-center gap-2">
            {notification.isUnread && onMarkAsRead && (
              <button
                onClick={() => {
                  onMarkAsRead(notification.id);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Đánh dấu đã đọc
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
