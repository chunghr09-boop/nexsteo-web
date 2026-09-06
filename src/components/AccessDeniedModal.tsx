import React from 'react';
import { ShieldAlert, LogIn, ArrowLeft, X, Lock, CheckCircle2, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AccessDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
  portalName?: string;
  onSwitchToAdminLogin: () => void;
}

export const AccessDeniedModal: React.FC<AccessDeniedModalProps> = ({
  isOpen,
  onClose,
  portalName = 'Cổng Tuyển Dụng & Quản Trị',
  onSwitchToAdminLogin
}) => {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div 
        id="access-denied-dialog"
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-rose-900 via-purple-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-300 flex items-center justify-center mb-3">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-200 border border-rose-400/30 inline-block mb-2">
            Quyền Hạn Bị Giới Hạn
          </span>

          <h2 className="text-lg sm:text-xl font-black">
            {portalName} chỉ dành cho Admin
          </h2>
          <p className="text-xs text-rose-100/80 mt-1 leading-relaxed">
            Hệ thống phân định rạch ròi: Cổng tuyển dụng và phân hệ quản trị chỉ mở cho tài khoản <strong>Quản Trị Viên (Admin)</strong>.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Tài khoản hiện tại:</span>
              <span className="font-bold text-slate-800">
                {isAuthenticated ? currentUser?.fullName : 'Khách chưa đăng nhập'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Vai trò:</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                currentUser?.role === 'admin'
                  ? 'bg-purple-100 text-purple-800'
                  : currentUser?.role === 'recruiter'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-teal-100 text-teal-800'
              }`}>
                {isAuthenticated 
                  ? (currentUser?.role === 'candidate' 
                      ? 'Ứng Viên Tìm Việc' 
                      : currentUser?.role === 'recruiter'
                        ? `Nhà Tuyển Dụng (${currentUser.companyName || 'Doanh Nghiệp'})`
                        : 'Quản Trị Viên') 
                  : 'Khách vãng lai'}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <p className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Ứng viên:</strong> Sử dụng hệ thống để tìm việc làm, quản lý hồ sơ &amp; CV, nộp đơn ứng tuyển và lưu tin yêu thích.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <Building2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Nhà tuyển dụng (Doanh nghiệp):</strong> Đăng tải tin tuyển dụng mới, quản lý ứng viên và kết nối nhân tài.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <span>
                <strong>Quản trị viên (Admin):</strong> Toàn quyền kiểm duyệt nội dung, quản lý tài khoản người dùng và cấu hình toàn hệ thống.
              </span>
            </p>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                onClose();
                onSwitchToAdminLogin();
              }}
              className="w-full py-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập tài khoản Quản Trị Viên (Admin)</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại trang Tìm việc làm</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
