import { CandidateProfile, Application, RecruiterView, ChatMessage, AuthUser } from '../types';

export const INITIAL_PROFILE: CandidateProfile = {
  id: 'cand-001',
  fullName: 'Nguyễn Hoàng Minh',
  title: 'Senior Frontend Engineer / Web Architect',
  email: 'hoangminh.dev@gmail.com',
  phone: '0988 765 432',
  birthday: '1996-08-15',
  gender: 'Nam',
  address: 'Số 45 Đường D1, Phường 25, Quận Bình Thạnh',
  city: 'TP. Hồ Chí Minh',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
  bio: 'Lập trình viên Frontend với hơn 5 năm kinh nghiệm chuyên sâu về kiến trúc ứng dụng web hiện đại (React, TypeScript, Next.js, Micro-frontends). Đam mê tối ưu hiệu năng trang web (Core Web Vitals), xây dựng Design System và truyền cảm hứng làm việc cho đồng đội.',
  careerObjective: 'Mục tiêu trở thành Technical Lead / Frontend Architect dẫn dắt các giải pháp quy mô triệu người dùng tại các tập đoàn công nghệ lớn hoặc kỳ lân Đông Nam Á. Tiếp tục hoàn thiện kỹ năng System Design và đóng góp cho cộng đồng mã nguồn mở.',
  website: 'https://hoangminh.dev',
  github: 'https://github.com/hoangminh-tech',
  linkedin: 'https://linkedin.com/in/hoangminh-frontend',
  experiences: [
    {
      id: 'exp-1',
      company: 'Tiki Corporation',
      position: 'Senior Frontend Engineer',
      startDate: '2022-03',
      endDate: 'Hiện tại',
      isCurrent: true,
      description: 'Chịu trách nhiệm kiến trúc và phát triển cổng thanh toán & trang thanh toán (Checkout) của Tiki với lưu lượng xử lý 10,000 requests/phút trong các đợt Mega Sale.',
      achievements: 'Tối ưu chỉ số LCP từ 3.2s xuống 1.1s, giảm 40% dung lượng bundle size qua Code Splitting và lazy loading. Nhận danh hiệu Employee of the Quarter Q3/2023.'
    },
    {
      id: 'exp-2',
      company: 'Sendo.vn / FPT Tech',
      position: 'Frontend Developer',
      startDate: '2019-07',
      endDate: '2022-02',
      isCurrent: false,
      description: 'Phát triển các module Product Catalog, Search & Filter và hệ thống khuyến mãi Voucher trên nền tảng React và Redux Toolkit.',
      achievements: 'Xây dựng thư viện UI component dùng chung giúp giảm 30% thời gian phát triển tính năng mới cho 4 team sản phẩm.'
    }
  ],
  educations: [
    {
      id: 'edu-1',
      school: 'Đại học Bách Khoa TP.HCM (HCMUT)',
      degree: 'Cử nhân Kỹ thuật Phần mềm',
      major: 'Khoa học & Kỹ thuật Máy tính',
      startDate: '2014-09',
      endDate: '2019-06',
      grade: 'Giỏi (GPA: 3.45 / 4.0)'
    }
  ],
  skills: [
    { id: 'sk-1', name: 'React.js & Next.js', level: 5, category: 'technical' },
    { id: 'sk-2', name: 'TypeScript', level: 5, category: 'technical' },
    { id: 'sk-3', name: 'Tailwind CSS & CSS Grid', level: 5, category: 'technical' },
    { id: 'sk-4', name: 'State Management (Zustand/Redux)', level: 5, category: 'technical' },
    { id: 'sk-5', name: 'Web Performance Optimization', level: 4, category: 'technical' },
    { id: 'sk-6', name: 'Node.js & Express REST API', level: 4, category: 'technical' },
    { id: 'sk-7', name: 'Làm việc nhóm & Giao tiếp (Teamwork)', level: 5, category: 'soft' },
    { id: 'sk-8', name: 'Tư duy giải quyết vấn đề (Problem Solving)', level: 5, category: 'soft' },
    { id: 'sk-9', name: 'Tiếng Anh chuyên ngành (TOEIC 875)', level: 4, category: 'language' }
  ],
  certificates: [
    {
      id: 'cert-1',
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      issueDate: '2023-11',
      link: 'https://aws.amazon.com/verification'
    },
    {
      id: 'cert-2',
      name: 'Meta Front-End Developer Professional Certificate',
      issuer: 'Coursera & Meta',
      issueDate: '2022-05',
      link: 'https://coursera.org'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'E-Commerce Micro-Frontend Platform',
      role: 'Lead Frontend Architect',
      startDate: '2023-01',
      endDate: '2023-09',
      link: 'https://github.com/hoangminh-tech/microfrontend-demo',
      description: 'Hệ thống kiến trúc Micro-frontend phân tán cho sàn thương mại điện tử, cho phép các đội ngũ độc lập deploy module thanh toán, giỏ hàng và danh mục.',
      techStack: ['Webpack 5 Module Federation', 'React 18', 'TypeScript', 'Tailwind', 'Docker']
    },
    {
      id: 'proj-2',
      name: 'Real-time Financial Chart Analytics',
      role: 'Fullstack Creator',
      startDate: '2022-08',
      endDate: '2022-12',
      link: 'https://analytics.hoangminh.dev',
      description: 'Bảng theo dõi thị trường tài chính và tiền số thời gian thực với đồ thị nến tương tác tốc độ 60fps.',
      techStack: ['Next.js', 'WebSockets', 'TradingView Library', 'Tailwind']
    }
  ],
  preferences: {
    desiredTitle: 'Senior Frontend Engineer / Tech Lead',
    desiredLevel: 'Trưởng nhóm / Quản lý kỹ thuật',
    desiredMinSalary: 35,
    desiredLocations: ['TP. Hồ Chí Minh', 'Toàn quốc (Remote)'],
    desiredJobTypes: ['Toàn thời gian', 'Remote'],
    desiredIndustries: ['CNTT / Phần mềm', 'Thương mại điện tử', 'Fintech']
  },
  isLookingForJob: true,
  allowRecruitersSearch: true,
  emailNotifications: true,
  profileStrength: 92,
  attachedCvName: 'CV_Nguyen_Hoang_Minh_Nextstep.pdf',
  attachedCvSize: '2.4 MB',
  attachedCvUpdatedAt: '2026-03-01'
};

