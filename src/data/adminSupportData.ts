import { AppNotification, AdminChatConversation } from '../types';

export const INITIAL_ADMIN_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'admin-notif-1',
    type: 'application_submitted',
    title: 'Hồ sơ ứng tuyển mới',
    senderName: 'Nguyễn Hoàng Minh',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
    content: 'Ứng viên Nguyễn Hoàng Minh vừa nộp CV ứng tuyển vị trí Senior Frontend Developer tại VNG Corporation.',
    targetName: 'VNG Corporation • Senior Frontend Developer',
    timestamp: '15 phút trước',
    isUnread: true,
    targetType: 'application',
    applicationId: 'app-1',
    jobId: 'job-1',
    companyName: 'VNG Corporation',
    candidateName: 'Nguyễn Hoàng Minh'
  },
  {
    id: 'admin-notif-2',
    type: 'job_posted',
    title: 'Tin tuyển dụng mới đăng tải',
    senderName: 'Công ty Cổ phần Công nghệ NextGen',
    senderAvatar: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&auto=format&fit=crop&q=80',
    content: 'Doanh nghiệp NextGen Tech vừa đăng tin tuyển dụng mới: "React Native & Mobile App Engineer" (Mức lương 25 - 40 triệu).',
    targetName: 'React Native & Mobile App Engineer',
    timestamp: '45 phút trước',
    isUnread: true,
    targetType: 'job',
    jobId: 'job-nextgen-1',
    companyName: 'Công ty Cổ phần Công nghệ NextGen'
  },
  {
    id: 'admin-notif-3',
    type: 'application_submitted',
    title: 'Hồ sơ ứng tuyển mới',
    senderName: 'Lê Thị Thu Thảo',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&auto=format&fit=crop&q=80',
    content: 'Ứng viên Lê Thị Thu Thảo vừa nộp CV ứng tuyển vị trí UI/UX Designer & Design System Lead tại Shopee Việt Nam.',
    targetName: 'Shopee Việt Nam • UI/UX Designer',
    timestamp: '1 giờ trước',
    isUnread: false,
    targetType: 'application',
    applicationId: 'app-nextgen-2',
    jobId: 'job-2',
    companyName: 'Shopee Việt Nam',
    candidateName: 'Lê Thị Thu Thảo'
  },
  {
    id: 'admin-notif-4',
    type: 'job_posted',
    title: 'Tin tuyển dụng mới đăng tải',
    senderName: 'Tập đoàn VinAI Research',
    senderAvatar: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=128&auto=format&fit=crop&q=80',
    content: 'Tập đoàn VinAI vừa đăng tin tuyển dụng chiến lược: "AI Research Scientist & LLM Engineer" (Mức lương thỏa thuận).',
    targetName: 'AI Research Scientist & LLM Engineer',
    timestamp: '2 giờ trước',
    isUnread: false,
    targetType: 'job',
    jobId: 'job-5',
    companyName: 'Tập đoàn VinAI Research'
  },
  {
    id: 'admin-notif-5',
    type: 'application_submitted',
    title: 'Hồ sơ ứng tuyển mới',
    senderName: 'Trần Văn Đức',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&auto=format&fit=crop&q=80',
    content: 'Ứng viên Trần Văn Đức vừa nộp hồ sơ ứng tuyển vị trí Senior Backend Engineer (Golang, Microservices).',
    targetName: 'Senior Backend Engineer (Golang)',
    timestamp: 'Hôm nay 09:30',
    isUnread: false,
    targetType: 'application',
    applicationId: 'app-nextgen-3',
    jobId: 'job-nextgen-2',
    companyName: 'Công ty Cổ phần Công nghệ NextGen',
    candidateName: 'Trần Văn Đức'
  },
  {
    id: 'admin-notif-6',
    type: 'job_posted',
    title: 'Tin tuyển dụng mới đăng tải',
    senderName: 'Ascenda Loyalty Tech',
    senderAvatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=128&auto=format&fit=crop&q=80',
    content: 'Ascenda Loyalty Tech đã cập nhật và đăng tải vị trí "Fullstack NodeJS / ReactJS Developer (Remote 100%)".',
    targetName: 'Fullstack NodeJS / ReactJS Developer',
    timestamp: 'Hôm qua 16:20',
    isUnread: false,
    targetType: 'job',
    jobId: 'job-7',
    companyName: 'Ascenda Loyalty Tech'
  }
];

