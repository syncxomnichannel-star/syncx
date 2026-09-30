import { demoTickets } from '../data/demoData';
import { Ticket, TicketStatus } from '../types';

/**
 * =========================================================================
 * TICKET SERVICE (LOCAL DEMO IMPLEMENTATION)
 * =========================================================================
 * Clean data-access layer for support tickets.
 *
 * NOTE FOR BACKEND/SUPABASE TEAMMATE:
 * To connect Supabase #1 (Application DB), replace the in-memory array
 * manipulations below with your Supabase client queries:
 *   e.g., const { data, error } = await supabase.from('tickets').select('*');
 * The frontend UI components and context call these functions directly,
 * so no component rewriting will be needed.
 * =========================================================================
 */

// In-memory store initialized from demo data
let ticketsStore: Ticket[] = [...demoTickets];

export async function getTickets(): Promise<Ticket[]> {
  // Simulate standard async micro-delay for realistic UI transitions
  await new Promise(resolve => setTimeout(resolve, 80));
  return [...ticketsStore];
}

export async function getTicketById(id: string): Promise<Ticket | null> {
  const ticket = ticketsStore.find(t => t.id === id);
  return ticket ? { ...ticket } : null;
}

export async function createTicket(
  ticketInput: Omit<Ticket, 'id' | 'createdAt'>
): Promise<Ticket> {
  await new Promise(resolve => setTimeout(resolve, 120));

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newTicket: Ticket = {
    ...ticketInput,
    id: `TCK-${randomNum}`,
    createdAt: 'Just now',
    updatedAt: 'Just now',
    slaStatus: 'normal'
  };

  ticketsStore = [newTicket, ...ticketsStore];
  return { ...newTicket };
}

export async function updateTicket(
  id: string,
  updates: Partial<Ticket>
): Promise<Ticket> {
  await new Promise(resolve => setTimeout(resolve, 80));

  const index = ticketsStore.findIndex(t => t.id === id);
  if (index === -1) {
    throw new Error(`Ticket with id ${id} not found.`);
  }

  const updated: Ticket = {
    ...ticketsStore[index],
    ...updates,
    updatedAt: 'Just now'
  };

  ticketsStore[index] = updated;
  return { ...updated };
}

export async function updateTicketStatus(
  id: string,
  status: TicketStatus
): Promise<Ticket> {
  return updateTicket(id, { status });
}

export async function deleteTicket(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 80));
  const prevLen = ticketsStore.length;
  ticketsStore = ticketsStore.filter(t => t.id !== id);
  return ticketsStore.length < prevLen;
}
