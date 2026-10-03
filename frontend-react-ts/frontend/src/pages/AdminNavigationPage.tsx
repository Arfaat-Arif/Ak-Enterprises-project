import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createAdminNavigation, deleteAdminNavigation, getAdminNavigation, updateAdminNavigation } from '../services/navigationService';
import type { NavigationItem, NavigationItemPayload } from '../types/navigation.types';

const emptyForm: NavigationItemPayload = {
  label: '',
  url: '/',
  parentId: null,
  sortOrder: 0,
  isActive: true,
  openInNewTab: false,
};

export function AdminNavigationPage() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [form, setForm] = useState<NavigationItemPayload>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
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
      const data = await getAdminNavigation();
      setItems(data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load navigation items.');
    } finally {
      setIsLoading(false);
    }
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      if (editingId !== null) {
        await updateAdminNavigation(editingId, form);
        setMessage('Navigation item updated.');
      } else {
        await createAdminNavigation(form);
        setMessage('Navigation item created.');
      }
      resetForm();
      await loadItems();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save navigation item.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleEdit(item: NavigationItem) {
    setEditingId(item.id);
    setForm({
      label: item.label,
      url: item.url,
      parentId: item.parentId,
      sortOrder: item.sortOrder,
      isActive: item.isActive,
      openInNewTab: item.openInNewTab,
    });
  }

  async function handleDelete(id: number) {
    setError(null);
    setMessage(null);
    try {
      await deleteAdminNavigation(id);
      setMessage('Navigation item deleted.');
      if (editingId === id) resetForm();
      await loadItems();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to delete navigation item.');
    }
  }

  function handleLogout() {
    logout();
    navigate('/admin/login', { replace: true });
  }

  if (isLoading) {
    return <main className="min-h-screen bg-[#f7f7f5] p-8 text-slate-600">Loading navigation...</main>;
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ak-blue">Admin</p>
            <h1 className="font-display text-3xl font-bold text-ak-navy-900">Navigation</h1>
          </div>
          <button type="button" onClick={handleLogout} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Sign out</button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 font-display text-2xl font-bold text-ak-navy-900">Menu items</h2>
            <div className="space-y-3">
              {items.length === 0 ? (
                <p className="text-sm text-slate-500">No navigation items yet.</p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-ak-navy-900">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.url}</p>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => handleEdit(item)} className="rounded border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700">Edit</button>
                        <button type="button" onClick={() => handleDelete(item.id)} className="rounded border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600">Delete</button>
                      </div>
                    </div>
                    {item.children.length > 0 && (
                      <ul className="mt-3 space-y-2 pl-4 text-sm text-slate-600">
                        {item.children.map((child) => (
                          <li key={child.id} className="flex items-center justify-between gap-3">
                            <span>{child.label}</span>
                            <div className="flex gap-2">
                              <button type="button" onClick={() => handleEdit(child)} className="text-xs font-semibold text-slate-700">Edit</button>
                              <button type="button" onClick={() => handleDelete(child.id)} className="text-xs font-semibold text-red-600">Delete</button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 font-display text-2xl font-bold text-ak-navy-900">{editingId ? 'Edit item' : 'New item'}</h2>
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700">
                Label
                <input value={form.label ?? ''} onChange={(event) => setForm((current) => ({ ...current, label: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" required />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                URL
                <input value={form.url ?? ''} onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" required />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Parent ID (optional)
                <input type="number" value={form.parentId ?? ''} onChange={(event) => setForm((current) => ({ ...current, parentId: event.target.value === '' ? null : Number(event.target.value) }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Sort order
                <input type="number" value={form.sortOrder ?? 0} onChange={(event) => setForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
              </label>

              <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 text-sm">
                <span className="font-semibold text-slate-700">Active</span>
                <input type="checkbox" checked={Boolean(form.isActive)} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} />
              </div>

              <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 text-sm">
                <span className="font-semibold text-slate-700">Open in new tab</span>
                <input type="checkbox" checked={Boolean(form.openInNewTab)} onChange={(event) => setForm((current) => ({ ...current, openInNewTab: event.target.checked }))} />
              </div>

              {message && <p className="text-sm text-emerald-700">{message}</p>}
              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex gap-3">
                <button type="submit" disabled={isSaving} className="rounded-lg bg-ak-blue px-5 py-3 font-bold text-white disabled:opacity-60">{isSaving ? 'Saving...' : editingId ? 'Update item' : 'Create item'}</button>
                {editingId !== null && <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 px-5 py-3 font-bold text-slate-700">Cancel</button>}
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
