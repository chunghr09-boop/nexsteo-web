import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  ArrowRight, 
  Briefcase, 
  Layers, 
  Info,
  Clock,
  RotateCcw,
  BarChart2,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import { AuthUser } from '../types';
import { isTestAccount } from '../data/initialProfile';

export interface SalaryCalculatorViewProps {
  currentUser?: AuthUser | null;
  onNavigateToJobs?: (keyword: string) => void;
}

export interface RoleBenchmark {
  min: number;
  avg: number;
  max: number;
  p90: number;
  trend: string;
  trendGrowth: string;
  demand: string;
  hotSkills: string[];
}

export const INDUSTRY_ROLES_MAP: Record<string, string[]> = {
  'CNTT / Phần mềm': [
    'Frontend Developer',
    'Backend Developer',
    'Fullstack Developer',
    'Mobile Developer (iOS/Android)',
    'DevOps / Cloud Engineer',
    'QA / QC / Tester',
    'AI / Data Engineer',
    'Tech Lead / Architect'
  ],
  'Marketing / Truyền thông': [
    'Digital Marketing Specialist',
    'Content Marketing / SEO',
    'Performance Ads Specialist',
    'Brand Manager',
    'Social Media Executive'
  ],
  'Kinh doanh / Bán hàng': [
    'Chuyên viên Kinh doanh B2B',
    'Nhân viên Kinh doanh B2C',
    'Account Executive / Manager',
    'Trưởng phòng Kinh doanh (Sales Manager)'
  ],
  'Thiết kế / Sáng tạo': [
    'UI/UX Designer',
    'Graphic Designer',
    'Product Designer',
    'Video Editor / Motion Graphic'
  ],
  'Tài chính / Kế toán': [
    'Kế toán viên (General Accountant)',
    'Kế toán trưởng (Chief Accountant)',
    'Chuyên viên Phân tích Tài chính',
    'Kiểm toán viên (Auditor)'
  ],
  'Nhân sự / Hành chính': [
    'Chuyên viên Tuyển dụng (Recruiter)',
    'Chuyên viên C&B (Lương & Phúc lợi)',
    'HR Generalist',
    'Trưởng phòng Nhân sự (HR Manager)'
  ]
};

const EXP_LEVELS = [
  'Dưới 1 năm (Fresher / Junior)',
  '1 - 2 năm',
  '2 - 3 năm',
  '3 - 5 năm (Mid / Senior)',
  'Trên 5 năm (Lead / Quản lý)'
];

const CITIES = [
  'Toàn quốc',
  'TP. Hồ Chí Minh',
  'Hà Nội',
  'Đà Nẵng'
];

