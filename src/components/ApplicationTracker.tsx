import React, { useState } from 'react';
import { 
  Briefcase, 
  Clock, 
  Eye, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  DollarSign, 
  MapPin, 
  FileText, 
  MessageSquare, 
  Trash2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Application, ApplicationStatus } from '../types';

interface ApplicationTrackerProps {
  applications: Application[];
  onWithdrawApplication: (id: string) => void;
  onOpenChatWithRecruiter: (company: string, jobTitle: string) => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applications,
  onWithdrawApplication,
  onOpenChatWithRecruiter
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const filteredApps = applications.filter(app => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'applied':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
            <Clock className="w-3.5 h-3.5" />
            Đã nộp hồ sơ
          </span>
        );
      case 'viewed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
            <Eye className="w-3.5 h-3.5" />
            NTD đã xem hồ sơ
          </span>
        );
      case 'interview':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <Calendar className="w-3.5 h-3.5" />
            Mời phỏng vấn
          </span>
        );
      case 'offered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Đã trúng tuyển
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
            <XCircle className="w-3.5 h-3.5" />
            Chưa phù hợp
          </span>
        );
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
      {/* Title & Stats */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-blue-600" />
              Quản Lý Việc Làm Đã Ứng Tuyển
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Theo dõi sát sao tiến độ xét duyệt hồ sơ và lịch phỏng vấn từ các Nhà tuyển dụng
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-900 text-xs font-bold">
              Tổng số hồ sơ: {applications.length}
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900 text-xs font-bold">
              Phỏng vấn: {applications.filter(a => a.status === 'interview').length}
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-100">
          {[
            { id: 'all', label: `Tất cả (${applications.length})` },
            { id: 'applied', label: `Đã nộp (${applications.filter(a => a.status === 'applied').length})` },
            { id: 'viewed', label: `NTD đã xem (${applications.filter(a => a.status === 'viewed').length})` },
            { id: 'interview', label: `Mời phỏng vấn (${applications.filter(a => a.status === 'interview').length})` },
            { id: 'offered', label: `Trúng tuyển (${applications.filter(a => a.status === 'offered').length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Application List */}
      {filteredApps.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Chưa có đơn ứng tuyển nào trong mục này</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Hãy khám phá các cơ hội việc làm mới và nộp hồ sơ nhanh chỉ với 1 thao tác trên Nextstep.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <img
                    src={app.companyLogo}
                    alt={app.company}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 p-1 shrink-0 bg-white shadow-2xs"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {getStatusBadge(app.status)}
                      <span className="text-[11px] text-slate-400">
                        Nộp lúc: {app.appliedAt}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors">
                      {app.jobTitle}
                    </h3>

                    <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {app.company}
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">{app.location}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-2">
                      <span className="font-extrabold text-orange-600 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        {app.salaryText}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        {app.cvName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-start">
                  <button
                    onClick={() => onOpenChatWithRecruiter(app.company, app.jobTitle)}
                    className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Nhắn tin với NTD"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Nhắn tin với NTD</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Bạn có chắc chắn muốn rút hồ sơ ứng tuyển tại ${app.company}?`)) {
                        onWithdrawApplication(app.id);
                      }
                    }}
                    className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Rút hồ sơ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Note or Interview Alert */}
              {app.notes && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2">
                  <span className="font-bold text-blue-700 shrink-0">Cập nhật:</span>
                  <span>{app.notes}</span>
                </div>
              )}

              {app.interviewDate && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span><strong>Lịch hẹn phỏng vấn:</strong> {app.interviewDate}</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 underline">Đã xác nhận</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
