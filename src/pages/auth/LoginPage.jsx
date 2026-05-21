import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/routes';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) { setError(error.message); return; }
    navigate(ROUTES.dashboard);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="label-overline mb-2" style={{ color: 'var(--accent)', opacity: 0.8 }}>
          Authentication
        </p>
        <h2
          className="text-2xl font-bold tracking-tight"
          style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}
        >
          Sign in
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>
          Access your operational dashboard
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
          placeholder="Your password"
          required
        />

        {error && (
          <p
            className="text-sm rounded-[var(--radius)] px-3 py-2.5"
            style={{ color: 'var(--danger)', backgroundColor: 'var(--danger-soft)', border: '1px solid transparent' }}
          >
            {error}
          </p>
        )}

        <div className="pt-1 space-y-3">
          <Button type="submit" variant="primary" size="md" loading={loading} className="w-full">
            Sign In
          </Button>
          <Link
            to={ROUTES.forgotPassword}
            className="block text-center text-sm transition-colors duration-200"
            style={{ color: 'var(--text-2)' }}
            onMouseEnter={e => e.target.style.color = 'var(--text)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-2)'}
          >
            Forgot password?
          </Link>
        </div>
      </form>

      <div
        className="pt-4 text-center text-sm"
        style={{ borderTop: '1px solid var(--border)', color: 'var(--text-2)' }}
      >
        New to KAIZEN?{' '}
        <Link
          to={ROUTES.register}
          className="font-medium transition-colors duration-200"
          style={{ color: 'var(--accent)' }}
        >
          Create account
        </Link>
      </div>
    </div>
  );
}
