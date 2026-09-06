import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthUser, UserRole, AuthProvider as AuthProviderType } from '../types';

interface SendOtpResult {
  success: boolean;
  otp?: string;
  message: string;
}

interface AuthResult {
  success: boolean;
  user?: AuthUser;
  message: string;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  allUsers: AuthUser[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCandidate: boolean;
  isRecruiter: boolean;
  loginWithGoogle: (email?: string, name?: string, role?: UserRole, companyName?: string) => Promise<AuthUser>;
  loginWithZalo: (phone?: string, name?: string, role?: UserRole, companyName?: string) => Promise<AuthUser>;
  loginWithFacebook: (role?: UserRole, companyName?: string) => Promise<AuthUser>;
  sendPhoneOtp: (phone: string) => SendOtpResult;
  verifyPhoneOtp: (phone: string, otp: string, fullName?: string, role?: UserRole, companyName?: string) => AuthResult;
  loginWithEmail: (email: string, password: string) => AuthResult;
  registerWithEmail: (
    fullName: string, 
    email: string, 
    password: string, 
    phone: string, 
    role?: UserRole,
    companyName?: string,
    recruiterPosition?: string,
    companySize?: string
  ) => AuthResult;
  quickLoginAs: (role: 'admin' | 'candidate' | 'recruiter') => void;
  loginAsUser: (userId: string) => void;
  logout: () => void;
  toggleUserStatus: (userId: string) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  pendingOtpInfo: { phone: string; otp: string; expiresAt: number } | null;
  clearPendingOtp: () => void;
}

const STORAGE_KEYS = {
  CURRENT_USER: 'jobsgo_current_auth_user_v2',
  USERS_LIST: 'jobsgo_all_users_list_v1',
};

// Seed sample users representing different auth providers and roles
const INITIAL_USERS: AuthUser[] = [
  {
    id: 'user-admin-001',
    fullName: 'Ban Quản Trị Hệ Thống Nextstep',
    email: 'admin@nextstep.vn',
    phone: '0988 999 888',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
    role: 'admin',
    provider: 'email',
    createdAt: '2025-01-10',
    status: 'active',
  },
  {
    id: 'user-cand-001',
    fullName: 'Nguyễn Hoàng Minh',
    email: 'hoangminh.dev@gmail.com',
    phone: '0988 765 432',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
    role: 'candidate',
    provider: 'google',
    createdAt: '2025-02-15',
    status: 'active',
    profileId: 'cand-001',
  },
  {
    id: 'user-cand-002',
    fullName: 'Lê Thị Thu Thảo',
    email: 'thuthao.le@gmail.com',
    phone: '0912 345 678',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&auto=format&fit=crop&q=80',
    role: 'candidate',
    provider: 'zalo',
    createdAt: '2025-03-01',
    status: 'active',
  },
  {
    id: 'user-cand-003',
    fullName: 'Trần Văn Đức',
    email: 'duc.tran95@gmail.com',
    phone: '0909 888 777',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&auto=format&fit=crop&q=80',
    role: 'candidate',
    provider: 'phone',
    createdAt: '2025-03-05',
    status: 'active',
  },
  {
    id: 'user-recruiter-001',
    fullName: 'Vũ Thu Trang (HR Director)',
    email: 'trang.vu@nextgen-tech.vn',
    phone: '0933 111 222',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&auto=format&fit=crop&q=80',
    role: 'recruiter',
    provider: 'email',
    createdAt: '2025-02-20',
    status: 'active',
    companyName: 'Công ty Cổ phần Công nghệ NextGen',
    recruiterPosition: 'Trưởng phòng Nhân sự & Tuyển dụng',
    companySize: '150 - 500 nhân viên',
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<AuthUser[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
    if (saved) {
      try { 
        const parsed: AuthUser[] = JSON.parse(saved);
        // Ensure all initial seed users (like recruiter and admin) exist
        const missing = INITIAL_USERS.filter(iu => !parsed.some(p => p.id === iu.id || p.email.toLowerCase() === iu.email.toLowerCase()));
        if (missing.length > 0) {
          return [...parsed, ...missing];
        }
        return parsed;
      } catch (e) {}
    }
    return INITIAL_USERS;
  });

  // Current session user (null by default so new visitors/accounts enter as guest on the main page)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    // One-time cleanup for any legacy auto-seeded session from v1
    try {
      const legacy = localStorage.getItem('jobsgo_current_auth_user_v1');
      if (legacy) {
        localStorage.removeItem('jobsgo_current_auth_user_v1');
      }
    } catch (e) {}

    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) return parsed;
      } catch (e) {}
    }
    // Default to null: new users / visitors land on the main page as guests, NOT as Hoang Minh!
    return null; 
  });

  // Active OTP session for phone verification simulation
  const [pendingOtpInfo, setPendingOtpInfo] = useState<{ phone: string; otp: string; expiresAt: number } | null>(null);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(allUsers));
  }, [allUsers]);

  // Helper to upsert a user into allUsers list
  const upsertUser = (user: AuthUser) => {
    setAllUsers(prev => {
      const idx = prev.findIndex(u => u.id === user.id || (u.email && u.email === user.email) || (u.phone && u.phone === user.phone));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...user };
        return copy;
      }
      return [user, ...prev];
    });
  };

  // Google Login
  const loginWithGoogle = async (customEmail?: string, customName?: string, role: UserRole = 'candidate', companyName?: string): Promise<AuthUser> => {
    const email = customEmail || 'hoangminh.dev@gmail.com';
    const fullName = customName || 'Nguyễn Hoàng Minh';
    
    let existing = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!existing) {
      existing = {
        id: `user-gg-${Date.now()}`,
        fullName,
        email,
        phone: '0988 765 432',
        avatar: role === 'recruiter'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
        role,
        companyName: role === 'recruiter' ? (companyName || 'Công ty Công nghệ Google Partner') : undefined,
        recruiterPosition: role === 'recruiter' ? 'Chuyên viên tuyển dụng' : undefined,
        provider: 'google',
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active',
      };
      upsertUser(existing);
    }
    setCurrentUser(existing);
    return existing;
  };

  // Zalo Login
  const loginWithZalo = async (customPhone?: string, customName?: string, role: UserRole = 'candidate', companyName?: string): Promise<AuthUser> => {
    const phone = customPhone || '0912 345 678';
    const fullName = customName || 'Lê Thị Thu Thảo';

    let existing = allUsers.find(u => u.phone === phone || u.provider === 'zalo');
    if (!existing) {
      existing = {
        id: `user-zalo-${Date.now()}`,
        fullName,
        email: `zalo_${phone.replace(/\s+/g, '')}@zalo.me`,
        phone,
        avatar: role === 'recruiter'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&auto=format&fit=crop&q=80',
        role,
        companyName: role === 'recruiter' ? (companyName || 'Công ty Zalo Partner Tuyển Dụng') : undefined,
        recruiterPosition: role === 'recruiter' ? 'Trưởng phòng tuyển dụng' : undefined,
        provider: 'zalo',
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active',
      };
      upsertUser(existing);
    }
    setCurrentUser(existing);
    return existing;
  };

  // Facebook Login
  const loginWithFacebook = async (role: UserRole = 'candidate', companyName?: string): Promise<AuthUser> => {
    const fullName = 'Nguyễn Quang Huy (FB)';
    const email = 'quanghuy.fb@gmail.com';

    let existing = allUsers.find(u => u.email === email);
    if (!existing) {
      existing = {
        id: `user-fb-${Date.now()}`,
        fullName,
        email,
        phone: '0977 222 333',
        avatar: role === 'recruiter'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&auto=format&fit=crop&q=80',
        role,
        companyName: role === 'recruiter' ? (companyName || 'Doanh nghiệp FB Partner') : undefined,
        recruiterPosition: role === 'recruiter' ? 'HR Specialist' : undefined,
        provider: 'facebook',
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active',
      };
      upsertUser(existing);
    }
    setCurrentUser(existing);
    return existing;
  };

  // Phone OTP Simulation
  const sendPhoneOtp = (phone: string): SendOtpResult => {
    const cleaned = phone.replace(/[\s.-]/g, '');
    if (!cleaned || cleaned.length < 9) {
      return { success: false, message: 'Số điện thoại không hợp lệ. Vui lòng nhập từ 10 số.' };
    }

    // Generate 6 digit OTP (or easily testable 889966)
    const randomDigits = Math.floor(100000 + Math.random() * 900000).toString();
    const otp = randomDigits;
    const expiresAt = Date.now() + 60 * 1000; // 60 seconds

    setPendingOtpInfo({ phone: cleaned, otp, expiresAt });
    return {
      success: true,
      otp,
      message: `Mã OTP xác thực Nextstep đã được gửi đến số ${phone}: ${otp} (Hiệu lực trong 60 giây)`
    };
  };

  // Verify Phone OTP
  const verifyPhoneOtp = (
    phone: string, 
    inputOtp: string, 
    fullName?: string, 
    role: UserRole = 'candidate', 
    companyName?: string
  ): AuthResult => {
    const cleaned = phone.replace(/[\s.-]/g, '');
    if (!pendingOtpInfo || pendingOtpInfo.phone !== cleaned) {
      // Fallback allowed: if testing with default master otp 889966
      if (inputOtp !== '889966' && inputOtp !== '123456') {
        return { success: false, message: 'Vui lòng yêu cầu gửi mã OTP trước khi xác nhận.' };
      }
    } else {
      if (Date.now() > pendingOtpInfo.expiresAt && inputOtp !== '889966') {
        return { success: false, message: 'Mã OTP đã hết hạn. Vui lòng nhấn gửi lại mã mới.' };
      }
      if (pendingOtpInfo.otp !== inputOtp.trim() && inputOtp !== '889966' && inputOtp !== '123456') {
        return { success: false, message: 'Mã OTP không chính xác. Vui lòng kiểm tra lại.' };
      }
    }

    // OTP Validated!
    let user = allUsers.find(u => u.phone.replace(/[\s.-]/g, '') === cleaned);
    if (!user) {
      user = {
        id: `user-phone-${Date.now()}`,
        fullName: fullName || (role === 'recruiter' ? `Nhà tuyển dụng SĐT ${cleaned.slice(-4)}` : `Ứng viên SĐT ${cleaned.slice(-4)}`),
        email: `${cleaned}@mobile.jobsgo.vn`,
        phone: cleaned,
        avatar: role === 'recruiter'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&auto=format&fit=crop&q=80'
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'UV')}&background=0D8ABC&color=fff&size=256&bold=true`,
        role,
        companyName: role === 'recruiter' ? (companyName || 'Doanh nghiệp liên kết SĐT') : undefined,
        recruiterPosition: role === 'recruiter' ? 'Phụ trách tuyển dụng' : undefined,
        provider: 'phone',
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active',
      };
      upsertUser(user);
    }

    if (user.status === 'suspended') {
      return { success: false, message: 'Tài khoản này hiện đang bị tạm khóa bởi quản trị viên.' };
    }

    setCurrentUser(user);
    setPendingOtpInfo(null);
    const roleTitle = user.role === 'recruiter' ? 'Nhà tuyển dụng' : user.role === 'admin' ? 'Quản trị viên' : 'Ứng viên';
    return { success: true, user, message: `Đăng nhập thành công với tài khoản ${roleTitle}!` };
  };

  const clearPendingOtp = () => setPendingOtpInfo(null);

  // Email/Password Login
  const loginWithEmail = (email: string, password: string): AuthResult => {
    const trimmedEmail = email.trim().toLowerCase();

    // Check default Super Admin credentials
    if (trimmedEmail === 'admin@nextstep.vn' || trimmedEmail === 'admin@jobsgo.vn') {
      if (password === 'admin123' || password === 'admin') {
        const adminUser = allUsers.find(u => u.role === 'admin') || INITIAL_USERS[0];
        setCurrentUser(adminUser);
        return { success: true, user: adminUser, message: 'Đăng nhập thành công với quyền Quản Trị Viên (Admin)!' };
      } else {
        return { success: false, message: 'Mật khẩu quản trị viên không chính xác (Mặc định: admin123).' };
      }
    }

    // Check sample Recruiter credentials (Vũ Thu Trang - NextGen Tech)
    if (trimmedEmail === 'trang.vu@nextgen-tech.vn' || trimmedEmail === 'recruiter@nextstep.vn') {
      const recruiterUser = allUsers.find(u => u.email.toLowerCase() === trimmedEmail) || INITIAL_USERS[4];
      if (password === '123456' || password === 'admin123' || password.length >= 4) {
        upsertUser(recruiterUser);
        setCurrentUser(recruiterUser);
        return { 
          success: true, 
          user: recruiterUser, 
          message: `Đăng nhập thành công! Chào mừng Nhà tuyển dụng ${recruiterUser.fullName} (${recruiterUser.companyName})!` 
        };
      } else {
        return { success: false, message: 'Mật khẩu phải từ 4 ký tự trở lên (Mặc định gợi ý: 123456).' };
      }
    }

    const matchedUser = allUsers.find(u => u.email.toLowerCase() === trimmedEmail);
    if (!matchedUser) {
      return { success: false, message: 'Không tìm thấy tài khoản với email này. Vui lòng kiểm tra hoặc đăng ký mới.' };
    }

    if (matchedUser.status === 'suspended') {
      return { success: false, message: 'Tài khoản của bạn đã bị khóa tạm thời. Vui lòng liên hệ ban quản trị.' };
    }

    // For demo convenience, allow common passwords or '123456'
    if (password.length < 4) {
      return { success: false, message: 'Mật khẩu phải từ 4 ký tự trở lên.' };
    }

    setCurrentUser(matchedUser);
    const roleTitle = matchedUser.role === 'recruiter' ? 'Nhà tuyển dụng' : matchedUser.role === 'admin' ? 'Quản trị viên' : 'Ứng viên';
    return { success: true, user: matchedUser, message: `Chào mừng ${roleTitle} ${matchedUser.fullName} quay trở lại!` };
  };

  // Register with Email
  const registerWithEmail = (
    fullName: string, 
    email: string, 
    password: string, 
    phone: string,
    role: UserRole = 'candidate',
    companyName?: string,
    recruiterPosition?: string,
    companySize?: string
  ): AuthResult => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!fullName || !trimmedEmail || !password) {
      return { success: false, message: 'Vui lòng điền đầy đủ các thông tin bắt buộc.' };
    }

    if (role === 'recruiter' && !companyName?.trim()) {
      return { success: false, message: 'Vui lòng nhập tên công ty / doanh nghiệp tuyển dụng.' };
    }

    const exists = allUsers.some(u => u.email.toLowerCase() === trimmedEmail);
    if (exists) {
      return { success: false, message: 'Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.' };
    }

    const newUser: AuthUser = {
      id: `user-email-${Date.now()}`,
      fullName: fullName.trim(),
      email: trimmedEmail,
      phone: phone.trim() || 'Chưa cập nhật',
      avatar: role === 'recruiter'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&auto=format&fit=crop&q=80'
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'UV')}&background=0D8ABC&color=fff&size=256&bold=true`,
      role,
      companyName: role === 'recruiter' ? (companyName?.trim() || 'Công ty TNHH Tuyển Dụng') : undefined,
      recruiterPosition: role === 'recruiter' ? (recruiterPosition?.trim() || 'Chuyên viên tuyển dụng') : undefined,
      companySize: role === 'recruiter' ? companySize : undefined,
      provider: 'email',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    upsertUser(newUser);
    setCurrentUser(newUser);

    const successMsg = role === 'recruiter'
      ? `Chào mừng Quý Doanh nghiệp! Đăng ký tài khoản Nhà tuyển dụng (${newUser.companyName}) thành công!`
      : 'Đăng ký tài khoản Ứng viên thành công! Bạn có thể bắt đầu tìm việc và nộp hồ sơ.';

    return { success: true, user: newUser, message: successMsg };
  };

  // Quick switch demo
  const quickLoginAs = (role: 'admin' | 'candidate' | 'recruiter') => {
    let target = allUsers.find(u => u.role === role);
    if (!target) {
      if (role === 'admin') target = INITIAL_USERS[0];
      else if (role === 'candidate') target = INITIAL_USERS[1];
      else target = INITIAL_USERS[4];
      upsertUser(target);
    }
    setCurrentUser(target);
  };

  // Direct login as specific test user (isolating test candidate/recruiter/admin accounts)
  const loginAsUser = (userId: string) => {
    let target = allUsers.find(u => u.id === userId);
    if (!target) {
      target = INITIAL_USERS.find(u => u.id === userId);
      if (target) {
        upsertUser(target);
      }
    }
    if (target) {
      setCurrentUser(target);
    }
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  };

  // Admin controls
  const toggleUserStatus = (userId: string) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'active' ? 'suspended' : 'active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, role: newRole };
      }
      return u;
    }));

    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, role: newRole } : null);
    }
  };

  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.role === 'admin';
  const isCandidate = currentUser?.role === 'candidate';
  const isRecruiter = currentUser?.role === 'recruiter';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        isAuthenticated,
        isAdmin,
        isCandidate,
        isRecruiter,
        loginWithGoogle,
        loginWithZalo,
        loginWithFacebook,
        sendPhoneOtp,
        verifyPhoneOtp,
        loginWithEmail,
        registerWithEmail,
        quickLoginAs,
        loginAsUser,
        logout,
        toggleUserStatus,
        updateUserRole,
        pendingOtpInfo,
        clearPendingOtp
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
