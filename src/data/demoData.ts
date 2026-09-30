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
    assignedTicketsCount: 0
  },
  {
    id: 'agent-2',
    name: 'David Chen',
    email: 'david.chen@syncx.io',
    role: 'Senior Escalations Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    status: 'online',
    assignedTicketsCount: 0
  },
  {
    id: 'agent-3',
    name: 'Alex Rivera',
    email: 'alex.rivera@syncx.io',
    role: 'Customer Success Specialist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    status: 'busy',
    assignedTicketsCount: 0
  },
  {
    id: 'agent-4',
    name: 'Priya Patel',
    email: 'priya.patel@syncx.io',
    role: 'Omnichannel Tier 2 Lead',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120',
    status: 'online',
    assignedTicketsCount: 0
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
    unreadCount: 0,
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
    unreadCount: 0,
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
    unreadCount: 0,
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
    unreadCount: 0,
    avgResponseTime: '2m 10s',
    satisfaction: 97,
    iconName: 'Instagram',
    webhookUrl: 'https://api.syncx.io/v1/webhooks/meta-instagram',
    apiEndpoint: 'https://graph.instagram.com/v12.0/direct'
  }
];

export const demoConversations: Conversation[] = [];

export const demoTickets: Ticket[] = [];

export const demoActivities: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'WhatsApp Business Gateway Connected',
    description: 'Webhook endpoint verified with Meta Graph API v18.0.',
    time: '5m ago',
    type: 'channel',
    actor: 'System Watchdog',
    channel: 'WhatsApp'
  },
  {
    id: 'act-2',
    title: 'Telegram Enterprise Gateway Healthy',
    description: 'Automated health probe verified latency at 42ms across all worker pods.',
    time: '18m ago',
    type: 'channel',
    actor: 'System Watchdog',
    channel: 'Telegram'
  },
  {
    id: 'act-3',
    title: 'AI Smart Routing Model Ready',
    description: 'Sync X AI inference engine initialized and standing by for inbound inquiries.',
    time: '35m ago',
    type: 'ai',
    actor: 'Sync X AI Engine'
  },
  {
    id: 'act-4',
    title: 'Email Inbound Gateway Active',
    description: 'IMAP & SMTP mail listener running on mail.syncx.internal with TLS 1.3.',
    time: '1h ago',
    type: 'system',
    actor: 'Mail Dispatcher',
    channel: 'Email'
  },
  {
    id: 'act-5',
    title: 'Daily System Diagnostics Clean',
    description: 'All 5 omnichannel connectors operational with 99.98% uptime.',
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
    id: 'metric-resolved',
    title: 'Total Resolved Tickets',
    value: '0',
    change: '+0.0%',
    isPositive: true,
    period: 'resolved queue',
    trend: [0, 0, 0, 0, 0]
  },
  {
    id: 'metric-messages',
    title: 'Omnichannel Messages',
    value: '0',
    change: '0.0%',
    isPositive: true,
    period: 'live intake',
    trend: [0, 0, 0, 0, 0]
  },
  {
    id: 'metric-csat',
    title: 'Customer Satisfaction (CSAT)',
    value: '100%',
    change: '+0.0%',
    isPositive: true,
    period: 'quality baseline',
    trend: [100, 100, 100, 100, 100]
  }
];

export const demoChannelVolume: ChannelVolumeData[] = [
  {
    id: 'vol-whatsapp',
    name: 'WhatsApp Business',
    type: 'WhatsApp',
    count: '0 msgs',
    messagesCount: 0,
    percent: 0,
    iconName: 'Smartphone',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'vol-email',
    name: 'Support Email Gateway',
    type: 'Email',
    count: '0 msgs',
    messagesCount: 0,
    percent: 0,
    iconName: 'Mail',
    color: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'vol-webchat',
    name: 'Web Live Chat',
    type: 'Web Chat',
    count: '0 msgs',
    messagesCount: 0,
    percent: 0,
    iconName: 'Globe',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'vol-telegram',
    name: 'Telegram Bot API',
    type: 'Telegram',
    count: '0 msgs',
    messagesCount: 0,
    percent: 0,
    iconName: 'Send',
    color: 'from-sky-500 to-blue-600'
  },
  {
    id: 'vol-instagram',
    name: 'Instagram Direct',
    type: 'Instagram',
    count: '0 msgs',
    messagesCount: 0,
    percent: 0,
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
