import { supabase } from '../lib/supabase';

export interface EscalationData {
  id: string | number;
  escalationId: string;
  status: string;
  priority: string;
  reason: string;
  channel: string;
  customerId?: string;
  ticketId?: string;
  conversationId?: string;
  lastMessage?: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * ESCALATIONS SERVICE
 * Data access layer querying active Supabase table: `syncid_escalations`.
 */
export async function getEscalations(): Promise<EscalationData[]> {
  try {
    const { data, error } = await supabase
      .from('syncid_escalations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('syncid_escalations query note:', error.message);
      return [];
    }

    if (!data) return [];

    return data.map((r: any) => ({
      id: r.id,
      escalationId: r.escalation_id || `ESC_${r.id}`,
      status: r.status || 'WAITING_FOR_EMPLOYEE',
      priority: r.priority || 'MEDIUM',
      reason: r.reason || 'LIVE_SUPPORT_REQUESTED',
      channel: r.channel || 'WEBHOOK',
      customerId: r.customer_id,
      ticketId: r.ticket_id,
      conversationId: r.conversation_id,
      lastMessage: r.last_message,
      createdAt: r.created_at ? new Date(r.created_at).toLocaleString() : 'Just now',
      updatedAt: r.updated_at
    }));
  } catch (err: any) {
    console.error('getEscalations exception:', err);
    return [];
  }
}

export async function getEscalationByTicketId(ticketId: string): Promise<EscalationData | null> {
  try {
    const { data, error } = await supabase
      .from('syncid_escalations')
      .select('*')
      .or(`ticket_id.eq.${ticketId},escalation_id.ilike.%${ticketId}%`)
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      escalationId: data.escalation_id,
      status: data.status,
      priority: data.priority,
      reason: data.reason,
      channel: data.channel,
      customerId: data.customer_id,
      ticketId: data.ticket_id,
      conversationId: data.conversation_id,
      lastMessage: data.last_message,
      createdAt: data.created_at ? new Date(data.created_at).toLocaleString() : 'Just now',
      updatedAt: data.updated_at
    };
  } catch (err) {
    return null;
  }
}
