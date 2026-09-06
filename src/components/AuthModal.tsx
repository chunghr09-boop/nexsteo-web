import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  Phone, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  RotateCcw,
  Building2,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NextstepLogo } from './NextstepLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  initialMethod?: 'all' | 'phone' | 'email';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  initialMethod = 'all',
  onSuccess
}) => {
  const {
    loginWithGoogle,
    loginWithZalo,
    loginWithFacebook,
    sendPhoneOtp,
    verifyPhoneOtp,
    loginWithEmail,
    registerWithEmail,
    pendingOtpInfo,
    clearPendingOtp
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [method, setMethod] = useState<'all' | 'phone' | 'email'>(initialMethod);

  // Role selection when registering: 'candidate' | 'recruiter'
  const [registerRole, setRegisterRole] = useState<'candidate' | 'recruiter'>('candidate');

  // Recruiter specific fields
  const [companyName, setCompanyName] = useState('');
  const [recruiterPosition, setRecruiterPosition] = useState('Chuyên viên tuyển dụng');
  const [companySize, setCompanySize] = useState('50 - 150 nhân viên');

  // Email form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Phone OTP form
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [lastGeneratedOtp, setLastGeneratedOtp] = useState<string | null>(null);

  // Feedback messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setMethod(initialMethod);
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [initialMode, initialMethod, isOpen]);

  // Countdown timer for OTP
  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  if (!isOpen) return null;

  const handleClose = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    clearPendingOtp();
    onClose();
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      await loginWithGoogle(
        undefined, 
        undefined, 
        mode === 'register' ? registerRole : undefined, 
        mode === 'register' && registerRole === 'recruiter' ? companyName : undefined
      );
      setSuccessMessage(
        mode === 'register' && registerRole === 'recruiter'
          ? 'Đăng ký tài khoản Nhà tuyển dụng qua Google thành công!'
          : 'Đăng nhập với tài khoản Google thành công!'
      );
      setTimeout(() => {
        setIsLoading(false);
        handleClose();
        if (onSuccess) onSuccess();
      }, 700);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage('Không thể kết nối với Google. Vui lòng thử lại.');
    }
  };

  const handleZaloLogin = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      await loginWithZalo(
        undefined, 
        undefined, 
        mode === 'register' ? registerRole : undefined, 
        mode === 'register' && registerRole === 'recruiter' ? companyName : undefined
      );
      setSuccessMessage(
        mode === 'register' && registerRole === 'recruiter'
          ? 'Đăng ký tài khoản Nhà tuyển dụng qua Zalo thành công!'
          : 'Đăng nhập thành công qua Zalo ID!'
      );
      setTimeout(() => {
        setIsLoading(false);
        handleClose();
        if (onSuccess) onSuccess();
      }, 700);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage('Không thể xác thực qua Zalo. Vui lòng thử lại.');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      await loginWithFacebook(
        mode === 'register' ? registerRole : undefined, 
        mode === 'register' && registerRole === 'recruiter' ? companyName : undefined
      );
      setSuccessMessage(
        mode === 'register' && registerRole === 'recruiter'
          ? 'Đăng ký tài khoản Nhà tuyển dụng qua Facebook thành công!'
          : 'Đăng nhập với Facebook thành công!'
      );
      setTimeout(() => {
        setIsLoading(false);
        handleClose();
        if (onSuccess) onSuccess();
      }, 700);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage('Đăng nhập Facebook thất bại.');
    }
  };

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    const res = sendPhoneOtp(phone);
    if (!res.success) {
      setErrorMessage(res.message);
      return;
    }

    setOtpSent(true);
    setCountdown(60);
    setLastGeneratedOtp(res.otp || '889966');
    setSuccessMessage(res.message);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!otpCode || otpCode.length < 4) {
      setErrorMessage('Vui lòng nhập đủ mã OTP.');
      return;
    }

    const res = verifyPhoneOtp(
      phone, 
      otpCode, 
      fullName || undefined, 
      mode === 'register' ? registerRole : undefined, 
      mode === 'register' && registerRole === 'recruiter' ? companyName : undefined
    );
    if (!res.success) {
      setErrorMessage(res.message);
      return;
    }

    setSuccessMessage(res.message);
    setTimeout(() => {
      handleClose();
      if (onSuccess) onSuccess();
    }, 800);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (mode === 'login') {
      const res = loginWithEmail(email, password);
      if (!res.success) {
        setErrorMessage(res.message);
        return;
      }
      setSuccessMessage(res.message);
      setTimeout(() => {
        handleClose();
        if (onSuccess) onSuccess();
      }, 800);
    } else {
      if (registerRole === 'recruiter' && !companyName.trim()) {
        setErrorMessage('Vui lòng nhập tên công ty / doanh nghiệp tuyển dụng.');
        return;
      }

      const res = registerWithEmail(
        fullName, 
        email, 
        password, 
        registerPhone,
        registerRole,
        companyName,
        recruiterPosition,
        companySize
      );
      if (!res.success) {
        setErrorMessage(res.message);
        return;
      }
      setSuccessMessage(res.message);
      setTimeout(() => {
        handleClose();
        if (onSuccess) onSuccess();
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="auth-modal-card"
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* Top Header with Gradient Accent */}
        <div className="bg-gradient-to-r from-[#0D2B52] via-[#103E6B] to-[#137E8F] text-white p-6 pt-7 relative shrink-0">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white p-1.5 px-3 rounded-xl inline-flex items-center shadow-xs">
              <NextstepLogo variant="icon" size="sm" />
              <span className="ml-1.5 text-xs font-black text-[#0D2B52] tracking-wide">Nextstep</span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-200 border border-teal-300/30">
              Hệ Thống Xác Thực Đa Kênh
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-2">
            {mode === 'login' 
              ? 'Chào mừng bạn quay trở lại!' 
              : registerRole === 'recruiter' 
                ? 'Đăng ký tài khoản Nhà Tuyển Dụng' 
                : 'Đăng ký tài khoản Ứng Viên Tìm Việc'}
          </h2>
          <p className="text-xs text-teal-100/80 mt-1">
            {mode === 'login' 
              ? 'Đăng nhập để ứng tuyển nhanh, lưu việc làm và quản lý hồ sơ sự nghiệp' 
              : registerRole === 'recruiter'
                ? 'Đăng tin tuyển dụng và tiếp cận hơn 500,000+ ứng viên chất lượng cao'
                : 'Khám phá hàng ngàn việc làm hấp dẫn và nộp hồ sơ trực tiếp vào các doanh nghiệp'}
          </p>

          {/* Mode Tabs */}
          <div className="flex items-center bg-white/15 p-1 rounded-xl mt-5 backdrop-blur-xs">
            <button
              onClick={() => { setMode('login'); setErrorMessage(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#0D2B52] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Đăng Nhập
            </button>
            <button
              onClick={() => { setMode('register'); setErrorMessage(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-[#0D2B52] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Đăng Ký Tài Khoản
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(92vh-160px)]">
          {/* Notifications */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-800 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* SELECTION: CHỌN VAI TRÒ ĐĂNG KÝ (ỨNG VIÊN VS NHÀ TUYỂN DỤNG) */}
          {mode === 'register' && (
            <div className="space-y-2.5 p-4 rounded-2xl bg-gradient-to-r from-slate-50 via-teal-50/20 to-blue-50/30 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black text-slate-800 tracking-tight">
                  Chọn loại tài khoản bạn muốn đăng ký <span className="text-red-500">*</span>
                </label>
                <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                  registerRole === 'candidate' 
                    ? 'bg-teal-100 text-teal-800 border-teal-200' 
                    : 'bg-blue-100 text-blue-800 border-blue-200'
                }`}>
                  {registerRole === 'candidate' ? 'Tài khoản Ứng viên' : 'Tài khoản Doanh nghiệp'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Option 1: Ứng viên */}
                <button
                  type="button"
                  id="register-role-candidate-btn"
                  onClick={() => { setRegisterRole('candidate'); setErrorMessage(null); }}
                  className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer relative ${
                    registerRole === 'candidate'
                      ? 'border-[#137E8F] bg-white shadow-sm ring-2 ring-teal-500/20'
                      : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-2 text-xs font-black text-slate-900">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                        registerRole === 'candidate' ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <User className="w-3.5 h-3.5" />
                      </div>
                      Ứng Viên Tìm Việc
                    </span>
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                      registerRole === 'candidate' 
                        ? 'bg-[#0D2B52] text-teal-200' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      Tìm việc
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Tạo CV online, tìm kiếm việc làm mơ ước và nộp hồ sơ nhanh chóng.
                  </p>
                  {registerRole === 'candidate' && (
                    <div className="absolute top-2.5 right-2.5 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-[#137E8F]" />
                    </div>
                  )}
                </button>

                {/* Option 2: Nhà tuyển dụng */}
                <button
                  type="button"
                  id="register-role-recruiter-btn"
                  onClick={() => { setRegisterRole('recruiter'); setErrorMessage(null); }}
                  className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer relative ${
                    registerRole === 'recruiter'
                      ? 'border-blue-600 bg-white shadow-sm ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-2 text-xs font-black text-slate-900">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                        registerRole === 'recruiter' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      Nhà Tuyển Dụng
                    </span>
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                      registerRole === 'recruiter' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      Tuyển dụng
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Đăng tin tuyển dụng, tiếp cận ứng viên tài năng &amp; quản lý hồ sơ ứng tuyển.
                  </p>
                  {registerRole === 'recruiter' && (
                    <div className="absolute top-2.5 right-2.5 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* SECTION 1: Social & Multi-Channel Providers (Google, Zalo, Phone OTP, FB) */}
          {method === 'all' && (
            <div className="space-y-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Lựa chọn phương thức nhanh
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Google Login Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Tiếp tục với Google</span>
                </button>

                {/* Zalo Login Button */}
                <button
                  type="button"
                  onClick={handleZaloLogin}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-blue-200 bg-[#0068FF] hover:bg-[#0055D4] text-white text-xs font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                >
                  <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-[#0068FF] font-black text-[10px]">
                    Z
                  </div>
                  <span>Đăng nhập với Zalo</span>
                </button>

                {/* Phone OTP Switch Button */}
                <button
                  type="button"
                  onClick={() => setMethod('phone')}
                  className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800 text-xs font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Xác thực bằng SĐT (OTP)</span>
                </button>

                {/* Facebook Login Button */}
                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-blue-900 bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Tiếp tục với Facebook</span>
                </button>
              </div>
            </div>
          )}

          {/* SECTION 2: PHONE OTP INTERFACE */}
          {method === 'phone' && (
            <div className="space-y-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200/60">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Xác thực tài khoản qua SMS OTP</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setMethod('all'); setOtpSent(false); }}
                  className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                >
                  Đổi phương thức khác
                </button>
              </div>

              {!otpSent ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Số điện thoại của bạn
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-bold text-slate-500">
                        🇻🇳 +84
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ví dụ: 0912 345 678"
                        className="w-full pl-16 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Gửi mã xác nhận 6 số</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3">
                  {lastGeneratedOtp && (
                    <div className="p-3 bg-emerald-100/90 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-center justify-between">
                      <div>
                        <span className="font-bold">Mã OTP gửi tới {phone}:</span>{' '}
                        <code className="text-sm font-black bg-white px-2 py-0.5 rounded text-emerald-700 border border-emerald-200">
                          {lastGeneratedOtp}
                        </code>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOtpCode(lastGeneratedOtp)}
                        className="text-[11px] font-bold text-emerald-700 underline cursor-pointer"
                      >
                        Tự điền
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nhập mã OTP 6 số
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Nhập 6 số (VD: 889966)"
                      className="w-full text-center tracking-widest text-lg font-black py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {countdown > 0 ? (
                        <>Gửi lại mã sau: <strong className="text-emerald-600">{countdown}s</strong></>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSendOtp()}
                          className="text-blue-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" /> Gửi lại mã ngay
                        </button>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-slate-500 hover:text-slate-800 text-[11px] cursor-pointer"
                    >
                      Đổi số điện thoại
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Xác nhận &amp; Đăng nhập ngay</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Divider */}
          {method === 'all' && (
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full"></div>
              <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                Hoặc với Email &amp; Mật khẩu
              </span>
            </div>
          )}

          {/* SECTION 3: Standard Email & Password Form */}
          {method === 'all' && (
            <form onSubmit={handleEmailAuth} className="space-y-3">
              {mode === 'register' && (
                <>
                  {registerRole === 'candidate' ? (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Họ và tên ứng viên <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Ví dụ: Nguyễn Hoàng Minh"
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#137E8F] focus:border-transparent outline-hidden"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Số điện thoại liên hệ <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="tel"
                            required
                            value={registerPhone}
                            onChange={(e) => setRegisterPhone(e.target.value)}
                            placeholder="Ví dụ: 0988 765 432"
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#137E8F] focus:border-transparent outline-hidden"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Tên công ty / Doanh nghiệp <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            required
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Ví dụ: Công ty Cổ phần Công nghệ NextGen"
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Họ và tên người đại diện HR <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                            <input
                              type="text"
                              required
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="Ví dụ: Vũ Thu Trang"
                              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Chức vụ / Vị trí phụ trách
                          </label>
                          <div className="relative">
                            <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                            <input
                              type="text"
                              value={recruiterPosition}
                              onChange={(e) => setRecruiterPosition(e.target.value)}
                              placeholder="Ví dụ: HR Manager / Trưởng phòng Tuyển dụng"
                              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Quy mô doanh nghiệp
                          </label>
                          <select
                            value={companySize}
                            onChange={(e) => setCompanySize(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden bg-white"
                          >
                            <option value="Dưới 20 nhân viên">Dưới 20 nhân viên</option>
                            <option value="20 - 50 nhân viên">20 - 50 nhân viên</option>
                            <option value="50 - 150 nhân viên">50 - 150 nhân viên</option>
                            <option value="150 - 500 nhân viên">150 - 500 nhân viên</option>
                            <option value="Trên 500 nhân viên">Trên 500 nhân viên</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Hotline / SĐT liên hệ <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                            <input
                              type="tel"
                              required
                              value={registerPhone}
                              onChange={(e) => setRegisterPhone(e.target.value)}
                              placeholder="Ví dụ: 0933 111 222"
                              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {mode === 'register' && registerRole === 'recruiter' 
                    ? 'Email công việc / Doanh nghiệp' 
                    : 'Địa chỉ Email'} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={mode === 'register' && registerRole === 'recruiter' ? 'hr@nextgen-tech.vn' : 'email@vidu.com'}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#137E8F] focus:border-transparent outline-hidden"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Mật khẩu <span className="text-red-500">*</span>
                  </label>
                  {mode === 'login' && (
                    <span 
                      onClick={() => setSuccessMessage('Gợi ý: Mật khẩu mặc định là admin123 cho admin hoặc 123456.')}
                      className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                    >
                      Quên mật khẩu?
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#137E8F] focus:border-transparent outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'register' && registerRole === 'recruiter'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-[#0D2B52] hover:bg-[#0a2240]'
                }`}
              >
                {mode === 'login' ? (
                  <>
                    <span>Đăng Nhập Ngay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                ) : registerRole === 'recruiter' ? (
                  <>
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Hoàn Tất Đăng Ký Nhà Tuyển Dụng</span>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5" />
                    <span>Hoàn Tất Đăng Ký Ứng Viên</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
