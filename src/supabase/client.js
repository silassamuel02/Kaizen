import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ error: new Error("Supabase is not configured"), data: {} }),
        signUp: async () => ({ error: new Error("Supabase is not configured"), data: {} }),
        signOut: async () => {},
        resetPasswordForEmail: async () => ({ error: new Error("Supabase is not configured") }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: new Error("Supabase is not configured") }),
            order: () => ({
              limit: async () => ({ data: [], error: new Error("Supabase is not configured") }),
            }),
          }),
        }),
      }),
    };