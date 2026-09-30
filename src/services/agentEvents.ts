import { supabase } from '../lib/supabase';

export interface AgentEventData {
  id: string | number;
  agentName: string;
  action: string;
  conversationId?: string;
  ticketId?: string;
  timestamp: string;
}

/**
 * AGENT EVENTS SERVICE
 * Data access layer querying active Supabase table: `syncid_agent_events`.
 */
export async function getAgentEvents(): Promise<AgentEventData[]> {
  try {
    const { data: directData, error } = await supabase
      .from('syncid_agent_events')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && directData && directData.length > 0) {
      return directData.map((r: any) => ({
        id: r.id,
        agentName: r.agent_name || r.agent || 'AI Agent',
        action: r.action || r.event || 'Agent operation',
        conversationId: r.conversation_id,
        ticketId: r.ticket_id,
        timestamp: r.created_at ? new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'
      }));
    }

    // Fallback: derive recent active agent events from `syncid_conversations`
    const { data: convs } = await supabase.from('syncid_conversations').select('*').limit(10);
    if (convs && convs.length > 0) {
      return convs
        .filter((c: any) => c.current_agent || c.last_route)
        .map((c: any, idx: number) => ({
          id: `agent-evt-${idx}`,
          agentName: c.current_agent || c.last_route || 'AGENT_1_EMAIL_AUTH_ACCOUNT',
          action: `Intent: ${c.intent || 'SUPPORT'} | Action: ${c.pending_action || c.workflow_state || 'OK'}`,
          conversationId: c.conversation_id,
          ticketId: c.ticket_id || undefined,
          timestamp: c.updated_at ? new Date(c.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'
        }));
    }

    return [];
  } catch (err: any) {
    console.error('getAgentEvents exception:', err);
    return [];
  }
}