export const INITIAL_CANDIDATE_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'cand-notif-1',
    type: 'interview_invitation',
    title: 'Thư mời phỏng vấn từ NextGen Tech',
    senderName: 'Vũ Thu Trang (HR Director)',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&auto=format&fit=crop&q=80',
    content: 'Chúc mừng bạn! NextGen Tech đã duyệt hồ sơ và trân trọng gửi thư mời phỏng vấn vị trí "React Native & Mobile App Engineer" vào lúc 10:00 ngày 12/03/2026 qua Google Meet.',
    targetName: 'NextGen Tech • React Native Engineer',
    timestamp: '10 phút trước',
    isUnread: true,
    targetType: 'application',
    applicationId: 'app-nextgen-1',
    jobId: 'job-nextgen-1',
    companyName: 'Công ty Cổ phần Công nghệ NextGen',
    interviewDate: '2026-03-12 10:00',
    notes: 'Phỏng vấn chuyên môn kỹ thuật vòng 1 qua Google Meet'
  },
  {
    id: 'cand-notif-2',
    type: 'recruiter_view',
    title: 'VNG Corporation vừa xem hồ sơ của bạn',
    senderName: 'VNG Corporation',
    senderAvatar: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80',
    content: 'Nhà tuyển dụng VNG Corporation đã xem hồ sơ của bạn khi tìm kiếm ứng viên "Senior Frontend Developer".',
    targetName: 'VNG Corporation • Senior Frontend Developer',
    timestamp: '2 giờ trước',
    isUnread: true,
    targetType: 'recruiter_view',
    targetId: 'view-1',
    jobId: 'job-1',
    companyName: 'VNG Corporation',
    location: 'TP. Hồ Chí Minh'
  },
  {
    id: 'cand-notif-3',
    type: 'recruiter_view',
    title: 'Shopee Việt Nam vừa xem hồ sơ của bạn',
    senderName: 'Shopee Việt Nam',
    senderAvatar: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&auto=format&fit=crop&q=80',
    content: 'Nhà tuyển dụng Shopee Việt Nam đã tìm kiếm và xem hồ sơ của bạn qua từ khóa "React, TypeScript, 5 năm KN".',
    targetName: 'Shopee Việt Nam • UI/UX & Frontend',
    timestamp: 'Hôm qua',
    isUnread: false,
    targetType: 'recruiter_view',
    targetId: 'view-2',
    jobId: 'job-2',
    companyName: 'Shopee Việt Nam',
    location: 'TP. Hồ Chí Minh'
  },
  {
    id: 'cand-notif-4',
    type: 'job_recommendation',
    title: 'Gợi ý việc làm phù hợp 95%',
    senderName: 'Hệ thống gợi ý Nextstep',
    senderAvatar: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=128&auto=format&fit=crop&q=80',
    content: 'Có việc làm mới: "Senior Frontend / Fullstack Engineer" tại Công ty Cổ phần Nextstep với mức lương 30 - 48 triệu rất phù hợp với kỹ năng của bạn.',
    targetName: 'Nextstep • Senior Frontend Engineer',
    timestamp: 'Hôm nay',
    isUnread: false,
    targetType: 'job',
    jobId: 'job-nextstep-1',
    companyName: 'Công ty Cổ phần Nextstep'
  }
];