export const INITIAL_PROFILE_THAO: CandidateProfile = {
  id: 'cand-002',
  fullName: 'Lê Thị Thu Thảo',
  title: 'Senior UI/UX & Product Designer',
  email: 'thuthao.le@gmail.com',
  phone: '0912 345 678',
  birthday: '1998-05-20',
  gender: 'Nữ',
  address: 'Số 120 Đường Nguyễn Thị Minh Khai, Quận 3',
  city: 'TP. Hồ Chí Minh',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&auto=format&fit=crop&q=80',
  bio: 'Chuyên gia thiết kế sản phẩm số (UI/UX) với hơn 3 năm kinh nghiệm trong lĩnh vực Fintech & E-commerce. Đam mê xây dựng Design System quy mô lớn, User Journey Mapping, Micro-interactions và tối ưu tỷ lệ chuyển đổi (CRO).',
  careerObjective: 'Mong muốn gia nhập các công ty công nghệ tiên phong để cùng xây dựng sản phẩm số lấy người dùng làm trung tâm, hoàn thiện hệ thống thiết kế Design Tokens đồng bộ và phát triển lên vị trí Lead Product Designer.',
  website: 'https://thuthao-design.com',
  github: 'https://github.com/thuthao-uiux',
  linkedin: 'https://linkedin.com/in/thuthao-product-design',
  experiences: [
    {
      id: 'exp-thao-1',
      company: 'VNPAY Fintech Solutions',
      position: 'UI/UX Product Designer',
      startDate: '2023-01',
      endDate: 'Hiện tại',
      isCurrent: true,
      description: 'Chủ trì thiết kế luồng thanh toán QR và ví điện tử, phối hợp chặt chẽ với team Mobile & Web Engineer để hiện thực hóa Design System đa nền tảng.',
      achievements: 'Tăng 28% tỷ lệ hoàn tất giao dịch trong vòng 3 tháng đầu ra mắt phiên bản mới.'
    },
    {
      id: 'exp-thao-2',
      company: 'Momo E-Wallet',
      position: 'Junior UI Designer',
      startDate: '2021-06',
      endDate: '2022-12',
      isCurrent: false,
      description: 'Thiết kế icon set, landing page chiến dịch Mega Sale và wireframe cho các mini app tiện ích.',
      achievements: 'Xây dựng bộ thư viện hơn 300+ icon vector chuẩn hóa được toàn công ty áp dụng.'
    }
  ],
  educations: [
    {
      id: 'edu-thao-1',
      school: 'Đại học Kiến Trúc TP.HCM',
      degree: 'Cử nhân Thiết kế Đồ họa & Kỹ thuật số',
      major: 'Thiết kế Mỹ thuật Công nghiệp',
      startDate: '2016-09',
      endDate: '2021-06',
      grade: 'Giỏi (GPA: 3.5 / 4.0)'
    }
  ],
  skills: [
    { id: 'sk-t-1', name: 'Figma & Auto-layout', level: 5, category: 'technical' },
    { id: 'sk-t-2', name: 'Design System & Tokens', level: 5, category: 'technical' },
    { id: 'sk-t-3', name: 'User Research & Wireframing', level: 5, category: 'technical' },
    { id: 'sk-t-4', name: 'Prototyping & Micro-animations', level: 4, category: 'technical' },
    { id: 'sk-t-5', name: 'Adobe Creative Suite', level: 4, category: 'technical' },
    { id: 'sk-t-6', name: 'Giao tiếp & Thuyết trình thiết kế', level: 5, category: 'soft' },
    { id: 'sk-t-7', name: 'Tiếng Anh giao tiếp tốt (IELTS 7.0)', level: 4, category: 'language' }
  ],
  certificates: [
    {
      id: 'cert-t-1',
      name: 'Google UX Design Professional Certificate',
      issuer: 'Google & Coursera',
      issueDate: '2022-08',
      link: 'https://coursera.org'
    }
  ],
  projects: [
    {
      id: 'proj-t-1',
      name: 'NextGen Fintech Banking Design System',
      role: 'Lead UI/UX Designer',
      startDate: '2023-06',
      endDate: '2023-12',
      description: 'Thiết kế trọn vẹn bộ thư viện Design System với 80+ components, light/dark mode và tài liệu hướng dẫn chi tiết cho developer.',
      techStack: ['Figma', 'Tokens Studio', 'Zeroheight']
    }
  ],
  preferences: {
    desiredTitle: 'Senior UI/UX Designer / Product Designer',
    desiredLevel: 'Chuyên viên cao cấp',
    desiredMinSalary: 25,
    desiredLocations: ['TP. Hồ Chí Minh', 'Toàn quốc (Remote)'],
    desiredJobTypes: ['Toàn thời gian', 'Linh hoạt'],
    desiredIndustries: ['CNTT / Phần mềm', 'Tài chính / Ngân hàng', 'Thương mại điện tử']
  },
  isLookingForJob: true,
  allowRecruitersSearch: true,
  emailNotifications: true,
  profileStrength: 95,
  attachedCvName: 'Portfolio_Le_Thi_Thu_Thao_UIUX.pdf',
  attachedCvSize: '5.1 MB',
  attachedCvUpdatedAt: '2026-03-03'
};

