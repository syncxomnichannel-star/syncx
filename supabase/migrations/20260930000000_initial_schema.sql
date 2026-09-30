-- Initial Schema Migration generated for Supabase (mccnykxameoakngjhxpx)

CREATE TABLE IF NOT EXISTS public.customers (
  id UUID DEFAULT gen_random_uuid() NOT NULL,
  customer_code TEXT,
  email TEXT,
  verified_email TEXT,
  email_verified BOOLEAN DEFAULT false,
  authentication_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.otp_verifications (
  id BIGINT NOT NULL,
  email TEXT NOT NULL,
  otp_hash TEXT NOT NULL,
  attempts INTEGER DEFAULT 0 NOT NULL,
  verified_email BOOLEAN DEFAULT false NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.syncid_agent_events (
  event_id BIGINT NOT NULL,
  conversation_id TEXT,
  customer_id TEXT,
  ticket_id TEXT,
  agent USER-DEFINED NOT NULL,
  action TEXT NOT NULL,
  input_summary TEXT,
  output_summary TEXT,
  status TEXT DEFAULT 'SUCCESS'::text NOT NULL,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (event_id)
);

CREATE TABLE IF NOT EXISTS public.syncid_conversations (
  conversation_id TEXT NOT NULL,
  customer_id TEXT,
  channel USER-DEFINED NOT NULL,
  channel_user_id TEXT,
  authentication_status USER-DEFINED DEFAULT 'NOT_AUTHENTICATED'::syncid_auth_status NOT NULL,
  workflow_state USER-DEFINED DEFAULT 'NEW'::syncid_workflow_state NOT NULL,
  pending_action TEXT,
  current_agent USER-DEFINED,
  active_ticket_id TEXT,
  last_intent TEXT,
  last_customer_message TEXT,
  last_agent_response TEXT,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  chat_id TEXT,
  auth_step TEXT,
  intent TEXT,
  pending_issue TEXT,
  ticket_id TEXT,
  ticket_status TEXT,
  ticket_priority TEXT,
  last_route TEXT,
  state TEXT,
  PRIMARY KEY (conversation_id)
);

CREATE TABLE IF NOT EXISTS public.syncid_customers (
  customer_id TEXT NOT NULL,
  email TEXT NOT NULL,
  email_verified BOOLEAN DEFAULT false NOT NULL,
  full_name TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (customer_id)
);

CREATE TABLE IF NOT EXISTS public.syncid_escalations (
  id BIGINT NOT NULL,
  escalation_id TEXT NOT NULL,
  status TEXT,
  priority TEXT,
  reason TEXT,
  channel TEXT,
  customer_id TEXT,
  ticket_id TEXT,
  conversation_id TEXT,
  last_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.syncid_kb_documents (
  id BIGINT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  source_name TEXT,
  source_url TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  embedding USER-DEFINED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.syncid_live_support (
  live_support_id BIGINT NOT NULL,
  ticket_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  support_type USER-DEFINED NOT NULL,
  customer_problem TEXT NOT NULL,
  conversation_summary TEXT,
  previous_ticket_context TEXT,
  troubleshooting_attempts TEXT,
  agent_assistance_summary TEXT,
  priority USER-DEFINED,
  ticket_level USER-DEFINED,
  estimated_resolution_minutes INTEGER,
  employee_name TEXT,
  employee_id TEXT,
  booking_status TEXT DEFAULT 'REQUESTED'::text NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  employee_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (live_support_id)
);

CREATE TABLE IF NOT EXISTS public.syncid_messages (
  message_id TEXT NOT NULL,
  conversation_id TEXT NOT NULL,
  customer_id TEXT,
  channel USER-DEFINED NOT NULL,
  sender_type USER-DEFINED NOT NULL,
  agent_name USER-DEFINED,
  external_message_id TEXT,
  message_text TEXT NOT NULL,
  intent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (message_id)
);

CREATE TABLE IF NOT EXISTS public.syncid_otp_verifications (
  otp_id BIGINT NOT NULL,
  email TEXT NOT NULL,
  otp_hash TEXT NOT NULL,
  status USER-DEFINED DEFAULT 'PENDING'::syncid_otp_status NOT NULL,
  attempts INTEGER DEFAULT 0 NOT NULL,
  max_attempts INTEGER DEFAULT 5 NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (otp_id)
);

CREATE TABLE IF NOT EXISTS public.syncid_ticket (
  id BIGINT NOT NULL,
  ticket_id TEXT NOT NULL,
  priority TEXT,
  scoring JSONB,
  scored_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.syncid_ticket_events (
  event_id BIGINT NOT NULL,
  ticket_id TEXT NOT NULL,
  customer_id TEXT,
  event_type TEXT NOT NULL,
  previous_status USER-DEFINED,
  new_status USER-DEFINED,
  previous_priority USER-DEFINED,
  new_priority USER-DEFINED,
  actor USER-DEFINED,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (event_id)
);

CREATE TABLE IF NOT EXISTS public.syncid_ticket_scores (
  score_id BIGINT NOT NULL,
  ticket_id TEXT NOT NULL,
  priority USER-DEFINED NOT NULL,
  ticket_level USER-DEFINED NOT NULL,
  estimated_resolution_minutes INTEGER,
  severity_score INTEGER,
  urgency_score INTEGER,
  customer_impact_score INTEGER,
  business_impact_score INTEGER,
  reasoning TEXT,
  scored_by USER-DEFINED DEFAULT 'AGENT_2_TICKET_SCORING'::syncid_agent NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (score_id)
);

CREATE TABLE IF NOT EXISTS public.syncid_tickets (
  ticket_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  conversation_id TEXT,
  channel USER-DEFINED NOT NULL,
  subject TEXT,
  description TEXT NOT NULL,
  last_message TEXT,
  ai_summary TEXT,
  status USER-DEFINED DEFAULT 'OPEN'::syncid_ticket_status NOT NULL,
  priority USER-DEFINED DEFAULT 'MEDIUM'::syncid_priority NOT NULL,
  ticket_level USER-DEFINED,
  estimated_resolution_minutes INTEGER,
  current_agent USER-DEFINED,
  requested_support_type USER-DEFINED,
  resolution TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (ticket_id)
);

CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID DEFAULT gen_random_uuid() NOT NULL,
  ticket_code TEXT NOT NULL,
  customer_id TEXT,
  conversation_id TEXT,
  channel TEXT,
  status TEXT DEFAULT 'OPEN'::text,
  issue_description TEXT,
  severity TEXT,
  urgency TEXT,
  estimated_resolution_time TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (id)
);

