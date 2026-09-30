import {
  ActivityItem,
  Agent,
  AISuggestion,
  BrandingConfig,
  ChannelItem,
  ChannelVolumeData,
  Conversation,
  Customer,
  MetricCardData,
  PlatformNotificationSettings,
  PlatformSecuritySettings,
  Ticket,
  UserProfile
} from '../types';

/**
 * =========================================================================
 * DEMO SEED DATA — SYNC X ENTERPRISE SUPPORT PLATFORM
 * =========================================================================
 * This file contains realistic mock data representing a live production
 * omnichannel support operations center.
 *
 * NOTE FOR BACKEND/SUPABASE TEAMMATES:
 * When connecting Supabase #1 (Database) and Supabase #2 (AI Agent),
 * you will swap out the data-access calls in `src/services/` with real
 * Supabase client calls. The components and UI interfaces will consume
 * the exact same TypeScript data contracts.
 * =========================================================================
 */

export const demoAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@syncx.io',
    role: 'Head of Support Operations',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    status: 'online',
    assignedTicketsCount: 4
  },
  {
    id: 'agent-2',
    name: 'David Chen',
    email: 'david.chen@syncx.io',
    role: 'Senior Escalations Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    status: 'online',
    assignedTicketsCount: 3
  },
  {
    id: 'agent-3',
    name: 'Alex Rivera',
    email: 'alex.rivera@syncx.io',
    role: 'Customer Success Specialist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    status: 'busy',
    assignedTicketsCount: 2
  },
  {
    id: 'agent-4',
    name: 'Priya Patel',
    email: 'priya.patel@syncx.io',
    role: 'Omnichannel Tier 2 Lead',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120',
    status: 'online',
    assignedTicketsCount: 2
  }
];

export const demoUserProfile: UserProfile = {
  fullName: 'Sarah Jenkins',
  email: 'sarah.jenkins@syncx.io',
  role: 'Head of Support Operations',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
  timezone: 'UTC+05:30 (Asia/Kolkata)'
};

export const demoCustomers: Customer[] = [
  {
    id: 'cust-1',
    uniqueCustomerId: 'CUST-8021',
    name: 'Marcus Vance',
    email: 'm.vance@acmecloud.com',
    phone: '+1 (555) 349-8201',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
    company: 'Acme Cloud Infrastructure',
    status: 'vip',
    channel: 'WhatsApp',
    createdAt: '2026-09-15',
    isEmailVerified: true
  },
  {
    id: 'cust-2',
    uniqueCustomerId: 'CUST-8022',
    name: 'Elena Rostova',
    email: 'e.rostova@finedge.global',
    phone: '+44 20 7946 0912',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120',
    company: 'FinEdge Global Banking',
    status: 'vip',
    channel: 'Telegram',
    createdAt: '2026-09-18',
    isEmailVerified: true
  },
  {
    id: 'cust-3',
    uniqueCustomerId: 'CUST-8023',
    name: 'Sophia Lin',
    email: 'sophia.lin@novaretail.eu',
    phone: '+49 30 901820',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    company: 'NovaRetail Europe',
    status: 'active',
    channel: 'Email',
    createdAt: '2026-09-20',
    isEmailVerified: true
  },
  {
    id: 'cust-4',
    uniqueCustomerId: 'CUST-8024',
    name: 'David Miller',
    email: 'dmiller@datashield.io',
    phone: '+1 (555) 891-2309',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120',
    company: 'DataShield Cybersecurity',
    status: 'active',
    channel: 'Web Chat',
    createdAt: '2026-09-22',
    isEmailVerified: true
  },
  {
    id: 'cust-5',
    uniqueCustomerId: 'CUST-8025',
    name: 'Liam O’Connor',
    email: 'liam@horizonstudio.design',
    phone: '+353 1 496 0123',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120',
    company: 'Horizon Design Studio',
    status: 'lead',
    channel: 'Instagram',
    createdAt: '2026-09-24',
    isEmailVerified: false
  },
  {
    id: 'cust-6',
    uniqueCustomerId: 'CUST-8026',
    name: 'Camille Dubois',
    email: 'camille@luxemode.fr',
    phone: '+33 1 42 68 55 00',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120',
    company: 'LuxeMode Paris',
    status: 'vip',
    channel: 'WhatsApp',
    createdAt: '2026-09-26',
    isEmailVerified: true
  }
];

