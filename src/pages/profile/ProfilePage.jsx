import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { Check, User } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [fullName,  setFullName]  = useState('');
  const [role,      setRole]      = useState('');
  const [bio,       setBio]       = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) {
        setFullName(data.full_name || '');
        setRole(data.role || '');
        setBio(data.bio || '');
        setAvatarUrl(data.avatar_url || '');
      }
    }
    fetchProfile();
  }, []);

  async function saveProfile() {
    setSaving(true);
    await supabase.from('profiles').upsert([{
      id: user.id, full_name: fullName, role, bio, avatar_url: avatarUrl,
    }]);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const initials = (fullName || user?.email || 'K').slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6 animate-fade-slide max-w-2xl">
      {/* Page Header */}
      <div>
        <p className="label-overline mb-1" style={{ color: 'var(--muted)' }}>Account</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}>
          Profile
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-2)' }}>
          Manage your identity across the KAIZEN workspace.
        </p>
      </div>

      {/* Avatar + identity banner */}
      <Card>
        <div className="flex items-center gap-5">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={fullName || 'Avatar'}
              className="w-16 h-16 rounded-[var(--radius-lg)] object-cover flex-shrink-0"
              style={{ border: '2px solid var(--border)' }}
            />
          ) : (
            <div
              className="flex items-center justify-center w-16 h-16 rounded-[var(--radius-lg)] flex-shrink-0 text-xl font-bold"
              style={{
                backgroundColor: 'var(--accent-soft)',
                border: '2px solid var(--border)',
                color: 'var(--accent)',
              }}
            >
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-base font-semibold truncate"
              style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
              {fullName || 'Your Name'}
            </h2>
            <p className="text-sm mt-0.5 truncate" style={{ color: 'var(--text-2)' }}>
              {role || 'No role set'}
            </p>
            <p className="text-xs mt-1 truncate" style={{ color: 'var(--muted)' }}>
              {user?.email}
            </p>
          </div>
        </div>
      </Card>

      {/* Profile Form */}
      <Card>
        <h2 className="text-base font-semibold mb-5"
          style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
          Edit Profile
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="Your full name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
            <Input
              label="Role"
              placeholder="e.g. Full Stack Engineer"
              value={role}
              onChange={e => setRole(e.target.value)}
            />
          </div>
          <Input
            label="Avatar URL"
            placeholder="https://example.com/avatar.jpg"
            value={avatarUrl}
            onChange={e => setAvatarUrl(e.target.value)}
            hint="Direct image URL for your profile picture"
          />
          <div className="flex flex-col gap-1.5">
            <label style={{ color: 'var(--text-2)', fontSize: '11px', letterSpacing: '0.1em' }}
              className="font-semibold uppercase">
              Bio
            </label>
            <textarea
              placeholder="A short bio about you…"
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={4}
              className="input-base resize-none"
            />
          </div>

          <div className="pt-1 flex items-center gap-3">
            <Button variant="primary" size="md" onClick={saveProfile} loading={saving}>
              {saved ? <><Check size={14} /> Saved</> : 'Save Profile'}
            </Button>
            {saved && (
              <p className="text-xs" style={{ color: 'var(--success)' }}>
                Profile updated
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}