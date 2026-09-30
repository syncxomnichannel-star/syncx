import { createClient } from '@supabase/supabase-js';
import { Customer, Ticket, TicketStatus, ChatMessage, Conversation, ChannelType } from '../types';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://mccnykxameoakngjhxpx.supabase.co';
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_xDdb_Vq--7IyraJiqSI4xw_ebiaJSda';

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Cache default organization, channel, and agent IDs from DB
let cachedOrgId: string | null = null;
let cachedChannelId: string | null = null;
let cachedAgentId: string | null = null;

async function ensureDefaults() {
  if (cachedOrgId && cachedChannelId && cachedAgentId) return;

  try {
    if (!cachedOrgId) {
      const { data: orgs } = await supabase.from('organizations').select('id').limit(1);
      if (orgs && orgs.length > 0) cachedOrgId = orgs[0].id;
    }
    if (!cachedChannelId) {
      const { data: channels } = await supabase.from('channels').select('id').limit(1);
      if (channels && channels.length > 0) cachedChannelId = channels[0].id;
    }
    if (!cachedAgentId) {
      const { data: agents } = await supabase.from('agents').select('id').limit(1);
      if (agents && agents.length > 0) cachedAgentId = agents[0].id;
    }
  } catch (e) {
    console.warn('Could not cache default foreign keys:', e);
  }
}

/**
 * Fetch all tickets from the Supabase SYNCID `tickets` table joined with
 * customers, conversations, and agents.
 */
export async function fetchTicketsFromSupabase(): Promise<{ data: Ticket[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*, customers (*), conversations (*), agents (*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase tickets query warning:', error.message);
      return { data: null, error: error.message };
    }

    if (!data) return { data: [], error: null };

    const mappedTickets: Ticket[] = data.map((r: any) => {
      // Map priority
      let rawPriority = r.priority || r.conversations?.priority || 'medium';
      let priority: Ticket['priority'] = 'Medium';
      if (typeof rawPriority === 'string') {
        const pLower = rawPriority.toLowerCase();
        if (pLower === 'urgent') priority = 'Urgent';
        else if (pLower === 'high') priority = 'High';
        else if (pLower === 'low') priority = 'Low';
        else priority = 'Medium';
      }

      // Map status
      let rawStatus = r.status || r.conversations?.status || 'open';
      let status: TicketStatus = 'Open';
      if (typeof rawStatus === 'string') {
        const sLower = rawStatus.toLowerCase();
        if (sLower.includes('progress')) status = 'In Progress';
        else if (sLower.includes('pending')) status = 'Pending';
        else if (sLower.includes('resolve') || sLower.includes('close')) status = 'Resolved';
        else status = 'Open';
      }

      // Format created date
      let createdStr = 'Just now';
      if (r.created_at) {
        const d = new Date(r.created_at);
        createdStr = d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }

      const displayId = r.conversations?.ticket_number || `TCK-${r.id.slice(0, 8)}`;
      const customerName = r.customers?.name || r.customer_name || 'Customer';
      const subject = r.conversations?.subject || r.category || 'Support Request';

      return {
        id: displayId,
        customerId: r.customer_id,
        customerName,
        customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
        customerEmail: r.customers?.email,
        customerPhone: r.customers?.phone,
        subject,
        channel: 'WhatsApp',
        status,
        priority,
        assignedTo: r.agents?.name || 'Rahul Kumar',
        createdAt: createdStr,
        notes: r.category ? `Category: ${r.category}` : undefined,
        aiConfidence: priority === 'Urgent' || priority === 'High' ? 0.98 : 0.94,
        difficulty: priority === 'Urgent' || priority === 'High' ? 'Complex' : 'Normal',
        aiAction: r.category ? `Auto-triaged: ${r.category}` : 'Auto-routed to Tier 1',
        syncId: r.customers?.unique_customer_id
      };
    });

    return { data: mappedTickets, error: null };
  } catch (err: any) {
    console.error('Supabase tickets fetch exception:', err);
    return { data: null, error: err?.message || 'Connection failed' };
  }
}

/**
 * Send an OTP verification code to the customer's email using SMTP service / Supabase backend.
 */
