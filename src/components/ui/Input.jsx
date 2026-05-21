export default function Input({
  label,
  hint,
  error,
  className = '',
  id,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          style={{ color: 'var(--text-2)', fontSize: '11px', letterSpacing: '0.1em' }}
          className="font-semibold uppercase"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={`input-base ${className}`}
        style={error ? { borderColor: 'var(--danger)', boxShadow: '0 0 0 3px var(--danger-soft)' } : {}}
        {...props}
      />

      {hint && !error && (
        <p className="text-xs" style={{ color: 'var(--muted)' }}>{hint}</p>
      )}
      {error && (
        <p className="text-xs" style={{ color: 'var(--danger)' }}>{error}</p>
      )}
    </div>
  );
}