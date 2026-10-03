import { useEffect, useState, type FormEvent } from 'react';
import { createAdminService, deleteAdminService, getAdminServices, updateAdminService } from '../services/serviceService';
import type { Service, ServicePayload } from '../types/service.types';
import { getApiErrorMessage } from '../utils/apiError';

const emptyForm: ServicePayload = {
  name: '',
  slug: '',
  shortDescription: '',
  description: '',
  icon: 'ShieldCheck',
  url: '',
  sortOrder: 0,
  isFeatured: false,
  isActive: true,
};

export function AdminServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [form, setForm] = useState<ServicePayload>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [image, setImage] = useState<File | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void loadItems();
  }, []);

  async function loadItems() {
    setIsLoading(true);
    try {
      const data = await getAdminServices();
      setItems(data);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to load services.'));
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
      const payload: ServicePayload = { ...form, image };

      if (editingId !== null) {
        await updateAdminService(editingId, payload);
        setMessage('Service updated.');
      } else {
        await createAdminService(payload);
        setMessage('Service created.');
      }

      resetForm();
      await loadItems();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to save service.'));
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(item: Service) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      slug: item.slug,
      shortDescription: item.shortDescription ?? '',
      description: item.description ?? '',
      icon: item.icon ?? 'ShieldCheck',
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
      await deleteAdminService(id);
      setMessage('Service deleted.');
      if (editingId === id) resetForm();
      await loadItems();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to delete service.'));
    }
  }

  if (isLoading) {
    return <div className="p-8 text-slate-600">Loading services...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-ak-navy-900">Services</h1>
        <p className="text-slate-500">Manage services offerings</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 font-display text-2xl font-bold text-ak-navy-900">Service list</h2>
          <div className="space-y-3">
            {items.length === 0 ? (
              <p className="text-sm text-slate-500">No services yet.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ak-navy-900">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.icon ?? 'No icon'} · {item.url ?? 'No link'} · Order: {item.sortOrder}</p>
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
          <h2 className="mb-4 font-display text-2xl font-bold text-ak-navy-900">{editingId ? 'Edit service' : 'New service'}</h2>
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">
              Name
              <input value={form.name ?? ''} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" required />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Slug
              <input value={form.slug ?? ''} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Short description
              <input value={form.shortDescription ?? ''} onChange={(event) => setForm((current) => ({ ...current, shortDescription: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Description / Points (newline separated)
              <textarea value={form.description ?? ''} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} rows={4} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-slate-700">
                Icon
                <input value={form.icon ?? ''} onChange={(event) => setForm((current) => ({ ...current, icon: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                URL
                <input value={form.url ?? ''} onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
              </label>
            </div>

            <label className="block text-sm font-semibold text-slate-700">
              Image
              <input type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0])} className="mt-2 block w-full text-sm font-normal" />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-slate-700">
                Sort order
                <input type="number" value={form.sortOrder ?? 0} onChange={(event) => setForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
              </label>
              <div className="space-y-3 pt-7">
                <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 text-sm">
                  <span className="font-semibold text-slate-700">Featured</span>
                  <input type="checkbox" checked={Boolean(form.isFeatured)} onChange={(event) => setForm((current) => ({ ...current, isFeatured: event.target.checked }))} />
                </div>
                <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 text-sm">
                  <span className="font-semibold text-slate-700">Active</span>
                  <input type="checkbox" checked={Boolean(form.isActive)} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} />
                </div>
              </div>
            </div>

            {message && <p className="text-sm text-emerald-700">{message}</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-3">
              <button type="submit" disabled={isSaving} className="rounded-lg bg-ak-blue px-5 py-3 font-bold text-white disabled:opacity-60">{isSaving ? 'Saving...' : editingId ? 'Update service' : 'Create service'}</button>
              {editingId !== null && <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 px-5 py-3 font-bold text-slate-700">Cancel</button>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
