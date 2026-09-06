import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  ShieldCheck, 
  Edit3, 
  Save, 
  X, 
  Sparkles, 
  BadgeCheck, 
  Award, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Upload,
  Calendar
} from 'lucide-react';
import { Job, AuthUser } from '../types';
import { useAuth } from '../context/AuthContext';

interface RecruiterProfileManagerProps {
  jobs: Job[];
  onNavigateToTab?: (tab: 'jobs' | 'profile' | 'applications' | 'saved' | 'salary' | 'recruiter_portal' | 'admin') => void;
}

export const RecruiterProfileManager: React.FC<RecruiterProfileManagerProps> = ({
  jobs,
  onNavigateToTab
}) => {
  const { currentUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State
  const [fullName, setFullName] = useState(currentUser?.fullName || 'Vũ Thu Trang (HR Director)');
  const [recruiterPosition, setRecruiterPosition] = useState(currentUser?.recruiterPosition || 'Trưởng phòng Nhân sự & Tuyển dụng');
  const [companyName, setCompanyName] = useState(currentUser?.companyName || 'Công ty Cổ phần Công nghệ NextGen');
  const [companySize, setCompanySize] = useState(currentUser?.companySize || '150 - 500 nhân viên');
  const [phone, setPhone] = useState(currentUser?.phone || '0933 111 222');
  const [email, setEmail] = useState(currentUser?.email || 'trang.vu@nextgen-tech.vn');
  const [website, setWebsite] = useState('https://nextgen-tech.vn');
  const [taxCode, setTaxCode] = useState('0316892345');
  const [industry, setIndustry] = useState('CNTT / Phần mềm & Giải pháp Số Hóa');
  const [address, setAddress] = useState('Tầng 12, Tòa nhà Pearl Plaza, 561A Điện Biên Phủ, Phường 25, Bình Thạnh, TP.HCM');
  const [description, setDescription] = useState(
    'Công ty Cổ phần Công nghệ NextGen là doanh nghiệp tiên phong trong lĩnh vực công nghệ số và giải pháp di động thế hệ mới tại Việt Nam. Với đội ngũ hơn 200+ kỹ sư và chuyên gia công nghệ, NextGen không ngừng kiến tạo các nền tảng số hóa chất lượng cao, phục vụ hơn 500,000+ người dùng doanh nghiệp và cá nhân.'
  );
  const [culture, setCulture] = useState(
    '• Môi trường làm việc cởi mở, sáng tạo, đề cao tinh thần tự chủ (Ownership).\n• Giờ làm việc linh hoạt (Flexible Hours) & 2 ngày làm việc từ xa (Remote Hybrid) mỗi tháng.\n• Review đánh giá tăng lương định kỳ 2 lần/năm kèm quỹ thưởng hiệu quả kinh doanh hấp dẫn.'
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 space-y-8 animate-in fade-in duration-200">
      {/* SUCCESS TOAST */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Đã lưu và cập nhật hồ sơ Nhà tuyển dụng thành công! Thông tin mới đã được đồng bộ trên toàn hệ thống.</span>
        </div>
      )}

      {/* BANNER & COMPANY OVERVIEW CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Cover banner */}
        <div className="h-44 sm:h-56 bg-gradient-to-r from-[#0D2B52] via-[#103E6B] to-[#137E8F] relative p-6 flex items-end justify-between">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-teal-200 text-xs font-bold border border-white/20 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-300" />
              Doanh Nghiệp Đã Xác Minh
            </span>
          </div>
        </div>

        {/* Company profile info header */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-6">
            <div className="flex items-end gap-4">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white p-2 border-4 border-white shadow-xl relative shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=256&auto=format&fit=crop&q=80" 
                  alt="NextGen Logo"
                  className="w-full h-full object-cover rounded-2xl"
                />
                <span className="absolute bottom-1 right-1 p-1 bg-blue-600 rounded-full text-white ring-2 ring-white">
                  <BadgeCheck className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="space-y-1 mb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {companyName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800 border border-blue-200">
                    Nextstep Partner
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <span className="font-semibold text-slate-700">{industry}</span>
                  <span>•</span>
                  <span>Mã số thuế: {taxCode}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-5 py-2.5 bg-[#0D2B52] hover:bg-[#137E8F] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Chỉnh Sửa Hồ Sơ Doanh Nghiệp</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Details Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 pb-4 border-y border-slate-100 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Users className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Quy mô</span>
                <span className="font-bold">{companySize}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <Globe className="w-4 h-4 text-teal-600 shrink-0" />
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Website</span>
                <a href={website} target="_blank" rel="noreferrer" className="font-bold text-blue-600 hover:underline truncate block max-w-[140px]">
                  {website.replace('https://', '')}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Hotline HR</span>
                <span className="font-bold">{phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <Briefcase className="w-4 h-4 text-purple-600 shrink-0" />
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Tin đang tuyển</span>
                <span className="font-bold text-purple-700">{jobs.length} vị trí mở</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT FORM OR VIEW PROFILE */}
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 text-xs animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Cập Nhật Hồ Sơ Nhà Tuyển Dụng &amp; Doanh Nghiệp</h3>
              <p className="text-xs text-slate-500">Thông tin này sẽ hiển thị trên bài đăng tuyển dụng để ứng viên tìm hiểu</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tên công ty / Doanh nghiệp *</label>
              <input 
                type="text" 
                required 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 outline-hidden focus:ring-2 focus:ring-[#137E8F]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Ngành nghề hoạt động chính</label>
              <input 
                type="text" 
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 outline-hidden focus:ring-2 focus:ring-[#137E8F]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Họ tên người đại diện nhân sự (HR) *</label>
              <input 
                type="text" 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold outline-hidden focus:ring-2 focus:ring-[#137E8F]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Chức danh / Vị trí phụ trách tuyển dụng</label>
              <input 
                type="text" 
                value={recruiterPosition}
                onChange={(e) => setRecruiterPosition(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 outline-hidden focus:ring-2 focus:ring-[#137E8F]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Hotline / Số điện thoại liên hệ *</label>
              <input 
                type="tel" 
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 outline-hidden focus:ring-2 focus:ring-[#137E8F]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email doanh nghiệp *</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 outline-hidden focus:ring-2 focus:ring-[#137E8F]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Website công ty</label>
              <input 
                type="url" 
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 outline-hidden focus:ring-2 focus:ring-[#137E8F]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Quy mô nhân sự</label>
              <select
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-white outline-hidden"
              >
                <option value="Dưới 20 nhân viên">Dưới 20 nhân viên</option>
                <option value="20 - 50 nhân viên">20 - 50 nhân viên</option>
                <option value="50 - 150 nhân viên">50 - 150 nhân viên</option>
                <option value="150 - 500 nhân viên">150 - 500 nhân viên</option>
                <option value="Trên 500 nhân viên">Trên 500 nhân viên</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Địa chỉ trụ sở công ty *</label>
            <input 
              type="text" 
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 outline-hidden focus:ring-2 focus:ring-[#137E8F]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Giới thiệu tổng quan về doanh nghiệp</label>
            <textarea 
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-200 text-slate-900 leading-relaxed outline-hidden focus:ring-2 focus:ring-[#137E8F]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Văn hóa doanh nghiệp &amp; Môi trường làm việc</label>
            <textarea 
              rows={3}
              value={culture}
              onChange={(e) => setCulture(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-200 text-slate-900 leading-relaxed outline-hidden focus:ring-2 focus:ring-[#137E8F]"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Thay Đổi Hồ Sơ</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: HR REPRESENTATIVE CARD */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Đại Diện Nhân Sự (HR)
                </h3>
                <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Đang hoạt động
                </span>
              </div>

              <div className="flex items-center gap-3.5">
                <img 
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&auto=format&fit=crop&q=80'} 
                  alt="HR Avatar"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500 shadow-sm shrink-0"
                />
                <div className="space-y-0.5 min-w-0">
                  <h4 className="text-sm font-black text-slate-900 truncate">{fullName}</h4>
                  <p className="text-xs text-blue-600 font-semibold truncate">{recruiterPosition}</p>
                  <p className="text-[11px] text-slate-400">Quản trị viên tuyển dụng</p>
                </div>
              </div>

              <div className="space-y-2.5 pt-2 text-xs border-t border-slate-100 text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Tham gia từ: {currentUser?.createdAt || '20/02/2025'}</span>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Chỉnh sửa thông tin HR</span>
              </button>
            </div>

            {/* Verification Card */}
            <div className="bg-gradient-to-br from-blue-50 to-teal-50/50 rounded-3xl p-6 border border-blue-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Xác Thực Doanh Nghiệp Nextstep</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Doanh nghiệp đã hoàn tất xác minh GPKD, hợp đồng dịch vụ tuyển dụng và số điện thoại doanh nghiệp.
              </p>
              <div className="space-y-1.5 text-[11px] font-semibold text-slate-700">
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> GPKD số: {taxCode}
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Tên miền xác thực: nextgen-tech.vn
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DETAILED COMPANY PROFILE & OPEN JOBS */}
          <div className="lg:col-span-8 space-y-6">
            {/* Giới thiệu doanh nghiệp */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider text-teal-800 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-600" />
                <span>Giới Thiệu Doanh Nghiệp</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {description}
              </p>

              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" /> Trụ sở chính:
                </h4>
                <p className="text-xs text-slate-600">{address}</p>
              </div>
            </div>

            {/* Văn hóa & Phúc lợi */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider text-teal-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Văn Hóa Làm Việc &amp; Đãi Ngộ</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                {culture}
              </p>
            </div>

            {/* Các vị trí đang tuyển dụng */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider text-teal-800 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>Vị Trí Đang Tuyển Dụng ({jobs.length})</span>
                </h3>
                {onNavigateToTab && (
                  <button
                    onClick={() => onNavigateToTab('recruiter_portal')}
                    className="text-xs text-blue-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Quản lý tin tuyển dụng</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {jobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-200 transition-all flex items-center justify-between text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900">{job.title}</h4>
                      <p className="text-[11px] text-slate-500">{job.city} • <span className="text-orange-600 font-bold">{job.salaryText}</span></p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Đang tuyển
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