export async function sendEmailVerificationOtp(email: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    // 1. First attempt: Dedicated SMTP OTP service (configured with Gmail SMTP in .env)
    try {
      const resp = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });

      if (resp.ok) {
        const result = await resp.json().catch(() => ({}));
        if (result.success) {
          return { success: true, error: null };
        }
      } else {
        const errData = await resp.json().catch(() => ({}));
        if (errData?.error) {
          console.warn('SMTP OTP endpoint warning:', errData.error);
        }
      }
    } catch (e: any) {
      console.warn('SMTP API unavailable, falling back to Supabase auth:', e?.message);
    }

    // 2. Second attempt: Fallback to Supabase Auth signInWithOtp
    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        shouldCreateUser: true
      }
    });

    if (error) {
      console.warn('Supabase email OTP send warning:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to dispatch verification code.' };
  }
}

/**
 * Verify the OTP entered by the customer using SMTP service or Supabase Auth backend.
 * Checks if the customer already exists by verified email, reusing their profile and ID if found.
 */
export async function verifyEmailOtp(email: string, token: string): Promise<{
  success: boolean;
  customer: Customer | null;
  suggestedUniqueId: string;
  error: string | null;
}> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const cleanToken = token.trim();

    if (!cleanEmail || !cleanToken) {
      return { success: false, customer: null, suggestedUniqueId: '', error: 'Email and verification code are required.' };
    }

    let isVerified = false;
    let lastError: string | null = null;

    // 1. First attempt: Verify code against SMTP OTP service
    try {
      const resp = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, token: cleanToken })
      });

      if (resp.ok) {
        const data = await resp.json().catch(() => ({}));
        if (data.success) {
          isVerified = true;
        }
      } else {
        const data = await resp.json().catch(() => ({}));
        if (data.error) {
          lastError = data.error;
        }
      }
    } catch (e: any) {
      console.warn('SMTP verification endpoint note:', e?.message);
    }

    // 2. Second attempt: If not verified yet, fallback to Supabase backend verifyOtp
    if (!isVerified) {
      const { error: authError } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: cleanToken,
        type: 'email'
      });

      if (!authError) {
        isVerified = true;
      } else {
        return {
          success: false,
          customer: null,
          suggestedUniqueId: '',
          error: lastError || authError.message || 'Verification code is invalid or has expired.'
        };
      }
    }

    // Email is verified! Check if customer profile exists in Supabase
    const { data: existingList, error: queryError } = await supabase
      .from('customers')
      .select('*')
      .eq('email', cleanEmail)
      .limit(1);

    if (queryError) {
      console.warn('Customer lookup by email query note:', queryError.message);
    }

    if (existingList && existingList.length > 0) {
      const c = existingList[0];
      const mapped: Customer = {
        id: String(c.id),
        uniqueCustomerId: c.unique_customer_id,
        name: c.name || (c.email ? c.email.split('@')[0] : 'Customer'),
        email: c.email,
        phone: c.phone || undefined,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
        status: 'Active',
        channel: 'Email',
        isEmailVerified: true,
        createdAt: c.created_at ? new Date(c.created_at).toLocaleDateString() : undefined
      };
      return {
        success: true,
        customer: mapped,
        suggestedUniqueId: c.unique_customer_id || '',
        error: null
      };
    }

    // New customer: generate SYNCID
    const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000);
    const suggestedUniqueId = `SYNC${randomDigits}`;

    return {
      success: true,
      customer: null,
      suggestedUniqueId,
      error: null
    };
  } catch (err: any) {
    return { success: false, customer: null, suggestedUniqueId: '', error: err?.message || 'Verification failed.' };
  }
}

/**
 * Retrieve existing customer profile by verified email, or create new customer record in Supabase.
 * Uses verified email as the primary customer identity.
 */