// Helper to generate benchmark numbers according to role & exp
function getBenchmarkData(role: string, exp: string): RoleBenchmark {
  const isExpHigh = exp.includes('Trên 5 năm');
  const isExpMid = exp.includes('3 - 5 năm');
  const isExp23 = exp.includes('2 - 3 năm');
  const isExp12 = exp.includes('1 - 2 năm');

  if (role.includes('Developer') || role.includes('Engineer') || role.includes('Architect')) {
    if (isExpHigh) return { min: 50, avg: 68, max: 95, p90: 120, trend: 'Tăng trưởng mạnh', trendGrowth: '+18.5%', demand: 'Rất cao (Khan hiếm nhân sự)', hotSkills: ['System Design', 'Microservices', 'AWS/GCP', 'Kubernetes', 'High Concurrency'] };
    if (isExpMid) return { min: 30, avg: 42, max: 58, p90: 70, trend: 'Nhu cầu ổn định cao', trendGrowth: '+14.2%', demand: 'Rất cao', hotSkills: ['React/Next.js', 'Node.js', 'Go/Rust', 'Docker', 'Performance Tuning'] };
    if (isExp23) return { min: 20, avg: 28, max: 36, p90: 45, trend: 'Tăng trưởng tốt', trendGrowth: '+12.0%', demand: 'Cao', hotSkills: ['TypeScript', 'RESTful API', 'SQL/NoSQL', 'Git Flow'] };
    if (isExp12) return { min: 14, avg: 19, max: 25, p90: 30, trend: 'Nhu cầu dồi dào', trendGrowth: '+10.5%', demand: 'Cao', hotSkills: ['JavaScript/TypeScript', 'Tailwind', 'Database Basics'] };
    return { min: 8, avg: 13, max: 17, p90: 20, trend: 'Cạnh tranh', trendGrowth: '+8.0%', demand: 'Trung bình', hotSkills: ['HTML/CSS/JS', 'Thuật toán cơ bản', 'Tư duy logic'] };
  }

  if (role.includes('Designer')) {
    if (isExpHigh) return { min: 42, avg: 56, max: 75, p90: 90, trend: 'Đang lên ngôi', trendGrowth: '+16.0%', demand: 'Cao', hotSkills: ['Design System', 'Product Strategy', 'User Research', 'Data-driven Design'] };
    if (isExpMid) return { min: 25, avg: 34, max: 46, p90: 55, trend: 'Nhu cầu tuyển cao', trendGrowth: '+13.5%', demand: 'Cao', hotSkills: ['Figma Tokens', 'Micro-interactions', 'Prototyping', 'CRO Optimization'] };
    if (isExp23) return { min: 18, avg: 24, max: 32, p90: 38, trend: 'Tăng trưởng đều', trendGrowth: '+11.0%', demand: 'Trung bình', hotSkills: ['Figma', 'UI Kits', 'Mobile UX', 'Auto Layout'] };
    if (isExp12) return { min: 12, avg: 17, max: 22, p90: 26, trend: 'Cạnh tranh vừa', trendGrowth: '+9.0%', demand: 'Trung bình', hotSkills: ['Wireframing', 'Color Theory', 'Typography'] };
    return { min: 7, avg: 11, max: 15, p90: 18, trend: 'Cạnh tranh cao', trendGrowth: '+6.5%', demand: 'Trung bình', hotSkills: ['Figma căn bản', 'Photoshop/Illustrator'] };
  }

  if (role.includes('Marketing') || role.includes('SEO') || role.includes('Ads')) {
    if (isExpHigh) return { min: 45, avg: 60, max: 80, p90: 100, trend: 'Chiến lược toàn diện', trendGrowth: '+15.0%', demand: 'Cao', hotSkills: ['Brand Strategy', 'Omni-channel', 'ROI Optimization', 'Data Analytics'] };
    if (isExpMid) return { min: 26, avg: 36, max: 48, p90: 58, trend: 'Ưu tiên Performance', trendGrowth: '+14.0%', demand: 'Rất cao', hotSkills: ['Performance Ads', 'TikTok Ads', 'Meta Ads', 'GA4 & Tracking'] };
    if (isExp23) return { min: 17, avg: 23, max: 30, p90: 36, trend: 'Tăng trưởng tốt', trendGrowth: '+11.5%', demand: 'Cao', hotSkills: ['Content Marketing', 'SEO Technical', 'Creative Copywriting'] };
    if (isExp12) return { min: 11, avg: 15, max: 20, p90: 24, trend: 'Tuyển nhiều', trendGrowth: '+9.5%', demand: 'Cao', hotSkills: ['Chạy ads cơ bản', 'Content Creation', 'Canva/CapCut'] };
    return { min: 7, avg: 10, max: 13, p90: 16, trend: 'Cạnh tranh', trendGrowth: '+7.0%', demand: 'Cao', hotSkills: ['Viết bài Social', 'Bắt trend', 'Quản trị Fanpage'] };
  }

  if (role.includes('Kinh doanh') || role.includes('Sales')) {
    if (isExpHigh) return { min: 45, avg: 75, max: 130, p90: 180, trend: 'Hoa hồng không giới hạn', trendGrowth: '+20.0%', demand: 'Rất cao', hotSkills: ['B2B Key Accounts', 'Strategic Partnership', 'Đàm phán cấp C-level', 'Mở rộng thị trường'] };
    if (isExpMid) return { min: 28, avg: 45, max: 70, p90: 95, trend: 'Nhu cầu tuyển cực lớn', trendGrowth: '+16.5%', demand: 'Rất cao', hotSkills: ['Khai thác khách hàng doanh nghiệp', 'Thuyết trình giải pháp', 'CRM'] };
    if (isExp23) return { min: 18, avg: 30, max: 45, p90: 60, trend: 'Thu nhập theo năng lực', trendGrowth: '+13.0%', demand: 'Rất cao', hotSkills: ['Chốt sale B2B/B2C', 'Chăm sóc khách hàng', 'Cold Calling'] };
    if (isExp12) return { min: 12, avg: 20, max: 30, p90: 40, trend: 'Dễ tiếp cận', trendGrowth: '+10.0%', demand: 'Rất cao', hotSkills: ['Kỹ năng giao tiếp', 'Tư vấn sản phẩm', 'Xử lý từ chối'] };
    return { min: 8, avg: 14, max: 20, p90: 28, trend: 'Tuyển liên tục', trendGrowth: '+8.5%', demand: 'Rất cao', hotSkills: ['Nhiệt tình', 'Chịu áp lực KPI', 'Giao tiếp linh hoạt'] };
  }

  // Default fallback for Finance, HR and others
  if (isExpHigh) return { min: 35, avg: 50, max: 70, p90: 90, trend: 'Ổn định bền vững', trendGrowth: '+12.0%', demand: 'Ổn định', hotSkills: ['Quản trị rủi ro', 'Pháp lý lao động', 'Tối ưu chi phí', 'Lập kế hoạch chiến lược'] };
  if (isExpMid) return { min: 22, avg: 30, max: 42, p90: 52, trend: 'Tăng trưởng đều', trendGrowth: '+10.5%', demand: 'Cao', hotSkills: ['Quy chế C&B', 'Phân tích báo cáo tài chính', 'ERP/SAP', 'Thuế chuyên sâu'] };
  if (isExp23) return { min: 15, avg: 20, max: 26, p90: 32, trend: 'Nhu cầu chuẩn', trendGrowth: '+9.0%', demand: 'Cao', hotSkills: ['Excel nâng cao', 'Hạch toán kế toán', 'Tuyển dụng nhân sự'] };
  if (isExp12) return { min: 10, avg: 14, max: 18, p90: 22, trend: 'Tuyển đều', trendGrowth: '+7.5%', demand: 'Trung bình', hotSkills: ['Soạn thảo văn bản', 'Hồ sơ bảo hiểm', 'Nhập liệu chứng từ'] };
  return { min: 7, avg: 10, max: 13, p90: 16, trend: 'Phổ biến', trendGrowth: '+6.0%', demand: 'Trung bình', hotSkills: ['Tin học văn phòng', 'Cẩn thận tỉ mỉ'] };
}

