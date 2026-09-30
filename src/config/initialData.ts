import {
  BrandingConfig,
  ChannelItem,
  ChannelVolumeData,
  Conversation,
  MetricCardData,
  PlatformNotificationSettings,
  PlatformSecuritySettings,
  Ticket,
  UserProfile
} from '../types';

export const initialBranding: BrandingConfig = {
  companyName: 'Sync',
  companyBadge: 'ID',
  tagline: 'AI powered omnichannel support',
  heroBadge: 'Sync ID Production Engine Live',
  heroTitle: 'Production Overview',
  heroDescription: 'Your omnichannel workspace is connected across WhatsApp, Telegram, Email, Web Chat, and Instagram.',
  primaryColor: 'indigo',
  fontFamily: 'Plus Jakarta Sans',
};

export const initialMetrics: MetricCardData[] = [
  {
    id: 'm-tickets',
    title: 'Active Open Tickets',
    value: '0',
    change: 'Live Queue',
    isPositive: true,
    period: 'real-time triage'
  },
  {
    id: 'm-messages',
    title: 'Omnichannel Inbound Messages',
    value: '0',
    change: 'Live Inflow',
    isPositive: true,
    period: 'across channels'
  },
  {
    id: 'm-gateways',
    title: 'Omnichannel Inbound Streams',
    value: '5 Active',
    change: '100% Online',
    isPositive: true,
    period: 'WhatsApp · Telegram · Email · Web · IG'
  }
];

export const initialChannelVolume: ChannelVolumeData[] = [
  {
    id: 'vol-whatsapp',
    name: 'WhatsApp Business',
    count: '0 msgs',
    percent: 0,
    iconName: 'Smartphone',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'vol-telegram',
    name: 'Telegram Bot API',
    count: '0 msgs',
    percent: 0,
    iconName: 'Send',
    color: 'from-sky-500 to-blue-600'
  },
  {
    id: 'vol-email',
    name: 'Support Email',
    count: '0 msgs',
    percent: 0,
    iconName: 'Mail',
    color: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'vol-webchat',
    name: 'Web Live Chat',
    count: '0 msgs',
    percent: 0,
    iconName: 'MessageSquare',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'vol-instagram',
    name: 'Instagram Direct',
    count: '0 msgs',
    percent: 0,
    iconName: 'Instagram',
    color: 'from-pink-500 to-rose-600'
  }
];

export const initialChannels: ChannelItem[] = [
  {
    id: 'ch-whatsapp',
    name: 'WhatsApp Support',
    type: 'WhatsApp',
    category: 'Messaging',
    status: 'Connected',
    unreadCount: 0,
    avgResponseTime: '-',
    satisfaction: 100,
    iconName: 'Smartphone',
    webhookUrl: 'https://api.syncid.io/v1/webhooks/whatsapp'
  },
  {
    id: 'ch-telegram',
    name: 'Telegram Bot',
    type: 'Telegram',
    category: 'Messaging',
    status: 'Connected',
    unreadCount: 0,
    avgResponseTime: '-',
    satisfaction: 100,
    iconName: 'Send',
    webhookUrl: 'https://api.syncid.io/v1/webhooks/telegram'
  },
  {
    id: 'ch-email',
    name: 'Support Email',
    type: 'Email',
    category: 'Email Gateway',
    status: 'Connected',
    unreadCount: 0,
    avgResponseTime: '-',
    satisfaction: 100,
    iconName: 'Mail',
    webhookUrl: 'https://inbox.syncid.io/incoming'
  },
  {
    id: 'ch-webchat',
    name: 'Website Widget',
    type: 'Web Chat',
    category: 'Web Chat',
    status: 'Connected',
    unreadCount: 0,
    avgResponseTime: '-',
    satisfaction: 100,
    iconName: 'MessageSquare',
    webhookUrl: 'https://embed.syncid.io/widget.js'
  },
  {
    id: 'ch-instagram',
    name: 'Instagram Direct',
    type: 'Instagram',
    category: 'Social',
    status: 'Connected',
    unreadCount: 0,
    avgResponseTime: '-',
    satisfaction: 100,
    iconName: 'Instagram',
    webhookUrl: 'https://graph.instagram.com/webhooks/syncid'
  }
];

export const initialTickets: Ticket[] = [];

export const initialConversations: Conversation[] = [];

export const initialUserProfile: UserProfile = {
  fullName: 'Sarah Jenkins',
  email: 'sarah.jenkins@syncid.io',
  role: 'Head of Support Operations',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
  timezone: 'UTC+05:30 (Asia/Kolkata)'
};

export const initialNotifications: PlatformNotificationSettings = {
  emailDigest: true,
  slackAlerts: true,
  autoAssign: true
};

export const initialSecurity: PlatformSecuritySettings = {
  stitchApiKey: 'stitch_live_9a8f23c7b10e42d881fa',
  webhookSigningSecret: 'whsec_99a81e37bc6041a998e100f'
};
