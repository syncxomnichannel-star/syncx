import { supabase } from '../lib/supabase';
import { getEscalations } from './escalations';

export interface LiveSupportItem {
  id: string | number;
  queuePosition: number;
  customerName: string;
  ticketId: string;
  status: string;
  assignedEmployee?: string;
  requestedTime: string;
  channel: string;
  handoverStatus: string;
  lastMessage?: string;
}

/**
 * LIVE SUPPORT SERVICE
 * Data access layer querying active Supabase tables: `syncid_live_support` & `syncid_escalations`.
 */
export async function getLiveSupport(): Promise<LiveSupportItem[]> {
  try {
    const { data: directData, error } = await supabase
      .from('syncid_live_support')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && directData && directData.length > 0) {
      return directData.map((r: any, idx: number) => ({
        id: r.id,
        queuePosition: idx + 1,
        customerName: r.customer_name || `Customer #${r.customer_id ? String(r.customer_id).slice(0, 6) : idx + 1}`,
        ticketId: r.ticket_id || `TCK-${r.id}`,
        status: r.support_status || 'Waiting',
        assignedEmployee: r.assigned_employee || 'Unassigned',
        requestedTime: r.requested_time || (r.created_at ? new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'),
        channel: r.channel || 'Live Chat',
        handoverStatus: r.handover_status || 'Pending Handover',
        lastMessage: r.last_message
      }));
    }

    // Fallback mapping from active escalations table (populated by 7-agent n8n workflow)
    const escalations = await getEscalations();
    return escalations.map((esc, idx) => ({
      id: esc.id,
      queuePosition: idx + 1,
      customerName: `Customer (${esc.customerId ? esc.customerId.slice(0, 8) : 'Live User'})`,
      ticketId: esc.ticketId || `TCK-${esc.id}`,
      status: esc.status === 'WAITING_FOR_EMPLOYEE' ? 'Waiting' : esc.status,
      assignedEmployee: 'Rahul Kumar',
      requestedTime: esc.createdAt,
      channel: esc.channel,
      handoverStatus: `Reason: ${esc.reason}`,
      lastMessage: esc.lastMessage
    }));
  } catch (err: any) {
    console.error('getLiveSupport exception:', err);
    return [];
  }
}
