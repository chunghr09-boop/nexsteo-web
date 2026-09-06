import React, { useState } from 'react';
import { 
  X, 
  Send, 
  FileText, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  User, 
  ShieldCheck,
  ArrowRight,
  Check
} from 'lucide-react';
import { Job, CandidateProfile, Application } from '../types';

interface QuickApplyModalProps {
  job: Job | null;
  profile: CandidateProfile;
  onClose: () => void;
  onSubmitApplication: (application: Application) => void;
  onNavigateToProfile?: () => void;
  onUpdateProfile?: (profile: CandidateProfile) => void;
}

export const QuickApplyModal: React.FC<QuickApplyModalProps> = ({
  job,
  profile,
  onClose,
  onSubmitApplication,
  onNavigateToProfile,
  onUpdateProfile
}) => {
  if (!job) return null;

  const hasAttachedCv = Boolean(profile.attachedCvName);
  const hasOnlineProfile = (profile.experiences && profile.experiences.length > 0) || (profile.skills && profile.skills.length >= 3);
  const hasExistingCv = hasAttachedCv || hasOnlineProfile;

  const [cvChoice, setCvChoice] = useState<'attached' | 'profile' | 'upload'>(() => {
    if (profile.attachedCvName) return 'attached';
    if (hasOnlineProfile) return 'profile';
    return 'upload';
  });

  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [coverLetter, setCoverLetter] = useState<string>(
    `Kính gửi Ban Tuyển dụng ${job.company},\n\nTôi rất quan tâm và mong muốn ứng tuyển vào vị trí ${job.title}. Với nền tảng kiến thức và kinh nghiệm thực chiến trong ngành, tôi tin rằng năng lực của mình sẽ đóng góp thiết thực cho mục tiêu phát triển của quý công ty.\n\nRất mong có cơ hội được trao đổi chi tiết hơn trong buổi phỏng vấn.\n\nTrân trọng,\n${profile.fullName}`
  );
  const [notes, setNotes] = useState<string>('');
  const [candidatePhone, setCandidatePhone] = useState(profile.phone);
  const [candidateEmail, setCandidateEmail] = useState(profile.email);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Check if applicant has a valid CV ready to submit
  const canSubmit = (cvChoice === 'attached' && hasAttachedCv) || 
                    (cvChoice === 'profile' && hasOnlineProfile) || 
                    (cvChoice === 'upload' && Boolean(uploadedFileName)) ||
                    Boolean(uploadedFileName) ||
                    hasAttachedCv;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      setCvChoice('upload');

      // Auto update candidate profile so they now own this attached CV in their account!
      if (onUpdateProfile) {
        const sizeStr = file.size > 1024 * 1024 
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
          : `${Math.round(file.size / 1024)} KB`;
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        onUpdateProfile({
          ...profile,
          attachedCvName: file.name,
          attachedCvSize: sizeStr,
          attachedCvUpdatedAt: dateStr
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      alert('Tài khoản mới chưa có CV. Vui lòng tải lên file CV cá nhân hoặc cập nhật hồ sơ trước khi nộp đơn!');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const now = new Date();
      const formattedTime = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;

      let submittedCvName = 'CV_Ung_Vien.pdf';
      let submittedCvType: 'profile' | 'custom' = 'custom';

      if (cvChoice === 'attached' && profile.attachedCvName) {
        submittedCvName = profile.attachedCvName;
        submittedCvType = 'custom';
      } else if (cvChoice === 'upload') {
        submittedCvName = uploadedFileName || profile.attachedCvName || 'CV_Ung_Vien.pdf';
        submittedCvType = 'custom';
      } else if (cvChoice === 'profile') {
        submittedCvName = `CV_${profile.fullName.replace(/\s+/g, '_')}_Nextstep.pdf`;
        submittedCvType = 'profile';
      }

      const newApp: Application = {
        id: `app-${Date.now()}`,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        companyLogo: job.companyLogo,
        location: job.city,
        salaryText: job.salaryText,
        appliedAt: formattedTime,
        status: 'applied',
        cvType: submittedCvType,
        cvName: submittedCvName,
        coverLetter: coverLetter,
        notes: notes || 'Đã gửi hồ sơ thành công qua Nextstep.',
        applicantId: profile.id.startsWith('user-') ? profile.id : `user-${profile.id}`,
        applicantName: profile.fullName,
        applicantEmail: candidateEmail || profile.email,
        applicantPhone: candidatePhone || profile.phone,
        applicantAvatar: profile.avatar
      };

      onSubmitApplication(newApp);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        id="quick-apply-modal-container"
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Ứng tuyển vị trí {job.title}
              </h2>
              <p className="text-xs text-slate-500">{job.company} • {job.city}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Ứng tuyển thành công!</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Hồ sơ của bạn đã được chuyển thẳng tới phòng Tuyển dụng của <strong>{job.company}</strong>. Nhà tuyển dụng sẽ xem hồ sơ và phản hồi cho bạn qua tin nhắn Nextstep.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Đóng &amp; Tiếp tục tìm việc
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs">
            {/* Warning Banner: New Account without any CV */}
            {!hasExistingCv && !uploadedFileName && (
              <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-2.5 animate-in fade-in">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-xs text-amber-900">
                      Tài khoản mới chưa có CV - Vui lòng tự cập nhật CV để nộp đơn!
                    </p>
                    <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                      Nhà tuyển dụng yêu cầu ứng viên phải có CV để xem xét phỏng vấn. Bạn cần <strong>tải lên File CV (.pdf, .docx)</strong> ngay bên dưới hoặc <strong>đến trang Quản lý hồ sơ</strong> để tự điền thông tin.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <label className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Tải lên File CV ngay bây giờ</span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {onNavigateToProfile && (
                    <button
                      type="button"
                      onClick={onNavigateToProfile}
                      className="px-3 py-2 bg-white hover:bg-amber-100/60 border border-amber-300 text-amber-900 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Tự tạo CV tại Quản lý hồ sơ</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Candidate Quick Contact Verification */}
            <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-blue-600" />
                  Thông tin ứng viên
                </span>
                <span className="text-[11px] text-teal-700 font-semibold">
                  Tự động đồng bộ từ Hồ sơ Nextstep
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Họ và tên</label>
                  <input
                    type="text"
                    disabled
                    value={profile.fullName}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email nhận thông báo</label>
                  <input
                    type="email"
                    required
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Số điện thoại liên hệ</label>
                  <input
                    type="tel"
                    required
                    value={candidatePhone}
                    onChange={(e) => setCandidatePhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>

            {/* Choose CV Method */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-800">
                Chọn CV để nộp cho Nhà tuyển dụng:
              </label>

              <div className="grid grid-cols-1 gap-2.5">
                {/* Option A: Saved Attached CV (if exists in profile) */}
                {profile.attachedCvName && (
                  <div
                    onClick={() => setCvChoice('attached')}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      cvChoice === 'attached'
                        ? 'border-blue-600 bg-blue-50/40 text-blue-900 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                        <div>
                          <p className="font-bold text-xs flex items-center gap-1.5">
                            <span>File CV cá nhân: {profile.attachedCvName}</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full font-bold">
                              Khuyên dùng
                            </span>
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Dung lượng: {profile.attachedCvSize || 'Đã lưu'} • Cập nhật: {profile.attachedCvUpdatedAt || 'Mới đây'}
                          </p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="cv_choice"
                        checked={cvChoice === 'attached'}
                        onChange={() => setCvChoice('attached')}
                        className="text-blue-600 mt-1 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* Option B: Online Nextstep Profile CV */}
                <div
                  onClick={() => {
                    if (hasOnlineProfile) {
                      setCvChoice('profile');
                    }
                  }}
                  className={`p-3.5 rounded-xl border-2 transition-all ${
                    !hasOnlineProfile
                      ? 'border-slate-200 bg-slate-50/70 text-slate-400 cursor-not-allowed opacity-80'
                      : cvChoice === 'profile'
                        ? 'border-blue-600 bg-blue-50/40 text-blue-900 cursor-pointer shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white cursor-pointer'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className={`w-5 h-5 shrink-0 ${hasOnlineProfile ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <div>
                        <p className="font-bold text-xs flex items-center gap-1.5">
                          <span>Hồ sơ Nextstep Online (Chuẩn ATS)</span>
                          {hasOnlineProfile ? (
                            <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.2 rounded-full font-bold">
                              Điểm: {profile.profileStrength}%
                            </span>
                          ) : (
                            <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.2 rounded-full font-bold">
                              Chưa có thông tin
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {hasOnlineProfile 
                            ? `Tự động xuất bản từ ${profile.experiences.length} kinh nghiệm và ${profile.skills.length} kỹ năng đã cập nhật.`
                            : 'Tài khoản mới chưa có dữ liệu kinh nghiệm/kỹ năng. Vui lòng tự cập nhật tại trang Quản lý hồ sơ để kích hoạt.'}
                        </p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="cv_choice"
                      disabled={!hasOnlineProfile}
                      checked={cvChoice === 'profile'}
                      onChange={() => hasOnlineProfile && setCvChoice('profile')}
                      className="text-blue-600 mt-1 cursor-pointer disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Option C: Upload New CV from Computer */}
                <div
                  onClick={() => setCvChoice('upload')}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    cvChoice === 'upload'
                      ? 'border-blue-600 bg-blue-50/40 text-blue-900 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <Upload className="w-5 h-5 text-orange-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold text-xs">
                          {uploadedFileName ? `File vừa chọn: ${uploadedFileName}` : 'Tải lên File CV mới từ máy tính'}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Hỗ trợ PDF, DOCX tối đa 10MB (tự động lưu vào tài khoản)</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="cv_choice"
                      checked={cvChoice === 'upload'}
                      onChange={() => setCvChoice('upload')}
                      className="text-blue-600 mt-1 cursor-pointer"
                    />
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadedFileName ? 'Chọn file khác...' : 'Chọn file CV từ máy...'}</span>
                      <input
                        type="file"
                        accept=".pdf,.docx,.doc"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    {uploadedFileName && (
                      <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        Đã sẵn sàng nộp
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-slate-800">
                  Thư giới thiệu (Cover Letter)
                </label>
                <span className="text-[11px] text-slate-400">Tùy chọn</span>
              </div>
              <textarea
                rows={3}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-xs leading-relaxed"
                placeholder="Viết vài dòng giới thiệu ngắn gửi trực tiếp tới Nhà tuyển dụng..."
              />
            </div>

            {/* Footer Notice */}
            <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-2 border-t border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Nextstep cam kết bảo mật thông tin cá nhân và hồ sơ ứng tuyển của bạn.</span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !canSubmit}
                className={`px-6 py-2.5 font-bold rounded-xl flex items-center gap-2 shadow-md transition-all ${
                  !canSubmit 
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' 
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-blue-500/20 cursor-pointer'
                }`}
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Đang gửi hồ sơ...' : (!canSubmit ? 'Cần cập nhật CV để nộp' : 'Nộp hồ sơ ngay')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
