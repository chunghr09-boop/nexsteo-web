import { Application, ChatMessage, AdminChatConversation, AuthUser, CandidateProfile } from '../types';

export interface ChatConversationItem {
  id: string;
  type: 'company' | 'recruiter_applicant' | 'admin_support';
  title: string;
  subtitle?: string;
  avatar: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  badge?: string;
  badgeColor?: 'purple' | 'emerald' | 'blue' | 'amber' | 'cyan' | 'slate';
  companyName?: string;
  applicantId?: string;
  applicantName?: string;
  jobTitle?: string;
  adminConversationId?: string;
  status?: string;
}

export const getUnifiedConversations = (params: {
  currentUser: AuthUser | null;
  applications?: Application[];
  candidateMessages?: ChatMessage[];
  adminConversations?: AdminChatConversation[];
  profile: CandidateProfile;
}): ChatConversationItem[] => {
  const { 
    currentUser, 
    applications = [], 
    candidateMessages = [], 
    adminConversations = [], 
    profile 
  } = params;

  // 1. VAI TRÒ ADMIN: Hiển thị toàn bộ các đoạn chat hỗ trợ giải đáp
  if (currentUser?.role === 'admin') {
    return (adminConversations || []).map(c => ({
      id: c.id,
      type: 'admin_support',
      title: `${c.partnerName} (${c.partnerCompany || (c.partnerType === 'recruiter' ? 'Doanh nghiệp' : 'Ứng viên')})`,
      subtitle: c.topic,
      avatar: c.partnerAvatar,
      lastMessage: c.lastMessage || (c.messages && c.messages.length > 0 ? c.messages[c.messages.length - 1].text : 'Bắt đầu cuộc trò chuyện...'),
      lastTimestamp: c.lastTimestamp || 'Gần đây',
      unreadCount: c.unreadCount || 0,
      badge: c.partnerType === 'recruiter' ? 'Doanh nghiệp' : 'Ứng viên',
      badgeColor: c.partnerType === 'recruiter' ? 'cyan' : 'emerald',
      adminConversationId: c.id
    }));
  }

  // 2. VAI TRÒ NHÀ TUYỂN DỤNG:
  // - Cuộc hội thoại với Ban Quản Trị Nextstep
  // - Các đoạn chat với ứng viên đã nộp đơn vào công ty
  if (currentUser?.role === 'recruiter') {
    const list: ChatConversationItem[] = [];

    // Đoạn chat với Ban Quản Trị Nextstep
    const adminRecConv = (adminConversations || []).find(c => c && c.partnerType === 'recruiter') || (adminConversations || [])[0];
    if (adminRecConv) {
      list.push({
        id: adminRecConv.id || 'conv-recruiter-1',
        type: 'admin_support',
        title: 'Ban Quản Trị Nextstep (Hotline 24/7)',
        subtitle: 'Kênh hỗ trợ & tư vấn tài khoản tuyển dụng',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
        lastMessage: adminRecConv.lastMessage || 'Nextstep luôn sẵn sàng hỗ trợ nhà tuyển dụng kết nối ứng viên tiềm năng.',
        lastTimestamp: adminRecConv.lastTimestamp || '10:30',
        unreadCount: adminRecConv.unreadCount || 0,
        badge: 'Admin Helpdesk',
        badgeColor: 'purple',
        adminConversationId: adminRecConv.id || 'conv-recruiter-1'
      });
    }

    // Các ứng viên đã nộp đơn vào doanh nghiệp
    const companyName = currentUser.companyName || 'Công ty Cổ phần Công nghệ NextGen';
    const targetCompLower = (companyName || '').toLowerCase().trim();

    const companyApps = (applications || []).filter(a => {
      if (!a) return false;
      const aComp = (a.company || '').toLowerCase().trim();
      return (
        (aComp.length > 0 && aComp === targetCompLower) ||
        aComp.includes('nextgen') ||
        (a.jobTitle && a.jobTitle.toLowerCase().includes('nextgen'))
      );
    });

    // Group by applicant
    const applicantMap = new Map<string, Application>();
    companyApps.forEach(app => {
      const key = app.applicantName || app.applicantId || app.id;
      if (!applicantMap.has(key)) {
        applicantMap.set(key, app);
      }
    });

    applicantMap.forEach((app) => {
      const statusBadge = 
        app.status === 'interview' ? 'Đã mời PV' :
        app.status === 'offered' ? 'Đã trúng tuyển' :
        app.status === 'viewed' ? 'Đã xem CV' : 'Mới nộp CV';

      const statusColor: 'emerald' | 'purple' | 'cyan' | 'amber' = 
        app.status === 'interview' ? 'purple' :
        app.status === 'offered' ? 'emerald' :
        app.status === 'viewed' ? 'cyan' : 'amber';

      // Lấy tin nhắn trao đổi mới nhất với ứng viên này (nếu có)
      const candId = app.applicantId || app.id;
      const candName = (app.applicantName || '').toLowerCase().trim();
      const applicantMsgs = (candidateMessages || []).filter(m => 
        (m.candidateId && m.candidateId === candId) ||
        (m.senderName && m.senderName.toLowerCase().trim() === candName)
      );
      const latestMsg = applicantMsgs.length > 0 ? applicantMsgs[applicantMsgs.length - 1] : null;

      list.push({
        id: `applicant-chat-${app.id}`,
        type: 'recruiter_applicant',
        title: `${app.applicantName || 'Ứng viên tiềm năng'}`,
        subtitle: `Ứng tuyển: ${app.jobTitle || 'Vị trí công nghệ'}`,
        avatar: app.applicantAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
        lastMessage: latestMsg ? latestMsg.text : (app.notes || `Hồ sơ nộp lúc ${app.appliedAt} cho vị trí ${app.jobTitle}`),
        lastTimestamp: latestMsg ? latestMsg.timestamp : (app.appliedAt ? app.appliedAt.split(' ')[1] || 'Hôm nay' : 'Vừa xong'),
        unreadCount: app.status === 'applied' ? 1 : 0,
        badge: statusBadge,
        badgeColor: statusColor,
        applicantId: app.applicantId,
        applicantName: app.applicantName,
        jobTitle: app.jobTitle,
        companyName: app.company,
        status: app.status
      });
    });

    return list;
  }

  // 3. VAI TRÒ ỨNG VIÊN (CANDIDATE):
  // - Danh sách các công ty ứng viên đã nộp đơn hoặc có tin nhắn trao đổi
  // - Ban Quản Trị Nextstep
  const list: ChatConversationItem[] = [];

  // Thu thập danh sách các công ty từ applications & messages
  const companyMap = new Map<string, {
    company: string;
    companyLogo: string;
    jobTitle?: string;
    status?: string;
    lastMsg?: ChatMessage;
    appDate?: string;
  }>();

  // Đưa các ứng tuyển của ứng viên vào map
  (applications || []).forEach(app => {
    if (!app) return;
    const compName = app.company || 'Doanh Nghiệp Tuyển Dụng';
    if (!companyMap.has(compName)) {
      companyMap.set(compName, {
        company: compName,
        companyLogo: app.companyLogo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80',
        jobTitle: app.jobTitle,
        status: app.status,
        appDate: app.appliedAt
      });
    }
  });

  // Đưa các tin nhắn của ứng viên vào map
  (candidateMessages || []).forEach(msg => {
    if (!msg) return;
    const compName = msg.company || 'VNG Corporation';
    const existing = companyMap.get(compName);
    if (existing) {
      if (!existing.lastMsg || (msg.id > existing.lastMsg.id)) {
        existing.lastMsg = msg;
      }
      if (msg.jobTitle && !existing.jobTitle) {
        existing.jobTitle = msg.jobTitle;
      }
    } else {
      companyMap.set(compName, {
        company: compName,
        companyLogo: msg.avatar || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80',
        jobTitle: msg.jobTitle,
        lastMsg: msg
      });
    }
  });

  // Chuyển đổi các công ty thành ChatConversationItem
  companyMap.forEach((info, compName) => {
    const compNameLower = (compName || '').toLowerCase().trim();
    // Lấy tin nhắn cuối cùng với công ty này
    const compMsgs = (candidateMessages || []).filter(m => 
      m && m.company && (m.company || '').toLowerCase().trim() === compNameLower
    );
    const lastMsg = compMsgs.length > 0 ? compMsgs[compMsgs.length - 1] : info.lastMsg;

    const unreadMsgs = compMsgs.filter(m => m.sender === 'recruiter');

    let statusBadge = 'Đang thẩm định';
    let badgeColor: 'purple' | 'cyan' | 'emerald' | 'amber' = 'amber';

    if (info.status === 'interview') {
      statusBadge = 'Đã mời phỏng vấn';
      badgeColor = 'purple';
    } else if (info.status === 'offered') {
      statusBadge = 'Đã trúng tuyển';
      badgeColor = 'emerald';
    } else if (info.status === 'viewed') {
      statusBadge = 'Đã xem hồ sơ';
      badgeColor = 'cyan';
    }

    const lastText = lastMsg 
      ? lastMsg.text 
      : `Hồ sơ ứng tuyển vị trí "${info.jobTitle || 'đã nộp'}" đã gửi thành công tới phòng nhân sự.`;

    const lastTime = lastMsg 
      ? lastMsg.timestamp 
      : (info.appDate ? info.appDate.split(' ')[0] : 'Vừa xong');

    list.push({
      id: `conv-comp-${compName}`,
      type: 'company',
      title: `Tuyển dụng ${compName}`,
      subtitle: info.jobTitle ? `Vị trí: ${info.jobTitle}` : 'Nhà tuyển dụng xác thực',
      avatar: info.companyLogo || 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80',
      lastMessage: lastText,
      lastTimestamp: lastTime,
      unreadCount: unreadMsgs.length,
      badge: statusBadge,
      badgeColor: badgeColor,
      companyName: compName,
      jobTitle: info.jobTitle,
      status: info.status
    });
  });

  // Ban Quản Trị Nextstep (Luôn sẵn sàng hỗ trợ ứng viên)
  const candidateAdminConv = (adminConversations || []).find(c => 
    c && c.partnerType === 'candidate' && 
    ((c.partnerName && profile?.fullName && c.partnerName.includes(profile.fullName)) || (c.partnerName && (c.partnerName.includes('Thảo') || c.partnerName.includes('Đức'))))
  ) || (adminConversations || []).find(c => c && c.partnerType === 'candidate');

  list.push({
    id: 'conv-admin-support-cand',
    type: 'admin_support',
    title: 'Ban Quản Trị Nextstep',
    subtitle: 'Hỗ trợ Ứng viên 24/7 & Hướng dẫn CV',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
    lastMessage: candidateAdminConv 
      ? candidateAdminConv.lastMessage 
      : 'Chào bạn! Nextstep luôn sẵn sàng hỗ trợ giải đáp mọi thắc mắc về tuyển dụng và tối ưu CV.',
    lastTimestamp: candidateAdminConv ? candidateAdminConv.lastTimestamp : 'Hôm nay',
    unreadCount: 0,
    badge: 'Hỗ trợ 24/7',
    badgeColor: 'purple',
    adminConversationId: candidateAdminConv?.id || 'conv-candidate-1',
    companyName: 'Ban Quản Trị Nextstep'
  });

  return list;
};
