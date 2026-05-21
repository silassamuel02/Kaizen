import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, Moon, Sun, LogOut } from 'lucide-react';

// Inline ThemeToggle to avoid next-themes dependency issue
function ThemeButton() {
  const isDark = document.documentElement.classList.contains('dark');
  const toggle = () => {
    document.documentElement.classList.toggle('dark');
  };
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      style={{
        backgroundColor: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        color: 'var(--text-2)',
      }}
      className="flex items-center justify-center w-9 h-9 hover:bg-[var(--surface-3)] hover:text-[var(--text)] transition-all duration-200"
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}

export default function Topbar({ onMenuClick, onNotificationsClick }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut?.();
    navigate('/login');
  }

  // Get user initials for avatar
  const email = user?.email ?? '';
  const initials = email
    ? email.slice(0, 2).toUpperCase()
    : 'K';

  return (
    <header
      style={{
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        color: 'var(--text)',
      }}
      className="sticky top-0 z-40 flex items-center justify-between gap-4 h-14 px-4 md:px-6 flex-shrink-0"
    >
      {/* ── Left: Mobile menu + breadcrumb ── */}
      <div className="flex items-center gap-3 min-w-0">

        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          aria-label="Open navigation"
          style={{
            backgroundColor: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            color: 'var(--text-2)',
          }}
          className="lg:hidden flex items-center justify-center w-9 h-9 hover:bg-[var(--surface-2)] transition-colors duration-200 flex-shrink-0"
        >
          <Menu size={16} />
        </button>

        {/* Brand name on mobile (when sidebar is hidden) */}
        <span
          className="lg:hidden text-sm font-bold tracking-tight"
          style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
        >
          KAIZEN
        </span>

        {/* Breadcrumb / page label — desktop */}
        <div className="hidden lg:flex items-center gap-2">
          <span
            className="text-xs font-medium"
            style={{ color: 'var(--muted)', letterSpacing: '0.08em' }}
          >
            {user?.email ?? 'Dashboard'}
          </span>
        </div>
      </div>

      {/* ── Right: Actions ── */}
      <div className="flex items-center gap-2 flex-shrink-0">

        {/* Systems status badge — tablet+ */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 h-8 rounded-[var(--radius)]"
          style={{
            backgroundColor: 'var(--success-soft)',
            border: '1px solid var(--border)',
          }}
        >
          <span className="status-dot online" />
          <span className="text-xs font-medium" style={{ color: 'var(--success)' }}>
            Online
          </span>
        </div>

        {/* Theme Toggle */}
        <ThemeButton />

        {/* Notifications */}
        <button
          onClick={onNotificationsClick}
          aria-label="Notifications"
          style={{
            backgroundColor: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            color: 'var(--text-2)',
          }}
          className="relative flex items-center justify-center w-9 h-9 hover:bg-[var(--surface-3)] hover:text-[var(--text)] transition-all duration-200"
        >
          <Bell size={15} />
          <span
            style={{ backgroundColor: 'var(--accent)' }}
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
          />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2">
          <div
            style={{
              backgroundColor: 'var(--accent-soft)',
              border: '1px solid var(--border)',
              color: 'var(--accent)',
              borderRadius: 'var(--radius)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.02em',
            }}
            className="flex items-center justify-center w-9 h-9 flex-shrink-0"
          >
            {initials}
          </div>

          {/* Email label — desktop only */}
          <span
            className="hidden xl:block text-xs font-medium max-w-[140px] truncate"
            style={{ color: 'var(--text-2)' }}
          >
            {email || 'Operator'}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          aria-label="Logout"
          style={{
            backgroundColor: 'var(--danger-soft)',
            border: '1px solid transparent',
            borderRadius: 'var(--radius)',
            color: 'var(--danger)',
          }}
          className="hidden sm:flex items-center gap-1.5 px-3 h-9 text-xs font-medium hover:opacity-80 transition-opacity duration-200"
        >
          <LogOut size={13} />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
