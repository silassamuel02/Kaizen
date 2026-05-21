import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import EmptyState from '../../components/ui/EmptyState';
import { Clock } from 'lucide-react';

export default function ActivityPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    fetchActivities();
    const channel = supabase
      .channel('activities-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, fetchActivities)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  async function fetchActivities() {
    const { data, error } = await supabase
      .from('activities').select('*').order('created_at', { ascending: false });
    if (!error) setActivities(data || []);
    setLoading(false);
  }

  return (
    <div className="space-y-6 animate-fade-slide">
      {/* Page Header */}
      <div>
        <p className="label-overline mb-1" style={{ color: 'var(--muted)' }}>
          Operational History
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}>
          Activity
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-2)' }}>
          Monitor workspace actions, sync events, and system operations in realtime.
        </p>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 rounded-[var(--radius-lg)] animate-pulse"
              style={{ backgroundColor: 'var(--surface-2)' }} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && activities.length === 0 && (
        <EmptyState
          title="No activity yet"
          description="Operational history will appear here as your workspace ecosystem becomes active."
        />
      )}

      {/* Timeline */}
      {!loading && activities.length > 0 && (
        <div className="relative max-w-3xl">
          {/* Vertical spine */}
          <div
            className="absolute left-[18px] top-6 bottom-0 w-px"
            style={{ backgroundColor: 'var(--border-medium)' }}
          />

          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div key={activity.id} className="relative flex gap-4">
                {/* Node */}
                <div
                  className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0 mt-1"
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border-medium)',
                  }}
                >
                  <div className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: 'var(--accent)' }} />
                </div>

                {/* Card */}
                <div
                  className="flex-1 rounded-[var(--radius-lg)] px-4 py-3 mb-1
                    transition-colors duration-150 hover:bg-[var(--surface-2)]"
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <span
                        className="inline-block label-overline mb-1.5"
                        style={{ color: 'var(--accent)', opacity: 0.8 }}
                      >
                        {activity.type}
                      </span>
                      <p className="text-sm leading-relaxed"
                        style={{ color: 'var(--text)' }}>
                        {activity.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Clock size={11} style={{ color: 'var(--muted)' }} />
                      <time className="text-xs whitespace-nowrap" style={{ color: 'var(--muted)' }}>
                        {new Date(activity.created_at).toLocaleString(undefined, {
                          month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}