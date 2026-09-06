import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Github, 
  Linkedin, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  Award, 
  FolderGit2,
  CheckCircle2
} from 'lucide-react';
import { CandidateProfile } from '../types';

interface CVPreviewModalProps {
  profile: CandidateProfile;
  onClose: () => void;
}

export const CVPreviewModal: React.FC<CVPreviewModalProps> = ({
  profile,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        id="cv-preview-modal-container"
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto"
      >
        {/* Modal Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#0D2B52] bg-teal-100 px-2 py-0.5 rounded">Nextstep CV</span>
            <h3 className="text-sm font-bold text-slate-800">
              Mẫu CV Tiêu Chuẩn Quốc Tế - {profile.fullName}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              In / Tải PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable CV Paper Body */}
        <div className="overflow-y-auto p-6 sm:p-10 bg-slate-100/50 print:p-0 print:bg-white">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 max-w-3xl mx-auto p-8 sm:p-10 space-y-6 text-slate-800 print:shadow-none print:border-none print:p-0">
            {/* CV Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b-2 border-blue-600 pb-6">
              <img
                src={profile.avatar}
                alt={profile.fullName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-slate-200 shadow-sm shrink-0"
              />
              <div className="flex-1 text-center sm:text-left space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {profile.fullName}
                </h1>
                <p className="text-base font-bold text-blue-600">{profile.title}</p>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-slate-600 pt-2 font-medium">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    {profile.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    {profile.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    {profile.city}
                  </span>
                  {profile.website && (
                    <span className="flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-blue-600" />
                      {profile.website.replace('https://', '')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Bio / Summary */}
            {profile.bio && (
              <div className="space-y-1.5">
                <h2 className="text-xs font-black uppercase tracking-wider text-blue-700 flex items-center gap-1.5 border-b border-slate-200 pb-1">
                  Giới thiệu bản thân
                </h2>
                <p className="text-xs text-slate-700 leading-relaxed pt-1">{profile.bio}</p>
              </div>
            )}

            {/* Career Objective */}
            {profile.careerObjective && (
              <div className="space-y-1.5">
                <h2 className="text-xs font-black uppercase tracking-wider text-blue-700 flex items-center gap-1.5 border-b border-slate-200 pb-1">
                  Mục tiêu nghề nghiệp
                </h2>
                <p className="text-xs text-slate-700 leading-relaxed pt-1">{profile.careerObjective}</p>
              </div>
            )}

            {/* Work Experience */}
            {profile.experiences.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs font-black uppercase tracking-wider text-blue-700 flex items-center gap-1.5 border-b border-slate-200 pb-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  Kinh nghiệm làm việc
                </h2>
                <div className="space-y-4 pt-1">
                  {profile.experiences.map((exp) => (
                    <div key={exp.id} className="text-xs space-y-1">
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-bold text-slate-900 text-sm">{exp.position}</h3>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {exp.startDate} - {exp.isCurrent ? 'Hiện tại' : exp.endDate}
                        </span>
                      </div>
                      <p className="font-semibold text-blue-600">{exp.company}</p>
                      <p className="text-slate-600 leading-relaxed pt-0.5">{exp.description}</p>
                      {exp.achievements && (
                        <p className="text-[11px] text-emerald-800 font-medium bg-emerald-50/70 p-1.5 rounded border border-emerald-100">
                          <strong>Thành tựu:</strong> {exp.achievements}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {profile.educations.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-blue-700 flex items-center gap-1.5 border-b border-slate-200 pb-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Học vấn &amp; Bằng cấp
                </h2>
                <div className="space-y-2.5 pt-1">
                  {profile.educations.map((edu) => (
                    <div key={edu.id} className="text-xs flex items-baseline justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900">{edu.school}</h3>
                        <p className="text-slate-600">{edu.degree} - {edu.major} {edu.grade ? `(${edu.grade})` : ''}</p>
                      </div>
                      <span className="text-[11px] font-medium text-slate-500">
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {profile.skills.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-blue-700 flex items-center gap-1.5 border-b border-slate-200 pb-1">
                  <Wrench className="w-3.5 h-3.5" />
                  Kỹ năng chuyên môn
                </h2>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded text-xs font-semibold"
                    >
                      {skill.name} ({skill.level}/5)
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Projects */}
            {profile.projects.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-blue-700 flex items-center gap-1.5 border-b border-slate-200 pb-1">
                  <FolderGit2 className="w-3.5 h-3.5" />
                  Dự án tiêu biểu
                </h2>
                <div className="space-y-2 pt-1 text-xs">
                  {profile.projects.map((proj) => (
                    <div key={proj.id} className="space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{proj.name}</span>
                        <span className="text-slate-500 text-[11px]">Vai trò: {proj.role}</span>
                      </div>
                      <p className="text-slate-600">{proj.description}</p>
                      {proj.techStack && proj.techStack.length > 0 && (
                        <p className="text-[11px] text-blue-600 font-medium">
                          Công nghệ: {proj.techStack.join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {profile.certificates.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-blue-700 flex items-center gap-1.5 border-b border-slate-200 pb-1">
                  <Award className="w-3.5 h-3.5" />
                  Chứng chỉ
                </h2>
                <div className="space-y-1 text-xs">
                  {profile.certificates.map((cert) => (
                    <div key={cert.id} className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{cert.name} - {cert.issuer}</span>
                      <span className="text-slate-500 text-[11px]">{cert.issueDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
