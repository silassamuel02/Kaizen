import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/routes';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) { setError(error.message); return; }
    setSuccess('Check your email for reset instructions.');
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="label-overline mb-2" style={{ color: 'var(--accent)', opacity: 0.8 }}>
          Account Recovery
        </p>
        <h2
          className="text-2xl font-bold tracking-tight"
          style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}
        >
          Reset Password
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>
          Enter your email to receive reset instructions
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

        {success && (
          <p
            className="text-sm rounded-[var(--radius)] px-3 py-2.5"
            style={{ color: 'var(--success)', backgroundColor: 'var(--success-soft)' }}
          >
            {success}
          </p>
        )}
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
            Send Reset Link
          </Button>
        </div>
      </form>

      <div
        className="pt-4 text-center text-sm"
        style={{ borderTop: '1px solid var(--border)', color: 'var(--text-2)' }}
      >
        Remember your password?{' '}
        <Link to={ROUTES.login} className="font-medium" style={{ color: 'var(--accent)' }}>
          Sign in
        </Link>
      </div>
    </div>
  );
}