export const demoChannels: ChannelItem[] = [
  {
    id: 'ch-whatsapp',
    name: 'WhatsApp Business API',
    type: 'WhatsApp',
    category: 'Direct Messaging Gateway',
    status: 'Connected',
    unreadCount: 3,
    avgResponseTime: '1m 15s',
    satisfaction: 99,
    iconName: 'Smartphone',
    webhookUrl: 'https://api.syncx.io/v1/webhooks/whatsapp-prod',
    apiEndpoint: 'https://graph.facebook.com/v18.0/syncx-biz-acct'
  },
  {
    id: 'ch-telegram',
    name: 'Telegram Enterprise Bot',
    type: 'Telegram',
    category: 'Bot Gateway',
    status: 'Connected',
    unreadCount: 2,
    avgResponseTime: '45s',
    satisfaction: 98,
    iconName: 'Send',
    webhookUrl: 'https://api.syncx.io/v1/webhooks/telegram-bot',
    apiEndpoint: 'https://api.telegram.org/bot-syncx-live'
  },
  {
    id: 'ch-email',
    name: 'Support Mail Gateway (SMTP)',
    type: 'Email',
    category: 'Enterprise Inbound Routing',
    status: 'Connected',
    unreadCount: 1,
    avgResponseTime: '3m 20s',
    satisfaction: 96,
    iconName: 'Mail',
    webhookUrl: 'https://api.syncx.io/v1/webhooks/inbound-smtp',
    apiEndpoint: 'smtp.syncx.io:587'
  },
  {
    id: 'ch-webchat',
    name: 'Website Live Chat Widget',
    type: 'Web Chat',
    category: 'Real-time WebSocket Widget',
    status: 'Connected',
    unreadCount: 0,
    avgResponseTime: '30s',
    satisfaction: 100,
    iconName: 'Globe',
    webhookUrl: 'https://api.syncx.io/v1/webhooks/widget-events',
    apiEndpoint: 'wss://realtime.syncx.io/client-hub'
  },
  {
    id: 'ch-instagram',
    name: 'Instagram Direct API',
    type: 'Instagram',
    category: 'Meta Social Suite',
    status: 'Connected',
    unreadCount: 1,
    avgResponseTime: '2m 10s',
    satisfaction: 97,
    iconName: 'Instagram',
    webhookUrl: 'https://api.syncx.io/v1/webhooks/meta-instagram',
    apiEndpoint: 'https://graph.instagram.com/v12.0/direct'
  }
];

