const statusColor = {
  Active:     { dot: 'online',  bg: 'var(--success-soft)',  text: 'var(--success)' },
  Monitoring: { dot: 'warning', bg: 'var(--accent-soft)',   text: 'var(--accent)' },
  Review:     { dot: 'offline', bg: 'var(--danger-soft)',   text: 'var(--danger)' },
};

const workspaces = [
  { name: 'Operations Hub',   status: 'Active',     members: 12, updated: '2m ago' },
  { name: 'Infrastructure',   status: 'Monitoring', members: 7,  updated: '12m ago' },
  { name: 'Analytics',        status: 'Active',     members: 18, updated: '1h ago' },
  { name: 'Security Layer',   status: 'Review',     members: 5,  updated: '3h ago' },
];

export default function WorkspaceTable() {
  return (
    <div
      className="overflow-hidden rounded-[var(--radius-lg)]"
      style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div>
          <p className="label-overline mb-1" style={{ color: 'var(--muted)' }}>
            Overview
          </p>
          <h3
            className="text-base font-semibold"
            style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
          >
            Active Workspaces
          </h3>
        </div>
        <button
          className="btn btn-secondary text-xs px-3 py-1.5"
        >
          View All
        </button>
      </div>

      {/* Table — horizontally scrollable on mobile */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px]">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Workspace', 'Status', 'Members', 'Updated'].map((col) => (
                <th
                  key={col}
                  className="px-5 py-3 text-left label-overline"
                  style={{ color: 'var(--muted)' }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {workspaces.map((ws, i) => {
              const s = statusColor[ws.status] ?? statusColor.Active;
              return (
                <tr
                  key={i}
                  className="group transition-colors duration-150 cursor-pointer"
                  style={{ borderBottom: i < workspaces.length - 1 ? '1px solid var(--border-soft)' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--surface-2)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                      {ws.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                      Operational workspace
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: s.bg, color: s.text }}
                    >
                      <span className={`status-dot ${s.dot}`} />
                      {ws.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm" style={{ color: 'var(--text-2)' }}>
                    {ws.members}
                  </td>
                  <td className="px-5 py-4 text-sm" style={{ color: 'var(--muted)' }}>
                    {ws.updated}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}