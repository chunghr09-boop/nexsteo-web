import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Users, 
  ShieldCheck, 
  BadgeCheck, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  Calendar,
  Share2,
  ChevronRight,
  MessageSquare,
  Award,
  FileText
} from 'lucide-react';
import { Job } from '../types';
import { NEXTSTEP_COMPANY_INFO } from '../data/companyInfo';

interface CompanyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  allJobs?: Job[];
  onSelectJob?: (job: Job) => void;
  onApplyJob?: (job: Job) => void;
  onOpenChatWithCompany?: (company: string) => void;
}

export const CompanyProfileModal: React.FC<CompanyProfileModalProps> = ({
  isOpen,
  onClose,
  companyName,
  allJobs = [],
  onSelectJob,
  onApplyJob,
  onOpenChatWithCompany
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'jobs' | 'culture'>('about');

  // Lắng nghe phím Escape để đóng trang hồ sơ
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isNextstep = companyName.toLowerCase().includes('nextstep') || companyName.toLowerCase().includes('ban quản trị');
  const isNextGen = companyName.toLowerCase().includes('nextgen');
  const isVNG = companyName.toLowerCase().includes('vng');
  const isAscenda = companyName.toLowerCase().includes('ascenda');
  const isShopee = companyName.toLowerCase().includes('shopee');
  const isVinAI = companyName.toLowerCase().includes('vinai');

  // Lọc các tin tuyển dụng đang mở của công ty này
  const companyJobs = allJobs.filter(j => 
    j.company.toLowerCase().trim() === companyName.toLowerCase().trim() ||
    j.company.toLowerCase().includes(companyName.toLowerCase().trim()) ||
    (isNextstep && j.company.toLowerCase().includes('nextstep')) ||
    (isNextGen && j.company.toLowerCase().includes('nextgen')) ||
    (isVNG && j.company.toLowerCase().includes('vng')) ||
    (isAscenda && j.company.toLowerCase().includes('ascenda'))
  );

  // Lấy mẫu thông tin từ công việc của công ty
  const sampleJob = companyJobs[0];

  // Chuẩn hóa dữ liệu hồ sơ công ty
  let logo = sampleJob?.companyLogo || "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=256&auto=format&fit=crop&q=80";
  let fullTitle = companyName;
  let industry = sampleJob?.industry || 'Công nghệ Thông tin / Phần mềm';
  let size = sampleJob?.companySize || '150 - 500 nhân viên';
  let address = sampleJob?.address || sampleJob?.location || 'Hà Nội & TP. Hồ Chí Minh';
  let phone = '0988 999 888';
  let email = sampleJob?.contactEmail || 'hr@enterprise.vn';
  let website = 'https://enterprise.vn';
  let tagline = 'Môi trường làm việc năng động, chuyên nghiệp và cơ hội phát triển đột phá';
  let overview = sampleJob?.companyOverview || `${companyName} là doanh nghiệp hàng đầu trong ngành, cam kết kiến tạo môi trường làm việc lý tưởng và chế độ đãi ngộ vượt trội cho nhân tài.`;
  let culture = `• Đề cao tinh thần sáng tạo, chủ động và minh bạch trong mọi dự án.\n• Chế độ review tăng lương định kỳ 2 lần/năm kèm thưởng hiệu quả kinh doanh.\n• Bảo hiểm sức khỏe cao cấp toàn diện và tài trợ đào tạo chứng chỉ chuyên môn quốc tế.`;

  if (isNextstep) {
    fullTitle = NEXTSTEP_COMPANY_INFO.companyName;
    logo = "https://images.unsplash.com/photo-1551434678-e076c223a692?w=128&auto=format&fit=crop&q=80";
    tagline = NEXTSTEP_COMPANY_INFO.tagline;
    overview = NEXTSTEP_COMPANY_INFO.description + ' Nextstep tự hào là cầu nối tin cậy giữa hàng trăm nghìn ứng viên tài năng và các tập đoàn hàng đầu trên cả nước.';
    address = NEXTSTEP_COMPANY_INFO.address;
    phone = NEXTSTEP_COMPANY_INFO.phone;
    email = NEXTSTEP_COMPANY_INFO.email;
    website = 'https://nextstep.vn';
    industry = 'Hệ sinh thái Tuyển dụng & Quản trị Nhân tài Số';
    size = '100 - 499 nhân viên';
  } else if (isNextGen) {
    fullTitle = 'Công ty Cổ phần Công nghệ NextGen';
    logo = "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=256&auto=format&fit=crop&q=80";
    tagline = 'Tiên phong giải pháp công nghệ số & di động thế hệ mới';
    overview = 'NextGen Tech là doanh nghiệp công nghệ đi đầu trong việc cung cấp các giải pháp ứng dụng di động React Native, hạ tầng vi dịch vụ đám mây và hệ sinh thái số hóa quy trình doanh nghiệp.';
    address = 'Tầng 12, Tòa nhà Pearl Plaza, 561A Điện Biên Phủ, Phường 25, Bình Thạnh, TP. Hồ Chí Minh';
    phone = '0933 111 222';
    email = 'tuyendung@nextgen-tech.vn';
    website = 'https://nextgen-tech.vn';
    industry = 'CNTT / Phần mềm & Giải pháp Số Hóa';
    size = '150 - 500 nhân viên';
  } else if (isVNG) {
    fullTitle = 'Tập đoàn VNG Corporation';
    logo = "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80";
    tagline = 'Kiến tạo công nghệ và phát triển con người';
    overview = 'VNG là tập đoàn công nghệ tiên phong tại Việt Nam, sở hữu hệ sinh thái sản phẩm quen thuộc như Zalo, ZaloPay, VNGGames, VNG Cloud phục vụ hơn 100 triệu người dùng trong và ngoài nước.';
    address = 'Z06, Đường số 13, Khu chế xuất Tân Thuận, Phường Tân Thuận Đông, Quận 7, TP. Hồ Chí Minh';
    phone = '028 3962 3888';
    email = 'tuyendung@vng.com.vn';
    website = 'https://vng.com.vn';
    industry = 'Internet / Game / FinTech / Cloud';
    size = '2,000 - 5,000 nhân viên';
  } else if (isAscenda) {
    fullTitle = 'Ascenda Loyalty Tech';
    logo = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=128&auto=format&fit=crop&q=80";
    tagline = 'Global Fintech & Loyalty Solutions Platform';
    overview = 'Ascenda Loyalty Tech là công ty công nghệ đa quốc gia dẫn đầu về nền tảng phần thưởng khách hàng thân thiết cho các ngân hàng và hãng hàng không hàng đầu thế giới.';
    address = 'Tháp Landmark 81, 720A Điện Biên Phủ, Phường 22, Bình Thạnh, TP. Hồ Chí Minh';
    phone = '028 7300 6868';
    email = 'careers@ascendaloyalty.com';
    website = 'https://ascendaloyalty.com';
    industry = 'FinTech / SaaS Platform';
    size = '200 - 500 nhân viên';
  }

  return (
    <div 
      className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose}
    >
      <div 
        id="company-profile-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in zoom-in-95 duration-200 cursor-default"
      >
        {/* COVER BANNER */}
        <div className="h-44 sm:h-56 bg-gradient-to-r from-[#0D2B52] via-[#103E6B] to-[#137E8F] relative p-6 flex items-end justify-between shrink-0">
          <button
            type="button"
            id="company-profile-close-btn-top"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 px-3.5 rounded-full bg-black/40 hover:bg-rose-600 text-white font-bold transition-all cursor-pointer z-30 flex items-center gap-1.5 shadow-lg border border-white/20"
            title="Đóng trang hồ sơ (Phím Esc)"
          >
            <X className="w-5 h-5 pointer-events-none" />
            <span className="text-xs font-bold pointer-events-none">Đóng</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-teal-200 text-xs font-bold border border-white/20 flex items-center gap-1.5 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-teal-300" />
              Doanh Nghiệp Đã Xác Minh 100%
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-bold border border-emerald-400/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              Đối Tác Chiến Lược Nextstep
            </span>
          </div>
        </div>

        {/* HEADER PROFILE INFO */}
        <div className="px-6 sm:px-8 pb-4 pt-0 relative bg-white border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-2 border-4 border-white shadow-xl relative shrink-0">
                <img 
                  src={logo} 
                  alt={fullTitle}
                  className="w-full h-full object-cover rounded-xl"
                />
                <span className="absolute bottom-1 right-1 p-1 bg-blue-600 rounded-full text-white ring-2 ring-white" title="Doanh nghiệp chính thức">
                  <BadgeCheck className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="space-y-1 mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {fullTitle}
                </h1>
                <p className="text-xs sm:text-sm text-[#137E8F] font-semibold">
                  {tagline}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onOpenChatWithCompany && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenChatWithCompany(companyName);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Nhắn tin tuyển dụng</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Meta Badges */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600 pt-1 font-medium">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              {industry}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              {size}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              {address}
            </span>
            {website && (
              <a 
                href={website} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1.5 text-blue-600 hover:underline"
              >
                <Globe className="w-3.5 h-3.5" />
                {website.replace('https://', '')}
              </a>
            )}
          </div>

          {/* Nav Tabs */}
          <div className="flex items-center gap-2 mt-5 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-3 px-3 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
                activeTab === 'about'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Giới thiệu doanh nghiệp
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`pb-3 px-3 text-xs font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === 'jobs'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>Vị trí tuyển dụng</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black">
                {companyJobs.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('culture')}
              className={`pb-3 px-3 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
                activeTab === 'culture'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Văn hóa &amp; Chế độ đãi ngộ
            </button>
          </div>
        </div>

        {/* TAB BODY CONTENT */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700 bg-slate-50/40">
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  Tổng quan về {fullTitle}
                </h3>
                <p className="text-slate-600 leading-relaxed text-xs sm:text-[13px] whitespace-pre-line">
                  {overview}
                </p>
              </div>

              {/* Thông tin liên hệ chính thức */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-teal-600" />
                  Thông tin liên hệ tuyển dụng chính thức
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Email tiếp nhận hồ sơ</span>
                    <p className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                      <Mail className="w-3.5 h-3.5 text-blue-600" />
                      {email}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Hotline tuyển dụng</span>
                    <p className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      {phone}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 sm:col-span-2">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Địa chỉ văn phòng</span>
                    <p className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-rose-600" />
                      {address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  Danh sách {companyJobs.length} việc làm đang tuyển dụng
                </h3>
                <span className="text-[11px] text-slate-500">Cập nhật theo thời gian thực</span>
              </div>

              {companyJobs.length === 0 ? (
                <div className="py-12 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
                  <Briefcase className="w-8 h-8 text-slate-300 mx-auto stroke-1" />
                  <p className="font-bold text-slate-800 text-xs">Hiện chưa có tin tuyển dụng nào mở</p>
                  <p className="text-[11px] text-slate-500">Hãy theo dõi công ty hoặc nhắn tin trực tiếp để nhận thông báo việc làm mới</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {companyJobs.map((job) => (
                    <div 
                      key={job.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 
                            onClick={() => {
                              onClose();
                              if (onSelectJob) onSelectJob(job);
                            }}
                            className="font-bold text-slate-900 hover:text-blue-600 text-xs sm:text-sm cursor-pointer transition-colors"
                          >
                            {job.title}
                          </h4>
                          {job.isUrgent && (
                            <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-bold text-[9px]">
                              Tuyển gấp
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                          <span className="font-bold text-emerald-600">{job.salaryText}</span>
                          <span>•</span>
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>Kinh nghiệm: {job.experience}</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {job.requiredSkills.slice(0, 4).map(skill => (
                            <span key={skill} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <button
                          onClick={() => {
                            onClose();
                            if (onSelectJob) onSelectJob(job);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                        >
                          Chi tiết
                        </button>
                        {onApplyJob && (
                          <button
                            onClick={() => {
                              onClose();
                              onApplyJob(job);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer shadow-xs"
                          >
                            Ứng tuyển
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'culture' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Môi trường làm việc &amp; Văn hóa doanh nghiệp
                </h3>
                <p className="text-slate-600 leading-relaxed text-xs sm:text-[13px] whitespace-pre-line">
                  {culture}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Phúc lợi dành cho nhân viên
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                    <span className="font-bold text-emerald-900 text-xs">Lương &amp; Thưởng</span>
                    <p className="text-[11px] text-emerald-700">Lương tháng 13, thưởng hiệu quả kinh doanh &amp; review lương 2 lần/năm</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1">
                    <span className="font-bold text-blue-900 text-xs">Bảo hiểm &amp; Sức khỏe</span>
                    <p className="text-[11px] text-blue-700">Bảo hiểm 100% lương ký, gói khám sức khỏe tổng quát VIP hàng năm</p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 space-y-1">
                    <span className="font-bold text-purple-900 text-xs">Đời sống &amp; Giải trí</span>
                    <p className="text-[11px] text-purple-700">Teambuilding 2 lần/năm, Happy Friday, trà sữa &amp; đồ ăn nhẹ miễn phí</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER ACTION */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-medium">
            Hồ sơ doanh nghiệp được kiểm duyệt bởi Ban Quản Trị Nextstep
          </span>
          <button
            type="button"
            id="company-profile-close-btn-bottom"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
