import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  PhoneCall, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink,
  Users,
  Award,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';
import { NextstepLogo } from './NextstepLogo';
import { NEXTSTEP_COMPANY_INFO } from '../data/companyInfo';
import { Job } from '../types';

interface NextstepCompanyCardProps {
  onFilterNextstepJobs: () => void;
  onApplyJob?: (job: Job) => void;
  nextstepJobsCount: number;
}

export const NextstepCompanyCard: React.FC<NextstepCompanyCardProps> = ({
  onFilterNextstepJobs,
  nextstepJobsCount
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(NEXTSTEP_COMPANY_INFO.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-gradient-to-br from-[#0D2B52] via-[#0F3563] to-[#134B6E] text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-teal-500/30 relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left column: Brand & Identity */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              Doanh Nghiệp Tuyển Dụng Trực Tiếp
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Xác thực pháp nhân
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white p-2.5 rounded-xl shadow-md shrink-0">
              <NextstepLogo variant="icon" size="lg" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                {NEXTSTEP_COMPANY_INFO.companyName}
              </h2>
              <p className="text-teal-200 text-xs sm:text-sm font-medium">
                {NEXTSTEP_COMPANY_INFO.tagline}
              </p>
            </div>
          </div>

          {/* Contact Details with Smart Quick-Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs">
            {/* Address */}
            <div className="flex items-start gap-2 bg-white/10 hover:bg-white/15 p-2.5 rounded-xl border border-white/10 transition-colors backdrop-blur-xs">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <span className="text-slate-300 text-[11px] block">Trụ sở chính:</span>
                <p className="text-white font-medium line-clamp-2 leading-relaxed">
                  {NEXTSTEP_COMPANY_INFO.address}
                </p>
                <button
                  onClick={handleCopyAddress}
                  className="mt-1 inline-flex items-center gap-1 text-[11px] text-teal-300 hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-300" />
                      <span>Đã sao chép địa chỉ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Sao chép địa chỉ</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Direct Contacts */}
            <div className="space-y-2">
              {/* Phone Hotline */}
              <a
                href={`tel:${NEXTSTEP_COMPANY_INFO.phoneClean}`}
                className="flex items-center justify-between p-2.5 bg-white/10 hover:bg-white/15 rounded-xl border border-white/10 transition-colors group"
                title="Bấm để gọi hotline"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                    <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
                  </div>
                  <div>
                    <span className="text-slate-300 text-[10px] block">Hotline Tuyển Dụng:</span>
                    <span className="text-white font-bold tracking-wider">{NEXTSTEP_COMPANY_INFO.phone}</span>
                  </div>
                </div>
                <span className="text-[11px] text-emerald-300 group-hover:underline">Gọi ngay</span>
              </a>

              {/* Email HR */}
              <a
                href={`mailto:${NEXTSTEP_COMPANY_INFO.email}?subject=Ứng tuyển vị trí tại Công ty Cổ phần Nextstep`}
                className="flex items-center justify-between p-2.5 bg-white/10 hover:bg-white/15 rounded-xl border border-white/10 transition-colors group"
                title="Bấm để gửi email cho HR"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <span className="text-slate-300 text-[10px] block">Hòm thư tiếp nhận CV:</span>
                    <span className="text-white font-semibold truncate block">{NEXTSTEP_COMPANY_INFO.email}</span>
                  </div>
                </div>
                <span className="text-[11px] text-teal-300 group-hover:underline">Gửi mail</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right column: Highlights & Action */}
        <div className="w-full lg:w-72 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300">Vị trí đang mở tuyển:</span>
            <span className="px-2 py-0.5 bg-emerald-400 text-slate-950 font-black rounded-md text-xs">
              {nextstepJobsCount} Vị trí Hot
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              <span>Phỏng vấn tinh gọn 2 vòng</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              <span>Review lương định kỳ 2 lần/năm</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              <span>Bảo hiểm 100% lương + Thưởng dự án</span>
            </div>
          </div>

          <button
            id="view-nextstep-jobs-btn"
            onClick={onFilterNextstepJobs}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <span>Xem việc làm tại Nextstep</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NextstepCompanyCard;