export const demoConversations: Conversation[] = [
  {
    id: 'conv-1',
    customerId: 'cust-1',
    customerName: 'Marcus Vance',
    customerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
    customerEmail: 'm.vance@acmecloud.com',
    customerPhone: '+1 (555) 349-8201',
    company: 'Acme Cloud Infrastructure',
    channel: 'WhatsApp',
    unreadCount: 2,
    lastMessage: 'Understood, that fits our SLA. What is the max payload size supported per webhook?',
    lastMessageTime: '3m ago',
    status: 'active',
    ticketId: 'TCK-1042',
    messages: [
      {
        id: 'msg-101',
        conversationId: 'conv-1',
        sender: 'Marcus Vance',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
        text: "Hi Sync X team! We're stress-testing webhook retry latency on our staging cluster. Can you confirm if failed payloads retry with exponential backoff?",
        timestamp: '10:48 AM',
        isAgent: false,
        channel: 'WhatsApp',
        status: 'read'
      },
      {
        id: 'msg-102',
        conversationId: 'conv-1',
        sender: 'Sarah Jenkins',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
        text: 'Hello Marcus! Yes, our webhook dispatch engine utilizes exponential backoff starting at 2s up to 15m with jitter, over a full 24-hour delivery window.',
        timestamp: '10:50 AM',
        isAgent: true,
        channel: 'WhatsApp',
        status: 'read'
      },
      {
        id: 'msg-103',
        conversationId: 'conv-1',
        sender: 'Marcus Vance',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
        text: 'Understood, that fits our SLA. What is the max payload size supported per webhook?',
        timestamp: '10:55 AM',
        isAgent: false,
        channel: 'WhatsApp',
        status: 'delivered'
      }
    ]
  },
  {
    id: 'conv-2',
    customerId: 'cust-2',
    customerName: 'Elena Rostova',
    customerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120',
    customerEmail: 'e.rostova@finedge.global',
    customerPhone: '+44 20 7946 0912',
    company: 'FinEdge Global Banking',
    channel: 'Telegram',
    unreadCount: 1,
    lastMessage: 'Please expedite this, we have active financial settlement transactions queued.',
    lastMessageTime: '12m ago',
    status: 'active',
    ticketId: 'TCK-1038',
    messages: [
      {
        id: 'msg-201',
        conversationId: 'conv-2',
        sender: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120',
        text: "Urgent: We're seeing intermittent 429 RateLimit errors on the Telegram gateway during peak volume window.",
        timestamp: '10:32 AM',
        isAgent: false,
        channel: 'Telegram',
        status: 'read'
      },
      {
        id: 'msg-202',
        conversationId: 'conv-2',
        sender: 'David Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
        text: 'Checking the rate limit bucket right now, Elena. Your organization currently has an allocation of 2,000 req/min; expanding burst headroom.',
        timestamp: '10:35 AM',
        isAgent: true,
        channel: 'Telegram',
        status: 'read'
      },
      {
        id: 'msg-203',
        conversationId: 'conv-2',
        sender: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120',
        text: 'Please expedite this, we have active financial settlement transactions queued.',
        timestamp: '10:46 AM',
        isAgent: false,
        channel: 'Telegram',
        status: 'delivered'
      }
    ]
  },
  {
    id: 'conv-3',
    customerId: 'cust-3',
    customerName: 'Sophia Lin',
    customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    customerEmail: 'sophia.lin@novaretail.eu',
    customerPhone: '+49 30 901820',
    company: 'NovaRetail Europe',
    channel: 'Email',
    unreadCount: 1,
    lastMessage: 'We are expanding our retail customer support to 12 new European regions next quarter. Does Sync X support custom multilingual auto-routing?',
    lastMessageTime: '34m ago',
    status: 'active',
    ticketId: 'TCK-1025',
    messages: [
      {
        id: 'msg-301',
        conversationId: 'conv-3',
        sender: 'Sophia Lin',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
        text: 'We are expanding our retail customer support to 12 new European regions next quarter. Does Sync X support custom multilingual auto-routing?',
        timestamp: '10:14 AM',
        isAgent: false,
        channel: 'Email',
        status: 'read'
      }
    ]
  },
  {
    id: 'conv-4',
    customerId: 'cust-4',
    customerName: 'David Miller',
    customerAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120',
    customerEmail: 'dmiller@datashield.io',
    customerPhone: '+1 (555) 891-2309',
    company: 'DataShield Cybersecurity',
    channel: 'Web Chat',
    unreadCount: 0,
    lastMessage: 'That answers our compliance criteria. We will proceed with the vendor onboarding.',
    lastMessageTime: '1h ago',
    status: 'resolved',
    ticketId: 'TCK-1019',
    messages: [
      {
        id: 'msg-401',
        conversationId: 'conv-4',
        sender: 'David Miller',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120',
        text: 'Does the enterprise tier provide SOC2 Type II audit logs with immutable cloud storage export?',
        timestamp: '9:30 AM',
        isAgent: false,
        channel: 'Web Chat',
        status: 'read'
      },
      {
        id: 'msg-402',
        conversationId: 'conv-4',
        sender: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
        text: 'Yes David, daily immutable logs are hashed and can be streamed directly to your GCS or S3 buckets with custom KMS keys.',
        timestamp: '9:35 AM',
        isAgent: true,
        channel: 'Web Chat',
        status: 'read'
      },
      {
        id: 'msg-403',
        conversationId: 'conv-4',
        sender: 'David Miller',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120',
        text: 'That answers our compliance criteria. We will proceed with the vendor onboarding.',
        timestamp: '9:40 AM',
        isAgent: false,
        channel: 'Web Chat',
        status: 'read'
      }
    ]
  },
  {
    id: 'conv-5',
    customerId: 'cust-5',
    customerName: 'Liam O’Connor',
    customerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120',
    customerEmail: 'liam@horizonstudio.design',
    customerPhone: '+353 1 496 0123',
    company: 'Horizon Design Studio',
    channel: 'Instagram',
    unreadCount: 1,
    lastMessage: 'Can we connect multiple Instagram creator handles under one unified dashboard?',
    lastMessageTime: '2h ago',
    status: 'active',
    ticketId: 'TCK-1007',
    messages: [
      {
        id: 'msg-501',
        conversationId: 'conv-5',
        sender: 'Liam O’Connor',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120',
        text: 'Hey there! Loved the new multi-channel inbox demo video. Can we connect multiple Instagram creator handles under one unified dashboard?',
        timestamp: '8:45 AM',
        isAgent: false,
        channel: 'Instagram',
        status: 'read'
      }
    ]
  }
];