export async function getOrCreateVerifiedCustomer(params: {
  email: string;
  name: string;
  phone?: string;
  customerId?: string;
  syncId?: string;
}): Promise<{ customer: Customer | null; error: string | null }> {
  try {
    await ensureDefaults();
    const orgId = cachedOrgId || '583fdc57-596d-4375-ab12-3a3637a3be82';
    const cleanEmail = params.email.trim().toLowerCase();
    const cleanPhone = (params.phone || '').trim() || null;

    // 1. If explicit UUID provided
    if (params.customerId) {
      const { data: byId } = await supabase.from('customers').select('*').eq('id', params.customerId).maybeSingle();
      if (byId) {
        if (cleanPhone && !byId.phone) {
          await supabase.from('customers').update({ phone: cleanPhone }).eq('id', byId.id);
        }
        return {
          customer: {
            id: String(byId.id),
            uniqueCustomerId: byId.unique_customer_id,
            name: byId.name,
            email: byId.email || cleanEmail,
            phone: byId.phone || cleanPhone || undefined,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
            status: 'Active',
            channel: 'Email',
            isEmailVerified: true
          },
          error: null
        };
      }
    }

    // 2. Check if customer already exists by verified email (primary identifier)
    const { data: existingList } = await supabase
      .from('customers')
      .select('*')
      .eq('email', cleanEmail)
      .limit(1);

    if (existingList && existingList.length > 0) {
      const existing = existingList[0];
      const updates: any = {};
      if (cleanPhone && !existing.phone) updates.phone = cleanPhone;
      if (params.name && (!existing.name || existing.name.startsWith('Customer SYNC'))) {
        updates.name = params.name.trim();
      }

      if (Object.keys(updates).length > 0) {
        await supabase.from('customers').update(updates).eq('id', existing.id);
      }

      return {
        customer: {
          id: String(existing.id),
          uniqueCustomerId: existing.unique_customer_id,
          name: updates.name || existing.name,
          email: existing.email,
          phone: updates.phone || existing.phone || undefined,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
          status: 'Active',
          channel: 'Email',
          isEmailVerified: true
        },
        error: null
      };
    }

    // 3. New customer: generate SYNCID
    let uniqueId = params.syncId;
    if (!uniqueId) {
      if (cleanPhone) {
        const digits = cleanPhone.replace(/\D/g, '');
        uniqueId = `SYNC${digits.length >= 10 ? digits.slice(-10) : digits}`;
      } else {
        const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000);
        uniqueId = `SYNC${randomDigits}`;
      }
    }

    const { data: newCust, error: insertError } = await supabase
      .from('customers')
      .insert([{
        organization_id: orgId,
        unique_customer_id: uniqueId,
        name: params.name.trim() || cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: cleanPhone
      }])
      .select()
      .single();

    if (insertError) {
      console.warn('Customer insert error:', insertError.message);
      return { customer: null, error: insertError.message };
    }

    return {
      customer: {
        id: String(newCust.id),
        uniqueCustomerId: newCust.unique_customer_id,
        name: newCust.name,
        email: newCust.email,
        phone: newCust.phone || undefined,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
        status: 'Active',
        channel: 'Email',
        isEmailVerified: true,
        createdAt: new Date().toLocaleDateString()
      },
      error: null
    };
  } catch (err: any) {
    return { customer: null, error: err?.message || 'Failed to retrieve or store customer' };
  }
}

/**
 * Optional phone lookup helper (does not enforce phone verification).
 */
