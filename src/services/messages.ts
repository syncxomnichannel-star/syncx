import { supabase } from '../lib/supabase';
import { ChatMessage } from '../types';

/**
 * MESSAGES SERVICE
 * Data access layer connecting to `syncid_messages` with fallbacks to `syncid_conversations`.
 */
export async function getConversationMessages(conversationId: string): Promise<ChatMessage[]> {
  try {
    const { data, error } = await supabase
      .from('syncid_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((m: any) => ({
        id: String(m.id),
        conversationId: m.conversation_id,
        sender: m.sender_type === 'agent' ? (m.sender_name || 'Rahul Kumar') : 'Customer',
        avatar: m.sender_type === 'agent' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120' : undefined,
        text: m.message || m.text || '',
        timestamp: m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
        isAgent: m.sender_type === 'agent' || m.sender_type === 'system',
        status: 'delivered'
      }));
    }

    // Fallback: parse messages array embedded in `syncid_conversations.state` JSON
    const { data: convData } = await supabase
      .from('syncid_conversations')
      .select('*')
      .or(`conversation_id.eq.${conversationId},chat_id.eq.${conversationId}`)
      .limit(1)
      .maybeSingle();

    if (convData) {
      let stateObj: any = {};
      if (typeof convData.state === 'string') {
        try { stateObj = JSON.parse(convData.state); } catch (e) {}
      } else if (typeof convData.state === 'object' && convData.state !== null) {
        stateObj = convData.state;
      }

      const msgs: ChatMessage[] = [];
      const isVerified = stateObj.email_verified || convData.authentication_status === 'AUTHENTICATED';
      const custName = stateObj.email ? stateObj.email.split('@')[0] : 'Customer';

      if (convData.last_customer_message || stateObj.last_customer_message) {
        msgs.push({
          id: `msg-cust-${convData.conversation_id}`,
          conversationId: convData.conversation_id,
          sender: custName,
          text: convData.last_customer_message || stateObj.last_customer_message,
          timestamp: stateObj.last_message_at ? new Date(stateObj.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
          isAgent: false,
          status: 'delivered'
        });
      }

      if (convData.last_agent_response || stateObj.last_agent_action) {
        msgs.push({
          id: `msg-agent-${convData.conversation_id}`,
          conversationId: convData.conversation_id,
          sender: convData.current_agent || 'AI Support Assistant',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
          text: convData.last_agent_response || `Processed request: ${stateObj.last_agent_action || 'Completed'}`,
          timestamp: 'Just now',
          isAgent: true,
          status: 'delivered'
        });
      }

      return msgs;
    }

    return [];
  } catch (err: any) {
    console.error('getConversationMessages exception:', err);
    return [];
  }
}

export async function getMessages(conversationId: string): Promise<ChatMessage[]> {
  return getConversationMessages(conversationId);
}

export async function insertMessage(msg: {
  conversationId: string;
  senderType?: 'customer' | 'agent' | 'system';
  text: string;
  senderName?: string;
}): Promise<ChatMessage> {
  const payload = {
    conversation_id: msg.conversationId,
    sender_type: msg.senderType || 'agent',
    message: msg.text,
    message_type: 'text'
  };

  try {
    const { data } = await supabase.from('syncid_messages').insert([payload]).select().single();
    return {
      id: data ? String(data.id) : `msg-${Date.now()}`,
      conversationId: msg.conversationId,
      sender: msg.senderName || (msg.senderType === 'customer' ? 'Customer' : 'Rahul Kumar'),
      text: msg.text,
      timestamp: 'Just now',
      isAgent: msg.senderType !== 'customer',
      status: 'sent'
    };
  } catch (e) {
    return {
      id: `msg-${Date.now()}`,
      conversationId: msg.conversationId,
      sender: msg.senderName || 'Rahul Kumar',
      text: msg.text,
      timestamp: 'Just now',
      isAgent: true,
      status: 'sent'
    };
  }
}
