/*
# Create ad_leads table for Google/Meta ad campaign landing page

1. New Tables
  - `ad_leads`
    - `id` (uuid, primary key)
    - `name` (text, not null) — lead's full name
    - `phone` (text, not null) — lead's phone number
    - `email` (text, nullable) — lead's email address
    - `zip_code` (text, nullable) — service area qualifier
    - `service_type` (text, nullable) — which service they're interested in (junk_removal, appliance, cleanout, debris, yard, other)
    - `message` (text, nullable) — free-text description of what they need hauled
    - `source` (text, not null) — which ad platform sent them (google, meta, direct, etc.)
    - `campaign` (text, nullable) — campaign name/id for tracking
    - `status` (text, not null default 'new') — lead status: new, contacted, booked, lost
    - `created_at` (timestamptz, default now())
    - `updated_at` (timestamptz, default now())

2. Security
  - Enable RLS on `ad_leads`.
  - Allow anon + authenticated to INSERT (the landing page form is public, no login).
  - Allow authenticated only to SELECT/UPDATE (admins follow up on leads).
  - No anon SELECT — leads contain customer PII and must not be readable by anonymous visitors.

3. Notes
  - This is a no-auth landing page: visitors submit a lead form without signing in.
  - Only admins (authenticated) can view or manage leads.
  - Phone validation is done client-side; the database stores the raw string.
*/

CREATE TABLE IF NOT EXISTS ad_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  zip_code text,
  service_type text,
  message text,
  source text NOT NULL DEFAULT 'direct',
  campaign text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ad_leads ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_ad_leads_created_at ON ad_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ad_leads_source ON ad_leads(source);
CREATE INDEX IF NOT EXISTS idx_ad_leads_status ON ad_leads(status);

DROP POLICY IF EXISTS "anon_insert_ad_leads" ON ad_leads;
CREATE POLICY "anon_insert_ad_leads"
  ON ad_leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_ad_leads" ON ad_leads;
CREATE POLICY "auth_select_ad_leads"
  ON ad_leads FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "auth_update_ad_leads" ON ad_leads;
CREATE POLICY "auth_update_ad_leads"
  ON ad_leads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
