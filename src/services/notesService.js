import { supabase } from '../supabase/client';

export async function getNotes(userId) {
  return supabase.from('notes').select('*').eq('owner_id', userId).order('updated_at', { ascending: false });
}

export async function createNote(values) {
  return supabase.from('notes').insert(values).select();
}

export async function updateNote(noteId, values) {
  return supabase.from('notes').update(values).eq('id', noteId).select();
}

export async function deleteNote(noteId) {
  return supabase.from('notes').delete().eq('id', noteId);
}