export const demoTickets: Ticket[] = [];

export const demoActivities: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'New WhatsApp Message Received',
    description: 'Marcus Vance (Acme Cloud) inquired about max payload thresholds.',
    time: '3m ago',
    type: 'message',
    actor: 'Marcus Vance',
    channel: 'WhatsApp'
  },
  {
    id: 'act-2',
    title: 'Ticket #TCK-1038 Priority Escalated',
    description: 'David Chen elevated ticket priority to Urgent due to rate limit bottleneck.',
    time: '14m ago',
    type: 'ticket',
    actor: 'David Chen',
    channel: 'Telegram'
  },
  {
    id: 'act-3',
    title: 'AI Smart Reply Generated',
    description: 'Sync X AI proposed backoff latency response with 94% confidence match.',
    time: '28m ago',
    type: 'ai',
    actor: 'Sync X AI Agent'
  },
  {
    id: 'act-4',
    title: 'Telegram Enterprise Gateway Healthy',
    description: 'Automated health probe verified latency at 45ms across all pods.',
    time: '45m ago',
    type: 'channel',
    actor: 'System Watchdog',
    channel: 'Telegram'
  },
  {
    id: 'act-5',
    title: 'Ticket #TCK-1007 Marked Resolved',
    description: 'Sarah Jenkins resolved multi-brand Instagram routing ticket.',
    time: '1h ago',
    type: 'ticket',
    actor: 'Sarah Jenkins',
    channel: 'Instagram'
  },
  {
    id: 'act-6',
    title: 'Daily SLA Audit Log Exported',
    description: 'Compliance archive generated and signed for 142 customer tickets.',
    time: '2h ago',
    type: 'system',
    actor: 'Audit Daemon'
  }
];

export const demoAISuggestions: Record<string, AISuggestion> = {
  'conv-1': {
    id: 'sug-1',
    text: 'Hi Marcus, the maximum webhook payload size supported on the Enterprise plan is 5 MB per individual dispatch event. Payloads exceeding this limit can either be truncated or streamed as a presigned Cloud Storage download URL. Let me know if you would like me to enable payload streaming for Acme Cloud!',
    confidence: 0.96,
    sentiment: 'neutral',
    summary: 'Customer is inquiring about maximum supported webhook payload sizes.',
    keyPoints: [
      'Standard Enterprise payload cap: 5 MB',
      'Presigned GCS/S3 streaming available for larger events',
      'Fits within standard webhook SLA guidelines'
    ],
    suggestedAction: 'Send technical payload specification and offer streaming toggle.',
    suggestedPriority: 'High'
  },
  'conv-2': {
    id: 'sug-2',
    text: 'Elena, I have temporarily increased FinEdge Global’s burst capacity to 5,000 req/min on the Telegram gateway so your settlement queue can clear immediately. Our engineering team is also adjusting your permanent allocation. Please retry the queued batch now.',
    confidence: 0.98,
    sentiment: 'urgent',
    summary: 'Urgent 429 rate limit errors blocking financial transaction queue on Telegram.',
    keyPoints: [
      'Burst increased to 5,000 req/min',
      'Settlement queue unblocked',
      'Permanent allocation being processed'
    ],
    suggestedAction: 'Confirm burst elevation and request queue retry.',
    suggestedPriority: 'Urgent'
  },
  'conv-3': {
    id: 'sug-3',
    text: 'Hello Sophia! Yes, Sync X includes intelligent ISO language detection on inbound emails. You can configure custom routing rules under Settings > Channels > Email Gateway to map languages (e.g. DE, FR, IT, ES) directly to designated agent pools with dedicated fallback queues. Would you like me to share a 2-minute setup guide?',
    confidence: 0.93,
    sentiment: 'positive',
    summary: 'NovaRetail expanding to 12 EU regions and needs multilingual auto-routing.',
    keyPoints: [
      'Native ISO language detection supported',
      'Configurable per-region agent pools',
      'Automated fallback queues for unassigned languages'
    ],
    suggestedAction: 'Offer automated routing documentation and regional configuration review.',
    suggestedPriority: 'Medium'
  },
  'conv-4': {
    id: 'sug-4',
    text: 'Hi David, all Enterprise audit logs are immutable, hashed with SHA-256, and adhere to SOC2 Type II requirements. We provide direct continuous export to your GCS bucket or AWS S3 bucket encrypted with customer-managed keys (CMEK).',
    confidence: 0.97,
    sentiment: 'positive',
    summary: 'DataShield compliance criteria inquiry regarding SOC2 immutable log export.',
    keyPoints: [
      'Immutable SHA-256 event hashing',
      'Continuous automated export to GCS / S3',
      'CMEK customer-managed encryption supported'
    ],
    suggestedAction: 'Provide SOC2 compliance package and KMS configuration guide.',
    suggestedPriority: 'High'
  },
  'conv-5': {
    id: 'sug-5',
    text: 'Hey Liam! Yes, Sync X allows connecting unlimited Instagram Professional and Creator accounts into the same unified inbox. You can tag conversations per handle and use team permissions to restrict access to specific brands.',
    confidence: 0.91,
    sentiment: 'positive',
    summary: 'Horizon Studio inquiring about multi-account Instagram handle aggregation.',
    keyPoints: [
      'Unlimited Instagram handles supported on Enterprise',
      'Role-based access control per brand handle',
      'Unified inbox aggregation with channel tagging'
    ],
    suggestedAction: 'Provide Meta account linkage instructions.',
    suggestedPriority: 'Low'
  }
};

