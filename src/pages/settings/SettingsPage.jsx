import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Bell, Wifi, Film, Check } from 'lucide-react';

function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex items-center w-10 h-5 rounded-full flex-shrink-0
        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
      style={{
        backgroundColor: checked ? 'var(--accent)' : 'var(--surface-3)',
        border: '1px solid var(--border-medium)',
        focusRingOffsetColor: 'var(--bg)',
      }}
    >
      <span
        className="inline-block w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: checked ? 'translateX(20px)' : 'translateX(2px)' }}
      />
    </button>
  );
}

const settings = [
  { key: 'notifications', label: 'Notifications', description: 'Enable operational alerts and system events', icon: Bell },
  { key: 'realtime',      label: 'Realtime Sync',  description: 'Live updates across all workspace nodes',    icon: Wifi },
  { key: 'cinematic',     label: 'Cinematic Mode', description: 'Enhanced immersive visual experience',       icon: Film },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [values, setValues]   = useState({ notifications: true, realtime: true, cinematic: false });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('settings').select('*').eq('id', user.id).single();
      if (data) setValues({
        notifications: data.notifications_enabled ?? true,
        realtime:      data.realtime_enabled ?? true,
        cinematic:     data.cinematic_mode ?? false,
      });
    }
    fetchSettings();
  }, []);

  async function saveSettings() {
    setLoading(true);
    await supabase.from('settings').upsert([{
      id: user.id,
      notifications_enabled: values.notifications,
      realtime_enabled:      values.realtime,
      cinematic_mode:        values.cinematic,
    }]);
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6 animate-fade-slide max-w-2xl">
      {/* Page Header */}
      <div>
        <p className="label-overline mb-1" style={{ color: 'var(--muted)' }}>Configuration</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}>
          Settings
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-2)' }}>
          Manage your workspace preferences and system behaviour.
        </p>
      </div>

      {/* Preferences Card */}
      <Card>
        <h2 className="text-base font-semibold mb-1"
          style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
          Preferences
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-2)' }}>
          Personalise your operational environment.
        </p>

        <div className="space-y-1">
          {settings.map(({ key, label, description, icon: Icon }) => (
            <div
              key={key}
              className="flex items-center justify-between gap-4 py-4"
              style={{ borderBottom: '1px solid var(--border-soft)' }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-[var(--radius)] flex-shrink-0"
                  style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)' }}
                >
                  <Icon size={14} style={{ color: 'var(--muted)' }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{description}</p>
                </div>
              </div>
              <Toggle
                checked={values[key]}
                onChange={val => setValues(prev => ({ ...prev, [key]: val }))}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button variant="primary" size="md" onClick={saveSettings} loading={loading}>
            {saved ? <><Check size={14} /> Saved</> : 'Save Settings'}
          </Button>
          {saved && (
            <p className="text-xs" style={{ color: 'var(--success)' }}>
              Settings saved successfully
            </p>
          )}
        </div>
      </Card>

      {/* Account Info Card */}
      <Card>
        <h2 className="text-base font-semibold mb-1"
          style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
          Account
        </h2>
        <p className="text-sm mb-5" style={{ color: 'var(--text-2)' }}>
          Your Supabase-authenticated account details.
        </p>
        <div className="space-y-3">
          {[
            { label: 'Email', value: user?.email },
            { label: 'User ID', value: user?.id?.slice(0, 8) + '…' },
            { label: 'Auth Provider', value: 'Supabase' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2.5"
              style={{ borderBottom: '1px solid var(--border-soft)' }}>
              <span className="text-sm" style={{ color: 'var(--text-2)' }}>{label}</span>
              <span className="text-sm font-medium font-mono" style={{ color: 'var(--text)' }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}