export async function verifyCustomerByPhone(phone: string): Promise<{
  exists: boolean;
  customer: Customer | null;
  suggestedUniqueId: string;
  error: string | null;
}> {
  try {
    const cleanPhone = phone.trim();
    const digits = cleanPhone.replace(/\D/g, '');
    const cleanDigits = digits.length >= 10 ? digits.slice(-10) : digits;
    const suggestedUniqueId = cleanDigits ? `SYNC${cleanDigits}` : `SYNC${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    if (!cleanPhone || cleanDigits.length < 5) {
      return { exists: false, customer: null, suggestedUniqueId, error: null };
    }

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .or(`phone.eq.${cleanPhone},phone.ilike.%${cleanDigits}%,unique_customer_id.eq.${suggestedUniqueId}`)
      .limit(1);

    if (error) {
      return { exists: false, customer: null, suggestedUniqueId, error: error.message };
    }

    if (data && data.length > 0) {
      const c = data[0];
      const mapped: Customer = {
        id: String(c.id),
        uniqueCustomerId: c.unique_customer_id,
        name: c.name || `Customer ${c.unique_customer_id || ''}`,
        email: c.email || undefined,
        phone: c.phone || cleanPhone,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
        status: 'Active',
        channel: 'WhatsApp',
        isEmailVerified: Boolean(c.email),
        createdAt: c.created_at ? new Date(c.created_at).toLocaleDateString() : undefined
      };
      return { exists: true, customer: mapped, suggestedUniqueId: c.unique_customer_id || suggestedUniqueId, error: null };
    }

    return { exists: false, customer: null, suggestedUniqueId, error: null };
  } catch (err: any) {
    return { exists: false, customer: null, suggestedUniqueId: '', error: err?.message || 'Phone lookup failed' };
  }
}

/**
 * Insert a new ticket into the Supabase SYNCID `conversations` and `tickets` tables.
 * Links to verified customer.
 */
export async function insertTicketToSupabase(ticket: Partial<Ticket>): Promise<{ data: any; error: string | null }> {
  try {
    await ensureDefaults();

    const orgId = cachedOrgId || '583fdc57-596d-4375-ab12-3a3637a3be82';
    const channelId = cachedChannelId || '30ea29d9-98db-49c7-ae4d-068361a6b0f3';
    const agentId = cachedAgentId || '9c4b9716-15aa-4c1c-b5ca-95f90252bd61';

    // 1. Verify or link customer through verified email workflow
    let custId = ticket.customerId;
    let uniqueCustId = ticket.syncId;

    if (!custId && ticket.customerEmail) {
      const { customer, error: custErr } = await getOrCreateVerifiedCustomer({
        email: ticket.customerEmail,
        name: ticket.customerName || 'Customer',
        phone: ticket.customerPhone,
        customerId: ticket.customerId,
        syncId: ticket.syncId
      });
      if (custErr || !customer) {
        return { data: null, error: custErr || 'Failed to link customer' };
      }
      custId = customer.id;
      uniqueCustId = customer.uniqueCustomerId;
    }

    const channelPrefix = ticket.channel === 'WhatsApp' ? 'WA' :
      ticket.channel === 'Telegram' ? 'TG' :
      ticket.channel === 'Email' ? 'EM' :
      ticket.channel === 'Web Chat' ? 'WB' : 'IG';

    const ticketNumber = `${channelPrefix}-${uniqueCustId || 'SYNC'}-${Math.floor(100 + Math.random() * 900)}`;

    // 2. Create conversation
    const { data: conv, error: convError } = await supabase
      .from('conversations')
      .insert([{
        organization_id: orgId,
        customer_id: custId,
        channel_id: channelId,
        assigned_agent_id: agentId,
        ticket_number: ticketNumber,
        subject: ticket.subject || 'Support Request',
        status: (ticket.status || 'open').toLowerCase(),
        priority: (ticket.priority || 'medium').toLowerCase()
      }])
      .select()
      .single();

    if (convError) {
      console.warn('Conversation insert error:', convError.message);
      return { data: null, error: convError.message };
    }

    // 3. Create ticket linked to conversation
    const { data: createdTicket, error: ticketError } = await supabase
      .from('tickets')
      .insert([{
        organization_id: orgId,
        conversation_id: conv.id,
        customer_id: custId,
        assigned_agent_id: agentId,
        status: (ticket.status || 'open').toLowerCase(),
        priority: (ticket.priority || 'medium').toLowerCase(),
        category: ticket.notes ? ticket.notes.replace(/^Category:\s*/, '') : (ticket.subject || 'General Support')
      }])
      .select()
      .single();

    if (ticketError) {
      console.warn('Ticket insert error:', ticketError.message);
      return { data: null, error: ticketError.message };
    }

    return { data: { ...createdTicket, ticketNumber, customerId: custId }, error: null };
  } catch (err: any) {
    console.error('Supabase ticket insert exception:', err);
    return { data: null, error: err?.message || 'Insert failed' };
  }
}

/**
 * Update a ticket's status in Supabase `tickets` and `conversations`.
 */
export async function updateTicketStatusInSupabase(id: string, status: TicketStatus): Promise<{ error: string | null }> {
  try {
    const dbStatus = status.toLowerCase();

    // If id is a ticket_number (e.g. WA-SYNC-1234), find and update conversation
    if (id.startsWith('WA-') || id.startsWith('TG-') || id.startsWith('EM-') || id.startsWith('WB-') || id.startsWith('IG-') || id.startsWith('TCK-')) {
      const { data: conv } = await supabase
        .from('conversations')
        .select('id')
        .eq('ticket_number', id)
        .limit(1)
        .maybeSingle();

      if (conv) {
        await supabase
          .from('conversations')
          .update({ status: dbStatus, updated_at: new Date().toISOString() })
          .eq('id', conv.id);

        await supabase
          .from('tickets')
          .update({ status: dbStatus, updated_at: new Date().toISOString() })
          .eq('conversation_id', conv.id);

        return { error: null };
      }
    }

    // Otherwise update by direct UUID
    const { error } = await supabase
      .from('tickets')
      .update({ status: dbStatus, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      return { error: error.message };
    }
    return { error: null };
  } catch (err: any) {
    console.error('Supabase status update exception:', err);
    return { error: err?.message || 'Update failed' };
  }
}

/**
 * Fetch all customers from the Supabase SYNCID `customers` table
 */
export async function fetchCustomersFromSupabase(): Promise<{ data: Customer[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase customers query warning:', error.message);
      return { data: null, error: error.message };
    }

    if (!data) return { data: [], error: null };

    const mappedCustomers: Customer[] = data.map((c: any) => ({
      id: String(c.id),
      uniqueCustomerId: c.unique_customer_id || undefined,
      name: c.name || (c.email ? c.email.split('@')[0] : `Customer #${String(c.id).slice(-4)}`),
      email: c.email || undefined,
      phone: c.phone || undefined,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
      status: 'Active',
      channel: 'WhatsApp',
      isEmailVerified: Boolean(c.email),
      createdAt: c.created_at ? new Date(c.created_at).toLocaleDateString() : undefined
    }));

    return { data: mappedCustomers, error: null };
  } catch (err: any) {
    console.error('Supabase customers fetch exception:', err);
    return { data: null, error: err?.message || 'Failed to fetch customers' };
  }
}