const getSalaryStorageKey = (userId?: string) => `jobsgo_salary_calc_${userId || 'guest'}`;

export const SalaryCalculatorView: React.FC<SalaryCalculatorViewProps> = ({
  currentUser,
  onNavigateToJobs
}) => {
  const userId = currentUser?.id || 'guest';
  const isAdmin = currentUser?.role === 'admin';
  const isTest = isTestAccount(userId);

  // Storage data loader
  const storedData = useMemo(() => {
    // Chỉ tài khoản test cand-001 mới có sẵn lịch sử tra cứu lương mẫu
    if (!isTest || isAdmin) {
      return null;
    }
    const saved = localStorage.getItem(getSalaryStorageKey(userId));
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // Default cho tài khoản test Hoàng Minh
    if (userId === 'user-cand-001') {
      return {
        hasCalculatedNet: true,
        grossSalary: 35,
        dependents: 0,
        hasSearchedBenchmark: true,
        selectedIndustry: 'CNTT / Phần mềm',
        selectedRole: 'Frontend Developer',
        selectedExp: '3 - 5 năm (Mid / Senior)',
        selectedCity: 'TP. Hồ Chí Minh',
        recentSearches: [
          { industry: 'CNTT / Phần mềm', role: 'Frontend Developer', exp: '3 - 5 năm (Mid / Senior)', city: 'TP. Hồ Chí Minh', avg: 42, time: 'Hôm nay' }
        ]
      };
    }
    return null;
  }, [userId, isTest, isAdmin]);

  // Tool 1: Gross to Net State
  const [grossInput, setGrossInput] = useState<string>(() => {
    return storedData?.grossSalary ? String(storedData.grossSalary) : '';
  });
  const [dependents, setDependents] = useState<number>(() => {
    return storedData?.dependents || 0;
  });
  const [hasCalculatedNet, setHasCalculatedNet] = useState<boolean>(() => {
    return Boolean(storedData?.hasCalculatedNet);
  });

  // Tool 2: Market Trends & Benchmark State
  const [selectedIndustry, setSelectedIndustry] = useState<string>(() => {
    return storedData?.selectedIndustry || '';
  });
  const [selectedRole, setSelectedRole] = useState<string>(() => {
    return storedData?.selectedRole || '';
  });
  const [selectedExp, setSelectedExp] = useState<string>(() => {
    return storedData?.selectedExp || '3 - 5 năm (Mid / Senior)';
  });
  const [selectedCity, setSelectedCity] = useState<string>(() => {
    return storedData?.selectedCity || 'TP. Hồ Chí Minh';
  });
  const [hasSearchedBenchmark, setHasSearchedBenchmark] = useState<boolean>(() => {
    return Boolean(storedData?.hasSearchedBenchmark);
  });
  const [recentSearches, setRecentSearches] = useState<any[]>(() => {
    return storedData?.recentSearches || [];
  });

  // Automatically reset or update when user changes (e.g. switching accounts)
  useEffect(() => {
    if (!isTest || isAdmin) {
      // Tài khoản mới hoặc Admin: Kiểm tra nếu chưa từng thao tác thì để TRỐNG hoàn toàn!
      const userSaved = localStorage.getItem(getSalaryStorageKey(userId));
      if (userSaved) {
        try {
          const parsed = JSON.parse(userSaved);
          setHasCalculatedNet(Boolean(parsed.hasCalculatedNet));
          setGrossInput(parsed.grossSalary ? String(parsed.grossSalary) : '');
          setDependents(parsed.dependents || 0);
          setHasSearchedBenchmark(Boolean(parsed.hasSearchedBenchmark));
          setSelectedIndustry(parsed.selectedIndustry || '');
          setSelectedRole(parsed.selectedRole || '');
          setSelectedExp(parsed.selectedExp || '3 - 5 năm (Mid / Senior)');
          setSelectedCity(parsed.selectedCity || 'TP. Hồ Chí Minh');
          setRecentSearches(parsed.recentSearches || []);
          return;
        } catch (e) {}
      }
      // Khởi tạo trạng thái TRỐNG cho tài khoản mới / admin
      setHasCalculatedNet(false);
      setGrossInput('');
      setDependents(0);
      setHasSearchedBenchmark(false);
      setSelectedIndustry('');
      setSelectedRole('');
      setSelectedExp('3 - 5 năm (Mid / Senior)');
      setSelectedCity('TP. Hồ Chí Minh');
      setRecentSearches([]);
    }
  }, [userId, isTest, isAdmin]);

  // Roles available for the chosen industry
  const availableRoles = useMemo(() => {
    if (!selectedIndustry) return [];
    return INDUSTRY_ROLES_MAP[selectedIndustry] || [];
  }, [selectedIndustry]);

  // Handle Industry change
  const handleIndustryChange = (newInd: string) => {
    setSelectedIndustry(newInd);
    const roles = INDUSTRY_ROLES_MAP[newInd] || [];
    setSelectedRole(roles[0] || '');
  };

  // Vietnamese Statutory Calculation (Net calculation)
  const grossNum = Number(grossInput) || 0;
  const cappedInsuranceSalary = Math.min(grossNum, 46.8);
  const socialInsurance = cappedInsuranceSalary * 0.08;
  const healthInsurance = cappedInsuranceSalary * 0.015;
  const unemploymentInsurance = Math.min(grossNum, 99.2) * 0.01;
  const totalInsurance = socialInsurance + healthInsurance + unemploymentInsurance;

  const personalDeduction = 11; // 11 million VND
  const dependentDeduction = dependents * 4.4; // 4.4 million VND
  const taxableIncome = Math.max(0, grossNum - totalInsurance - personalDeduction - dependentDeduction);

  let personalTax = 0;
  if (taxableIncome > 0) {
    if (taxableIncome <= 5) personalTax = taxableIncome * 0.05;
    else if (taxableIncome <= 10) personalTax = 5 * 0.05 + (taxableIncome - 5) * 0.1;
    else if (taxableIncome <= 18) personalTax = 5 * 0.05 + 5 * 0.1 + (taxableIncome - 10) * 0.15;
    else if (taxableIncome <= 32) personalTax = 5 * 0.05 + 5 * 0.1 + 8 * 0.15 + (taxableIncome - 18) * 0.2;
    else if (taxableIncome <= 52) personalTax = 5 * 0.05 + 5 * 0.1 + 8 * 0.15 + 14 * 0.2 + (taxableIncome - 32) * 0.25;
    else personalTax = 5 * 0.05 + 5 * 0.1 + 8 * 0.15 + 14 * 0.2 + 20 * 0.25 + (taxableIncome - 52) * 0.3;
  }

  const netSalary = Math.max(0, grossNum - totalInsurance - personalTax);

  // Benchmark Calculation Result
  const currentBenchmark = useMemo(() => {
    if (!selectedRole) return null;
    return getBenchmarkData(selectedRole, selectedExp);
  }, [selectedRole, selectedExp]);

  // Action 1: Execute Gross to Net Calculation
  const handleCalculateNet = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!grossInput || Number(grossInput) <= 0) {
      alert('Vui lòng nhập mức lương Gross hợp lệ (lớn hơn 0 triệu VNĐ) để thực hiện tính toán.');
      return;
    }
    setHasCalculatedNet(true);

    // Save to user storage
    const stateToSave = {
      hasCalculatedNet: true,
      grossSalary: Number(grossInput),
      dependents,
      hasSearchedBenchmark,
      selectedIndustry,
      selectedRole,
      selectedExp,
      selectedCity,
      recentSearches
    };
    localStorage.setItem(getSalaryStorageKey(userId), JSON.stringify(stateToSave));
  };

  // Action 2: Execute Market Salary Benchmark Search
  const handleSearchBenchmark = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedIndustry) {
      alert('Vui lòng chọn Ngành nghề bạn quan tâm.');
      return;
    }
    if (!selectedRole) {
      alert('Vui lòng chọn Vị trí công việc cụ thể.');
      return;
    }

    setHasSearchedBenchmark(true);

    const benchmark = getBenchmarkData(selectedRole, selectedExp);
    const newSearchItem = {
      industry: selectedIndustry,
      role: selectedRole,
      exp: selectedExp,
      city: selectedCity,
      avg: benchmark.avg,
      time: 'Vừa xong'
    };

    const updatedSearches = [
      newSearchItem,
      ...recentSearches.filter(s => s.role !== selectedRole || s.exp !== selectedExp)
    ].slice(0, 5);

    setRecentSearches(updatedSearches);

    // Save to user storage
    const stateToSave = {
      hasCalculatedNet,
      grossSalary: Number(grossInput) || 0,
      dependents,
      hasSearchedBenchmark: true,
      selectedIndustry,
      selectedRole,
      selectedExp,
      selectedCity,
      recentSearches: updatedSearches
    };
    localStorage.setItem(getSalaryStorageKey(userId), JSON.stringify(stateToSave));
  };

  // Quick search from recent search tag
  const handleSelectRecentSearch = (item: any) => {
    setSelectedIndustry(item.industry);
    setSelectedRole(item.role);
    setSelectedExp(item.exp);
    setSelectedCity(item.city);
    setHasSearchedBenchmark(true);
  };

  const isUserNewOrAdmin = isAdmin || !isTest;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Title & Announcement Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0D2B52] flex items-center gap-2">
              <Calculator className="w-6 h-6 text-[#137E8F]" />
              Công Cụ Tra Cứu Lương &amp; Tính Lương Gross - Net Nextstep
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Hệ thống tổng hợp xu hướng thị trường từ hơn 100.000 việc làm thực tế và chuẩn luật thuế lao động 2026
            </p>
          </div>

          {/* Account status indicator badge */}
          {isUserNewOrAdmin && (
            <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-900 text-xs font-semibold flex items-center gap-2 shrink-0">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                {isAdmin ? 'Tài khoản Quản trị viên (Chưa tra cứu)' : 'Tài khoản mới (Dữ liệu ban đầu đang để trống)'}
              </span>
            </div>
          )}
        </div>

        {/* Informative notification for new/admin accounts */}
        {isUserNewOrAdmin && !hasCalculatedNet && !hasSearchedBenchmark && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-600 text-xs flex items-start gap-2.5 leading-relaxed">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>
              <strong>Lưu ý:</strong> Tài khoản của bạn hiện <strong>chưa thực hiện tìm kiếm hoặc tính lương</strong>. Bạn vui lòng nhập số tiền hoặc chọn ngành nghề / vị trí việc làm bên dưới rồi bấm <strong>"Tính Lương Net Ngay"</strong> hoặc <strong>"Tra Cứu Xu Hướng Lương"</strong> để xem kết quả chi tiết.
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================== */}
        {/* TOOL 1: GROSS TO NET CALCULATOR                          */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">Tính Lương Gross sang Net</h2>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              Chuẩn Luật Thuế 2026
            </span>
          </div>

          {/* Form Input */}
          <form onSubmit={handleCalculateNet} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Thu nhập Gross (Triệu VNĐ/tháng) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="500"
                    step="0.5"
                    value={grossInput}
                    onChange={(e) => setGrossInput(e.target.value)}
                    placeholder="VD: 25 hoặc 35"
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-extrabold text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  />
                  <span className="absolute left-3 top-3 text-slate-400 font-bold">₫</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Số người phụ thuộc (giảm trừ 4.4tr/người)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={dependents}
                  onChange={(e) => setDependents(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Calculator className="w-4 h-4" />
                <span>{hasCalculatedNet ? 'Tính lại số tiền' : 'Tính Lương Net Ngay'}</span>
              </button>
              {hasCalculatedNet && (
                <button
                  type="button"
                  onClick={() => {
                    setHasCalculatedNet(false);
                    setGrossInput('');
                    setDependents(0);
                    localStorage.removeItem(getSalaryStorageKey(userId));
                  }}
                  className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer"
                  title="Xóa và để trống"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Result Display OR Empty State */}
          {hasCalculatedNet && grossNum > 0 ? (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50/40 border border-emerald-200 space-y-3.5 animate-in fade-in duration-150">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  Lương thực nhận (Net):
                </span>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-700">
                    {netSalary.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 ml-1">Triệu VNĐ/tháng</span>
                </div>
              </div>

              <div className="border-t border-emerald-200/80 pt-3 space-y-2 text-xs text-slate-700">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-800">Lương Gross ban đầu:</span>
                  <strong className="font-bold text-slate-900">{grossNum.toFixed(2)} triệu</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>- Bảo hiểm bắt buộc (10.5%):</span>
                  <span className="font-semibold text-rose-600">-{totalInsurance.toFixed(2)} triệu</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>- Thuế thu nhập cá nhân (TNCN):</span>
                  <span className="font-semibold text-rose-600">-{personalTax.toFixed(2)} triệu</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px] pt-1 border-t border-emerald-100">
                  <span>Mức giảm trừ gia cảnh người nộp:</span>
                  <span>11.00 triệu/tháng</span>
                </div>
                {dependents > 0 && (
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Giảm trừ {dependents} người phụ thuộc:</span>
                    <span>{dependentDeduction.toFixed(2)} triệu/tháng</span>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-500 bg-white/80 p-3 rounded-xl border border-emerald-100 space-y-1">
                <p className="font-semibold text-slate-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Mức đóng bảo hiểm người lao động chi trả:
                </p>
                <p>• Bảo hiểm xã hội (8%): {socialInsurance.toFixed(2)} triệu</p>
                <p>• Bảo hiểm y tế (1.5%): {healthInsurance.toFixed(2)} triệu</p>
                <p>• Bảo hiểm thất nghiệp (1%): {unemploymentInsurance.toFixed(2)} triệu</p>
              </div>
            </div>
          ) : (
            /* EMPTY STATE WHEN NOT CALCULATED */
            <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">
                Chưa có kết quả tính lương Net
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Tài khoản mới chưa có thao tác tính lương. Vui lòng nhập số tiền Gross ở trên và nhấn <strong>"Tính Lương Net Ngay"</strong> để xem bảng phân tích.
              </p>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* TOOL 2: MARKET SALARY BENCHMARKS & INDUSTRY TRENDS       */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">Tra Cứu Xu Hướng Lương Thị Trường</h2>
            </div>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
              Theo Ngành &amp; Vị Trí
            </span>
          </div>

          {/* Filter Form */}
          <form onSubmit={handleSearchBenchmark} className="space-y-3.5 text-xs">
            {/* Industry Selector */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>1. Ngành nghề việc làm *</span>
              </label>
              <select
                value={selectedIndustry}
                onChange={(e) => handleIndustryChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 cursor-pointer"
              >
                <option value="">-- Chọn ngành việc làm cần tra cứu --</option>
                {Object.keys(INDUSTRY_ROLES_MAP).map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            {/* Position Selector (Dynamic based on selected industry) */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                <span>2. Vị trí công việc cụ thể *</span>
              </label>
              <select
                disabled={!selectedIndustry}
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {!selectedIndustry ? (
                  <option value="">-- Vui lòng chọn ngành nghề ở bước 1 trước --</option>
                ) : (
                  <>
                    <option value="">-- Chọn chức danh công việc --</option>
                    {availableRoles.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Experience */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  3. Số năm kinh nghiệm
                </label>
                <select
                  value={selectedExp}
                  onChange={(e) => setSelectedExp(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 cursor-pointer"
                >
                  {EXP_LEVELS.map(exp => (
                    <option key={exp} value={exp}>{exp}</option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  4. Khu vực làm việc
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 cursor-pointer"
                >
                  {CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-1 flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Tra Cứu Xu Hướng Lương Ngay</span>
              </button>

              {hasSearchedBenchmark && (
                <button
                  type="button"
                  onClick={() => {
                    setHasSearchedBenchmark(false);
                    setSelectedIndustry('');
                    setSelectedRole('');
                    localStorage.removeItem(getSalaryStorageKey(userId));
                  }}
                  className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer"
                  title="Đặt lại thông tin trống"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Results OR Empty State */}
          {hasSearchedBenchmark && currentBenchmark && selectedRole ? (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Main Benchmark Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50/30 border border-blue-200 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-blue-200/70 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">
                      {selectedIndustry} • {selectedCity}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                      {selectedRole}
                    </h3>
                    <p className="text-xs text-slate-500">Mức kinh nghiệm: {selectedExp}</p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-slate-500 block">Lương trung vị (P50)</span>
                    <span className="text-2xl font-black text-blue-700">
                      {currentBenchmark.avg} Triệu VNĐ
                    </span>
                    <span className="text-[11px] text-slate-500 block">/ tháng (Gross)</span>
                  </div>
                </div>

                {/* Percentile range cards */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-blue-100 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-medium block">Khởi điểm (P25)</span>
                    <p className="font-extrabold text-slate-700 mt-0.5">{currentBenchmark.min} triệu</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-blue-200 shadow-2xs ring-2 ring-blue-100">
                    <span className="text-[10px] text-blue-600 font-bold block">Phổ biến (P50)</span>
                    <p className="font-black text-blue-700 mt-0.5">{currentBenchmark.avg} triệu</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-blue-100 shadow-2xs">
                    <span className="text-[10px] text-orange-600 font-medium block">Chuyên gia (P90)</span>
                    <p className="font-extrabold text-orange-600 mt-0.5">{currentBenchmark.p90}+ triệu</p>
                  </div>
                </div>

                {/* Market Trends Indicator */}
                <div className="p-3 rounded-xl bg-white/80 border border-blue-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      Tăng trưởng mức lương năm:
                    </span>
                    <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {currentBenchmark.trendGrowth}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                      Nhu cầu tuyển dụng thực tế:
                    </span>
                    <span className="font-bold text-blue-800">
                      {currentBenchmark.demand}
                    </span>
                  </div>
                </div>

                {/* Hot Skills */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    Top kỹ năng giúp deal lương cao hơn (+20-35%):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentBenchmark.hotSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-white border border-slate-200 text-slate-800 text-[11px] font-semibold rounded-lg shadow-2xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA navigate to jobs */}
                {onNavigateToJobs && (
                  <button
                    type="button"
                    onClick={() => onNavigateToJobs(selectedRole)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <span>Xem các việc làm tuyển dụng "{selectedRole}"</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Recent searches history */}
              {recentSearches.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Lịch sử tra cứu gần đây của tài khoản:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectRecentSearch(item)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-[11px] font-medium border border-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>{item.role}</span>
                        <span className="text-slate-400">({item.avg}tr)</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* EMPTY STATE WHEN NOT SEARCHED */
            <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-2xs">
                <BarChart2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">
                Chưa có thông tin xu hướng lương
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Tài khoản mới và tài khoản admin chưa tìm kiếm lương nên phần này thông tin trống. Hãy chọn <strong>Ngành nghề</strong> và <strong>Vị trí công việc</strong> ở trên rồi nhấn <strong>"Tra Cứu Xu Hướng Lương Ngay"</strong> để xem báo cáo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
