import { cn } from '../../lib/utils';

export default function Card({ children, className = '', hover = true, padding = true }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[var(--radius-lg)]',
        'transition-all duration-250 ease-smooth',
        hover && 'hover:-translate-y-px hover:shadow-theme hover:border-[var(--border-medium)]',
        className
      )}
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      {/* Subtle top-edge highlight — adds depth without glow */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, var(--border-medium), transparent)' }}
      />

      <div className={padding ? 'p-5 sm:p-6' : ''}>
        {children}
      </div>
    </div>
  );
}