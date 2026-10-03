import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createAdminHeroSection, deleteAdminHeroSection, getAdminHeroSections, updateAdminHeroSection } from '../services/heroService';
import type { HeroSection, HeroSectionPayload } from '../types/hero.types';
import { getApiErrorMessage } from '../utils/apiError';

const emptyForm: HeroSectionPayload = {
    title: '',
    description: '',
    badge: '',
    primaryButtonText: '',
    primaryButtonUrl: '',
    secondaryButtonText: '',
    secondaryButtonUrl: '',
    sortOrder: 0,
    isActive: true,
};

export function AdminHeroPage() {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();
    const [items, setItems] = useState<HeroSection[]>([]);
    const [form, setForm] = useState<HeroSectionPayload>(emptyForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [backgroundImage, setBackgroundImage] = useState<File | undefined>();
    const [backgroundVideo, setBackgroundVideo] = useState<File | undefined>();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin/login', { replace: true });
            return;
        }

        void loadItems();
    }, [isAuthenticated, navigate]);

    async function loadItems() {
        setIsLoading(true);
        try {
            const data = await getAdminHeroSections();
            setItems(data);
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, 'Unable to load hero sections.'));
        } finally {
            setIsLoading(false);
        }
    }

    function resetForm() {
        setForm(emptyForm);
        setEditingId(null);
        setBackgroundImage(undefined);
        setBackgroundVideo(undefined);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSaving(true);
        setError(null);
        setMessage(null);

        try {
            const payload: HeroSectionPayload = {
                ...form,
                backgroundImage,
                backgroundVideo,
            };

            if (editingId !== null) {
                await updateAdminHeroSection(editingId, payload);
                setMessage('Hero section updated.');
            } else {
                await createAdminHeroSection(payload);
                setMessage('Hero section created.');
            }

            resetForm();
            await loadItems();
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, 'Unable to save hero section.'));
        } finally {
            setIsSaving(false);
        }
    }

    function handleEdit(item: HeroSection) {
        setEditingId(item.id);
        setForm({
            title: item.title,
            description: item.description ?? '',
            badge: item.badge ?? '',
            primaryButtonText: item.primaryButtonText ?? '',
            primaryButtonUrl: item.primaryButtonUrl ?? '',
            secondaryButtonText: item.secondaryButtonText ?? '',
            secondaryButtonUrl: item.secondaryButtonUrl ?? '',
            sortOrder: item.sortOrder,
            isActive: item.isActive,
        });
    }

    async function handleDelete(id: number) {
        setError(null);
        setMessage(null);
        try {
            await deleteAdminHeroSection(id);
            setMessage('Hero section deleted.');
            if (editingId === id) resetForm();
            await loadItems();
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, 'Unable to delete hero section.'));
        }
    }

    function handleLogout() {
        logout();
        navigate('/admin/login', { replace: true });
    }

    if (isLoading) {
        return <main className="min-h-screen bg-[#f7f7f5] p-8 text-slate-600">Loading hero sections...</main>;
    }

    return (
        <main className="min-h-screen bg-[#f7f7f5] px-6 py-10">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-ak-blue">Admin</p>
                        <h1 className="font-display text-3xl font-bold text-ak-navy-900">Hero sections</h1>
                    </div>
                    <button type="button" onClick={handleLogout} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Sign out</button>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="rounded-xl bg-white p-6 shadow-lg">
                        <h2 className="mb-4 font-display text-2xl font-bold text-ak-navy-900">Hero items</h2>
                        <div className="space-y-3">
                            {items.length === 0 ? (
                                <p className="text-sm text-slate-500">No hero sections yet.</p>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="font-semibold text-ak-navy-900">{item.title}</p>
                                                <p className="text-xs text-slate-500">{item.badge ?? 'No badge'}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button type="button" onClick={() => handleEdit(item)} className="rounded border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700">Edit</button>
                                                <button type="button" onClick={() => handleDelete(item.id)} className="rounded border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-lg">
                        <h2 className="mb-4 font-display text-2xl font-bold text-ak-navy-900">{editingId ? 'Edit hero' : 'New hero'}</h2>
                        <div className="space-y-4">
                            <label className="block text-sm font-semibold text-slate-700">
                                Title
                                <input value={form.title ?? ''} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" required />
                            </label>

                            <label className="block text-sm font-semibold text-slate-700">
                                Badge
                                <input value={form.badge ?? ''} onChange={(event) => setForm((current) => ({ ...current, badge: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
                            </label>

                            <label className="block text-sm font-semibold text-slate-700">
                                Description
                                <textarea value={form.description ?? ''} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} rows={4} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
                            </label>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block text-sm font-semibold text-slate-700">
                                    Primary button text
                                    <input value={form.primaryButtonText ?? ''} onChange={(event) => setForm((current) => ({ ...current, primaryButtonText: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
                                </label>
                                <label className="block text-sm font-semibold text-slate-700">
                                    Primary button URL
                                    <input value={form.primaryButtonUrl ?? ''} onChange={(event) => setForm((current) => ({ ...current, primaryButtonUrl: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
                                </label>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block text-sm font-semibold text-slate-700">
                                    Secondary button text
                                    <input value={form.secondaryButtonText ?? ''} onChange={(event) => setForm((current) => ({ ...current, secondaryButtonText: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
                                </label>
                                <label className="block text-sm font-semibold text-slate-700">
                                    Secondary button URL
                                    <input value={form.secondaryButtonUrl ?? ''} onChange={(event) => setForm((current) => ({ ...current, secondaryButtonUrl: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
                                </label>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block text-sm font-semibold text-slate-700">
                                    Sort order
                                    <input type="number" value={form.sortOrder ?? 0} onChange={(event) => setForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
                                </label>
                                <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 text-sm mt-7">
                                    <span className="font-semibold text-slate-700">Active</span>
                                    <input type="checkbox" checked={Boolean(form.isActive)} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block text-sm font-semibold text-slate-700">
                                    Background image
                                    <input type="file" accept="image/*" onChange={(event) => setBackgroundImage(event.target.files?.[0])} className="mt-2 block w-full text-sm font-normal" />
                                </label>
                                <label className="block text-sm font-semibold text-slate-700">
                                    Background video
                                    <input type="file" accept="video/*" onChange={(event) => setBackgroundVideo(event.target.files?.[0])} className="mt-2 block w-full text-sm font-normal" />
                                </label>
                            </div>

                            {message && <p className="text-sm text-emerald-700">{message}</p>}
                            {error && <p className="text-sm text-red-600">{error}</p>}

                            <div className="flex gap-3">
                                <button type="submit" disabled={isSaving} className="rounded-lg bg-ak-blue px-5 py-3 font-bold text-white disabled:opacity-60">{isSaving ? 'Saving...' : editingId ? 'Update hero' : 'Create hero'}</button>
                                {editingId !== null && <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 px-5 py-3 font-bold text-slate-700">Cancel</button>}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
