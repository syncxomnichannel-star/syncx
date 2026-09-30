import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  demoAgents,
  demoBranding,
  demoChannelVolume,
  demoChannels,
  demoConversations,
  demoMetrics,
  demoNotifications,
  demoSecurity,
  demoTickets,
  demoUserProfile
} from '../data/demoData';
import * as services from '../services';
import {
  ActivityItem,
  Agent,
  AISuggestion,
  BrandingConfig,
  ChannelItem,
  ChannelType,
  ChannelVolumeData,
  ChatMessage,
  Conversation,
  MetricCardData,
  PlatformNotificationSettings,
  PlatformSecuritySettings,
  Ticket,
  TicketStatus,
  ToastMessage,
  UserProfile
} from '../types';

interface CustomizationContextType {
  // Mode & Editing
  editMode: boolean;
  setEditMode: (val: boolean) => void;
  toggleEditMode: () => void;

  // Branding & Theme
  branding: BrandingConfig;
  updateBranding: (updates: Partial<BrandingConfig>) => void;
  themeClasses: {
    bg: string;
    text: string;
    border: string;
    hoverBg: string;
    gradient: string;
    lightBg: string;
    ring: string;
  };

  // Text Overrides (inline editor support)
  textOverrides: Record<string, string>;
  getText: (key: string, defaultText: string) => string;
  updateText: (key: string, value: string) => void;

  // Time Range Filter for Dashboard
  timeRange: 'today' | '7d' | '30d';
  setTimeRange: (range: 'today' | '7d' | '30d') => void;

  // Metrics & Stats
  metrics: MetricCardData[];
  channelVolume: ChannelVolumeData[];

  // Channels
  channels: ChannelItem[];
  updateChannel: (id: string, updates: Partial<ChannelItem>) => Promise<void>;

  // Tickets
  tickets: Ticket[];
  isTicketsLoading: boolean;
  createTicket: (ticketInput: Omit<Ticket, 'id' | 'createdAt'>) => Promise<Ticket>;
  updateTicketStatus: (id: string, status: TicketStatus) => Promise<void>;
  updateTicket: (id: string, updates: Partial<Ticket>) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;

  // Omnichannel Conversations
  conversations: Conversation[];
  activeConversationId: string | null;
  activeConversation: Conversation | null;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (conversationId: string, text: string) => Promise<ChatMessage>;
  markAsRead: (conversationId: string) => Promise<void>;

  // Real-time Simulation
  simulateIncomingMessage: (channel?: ChannelType, customText?: string) => Promise<void>;

  // AI Copilot Integration
  generateAIReply: (conversationId: string, lastCustomerMessage: string, customerName?: string) => Promise<AISuggestion>;

  // Team & User Profile
  agents: Agent[];
  currentUser: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;

  // Activity Feed
  activities: ActivityItem[];
  addActivity: (activity: Omit<ActivityItem, 'id' | 'time'>) => Promise<void>;

  // Settings
  notifications: PlatformNotificationSettings;
  updateNotifications: (updates: Partial<PlatformNotificationSettings>) => void;
  security: PlatformSecuritySettings;
  updateSecurity: (updates: Partial<PlatformSecuritySettings>) => void;

  // Toast System
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;

  // Report Export
  exportReport: (format?: 'json' | 'csv') => void;
}

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

const THEME_CLASSES: Record<BrandingConfig['primaryColor'], CustomizationContextType['themeClasses']> = {
  indigo: {
    bg: 'bg-indigo-600',
    text: 'text-indigo-600',
    border: 'border-indigo-600',
    hoverBg: 'hover:bg-indigo-700',
    gradient: 'from-indigo-600 to-indigo-800',
    lightBg: 'bg-indigo-50',
    ring: 'focus:ring-indigo-500'
  },
  blue: {
    bg: 'bg-blue-600',
    text: 'text-blue-600',
    border: 'border-blue-600',
    hoverBg: 'hover:bg-blue-700',
    gradient: 'from-blue-600 to-blue-800',
    lightBg: 'bg-blue-50',
    ring: 'focus:ring-blue-500'
  },
  purple: {
    bg: 'bg-purple-600',
    text: 'text-purple-600',
    border: 'border-purple-600',
    hoverBg: 'hover:bg-purple-700',
    gradient: 'from-purple-600 to-purple-800',
    lightBg: 'bg-purple-50',
    ring: 'focus:ring-purple-500'
  },
  emerald: {
    bg: 'bg-emerald-600',
    text: 'text-emerald-600',
    border: 'border-emerald-600',
    hoverBg: 'hover:bg-emerald-700',
    gradient: 'from-emerald-600 to-emerald-800',
    lightBg: 'bg-emerald-50',
    ring: 'focus:ring-emerald-500'
  },
  rose: {
    bg: 'bg-rose-600',
    text: 'text-rose-600',
    border: 'border-rose-600',
    hoverBg: 'hover:bg-rose-700',
    gradient: 'from-rose-600 to-rose-800',
    lightBg: 'bg-rose-50',
    ring: 'focus:ring-rose-500'
  },
  amber: {
    bg: 'bg-amber-600',
    text: 'text-amber-600',
    border: 'border-amber-600',
    hoverBg: 'hover:bg-amber-700',
    gradient: 'from-amber-600 to-amber-800',
    lightBg: 'bg-amber-50',
    ring: 'focus:ring-amber-500'
  }
};