export const INITIAL_PROFILE_DUC: CandidateProfile = {
  id: 'cand-003',
  fullName: 'Trần Văn Đức',
  title: 'Senior Backend Engineer (Golang / Java)',
  email: 'duc.tran95@gmail.com',
  phone: '0909 888 777',
  birthday: '1995-11-10',
  gender: 'Nam',
  address: 'Tòa nhà Discovery Complex, Cầu Giấy',
  city: 'Hà Nội',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&auto=format&fit=crop&q=80',
  bio: 'Kỹ sư Backend với hơn 4 năm kinh nghiệm xây dựng hệ thống vi dịch vụ (Microservices), cơ sở dữ liệu lớn và kiến trúc chịu tải cao bằng Golang, Java Spring Boot, Kafka và Kubernetes.',
  careerObjective: 'Mục tiêu trở thành Principal Backend Architect, tối ưu hóa các hệ thống xử lý hàng trăm nghìn giao dịch mỗi giây.',
  website: 'https://ductran.tech',
  github: 'https://github.com/ductran-backend',
  linkedin: 'https://linkedin.com/in/ductran-golang',
  experiences: [
    {
      id: 'exp-d-1',
      company: 'Techcombank Digital',
      position: 'Backend Golang Engineer',
      startDate: '2022-05',
      endDate: 'Hiện tại',
      isCurrent: true,
      description: 'Phát triển dịch vụ chuyển tiền nhanh 24/7 và hệ thống chấm điểm tín dụng dựa trên luồng sự kiện Kafka.',
      achievements: 'Giảm 50% độ trễ API P99 xuống còn 35ms.'
    }
  ],
  educations: [
    {
      id: 'edu-d-1',
      school: 'Đại học Bách Khoa Hà Nội (HUST)',
      degree: 'Kỹ sư Công nghệ Thông tin',
      major: 'Hệ thống Thông tin',
      startDate: '2013-09',
      endDate: '2018-06',
      grade: 'Giỏi'
    }
  ],
  skills: [
    { id: 'sk-d-1', name: 'Golang & Concurrency', level: 5, category: 'technical' },
    { id: 'sk-d-2', name: 'Java Spring Boot', level: 4, category: 'technical' },
    { id: 'sk-d-3', name: 'Kafka & Redis', level: 5, category: 'technical' },
    { id: 'sk-d-4', name: 'Kubernetes & Docker', level: 4, category: 'technical' }
  ],
  certificates: [
    {
      id: 'cert-d-1',
      name: 'Certified Kubernetes Application Developer (CKAD)',
      issuer: 'Cloud Native Computing Foundation',
      issueDate: '2023-04'
    }
  ],
  projects: [],
  preferences: {
    desiredTitle: 'Senior Backend Engineer / Tech Lead',
    desiredLevel: 'Trưởng nhóm kỹ thuật',
    desiredMinSalary: 35,
    desiredLocations: ['Hà Nội', 'Toàn quốc (Remote)'],
    desiredJobTypes: ['Toàn thời gian', 'Remote'],
    desiredIndustries: ['CNTT / Phần mềm', 'Fintech']
  },
  isLookingForJob: true,
  allowRecruitersSearch: true,
  emailNotifications: true,
  profileStrength: 88,
  attachedCvName: 'CV_Tran_Van_Duc_Golang_Microservices.pdf',
  attachedCvSize: '1.8 MB',
  attachedCvUpdatedAt: '2026-03-05'
};

