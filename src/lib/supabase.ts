import { createClient } from '@supabase/supabase-js';

const rawSupabaseUrl = (import.meta.env.VITE_SUPABASE_URL ?? '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim();

if (!rawSupabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseUrl =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'primerealestatedr.com' ||
   window.location.hostname === 'www.primerealestatedr.com')
    ? `${window.location.origin}/supabase-proxy`
    : rawSupabaseUrl;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const SUPABASE_URL = supabaseUrl;
export const SUPABASE_ANON_KEY = supabaseAnonKey;

export type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
  updated_at: string;
};
