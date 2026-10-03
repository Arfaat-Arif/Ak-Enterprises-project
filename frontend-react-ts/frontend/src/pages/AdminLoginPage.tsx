import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function AdminLoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            await login(email, password);
            navigate('/admin/settings');
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'Unable to sign in.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#f7f7f5] px-6 py-16">
            <form onSubmit={handleSubmit} className="mx-auto max-w-md rounded-xl bg-white p-8 shadow-lg">
                <h1 className="mb-2 font-display text-2xl font-bold text-ak-navy-900">Admin sign in</h1>
                <p className="mb-8 text-sm text-slate-500">Manage the site settings.</p>
                <label className="mb-4 block text-sm font-semibold text-slate-700">
                    Email
                    <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
                </label>
                <label className="mb-6 block text-sm font-semibold text-slate-700">
                    Password
                    <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
                </label>
                {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
                <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-ak-blue px-4 py-3 font-bold text-white disabled:opacity-60">
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                </button>
            </form>
        </main>
    );
}
