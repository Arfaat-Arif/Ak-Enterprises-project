import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { getAdminSiteSettings, updateAdminSiteSettings, type SiteSettingsForm } from '../services/siteSettingsService';
import type { SiteSettings } from '../types/siteSettings.types';

function toForm(settings: SiteSettings): SiteSettingsForm {
    return {
        siteName: settings.siteName,
        tagline: settings.tagline ?? '',
        subTagline: settings.subTagline ?? '',
        contactEmail: settings.contactEmail ?? '',
        contactPhone: settings.contactPhone ?? '',
        address: settings.address ?? '',
        businessHours: settings.businessHours ?? '',
    };
}

export function AdminSettingsPage() {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();
    const { refresh } = useSiteSettings();
    const [form, setForm] = useState<SiteSettingsForm | null>(null);
    const [logo, setLogo] = useState<File | undefined>();
    const [favicon, setFavicon] = useState<File | undefined>();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin/login', { replace: true });
            return;
        }

        void getAdminSiteSettings()
            .then((settings) => setForm(toForm(settings)))
            .catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Unable to load settings.'))
            .finally(() => setIsLoading(false));
    }, [isAuthenticated, navigate]);

    function updateField(field: keyof SiteSettingsForm, value: string) {
        setForm((current) => current ? { ...current, [field]: value } : current);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!form) return;
        setIsSaving(true);
        setMessage(null);
        setError(null);
        try {
            await updateAdminSiteSettings({ ...form, logo, favicon });
            await refresh();
            setLogo(undefined);
            setFavicon(undefined);
            setMessage('Settings saved.');
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'Unable to save settings.');
        } finally {
            setIsSaving(false);
        }
    }

    function handleLogout() {
        logout();
        navigate('/admin/login', { replace: true });
    }

    if (isLoading || !form) return <main className="min-h-screen bg-[#f7f7f5] p-8 text-slate-600">Loading settings...</main>;

    return (
        <main className="min-h-screen bg-[#f7f7f5] px-6 py-10">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-ak-blue">Admin</p>
                        <h1 className="font-display text-3xl font-bold text-ak-navy-900">Site settings</h1>
                    </div>
                    <button type="button" onClick={handleLogout} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Sign out</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-white p-6 shadow-lg sm:p-8">
                    <div className="grid gap-5 sm:grid-cols-2">
                        {[
                            ['siteName', 'Site name'],
                            ['tagline', 'Tagline'],
                            ['subTagline', 'Sub-tagline'],
                            ['contactEmail', 'Contact email'],
                            ['contactPhone', 'Contact phone'],
                            ['businessHours', 'Business hours'],
                        ].map(([field, label]) => (
                            <label key={field} className="block text-sm font-semibold text-slate-700">
                                {label}
                                <input
                                    value={form[field as keyof SiteSettingsForm] as string}
                                    onChange={(event) => updateField(field as keyof SiteSettingsForm, event.target.value)}
                                    type={field === 'contactEmail' ? 'email' : 'text'}
                                    required={field === 'siteName'}
                                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 font-normal"
                                />
                            </label>
                        ))}
                    </div>
                    <label className="block text-sm font-semibold text-slate-700">
                        Address
                        <textarea value={form.address} onChange={(event) => updateField('address', event.target.value)} rows={3} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 font-normal" />
                    </label>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block text-sm font-semibold text-slate-700">Logo<input type="file" accept="image/*" onChange={(event) => setLogo(event.target.files?.[0])} className="mt-2 block w-full text-sm font-normal" /></label>
                        <label className="block text-sm font-semibold text-slate-700">Favicon<input type="file" accept=".ico,.png,.jpg,.jpeg,.webp,.svg" onChange={(event) => setFavicon(event.target.files?.[0])} className="mt-2 block w-full text-sm font-normal" /></label>
                    </div>
                    {message && <p className="text-sm text-emerald-700">{message}</p>}
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button type="submit" disabled={isSaving} className="rounded-lg bg-ak-blue px-5 py-3 font-bold text-white disabled:opacity-60">{isSaving ? 'Saving...' : 'Save settings'}</button>
                </form>
            </div>
        </main>
    );
}
