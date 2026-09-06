import React, { useEffect, useState } from 'react';
import { 
  Bell, 
  X, 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  Eye, 
  Briefcase
} from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationToastProps {
  notification: AppNotification | null;
  onClose: () => void;
  onViewDetail: (notif: AppNotification) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  onViewDetail
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!notification) return;
    setProgress(100);

    const startTime = Date.now();
    const duration = 7000; // 7 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onClose();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [notification?.id]);

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'interview_invitation':
        return <Calendar className="w-4 h-4 text-emerald-600" />;
      case 'recruiter_view':
        return <Eye className="w-4 h-4 text-blue-600" />;
      case 'application_submitted':
        return <Briefcase className="w-4 h-4 text-purple-600" />;
      case 'job_recommendation':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-teal-600" />;
    }
  };

  const getBadgeColor = () => {
    switch (notification.type) {
      case 'interview_invitation':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'recruiter_view':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'application_submitted':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'job_recommendation':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      default:
        return 'bg-teal-100 text-teal-800 border-teal-200';
    }
  };

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-md w-full animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden ring-1 ring-black/5">
        {/* Progress bar */}
        <div className="h-1 w-full bg-slate-100">
          <div 
            className="h-full bg-gradient-to-r from-[#0D2B52] to-[#137E8F] transition-all ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-4 flex items-start gap-3.5">
          {/* Avatar / Icon */}
          <div className="relative shrink-0">
            {notification.senderAvatar ? (
              <img 
                src={notification.senderAvatar} 
                alt={notification.senderName} 
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-slate-100 shadow-xs"
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center">
                {getIcon()}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 p-0.5 bg-white rounded-full shadow-xs">
              {getIcon()}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${getBadgeColor()}`}>
                {notification.type === 'interview_invitation' ? '📅 Thư Mời PV' :
                 notification.type === 'recruiter_view' ? '🏢 Xem Hồ Sơ' :
                 notification.type === 'application_submitted' ? '📄 CV Mới Nộp' :
                 notification.type === 'job_recommendation' ? '✨ Gợi Ý Việc Làm' : '🔔 Thông Báo Mới'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">{notification.timestamp}</span>
            </div>

            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
              {notification.title}
            </h4>
            <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
              {notification.content}
            </p>

            {/* Quick Action Button */}
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={() => {
                  onViewDetail(notification);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-[#0D2B52] hover:bg-[#137E8F] text-white text-[11px] font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1 group"
              >
                <span>Xem chi tiết ngay</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onClose}
                className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 text-[11px] font-medium transition-colors cursor-pointer"
              >
                Để sau
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            title="Đóng thông báo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
