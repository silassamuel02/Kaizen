import { Inbox } from 'lucide-react';

export default function EmptyState({ title, description, action }) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center px-6 py-16 sm:py-24 rounded-[var(--radius-xl)]"
      style={{
        border: '1px dashed var(--border-medium)',
        backgroundColor: 'var(--surface)',
      }}
    >
      <div
        className="flex items-center justify-center w-12 h-12 rounded-[var(--radius-lg)] mb-5"
        style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)' }}
      >
        <Inbox size={20} style={{ color: 'var(--muted)' }} />
      </div>

      <h3
        className="text-base font-semibold mb-2"
        style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}
      >
        {title}
      </h3>

      <p
        className="text-sm leading-relaxed max-w-sm"
        style={{ color: 'var(--text-2)' }}
      >
        {description}
      </p>

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}