export const INITIAL_PROFILES_MAP: Record<string, CandidateProfile> = {
  'user-cand-001': INITIAL_PROFILE,
  'user-cand-002': INITIAL_PROFILE_THAO,
  'user-cand-003': INITIAL_PROFILE_DUC,
};

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    jobId: 'job-1',
    jobTitle: 'Senior Frontend Developer (React, TypeScript)',
    company: 'VNG Corporation',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80',
    location: 'TP. Hồ Chí Minh',
    salaryText: '30 - 45 triệu',
    appliedAt: '2026-03-01 14:30',
    status: 'interview',
    cvType: 'profile',
    cvName: 'CV_Nguyen_Hoang_Minh_Nextstep.pdf',
    coverLetter: 'Kính gửi ban tuyển dụng VNG Corporation, với hơn 5 năm phát triển web và tối ưu hệ thống thương mại điện tử lớn, tôi rất tự tin có thể đóng góp giá trị cao cho sản phẩm Zalo/ZaloPay.',
    notes: 'Lịch phỏng vấn vòng 1 Kỹ thuật: Thứ Năm 10:00 qua Zoom với anh Tuấn (Tech Lead).',
    interviewDate: '2026-03-06 10:00',
    applicantId: 'user-cand-001',
    applicantName: 'Nguyễn Hoàng Minh',
    applicantEmail: 'hoangminh.dev@gmail.com',
    applicantPhone: '0988 765 432',
    applicantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80'
  },
  {
    id: 'app-2',
    jobId: 'job-7',
    jobTitle: 'Fullstack NodeJS / ReactJS Developer (Remote 100%)',
    company: 'Ascenda Loyalty Tech',
    companyLogo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=128&auto=format&fit=crop&q=80',
    location: 'Toàn quốc (Remote)',
    salaryText: '35 - 55 triệu',
    appliedAt: '2026-03-02 09:15',
    status: 'viewed',
    cvType: 'profile',
    cvName: 'CV_Nguyen_Hoang_Minh_Nextstep.pdf',
    coverLetter: 'Xin chào HR Ascenda, tôi có kinh nghiệm làm việc remote với các đối tác nước ngoài và rất hào hứng với sản phẩm loyalty platform của quý công ty.',
    notes: 'Nhà tuyển dụng đã xem hồ sơ lúc 11:20 hôm qua.',
    applicantId: 'user-cand-001',
    applicantName: 'Nguyễn Hoàng Minh',
    applicantEmail: 'hoangminh.dev@gmail.com',
    applicantPhone: '0988 765 432',
    applicantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80'
  },
  {
    id: 'app-nextgen-1',
    jobId: 'job-nextgen-1',
    jobTitle: 'React Native & Mobile App Engineer (iOS/Android)',
    company: 'Công ty Cổ phần Công nghệ NextGen',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&auto=format&fit=crop&q=80',
    location: 'TP. Hồ Chí Minh',
    salaryText: '25 - 40 triệu',
    appliedAt: '2026-03-04 15:20',
    status: 'interview',
    cvType: 'profile',
    cvName: 'CV_Nguyen_Hoang_Minh_React_Native.pdf',
    coverLetter: 'Kính gửi Chị Vũ Thu Trang (HR Director) và ban lãnh đạo NextGen Tech, tôi đã có hơn 3 năm kinh nghiệm phát triển các sản phẩm di động React Native chất lượng cao và rất mong muốn được cống hiến cho NextGen.',
    notes: 'Ứng viên có kỹ năng React Native & TypeScript rất tốt. Đã lên lịch phỏng vấn chuyên môn vòng 1 qua Google Meet lúc 10:00 ngày 12/03/2026.',
    interviewDate: '2026-03-12 10:00',
    applicantId: 'user-cand-001',
    applicantName: 'Nguyễn Hoàng Minh',
    applicantEmail: 'hoangminh.dev@gmail.com',
    applicantPhone: '0988 765 432',
    applicantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80'
  },
  {
    id: 'app-nextgen-2',
    jobId: 'job-nextgen-3',
    jobTitle: 'Senior UI/UX Product Designer (Figma, Design System)',
    company: 'Công ty Cổ phần Công nghệ NextGen',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&auto=format&fit=crop&q=80',
    location: 'TP. Hồ Chí Minh',
    salaryText: '22 - 35 triệu',
    appliedAt: '2026-03-05 09:40',
    status: 'applied',
    cvType: 'profile',
    cvName: 'Portfolio_Le_Thi_Thu_Thao_UIUX.pdf',
    coverLetter: 'Kính chào phòng Tuyển dụng NextGen Tech, em có 3 năm thiết kế Design System cho sản phẩm B2B SaaS và mong muốn được tham gia kiến tạo trải nghiệm người dùng tuyệt hảo cho quý công ty.',
    notes: 'Hồ sơ mới nộp, Portfolio rất chỉn chu, thành thạo Figma Auto-layout & Design Tokens.',
    applicantId: 'user-cand-002',
    applicantName: 'Lê Thị Thu Thảo',
    applicantEmail: 'thuthao.le@gmail.com',
    applicantPhone: '0912 345 678',
    applicantAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&auto=format&fit=crop&q=80'
  },
  {
    id: 'app-nextgen-3',
    jobId: 'job-nextgen-2',
    jobTitle: 'Senior Backend Engineer (Golang, Node.js, Microservices)',
    company: 'Công ty Cổ phần Công nghệ NextGen',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&auto=format&fit=crop&q=80',
    location: 'TP. Hồ Chí Minh',
    salaryText: '35 - 50 triệu',
    appliedAt: '2026-03-05 14:10',
    status: 'viewed',
    cvType: 'profile',
    cvName: 'CV_Tran_Van_Duc_Golang_Microservices.pdf',
    coverLetter: 'Xin chào Quý Doanh nghiệp NextGen, tôi chuyên về hệ thống phân tán Golang và tối ưu database cho các ứng dụng high-load.',
    notes: 'Đã xem CV, kinh nghiệm Golang 4 năm tại các fintech lớn, dự kiến mời phỏng vấn vòng 2.',
    applicantId: 'user-cand-003',
    applicantName: 'Trần Văn Đức',
    applicantEmail: 'duc.tran95@gmail.com',
    applicantPhone: '0909 888 777',
    applicantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_RECRUITER_VIEWS: RecruiterView[] = [
  {
    id: 'view-1',
    companyName: 'VNG Corporation',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80',
    viewedAt: '2 giờ trước',
    jobTitleSearched: 'Tìm kiếm ứng viên "Senior Frontend Developer"',
    city: 'TP. Hồ Chí Minh'
  },
  {
    id: 'view-2',
    companyName: 'Shopee Việt Nam',
    companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&auto=format&fit=crop&q=80',
    viewedAt: 'Hôm qua',
    jobTitleSearched: 'Tìm kiếm ứng viên "React, TypeScript, 5 năm KN"',
    city: 'TP. Hồ Chí Minh'
  },
  {
    id: 'view-3',
    companyName: 'FPT Software',
    companyLogo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=128&auto=format&fit=crop&q=80',
    viewedAt: '3 ngày trước',
    jobTitleSearched: 'Tìm kiếm hồ sơ ứng viên khu vực Miền Nam',
    city: 'TP. Hồ Chí Minh'
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'recruiter',
    senderName: 'Ms. Lan Anh (HR VNG Corp)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&auto=format&fit=crop&q=80',
    text: 'Chào Minh, hồ sơ của bạn cho vị trí Senior Frontend tại VNG rất ấn tượng. Team mình muốn mời bạn tham gia buổi phỏng vấn kỹ thuật online vào sáng thứ Năm nhé!',
    timestamp: 'Hôm nay lúc 10:15',
    jobTitle: 'Senior Frontend Developer',
    company: 'VNG Corporation',
    candidateId: 'user-cand-001'
  },
  {
    id: 'msg-2',
    sender: 'candidate',
    senderName: 'Nguyễn Hoàng Minh',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
    text: 'Dạ chào chị Lan Anh, em đã nhận được thư mời và đã chuẩn bị sẵn sàng cho buổi phỏng vấn ạ. Em cảm ơn chị!',
    timestamp: 'Hôm nay lúc 10:20',
    jobTitle: 'Senior Frontend Developer',
    company: 'VNG Corporation',
    candidateId: 'user-cand-001'
  },
  {
    id: 'msg-3',
    sender: 'candidate',
    senderName: 'Nguyễn Hoàng Minh',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
    text: 'Chào Ban tuyển dụng Ascenda Loyalty Tech, tôi vừa gửi hồ sơ ứng tuyển vị trí Fullstack NodeJS / ReactJS Developer. Rất mong quý công ty xem xét hồ sơ.',
    timestamp: 'Hôm qua lúc 09:16',
    jobTitle: 'Fullstack NodeJS / ReactJS Developer (Remote 100%)',
    company: 'Ascenda Loyalty Tech',
    candidateId: 'user-cand-001'
  },
  {
    id: 'msg-4',
    sender: 'recruiter',
    senderName: 'HR Ascenda Loyalty Tech',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=128&auto=format&fit=crop&q=80',
    text: 'Chào Minh! Ban tuyển dụng Ascenda Loyalty Tech đã nhận được hồ sơ của bạn và đang tiến hành thẩm định sơ bộ. Chúng mình sẽ liên hệ lại với bạn khi có kết quả duyệt CV nhé.',
    timestamp: 'Hôm qua lúc 11:25',
    jobTitle: 'Fullstack NodeJS / ReactJS Developer (Remote 100%)',
    company: 'Ascenda Loyalty Tech',
    candidateId: 'user-cand-001'
  }
];

export const TEST_USER_IDS = [
  'user-admin-001',
  'user-cand-001',
  'user-cand-002',
  'user-cand-003',
  'user-recruiter-001'
];

export const isTestAccount = (userId?: string | null): boolean => {
  if (!userId) return false;
  return TEST_USER_IDS.includes(userId);
};

export const createCleanCandidateProfile = (user: AuthUser): CandidateProfile => {
  const isPhoneValid = Boolean(
    user.phone && 
    user.phone !== 'Chưa cập nhật' && 
    user.phone !== 'Chưa cập nhật SĐT' && 
    user.phone.replace(/[\s.-]/g, '').length >= 9
  );
  const cleanPhone = isPhoneValid ? user.phone : '';
  const initialName = user.fullName && user.fullName !== 'Ứng viên mới' ? user.fullName : (user.fullName || '');
  const initialAvatar = user.avatar && !user.avatar.includes('unsplash.com')
    ? user.avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(initialName || 'UV')}&background=0D8ABC&color=fff&size=256&bold=true`;

  return {
    id: user.id,
    fullName: initialName,
    title: '',
    email: user.email || '',
    phone: cleanPhone,
    birthday: '',
    gender: '',
    address: '',
    city: '',
    avatar: initialAvatar,
    bio: '',
    careerObjective: '',
    website: '',
    github: '',
    linkedin: '',
    experiences: [],
    educations: [],
    skills: [],
    certificates: [],
    projects: [],
    preferences: {
      desiredTitle: '',
      desiredLevel: '',
      desiredMinSalary: 0,
      desiredLocations: [],
      desiredJobTypes: [],
      desiredIndustries: []
    },
    isLookingForJob: true,
    allowRecruitersSearch: true,
    emailNotifications: true,
    profileStrength: 0,
    attachedCvName: undefined,
    attachedCvSize: undefined,
    attachedCvUpdatedAt: undefined
  };
};

export const EMPTY_GUEST_PROFILE: CandidateProfile = {
  id: 'guest',
  fullName: 'Khách',
  title: 'Chưa cập nhật',
  email: '',
  phone: '',
  birthday: '',
  gender: '',
  address: '',
  city: '',
  avatar: 'https://ui-avatars.com/api/?name=Guest&background=E2E8F0&color=475569&size=256&bold=true',
  bio: '',
  careerObjective: '',
  website: '',
  github: '',
  linkedin: '',
  experiences: [],
  educations: [],
  skills: [],
  certificates: [],
  projects: [],
  preferences: {
    desiredTitle: '',
    desiredLevel: '',
    desiredMinSalary: 0,
    desiredLocations: [],
    desiredJobTypes: [],
    desiredIndustries: []
  },
  isLookingForJob: false,
  allowRecruitersSearch: false,
  emailNotifications: false,
  profileStrength: 0,
  attachedCvName: undefined,
  attachedCvSize: undefined,
  attachedCvUpdatedAt: undefined
};
