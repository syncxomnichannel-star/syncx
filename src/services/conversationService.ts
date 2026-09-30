import { demoConversations, demoCustomers } from '../data/demoData';
import { ChannelType, ChatMessage, Conversation } from '../types';

/**
 * =========================================================================
 * CONVERSATION & MESSAGING SERVICE (LOCAL DEMO IMPLEMENTATION)
 * =========================================================================
 * Clean data-access layer for omnichannel conversations and chat streams.
 *
 * NOTE FOR BACKEND/SUPABASE TEAMMATE:
 * To connect Supabase #1 (Application DB) & realtime subscriptions:
 * Replace these functions with your Supabase queries on `conversations`
 * and `messages` tables, and realtime channel subscriptions.
 * Components interface only through these signatures.
 * =========================================================================
 */

let conversationsStore: Conversation[] = JSON.parse(JSON.stringify(demoConversations));

export async function getConversations(): Promise<Conversation[]> {
  await new Promise(resolve => setTimeout(resolve, 80));
  return JSON.parse(JSON.stringify(conversationsStore));
}

export async function getConversationById(id: string): Promise<Conversation | null> {
  const conv = conversationsStore.find(c => c.id === id);
  return conv ? JSON.parse(JSON.stringify(conv)) : null;
}

export async function getMessages(conversationId: string): Promise<ChatMessage[]> {
  const conv = conversationsStore.find(c => c.id === conversationId);
  return conv ? [...conv.messages] : [];
}

export async function sendMessage(
  conversationId: string,
  text: string,
  senderName: string = 'Sarah Jenkins',
  isAgent: boolean = true
): Promise<ChatMessage> {
  await new Promise(resolve => setTimeout(resolve, 100));

  const convIndex = conversationsStore.findIndex(c => c.id === conversationId);
  if (convIndex === -1) {
    throw new Error(`Conversation ${conversationId} not found.`);
  }

  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newMessage: ChatMessage = {
    id: `msg-${Date.now()}`,
    conversationId,
    sender: senderName,
    avatar: isAgent
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
      : conversationsStore[convIndex].customerAvatar,
    text,
    timestamp: timeString,
    isAgent,
    channel: conversationsStore[convIndex].channel,
    status: isAgent ? 'sent' : 'delivered'
  };

  // Append message and update conversation
  conversationsStore[convIndex].messages.push(newMessage);
  conversationsStore[convIndex].lastMessage = text;
  conversationsStore[convIndex].lastMessageTime = 'Just now';
  if (!isAgent) {
    conversationsStore[convIndex].unreadCount += 1;
  }

  // Move conversation to top
  const [target] = conversationsStore.splice(convIndex, 1);
  conversationsStore.unshift(target);

  return { ...newMessage };
}

export async function markConversationAsRead(conversationId: string): Promise<void> {
  const conv = conversationsStore.find(c => c.id === conversationId);
  if (conv) {
    conv.unreadCount = 0;
  }
}

/**
 * Simulates a realistic incoming customer message across channels.
 * Used for live demo presentations to demonstrate real-time omnichannel intake.
 */
export async function simulateIncomingMessage(
  targetChannel?: ChannelType,
  customText?: string
): Promise<{ conversation: Conversation; message: ChatMessage }> {
  const simulatedPool = [
    {
      channel: 'WhatsApp' as ChannelType,
      customerName: 'Marcus Vance',
      company: 'Acme Cloud Infrastructure',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
      text: customText || 'Quick check: Is there a rate-limiting dashboard to inspect dropped webhook events?'
    },
    {
      channel: 'Telegram' as ChannelType,
      customerName: 'Elena Rostova',
      company: 'FinEdge Global Banking',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120',
      text: customText || 'Our settlement retry job completed successfully after the burst bump! Thank you.'
    },
    {
      channel: 'Email' as ChannelType,
      customerName: 'Sophia Lin',
      company: 'NovaRetail Europe',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
      text: customText || 'Please send over the security addendum for GDPR data processing in Frankfurt.'
    },
    {
      channel: 'Web Chat' as ChannelType,
      customerName: 'David Miller',
      company: 'DataShield Cybersecurity',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120',
      text: customText || 'Can we verify if SSO SCIM directory sync supports Okta automatic provisioning?'
    },
    {
      channel: 'Instagram' as ChannelType,
      customerName: 'Liam O’Connor',
      company: 'Horizon Design Studio',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120',
      text: customText || 'Is the beta access for AI image moderation open to creative agencies yet?'
    }
  ];

  const candidate = targetChannel
    ? simulatedPool.find(s => s.channel === targetChannel) || simulatedPool[0]
    : simulatedPool[Math.floor(Math.random() * simulatedPool.length)];

  // Find or create conversation
  let conv = conversationsStore.find(c => c.customerName === candidate.customerName);
  if (!conv) {
    conv = {
      id: `conv-${Date.now()}`,
      customerId: `cust-${Date.now()}`,
      customerName: candidate.customerName,
      customerAvatar: candidate.avatar,
      customerEmail: `${candidate.customerName.toLowerCase().replace(' ', '.')}@example.com`,
      company: candidate.company,
      channel: candidate.channel,
      unreadCount: 0,
      lastMessage: '',
      lastMessageTime: 'Just now',
      status: 'active',
      messages: []
    };
    conversationsStore.unshift(conv);
  }

  const message = await sendMessage(conv.id, candidate.text, candidate.customerName, false);
  return { conversation: JSON.parse(JSON.stringify(conv)), message };
}

export async function createConversationForTicket(ticket: {
  id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  channel: ChannelType;
  subject: string;
  description?: string;
}): Promise<Conversation> {
  const newConv: Conversation = {
    id: `conv-${ticket.id.toLowerCase()}`,
    customerId: `cust-${Date.now()}`,
    customerName: ticket.customerName,
    customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    customerEmail: ticket.customerEmail || `${ticket.customerName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    customerPhone: ticket.customerPhone,
    company: 'Customer Account',
    channel: ticket.channel,
    unreadCount: 1,
    lastMessage: ticket.description || ticket.subject,
    lastMessageTime: 'Just now',
    status: 'active',
    ticketId: ticket.id,
    messages: [
      {
        id: `msg-${Date.now()}`,
        conversationId: `conv-${ticket.id.toLowerCase()}`,
        sender: ticket.customerName,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
        text: ticket.description || ticket.subject,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAgent: false,
        channel: ticket.channel,
        status: 'delivered'
      }
    ]
  };

  conversationsStore = [newConv, ...conversationsStore];
  return { ...newConv };
}

export async function clearAllConversations(): Promise<void> {
  conversationsStore = [];
}

