export default function AuthLayout({ children }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
    >
      {/* Subtle ambient — very restrained */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{ backgroundColor: 'var(--accent-soft)' }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: 'var(--accent-soft)' }}
        />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">

        {/* Brand header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-11 h-11 rounded-[var(--radius-md)] mb-4"
            style={{ backgroundColor: 'var(--accent-soft)', border: '1px solid var(--border)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ color: 'var(--accent)' }}
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <p
            className="label-overline mb-1.5"
            style={{ color: 'var(--muted)' }}
          >
            Welcome back
          </p>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: 'var(--text)', letterSpacing: '-0.04em' }}
          >
            KAIZEN
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: 'var(--text-2)' }}
          >
            Operational Intelligence Platform
          </p>
        </div>

        {/* Auth form card */}
        <div
          className="rounded-[var(--radius-xl)] p-6 sm:p-8"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {children}
        </div>

        {/* Footer */}
        <p
          className="text-center text-xs mt-6"
          style={{ color: 'var(--muted)', opacity: 0.7 }}
        >
          Secured by Supabase Auth
        </p>
      </div>
    </div>
  );
}
