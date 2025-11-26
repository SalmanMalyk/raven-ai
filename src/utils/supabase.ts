import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables: SUPABASE_URL and SUPABASE_ANON_KEY are required');
}

// Global Supabase client (for non-authenticated operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Create an authenticated Supabase client with user's JWT token
 * This is required for Row Level Security (RLS) to work properly
 */
export const getAuthenticatedSupabaseClient = (token: string): SupabaseClient => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
};
