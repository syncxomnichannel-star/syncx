import { supabase } from '../lib/supabase';
import { ChannelType, ChatMessage, Conversation } from '../types';
import { getConversationMessages, insertMessage } from './messages';

/**
 * CONVERSATIONS SERVICE
 * Clean data access layer connecting to authoritative active Supabase table: `syncid_conversations`.
 */

export async function getConversations(): Promise<Conversation[]> {
  try {
    const { data, error } = await supabase
      .from('syncid_conversations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.warn('syncid_conversations query note:', error.message);
      return [];
    }

    if (!data || data.length === 0) return [];

    const mapped: Conversation[] = await Promise.all(
      data.map(async (c: any) => {
        let stateObj: any = {};
        if (typeof c.state === 'string') {
          try { stateObj = JSON.parse(c.state); } catch (e) {}
        } else if (typeof c.state === 'object' && c.state !== null) {
          stateObj = c.state;
        }

        // Map channel
        const rawChan = (c.channel || 'WEBHOOK').toUpperCase();
        let channel: ChannelType = 'Web Chat';
        if (rawChan.includes('WHATSAPP') || rawChan.includes('WA')) channel = 'WhatsApp';
        else if (rawChan.includes('TELEGRAM') || rawChan.includes('TG')) channel = 'Telegram';
        else if (rawChan.includes('EMAIL') || rawChan.includes('EM')) channel = 'Email';
        else if (rawChan.includes('INSTAGRAM') || rawChan.includes('IG')) channel = 'Instagram';

        const email = stateObj.email || stateObj.pending_email || c.metadata?.email || '';
        const customerName = email ? email.split('@')[0] : (c.chat_id || `Customer ${c.conversation_id.slice(0, 6)}`);

        // Fetch messages for conversation
        const msgs = await getConversationMessages(c.conversation_id);
        const lastMsg = c.last_customer_message || stateObj.last_customer_message || c.last_agent_response || c.pending_issue || 'Conversation started';

        let lastTime = 'Just now';
        if (c.updated_at || c.created_at) {
          const d = new Date(c.updated_at || c.created_at);
          lastTime = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        return {
          id: c.conversation_id,
          customerId: c.customer_id || `cust-${c.conversation_id.slice(0, 8)}`,
          customerName,
          customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
          customerEmail: email,
          customerPhone: stateObj.phone || c.channel_user_id || undefined,
          channel,
          unreadCount: c.authentication_status === 'OTP_PENDING' ? 1 : 0,
          lastMessage: lastMsg,
          lastMessageTime: lastTime,
          status: c.ticket_status === 'IN_PROGRESS' || c.workflow_state === 'OK' ? 'active' : 'resolved',
          messages: msgs,
          ticketId: c.ticket_id || c.active_ticket_id || undefined
        };
      })
    );

    return mapped;
  } catch (err: any) {
    console.error('getConversations exception:', err);
    return [];
  }
}

export async function getConversationById(id: string): Promise<Conversation | null> {
  const all = await getConversations();
  return all.find(c => c.id === id || c.ticketId === id) || null;
}

export async function sendMessage(
  conversationId: string,
  text: string,
  senderName: string = 'Gayathri',
  isAgent: boolean = true
): Promise<ChatMessage> {
  return insertMessage({
    conversationId,
    senderType: isAgent ? 'agent' : 'customer',
    text,
    senderName
  });
}

export async function markConversationAsRead(conversationId: string): Promise<void> {
  try {
    await supabase
      .from('syncid_conversations')
      .update({ authentication_status: 'AUTHENTICATED', updated_at: new Date().toISOString() })
      .eq('conversation_id', conversationId);
  } catch (e) {}
}

export async function simulateIncomingMessage(
  targetChannel?: ChannelType,
  customText?: string
): Promise<{ conversation: Conversation; message: ChatMessage }> {
  const convs = await getConversations();
  const conv = convs.length > 0 ? convs[0] : {
    id: `conv-${Date.now()}`,
    customerId: `cust-${Date.now()}`,
    customerName: 'Marcus Vance',
    customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    customerEmail: 'marcus.vance@example.com',
    channel: targetChannel || 'WhatsApp',
    unreadCount: 1,
    lastMessage: customText || 'Incoming query',
    lastMessageTime: 'Just now',
    status: 'active' as const,
    messages: []
  };

  const msg = await sendMessage(conv.id, customText || 'Status check on request', 'Customer', false);
  return { conversation: conv, message: msg };
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
  const convId = `conv-${Date.now()}`;
  try {
    await supabase.from('syncid_conversations').insert([{
      conversation_id: convId,
      channel: ticket.channel.toUpperCase(),
      authentication_status: 'AUTHENTICATED',
      workflow_state: 'OK',
      ticket_id: ticket.id,
      ticket_status: 'OPEN',
      last_customer_message: ticket.description || ticket.subject
    }]);
  } catch (e) {}

  return {
    id: convId,
    customerId: `cust-${Date.now()}`,
    customerName: ticket.customerName,
    customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    customerEmail: ticket.customerEmail || '',
    customerPhone: ticket.customerPhone,
    channel: ticket.channel,
    unreadCount: 1,
    lastMessage: ticket.description || ticket.subject,
    lastMessageTime: 'Just now',
    status: 'active',
    ticketId: ticket.id,
    messages: []
  };
}

export async function clearAllConversations(): Promise<void> {
  try {
    await supabase.from('syncid_conversations').delete().neq('conversation_id', '00000000-0000-0000-0000-000000000000');
  } catch (e) {}
}
