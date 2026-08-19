-- BluWav Growth: Applications Table
-- Run this in Supabase Dashboard > SQL Editor

CREATE TABLE IF NOT EXISTS public.applications (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      timestamptz DEFAULT now(),
  role            text,
  name            text,
  email           text,
  phone           text,
  location        text,
  experience      text,
  applicant_role  text,
  skills          text,
  why_bluwav      text,
  availability    text,
  linkedin        text,
  resume_name     text,
  casl_consent    boolean DEFAULT false,
  status          text DEFAULT 'New',
  notes           text,
  reviewed_at     timestamptz,
  reviewed_by     text
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert" ON public.applications
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "auth_all" ON public.applications
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
