import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import InsightCard from '../../components/ai/InsightCard';
import EmptyState from '../../components/ui/EmptyState';
import { BrainCircuit, Zap } from 'lucide-react';

export default function AIInsightsPage() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    fetchInsights();
    const channels = [
      supabase.channel('ai-workspaces')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'workspaces' }, fetchInsights)
        .subscribe(),
      supabase.channel('ai-notes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, fetchInsights)
        .subscribe(),
      supabase.channel('ai-activities')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, fetchInsights)
        .subscribe(),
    ];
    return () => channels.forEach(c => supabase.removeChannel(c));
  }, []);

  async function fetchInsights() {
    try {
      setLoading(true);
      setError(null);
      const [{ data: workspaces }, { data: notes }, { data: activities }] = await Promise.all([
        supabase.from('workspaces').select('*'),
        supabase.from('notes').select('*'),
        supabase.from('activities').select('*'),
      ]);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-insights`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ workspaces, notes, activities }),
        }
      );

      if (!response.ok) throw new Error(`API error ${response.status}`);
      const data = await response.json();
      setInsights(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('AI Insights Error:', err);
      setError('Unable to generate insights. Please try again.');
      setInsights([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 animate-fade-slide">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="label-overline mb-1" style={{ color: 'var(--muted)' }}>
            Intelligence Layer
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}>
            AI Insights
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-2)' }}>
            Realtime workspace analysis powered by adaptive operational intelligence.
          </p>
        </div>

        {/* Status badge */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius)]"
          style={{ backgroundColor: 'var(--success-soft)', border: '1px solid var(--border)' }}
        >
          <span className="status-dot online animate-pulse-soft" />
          <span className="text-xs font-medium" style={{ color: 'var(--success)' }}>
            AI Active
          </span>
        </div>
      </div>

      {/* Hero info strip */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-px overflow-hidden rounded-[var(--radius-lg)]"
        style={{ border: '1px solid var(--border)', backgroundColor: 'var(--border)' }}
      >
        {[
          { label: 'Processing', value: 'Live', icon: Zap },
          { label: 'Data Sources', value: '3 Tables', icon: BrainCircuit },
          { label: 'Insights', value: loading ? '—' : `${insights.length} Generated`, icon: BrainCircuit },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-3 px-5 py-4"
            style={{ backgroundColor: 'var(--surface)' }}>
            <div className="flex items-center justify-center w-8 h-8 rounded-[var(--radius)] flex-shrink-0"
              style={{ backgroundColor: 'var(--accent-soft)', border: '1px solid var(--border)' }}>
              <Icon size={13} style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <p className="label-overline" style={{ color: 'var(--muted)' }}>{label}</p>
              <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text)' }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i}
              className="h-40 rounded-[var(--radius-lg)] animate-pulse"
              style={{ backgroundColor: 'var(--surface-2)' }}
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div
          className="px-4 py-3 rounded-[var(--radius)] text-sm"
          style={{ backgroundColor: 'var(--danger-soft)', color: 'var(--danger)', border: '1px solid transparent' }}
        >
          {error}
        </div>
      )}

      {/* Insights grid */}
      {!loading && !error && insights.length > 0 && (
        <div>
          <p className="label-overline mb-4" style={{ color: 'var(--muted)' }}>
            Operational Analysis
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="animate-fade-slide"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <InsightCard
                  type={insight.type}
                  title={insight.title}
                  description={insight.description}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && insights.length === 0 && (
        <EmptyState
          title="No insights yet"
          description="Add notes, workspaces, and activities to generate AI-powered operational insights."
        />
      )}
    </div>
  );
}