export const INITIAL_RECRUITER_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'rec-notif-1',
    type: 'application_submitted',
    title: 'Hồ sơ ứng tuyển mới: React Native',
    senderName: 'Nguyễn Hoàng Minh',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
    content: 'Ứng viên Nguyễn Hoàng Minh vừa nộp CV ứng tuyển vị trí "React Native & Mobile App Engineer". Kinh nghiệm 4 năm, Tech Stack React Native & TypeScript.',
    targetName: 'React Native & Mobile App Engineer',
    timestamp: '25 phút trước',
    isUnread: true,
    targetType: 'application',
    applicationId: 'app-nextgen-1',
    jobId: 'job-nextgen-1',
    companyName: 'Công ty Cổ phần Công nghệ NextGen',
    candidateName: 'Nguyễn Hoàng Minh'
  },
  {
    id: 'rec-notif-2',
    type: 'application_submitted',
    title: 'Hồ sơ ứng tuyển mới: Senior UI/UX Designer',
    senderName: 'Lê Thị Thu Thảo',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&auto=format&fit=crop&q=80',
    content: 'Ứng viên Lê Thị Thu Thảo vừa gửi Portfolio & CV ứng tuyển vị trí "Senior UI/UX Product Designer". Thành thạo Figma Auto-layout & Design Tokens.',
    targetName: 'Senior UI/UX Product Designer',
    timestamp: '1 giờ trước',
    isUnread: false,
    targetType: 'application',
    applicationId: 'app-nextgen-2',
    jobId: 'job-nextgen-3',
    companyName: 'Công ty Cổ phần Công nghệ NextGen',
    candidateName: 'Lê Thị Thu Thảo'
  },
  {
    id: 'rec-notif-3',
    type: 'application_submitted',
    title: 'Hồ sơ ứng tuyển mới: Backend Engineer Golang',
    senderName: 'Trần Văn Đức',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&auto=format&fit=crop&q=80',
    content: 'Ứng viên Trần Văn Đức vừa nộp hồ sơ ứng tuyển vị trí "Senior Backend Engineer (Golang, Microservices)". Kinh nghiệm 4 năm hệ thống phân tán.',
    targetName: 'Senior Backend Engineer (Golang)',
    timestamp: 'Hôm nay 09:30',
    isUnread: false,
    targetType: 'application',
    applicationId: 'app-nextgen-3',
    jobId: 'job-nextgen-2',
    companyName: 'Công ty Cổ phần Công nghệ NextGen',
    candidateName: 'Trần Văn Đức'
  }
];

