import React, { useState } from 'react';
import { PhoneCall, Mail, MapPin, X, MessageSquare, ChevronUp, Copy, Check, Sparkles } from 'lucide-react';
import { NEXTSTEP_COMPANY_INFO } from '../data/companyInfo';
import { NextstepLogo } from './NextstepLogo';

interface QuickContactWidgetProps {
  onOpenRecruiterChat: () => void;
}

export const QuickContactWidget: React.FC<QuickContactWidgetProps> = ({ onOpenRecruiterChat }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(NEXTSTEP_COMPANY_INFO.phoneClean);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen && (
        <div 
          id="quick-contact-popover"
          className="mb-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-4 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <NextstepLogo variant="icon" size="sm" />
              <div>
                <h4 className="text-xs font-bold text-[#0D2B52]">Ban Tuyển Dụng Nextstep</h4>
                <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Đang trực tuyến hỗ trợ ứng viên
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 space-y-2 text-xs">
            {/* Phone button */}
            <a
              href={`tel:${NEXTSTEP_COMPANY_INFO.phoneClean}`}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50/80 border border-slate-100 hover:border-teal-200 transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Hotline Tuyển dụng:</span>
                  <span className="text-slate-900 font-bold group-hover:text-teal-700">
                    {NEXTSTEP_COMPANY_INFO.phone}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600">Gọi ngay</span>
            </a>

            {/* Email button */}
            <a
              href={`mailto:${NEXTSTEP_COMPANY_INFO.email}?subject=Ứng tuyển vị trí tại Công ty Cổ phần Nextstep`}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50/80 border border-slate-100 hover:border-teal-200 transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="truncate max-w-[150px]">
                  <span className="text-[10px] text-slate-500 block">Gửi CV qua email:</span>
                  <span className="text-slate-900 font-semibold truncate block group-hover:text-teal-700">
                    {NEXTSTEP_COMPANY_INFO.email}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-teal-600">Gửi mail</span>
            </a>

            {/* Chat recruiter button */}
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenRecruiterChat();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-[#0D2B52] to-[#137E8F] text-white transition-all shadow-sm cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-teal-100 block">Nhắn tin trực tiếp:</span>
                  <span className="text-xs font-bold">Chat với HR Nextstep</span>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-teal-200" />
            </button>

            {/* Address bar */}
            <div className="pt-2 text-[11px] text-slate-500 flex items-start gap-2 border-t border-slate-100">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>{NEXTSTEP_COMPANY_INFO.address}</span>
            </div>
          </div>
        </div>
      )}

      {/* Trigger floating pill */}
      <button
        id="floating-contact-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#0D2B52] via-[#103D69] to-[#137E8F] text-white font-semibold text-xs shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-teal-400/30"
        title="Liên hệ Công ty Cổ phần Nextstep"
      >
        <NextstepLogo variant="icon" size="sm" />
        <span className="hidden sm:inline">Hỗ trợ &amp; Ứng tuyển:</span>
        <span className="font-bold text-teal-200">{NEXTSTEP_COMPANY_INFO.phone}</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      </button>
    </div>
  );
};

export default QuickContactWidget;
