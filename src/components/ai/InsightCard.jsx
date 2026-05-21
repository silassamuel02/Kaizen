import { BrainCircuit } from 'lucide-react';

export default function InsightCard({ title, description, type }) {
  return (
    <div
      className="group relative overflow-hidden rounded-[var(--radius-lg)]
        transition-all duration-250 hover:-translate-y-px hover:shadow-theme"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Amber accent top line */}
      <div
        className="absolute inset-x-0 top-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(90deg, var(--accent), transparent)' }}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0 flex-1">
            <p
              className="label-overline mb-2"
              style={{ color: 'var(--accent)', opacity: 0.8 }}
            >
              {type || 'Insight'}
            </p>
            <h3
              className="text-base font-semibold leading-snug"
              style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
            >
              {title}
            </h3>
          </div>

          {/* Icon badge */}
          <div
            className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-[var(--radius)]"
            style={{
              backgroundColor: 'var(--accent-soft)',
              border: '1px solid var(--border)',
            }}
          >
            <BrainCircuit size={13} style={{ color: 'var(--accent)' }} />
          </div>
        </div>

        {/* Body */}
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--text-2)' }}
        >
          {description}
        </p>

        {/* Footer */}
        <div
          className="mt-4 pt-3 flex items-center justify-between"
          style={{ borderTop: '1px solid var(--border-soft)' }}
        >
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            AI Generated
          </span>
          <div className="flex items-center gap-1.5">
            <span className="status-dot online" />
            <span className="text-xs font-medium" style={{ color: 'var(--success)' }}>
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}