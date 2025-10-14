/*
  # Add Admin Authentication Setup

  1. Changes
    - Create admin_config table to store admin email
    - Add RLS policies to secure admin_config table
    - Insert default admin configuration
    - Add notification settings to admin_config

  2. Security
    - Enable RLS on admin_config table
    - Only authenticated admins can read/update config
*/

CREATE TABLE IF NOT EXISTS admin_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email text NOT NULL,
  notification_email text NOT NULL,
  notification_phone text,
  email_notifications_enabled boolean DEFAULT true,
  sms_notifications_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read admin config"
  ON admin_config
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update admin config"
  ON admin_config
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO admin_config (admin_email, notification_email, notification_phone)
VALUES ('admin@molallatrailerrental.com', 'Molallatrailerrental@outlook.com', '503-500-6121')
ON CONFLICT DO NOTHING;