/**
 * Fetch conversations and their messages from Supabase SYNCID tables
 */
export async function fetchConversationsFromSupabase(): Promise<{ data: Conversation[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*, customers (*), messages (*), channels (*), agents (*)')
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    if (!data) return { data: [], error: null };

    const mapped: Conversation[] = data.map((c: any) => {
      const msgs = (c.messages || []).map((m: any) => ({
        id: String(m.id),
        sender: m.sender_type === 'agent' ? (c.agents?.name || 'Rahul Kumar') : (c.customers?.name || 'Customer'),
        avatar: m.sender_type === 'agent' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120' : undefined,
        text: m.message || '',
        timestamp: m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
        isAgent: m.sender_type === 'agent'
      }));

      const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1].text : (c.subject || 'Support conversation');

      return {
        id: String(c.id),
        customerId: c.customer_id,
        customerName: c.customers?.name || 'Demo Customer',
        customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
        customerEmail: c.customers?.email,
        customerPhone: c.customers?.phone,
        channel: (c.channels?.name as ChannelType) || 'WhatsApp',
        unreadCount: msgs.filter((m: any) => !m.isAgent).length,
        lastMessage: lastMsg,
        lastMessageTime: c.created_at ? new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
        status: c.status === 'open' ? 'active' : 'resolved',
        messages: msgs
      };
    });

    return { data: mapped, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to fetch conversations' };
  }
}

/**
 * Insert a message into Supabase SYNCID `messages` table
 */
export async function insertMessageToSupabase(msg: {
  conversationId: string;
  senderType?: 'customer' | 'agent';
  text: string;
}): Promise<{ data: any; error: string | null }> {
  try {
    const payload = {
      conversation_id: msg.conversationId,
      sender_type: msg.senderType || 'agent',
      message: msg.text,
      message_type: 'text'
    };

    const { data, error } = await supabase
      .from('messages')
      .insert([payload])
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Failed to insert message' };
  }
}

/**
 * Setup Realtime subscriptions on tickets and messages
 */
export function subscribeToSupabaseRealtime(
  onTicketsChange: () => void,
  onConversationsChange: () => void
) {
  try {
    const liveChannel = supabase
      .channel('syncid-omnichannel-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, () => {
        onTicketsChange();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'syncid_conversations' }, () => {
        onConversationsChange();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'syncid_messages' }, () => {
        onConversationsChange();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'syncid_escalations' }, () => {
        onTicketsChange();
        onConversationsChange();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'syncid_live_support' }, () => {
        onTicketsChange();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'syncid_agent_events' }, () => {
        onTicketsChange();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(liveChannel);
    };
  } catch (e) {
    console.warn('Realtime subscription warning:', e);
    return () => {};
  }
}
