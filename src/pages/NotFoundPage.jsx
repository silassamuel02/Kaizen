import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/routes';
import Button from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div
      className="min-h-[80vh] flex items-center justify-center py-16 px-4"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="text-center max-w-md mx-auto">
        {/* 404 label */}
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-[var(--radius-xl)] mb-6"
          style={{ backgroundColor: 'var(--surface-2)', border: '1px solid var(--border)' }}
        >
          <span className="text-2xl font-black" style={{ color: 'var(--accent)' }}>
            404
          </span>
        </div>

        <p className="label-overline mb-3" style={{ color: 'var(--muted)' }}>
          Page not found
        </p>

        <h1
          className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
          style={{ color: 'var(--text)', letterSpacing: '-0.04em' }}
        >
          This page doesn&apos;t exist
        </h1>

        <p
          className="text-base leading-relaxed mb-8"
          style={{ color: 'var(--text-2)' }}
        >
          The route you requested couldn&apos;t be found. Return to the dashboard or check the URL.
        </p>

        <Link to={ROUTES.dashboard}>
          <Button variant="primary" size="md">
            <ArrowLeft size={14} />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
