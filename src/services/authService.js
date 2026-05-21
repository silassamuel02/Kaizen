import { supabase } from '../supabase/client';

export async function fetchProfile(userId) {
  return supabase.from('profiles').select('*').eq('id', userId).single();
}

export async function updateProfile(userId, values) {
  return supabase.from('profiles').update(values).eq('id', userId);
}
