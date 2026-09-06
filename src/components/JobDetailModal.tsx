import React from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  Calendar, 
  Briefcase, 
  ShieldCheck, 
  Send, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Check, 
  Info,
  ExternalLink,
  Layers
} from 'lucide-react';
import { Job, CandidateProfile } from '../types';
import { useAuth } from '../context/AuthContext';

interface JobDetailModalProps {
  job: Job | null;
  onClose: () => void;
  onApply: (job: Job) => void;
  isSaved: boolean;
  onToggleSave: (jobId: string) => void;
  profile: CandidateProfile;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  onClose,
  onApply,
  isSaved,
  onToggleSave,
  profile
}) => {
  const { isAdmin } = useAuth();
  if (!job) return null;

  // Compute skill matches
  const candidateSkills = profile.skills.map(s => s.name.toLowerCase());
  const skillMatches = job.requiredSkills.map(skill => {
    const hasMatch = candidateSkills.some(cs => cs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(cs));
    return { skill, hasMatch };
  });

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép liên kết tin tuyển dụng vào bộ nhớ tạm!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        id="job-detail-modal-container"
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200/90 bg-gradient-to-r from-slate-50 via-white to-blue-50/40 relative">
          <button
            id="close-job-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pr-10">
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 shadow-xs bg-white p-1"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                  {job.industry}
                </span>
                {job.verifiedCompany && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Doanh nghiệp đã xác thực
                  </span>
                )}
                {job.isUrgent && (
                  <span className="text-[11px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                    Tuyển gấp 24h
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {job.title}
              </h2>
              <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-400" />
                {job.company}
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-normal">{job.companySize}</span>
              </p>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
            <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-orange-500" />
                Mức thu nhập
              </span>
              <p className="text-sm sm:text-base font-extrabold text-orange-600 mt-0.5">
                {job.salaryText}
              </p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                Địa điểm
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 truncate">
                {job.city}
              </p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                Kinh nghiệm
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
                {job.experience}
              </p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-red-500" />
                Hạn nộp hồ sơ
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
                {job.deadline}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-slate-700 text-sm">
          {/* AI Match Evaluation Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/70">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                    Đánh giá độ phù hợp với hồ sơ của bạn
                  </h4>
                  <p className="text-[11px] text-slate-600">Dựa trên kỹ năng và hồ sơ trực tuyến trên Nextstep</p>
                </div>
              </div>
              <span className="text-sm font-black text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs">
                Khớp 92%
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {skillMatches.map(({ skill, hasMatch }, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
                    hasMatch 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {hasMatch ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  )}
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
              Mô tả công việc
            </h3>
            <ul className="space-y-2 pl-2">
              {job.description.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
              Yêu cầu ứng viên
            </h3>
            <ul className="space-y-2 pl-2">
              {job.requirements.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-600 rounded-full"></span>
              Quyền lợi được hưởng
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
              {job.benefits.map((benefit, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-start gap-2 text-xs">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-800">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Workplace Location */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-orange-500 rounded-full"></span>
              Địa điểm làm việc
            </h3>
            <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <span>{job.address}</span>
            </p>
          </div>

          {/* Company Intro */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              Về {job.company}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {job.companyOverview}
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-slate-500 border-t border-slate-200/60">
              <span>Quy mô: <strong>{job.companySize}</strong></span>
              <span>Email: <strong>{job.contactEmail}</strong></span>
            </div>
          </div>
        </div>

        {/* Modal Sticky Bottom Action Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <div 
                className="px-3.5 py-2.5 rounded-xl border border-purple-200 bg-purple-50 text-purple-700 text-xs font-bold flex items-center gap-1.5"
                title="Tài khoản Quản trị viên chỉ quản lý tin tuyển dụng, không lưu việc làm"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Chế độ Quản Trị Viên</span>
              </div>
            ) : (
              <button
                onClick={() => onToggleSave(job.id)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-orange-50 border-orange-200 text-orange-600'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 fill-orange-500 text-orange-600" />
                    <span>Đã lưu</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 text-slate-500" />
                    <span>Lưu tin</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
              title="Chia sẻ tin"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin ? (
              <button
                id="modal-manage-btn"
                onClick={() => {
                  onClose();
                  onApply(job);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-purple-200" />
                <span>Quản lý tin đăng ({job.applicantsCount} ứng viên)</span>
              </button>
            ) : (
              <button
                id="modal-apply-btn"
                onClick={() => onApply(job)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Ứng tuyển ngay
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
