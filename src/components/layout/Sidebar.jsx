import { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, FileText, BrainCircuit,
  Activity, Settings, User, Zap, X, Menu,
} from 'lucide-react';
import { ROUTES } from '../../utils/routes';

const links = [
  { label: 'Dashboard', to: ROUTES.dashboard, icon: LayoutDashboard },
  { label: 'Workspace',  to: ROUTES.workspace,  icon: Briefcase },
  { label: 'Notes',      to: ROUTES.notes,      icon: FileText },
  { label: 'AI',         to: ROUTES.ai,         icon: BrainCircuit },
  { label: 'Activity',   to: ROUTES.activity,   icon: Activity },
  { label: 'Settings',   to: ROUTES.settings,   icon: Settings },
  { label: 'Profile',    to: ROUTES.profile,    icon: User },
];

// The actual sidebar panel (reused for both desktop + mobile drawer)
function SidebarPanel({ onClose }) {
  return (
    <div
      style={{ backgroundColor: 'var(--surface)', color: 'var(--text)' }}
      className="flex flex-col h-full w-full"
    >
      {/* ── Brand ── */}
      <div className="flex items-center justify-between px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div
            style={{
              backgroundColor: 'var(--accent-soft)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
            }}
            className="flex items-center justify-center w-9 h-9 flex-shrink-0"
          >
            <Zap size={16} style={{ color: 'var(--accent)' }} strokeWidth={2.5} />
          </div>
          <div>
            <p
              style={{ color: 'var(--muted)', fontSize: '9px', letterSpacing: '0.2em' }}
              className="uppercase font-semibold mb-0.5"
            >
              Platform
            </p>
            <h1
              style={{ color: 'var(--text)', fontSize: '1.1rem', letterSpacing: '-0.04em', fontWeight: 800, lineHeight: 1 }}
            >
              KAIZEN
            </h1>
          </div>
        </div>

        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-[var(--radius)] hover:bg-[var(--surface-2)] transition-colors"
            style={{ color: 'var(--text-2)' }}
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* ── Divider ── */}
      <div style={{ borderTop: '1px solid var(--border-soft)', margin: '0 20px' }} />

      {/* ── Nav ── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-[var(--text)]'
                    : 'text-[var(--text-2)] hover:text-[var(--text)]'
                }`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? 'var(--surface-2)' : 'transparent',
              })}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute', left: 0, top: '25%', bottom: '25%',
                        width: '3px', borderRadius: '0 3px 3px 0',
                        backgroundColor: 'var(--accent)',
                      }}
                    />
                  )}
                  <span className="absolute inset-0 rounded-[var(--radius)] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ backgroundColor: 'var(--surface-2)' }}
                  />
                  <Icon
                    size={16}
                    className="relative z-10 flex-shrink-0"
                    style={{ color: isActive ? 'var(--accent)' : 'var(--text-2)' }}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className="relative z-10">{link.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ── Status Pill ── */}
      <div className="px-3 pb-5">
        <div
          style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}
          className="px-4 py-3"
        >
          <p
            style={{ color: 'var(--muted)', fontSize: '9px', letterSpacing: '0.18em' }}
            className="uppercase font-semibold mb-2.5"
          >
            System Status
          </p>
          <div className="flex items-center gap-2">
            <span className="status-dot online" />
            <span className="text-xs font-medium" style={{ color: 'var(--success)' }}>
              All Systems Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  // Close on escape key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') setMobileOpen?.(false);
  }, [setMobileOpen]);

  useEffect(() => {
    if (mobileOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileOpen, handleKeyDown]);

  return (
    <>
      {/* ── Desktop Sidebar (lg+) ── */}
      <aside
        style={{
          width: 'var(--sidebar-width)',
          backgroundColor: 'var(--surface)',
          borderRight: '1px solid var(--border)',
        }}
        className="hidden lg:flex flex-col flex-shrink-0 h-screen overflow-y-auto overflow-x-hidden"
      >
        <SidebarPanel />
      </aside>

      {/* ── Mobile Drawer Overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Drawer Panel ── */}
      <aside
        style={{
          width: '280px',
          backgroundColor: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="fixed top-0 left-0 z-50 h-full lg:hidden"
        aria-label="Mobile navigation"
      >
        <SidebarPanel onClose={() => setMobileOpen(false)} />
      </aside>
    </>
  );
}