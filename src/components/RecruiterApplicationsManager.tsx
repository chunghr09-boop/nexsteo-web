import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Eye, 
  X, 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  Star, 
  Sparkles, 
  Building2, 
  Download,
  CheckCheck,
  Video,
  AlertCircle
} from 'lucide-react';
import { Application, Job, ApplicationStatus, CandidateProfile } from '../types';
import { useAuth } from '../context/AuthContext';

interface RecruiterApplicationsManagerProps {
  applications: Application[];
  jobs: Job[];
  onUpdateApplicationStatus?: (appId: string, newStatus: ApplicationStatus, notes?: string, interviewDate?: string) => void;
  onOpenChatWithCandidate?: (candidateName: string, jobTitle?: string) => void;
}

export const RecruiterApplicationsManager: React.FC<RecruiterApplicationsManagerProps> = ({
  applications,
  jobs,
  onUpdateApplicationStatus,
  onOpenChatWithCandidate
}) => {
  const { currentUser, isAdmin } = useAuth();

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJobId, setFilterJobId] = useState('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Candidate CV Modal
  const [viewingApp, setViewingApp] = useState<Application | null>(null);

  // Interview modal
  const [interviewApp, setInterviewApp] = useState<Application | null>(null);
  const [interviewDate, setInterviewDate] = useState('2026-03-12T10:00');
  const [interviewFormat, setInterviewFormat] = useState<'online' | 'office'>('online');
  const [interviewLocation, setInterviewLocation] = useState('Google Meet (https://meet.google.com/nxt-interview)');
  const [interviewNote, setInterviewNote] = useState('Phỏng vấn chuyên môn kỹ thuật vòng 1');

  // HR Notes & Rating state per application
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState<string>('');
  const [ratings, setRatings] = useState<Record<string, number>>({
    'app-nextgen-1': 5,
    'app-nextgen-2': 5,
    'app-nextgen-3': 4
  });

  // Filter applications for current recruiter's company
  const companyApplications = useMemo(() => {
    if (isAdmin) return applications;
    const curCompany = currentUser?.companyName?.toLowerCase().trim();
    if (!curCompany) return [];
    const filtered = applications.filter(a => a.company.toLowerCase().includes(curCompany) || curCompany.includes(a.company.toLowerCase()));
    return filtered;
  }, [applications, isAdmin, currentUser]);

  // Filter jobs for current recruiter's company (Tài khoản mới đăng ký chưa đăng bài sẽ có 0 tin)
  const companyJobs = useMemo(() => {
    if (isAdmin) return jobs;
    const curCompany = currentUser?.companyName?.toLowerCase().trim();
    if (!curCompany) return [];
    const filtered = jobs.filter(j => j.company.toLowerCase().includes(curCompany) || curCompany.includes(j.company.toLowerCase()));
    return filtered;
  }, [jobs, isAdmin, currentUser]);

  // Displayed applications with search and filters
  const displayedApps = useMemo(() => {
    return companyApplications.filter(app => {
      if (filterJobId !== 'all' && app.jobId !== filterJobId) return false;
      if (filterStatus !== 'all' && app.status !== filterStatus) return false;
      if (searchTerm.trim()) {
        const kw = searchTerm.toLowerCase();
        const matchTitle = app.jobTitle.toLowerCase().includes(kw);
        const matchNotes = (app.notes || '').toLowerCase().includes(kw);
        const matchCV = (app.cvName || '').toLowerCase().includes(kw);
        if (!matchTitle && !matchNotes && !matchCV) return false;
      }
      return true;
    });
  }, [companyApplications, filterJobId, filterStatus, searchTerm]);

  // Status mapping
  const renderStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'applied':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" /> Chờ duyệt sơ bộ
          </span>
        );
      case 'viewed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
            <CheckCheck className="w-3 h-3 text-blue-600" /> Đạt vòng CV
          </span>
        );
      case 'interview':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-purple-600" /> Đã lên lịch phỏng vấn
          </span>
        );
      case 'offered':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Đã nhận việc / Offer
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
            <X className="w-3 h-3 text-rose-600" /> Chưa phù hợp
          </span>
        );
      default:
        return null;
    }
  };

  const handleStatusChange = (appId: string, newStatus: ApplicationStatus) => {
    if (onUpdateApplicationStatus) {
      onUpdateApplicationStatus(appId, newStatus);
    }
  };

  const handleSaveInterview = () => {
    if (!interviewApp) return;
    const formatted = new Date(interviewDate).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
    const fullNote = `Lịch phỏng vấn: ${formatted} • ${interviewFormat === 'online' ? 'Trực tuyến' : 'Tại văn phòng'} (${interviewLocation}). ${interviewNote}`;
    if (onUpdateApplicationStatus) {
      onUpdateApplicationStatus(interviewApp.id, 'interview', fullNote, interviewDate);
    }
    alert('Đã lên lịch phỏng vấn thành công và gửi thông báo tới ứng viên!');
    setInterviewApp(null);
  };

  const handleSaveNote = (appId: string) => {
    if (onUpdateApplicationStatus) {
      onUpdateApplicationStatus(appId, companyApplications.find(a => a.id === appId)?.status || 'applied', noteInput);
    }
    setEditingNotesId(null);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 space-y-6 animate-in fade-in duration-200">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#0D2B52] via-[#103E6B] to-[#137E8F] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/15 text-teal-200 border border-teal-300/30">
            <Users className="w-4 h-4 text-teal-300" />
            <span>Phần Quản Lý Hồ Sơ Ứng Tuyển • {currentUser?.companyName || 'NextGen Tech'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Thống Kê Tài Khoản &amp; Đánh Giá CV Ứng Tuyển
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 max-w-2xl leading-relaxed">
            Theo dõi chi tiết danh sách tài khoản ứng viên, thẩm định CV, chấm điểm năng lực, đặt lịch phỏng vấn và cập nhật tình trạng tuyển dụng.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/10 shrink-0 text-xs">
          <div className="text-center px-2">
            <span className="text-2xl font-black text-white">{companyApplications.length}</span>
            <span className="block text-[10px] text-teal-200 font-semibold uppercase">Tổng CV đã nộp</span>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="text-center px-2">
            <span className="text-2xl font-black text-amber-300">
              {companyApplications.filter(a => a.status === 'applied').length}
            </span>
            <span className="block text-[10px] text-teal-200 font-semibold uppercase">Chờ đánh giá</span>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="text-center px-2">
            <span className="text-2xl font-black text-emerald-300">
              {companyApplications.filter(a => a.status === 'interview' || a.status === 'offered').length}
            </span>
            <span className="block text-[10px] text-teal-200 font-semibold uppercase">Hẹn PV &amp; Offer</span>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên vị trí, file CV, ghi chú đánh giá..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#137E8F] focus:border-transparent outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter by Job */}
          <select
            value={filterJobId}
            onChange={(e) => setFilterJobId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 outline-hidden"
          >
            <option value="all">Tất cả vị trí việc làm ({companyJobs.length})</option>
            {companyJobs.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>

          {/* Filter by Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 outline-hidden"
          >
            <option value="all">Tất cả tình trạng đánh giá</option>
            <option value="applied">Chờ duyệt sơ bộ</option>
            <option value="viewed">Đạt vòng CV</option>
            <option value="interview">Đã lên lịch phỏng vấn</option>
            <option value="offered">Đã nhận việc / Trúng tuyển</option>
            <option value="rejected">Chưa phù hợp</option>
          </select>
        </div>
      </div>

      {/* APPLICATIONS LIST / TABLE */}
      {displayedApps.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">Chưa tìm thấy hồ sơ ứng tuyển phù hợp</h3>
          <p className="text-xs text-slate-500">Thử đổi từ khóa tìm kiếm hoặc chọn bộ lọc trạng thái khác.</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {displayedApps.map((app) => {
            const currentRating = ratings[app.id] || 4;
            const applicantName = app.coverLetter.includes('Nguyễn Hoàng Minh') 
              ? 'Nguyễn Hoàng Minh' 
              : app.coverLetter.includes('Lê Thị Thu Thảo') 
                ? 'Lê Thị Thu Thảo' 
                : app.coverLetter.includes('Trần Văn Đức')
                  ? 'Trần Văn Đức'
                  : 'Ứng viên Nextstep';
            
            const applicantAvatar = applicantName === 'Nguyễn Hoàng Minh'
              ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80'
              : applicantName === 'Lê Thị Thu Thảo'
                ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&auto=format&fit=crop&q=80';

            const applicantEmail = applicantName === 'Nguyễn Hoàng Minh'
              ? 'hoangminh.dev@gmail.com'
              : applicantName === 'Lê Thị Thu Thảo'
                ? 'thuthao.le@gmail.com'
                : 'duc.tran95@gmail.com';

            const applicantPhone = applicantName === 'Nguyễn Hoàng Minh'
              ? '0988 765 432'
              : applicantName === 'Lê Thị Thu Thảo'
                ? '0912 345 678'
                : '0909 888 777';

            return (
              <div 
                key={app.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:border-teal-200 hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* CỘT 1: THÔNG TIN TÀI KHOẢN ỨNG VIÊN */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <img 
                      src={applicantAvatar} 
                      alt={applicantName}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                    />
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-slate-900 truncate">
                          {applicantName}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          ID: {app.id}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-medium">
                          <Mail className="w-3.5 h-3.5 text-slate-400" /> {applicantEmail}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-medium">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {applicantPhone}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> Nộp lúc: {app.appliedAt}
                        </span>
                      </div>

                      {/* CỘT 2: VỊ TRÍ VIỆC LÀM ỨNG TUYỂN */}
                      <div className="pt-2 flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-semibold">Vị trí ứng tuyển:</span>
                        <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-800 text-xs font-black border border-blue-200 flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                          {app.jobTitle}
                        </span>
                        <span className="text-xs font-bold text-orange-600">{app.salaryText}</span>
                      </div>
                    </div>
                  </div>

                  {/* CỘT 3: TÌNH TRẠNG ĐÁNH GIÁ CỦA NHÀ TUYỂN DỤNG */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2.5 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tình trạng:</span>
                      {renderStatusBadge(app.status)}
                    </div>

                    {/* Change Status Dropdown */}
                    <div className="flex items-center gap-2">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800 focus:ring-2 focus:ring-[#137E8F] outline-hidden cursor-pointer shadow-2xs"
                      >
                        <option value="applied">Chờ duyệt sơ bộ</option>
                        <option value="viewed">Đạt vòng CV</option>
                        <option value="interview">Hẹn phỏng vấn</option>
                        <option value="offered">Nhận việc / Trúng tuyển</option>
                        <option value="rejected">Từ chối hồ sơ</option>
                      </select>

                      <button
                        onClick={() => setInterviewApp(app)}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Hẹn Phỏng Vấn</span>
                      </button>
                    </div>

                    {/* Rating stars */}
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-[11px] text-slate-400 font-medium mr-1">Đánh giá HR:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          onClick={() => setRatings(prev => ({ ...prev, [app.id]: star }))}
                          className={`w-4 h-4 cursor-pointer transition-colors ${
                            star <= currentRating 
                              ? 'fill-amber-400 text-amber-400' 
                              : 'text-slate-300 hover:text-amber-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* CỘT 4: CV ỨNG TUYỂN & THƯ ỨNG TUYỂN */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-slate-800">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-bold">File CV đính kèm:</span>
                      <code className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-blue-700 font-bold text-xs">
                        {app.cvName || 'CV_Ung_Vien_Nextstep.pdf'}
                      </code>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewingApp(app)}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>Xem CV Chi Tiết</span>
                      </button>

                      {onOpenChatWithCandidate && (
                        <button
                          onClick={() => onOpenChatWithCandidate(applicantName, app.jobTitle)}
                          className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                          <span>Nhắn tin với ứng viên</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {app.coverLetter && (
                    <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200/60 leading-relaxed italic">
                      <span className="font-bold text-slate-700 not-italic mr-1">Thư ứng tuyển:</span>
                      "{app.coverLetter}"
                    </div>
                  )}

                  {/* GHI CHÚ ĐÁNH GIÁ CỦA NHÀ TUYỂN DỤNG */}
                  <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    {editingNotesId === app.id ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input 
                          type="text"
                          value={noteInput}
                          onChange={(e) => setNoteInput(e.target.value)}
                          placeholder="Nhập ghi chú nhận xét của HR về ứng viên này..."
                          className="flex-1 px-3 py-1.5 rounded-xl border border-blue-400 bg-white text-xs outline-hidden"
                        />
                        <button
                          onClick={() => handleSaveNote(app.id)}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-blue-700"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={() => setEditingNotesId(null)}
                          className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-300"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-slate-600 flex items-center gap-1.5">
                          <span className="font-bold text-slate-800">Nhận xét của HR:</span>
                          <span className="text-slate-700">{app.notes || 'Chưa có ghi chú nhận xét.'}</span>
                        </span>
                        <button
                          onClick={() => {
                            setEditingNotesId(app.id);
                            setNoteInput(app.notes || '');
                          }}
                          className="text-blue-600 hover:underline font-bold text-[11px] cursor-pointer"
                        >
                          {app.notes ? 'Sửa nhận xét' : '+ Thêm nhận xét'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: XEM CHI TIẾT CV ỨNG VIÊN */}
      {viewingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0D2B52] to-[#137E8F] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-teal-300" />
                <div>
                  <h3 className="text-sm font-black text-white">Hồ Sơ CV Ứng Tuyển Chi Tiết</h3>
                  <p className="text-[11px] text-teal-100/90">{viewingApp.jobTitle} • {viewingApp.company}</p>
                </div>
              </div>
              <button 
                onClick={() => setViewingApp(null)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-130px)] text-xs text-slate-700">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block text-sm">
                    {viewingApp.cvName || 'CV_Chuyen_Nghiep_Ung_Vien.pdf'}
                  </span>
                  <span className="text-[11px] text-slate-500">Đã xác minh thông tin qua số điện thoại và email</span>
                </div>
                <button
                  onClick={() => alert(`Đang tải xuống tệp: ${viewingApp.cvName}...`)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải file PDF</span>
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider text-teal-700">
                  Thư Giới Thiệu Bản Thân (Cover Letter)
                </h4>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-slate-600 leading-relaxed italic">
                  "{viewingApp.coverLetter || 'Ứng viên chưa cung cấp thư ứng tuyển.'}"
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider text-teal-700">
                  Kỹ Năng &amp; Năng Lực Nổi Bật
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['React Native', 'TypeScript', 'Redux Toolkit', 'RESTful API', 'Git', 'Clean Architecture', 'Agile/Scrum'].map(skill => (
                    <span key={skill} className="px-3 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider text-teal-700">
                  Kinh Nghiệm Làm Việc Gần Nhất
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>Senior Mobile Developer</span>
                    <span className="text-slate-500 text-[11px]">2023 - Nay</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Chịu trách nhiệm kiến trúc và phát triển ứng dụng di động fintech, tối ưu hiệu năng 60fps, xử lý đồng bộ offline và tích hợp thanh toán bảo mật.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={() => {
                    handleStatusChange(viewingApp.id, 'rejected');
                    setViewingApp(null);
                  }}
                  className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Từ chối hồ sơ
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      handleStatusChange(viewingApp.id, 'viewed');
                      setViewingApp(null);
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Đạt vòng CV
                  </button>
                  <button
                    onClick={() => {
                      const app = viewingApp;
                      setViewingApp(null);
                      setInterviewApp(app);
                    }}
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Lên lịch phỏng vấn ngay</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: HẸN LỊCH PHỎNG VẤN */}
      {interviewApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                  <Calendar className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Lên Lịch Hẹn Phỏng Vấn</h3>
                  <p className="text-xs text-slate-500">Vị trí: {interviewApp.jobTitle}</p>
                </div>
              </div>
              <button onClick={() => setInterviewApp(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Thời gian phỏng vấn *</label>
                <input 
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hình thức phỏng vấn</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setInterviewFormat('online');
                      setInterviewLocation('Google Meet (https://meet.google.com/nxt-interview)');
                    }}
                    className={`py-2 px-3 rounded-xl font-bold border text-center cursor-pointer ${
                      interviewFormat === 'online'
                        ? 'bg-purple-100 text-purple-900 border-purple-300'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    🎥 Trực tuyến (Online)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInterviewFormat('office');
                      setInterviewLocation('Tầng 12, Tòa nhà Pearl Plaza, 561A Điện Biên Phủ, Phường 25, Bình Thạnh, TP.HCM');
                    }}
                    className={`py-2 px-3 rounded-xl font-bold border text-center cursor-pointer ${
                      interviewFormat === 'office'
                        ? 'bg-purple-100 text-purple-900 border-purple-300'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    🏢 Tại văn phòng công ty
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Địa điểm / Đường dẫn cuộc gọi</label>
                <input 
                  type="text"
                  value={interviewLocation}
                  onChange={(e) => setInterviewLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi chú gửi ứng viên</label>
                <textarea 
                  rows={3}
                  value={interviewNote}
                  onChange={(e) => setInterviewNote(e.target.value)}
                  placeholder="Ghi chú nội dung phỏng vấn hoặc yêu cầu mang theo..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-slate-800 outline-hidden"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setInterviewApp(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleSaveInterview}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Xác nhận &amp; Gửi lịch hẹn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
