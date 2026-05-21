const activities = [
  { title: 'Workspace updated',        description: 'Infrastructure workspace configuration modified.',    time: '2m ago' },
  { title: 'Realtime sync completed',  description: 'Workspace nodes synchronized successfully.',           time: '12m ago' },
  { title: 'New collaborator added',   description: 'Access permissions updated for operations team.',      time: '28m ago' },
  { title: 'Edge function deployed',   description: 'Operational analysis endpoint updated.',               time: '1h ago' },
];

export default function ActivityTimeline() {
  return (
    <div
      className="overflow-hidden rounded-[var(--radius-lg)]"
      style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      {/* Header */}
      <div
        className="px-5 py-4"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <p className="label-overline mb-1" style={{ color: 'var(--muted)' }}>
          Activity Feed
        </p>
        <h3
          className="text-base font-semibold"
          style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
        >
          Recent Operations
        </h3>
      </div>

      {/* Timeline */}
      <div className="p-5 space-y-5">
        {activities.map((activity, index) => (
          <div key={index} className="relative pl-5">

            {/* Connector line */}
            {index !== activities.length - 1 && (
              <div
                className="absolute left-[6px] top-4 w-px"
                style={{
                  height: 'calc(100% + 12px)',
                  backgroundColor: 'var(--border-medium)',
                }}
              />
            )}

            {/* Dot */}
            <div
              className="absolute left-0 top-1 w-3 h-3 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-medium)' }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: 'var(--success)' }}
              />
            </div>

            {/* Content */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium leading-snug" style={{ color: 'var(--text)' }}>
                  {activity.title}
                </p>
                <span
                  className="text-xs whitespace-nowrap flex-shrink-0 mt-0.5"
                  style={{ color: 'var(--muted)' }}
                >
                  {activity.time}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>
                {activity.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
