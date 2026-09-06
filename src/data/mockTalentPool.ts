import { TalentCandidate } from '../types';

export const MOCK_TALENT_POOL: TalentCandidate[] = [
  {
    id: 'talent-1',
    fullName: 'Nguyễn Hoàng Minh',
    title: 'Senior Frontend Engineer / Web Architect',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
    city: 'TP. Hồ Chí Minh',
    experienceYears: '5 năm',
    desiredSalary: '35 - 45 triệu',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux / Zustand', 'Web Performance'],
    bio: 'Chuyên sâu xây dựng ứng dụng web quy mô lớn, tối ưu chỉ số Core Web Vitals, có kinh nghiệm lead frontend team thương mại điện tử hàng đầu.',
    education: 'Đại học Bách Khoa TP.HCM (Kỹ thuật phần mềm)',
    profileStrength: 94,
    isOpenForJob: true,
    contactEmail: 'hoangminh.dev@gmail.com'
  },
  {
    id: 'talent-2',
    fullName: 'Trần Phương Thảo',
    title: 'Senior UI/UX & Product Designer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&auto=format&fit=crop&q=80',
    city: 'Hà Nội',
    experienceYears: '4 năm',
    desiredSalary: '28 - 38 triệu',
    skills: ['Figma', 'Design System', 'User Research', 'Prototyping', 'Mobile App UX', 'Agile / Scrum'],
    bio: 'Đam mê tạo ra các trải nghiệm sản phẩm số mượt mà, trực quan. Từng thiết kế hệ thống SaaS cho hơn 50.000 người dùng doanh nghiệp B2B.',
    education: 'Đại học Mỹ Thuật Công Nghiệp Hà Nội',
    profileStrength: 90,
    isOpenForJob: true,
    contactEmail: 'thaotran.design@gmail.com'
  },
  {
    id: 'talent-3',
    fullName: 'Lê Quốc Hưng',
    title: 'Lead Backend Engineer (Node.js / Golang)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&auto=format&fit=crop&q=80',
    city: 'Đà Nẵng',
    experienceYears: '6 năm',
    desiredSalary: '40 - 55 triệu',
    skills: ['Node.js', 'Golang', 'PostgreSQL', 'Redis', 'Docker / K8s', 'Microservices', 'AWS'],
    bio: 'Chuyên gia kiến trúc hệ thống phân tán, xử lý tải cao (High Concurrency), tối ưu cơ sở dữ liệu và bảo mật API cho hệ thống Fintech.',
    education: 'Đại học Bách Khoa Đà Nẵng (CNTT)',
    profileStrength: 96,
    isOpenForJob: true,
    contactEmail: 'hung.le.tech@gmail.com'
  },
  {
    id: 'talent-4',
    fullName: 'Đặng Minh Châu',
    title: 'Senior Growth & Performance Marketing Manager',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=256&auto=format&fit=crop&q=80',
    city: 'TP. Hồ Chí Minh',
    experienceYears: '3.5 năm',
    desiredSalary: '25 - 35 triệu',
    skills: ['Google Ads', 'Facebook Ads', 'TikTok Ads', 'Data Analytics', 'SEO / SEM', 'CRM Hubspot'],
    bio: 'Kinh nghiệm quản lý ngân sách quảng cáo hơn 10 tỷ VNĐ/năm, tăng trưởng ROAS trung bình 3.8x cho các nhãn hàng tiêu dùng và thương mại điện tử.',
    education: 'Đại học Kinh Tế TP.HCM (Marketing)',
    profileStrength: 88,
    isOpenForJob: true,
    contactEmail: 'minhchau.marketing@gmail.com'
  },
  {
    id: 'talent-5',
    fullName: 'Phạm Hải Đăng',
    title: 'Mobile App Developer (Flutter & React Native)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&auto=format&fit=crop&q=80',
    city: 'Hà Nội',
    experienceYears: '3 năm',
    desiredSalary: '22 - 32 triệu',
    skills: ['Flutter', 'React Native', 'Dart', 'iOS / Swift', 'Android / Kotlin', 'Firebase'],
    bio: 'Đã phát hành hơn 8 ứng dụng di động trên App Store và Google Play với tổng lượt tải vượt hơn 300.000 lượt.',
    education: 'Đại học Công Nghệ - ĐHQG Hà Nội',
    profileStrength: 89,
    isOpenForJob: true,
    contactEmail: 'dang.pham.mobile@gmail.com'
  }
];
