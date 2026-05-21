import { supabase } from '../supabase/client';

export async function getWorkspaces(userId) {
  return supabase.from('workspaces').select('*').or(`owner_id.eq.${userId},memberships.user_id.eq.${userId}`).limit(50);
}

export async function createWorkspace(values) {
  return supabase.from('workspaces').insert(values).select();
}

export async function joinWorkspace(workspaceId, userId) {
  return supabase.from('memberships').insert({ workspace_id: workspaceId, user_id: userId, role: 'member' }).select();
}

export async function getWorkspaceActivities(workspaceId) {
  return supabase.from('activities').select('*').eq('workspace_id', workspaceId).order('created_at', { ascending: false });
}
