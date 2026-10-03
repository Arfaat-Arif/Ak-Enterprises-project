import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createAdminCaseStudy, deleteAdminCaseStudy, getAdminCaseStudies, updateAdminCaseStudy } from '../services/caseStudyService';
import type { CaseStudy, CaseStudyPayload } from '../types/caseStudy.types';
import { getApiErrorMessage } from '../utils/apiError';

const emptyForm: CaseStudyPayload = {
  title: '',
  slug: '',
  clientName: '',
  summary: '',
  description: '',
  url: '',
  sortOrder: 0,
  isFeatured: false,
  isActive: true,
};

export function AdminCaseStudiesPage() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [items, setItems] = useState<CaseStudy[]>([]);
  const [form, setForm] = useState<CaseStudyPayload>(emptyForm);
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
      const data = await getAdminCaseStudies();
      setItems(data);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to load case studies.'));
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
      const payload: CaseStudyPayload = { ...form, image };

      if (editingId !== null) {
        await updateAdminCaseStudy(editingId, payload);
        setMessage('Case study updated.');
      } else {
        await createAdminCaseStudy(payload);
        setMessage('Case study created.');
      }

      resetForm();
      await loadItems();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to save case study.'));
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(item: CaseStudy) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      slug: item.slug,
      clientName: item.clientName ?? '',
      summary: item.summary ?? '',
      description: item.description ?? '',
      url: item.url ?? '',
      sortOrder: item.sortOrder,
      isFeatured: item.isFeatured,
      isActive: item.isActive,
    });
  }

  async function handleDelete(id: number) {
    setError(null);
    setMessage(null);
    try {
      await deleteAdminCaseStudy(id);
      setMessage('Case study deleted.');
      if (editingId === id) resetForm();
      await loadItems();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to delete case study.'));
    }
  }

  function handleLogout() {
    logout();
    navigate('/admin/login', { replace: true });
  }

  if (isLoading) {
    return <main className="min-h-screen bg-[#f7f7f5] p-8 text-slate-600">Loading case studies...</main>;
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ak-blue">Admin</p>
            <h1 className="font-display text-3xl font-bold text-ak-navy-900">Case Studies</h1>
          </div>
          <button type="button" onClick={handleLogout} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Sign out</button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 font-display text-2xl font-bold text-ak-navy-900">Case study list</h2>
            <div className="space-y-3">
              {items.length === 0 ? (
                <p className="text-sm text-slate-500">No case studies yet.</p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-ak-navy-900">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.clientName || 'No client name'} {item.isFeatured ? '• Featured' : ''} {item.isActive ? '• Active' : '• Inactive'}</p>
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
            <h2 className="mb-4 font-display text-2xl font-bold text-ak-navy-900">{editingId ? 'Edit case study' : 'New case study'}</h2>
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
                Client name
                <input value={form.clientName ?? ''} onChange={(event) => setForm((current) => ({ ...current, clientName: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Summary
                <input value={form.summary ?? ''} onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Description
                <textarea value={form.description ?? ''} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" rows={4} />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                URL
                <input value={form.url ?? ''} onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
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
                <button type="submit" disabled={isSaving} className="rounded-lg bg-ak-blue px-5 py-3 font-bold text-white disabled:opacity-60">{isSaving ? 'Saving...' : editingId ? 'Update case study' : 'Create case study'}</button>
                {editingId !== null && <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 px-5 py-3 font-bold text-slate-700">Cancel</button>}
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
