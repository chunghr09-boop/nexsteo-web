import React from 'react';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  Flame, 
  CheckCircle, 
  Send, 
  ChevronRight,
  ShieldCheck,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { Job, FilterState, CandidateProfile } from '../types';
import { NextstepCompanyCard } from './NextstepCompanyCard';
import { useAuth } from '../context/AuthContext';

interface JobListProps {
  jobs: Job[];
  onSelectJob: (job: Job) => void;
  onQuickApply: (job: Job) => void;
  savedJobIds: string[];
  onToggleSaveJob: (jobId: string) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  profile: CandidateProfile;
}

export const JobList: React.FC<JobListProps> = ({
  jobs,
  onSelectJob,
  onQuickApply,
  savedJobIds,
  onToggleSaveJob,
  filters,
  setFilters,
  profile
}) => {
  const { isAdmin } = useAuth();
  // Calculate match score between candidate profile skills and job required skills
  const getJobMatchScore = (job: Job): number => {
    if (!profile || !profile.skills) return 75;
    const candidateSkillNames = profile.skills.map(s => s.name.toLowerCase());
    const jobSkills = job.requiredSkills.map(s => s.toLowerCase());
    
    let matched = 0;
    jobSkills.forEach(req => {
      if (candidateSkillNames.some(cs => cs.includes(req) || req.includes(cs))) {
        matched++;
      }
    });

    const ratio = jobSkills.length > 0 ? (matched / jobSkills.length) : 0.7;
    // Base score between 70% and 98%
    const score = Math.min(98, Math.max(68, Math.round(70 + ratio * 28)));
    return score;
  };

  return (
    <div className="space-y-4">
      {/* Featured Nextstep Company Spotlight */}
      <NextstepCompanyCard 
        onSelectJob={onSelectJob}
        onViewAllCompanyJobs={() => setFilters(prev => ({ ...prev, keyword: 'Nextstep', city: 'Tất cả địa điểm' }))}
      />

      {/* Top Sorting & Stats Bar */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Sắp xếp theo:
          </span>
          <div className="flex flex-wrap gap-1">
            {[
              { id: 'relevant', label: 'Phù hợp nhất' },
              { id: 'newest', label: 'Mới nhất' },
              { id: 'salary_high', label: 'Lương cao nhất' },
              { id: 'deadline', label: 'Hạn nộp gần nhất' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilters(prev => ({ ...prev, sortBy: tab.id as any }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filters.sortBy === tab.id
                    ? 'bg-[#0D2B52] text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Hiển thị <strong>{jobs.length}</strong> cơ hội việc làm đang tuyển</span>
        </div>
      </div>

      {/* Jobs Grid / List */}
      {jobs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Không tìm thấy việc làm phù hợp</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            Hãy thử điều chỉnh lại từ khóa tìm kiếm, giảm bớt các tiêu chí lọc địa điểm hoặc mức lương để tìm được nhiều kết quả hơn.
          </p>
          <button
            onClick={() => setFilters({
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
            })}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            Đặt lại tất cả bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {jobs.map((job) => {
            const isSaved = savedJobIds.includes(job.id);
            const matchScore = getJobMatchScore(job);
            const isNextstepJob = job.company.includes('Nextstep');

            return (
              <div
                key={job.id}
                id={`job-card-${job.id}`}
                className={`rounded-2xl p-4 sm:p-5 border transition-all duration-200 group relative ${
                  isNextstepJob 
                    ? 'bg-gradient-to-r from-teal-50/30 via-white to-emerald-50/20 border-teal-300 shadow-md ring-1 ring-teal-200/60 hover:border-teal-400' 
                    : 'bg-white border-slate-200/90 hover:border-teal-300 hover:shadow-md'
                }`}
              >
                {/* Top Badge for Nextstep direct job */}
                {isNextstepJob && (
                  <div className="mb-2.5 -mt-1 flex items-center justify-between pb-2 border-b border-teal-100/80 text-[11px]">
                    <div className="flex items-center gap-1.5 font-bold text-[#0D2B52]">
                      <Award className="w-3.5 h-3.5 text-[#137E8F]" />
                      <span>Công ty Cổ phần Nextstep</span>
                      <span className="text-teal-600 font-normal">• Ban Tuyển dụng trực tiếp</span>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 tracking-wider">
                      Phản hồi trong 24h
                    </span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left: Logo and Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Company Logo */}
                    <div 
                      onClick={() => onSelectJob(job)}
                      className={`w-16 h-16 rounded-xl border p-1 shrink-0 flex items-center justify-center shadow-2xs transition-colors cursor-pointer overflow-hidden ${
                        isNextstepJob ? 'border-teal-200 bg-white ring-2 ring-teal-100' : 'border-slate-200 bg-white group-hover:border-teal-300'
                      }`}
                    >
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        className="w-full h-full object-cover rounded-lg"
                        loading="lazy"
                      />
                    </div>

                    {/* Job Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {job.isHot && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-700 uppercase tracking-wider">
                            <Flame className="w-3 h-3 text-red-500 fill-red-500" />
                            HOT
                          </span>
                        )}
                        {job.isUrgent && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-100 text-orange-700 uppercase tracking-wider">
                            Tuyển gấp
                          </span>
                        )}
                        {job.jobType === 'Remote' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                            Remote
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <Sparkles className="w-3 h-3 text-emerald-500" />
                          Độ khớp CV: {matchScore}%
                        </span>
                      </div>

                      {/* Job Title */}
                      <h3 
                        onClick={() => onSelectJob(job)}
                        className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#137E8F] transition-colors cursor-pointer truncate"
                        title={job.title}
                      >
                        {job.title}
                      </h3>

                      {/* Company Name */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1 mb-2 font-medium">
                        <span className={`truncate ${isNextstepJob ? 'font-bold text-[#0D2B52]' : ''}`}>{job.company}</span>
                        {job.verifiedCompany && (
                          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" title="Nhà tuyển dụng xác thực" />
                        )}
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500">{job.city}</span>
                      </div>

                      {/* Meta Tags: Salary, Location, Experience */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <div className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-extrabold flex items-center gap-1 border border-emerald-200/60">
                          <DollarSign className="w-3.5 h-3.5" />
                          {job.salaryText}
                        </div>

                        <div className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {job.district || job.city}
                        </div>

                        <div className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {job.experience}
                        </div>

                        <div className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium flex items-center gap-1 hidden sm:flex">
                          <Layers className="w-3 h-3 text-slate-500" />
                          {job.level}
                        </div>
                      </div>

                      {/* Tags / Skills Preview */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                        {job.tags.slice(0, 4).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-sm bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-600"
                          >
                            {tag}
                          </span>
                        ))}
                        {job.tags.length > 4 && (
                          <span className="text-[11px] text-slate-400 font-medium">
                            +{job.tags.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions (Apply, Bookmark, Deadline) */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 shrink-0">
                    <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Hạn: {job.deadline}</span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {isAdmin ? (
                        <div
                          className="p-2.5 rounded-xl border border-purple-200 bg-purple-50 text-purple-700 cursor-default flex items-center justify-center"
                          title="Tài khoản Quản trị viên (Admin không lưu việc làm)"
                        >
                          <ShieldCheck className="w-4 h-4 text-purple-600" />
                        </div>
                      ) : (
                        <button
                          id={`bookmark-job-${job.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleSaveJob(job.id);
                          }}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isSaved
                              ? 'bg-amber-50 border-amber-200 text-amber-600'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-amber-500 hover:bg-amber-50'
                          }`}
                          title={isSaved ? 'Đã lưu việc làm này' : 'Lưu tin tuyển dụng'}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-600" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      )}

                      {isAdmin ? (
                        <button
                          id={`quick-manage-btn-${job.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectJob(job);
                          }}
                          className="px-3.5 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                          title="Xem & Quản lý tin tuyển dụng này"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-200" />
                          Quản lý tin
                        </button>
                      ) : (
                        <button
                          id={`quick-apply-btn-${job.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickApply(job);
                          }}
                          className="px-3.5 py-2.5 bg-gradient-to-r from-[#0D2B52] to-[#137E8F] hover:from-[#091F3C] hover:to-[#0F6473] active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm shadow-teal-900/20 transition-all cursor-pointer whitespace-nowrap"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Ứng tuyển
                        </button>
                      )}

                      <button
                        onClick={() => onSelectJob(job)}
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold sm:hidden cursor-pointer"
                        title="Xem chi tiết"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