export const INITIAL_ADMIN_CONVERSATIONS: AdminChatConversation[] = [
  {
    id: 'conv-recruiter-1',
    partnerType: 'recruiter',
    partnerName: 'Vũ Thu Trang',
    partnerRole: 'Giám đốc Nhân sự (HR Director)',
    partnerCompany: 'Công ty Cổ phần NextGen Tech',
    partnerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&auto=format&fit=crop&q=80',
    topic: 'Thắc mắc quy trình gắn nhãn Tuyển Gấp & Xuất hóa đơn VAT',
    lastMessage: 'Dạ tuyệt vời quá, mình đã thấy tin nổi bật trên trang chủ rồi. Cảm ơn admin hỗ trợ rất nhiệt tình!',
    lastTimestamp: '10:30',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-adm-1',
        sender: 'partner',
        senderName: 'Vũ Thu Trang (NextGen Tech)',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&auto=format&fit=crop&q=80',
        text: 'Chào Ban Quản Trị Nextstep, công ty chúng tôi vừa đăng bài tuyển dụng vị trí React Native nhưng muốn đổi sang trạng thái Tuyển Gấp (Urgent) và xuất hóa đơn VAT điện tử thì quy trình thế nào ạ?',
        timestamp: '10:15'
      },
      {
        id: 'msg-adm-2',
        sender: 'admin',
        senderName: 'Ban Quản Trị Nextstep',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
        text: 'Chào chị Trang, Ban Quản Trị đã hỗ trợ kiểm duyệt nhanh và kích hoạt huy hiệu Tuyển Gấp (Urgent) trên trang chủ cho bài đăng của NextGen Tech rồi nhé! Về hóa đơn VAT, kế toán Nextstep sẽ gửi file điện tử qua email công ty trong vòng 2 giờ ạ.',
        timestamp: '10:25'
      },
      {
        id: 'msg-adm-3',
        sender: 'partner',
        senderName: 'Vũ Thu Trang (NextGen Tech)',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&auto=format&fit=crop&q=80',
        text: 'Dạ tuyệt vời quá, mình đã thấy tin nổi bật trên trang chủ rồi. Cảm ơn admin hỗ trợ rất nhiệt tình!',
        timestamp: '10:30'
      }
    ]
  },
  {
    id: 'conv-recruiter-2',
    partnerType: 'recruiter',
    partnerName: 'Ms. Lan Anh',
    partnerRole: 'Senior Tech Recruiter',
    partnerCompany: 'Tập đoàn VNG Corporation',
    partnerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&auto=format&fit=crop&q=80',
    topic: 'Hỏi cách tải hàng loạt CV ứng viên và gia hạn thời gian tuyển dụng',
    lastMessage: 'Chị vào mục Quản trị đơn ứng tuyển -> chọn nút Xuất dữ liệu / Tải CV ứng viên là tải được toàn bộ file zip nhé ạ.',
    lastTimestamp: '09:45',
    unreadCount: 1,
    messages: [
      {
        id: 'msg-adm-4',
        sender: 'partner',
        senderName: 'Ms. Lan Anh (VNG Corp)',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&auto=format&fit=crop&q=80',
        text: 'Chào Admin, cho mình hỏi bên mình muốn tải hàng loạt 20 CV ứng viên nộp trong tuần này dưới dạng file zip để gửi cho Tech Lead thì thao tác ở đâu trên cổng quản trị vậy ạ?',
        timestamp: '09:35'
      },
      {
        id: 'msg-adm-5',
        sender: 'admin',
        senderName: 'Ban Quản Trị Nextstep',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
        text: 'Chào chị Lan Anh, chị vào mục Quản trị đơn ứng tuyển -> chọn nút Xuất dữ liệu / Tải CV ứng viên là hệ thống tự gom toàn bộ hồ sơ thành 1 file zip nhé ạ. Ngoài ra chị có thể đổi trạng thái Mời phỏng vấn trực tiếp trên bảng quản trị.',
        timestamp: '09:45'
      }
    ]
  },
  {
    id: 'conv-candidate-1',
    partnerType: 'candidate',
    partnerName: 'Lê Thị Thu Thảo',
    partnerRole: 'Ứng viên UI/UX Designer',
    partnerCompany: 'Ứng viên tìm việc',
    partnerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&auto=format&fit=crop&q=80',
    topic: 'Hỏi về cách xác thực số điện thoại OTP và gắn tích xanh uy tín',
    lastMessage: 'Dạ em làm được rồi, có tích xanh uy tín rồi ạ. Em cảm ơn admin nhiều!',
    lastTimestamp: 'Hôm qua 15:25',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-adm-6',
        sender: 'partner',
        senderName: 'Lê Thị Thu Thảo',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&auto=format&fit=crop&q=80',
        text: 'Dạ em chào ban quản trị Nextstep, em muốn hỏi làm sao để tài khoản của em có huy hiệu Hồ sơ đã xác thực bằng số điện thoại để nhà tuyển dụng tin tưởng hơn ạ?',
        timestamp: 'Hôm qua 15:10'
      },
      {
        id: 'msg-adm-7',
        sender: 'admin',
        senderName: 'Ban Quản Trị Nextstep',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
        text: 'Chào bạn Thảo, bạn vào mục Quản lý hồ sơ -> Xác thực tài khoản qua mã OTP số điện thoại (hệ thống gửi SMS miễn phí trong 60s). Sau khi xác nhận thành công, hồ sơ của bạn sẽ được ưu tiên hiển thị cho các nhà tuyển dụng hàng đầu nhé!',
        timestamp: 'Hôm qua 15:20'
      },
      {
        id: 'msg-adm-8',
        sender: 'partner',
        senderName: 'Lê Thị Thu Thảo',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&auto=format&fit=crop&q=80',
        text: 'Dạ em làm được rồi, có tích xanh uy tín rồi ạ. Em cảm ơn admin nhiều!',
        timestamp: 'Hôm qua 15:25'
      }
    ]
  },
  {
    id: 'conv-candidate-2',
    partnerType: 'candidate',
    partnerName: 'Trần Văn Đức',
    partnerRole: 'Ứng viên Product Manager',
    partnerCompany: 'Ứng viên tìm việc',
    partnerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&auto=format&fit=crop&q=80',
    topic: 'Hỏi về quy trình và thời gian phản hồi kết quả sau khi nộp CV',
    lastMessage: 'Thông thường các doanh nghiệp trên Nextstep sẽ phản hồi trong 24-48 giờ làm việc nhé bạn Đức!',
    lastTimestamp: 'Hôm qua 11:15',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-adm-9',
        sender: 'partner',
        senderName: 'Trần Văn Đức',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&auto=format&fit=crop&q=80',
        text: 'Admin ơi cho mình hỏi mình vừa nộp CV vào vị trí Product Manager thì theo quy định của Nextstep thì bao lâu bên tuyển dụng sẽ phản hồi kết quả cho ứng viên ạ?',
        timestamp: 'Hôm qua 11:00'
      },
      {
        id: 'msg-adm-10',
        sender: 'admin',
        senderName: 'Ban Quản Trị Nextstep',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
        text: 'Chào bạn Đức, các đối tác tuyển dụng đã xác minh trên Nextstep cam kết phản hồi trong vòng 24 - 48 giờ làm việc. Bạn có thể vào mục "Đã ứng tuyển" trên web để theo dõi trạng thái real-time từ Đã nộp -> Đã xem -> Mời phỏng vấn nhé!',
        timestamp: 'Hôm qua 11:15'
      }
    ]
  }
];
