import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/routes';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function RegisterPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);
    if (error) { setError(error.message); return; }
    navigate(ROUTES.dashboard);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="label-overline mb-2" style={{ color: 'var(--accent)', opacity: 0.8 }}>
          Create Account
        </p>
        <h2
          className="text-2xl font-bold tracking-tight"
          style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}
        >
          Join KAIZEN
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>
          Start building your operational workspace
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Create a strong password"
          required
        />

        {error && (
          <p
            className="text-sm rounded-[var(--radius)] px-3 py-2.5"
            style={{ color: 'var(--danger)', backgroundColor: 'var(--danger-soft)' }}
          >
            {error}
          </p>
        )}

        <div className="pt-1">
          <Button type="submit" variant="primary" size="md" loading={loading} className="w-full">
            Create Account
          </Button>
        </div>
      </form>

      <div
        className="pt-4 text-center text-sm"
        style={{ borderTop: '1px solid var(--border)', color: 'var(--text-2)' }}
      >
        Already registered?{' '}
        <Link
          to={ROUTES.login}
          className="font-medium"
          style={{ color: 'var(--accent)' }}
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
