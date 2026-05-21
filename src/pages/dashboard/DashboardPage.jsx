import Card from '../../components/ui/Card';
import WorkspaceTable from '../../components/dashboard/WorkspaceTable';
import ActivityTimeline from '../../components/dashboard/ActivityTimeline';
import { Activity, ShieldCheck, Layers3, Database } from 'lucide-react';

const stats = [
  { title: 'Operational Status', value: '98.2%',  description: 'Realtime systems active',    icon: Activity,    accent: true },
  { title: 'Workspace Nodes',    value: '24',      description: 'Connected environments',     icon: Layers3,     accent: false },
  { title: 'Security Layer',     value: 'Secure',  description: 'No active threats',          icon: ShieldCheck, accent: false },
  { title: 'Database Load',      value: '42%',     description: 'Stable infrastructure',      icon: Database,    accent: false },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-slide">

      {/* ── Page Header ── */}
      <div className="mb-2">
        <p className="label-overline mb-1">Overview</p>
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}
        >
          Dashboard
        </h1>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="label-overline mb-3" style={{ color: 'var(--muted)' }}>
                    {item.title}
                  </p>
                  <p
                    className="text-2xl sm:text-3xl font-bold tracking-tight"
                    style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}
                  >
                    {item.value}
                  </p>
                </div>
                <div
                  className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-[var(--radius)]"
                  style={{
                    backgroundColor: 'var(--accent-soft)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <Icon size={16} style={{ color: 'var(--accent)' }} strokeWidth={2} />
                </div>
              </div>
              <p
                className="mt-4 text-xs"
                style={{ color: 'var(--text-2)' }}
              >
                {item.description}
              </p>
            </Card>
          );
        })}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">

        {/* Workspace Table */}
        <WorkspaceTable />

        {/* Right column */}
        <div className="space-y-5">

          {/* Operational Health */}
          <Card>
            <p className="label-overline mb-1" style={{ color: 'var(--muted)' }}>
              Operational Health
            </p>
            <h3
              className="text-lg font-semibold mb-5"
              style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
            >
              Systems Stable
            </h3>

            <div className="space-y-3">
              {['Realtime Sync', 'Workspace Nodes', 'Edge Functions', 'Database Systems'].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between py-2"
                  style={{ borderBottom: '1px solid var(--border-soft)' }}
                >
                  <span className="text-sm" style={{ color: 'var(--text-2)' }}>
                    {item}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="status-dot online" />
                    <span className="text-xs font-medium" style={{ color: 'var(--success)' }}>
                      Online
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Activity Timeline */}
          <ActivityTimeline />
        </div>
      </div>
    </div>
  );
}