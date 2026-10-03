import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createAdminInsight, deleteAdminInsight, getAdminInsights, updateAdminInsight } from '../services/insightService';
import type { Insight, InsightPayload } from '../types/insight.types';
import { getApiErrorMessage } from '../utils/apiError';

const emptyForm: InsightPayload = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  publishedAt: null,
  author: '',
  sortOrder: 0,
  isFeatured: false,
  isActive: true,
};

export function AdminInsightsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [items, setItems] = useState<Insight[]>([]);
  const [form, setForm] = useState<InsightPayload>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [image, setImage] = useState<File | undefined>();
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
      const data = await getAdminInsights();
      setItems(data);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to load insights.'));
    } finally {
      setIsLoading(false);
    }
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setImage(undefined);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const payload: InsightPayload = { ...form, image };

      if (editingId !== null) {
        await updateAdminInsight(editingId, payload);
        setMessage('Insight updated.');
      } else {
        await createAdminInsight(payload);
        setMessage('Insight created.');
      }

      resetForm();
      await loadItems();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to save insight.'));
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(item: Insight) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt ?? '',
      content: item.content ?? '',
      publishedAt: item.publishedAt ?? null,
      author: item.author ?? '',
      sortOrder: item.sortOrder,
      isFeatured: item.isFeatured,
      isActive: item.isActive,
    });
  }

  async function handleDelete(id: number) {
    setError(null);
    setMessage(null);
    try {
      await deleteAdminInsight(id);
      setMessage('Insight deleted.');
      if (editingId === id) resetForm();
      await loadItems();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to delete insight.'));
    }
  }

  function handleLogout() {
    logout();
    navigate('/admin/login', { replace: true });
  }

  if (isLoading) {
    return <main className="min-h-screen bg-[#f7f7f5] p-8 text-slate-600">Loading insights...</main>;
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ak-blue">Admin</p>
            <h1 className="font-display text-3xl font-bold text-ak-navy-900">Insights / News</h1>
          </div>
          <button type="button" onClick={handleLogout} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Sign out</button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 font-display text-2xl font-bold text-ak-navy-900">Insight list</h2>
            <div className="space-y-3">
              {items.length === 0 ? (
                <p className="text-sm text-slate-500">No insights yet.</p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-ak-navy-900">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.author || 'No author'} {item.publishedAt ? `• ${new Date(item.publishedAt).toLocaleDateString()}` : ''} {item.isFeatured ? '• Featured' : ''} {item.isActive ? '• Active' : '• Inactive'}</p>
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
            <h2 className="mb-4 font-display text-2xl font-bold text-ak-navy-900">{editingId ? 'Edit insight' : 'New insight'}</h2>
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700">
                Title
                <input value={form.title ?? ''} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" required />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Slug
                <input value={form.slug ?? ''} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Excerpt
                <input value={form.excerpt ?? ''} onChange={(event) => setForm((current) => ({ ...current, excerpt: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Content
                <textarea value={form.content ?? ''} onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" rows={6} />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Published date
                <input type="date" value={form.publishedAt ?? ''} onChange={(event) => setForm((current) => ({ ...current, publishedAt: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Author
                <input value={form.author ?? ''} onChange={(event) => setForm((current) => ({ ...current, author: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Sort order
                <input type="number" value={form.sortOrder ?? 0} onChange={(event) => setForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Image
                <input type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0])} className="mt-2 block w-full text-sm font-normal" />
              </label>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 text-sm">
                  <span className="font-semibold text-slate-700">Featured</span>
                  <input type="checkbox" checked={Boolean(form.isFeatured)} onChange={(event) => setForm((current) => ({ ...current, isFeatured: event.target.checked }))} />
                </div>
                <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 text-sm">
                  <span className="font-semibold text-slate-700">Active</span>
                  <input type="checkbox" checked={Boolean(form.isActive)} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} />
                </div>
              </div>

              {message && <p className="text-sm text-emerald-700">{message}</p>}
              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-3">
                <button type="submit" disabled={isSaving} className="rounded-lg bg-ak-blue px-5 py-3 font-bold text-white disabled:opacity-60">{isSaving ? 'Saving...' : editingId ? 'Update insight' : 'Create insight'}</button>
                {editingId !== null && <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 px-5 py-3 font-bold text-slate-700">Cancel</button>}
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
