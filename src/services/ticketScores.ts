import { supabase } from '../lib/supabase';

export interface TicketScoreData {
  id: string | number;
  ticketId: string;
  priority: string;
  severity?: string;
  urgency?: string;
  score?: number;
  confidence?: number;
  sentiment?: string;
  category?: string;
  ticketLevel?: string;
  estimatedResolutionMinutes?: number;
  scoringReason?: string;
  customerImpact?: string;
  businessImpact?: string;
  scoredAt?: string;
}

/**
 * TICKET SCORES SERVICE
 * Data access layer querying active Supabase table: `syncid_ticket`.
 */
export async function getTicketScores(ticketCodeOrId?: string): Promise<TicketScoreData[]> {
  try {
    let query = supabase.from('syncid_ticket').select('*').order('created_at', { ascending: false });

    if (ticketCodeOrId) {
      query = query.or(`ticket_id.eq.${ticketCodeOrId},ticket_id.ilike.%${ticketCodeOrId}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('syncid_ticket query note:', error.message);
      return [];
    }

    if (!data) return [];

    return data.map((r: any) => {
      let parsedScoring: any = {};
      if (typeof r.scoring === 'string') {
        try {
          parsedScoring = JSON.parse(r.scoring);
        } catch (e) {
          parsedScoring = {};
        }
      } else if (typeof r.scoring === 'object' && r.scoring !== null) {
        parsedScoring = r.scoring;
      }

      return {
        id: r.id,
        ticketId: r.ticket_id,
        priority: r.priority || parsedScoring.priority || 'MEDIUM',
        severity: parsedScoring.severity || 'MEDIUM',
        urgency: parsedScoring.urgency || 'MEDIUM',
        score: parsedScoring.score ?? (parsedScoring.priority === 'HIGH' ? 85 : 70),
        confidence: parsedScoring.confidence ?? 0.95,
        sentiment: parsedScoring.sentiment || 'neutral',
        category: parsedScoring.ticket_level || parsedScoring.category || 'General',
        ticketLevel: parsedScoring.ticket_level || 'L1',
        estimatedResolutionMinutes: parsedScoring.estimated_resolution_minutes || 30,
        scoringReason: parsedScoring.scoring_reason || '',
        customerImpact: parsedScoring.customer_impact || '',
        businessImpact: parsedScoring.business_impact || '',
        scoredAt: r.scored_at || r.created_at
      };
    });
  } catch (err: any) {
    console.error('getTicketScores exception:', err);
    return [];
  }
}
