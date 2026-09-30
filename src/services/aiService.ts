import { demoAISuggestions } from '../data/demoData';
import { AISuggestion, Ticket } from '../types';

/**
 * =========================================================================
 * AI SERVICE (LOCAL DEMO IMPLEMENTATION)
 * =========================================================================
 * Copilot intelligence layer for suggested responses, sentiment analysis,
 * and ticket summarization.
 *
 * NOTE FOR BACKEND/AI TEAMMATE:
 * To connect Supabase #2 (AI Agent / Edge Functions):
 * Replace the mock response generation below with your real AI endpoint:
 *   e.g. const res = await supabase.functions.invoke('ai-copilot', { body: ... });
 * Components consume this exact AISuggestion interface.
 * =========================================================================
 */

export async function generateAIReply(
  conversationId: string,
  lastCustomerMessage: string,
  customerName?: string
): Promise<AISuggestion> {
  // Simulate realistic AI generation latency (600ms)
  await new Promise(resolve => setTimeout(resolve, 650));

  // Return pre-crafted smart suggestion if available
  if (demoAISuggestions[conversationId]) {
    return { ...demoAISuggestions[conversationId] };
  }

  // Dynamic fallback suggestion based on incoming customer text
  const lower = lastCustomerMessage.toLowerCase();
  let tone: 'urgent' | 'positive' | 'neutral' = 'neutral';
  let suggestedText = `Hi ${customerName || 'there'}, thank you for reaching out to Sync X support. I am investigating your request right now and will provide the technical details shortly.`;
  let points = ['Acknowledged inquiry', 'Technical validation underway', 'Prompt follow-up promised'];
  let action = 'Send preliminary acknowledgment and check diagnostic logs.';

  if (lower.includes('rate') || lower.includes('error') || lower.includes('429') || lower.includes('urgent')) {
    tone = 'urgent';
    suggestedText = `Hello ${customerName || ''}, our monitoring systems have flagged your alert. We are reviewing error metrics and scaling gateway headroom immediately. Please hold while we confirm resolution.`;
    points = ['Urgent triage initiated', 'Headroom expansion verified', 'Engineering on standby'];
    action = 'Escalate to Tier 2 on-call engineer.';
  } else if (lower.includes('webhook') || lower.includes('api') || lower.includes('payload')) {
    suggestedText = `Hi ${customerName || ''}, thank you for your query regarding our API architecture. All payloads are processed through our low-latency distributed pipeline with automated retry guarantees. I have attached the API specification for your review.`;
    points = ['API specifications verified', 'Low-latency retry pipeline confirmed', 'Documentation attached'];
    action = 'Provide API documentation link.';
  } else if (lower.includes('billing') || lower.includes('invoice') || lower.includes('vat')) {
    suggestedText = `Hello ${customerName || ''}, I have retrieved your enterprise billing statements. An itemized invoice breakdown with tax reconciliation has been sent to your registered billing email address.`;
    points = ['Invoice itemization generated', 'Billing account verified', 'Statement delivered'];
    action = 'Confirm invoice delivery to customer.';
  }

  return {
    id: `ai-${Date.now()}`,
    text: suggestedText,
    confidence: 0.94,
    sentiment: tone,
    summary: `Customer inquiry regarding: "${lastCustomerMessage.slice(0, 70)}..."`,
    keyPoints: points,
    suggestedAction: action,
    suggestedPriority: tone === 'urgent' ? 'Urgent' : 'Medium'
  };
}

export async function generateTicketSummary(ticket: Ticket): Promise<{
  summary: string;
  keyPoints: string[];
  suggestedAction: string;
}> {
  await new Promise(resolve => setTimeout(resolve, 400));

  return {
    summary: `Case #${ticket.id} (${ticket.customerName}): ${ticket.subject}. Current status is ${ticket.status} with ${ticket.priority} priority over ${ticket.channel}.`,
    keyPoints: [
      `Assigned to: ${ticket.assignedTo}`,
      `Origin channel: ${ticket.channel}`,
      `SLA health: ${ticket.slaStatus || 'normal'}`
    ],
    suggestedAction: ticket.status === 'Resolved'
      ? 'Case completed. Archive internal notes.'
      : 'Verify resolution with customer before closing.'
  };
}
