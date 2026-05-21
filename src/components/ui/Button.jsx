import { cn } from '../../lib/utils';

const variantStyles = {
  primary:   'btn btn-primary',
  secondary: 'btn btn-secondary',
  ghost:     'btn btn-ghost',
  danger:    'btn btn-danger',
};

const sizeStyles = {
  sm:  'text-xs px-3 py-1.5 gap-1.5',
  md:  'text-sm px-4 py-2 gap-2',
  lg:  'text-base px-5 py-2.5 gap-2',
  icon: 'w-9 h-9 p-0 rounded-[var(--radius)]',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  ...props
}) {
  return (
    <button
      className={cn(
        variantStyles[variant] ?? variantStyles.primary,
        sizeStyles[size] ?? sizeStyles.md,
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span
          className="inline-block w-3.5 h-3.5 border-2 rounded-full animate-spin"
          style={{ borderColor: 'currentColor', borderTopColor: 'transparent' }}
        />
      )}
      {children}
    </button>
  );
}

// Named export for legacy imports
export { Button };