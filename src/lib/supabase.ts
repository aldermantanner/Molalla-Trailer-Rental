import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Booking = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  date_of_birth?: string | null;
  drivers_license_number?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  service_type: 'rental' | 'junk_removal';
  start_date: string;
  end_date: string | null;
  delivery_address: string;
  delivery_required: boolean;
  notes: string;
  status: 'pending' | 'confirmed' | 'active' | 'overdue' | 'completed' | 'cancelled';
  total_price: number;
  payment_status?: 'pending' | 'deposit_paid' | 'paid' | 'refunded';
  deposit_amount?: number;
  deposit_refunded?: boolean;
  deposit_refund_amount?: number;
  created_by_admin?: boolean;
  license_uploaded?: boolean;
  insurance_uploaded?: boolean;
  created_at: string;
  updated_at: string;
};

export type TrailerAvailability = {
  id: string;
  date: string;
  available_trailers: number;
  created_at: string;
  updated_at: string;
};