export const CustomizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Visual Mode
  const [editMode, setEditMode] = useState<boolean>(false);
  const toggleEditMode = useCallback(() => setEditMode(prev => !prev), []);

  // Branding & Configuration
  const [branding, setBranding] = useState<BrandingConfig>(demoBranding);
  const [textOverrides, setTextOverrides] = useState<Record<string, string>>({});
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d'>('7d');

  // Core Data States
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isTicketsLoading, setIsTicketsLoading] = useState<boolean>(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [channels, setChannels] = useState<ChannelItem[]>(demoChannels);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [agents, setAgents] = useState<Agent[]>(demoAgents);
  const [currentUser, setCurrentUser] = useState<UserProfile>(demoUserProfile);
  const [metrics, setMetrics] = useState<MetricCardData[]>(demoMetrics);
  const [channelVolume, setChannelVolume] = useState<ChannelVolumeData[]>(demoChannelVolume);
  const [notifications, setNotifications] = useState<PlatformNotificationSettings>(demoNotifications);
  const [security, setSecurity] = useState<PlatformSecuritySettings>(demoSecurity);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((title: string, description?: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, title, description, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Initialize data on mount from service layer
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setIsTicketsLoading(true);
        const [loadedTickets, loadedConversations, loadedActivities, loadedChannels, loadedAgents, loadedUser] =
          await Promise.all([
            services.getTickets(),
            services.getConversations(),
            services.getActivities(),
            services.getChannels(),
            services.getAgents(),
            services.getCurrentUser()
          ]);

        if (isMounted) {
          setTickets(loadedTickets);
          setConversations(loadedConversations);
          if (loadedConversations.length > 0) {
            setActiveConversationId(loadedConversations[0].id);
          }
          setActivities(loadedActivities);
          setChannels(loadedChannels);
          setAgents(loadedAgents);
          setCurrentUser(loadedUser);
        }
      } catch (err) {
        console.error('Failed to load initial demo data:', err);
      } finally {
        if (isMounted) setIsTicketsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Recalculate metrics when tickets, conversations, or timeRange changes
  useEffect(() => {
    const openCount = tickets.filter(t => t.status !== 'Resolved').length;
    const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;
    const totalCount = tickets.length;
    const csatPercent = totalCount > 0 ? (98.2 + (resolvedCount * 0.1)).toFixed(1) : '100.0';
    const totalMessages = conversations.reduce((acc, c) => acc + (c.messages ? c.messages.length : 0), 0);

    setMetrics(prev =>
      prev.map(m => {
        if (m.id === 'metric-tickets') {
          return {
            ...m,
            value: `${openCount}`,
            period: timeRange === 'today' ? 'today’s backlog' : `${timeRange} active queue`
          };
        }
        if (m.id === 'metric-csat') {
          return {
            ...m,
            value: `${Math.min(100, parseFloat(csatPercent))}%`,
            period: 'customer feedback index'
          };
        }
        if (m.id === 'metric-frt') {
          return {
            ...m,
            value: totalCount === 0 ? '0s' : timeRange === 'today' ? '54s' : timeRange === '7d' ? '1m 24s' : '1m 48s',
            period: `${timeRange} average SLA`
          };
        }
        if (m.id === 'metric-messages') {
          return {
            ...m,
            value: totalMessages.toLocaleString(),
            period: 'live intake'
          };
        }
        return m;
      })
    );

    // Dynamic Channel Volume
    setChannelVolume(prev =>
      prev.map(chan => {
        const chanConvs = conversations.filter(c => c.channel.toLowerCase() === chan.type.toLowerCase());
        const count = chanConvs.reduce((acc, c) => acc + (c.messages ? c.messages.length : 0), 0);
        const percent = totalMessages > 0 ? Math.round((count / totalMessages) * 100) : 0;
        return {
          ...chan,
          count: `${count} msgs`,
          messagesCount: count,
          percent
        };
      })
    );
  }, [tickets, conversations, timeRange]);

  // Active conversation helper
  const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

  // --- SERVICE ACTIONS ---

  const createTicket = async (ticketInput: Omit<Ticket, 'id' | 'createdAt'>): Promise<Ticket> => {
    const newTicket = await services.createTicket(ticketInput);
    setTickets(prev => [newTicket, ...prev]);

    // Link newly created real ticket into omnichannel conversation inbox
    try {
      const newConv = await services.createConversationForTicket({
        id: newTicket.id,
        customerName: newTicket.customerName,
        customerEmail: newTicket.customerEmail,
        customerPhone: newTicket.customerPhone,
        channel: newTicket.channel,
        subject: newTicket.subject,
        description: newTicket.description
      });
      setConversations(prev => [newConv, ...prev.filter(c => c.id !== newConv.id)]);
      setActiveConversationId(newConv.id);
    } catch (e) {
      console.error('Failed to link ticket to conversation:', e);
    }

    // Log Activity
    const act = await services.logActivity({
      title: `New Ticket Created: #${newTicket.id}`,
      description: `${newTicket.subject} (${newTicket.channel}) assigned to ${newTicket.assignedTo}.`,
      type: 'ticket',
      actor: currentUser.fullName,
      channel: newTicket.channel
    });
    setActivities(prev => [act, ...prev]);

    showToast(
      'Ticket Created',
      `Ticket #${newTicket.id} added to the queue for ${newTicket.customerName}.`,
      'success'
    );
    return newTicket;
  };

  const updateTicketStatus = async (id: string, status: TicketStatus): Promise<void> => {
    const updated = await services.updateTicketStatus(id, status);
    setTickets(prev => prev.map(t => (t.id === id ? updated : t)));

    const act = await services.logActivity({
      title: `Ticket #${id} Status Changed`,
      description: `Status updated to "${status}" by ${currentUser.fullName}.`,
      type: 'ticket',
      actor: currentUser.fullName,
      channel: updated.channel
    });
    setActivities(prev => [act, ...prev]);

    showToast('Status Updated', `Ticket #${id} is now ${status}.`, 'success');
  };

  const updateTicket = async (id: string, updates: Partial<Ticket>): Promise<void> => {
    const updated = await services.updateTicket(id, updates);
    setTickets(prev => prev.map(t => (t.id === id ? updated : t)));
    showToast('Ticket Updated', `Ticket #${id} details updated.`, 'info');
  };

  const deleteTicket = async (id: string): Promise<void> => {
    await services.deleteTicket(id);
    setTickets(prev => prev.filter(t => t.id !== id));
    setConversations(prev => prev.filter(c => c.ticketId !== id));
    showToast('Ticket Removed', `Ticket #${id} was deleted from the view.`, 'info');
  };

  const sendMessage = async (conversationId: string, text: string): Promise<ChatMessage> => {
    const msg = await services.sendMessage(conversationId, text, currentUser.fullName, true);

    setConversations(prev => {
      const idx = prev.findIndex(c => c.id === conversationId);
      if (idx === -1) return prev;
      const updatedConv: Conversation = {
        ...prev[idx],
        lastMessage: text,
        lastMessageTime: 'Just now',
        messages: [...prev[idx].messages, msg]
      };
      const copy = [...prev];
      copy.splice(idx, 1);
      return [updatedConv, ...copy];
    });

    // Update channel volume count
    setChannelVolume(prev =>
      prev.map(v => {
        if (v.type === msg.channel) {
          const newCount = v.messagesCount + 1;
          return { ...v, messagesCount: newCount, count: `${newCount} msgs` };
        }
        return v;
      })
    );

    return msg;
  };

  const markAsRead = async (conversationId: string): Promise<void> => {
    await services.markConversationAsRead(conversationId);
    setConversations(prev =>
      prev.map(c => (c.id === conversationId ? { ...c, unreadCount: 0 } : c))
    );
  };

  /**
   * Real-time Simulation function for hackathon presentations!
   */
  const simulateIncomingMessage = async (channel?: ChannelType, customText?: string): Promise<void> => {
    const result = await services.simulateIncomingMessage(channel, customText);
    const { conversation: updatedConv, message } = result;

    setConversations(prev => {
      const filtered = prev.filter(c => c.id !== updatedConv.id);
      return [updatedConv, ...filtered];
    });

    // Increment channel unread badge
    setChannels(prev =>
      prev.map(c => {
        if (c.type === updatedConv.channel) {
          return { ...c, unreadCount: c.unreadCount + 1 };
        }
        return c;
      })
    );

    // Update channel volume stats
    setChannelVolume(prev =>
      prev.map(v => {
        if (v.type === updatedConv.channel) {
          const nextCount = v.messagesCount + 1;
          return { ...v, messagesCount: nextCount, count: `${nextCount} msgs` };
        }
        return v;
      })
    );

    // Increment Omnichannel Messages KPI
    setMetrics(prev =>
      prev.map(m => {
        if (m.id === 'metric-messages') {
          const rawNum = parseInt(m.value.replace(/,/g, ''), 10) || 1428;
          return { ...m, value: (rawNum + 1).toLocaleString() };
        }
        return m;
      })
    );

    // Log Activity
    const act = await services.logActivity({
      title: `Inbound ${updatedConv.channel} Message`,
      description: `${updatedConv.customerName} (${updatedConv.company || 'Customer'}): "${message.text}"`,
      type: 'message',
      actor: updatedConv.customerName,
      channel: updatedConv.channel
    });
    setActivities(prev => [act, ...prev]);

    // Show prominent demo toast
    showToast(
      `New ${updatedConv.channel} Message`,
      `${updatedConv.customerName}: "${message.text.slice(0, 65)}..."`,
      'info'
    );
  };

  const generateAIReply = async (
    conversationId: string,
    lastCustomerMessage: string,
    customerName?: string
  ): Promise<AISuggestion> => {
    return services.generateAIReply(conversationId, lastCustomerMessage, customerName);
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    const updated = await services.updateUserProfile(updates);
    setCurrentUser(updated);
    showToast('Profile Saved', 'User information and preferences updated.', 'success');
  };

  const updateChannel = async (id: string, updates: Partial<ChannelItem>): Promise<void> => {
    const updated = await services.updateChannel(id, updates);
    setChannels(prev => prev.map(c => (c.id === id ? updated : c)));
    showToast('Channel Saved', `${updated.name} configuration updated.`, 'success');
  };

  const addActivity = async (activityInput: Omit<ActivityItem, 'id' | 'time'>): Promise<void> => {
    const act = await services.logActivity(activityInput);
    setActivities(prev => [act, ...prev]);
  };

  const updateNotifications = (updates: Partial<PlatformNotificationSettings>) => {
    setNotifications(prev => ({ ...prev, ...updates }));
    showToast('Notification Preferences', 'Alert configurations updated.', 'success');
  };

  const updateSecurity = (updates: Partial<PlatformSecuritySettings>) => {
    setSecurity(prev => ({ ...prev, ...updates }));
    showToast('Security Settings', 'Keys and secrets updated.', 'success');
  };

  const updateBranding = (updates: Partial<BrandingConfig>) => {
    setBranding(prev => ({ ...prev, ...updates }));
    showToast('Theme Updated', 'Portal branding updated.', 'info');
  };

  const getText = (key: string, defaultText: string) => textOverrides[key] || defaultText;
  const updateText = (key: string, value: string) => {
    setTextOverrides(prev => ({ ...prev, [key]: value }));
  };

  const exportReport = (format: 'json' | 'csv' = 'json') => {
    const reportData = {
      platform: branding.companyName + ' ' + branding.companyBadge,
      exportedAt: new Date().toISOString(),
      metrics,
      openTicketsCount: tickets.filter(t => t.status !== 'Resolved').length,
      tickets,
      channelVolume
    };

    let blob: Blob;
    let fileName = `syncx-report-${new Date().toISOString().split('T')[0]}`;

    if (format === 'csv') {
      const headers = ['ID', 'Customer', 'Subject', 'Channel', 'Status', 'Priority', 'AssignedTo', 'CreatedAt'];
      const rows = tickets.map(t => [
        t.id,
        `"${t.customerName}"`,
        `"${t.subject.replace(/"/g, '""')}"`,
        t.channel,
        t.status,
        t.priority,
        `"${t.assignedTo}"`,
        t.createdAt
      ]);
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      fileName += '.csv';
    } else {
      blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      fileName += '.json';
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Report Exported', `Generated and downloaded ${fileName}.`, 'success');
  };

  return (
    <CustomizationContext.Provider
      value={{
        editMode,
        setEditMode,
        toggleEditMode,
        branding,
        updateBranding,
        themeClasses: THEME_CLASSES[branding.primaryColor] || THEME_CLASSES.indigo,
        textOverrides,
        getText,
        updateText,
        timeRange,
        setTimeRange,
        metrics,
        channelVolume,
        channels,
        updateChannel,
        tickets,
        isTicketsLoading,
        createTicket,
        updateTicketStatus,
        updateTicket,
        deleteTicket,
        conversations,
        activeConversationId,
        activeConversation,
        setActiveConversationId,
        sendMessage,
        markAsRead,
        simulateIncomingMessage,
        generateAIReply,
        agents,
        currentUser,
        updateProfile,
        activities,
        addActivity,
        notifications,
        updateNotifications,
        security,
        updateSecurity,
        toasts,
        showToast,
        dismissToast,
        exportReport
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = () => {
  const context = useContext(CustomizationContext);
  if (!context) {
    throw new Error('useCustomization must be used within a CustomizationProvider');
  }
  return context;
};