export const demoMetrics: MetricCardData[] = [
  {
    id: 'metric-tickets',
    title: 'Total Open Tickets',
    value: '0',
    change: '0.0%',
    isPositive: true,
    period: 'live backlog',
    trend: [0, 0, 0, 0, 0]
  },
  {
    id: 'metric-frt',
    title: 'Avg. First Response Time',
    value: '1m 24s',
    change: '-18.2%',
    isPositive: true,
    period: 'realtime metrics',
    trend: [120, 110, 95, 88, 84]
  },
  {
    id: 'metric-messages',
    title: 'Omnichannel Messages',
    value: '1,428',
    change: '+24.1%',
    isPositive: true,
    period: 'across 5 channels',
    trend: [980, 1120, 1260, 1340, 1428]
  },
  {
    id: 'metric-csat',
    title: 'Customer Satisfaction (CSAT)',
    value: '98.4%',
    change: '+1.2%',
    isPositive: true,
    period: 'production baseline',
    trend: [96.5, 97.0, 97.8, 98.1, 98.4]
  }
];

export const demoChannelVolume: ChannelVolumeData[] = [
  {
    id: 'vol-whatsapp',
    name: 'WhatsApp Business',
    type: 'WhatsApp',
    count: '542 msgs',
    messagesCount: 542,
    percent: 38,
    iconName: 'Smartphone',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'vol-email',
    name: 'Support Email Gateway',
    type: 'Email',
    count: '385 msgs',
    messagesCount: 385,
    percent: 27,
    iconName: 'Mail',
    color: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'vol-webchat',
    name: 'Web Live Chat',
    type: 'Web Chat',
    count: '271 msgs',
    messagesCount: 271,
    percent: 19,
    iconName: 'Globe',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'vol-telegram',
    name: 'Telegram Bot API',
    type: 'Telegram',
    count: '157 msgs',
    messagesCount: 157,
    percent: 11,
    iconName: 'Send',
    color: 'from-sky-500 to-blue-600'
  },
  {
    id: 'vol-instagram',
    name: 'Instagram Direct',
    type: 'Instagram',
    count: '73 msgs',
    messagesCount: 73,
    percent: 5,
    iconName: 'Instagram',
    color: 'from-pink-500 to-rose-600'
  }
];

export const demoBranding: BrandingConfig = {
  companyName: 'Sync',
  companyBadge: 'X',
  tagline: 'Omnichannel Support Platform',
  heroBadge: 'Sync X Production Engine Live',
  heroTitle: 'Production Overview',
  heroDescription: 'Enterprise omnichannel operations hub connected across WhatsApp, Telegram, Email, Web Chat, and Instagram.',
  primaryColor: 'indigo',
  fontFamily: 'Plus Jakarta Sans'
};

export const demoNotifications: PlatformNotificationSettings = {
  emailDigest: true,
  slackAlerts: true,
  autoAssign: true
};

export const demoSecurity: PlatformSecuritySettings = {
  stitchApiKey: 'syncx_live_pk_8f92a10b4c8e7d62',
  webhookSigningSecret: 'whsec_99d1e2f3a4b5c6e7f8'
};
