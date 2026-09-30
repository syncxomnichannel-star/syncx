export type NavTabId = 'dashboard' | 'omnichannel' | 'tickets' | 'settings';

export type TicketStatus = 'Open' | 'In Progress' | 'Pending' | 'Resolved';
export type TicketPriority = 'Urgent' | 'High' | 'Medium' | 'Low';
export type ChannelType = 'WhatsApp' | 'Telegram' | 'Email' | 'Web Chat' | 'Instagram';

/**
 * Customer profile representation
 */
export interface Customer {
  id: string;
  uniqueCustomerId?: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  company?: string;
  status?: 'active' | 'vip' | 'lead' | 'inactive' | 'Active' | string;
  channel?: ChannelType;
  createdAt?: string;
  isEmailVerified?: boolean;
}

/**
 * Agent / Team member representation
 */
export interface Agent {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  assignedTicketsCount?: number;
}

/**
 * Channel connection configuration & stats
 */
export interface ChannelItem {
  id: string;
  name: string;
  type: ChannelType;
  category?: string;
  status: 'Connected' | 'Disconnected' | 'Pending';
  unreadCount: number;
  avgResponseTime: string;
  satisfaction: number;
  iconName: string;
  webhookUrl?: string;
  apiEndpoint?: string;
}

export type Channel = ChannelItem;

/**
 * Individual chat message in a conversation
 */
export interface ChatMessage {
  id: string;
  conversationId?: string;
  ticketId?: string;
  sender: string;
  avatar?: string;
  text: string;
  timestamp: string;
  isAgent: boolean;
  channel?: ChannelType;
  status?: 'sent' | 'delivered' | 'read';
}

export type Message = ChatMessage;

/**
 * Omnichannel conversation thread
 */
export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  customerEmail: string;
  customerPhone?: string;
  company?: string;
  channel: ChannelType;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  status: 'active' | 'resolved' | 'waiting';
  messages: ChatMessage[];
  ticketId?: string;
}

/**
 * Support Ticket
 */
export interface Ticket {
  id: string;
  customerId?: string;
  customerName: string;
  customerAvatar: string;
  customerEmail?: string;
  customerPhone?: string;
  subject: string;
  description?: string;
  channel: ChannelType;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo: string;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
  slaStatus?: 'normal' | 'warning' | 'breached';
  tags?: string[];
  // AI and sync metadata fields
  aiConfidence?: number;
  aiSuggestedAction?: string;
  difficulty?: 'Low' | 'Medium' | 'High' | 'Normal' | 'Complex' | string;
  aiAction?: string;
  syncId?: string;
}

/**
 * Activity log event in the team audit feed
 */
export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'ticket' | 'message' | 'channel' | 'system' | 'ai';
  actor?: string;
  channel?: ChannelType;
}

export type Activity = ActivityItem;

/**
 * AI Suggestion & Copilot response
 */
export interface AISuggestion {
  id: string;
  text: string;
  confidence: number;
  sentiment?: 'positive' | 'neutral' | 'urgent' | 'frustrated';
  summary?: string;
  keyPoints?: string[];
  suggestedAction?: string;
  suggestedPriority?: TicketPriority;
}

export type AIResponse = AISuggestion;

/**
 * Dashboard Metric KPI
 */
export interface MetricCardData {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  period: string;
  trend?: number[];
}

/**
 * Channel volume breakdown
 */
export interface ChannelVolumeData {
  id: string;
  name: string;
  type?: ChannelType;
  count: string;
  messagesCount?: number;
  percent: number;
  iconName: string;
  color: string;
}

export interface UserProfile {
  fullName: string;
  email: string;
  role: string;
  avatar: string;
  timezone: string;
}

export interface PlatformNotificationSettings {
  emailDigest: boolean;
  slackAlerts: boolean;
  autoAssign: boolean;
}

export interface PlatformSecuritySettings {
  stitchApiKey: string;
  webhookSigningSecret: string;
}

export interface BrandingConfig {
  companyName: string;
  companyBadge: string;
  tagline: string;
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  primaryColor: 'indigo' | 'blue' | 'purple' | 'emerald' | 'rose' | 'amber';
  fontFamily: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info';
}
