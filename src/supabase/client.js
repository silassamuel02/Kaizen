import { createClient } from "@supabase/supabase-js";

const { VITE_SUPABASE_URL: supabaseUrl, VITE_SUPABASE_ANON_KEY: supabaseAnonKey } = import.meta.env;

if (!supabaseUrl) {
  throw new Error(
    'VITE_SUPABASE_URL is required. Add it to your .env (VITE_SUPABASE_URL) and restart the dev server.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'VITE_SUPABASE_ANON_KEY is required. Add it to your .env (VITE_SUPABASE_ANON_KEY) and restart the dev server.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);