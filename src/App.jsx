import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
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

function App() {
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