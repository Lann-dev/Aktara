import { createClient } from '@supabase/supabase-js';

// Fallback dummy credentials if environment variables are not supplied yet
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

if (Boolean(supabaseUrl) !== Boolean(supabaseAnonKey)) {
  throw new Error('Set both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

if (!hasSupabaseConfig && !import.meta.env.DEV) {
  throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

const clientUrl = supabaseUrl || 'http://127.0.0.1:54321';
const clientAnonKey = supabaseAnonKey || 'development-only-placeholder-key';

export const supabase = createClient(clientUrl, clientAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

