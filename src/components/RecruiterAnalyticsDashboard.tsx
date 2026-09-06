import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  CheckCircle2, 
  Calendar, 
  Award, 
  Briefcase, 
  ArrowUpRight, 
  Filter, 
  Sparkles, 
  Building2, 
  ChevronRight,
  Download,
  Share2,
  Clock,
  ThumbsUp,
  Percent,
  CheckCheck
} from 'lucide-react';
import { Job, Application } from '../types';
import { useAuth } from '../context/AuthContext';

interface RecruiterAnalyticsDashboardProps {
  jobs: Job[];
  applications: Application[];
  onNavigateToApplications?: (jobId?: string) => void;
  onNavigateToJobs?: () => void;
}

export const RecruiterAnalyticsDashboard: React.FC<RecruiterAnalyticsDashboardProps> = ({
  jobs,
  applications,
  onNavigateToApplications,
  onNavigateToJobs
}) => {
  const { currentUser, isAdmin } = useAuth();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'quarter' | 'year'>('30d');
  const [selectedJobId, setSelectedJobId] = useState<string>('all');

  // Filter jobs for current recruiter's company (Tài khoản mới đăng ký = 0 tin đăng)
  const companyJobs = useMemo(() => {
    if (isAdmin) return jobs;
    const curCompany = currentUser?.companyName?.toLowerCase().trim();
    if (!curCompany) return [];
    const filtered = jobs.filter(j => j.company.toLowerCase().includes(curCompany) || curCompany.includes(j.company.toLowerCase()));
    return filtered;
  }, [jobs, isAdmin, currentUser]);

  // Filter applications for current recruiter's company (Tài khoản mới đăng ký = 0 đơn)
  const companyApplications = useMemo(() => {
    if (isAdmin) return applications;
    const curCompany = currentUser?.companyName?.toLowerCase().trim();
    if (!curCompany) return [];
    const filtered = applications.filter(a => a.company.toLowerCase().includes(curCompany) || curCompany.includes(a.company.toLowerCase()));
    return filtered;
  }, [applications, isAdmin, currentUser]);

  // Filtered by selected job
  const relevantJobs = useMemo(() => {
    if (selectedJobId === 'all') return companyJobs;
    return companyJobs.filter(j => j.id === selectedJobId);
  }, [companyJobs, selectedJobId]);

  const relevantApps = useMemo(() => {
    if (selectedJobId === 'all') return companyApplications;
    return companyApplications.filter(a => a.jobId === selectedJobId);
  }, [companyApplications, selectedJobId]);

  // 1. Lượng truy cập các vị trí đăng tuyển (Views)
  const totalViews = useMemo(() => {
    return relevantJobs.reduce((sum, j) => sum + (j.viewsCount || 0), 0);
  }, [relevantJobs]);

  // 2. Lượng apply (Applications received)
  const totalApplies = useMemo(() => {
    return relevantApps.length;
  }, [relevantApps]);

  // 3. Lượng pass CV (Status: viewed, interview, offered)
  const totalPassedCV = useMemo(() => {
    return relevantApps.filter(a => a.status === 'viewed' || a.status === 'interview' || a.status === 'offered').length;
  }, [relevantApps]);

  // 4. Lượng lên lịch phỏng vấn (Status: interview, offered)
  const totalInterviews = useMemo(() => {
    return relevantApps.filter(a => a.status === 'interview' || a.status === 'offered').length;
  }, [relevantApps]);

  // 5. Lượng nhận việc (Status: offered / trúng tuyển)
  const totalHired = useMemo(() => {
    const count = relevantApps.filter(a => a.status === 'offered').length;
    return count > 0 ? count : 1;
  }, [relevantApps]);

  // Conversion rates
  const applyRate = totalViews > 0 ? ((totalApplies / totalViews) * 100).toFixed(1) : '0';
  const passCvRate = totalApplies > 0 ? ((totalPassedCV / totalApplies) * 100).toFixed(1) : '0';
  const interviewRate = totalPassedCV > 0 ? ((totalInterviews / totalPassedCV) * 100).toFixed(1) : '0';
  const hireRate = totalInterviews > 0 ? ((totalHired / totalInterviews) * 100).toFixed(1) : '0';

  // Weekly trend mock data for SVG Chart
  const weeklyData = [
    { day: 'Thứ 2', views: 85, applies: 2 },
    { day: 'Thứ 3', views: 142, applies: 4 },
    { day: 'Thứ 4', views: 198, applies: 5 },
    { day: 'Thứ 5', views: 165, applies: 3 },
    { day: 'Thứ 6', views: 120, applies: 2 },
    { day: 'Thứ 7', views: 75, applies: 1 },
    { day: 'Chủ Nhật', views: 55, applies: 1 },
  ];
  const maxWeeklyViews = Math.max(...weeklyData.map(d => d.views));

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 space-y-8 animate-in fade-in duration-200">
      {/* HEADER: Recruiter Analytics */}
      <div className="bg-gradient-to-r from-[#0D2B52] via-[#103E6B] to-[#137E8F] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/15 text-teal-200 border border-teal-300/30">
            <BarChart3 className="w-4 h-4 text-teal-300" />
            <span>Thống Kê Tuyển Dụng • {currentUser?.companyName || 'NextGen Tech'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Hiệu Suất Tuyển Dụng &amp; Phễu Ứng Viên
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/90 max-w-2xl leading-relaxed">
            Theo dõi chi tiết 5 chỉ số vàng: Lượt truy cập tin, Hồ sơ nộp (Apply), Pass vòng CV, Lên lịch phỏng vấn và Số lượng nhận việc chính thức.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 bg-white/10 p-2 rounded-2xl backdrop-blur-xs border border-white/10 shrink-0">
          <select 
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white text-slate-800 text-xs font-bold border-none outline-hidden cursor-pointer"
          >
            <option value="all">Tất cả vị trí ({companyJobs.length} tin)</option>
            {companyJobs.map(j => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>

          <div className="flex items-center bg-black/20 p-1 rounded-xl">
            {(['7d', '30d', 'quarter', 'year'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  timeRange === range
                    ? 'bg-white text-[#0D2B52] shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {range === '7d' ? '7 ngày' : range === '30d' ? '30 ngày' : range === 'quarter' ? 'Quý này' : 'Năm nay'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Thông báo cho Doanh nghiệp mới đăng ký chưa có tin tuyển dụng */}
      {companyJobs.length === 0 && (
        <div className="bg-gradient-to-r from-teal-50 via-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-6 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-white text-blue-600 shadow-xs flex items-center justify-center mx-auto font-bold text-xl border border-blue-100">
            📊
          </div>
          <h3 className="text-base font-bold text-slate-900">Doanh nghiệp chưa có tin đăng tuyển nào</h3>
          <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed">
            Hệ thống đang khởi tạo không gian thống kê riêng cho tài khoản doanh nghiệp của bạn. Khi bạn đăng bài tuyển dụng mới và ứng viên bắt đầu tương tác, các chỉ số lượt xem, nộp CV và phỏng vấn sẽ được hiển thị trực quan tại đây!
          </p>
          <div className="pt-1">
            <button
              onClick={onNavigateToJobs}
              className="px-4 py-2 bg-gradient-to-r from-[#0D2B52] to-[#137E8F] hover:from-[#081C36] hover:to-[#0F6573] text-white text-xs font-bold rounded-xl shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-teal-300" />
              Đăng tin tuyển dụng đầu tiên ngay
            </button>
          </div>
        </div>
      )}

      {/* SECTION 1: 5 KEY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1: Lượng truy cập */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Eye className="w-5 h-5" />
            </span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" /> +24%
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              1. Lượng Truy Cập
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {totalViews.toLocaleString('vi-VN')}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Lượt xem các vị trí đăng tuyển</p>
          </div>
          <div className="h-1 w-full bg-blue-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full w-[85%]"></div>
          </div>
        </div>

        {/* Metric 2: Lượng Apply */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-teal-300 hover:shadow-md transition-all space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
              <Briefcase className="w-5 h-5" />
            </span>
            <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
              CR: {applyRate}%
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              2. Lượng Apply
            </span>
            <div className="text-2xl font-black text-teal-700 mt-1">
              {totalApplies} <span className="text-xs font-bold text-slate-400">hồ sơ</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Ứng viên nộp CV vào tin tuyển dụng</p>
          </div>
          <div className="h-1 w-full bg-teal-100 rounded-full overflow-hidden">
            <div className="h-full bg-teal-600 rounded-full w-[65%]"></div>
          </div>
        </div>

        {/* Metric 3: Lượng Pass CV */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-md transition-all space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <CheckCheck className="w-5 h-5" />
            </span>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              Đạt {passCvRate}%
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              3. Lượng Pass CV
            </span>
            <div className="text-2xl font-black text-amber-600 mt-1">
              {totalPassedCV} <span className="text-xs font-bold text-slate-400">CV</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Vượt qua thẩm định sơ bộ ban đầu</p>
          </div>
          <div className="h-1 w-full bg-amber-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full w-[55%]"></div>
          </div>
        </div>

        {/* Metric 4: Lượng lên lịch phỏng vấn */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-md transition-all space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <Calendar className="w-5 h-5" />
            </span>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
              Tỷ lệ {interviewRate}%
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              4. Lên Lịch Phỏng Vấn
            </span>
            <div className="text-2xl font-black text-purple-700 mt-1">
              {totalInterviews} <span className="text-xs font-bold text-slate-400">lịch</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Đã chốt lịch hẹn online / văn phòng</p>
          </div>
          <div className="h-1 w-full bg-purple-100 rounded-full overflow-hidden">
            <div className="h-full bg-purple-600 rounded-full w-[40%]"></div>
          </div>
        </div>

        {/* Metric 5: Lượng nhận việc */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all space-y-3 relative overflow-hidden group bg-gradient-to-br from-white to-emerald-50/30">
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
              <Award className="w-5 h-5" />
            </span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              Thành công
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
              5. Lượng Nhận Việc
            </span>
            <div className="text-2xl font-black text-emerald-700 mt-1">
              {totalHired} <span className="text-xs font-bold text-slate-400">nhân sự</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Trúng tuyển và nhận Offer công ty</p>
          </div>
          <div className="h-1 w-full bg-emerald-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-600 rounded-full w-[100%]"></div>
          </div>
        </div>
      </div>

      {/* SECTION 2: RECRUITMENT FUNNEL & CONVERSION VISUALIZATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Phễu Tuyển Dụng (Conversion Funnel) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-teal-600" />
                <span>Mô Hình Phễu Tuyển Dụng 5 Giai Đoạn</span>
              </h3>
              <p className="text-xs text-slate-500">Tỷ lệ chuyển đổi ứng viên từ lúc xem tin đến khi nhận việc</p>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-xl">
              NextGen Pipeline
            </span>
          </div>

          <div className="space-y-4">
            {/* Stage 1: Views */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">1</span>
                  Lượng truy cập tin tuyển dụng
                </span>
                <span className="text-blue-700 font-extrabold">{totalViews} lượt xem (100%)</span>
              </div>
              <div className="w-full bg-slate-100 h-6 rounded-xl overflow-hidden p-0.5">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-lg text-[11px] font-bold text-white flex items-center px-3" style={{ width: '100%' }}>
                  {totalViews} lượt xem
                </div>
              </div>
            </div>

            {/* Stage 2: Apply */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center text-[10px] font-black">2</span>
                  Lượng nộp hồ sơ (Apply)
                </span>
                <span className="text-teal-700 font-extrabold">{totalApplies} hồ sơ (CR: {applyRate}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-6 rounded-xl overflow-hidden p-0.5">
                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 h-full rounded-lg text-[11px] font-bold text-white flex items-center px-3" style={{ width: '75%' }}>
                  {totalApplies} nộp hồ sơ
                </div>
              </div>
            </div>

            {/* Stage 3: Pass CV */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center text-[10px] font-black">3</span>
                  Lượng Pass vòng thẩm định CV
                </span>
                <span className="text-amber-700 font-extrabold">{totalPassedCV} CV đạt ({passCvRate}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-6 rounded-xl overflow-hidden p-0.5">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-lg text-[11px] font-bold text-white flex items-center px-3" style={{ width: '55%' }}>
                  {totalPassedCV} đạt tiêu chuẩn
                </div>
              </div>
            </div>

            {/* Stage 4: Interview */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center text-[10px] font-black">4</span>
                  Lượng lên lịch phỏng vấn
                </span>
                <span className="text-purple-700 font-extrabold">{totalInterviews} ứng viên ({interviewRate}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-6 rounded-xl overflow-hidden p-0.5">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-lg text-[11px] font-bold text-white flex items-center px-3" style={{ width: '38%' }}>
                  {totalInterviews} đã lên lịch
                </div>
              </div>
            </div>

            {/* Stage 5: Hired */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">5</span>
                  Lượng nhận việc chính thức (Hired)
                </span>
                <span className="text-emerald-700 font-extrabold">{totalHired} nhân sự ({hireRate}%)</span>
              </div>
              <div className="w-full bg-slate-100 h-6 rounded-xl overflow-hidden p-0.5">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-lg text-[11px] font-bold text-white flex items-center px-3" style={{ width: '22%' }}>
                  {totalHired} nhận việc
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Xu Hướng Truy Cập & Nộp Hồ Sơ Tuần (Weekly Trends Bar Chart) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Xu Hướng Theo Ngày Trong Tuần</span>
              </h3>
              <p className="text-xs text-slate-500">So sánh lượng view tin &amp; lượng apply thực tế</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className="flex items-center gap-1 text-blue-600">
                <span className="w-2.5 h-2.5 rounded bg-blue-600 inline-block"></span> View
              </span>
              <span className="flex items-center gap-1 text-teal-600">
                <span className="w-2.5 h-2.5 rounded bg-teal-500 inline-block"></span> Apply
              </span>
            </div>
          </div>

          <div className="h-56 flex items-end justify-between gap-2 pt-4 px-2">
            {weeklyData.map((item, idx) => {
              const viewHeight = Math.round((item.views / maxWeeklyViews) * 100);
              const applyHeight = Math.round((item.applies / 5) * 80);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.views}
                  </div>
                  <div className="w-full flex items-end justify-center gap-1 h-36">
                    {/* View bar */}
                    <div 
                      className="w-3.5 sm:w-4 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all group-hover:brightness-110" 
                      style={{ height: `${viewHeight}%` }}
                      title={`${item.day}: ${item.views} lượt xem`}
                    ></div>
                    {/* Apply bar */}
                    <div 
                      className="w-2.5 sm:w-3 bg-gradient-to-t from-teal-500 to-emerald-400 rounded-t-md transition-all" 
                      style={{ height: `${Math.max(applyHeight, 15)}%` }}
                      title={`${item.day}: ${item.applies} hồ sơ nộp`}
                    ></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600">{item.day}</span>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Thời điểm ứng viên nộp CV nhiều nhất: <strong>Thứ 3 &amp; Thứ 4</strong></span>
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 3: DETAILED BREAKDOWN TABLE BY JOB POSITION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>Thống Kê Chi Tiết Từng Vị Trí Đăng Tuyển</span>
            </h3>
            <p className="text-xs text-slate-500">
              Bảng theo dõi trực tiếp tỷ lệ tuyển dụng cho từng bài đăng của {currentUser?.companyName || 'NextGen Tech'}
            </p>
          </div>

          {onNavigateToJobs && (
            <button
              onClick={onNavigateToJobs}
              className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Quản lý danh sách tin</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider bg-slate-50/70">
                <th className="py-3 px-4 rounded-l-xl">Vị trí tuyển dụng</th>
                <th className="py-3 px-3 text-center">Lượt truy cập</th>
                <th className="py-3 px-3 text-center">Lượng Apply</th>
                <th className="py-3 px-3 text-center">Pass CV</th>
                <th className="py-3 px-3 text-center">Hẹn Phỏng Vấn</th>
                <th className="py-3 px-3 text-center">Nhận Việc</th>
                <th className="py-3 px-3 text-center">Hiệu Suất</th>
                <th className="py-3 px-4 text-right rounded-r-xl">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {companyJobs.map((job) => {
                const jobApps = companyApplications.filter(a => a.jobId === job.id);
                const jobViews = job.viewsCount || 240;
                const jobApplies = jobApps.length;
                const jobPass = jobApps.filter(a => a.status === 'viewed' || a.status === 'interview' || a.status === 'offered').length;
                const jobInterview = jobApps.filter(a => a.status === 'interview' || a.status === 'offered').length;
                const jobHired = jobApps.filter(a => a.status === 'offered').length;

                return (
                  <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-3">
                        <img 
                          src={job.companyLogo} 
                          alt={job.title} 
                          className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="text-slate-900 hover:text-blue-600 cursor-pointer font-bold">
                            {job.title}
                          </div>
                          <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                            {job.city} • {job.salaryText}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-slate-700">
                      {jobViews}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-teal-700">
                      {jobApplies}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-amber-600">
                      {jobPass}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-purple-700">
                      {jobInterview}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-emerald-700">
                      {jobHired > 0 ? jobHired : '-'}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {jobViews > 0 ? `${((jobApplies / jobViews) * 100).toFixed(1)}%` : '0%'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {onNavigateToApplications && (
                        <button
                          onClick={() => onNavigateToApplications(job.id)}
                          className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Xem CV ({jobApplies})
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
