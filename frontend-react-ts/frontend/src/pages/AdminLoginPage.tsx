import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import type { ApiError } from '../types/api.types';
import { ROUTES } from '../config/routes.config';

function getLoginErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as ApiError).message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return 'Unable to sign in. Please check your credentials and try again.';
}

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage] = useState<string | null>(() => {
    const state = location.state as { message?: string } | null;
    return typeof state?.message === 'string' ? state.message : null;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('Email and password are required.');
      setIsSubmitting(false);
      return;
    }

    try {
      await login(trimmedEmail, password);
      navigate('/admin', { replace: true });
    } catch (requestError) {
      setError(getLoginErrorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-6 py-16">
      <form onSubmit={handleSubmit} className="mx-auto max-w-md rounded-xl bg-white p-8 shadow-lg" noValidate>
        <h1 className="mb-2 font-display text-2xl font-bold text-ak-navy-900">Admin sign in</h1>
        <p className="mb-8 text-sm text-slate-500">Private access for authorized administrators only.</p>

        {infoMessage && (
          <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800" role="status">
            {infoMessage}
          </p>
        )}

        <label className="mb-4 block text-sm font-semibold text-slate-700">
          Email
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            autoComplete="username"
            required
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>

        <label className="mb-6 block text-sm font-semibold text-slate-700">
          Password
          <span className="relative mt-2 block">
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-ak-navy-900"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>

        {error && (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-ak-blue px-4 py-3 font-bold text-white disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link to={ROUTES.home} className="font-semibold text-ak-blue hover:underline">
            Back to Website
          </Link>
        </p>
      </form>
    </main>
  );
}
