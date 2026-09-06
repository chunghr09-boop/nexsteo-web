import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  GraduationCap, 
  Layers, 
  Clock, 
  SlidersHorizontal, 
  RotateCcw, 
  Flame, 
  Laptop,
  ChevronDown
} from 'lucide-react';
import { FilterState } from '../types';
import { CITIES, INDUSTRIES, SALARY_RANGES, EXPERIENCES, LEVELS, JOB_TYPES } from '../data/mockJobs';

interface JobSearchHeroProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalJobsFound: number;
  onResetFilters: () => void;
  searchHistory?: string[];
  onSelectSearchHistory?: (keyword: string) => void;
  onClearSearchHistory?: () => void;
  onRecordSearch?: (keyword: string) => void;
}

export const JobSearchHero: React.FC<JobSearchHeroProps> = ({
  filters,
  setFilters,
  totalJobsFound,
  onResetFilters,
  searchHistory = [],
  onSelectSearchHistory,
  onClearSearchHistory,
  onRecordSearch
}) => {
  const [showAdvanced, setShowAdvanced] = useState(true);

  const handleTriggerSearch = () => {
    if (filters.keyword.trim()) {
      onRecordSearch?.(filters.keyword.trim());
    }
  };

  const handleApplyKeyword = (kw: string) => {
    setFilters(prev => ({ ...prev, keyword: kw }));
    onRecordSearch?.(kw);
  };

  const quickPills = [
    { label: '🔥 Việc làm tại Nextstep (Cầu Giấy)', action: () => { setFilters(prev => ({ ...prev, keyword: 'Nextstep', city: 'Hà Nội' })); onRecordSearch?.('Nextstep'); } },
    { label: '📍 Khu vực Cầu Giấy, Hà Nội', action: () => { setFilters(prev => ({ ...prev, keyword: 'Cầu Giấy', city: 'Hà Nội' })); onRecordSearch?.('Cầu Giấy'); } },
    { label: 'ReactJS / Frontend', action: () => handleApplyKeyword('React') },
    { label: 'Lương > 25 Triệu', action: () => setFilters(prev => ({ ...prev, salaryRange: '25 - 40 triệu' })) },
    { label: 'Tuyển dụng HR & TA', action: () => handleApplyKeyword('Tuyển dụng') },
    { label: 'Làm việc từ xa (Remote)', action: () => setFilters(prev => ({ ...prev, isRemoteOnly: !prev.isRemoteOnly })) },
    { label: 'Tuyển gấp 24h', action: () => setFilters(prev => ({ ...prev, isUrgentOnly: !prev.isUrgentOnly })) },
    { label: 'Fullstack / Node.js', action: () => handleApplyKeyword('Node') }
  ];

  // Count active filters (excluding defaults)
  const activeFiltersCount = [
    filters.city !== 'Tất cả địa điểm',
    filters.industry !== 'Tất cả ngành nghề',
    filters.salaryRange !== 'Tất cả mức lương',
    filters.experience !== 'Tất cả kinh nghiệm',
    filters.level !== 'Tất cả cấp bậc',
    filters.jobType !== 'Tất cả hình thức',
    filters.isUrgentOnly,
    filters.isRemoteOnly,
    Boolean(filters.keyword.trim())
  ].filter(Boolean).length;

  return (
    <div className="bg-gradient-to-b from-[#0B2346] via-[#0E355E] to-[#125372] text-white pt-8 pb-10 px-4 sm:px-6 relative overflow-hidden shadow-lg">
      {/* Decorative background grid & glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-teal-200 text-xs font-semibold uppercase tracking-wider mb-2.5 border border-white/15">
            <Flame className="w-3.5 h-3.5 text-emerald-400" />
            Công ty Cổ phần Nextstep - Nền Tảng Tuyển Dụng Thông Minh
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Bước tiến sự nghiệp cùng Nextstep
          </h1>
          <p className="mt-2 text-sm sm:text-base text-teal-100/90 font-normal">
            Khám phá hàng ngàn cơ hội việc làm chất lượng cao với công nghệ gợi ý việc làm chuẩn xác theo kỹ năng &amp; hồ sơ của bạn
          </p>
        </div>

        {/* Search Box Container */}
        <div className="bg-white text-slate-800 rounded-2xl p-3 sm:p-4 shadow-2xl border border-slate-100 w-full max-w-6xl mx-auto">
          {/* Main Primary Search Controls */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
            {/* Keyword Input */}
            <div className="md:col-span-5 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#137E8F]" />
              </div>
              <input
                id="search-job-input"
                type="text"
                placeholder="Tên công việc, vị trí, kỹ năng, công ty..."
                value={filters.keyword}
                onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleTriggerSearch();
                  }
                }}
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-800 border border-slate-200 focus:border-[#137E8F] focus:ring-2 focus:ring-teal-100 focus:outline-hidden transition-all"
              />
            </div>

            {/* City Dropdown */}
            <div className="md:col-span-3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-emerald-600" />
              </div>
              <select
                id="filter-city-select"
                value={filters.city}
                onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                className="w-full pl-9 pr-8 py-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-800 border border-slate-200 focus:border-[#137E8F] focus:ring-2 focus:ring-teal-100 focus:outline-hidden appearance-none cursor-pointer font-medium"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Industry Dropdown */}
            <div className="md:col-span-3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-4 w-4 text-[#137E8F]" />
              </div>
              <select
                id="filter-industry-select"
                value={filters.industry}
                onChange={(e) => setFilters(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full pl-9 pr-8 py-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-800 border border-slate-200 focus:border-[#137E8F] focus:ring-2 focus:ring-teal-100 focus:outline-hidden appearance-none cursor-pointer font-medium"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* Submit / Action Button */}
            <div className="md:col-span-1 flex">
              <button
                id="search-submit-btn"
                onClick={handleTriggerSearch}
                className="w-full py-3 bg-gradient-to-r from-[#0D2B52] to-[#137E8F] hover:from-[#091F3C] hover:to-[#0E6573] active:scale-95 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 shadow-md shadow-teal-900/20 transition-all cursor-pointer"
                title="Tìm kiếm ngay"
              >
                <Search className="w-4 h-4" />
                <span className="md:hidden">Tìm việc</span>
              </button>
            </div>
          </div>

          {/* Advanced Filters Expandable Row */}
          {showAdvanced && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* Mức lương */}
                <div className="relative">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mb-1">
                    <DollarSign className="w-3 h-3 text-emerald-600" />
                    <span>Mức lương</span>
                  </div>
                  <select
                    id="filter-salary-select"
                    value={filters.salaryRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, salaryRange: e.target.value }))}
                    className="w-full px-2.5 py-2 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    {SALARY_RANGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Kinh nghiệm */}
                <div className="relative">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mb-1">
                    <Clock className="w-3 h-3 text-blue-600" />
                    <span>Kinh nghiệm</span>
                  </div>
                  <select
                    id="filter-exp-select"
                    value={filters.experience}
                    onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full px-2.5 py-2 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    {EXPERIENCES.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>

                {/* Cấp bậc */}
                <div className="relative">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mb-1">
                    <GraduationCap className="w-3 h-3 text-purple-600" />
                    <span>Cấp bậc</span>
                  </div>
                  <select
                    id="filter-level-select"
                    value={filters.level}
                    onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
                    className="w-full px-2.5 py-2 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                {/* Hình thức */}
                <div className="relative">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mb-1">
                    <Layers className="w-3 h-3 text-amber-600" />
                    <span>Hình thức</span>
                  </div>
                  <select
                    id="filter-type-select"
                    value={filters.jobType}
                    onChange={(e) => setFilters(prev => ({ ...prev, jobType: e.target.value }))}
                    className="w-full px-2.5 py-2 text-xs font-semibold rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Checkbox Toggles & Reset */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-2.5 border-t border-slate-100 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={filters.isUrgentOnly}
                      onChange={(e) => setFilters(prev => ({ ...prev, isUrgentOnly: e.target.checked }))}
                      className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="flex items-center gap-1 text-orange-600 font-semibold">
                      <Flame className="w-3.5 h-3.5" />
                      Tuyển gấp (Urgent)
                    </span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={filters.isRemoteOnly}
                      onChange={(e) => setFilters(prev => ({ ...prev, isRemoteOnly: e.target.checked }))}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="flex items-center gap-1 text-blue-600 font-semibold">
                      <Laptop className="w-3.5 h-3.5" />
                      Làm việc từ xa (Remote)
                    </span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  {activeFiltersCount > 0 && (
                    <button
                      id="reset-filters-btn"
                      onClick={onResetFilters}
                      className="flex items-center gap-1 text-slate-500 hover:text-red-600 font-medium px-2 py-1 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Xóa bộ lọc ({activeFiltersCount})
                    </button>
                  )}
                  <span className="text-slate-400 text-xs hidden sm:inline">|</span>
                  <span className="text-blue-700 font-bold">
                    Tìm thấy <span className="underline font-black">{totalJobsFound}</span> việc làm
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lịch sử tìm kiếm gần đây: Chỉ hiển thị khi có lịch sử thao tác của người dùng */}
        {searchHistory && searchHistory.length > 0 && (
          <div className="w-full max-w-6xl mx-auto mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-teal-200 font-semibold flex items-center gap-1 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-teal-300" />
                Lịch sử tìm kiếm gần đây:
              </span>
              {searchHistory.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectSearchHistory ? onSelectSearchHistory(item) : handleApplyKeyword(item)}
                  className="px-2.5 py-0.5 rounded-full bg-white/15 hover:bg-white/30 text-white transition-all border border-white/20 cursor-pointer text-[11px] font-medium flex items-center gap-1"
                >
                  <span>{item}</span>
                </button>
              ))}
            </div>
            {onClearSearchHistory && (
              <button
                onClick={onClearSearchHistory}
                className="text-teal-300 hover:text-rose-300 text-[11px] underline cursor-pointer ml-auto"
                title="Xóa toàn bộ lịch sử tìm kiếm việc làm"
              >
                Xóa lịch sử
              </button>
            )}
          </div>
        )}

        {/* Quick Suggestion Pills */}
        <div className="w-full max-w-6xl mx-auto mt-3.5 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-blue-200 font-medium flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-orange-400" />
            Gợi ý nhanh:
          </span>
          {quickPills.map((pill, idx) => (
            <button
              key={idx}
              onClick={pill.action}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs transition-all border border-white/15 cursor-pointer text-[11px] font-medium"
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
