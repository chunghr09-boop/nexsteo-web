import React, { useState } from 'react';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  FolderGit2, 
  Award, 
  Sliders, 
  Settings, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Sparkles, 
  Eye, 
  Download, 
  AlertCircle,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Share2,
  Shield,
  Save,
  Check,
  Upload,
  FileText
} from 'lucide-react';
import { CandidateProfile, WorkExperience, Education, Skill, Project, Certificate } from '../types';
import { calculateProfileStrength } from '../utils/profileScore';
import { CVPreviewModal } from './CVPreviewModal';

interface ProfileManagerProps {
  profile: CandidateProfile;
  onUpdateProfile: (updated: CandidateProfile) => void;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({
  profile,
  onUpdateProfile
}) => {
  const [activeSection, setActiveSection] = useState<
    'cv_upload' | 'personal' | 'objective' | 'experience' | 'education' | 'skills' | 'projects' | 'certificates' | 'preferences' | 'settings'
  >(() => {
    if (!profile.attachedCvName && profile.experiences.length === 0) {
      return 'cv_upload';
    }
    return 'personal';
  });

  const handleCvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;
      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      
      updateCandidate({
        attachedCvName: file.name,
        attachedCvSize: sizeStr,
        attachedCvUpdatedAt: dateStr
      });
      showNotification(`Đã tải lên và lưu file CV "${file.name}" thành công!`);
    }
  };

  const handleRemoveAttachedCv = () => {
    if (window.confirm('Bạn có chắc chắn muốn gỡ bỏ file CV đính kèm này không?')) {
      updateCandidate({
        attachedCvName: undefined,
        attachedCvSize: undefined,
        attachedCvUpdatedAt: undefined
      });
      showNotification('Đã gỡ bỏ file CV đính kèm thành công.');
    }
  };

  const [showCVPreview, setShowCVPreview] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');

  // Editing state for Experience
  const [editingExp, setEditingExp] = useState<WorkExperience | null>(null);
  const [isAddingExp, setIsAddingExp] = useState(false);

  // Editing state for Education
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [isAddingEdu, setIsAddingEdu] = useState(false);

  // Editing state for Project
  const [editingProj, setEditingProj] = useState<Project | null>(null);
  const [isAddingProj, setIsAddingProj] = useState(false);

  // Editing state for Certificate
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [isAddingCert, setIsAddingCert] = useState(false);

  // New skill input
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'technical' | 'soft' | 'language'>('technical');
  const [newSkillLevel, setNewSkillLevel] = useState<number>(4);

  const breakdown = calculateProfileStrength(profile);

  const showNotification = (msg: string) => {
    setSaveSuccessMessage(msg);
    setTimeout(() => setSaveSuccessMessage(''), 3000);
  };

  // Generic updater
  const updateCandidate = (partial: Partial<CandidateProfile>) => {
    const updated = { ...profile, ...partial };
    // Recalculate score
    const newScore = calculateProfileStrength(updated).score;
    updated.profileStrength = newScore;
    onUpdateProfile(updated);
    showNotification('Đã lưu thay đổi hồ sơ thành công!');
  };

  // Experience handlers
  const handleSaveExp = (exp: WorkExperience) => {
    let updatedList = [...profile.experiences];
    const index = updatedList.findIndex(e => e.id === exp.id);
    if (index >= 0) {
      updatedList[index] = exp;
    } else {
      updatedList.unshift(exp);
    }
    updateCandidate({ experiences: updatedList });
    setEditingExp(null);
    setIsAddingExp(false);
  };

  const handleDeleteExp = (id: string) => {
    const updatedList = profile.experiences.filter(e => e.id !== id);
    updateCandidate({ experiences: updatedList });
  };

  // Education handlers
  const handleSaveEdu = (edu: Education) => {
    let updatedList = [...profile.educations];
    const index = updatedList.findIndex(e => e.id === edu.id);
    if (index >= 0) {
      updatedList[index] = edu;
    } else {
      updatedList.push(edu);
    }
    updateCandidate({ educations: updatedList });
    setEditingEdu(null);
    setIsAddingEdu(false);
  };

  const handleDeleteEdu = (id: string) => {
    const updatedList = profile.educations.filter(e => e.id !== id);
    updateCandidate({ educations: updatedList });
  };

  // Project handlers
  const handleSaveProj = (proj: Project) => {
    let updatedList = [...profile.projects];
    const index = updatedList.findIndex(p => p.id === proj.id);
    if (index >= 0) {
      updatedList[index] = proj;
    } else {
      updatedList.push(proj);
    }
    updateCandidate({ projects: updatedList });
    setEditingProj(null);
    setIsAddingProj(false);
  };

  const handleDeleteProj = (id: string) => {
    const updatedList = profile.projects.filter(p => p.id !== id);
    updateCandidate({ projects: updatedList });
  };

  // Certificate handlers
  const handleSaveCert = (cert: Certificate) => {
    let updatedList = [...profile.certificates];
    const index = updatedList.findIndex(c => c.id === cert.id);
    if (index >= 0) {
      updatedList[index] = cert;
    } else {
      updatedList.push(cert);
    }
    updateCandidate({ certificates: updatedList });
    setEditingCert(null);
    setIsAddingCert(false);
  };

  const handleDeleteCert = (id: string) => {
    const updatedList = profile.certificates.filter(c => c.id !== id);
    updateCandidate({ certificates: updatedList });
  };

  // Skill handlers
  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const newSkill: Skill = {
      id: `sk-${Date.now()}`,
      name: newSkillName.trim(),
      level: newSkillLevel,
      category: newSkillCategory
    };
    updateCandidate({ skills: [...profile.skills, newSkill] });
    setNewSkillName('');
  };

  const handleDeleteSkill = (id: string) => {
    updateCandidate({ skills: profile.skills.filter(s => s.id !== id) });
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
      {/* Toast Notification */}
      {saveSuccessMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Warning Banner: New Account - No CV Yet */}
      {(!profile.attachedCvName && profile.experiences.length === 0) && (
        <div className="mb-6 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border-2 border-amber-400/80 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <AlertCircle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-black text-amber-950 flex items-center gap-2">
                  <span>Hồ sơ của bạn chưa có CV!</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200/80 text-amber-900 border border-amber-300">
                    Bắt buộc cập nhật
                  </span>
                </h3>
                <p className="text-xs text-amber-900/80 mt-1 leading-relaxed">
                  Tài khoản mới cần tự cập nhật CV để nhà tuyển dụng có thể xem xét và liên hệ phỏng vấn. Bạn có thể <strong>tải lên File CV cá nhân (PDF/Word)</strong> có sẵn hoặc <strong>điền thông tin kinh nghiệm &amp; kỹ năng</strong> bên dưới để hệ thống tạo CV Online.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveSection('cv_upload')}
                className="w-full sm:w-auto px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                Tải lên File CV ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner: Profile Status, Strength Meter & CV Actions */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Candidate Bio snippet */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img
                src={profile.avatar}
                alt={profile.fullName}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-600 shadow-md ring-4 ring-blue-50"
              />
              <button
                onClick={() => {
                  const url = prompt('Nhập đường dẫn URL ảnh đại diện mới:', profile.avatar);
                  if (url) updateCandidate({ avatar: url });
                }}
                className="absolute inset-0 bg-black/40 text-white rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                title="Đổi ảnh đại diện"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  {profile.fullName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {profile.isLookingForJob ? 'Đang tìm việc' : 'Tạm ẩn hồ sơ'}
                </span>
              </div>
              <p className="text-sm font-semibold text-blue-700 mt-0.5">
                {profile.title || <span className="text-slate-400 font-normal italic text-xs">(Chưa cập nhật chức danh chuyên môn)</span>}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {profile.email || <span className="text-slate-400 italic">Chưa có email</span>}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {profile.phone || <span className="text-slate-400 italic">Chưa cập nhật SĐT</span>}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {profile.city || <span className="text-slate-400 italic">Chưa cập nhật địa điểm</span>}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Strength & Actions */}
          <div className="w-full lg:w-80 bg-slate-50 p-4 rounded-xl border border-slate-200/90 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-orange-500" />
                Độ hoàn thiện hồ sơ
              </span>
              <span className="font-extrabold text-blue-700 text-sm">
                {profile.profileStrength}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${profile.profileStrength}%` }}
              ></div>
            </div>

            <p className="text-[11px] text-slate-500">
              {profile.profileStrength >= 90
                ? 'Hồ sơ đạt chuẩn xuất sắc! Bạn được ưu tiên xuất hiện đầu tiên khi NTD tìm kiếm.'
                : 'Hãy hoàn thiện các mục gợi ý bên dưới để tăng 40% cơ hội nhận lời mời phỏng vấn.'}
            </p>

            {/* CV Attachment Status Card */}
            <div className="pt-1">
              {profile.attachedCvName ? (
                <div className="p-2.5 bg-emerald-50/90 border border-emerald-200 rounded-lg flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-emerald-900 truncate">
                        {profile.attachedCvName}
                      </p>
                      <p className="text-[10px] text-emerald-700">
                        {profile.attachedCvSize || 'Đã có file CV'} • Cập nhật: {profile.attachedCvUpdatedAt || 'Mới đây'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveSection('cv_upload')}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline shrink-0 cursor-pointer"
                  >
                    Đổi file
                  </button>
                </div>
              ) : (
                <div className="p-2.5 bg-amber-50/90 border border-amber-200 rounded-lg flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-amber-900">
                        Chưa có File CV cá nhân
                      </p>
                      <p className="text-[10px] text-amber-700">
                        Tải lên để mở khóa nộp đơn nhanh
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveSection('cv_upload')}
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-[11px] font-bold shrink-0 cursor-pointer transition-colors"
                  >
                    Tải CV
                  </button>
                </div>
              )}
            </div>

            <div className="pt-1 flex items-center gap-2">
              <button
                id="preview-cv-btn"
                onClick={() => setShowCVPreview(true)}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                Xem trước CV Nextstep
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Navigation + Content Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sub-Navigation */}
        <div className="lg:col-span-3 space-y-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs space-y-1">
            {[
              { 
                id: 'cv_upload', 
                label: profile.attachedCvName ? '0. File CV đính kèm' : '0. Tải lên File CV', 
                icon: FileText,
                badge: profile.attachedCvName ? 'Đã có' : 'Chưa có',
                badgeColor: profile.attachedCvName ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200 font-extrabold animate-pulse'
              },
              { id: 'personal', label: '1. Thông tin cá nhân', icon: User },
              { id: 'objective', label: '2. Mục tiêu nghề nghiệp', icon: Sliders },
              { id: 'experience', label: `3. Kinh nghiệm làm việc (${profile.experiences.length})`, icon: Briefcase },
              { id: 'education', label: `4. Học vấn & Bằng cấp (${profile.educations.length})`, icon: GraduationCap },
              { id: 'skills', label: `5. Kỹ năng & Ngôn ngữ (${profile.skills.length})`, icon: Wrench },
              { id: 'projects', label: `6. Dự án tiêu biểu (${profile.projects.length})`, icon: FolderGit2 },
              { id: 'certificates', label: `7. Chứng chỉ (${profile.certificates.length})`, icon: Award },
              { id: 'preferences', label: '8. Tiêu chí & Mức lương', icon: DollarSign },
              { id: 'settings', label: '9. Cài đặt bảo mật hồ sơ', icon: Settings }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeSection === tab.id
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${activeSection === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="truncate">{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold shrink-0 ${tab.badgeColor}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Suggestions Card */}
          {breakdown.pendingSuggestions.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs space-y-2">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Gợi ý nâng cao điểm CV:
              </span>
              <ul className="space-y-1 text-slate-700 text-[11px]">
                {breakdown.pendingSuggestions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Content Editor */}
        <div className="lg:col-span-9 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          {/* SECTION 0: CV UPLOAD & FILE MANAGEMENT */}
          {activeSection === 'cv_upload' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Quản lý &amp; Tự cập nhật File CV cá nhân
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tự tải lên và cập nhật File CV của bạn (PDF, DOCX) để nộp trực tiếp cho Nhà tuyển dụng hoặc đồng bộ thông tin.
                  </p>
                </div>
              </div>

              {/* Status Banner */}
              {profile.attachedCvName ? (
                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-sm">{profile.attachedCvName}</h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Đã kích hoạt
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Dung lượng: {profile.attachedCvSize || '2.4 MB'} • Ngày cập nhật: {profile.attachedCvUpdatedAt || 'Gần đây'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      <label className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Tải file khác thay thế</span>
                        <input
                          type="file"
                          accept=".pdf,.docx,.doc"
                          onChange={handleCvFileUpload}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          alert(`Đang mở xem và tải file CV: ${profile.attachedCvName}`);
                        }}
                        className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-500" />
                        <span>Tải về / Xem</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveAttachedCv}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        title="Xóa file CV này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-[11px] text-emerald-800 bg-white/80 p-3 rounded-xl border border-emerald-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      File CV này đang được chọn làm <strong>CV mặc định</strong> khi bạn bấm nút "Ứng tuyển nhanh" ở tất cả việc làm trên Nextstep.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 text-center space-y-4 transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Tải lên file CV của bạn từ máy tính
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                      Tài khoản mới cần tự cập nhật CV. Hãy tải lên file CV cá nhân dạng <strong>PDF, DOCX hoặc DOC</strong> (tối đa 10MB) để sẵn sàng nộp đơn cho nhà tuyển dụng.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <label className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer transition-all">
                      <Upload className="w-4 h-4" />
                      <span>Chọn file CV từ thiết bị</span>
                      <input
                        type="file"
                        accept=".pdf,.docx,.doc"
                        onChange={handleCvFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Khuyên dùng định dạng <strong>.PDF</strong> để giữ nguyên định dạng phông chữ và thiết kế đẹp nhất của bạn.
                  </p>
                </div>
              )}

              {/* Guidance: Two Ways to Have a Complete CV */}
              <div className="pt-2 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Hai cách để bạn cập nhật CV hoàn chỉnh trên Nextstep:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Way 1 */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center gap-2 text-blue-700 font-bold text-xs">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[11px]">1</div>
                      <span>Tự tải lên file CV có sẵn (PDF/Word)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Dành cho ứng viên đã tự thiết kế CV riêng bằng Canva, Word hoặc Adobe. Chỉ cần tải lên 1 lần, hệ thống sẽ lưu file và dùng khi nộp đơn ngay.
                    </p>
                    <div className="pt-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${profile.attachedCvName ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                        {profile.attachedCvName ? '✓ Đã hoàn thành' : 'Chưa hoàn thành'}
                      </span>
                    </div>
                  </div>

                  {/* Way 2 */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[11px]">2</div>
                      <span>Tạo CV Nextstep Online thông minh</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Điền các mục bên trái (Kinh nghiệm, Học vấn, Kỹ năng...). Hệ thống Nextstep tự động xuất bản CV chuẩn ATS chuyên nghiệp cho bạn.
                    </p>
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveSection('experience')}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                      >
                        Thêm kinh nghiệm ngay →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 1: PERSONAL INFO */}
          {activeSection === 'personal' && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Thông tin cá nhân &amp; Giới thiệu</h2>
                  <p className="text-xs text-slate-500">Thông tin liên lạc chuẩn xác để nhà tuyển dụng kết nối với bạn</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => updateCandidate({ fullName: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chức danh chuyên môn / Tiêu đề hồ sơ *</label>
                  <input
                    type="text"
                    value={profile.title}
                    onChange={(e) => updateCandidate({ title: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    placeholder="VD: Senior Frontend Developer / Digital Marketing Lead"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email liên hệ *</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => updateCandidate({ email: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    placeholder="VD: 0988 123 456"
                    value={profile.phone || ''}
                    onChange={(e) => updateCandidate({ phone: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ngày sinh</label>
                  <input
                    type="date"
                    value={profile.birthday || ''}
                    onChange={(e) => updateCandidate({ birthday: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Giới tính</label>
                  <select
                    value={profile.gender || ''}
                    onChange={(e) => updateCandidate({ gender: e.target.value as any })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  >
                    <option value="">-- Chưa chọn giới tính --</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tỉnh / Thành phố hiện tại</label>
                  <input
                    type="text"
                    placeholder="VD: Hà Nội, TP. Hồ Chí Minh..."
                    value={profile.city || ''}
                    onChange={(e) => updateCandidate({ city: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Địa chỉ thường trú</label>
                  <input
                    type="text"
                    placeholder="VD: Số nhà, ngõ, đường, phường/xã..."
                    value={profile.address || ''}
                    onChange={(e) => updateCandidate({ address: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Liên kết Portfolio / GitHub / Website</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="url"
                      placeholder="https://yourwebsite.dev"
                      value={profile.website || ''}
                      onChange={(e) => updateCandidate({ website: e.target.value })}
                      className="px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                    />
                    <input
                      type="url"
                      placeholder="https://github.com/username"
                      value={profile.github || ''}
                      onChange={(e) => updateCandidate({ github: e.target.value })}
                      className="px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                    />
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={profile.linkedin || ''}
                      onChange={(e) => updateCandidate({ linkedin: e.target.value })}
                      className="px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Giới thiệu ngắn về bản thân (Bio)</label>
                  <textarea
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => updateCandidate({ bio: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-100 leading-relaxed"
                    placeholder="Tóm tắt điểm mạnh, đam mê và phong cách làm việc của bạn..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: CAREER OBJECTIVE */}
          {activeSection === 'objective' && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900">Mục tiêu nghề nghiệp (Career Objective)</h2>
                <p className="text-slate-500">Giúp nhà tuyển dụng hiểu rõ định hướng phát triển và sự gắn bó dài hạn của bạn</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mô tả mục tiêu ngắn hạn &amp; dài hạn</label>
                <textarea
                  rows={6}
                  value={profile.careerObjective}
                  onChange={(e) => updateCandidate({ careerObjective: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-100 leading-relaxed"
                  placeholder="Nêu rõ mục tiêu đóng góp trong 1-2 năm tới và định hướng vị trí quản lý / chuyên gia trong 3-5 năm..."
                />
              </div>

              <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-100 text-slate-600 space-y-1">
                <p className="font-bold text-[#0D2B52]">Mẹo từ chuyên gia tuyển dụng Nextstep:</p>
                <p>Một mục tiêu nghề nghiệp chất lượng nên bao gồm 3 yếu tố: 1. Giá trị bạn đem lại cho doanh nghiệp; 2. Kỹ năng bạn muốn trau dồi; 3. Cột mốc bạn muốn vươn tới (VD: Tech Lead, CMO, Giám đốc điều hành).</p>
              </div>
            </div>
          )}

          {/* SECTION 3: WORK EXPERIENCE */}
          {activeSection === 'experience' && (
            <div className="space-y-5 text-xs">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Kinh nghiệm làm việc</h2>
                  <p className="text-slate-500">Trình bày các mốc kinh nghiệm theo thứ tự từ gần nhất đến xa nhất</p>
                </div>
                {!isAddingExp && !editingExp && (
                  <button
                    onClick={() => {
                      setIsAddingExp(true);
                      setEditingExp({
                        id: `exp-${Date.now()}`,
                        company: '',
                        position: '',
                        startDate: '',
                        endDate: '',
                        isCurrent: false,
                        description: '',
                        achievements: ''
                      });
                    }}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Thêm kinh nghiệm
                  </button>
                )}
              </div>

              {/* Form Add/Edit */}
              {(isAddingExp || editingExp) && (
                <div className="p-4.5 bg-slate-50 rounded-2xl border-2 border-blue-200 space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {isAddingExp ? 'Thêm vị trí kinh nghiệm mới' : 'Chỉnh sửa kinh nghiệm'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Tên công ty / Doanh nghiệp *</label>
                      <input
                        type="text"
                        value={editingExp?.company || ''}
                        onChange={(e) => setEditingExp(prev => prev ? { ...prev, company: e.target.value } : null)}
                        placeholder="VD: Tập đoàn VNG, FPT Software..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Chức danh / Vị trí đảm nhiệm *</label>
                      <input
                        type="text"
                        value={editingExp?.position || ''}
                        onChange={(e) => setEditingExp(prev => prev ? { ...prev, position: e.target.value } : null)}
                        placeholder="VD: Frontend Engineer, Trưởng phòng Kinh doanh..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Thời gian bắt đầu (Tháng/Năm)</label>
                      <input
                        type="month"
                        value={editingExp?.startDate || ''}
                        onChange={(e) => setEditingExp(prev => prev ? { ...prev, startDate: e.target.value } : null)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Thời gian kết thúc</label>
                      <input
                        type="month"
                        disabled={editingExp?.isCurrent}
                        value={editingExp?.endDate || ''}
                        onChange={(e) => setEditingExp(prev => prev ? { ...prev, endDate: e.target.value } : null)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 disabled:opacity-50"
                      />
                      <label className="mt-1 flex items-center gap-1.5 cursor-pointer text-slate-600">
                        <input
                          type="checkbox"
                          checked={editingExp?.isCurrent || false}
                          onChange={(e) => setEditingExp(prev => prev ? { ...prev, isCurrent: e.target.checked, endDate: e.target.checked ? 'Hiện tại' : '' } : null)}
                          className="rounded text-blue-600"
                        />
                        <span>Hiện đang làm việc tại đây</span>
                      </label>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">Mô tả công việc &amp; Trách nhiệm chính</label>
                      <textarea
                        rows={3}
                        value={editingExp?.description || ''}
                        onChange={(e) => setEditingExp(prev => prev ? { ...prev, description: e.target.value } : null)}
                        placeholder="Nêu rõ các dự án hoặc nhiệm vụ chính bạn phụ trách..."
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">Thành tựu nổi bật / Kết quả đạt được (Số liệu cụ thể)</label>
                      <textarea
                        rows={2}
                        value={editingExp?.achievements || ''}
                        onChange={(e) => setEditingExp(prev => prev ? { ...prev, achievements: e.target.value } : null)}
                        placeholder="VD: Tăng 35% doanh thu quý 3, tối ưu tốc độ tải trang 40%, giải thưởng cá nhân xuất sắc..."
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => { setIsAddingExp(false); setEditingExp(null); }}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (editingExp && editingExp.company && editingExp.position) {
                          handleSaveExp(editingExp);
                        } else {
                          alert('Vui lòng điền tên công ty và vị trí công việc');
                        }
                      }}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                    >
                      Lưu kinh nghiệm
                    </button>
                  </div>
                </div>
              )}

              {/* Experience list display */}
              <div className="space-y-3">
                {profile.experiences.length === 0 && !isAddingExp && !editingExp && (
                  <div className="text-center py-10 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">Chưa có kinh nghiệm làm việc nào</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                        Tài khoản mới chưa có dữ liệu kinh nghiệm. Bấm nút bên dưới để tự cập nhật kinh nghiệm hoặc dự án của bạn.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsAddingExp(true);
                        setEditingExp({
                          id: `exp-${Date.now()}`,
                          company: '',
                          position: '',
                          startDate: '',
                          endDate: '',
                          isCurrent: false,
                          description: '',
                          achievements: ''
                        });
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm kinh nghiệm đầu tiên
                    </button>
                  </div>
                )}
                {profile.experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 bg-white space-y-2 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{exp.position}</h4>
                        <p className="font-semibold text-blue-700">{exp.company}</p>
                        <span className="text-slate-500 text-[11px] block mt-0.5">
                          {exp.startDate} - {exp.isCurrent ? 'Hiện tại' : exp.endDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setEditingExp(exp); setIsAddingExp(false); }}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                          title="Chỉnh sửa"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteExp(exp.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                          title="Xóa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-slate-600 leading-relaxed">{exp.description}</p>
                    {exp.achievements && (
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-900 font-medium text-[11px] flex items-start gap-1.5 border border-emerald-200">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Thành tựu:</strong> {exp.achievements}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: EDUCATION */}
          {activeSection === 'education' && (
            <div className="space-y-5 text-xs">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Học vấn &amp; Bằng cấp</h2>
                  <p className="text-slate-500">Thông tin về trường đào tạo, chuyên ngành và văn bằng</p>
                </div>
                {!isAddingEdu && !editingEdu && (
                  <button
                    onClick={() => {
                      setIsAddingEdu(true);
                      setEditingEdu({
                        id: `edu-${Date.now()}`,
                        school: '',
                        degree: 'Cử nhân',
                        major: '',
                        startDate: '',
                        endDate: '',
                        grade: ''
                      });
                    }}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Thêm học vấn
                  </button>
                )}
              </div>

              {(isAddingEdu || editingEdu) && (
                <div className="p-4 bg-slate-50 rounded-2xl border-2 border-blue-200 space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {isAddingEdu ? 'Thêm học vấn mới' : 'Chỉnh sửa học vấn'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Trường Đại học / Cao đẳng / Cơ sở đào tạo *</label>
                      <input
                        type="text"
                        value={editingEdu?.school || ''}
                        onChange={(e) => setEditingEdu(prev => prev ? { ...prev, school: e.target.value } : null)}
                        placeholder="VD: Đại học Bách Khoa, Kinh tế Quốc Dân..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Bằng cấp / Trình độ</label>
                      <select
                        value={editingEdu?.degree || 'Cử nhân'}
                        onChange={(e) => setEditingEdu(prev => prev ? { ...prev, degree: e.target.value } : null)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                      >
                        <option value="Cử nhân">Cử nhân</option>
                        <option value="Kỹ sư">Kỹ sư</option>
                        <option value="Thạc sĩ">Thạc sĩ</option>
                        <option value="Tiến sĩ">Tiến sĩ</option>
                        <option value="Cao đẳng">Cao đẳng</option>
                        <option value="Trung cấp / Chứng chỉ nghề">Trung cấp / Chứng chỉ nghề</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Chuyên ngành đào tạo *</label>
                      <input
                        type="text"
                        value={editingEdu?.major || ''}
                        onChange={(e) => setEditingEdu(prev => prev ? { ...prev, major: e.target.value } : null)}
                        placeholder="VD: Kỹ thuật phần mềm, Quản trị kinh doanh..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Xếp loại tốt nghiệp / GPA</label>
                      <input
                        type="text"
                        value={editingEdu?.grade || ''}
                        onChange={(e) => setEditingEdu(prev => prev ? { ...prev, grade: e.target.value } : null)}
                        placeholder="VD: Giỏi (GPA 3.4/4.0)"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Thời gian bắt đầu</label>
                      <input
                        type="month"
                        value={editingEdu?.startDate || ''}
                        onChange={(e) => setEditingEdu(prev => prev ? { ...prev, startDate: e.target.value } : null)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Thời gian tốt nghiệp</label>
                      <input
                        type="month"
                        value={editingEdu?.endDate || ''}
                        onChange={(e) => setEditingEdu(prev => prev ? { ...prev, endDate: e.target.value } : null)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => { setIsAddingEdu(false); setEditingEdu(null); }}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (editingEdu && editingEdu.school && editingEdu.major) {
                          handleSaveEdu(editingEdu);
                        } else {
                          alert('Vui lòng điền trường học và chuyên ngành');
                        }
                      }}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                    >
                      Lưu học vấn
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {profile.educations.length === 0 && !isAddingEdu && !editingEdu && (
                  <div className="text-center py-10 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">Chưa có thông tin học vấn / bằng cấp</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                        Tài khoản mới chưa cập nhật mục này. Thêm thông tin trường đại học, cao đẳng hoặc các khóa đào tạo của bạn.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsAddingEdu(true);
                        setEditingEdu({
                          id: `edu-${Date.now()}`,
                          school: '',
                          degree: 'Cử nhân',
                          major: '',
                          startDate: '',
                          endDate: '',
                          grade: ''
                        });
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm học vấn đầu tiên
                    </button>
                  </div>
                )}
                {profile.educations.map((edu) => (
                  <div key={edu.id} className="p-4 rounded-xl border border-slate-200 bg-white flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{edu.school}</h4>
                      <p className="font-semibold text-blue-700">{edu.degree} - {edu.major}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                        <span>Niên khóa: {edu.startDate} - {edu.endDate}</span>
                        {edu.grade && <span>• Xếp loại: <strong>{edu.grade}</strong></span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setEditingEdu(edu); setIsAddingEdu(false); }}
                        className="p-1.5 text-slate-500 hover:text-blue-600 rounded-md"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEdu(edu.id)}
                        className="p-1.5 text-slate-500 hover:text-red-600 rounded-md"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: SKILLS & LANGUAGES */}
          {activeSection === 'skills' && (
            <div className="space-y-5 text-xs">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900">Kỹ năng &amp; Ngoại ngữ</h2>
                <p className="text-slate-500">Các kỹ năng chuyên môn cốt lõi giúp bộ máy AI của Nextstep ghép nối công việc phù hợp nhất</p>
              </div>

              {/* Add skill row */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  placeholder="Tên kỹ năng (VD: React, SEO, Tiếng Anh TOEIC 800...)"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddSkill(); }}
                  className="flex-1 w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                />

                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as any)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="technical">Kỹ năng chuyên môn</option>
                  <option value="soft">Kỹ năng mềm</option>
                  <option value="language">Ngoại ngữ</option>
                </select>

                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(Number(e.target.value))}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="5">Thành thạo (5/5)</option>
                  <option value="4">Khá tốt (4/5)</option>
                  <option value="3">Trung bình (3/5)</option>
                  <option value="2">Cơ bản (2/5)</option>
                </select>

                <button
                  onClick={handleAddSkill}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Thêm
                </button>
              </div>

              {/* Categorized Skills */}
              <div className="space-y-4">
                {profile.skills.length === 0 && (
                  <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-2">
                    <Wrench className="w-8 h-8 text-slate-400 mx-auto" />
                    <h3 className="font-bold text-slate-800 text-sm">Chưa có kỹ năng nào được thêm</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Tài khoản mới chưa có dữ liệu kỹ năng. Nhập tên kỹ năng vào ô phía trên rồi nhấn "Thêm kỹ năng" để tự hoàn thiện hồ sơ.
                    </p>
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    Kỹ năng chuyên môn (Technical Skills)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.filter(s => s.category === 'technical').map(skill => (
                      <div
                        key={skill.id}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200/80 text-blue-900 flex items-center gap-2"
                      >
                        <span className="font-semibold">{skill.name}</span>
                        <span className="text-[10px] bg-blue-200/80 text-blue-800 px-1.5 py-0.2 rounded font-mono">
                          {skill.level}/5 ★
                        </span>
                        <button
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="text-slate-400 hover:text-red-600 cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                    Kỹ năng mềm (Soft Skills)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.filter(s => s.category === 'soft').map(skill => (
                      <div
                        key={skill.id}
                        className="px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200/80 text-purple-900 flex items-center gap-2"
                      >
                        <span className="font-semibold">{skill.name}</span>
                        <span className="text-[10px] bg-purple-200/80 text-purple-800 px-1.5 py-0.2 rounded font-mono">
                          {skill.level}/5 ★
                        </span>
                        <button
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="text-slate-400 hover:text-red-600 cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    Ngoại ngữ (Languages)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.filter(s => s.category === 'language').map(skill => (
                      <div
                        key={skill.id}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-900 flex items-center gap-2"
                      >
                        <span className="font-semibold">{skill.name}</span>
                        <span className="text-[10px] bg-emerald-200/80 text-emerald-800 px-1.5 py-0.2 rounded font-mono">
                          {skill.level}/5 ★
                        </span>
                        <button
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="text-slate-400 hover:text-red-600 cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: PROJECTS */}
          {activeSection === 'projects' && (
            <div className="space-y-5 text-xs">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Dự án tiêu biểu &amp; Portfolio</h2>
                  <p className="text-slate-500">Minh chứng năng lực qua các sản phẩm thực tế đã triển khai</p>
                </div>
                {!isAddingProj && !editingProj && (
                  <button
                    onClick={() => {
                      setIsAddingProj(true);
                      setEditingProj({
                        id: `proj-${Date.now()}`,
                        name: '',
                        role: '',
                        startDate: '',
                        endDate: '',
                        link: '',
                        description: '',
                        techStack: []
                      });
                    }}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Thêm dự án
                  </button>
                )}
              </div>

              {(isAddingProj || editingProj) && (
                <div className="p-4 bg-slate-50 rounded-2xl border-2 border-blue-200 space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {isAddingProj ? 'Thêm dự án mới' : 'Chỉnh sửa dự án'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Tên dự án *</label>
                      <input
                        type="text"
                        value={editingProj?.name || ''}
                        onChange={(e) => setEditingProj(prev => prev ? { ...prev, name: e.target.value } : null)}
                        placeholder="VD: Ứng dụng E-Commerce Microfrontend..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Vai trò của bạn trong dự án *</label>
                      <input
                        type="text"
                        value={editingProj?.role || ''}
                        onChange={(e) => setEditingProj(prev => prev ? { ...prev, role: e.target.value } : null)}
                        placeholder="VD: Lead Architect, Lập trình viên chính..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">Link demo / GitHub / Website</label>
                      <input
                        type="url"
                        value={editingProj?.link || ''}
                        onChange={(e) => setEditingProj(prev => prev ? { ...prev, link: e.target.value } : null)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">Công nghệ sử dụng (phân cách bằng dấu phẩy)</label>
                      <input
                        type="text"
                        value={editingProj?.techStack?.join(', ') || ''}
                        onChange={(e) => {
                          const list = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          setEditingProj(prev => prev ? { ...prev, techStack: list } : null);
                        }}
                        placeholder="React, TypeScript, Next.js, Docker..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">Mô tả dự án &amp; giải pháp</label>
                      <textarea
                        rows={3}
                        value={editingProj?.description || ''}
                        onChange={(e) => setEditingProj(prev => prev ? { ...prev, description: e.target.value } : null)}
                        placeholder="Trình bày bài toán cần giải quyết và kết quả đạt được..."
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => { setIsAddingProj(false); setEditingProj(null); }}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (editingProj && editingProj.name && editingProj.role) {
                          handleSaveProj(editingProj);
                        } else {
                          alert('Vui lòng điền tên dự án và vai trò');
                        }
                      }}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                    >
                      Lưu dự án
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {profile.projects.length === 0 && !isAddingProj && !editingProj && (
                  <div className="text-center py-10 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
                      <FolderGit2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">Chưa có dự án tiêu biểu nào</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                        Tài khoản mới chưa có dữ liệu dự án. Bổ sung các dự án cá nhân hoặc sản phẩm thực tế để ghi điểm với nhà tuyển dụng.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsAddingProj(true);
                        setEditingProj({
                          id: `proj-${Date.now()}`,
                          name: '',
                          role: '',
                          startDate: '',
                          endDate: '',
                          link: '',
                          description: '',
                          techStack: []
                        });
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm dự án đầu tiên
                    </button>
                  </div>
                )}
                {profile.projects.map((proj) => (
                  <div key={proj.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{proj.name}</h4>
                        <p className="font-semibold text-blue-700">Vai trò: {proj.role}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setEditingProj(proj); setIsAddingProj(false); }}
                          className="p-1.5 text-slate-500 hover:text-blue-600 rounded-md"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProj(proj.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 rounded-md"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-slate-600">{proj.description}</p>

                    {proj.techStack && proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.techStack.map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-sm bg-slate-100 text-[10px] font-medium text-slate-700">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline font-semibold pt-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Xem link sản phẩm / demo
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 7: CERTIFICATIONS */}
          {activeSection === 'certificates' && (
            <div className="space-y-5 text-xs">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Chứng chỉ chuyên môn</h2>
                  <p className="text-slate-500">Các văn bằng chứng chỉ quốc tế và chứng nhận hoàn thành khóa học</p>
                </div>
                {!isAddingCert && !editingCert && (
                  <button
                    onClick={() => {
                      setIsAddingCert(true);
                      setEditingCert({
                        id: `cert-${Date.now()}`,
                        name: '',
                        issuer: '',
                        issueDate: '',
                        link: ''
                      });
                    }}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Thêm chứng chỉ
                  </button>
                )}
              </div>

              {(isAddingCert || editingCert) && (
                <div className="p-4 bg-slate-50 rounded-2xl border-2 border-blue-200 space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {isAddingCert ? 'Thêm chứng chỉ mới' : 'Chỉnh sửa chứng chỉ'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Tên chứng chỉ *</label>
                      <input
                        type="text"
                        value={editingCert?.name || ''}
                        onChange={(e) => setEditingCert(prev => prev ? { ...prev, name: e.target.value } : null)}
                        placeholder="VD: AWS Certified Solutions Architect, IELTS 7.5..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Tổ chức cấp *</label>
                      <input
                        type="text"
                        value={editingCert?.issuer || ''}
                        onChange={(e) => setEditingCert(prev => prev ? { ...prev, issuer: e.target.value } : null)}
                        placeholder="VD: Amazon Web Services, British Council, Google..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Ngày cấp / Hiệu lực</label>
                      <input
                        type="month"
                        value={editingCert?.issueDate || ''}
                        onChange={(e) => setEditingCert(prev => prev ? { ...prev, issueDate: e.target.value } : null)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Đường link xác minh (URL)</label>
                      <input
                        type="url"
                        value={editingCert?.link || ''}
                        onChange={(e) => setEditingCert(prev => prev ? { ...prev, link: e.target.value } : null)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => { setIsAddingCert(false); setEditingCert(null); }}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (editingCert && editingCert.name && editingCert.issuer) {
                          handleSaveCert(editingCert);
                        } else {
                          alert('Vui lòng điền tên chứng chỉ và tổ chức cấp');
                        }
                      }}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                    >
                      Lưu chứng chỉ
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {profile.certificates.length === 0 && !isAddingCert && !editingCert && (
                  <div className="text-center py-10 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">Chưa có chứng chỉ nào</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                        Tài khoản mới chưa có dữ liệu chứng chỉ. Thêm chứng chỉ ngoại ngữ, kỹ năng hoặc chuyên ngành bạn sở hữu.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsAddingCert(true);
                        setEditingCert({
                          id: `cert-${Date.now()}`,
                          name: '',
                          issuer: '',
                          issueDate: '',
                          link: ''
                        });
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm chứng chỉ đầu tiên
                    </button>
                  </div>
                )}
                {profile.certificates.map((cert) => (
                  <div key={cert.id} className="p-4 rounded-xl border border-slate-200 bg-white flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{cert.name}</h4>
                      <p className="font-semibold text-blue-700">{cert.issuer}</p>
                      <span className="text-slate-500 text-[11px] block mt-0.5">
                        Ngày cấp: {cert.issueDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setEditingCert(cert); setIsAddingCert(false); }}
                        className="p-1.5 text-slate-500 hover:text-blue-600 rounded-md"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCert(cert.id)}
                        className="p-1.5 text-slate-500 hover:text-red-600 rounded-md"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 8: JOB PREFERENCES */}
          {activeSection === 'preferences' && (
            <div className="space-y-5 text-xs">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900">Tiêu chí &amp; Kỳ vọng công việc</h2>
                <p className="text-slate-500">Thiết lập để Nextstep gửi thông báo việc làm phù hợp và tính toán mức lương thị trường</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vị trí / Chức danh mong muốn</label>
                  <input
                    type="text"
                    value={profile.preferences.desiredTitle}
                    onChange={(e) => updateCandidate({
                      preferences: { ...profile.preferences, desiredTitle: e.target.value }
                    })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cấp bậc mong muốn</label>
                  <select
                    value={profile.preferences.desiredLevel || ''}
                    onChange={(e) => updateCandidate({
                      preferences: { ...profile.preferences, desiredLevel: e.target.value }
                    })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800"
                  >
                    <option value="">-- Chưa chọn cấp bậc --</option>
                    <option value="Thực tập sinh">Thực tập sinh</option>
                    <option value="Nhân viên">Nhân viên</option>
                    <option value="Trưởng nhóm">Trưởng nhóm</option>
                    <option value="Trưởng phòng">Trưởng phòng</option>
                    <option value="Giám đốc">Giám đốc</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mức lương tối thiểu mong muốn (Triệu VNĐ/tháng)</label>
                  <input
                    type="number"
                    placeholder="VD: 15"
                    value={profile.preferences.desiredMinSalary || ''}
                    onChange={(e) => updateCandidate({
                      preferences: { ...profile.preferences, desiredMinSalary: Number(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800 font-bold text-orange-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Địa điểm làm việc ưu tiên</label>
                  <input
                    type="text"
                    value={profile.preferences.desiredLocations.join(', ')}
                    onChange={(e) => updateCandidate({
                      preferences: {
                        ...profile.preferences,
                        desiredLocations: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      }
                    })}
                    placeholder="TP. Hồ Chí Minh, Toàn quốc (Remote)..."
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 9: SETTINGS & PRIVACY */}
          {activeSection === 'settings' && (
            <div className="space-y-5 text-xs">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900">Cài đặt bảo mật &amp; Tìm việc</h2>
                <p className="text-slate-500">Quản lý quyền riêng tư hồ sơ và tần suất nhận thông báo từ Nextstep</p>
              </div>

              <div className="space-y-4">
                {/* Toggle 1: Looking for job */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Trạng thái sẵn sàng tìm việc</h4>
                    <p className="text-slate-500 text-[11px]">Khi bật, bạn sẽ nhận được gợi ý việc làm nhanh và nhà tuyển dụng có thể liên hệ phỏng vấn.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.isLookingForJob}
                      onChange={(e) => updateCandidate({ isLookingForJob: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {/* Toggle 2: Allow recruiters to search CV */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Cho phép Nhà tuyển dụng tìm kiếm hồ sơ</h4>
                    <p className="text-slate-500 text-[11px]">Hồ sơ của bạn sẽ hiển thị trên mạng lưới tìm kiếm nhân tài của Nextstep cho các doanh nghiệp uy tín.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.allowRecruitersSearch}
                      onChange={(e) => updateCandidate({ allowRecruitersSearch: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Toggle 3: Email notifications */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Nhận thông báo việc làm mới qua Email</h4>
                    <p className="text-slate-500 text-[11px]">Nextstep sẽ gửi danh sách các công việc khớp trên 90% mỗi tuần một lần.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.emailNotifications}
                      onChange={(e) => updateCandidate({ emailNotifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live CV Preview Modal */}
      {showCVPreview && (
        <CVPreviewModal
          profile={profile}
          onClose={() => setShowCVPreview(false)}
        />
      )}
    </div>
  );
};
