import React from 'react';
import { 
  Bookmark, 
  Trash2, 
  Send, 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  Calendar,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Job } from '../types';
import { useAuth } from '../context/AuthContext';

interface SavedJobsViewProps {
  savedJobs: Job[];
  onRemoveSaved: (jobId: string) => void;
  onApply: (job: Job) => void;
  onSelectJob: (job: Job) => void;
  onExploreMore: () => void;
}

export const SavedJobsView: React.FC<SavedJobsViewProps> = ({
  savedJobs,
  onRemoveSaved,
  onApply,
  onSelectJob,
  onExploreMore
}) => {
  const { isAdmin } = useAuth();

  if (isAdmin) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-purple-200 shadow-md max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200 inline-block">
            Chế Độ Quản Trị Viên (Admin)
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Admin không lưu việc làm
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Tài khoản Quản trị viên chỉ quản lý, duyệt và phát hành các tin đăng tuyển dụng. Tính năng <strong>Lưu việc làm</strong> chỉ dành riêng cho ứng viên tìm việc.
          </p>
          <div className="pt-3">
            <button
              onClick={onExploreMore}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Xem danh sách tin tuyển dụng trên trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
      {/* Title Bar */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-orange-500 fill-orange-500" />
            Việc Làm Đã Lưu ({savedJobs.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Danh sách các cơ hội nghề nghiệp bạn đã đánh dấu để xem xét và nộp hồ sơ sau
          </p>
        </div>

        <button
          onClick={onExploreMore}
          className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          Tìm thêm việc làm mới
        </button>
      </div>

      {savedJobs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Bạn chưa lưu việc làm nào</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Khi tìm kiếm việc làm, bạn có thể bấm vào biểu tượng Bookmark để lưu lại những công việc tiềm năng.
          </p>
          <button
            onClick={onExploreMore}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Khám phá việc làm ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3.5">
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 p-1 shrink-0 bg-white"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 
                      onClick={() => onSelectJob(job)}
                      className="text-sm sm:text-base font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer truncate"
                      title={job.title}
                    >
                      {job.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-600 truncate mt-0.5">{job.company}</p>
                    <span className="text-[11px] text-slate-400 block">{job.city}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                  <span className="px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 font-extrabold border border-orange-100 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    {job.salaryText}
                  </span>
                  <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                    {job.experience}
                  </span>
                  <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                    {job.jobType}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Hạn nộp hồ sơ: <strong>{job.deadline}</strong></span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => onRemoveSaved(job.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Bỏ lưu"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectJob(job)}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Xem chi tiết
                  </button>
                  <button
                    onClick={() => onApply(job)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Ứng tuyển
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
