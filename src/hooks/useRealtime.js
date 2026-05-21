import { useEffect } from 'react';
import { supabase } from '../supabase/client';

export function useRealtime(workspaceId, onUpdate) {
  useEffect(() => {
    if (!workspaceId) return undefined;

    const channel = supabase
      .channel(`workspace-${workspaceId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, payload => {
        onUpdate?.(payload);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workspaceId, onUpdate]);
}
