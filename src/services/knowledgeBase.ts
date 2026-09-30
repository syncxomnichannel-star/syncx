import { supabase } from '../lib/supabase';

export interface KBDocument {
  id: string | number;
  title: string;
  content: string;
  category: string;
  metadata?: Record<string, any>;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

/**
 * KNOWLEDGE BASE SERVICE
 * Data access layer querying active Supabase table: `syncid_kb_documents`.
 * Excludes raw vector embedding columns from UI display.
 */
export async function getKnowledgeBase(): Promise<KBDocument[]> {
  try {
    const { data, error } = await supabase
      .from('syncid_kb_documents')
      .select('id, title, content, category, metadata, tags, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('syncid_kb_documents query note:', error.message);
      return [];
    }

    if (!data) return [];

    return data.map((r: any) => ({
      id: r.id,
      title: r.title || 'Untitled Document',
      content: r.content || '',
      category: r.category || 'General',
      metadata: r.metadata || {},
      tags: Array.isArray(r.tags) ? r.tags : (r.tags ? [r.tags] : []),
      createdAt: r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Just now',
      updatedAt: r.updated_at ? new Date(r.updated_at).toLocaleDateString() : undefined
    }));
  } catch (err: any) {
    console.error('getKnowledgeBase exception:', err);
    return [];
  }
}
