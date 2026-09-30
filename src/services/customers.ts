import { supabase } from '../lib/supabase';
import { Customer } from '../types';

/**
 * CUSTOMER SERVICE
 * Data access layer connecting to active Supabase table: `customers`.
 */
export async function getCustomers(): Promise<Customer[]> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase customers fetch warning:', error.message);
      return [];
    }

    if (!data) return [];

    return data.map((c: any) => ({
      id: String(c.id),
      uniqueCustomerId: c.customer_code || `CUS_${String(c.id).slice(0, 8)}`,
      name: c.email ? c.email.split('@')[0] : `Customer ${c.customer_code || ''}`,
      email: c.email || c.verified_email || '',
      phone: c.phone || undefined,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
      status: c.authentication_status === 'AUTHENTICATED' ? 'Active' : 'lead',
      channel: 'Email',
      isEmailVerified: Boolean(c.email_verified || c.verified_email),
      createdAt: c.created_at ? new Date(c.created_at).toLocaleDateString() : undefined
    }));
  } catch (err: any) {
    console.error('getCustomers exception:', err);
    return [];
  }
}

export async function getCustomer(customerId: string): Promise<Customer | null> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', customerId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: String(data.id),
      uniqueCustomerId: data.customer_code,
      name: data.email ? data.email.split('@')[0] : 'Customer',
      email: data.email || data.verified_email || '',
      phone: data.phone || undefined,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
      status: data.authentication_status === 'AUTHENTICATED' ? 'Active' : 'lead',
      channel: 'Email',
      isEmailVerified: Boolean(data.email_verified || data.verified_email),
      createdAt: data.created_at ? new Date(data.created_at).toLocaleDateString() : undefined
    };
  } catch (err) {
    return null;
  }
}
