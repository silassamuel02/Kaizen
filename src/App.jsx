import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import WorkspacePage from './pages/workspace/WorkspacePage';
import WorkspaceDetailsPage from './pages/workspace/WorkspaceDetailsPage';
import NotesPage from './pages/notes/NotesPage';
import AIInsightsPage from './pages/ai/AIInsightsPage';
import SettingsPage from './pages/settings/SettingsPage';
import ProfilePage from './pages/profile/ProfilePage';
import ActivityPage from './pages/activity/ActivityPage';
import NotFoundPage from './pages/NotFoundPage';

// Restore saved theme on load
const savedTheme = localStorage.getItem('kaizen-theme');
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen text-sm"
        style={{ backgroundColor: 'var(--bg)', color: 'var(--text-2)' }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-6 h-6 border-2 rounded-full animate-spin"
            style={{ borderColor: 'var(--border-medium)', borderTopColor: 'var(--accent)' }}
          />
          <span>Loading…</span>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

import { isSupabaseConfigured, isDemoMode } from './supabase/client';
import { Database, AlertTriangle, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

function App() {
  const [showConfig, setShowConfig] = useState(false);

  // We show config screen if Supabase is not configured AND the user hasn't opted into Demo Mode
  const isDemo = localStorage.getItem('kaizen-demo-mode') === 'true';
  const shouldShowSetupScreen = !isSupabaseConfigured && !isDemo;

  if (shouldShowSetupScreen) {
    return (
      <div
        className="flex items-center justify-center min-h-screen p-6"
        style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
      >
        <div
          className="w-full max-w-lg p-8 rounded-[var(--radius-lg)] border border-border bg-surface space-y-6 shadow-md"
        >
          <div className="flex items-center gap-3 text-accent">
            <Database size={24} />
            <h1 className="text-xl font-bold tracking-tight">KAIZEN Workspace</h1>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-text">Supabase Connection Required</p>
            <p className="text-xs leading-relaxed text-text-2">
              KAIZEN uses Supabase for database persistence, authentication, and realtime synchronization. To launch the full production workspace, you need to configure your Supabase credentials.
            </p>
          </div>

          {/* Primary Action: Go to Demo Mode */}
          <div className="pt-2">
            <button
              onClick={() => {
                localStorage.setItem('kaizen-demo-mode', 'true');
                window.location.reload();
              }}
              style={{ backgroundColor: 'var(--accent)' }}
              className="w-full h-11 rounded-[var(--radius-md)] text-xs font-bold text-black flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-200 shadow-theme"
            >
              Explore in Demo Mode (Local Storage)
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Toggleable Credentials Instructions */}
          <div className="border-t border-border pt-4">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="w-full flex items-center justify-between text-xs font-semibold text-text-2 hover:text-text transition-colors"
            >
              <span>How to configure Supabase?</span>
              {showConfig ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showConfig && (
              <div className="space-y-4 pt-3 animate-fade-in">
                <div className="p-4 rounded-[var(--radius-md)] bg-surface-2 border border-border space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                    <AlertTriangle size={12} />
                    Vercel Deployments
                  </span>
                  <p className="text-xs text-text-2">
                    Add the following keys in your Vercel Project Dashboard under <strong>Settings &gt; Environment Variables</strong>:
                  </p>
                  <pre className="text-xs font-mono p-3 rounded bg-surface-3 border border-border select-all overflow-x-auto text-left leading-5 text-text">
                    VITE_SUPABASE_URL=your_supabase_project_url<br />
                    VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
                  </pre>
                </div>

                <div className="p-4 rounded-[var(--radius-md)] bg-surface-2 border border-border space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                    Local Development
                  </span>
                  <p className="text-xs text-text-2">
                    Create a <code>.env</code> file in the project root directory and add the environment variables listed above.
                  </p>
                </div>

                <div className="text-center pt-2">
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                  >
                    Get started with Supabase &rarr;
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth */}
      <Route path="/login"           element={<AuthLayout><LoginPage /></AuthLayout>} />
      <Route path="/register"        element={<AuthLayout><RegisterPage /></AuthLayout>} />
      <Route path="/forgot-password" element={<AuthLayout><ForgotPasswordPage /></AuthLayout>} />

      {/* Protected */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index                   element={<DashboardPage />} />
        <Route path="workspace"        element={<WorkspacePage />} />
        <Route path="workspace/:id"    element={<WorkspaceDetailsPage />} />
        <Route path="notes"            element={<NotesPage />} />
        <Route path="ai"               element={<AIInsightsPage />} />
        <Route path="settings"         element={<SettingsPage />} />
        <Route path="profile"          element={<ProfilePage />} />
        <Route path="activity"         element={<ActivityPage />} />
        <Route path="*"                element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;