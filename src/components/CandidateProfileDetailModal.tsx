import React from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Github, 
  Linkedin, 
  Briefcase, 
  GraduationCap, 
  Award, 
  FolderGit2, 
  CheckCircle2, 
  Printer, 
  Download, 
  FileText, 
  Calendar, 
  MessageSquare,
  BadgeCheck,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { CandidateProfile, Application } from '../types';

interface CandidateProfileDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CandidateProfile;
  currentApplication?: Application;
  onOpenChatWithCandidate?: (candidateName: string) => void;
  onScheduleInterview?: (app: Application) => void;
}

export const CandidateProfileDetailModal: React.FC<CandidateProfileDetailModalProps> = ({
  isOpen,
  onClose,
  profile,
  currentApplication,
  onOpenChatWithCandidate,
  onScheduleInterview
}) => {
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose}
    >
      <div 
        id="candidate-profile-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in zoom-in-95 duration-200 cursor-default"
      >
        {/* MODAL TOOLBAR */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#0D2B52] bg-teal-100 px-2.5 py-1 rounded-lg">Nextstep Candidate Profile</span>
            <h3 className="text-sm font-bold text-slate-800 truncate">
              Trang hồ sơ năng lực • {profile.fullName}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In / Tải PDF</span>
            </button>
            <button
              type="button"
              id="candidate-profile-close-btn-top"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="p-1.5 px-3 rounded-xl bg-slate-200/80 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold transition-all cursor-pointer flex items-center gap-1 text-xs border border-slate-300/80 shadow-2xs relative z-30"
              title="Đóng trang hồ sơ (Phím Esc)"
            >
              <X className="w-4 h-4 pointer-events-none" />
              <span className="pointer-events-none">Đóng</span>
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-800 bg-slate-50/50 flex-1">
          {/* CANDIDATE HEADER CARD */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="relative shrink-0">
                <img
                  src={profile.avatar}
                  alt={profile.fullName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
                />
                <span className="absolute -bottom-1 -right-1 p-1 bg-blue-600 rounded-full text-white ring-2 ring-white">
                  <BadgeCheck className="w-4 h-4" />
                </span>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                    {profile.fullName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                    Hồ sơ đã xác thực
                  </span>
                </div>

                <p className="text-sm font-bold text-blue-600">{profile.title}</p>
                
                {/* Meta Contact Badges */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs text-slate-600 pt-1 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    {profile.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    {profile.phone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    {profile.city}
                  </span>
                  {profile.website && (
                    <a href={profile.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                      <Globe className="w-3.5 h-3.5" />
                      Website
                    </a>
                  )}
                  {profile.github && (
                    <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-800 hover:underline">
                      <Github className="w-3.5 h-3.5" />
                      GitHub
                    </a>
                  )}
                  {profile.linkedin && (
                    <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-700 hover:underline">
                      <Linkedin className="w-3.5 h-3.5" />
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col items-center gap-2 shrink-0">
                {currentApplication && onScheduleInterview && (
                  <button
                    onClick={() => {
                      onClose();
                      onScheduleInterview(currentApplication);
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Hẹn phỏng vấn</span>
                  </button>
                )}
                {onOpenChatWithCandidate && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenChatWithCandidate(profile.fullName);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Nhắn tin</span>
                  </button>
                )}
              </div>
            </div>

            {/* Application Context if available */}
            {currentApplication && (
              <div className="mt-3 p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs text-blue-950">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  Đã ứng tuyển: <strong>{currentApplication.jobTitle}</strong> ({currentApplication.company})
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-200/80 text-blue-900 font-bold text-[10px]">
                  Nộp: {currentApplication.appliedAt}
                </span>
              </div>
            )}
          </div>

          {/* BIO & CAREER OBJECTIVE */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div>
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
                Giới thiệu bản thân
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                {profile.bio || 'Ứng viên chưa cập nhật phần giới thiệu.'}
              </p>
            </div>
            {profile.careerObjective && (
              <div className="pt-2 border-t border-slate-100">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
                  Mục tiêu nghề nghiệp
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                  {profile.careerObjective}
                </p>
              </div>
            )}
          </div>

          {/* WORK EXPERIENCES */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              Kinh nghiệm làm việc ({profile.experiences.length})
            </h3>

            {profile.experiences.length === 0 ? (
              <p className="text-xs text-slate-500 italic">Chưa có thông tin kinh nghiệm.</p>
            ) : (
              <div className="space-y-4 border-l-2 border-blue-200 pl-4 ml-1">
                {profile.experiences.map((exp) => (
                  <div key={exp.id} className="space-y-1 relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white"></span>
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                        {exp.position} • <span className="text-blue-600">{exp.company}</span>
                      </h4>
                      <span className="text-[11px] text-slate-400 font-semibold">
                        {exp.startDate} - {exp.isCurrent ? 'Hiện tại' : exp.endDate}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {exp.description}
                    </p>
                    {exp.achievements && (
                      <p className="text-[11px] text-emerald-700 font-medium bg-emerald-50/70 p-2 rounded-lg border border-emerald-100">
                        ⭐ Thành tựu: {exp.achievements}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* EDUCATION & SKILLS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Educations */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                Học vấn &amp; Bằng cấp
              </h3>
              <div className="space-y-3">
                {profile.educations.map((edu) => (
                  <div key={edu.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <h4 className="font-bold text-slate-900 text-xs">{edu.school}</h4>
                    <p className="text-[11px] text-blue-600 font-semibold">{edu.degree} - {edu.major}</p>
                    <p className="text-[10px] text-slate-400">{edu.startDate} - {edu.endDate} {edu.grade ? `• Xếp loại: ${edu.grade}` : ''}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Kỹ năng chuyên môn
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((skill) => (
                  <span 
                    key={skill.id}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>{skill.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CERTIFICATES & PROJECTS */}
          {(profile.certificates.length > 0 || profile.projects.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.certificates.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    Chứng chỉ ({profile.certificates.length})
                  </h3>
                  <div className="space-y-2.5">
                    {profile.certificates.map(cert => (
                      <div key={cert.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                        <h4 className="font-bold text-slate-900 text-xs">{cert.name}</h4>
                        <p className="text-[11px] text-slate-500">{cert.issuer} • Cấp ngày: {cert.issueDate}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {profile.projects.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-teal-600" />
                    Dự án nổi bật ({profile.projects.length})
                  </h3>
                  <div className="space-y-2.5">
                    {profile.projects.map(proj => (
                      <div key={proj.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <h4 className="font-bold text-slate-900 text-xs">{proj.name} ({proj.role})</h4>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{proj.description}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {proj.techStack.map(t => (
                            <span key={t} className="px-1.5 py-0.5 rounded bg-white text-slate-600 text-[9px] border">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ATTACHED CV INDICATOR */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs text-slate-800">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <span className="font-bold block text-sm">
                  {profile.attachedCvName || 'CV_Ung_Vien_Chuyen_Nghiep.pdf'}
                </span>
                <span className="text-[11px] text-slate-400">
                  Dung lượng: {profile.attachedCvSize || '2.4 MB'} • Cập nhật gần nhất
                </span>
              </div>
            </div>

            <button
              onClick={() => alert(`Đang tải tệp hồ sơ: ${profile.attachedCvName || 'CV_Ung_Vien_Chuyen_Nghiep.pdf'}`)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải CV PDF</span>
            </button>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-medium">
            Hồ sơ điện tử ứng viên trên Nền tảng Nextstep
          </span>
          <button
            type="button"
            id="candidate-profile-close-btn-bottom"
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
