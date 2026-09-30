-- Supabase SQL Migration: Enable Public Read Access & RLS Policies
-- Execute this script in your Supabase Dashboard -> SQL Editor to grant anon/authenticated roles access.

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- Enable Row Level Security (RLS) on active database tables
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syncid_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syncid_escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syncid_ticket ENABLE ROW LEVEL SECURITY;

-- Create SELECT policies allowing the frontend client to query real records
DROP POLICY IF EXISTS "Allow public read customers" ON public.customers;
CREATE POLICY "Allow public read customers" ON public.customers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read tickets" ON public.tickets;
CREATE POLICY "Allow public read tickets" ON public.tickets FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read syncid_conversations" ON public.syncid_conversations;
CREATE POLICY "Allow public read syncid_conversations" ON public.syncid_conversations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read syncid_escalations" ON public.syncid_escalations;
CREATE POLICY "Allow public read syncid_escalations" ON public.syncid_escalations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read syncid_ticket" ON public.syncid_ticket;
CREATE POLICY "Allow public read syncid_ticket" ON public.syncid_ticket FOR SELECT USING (true);
