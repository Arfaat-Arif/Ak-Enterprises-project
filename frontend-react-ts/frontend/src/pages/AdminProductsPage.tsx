import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { createAdminProduct, deleteAdminProduct, deleteAdminProductImage, getAdminProducts, getAdminProduct, updateAdminProduct } from '../services/productService';
import { getAdminCategories } from '../services/categoryService';
import type { Product, ProductPayload, ProductSpec } from '../types/product.types';
import type { Category } from '../types/category.types';

const emptySpec: ProductSpec = { label: '', value: '' };
const emptyForm: ProductPayload = {
  categoryId: 0,
  brand: '',
  name: '',
  sku: '',
  shortDescription: '',
  description: '',
  specs: [],
  accessories: [],
  price: null,
  isFeatured: false,
  isActive: true,
  sortOrder: 0,
};

export function AdminProductsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [items, setItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductPayload>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [images, setImages] = useState<File[]>([]);
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
    void loadCategories();
  }, [isAuthenticated, navigate]);

  async function loadItems() {
    setIsLoading(true);
    try {
      const data = await getAdminProducts();
      setItems(data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load products.');
    } finally {
      setIsLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const data = await getAdminCategories();
      setCategories(data);
    } catch (requestError) {
      console.error('Failed to load categories:', requestError);
    }
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setImages([]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const payload: ProductPayload = { ...form, images: images.length > 0 ? images : undefined };

      if (editingId !== null) {
        await updateAdminProduct(editingId, payload);
        setMessage('Product updated.');
      } else {
        await createAdminProduct(payload);
        setMessage('Product created.');
      }

      resetForm();
      await loadItems();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save product.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleEdit(item: Product) {
    setEditingId(item.id);
    try {
      const fullProduct = await getAdminProduct(item.id);
      setForm({
        categoryId: fullProduct.categoryId,
        brand: fullProduct.brand,
        name: fullProduct.name,
        sku: fullProduct.sku,
        shortDescription: fullProduct.shortDescription,
        description: fullProduct.description,
        specs: fullProduct.specs,
        accessories: fullProduct.accessories,
        price: fullProduct.price,
        isFeatured: fullProduct.isFeatured,
        isActive: fullProduct.isActive,
        sortOrder: fullProduct.sortOrder,
      });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load product details.');
    }
  }

  async function handleDelete(id: number) {
    setError(null);
    setMessage(null);
    try {
      await deleteAdminProduct(id);
      setMessage('Product deleted.');
      if (editingId === id) resetForm();
      await loadItems();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to delete product.');
    }
  }

  async function handleDeleteImage(productId: number, imageId: number) {
    try {
      await deleteAdminProductImage(productId, imageId);
      setMessage('Image deleted.');
      await loadItems();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to delete image.');
    }
  }

  function handleLogout() {
    logout();
    navigate('/admin/login', { replace: true });
  }

  function addSpec() {
    setForm((current) => ({ ...current, specs: [...current.specs, { ...emptySpec }] }));
  }

  function updateSpec(index: number, field: keyof ProductSpec, value: string) {
    setForm((current) => ({
      ...current,
      specs: current.specs.map((spec, i) => (i === index ? { ...spec, [field]: value } : spec)),
    }));
  }

  function removeSpec(index: number) {
    setForm((current) => ({ ...current, specs: current.specs.filter((_, i) => i !== index) }));
  }

  function addAccessory() {
    setForm((current) => ({ ...current, accessories: [...current.accessories, ''] }));
  }

  function updateAccessory(index: number, value: string) {
    setForm((current) => ({
      ...current,
      accessories: current.accessories.map((acc, i) => (i === index ? value : acc)),
    }));
  }

  function removeAccessory(index: number) {
    setForm((current) => ({ ...current, accessories: current.accessories.filter((_, i) => i !== index) }));
  }

  if (isLoading) {
    return <main className="min-h-screen bg-[#f7f7f5] p-8 text-slate-600">Loading products...</main>;
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ak-blue">Admin</p>
            <h1 className="font-display text-3xl font-bold text-ak-navy-900">Products</h1>
          </div>
          <button type="button" onClick={handleLogout} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Sign out</button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 font-display text-2xl font-bold text-ak-navy-900">Product list</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {items.length === 0 ? (
                <p className="text-sm text-slate-500">No products yet.</p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-ak-navy-900">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.brand} • {item.sku}</p>
                        <p className="text-xs text-slate-500">{item.shortDescription}</p>
                        <p className="text-xs text-slate-500">{item.isFeatured ? '• Featured' : ''} {item.isActive ? '• Active' : '• Inactive'}</p>
                        {item.images.length > 0 && (
                          <div className="mt-2 flex gap-1">
                            {item.images.map((img) => (
                              <div key={img.id} className="relative group">
                                <img src={img.url} alt="" className="h-12 w-12 object-cover rounded border border-slate-200" />
                                <button
                                  type="button"
                                  onClick={() => handleDeleteImage(item.id, img.id)}
                                  className="absolute inset-0 bg-red-500/80 text-white text-xs opacity-0 group-hover:opacity-100 flex items-center justify-center rounded"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
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

          <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-lg max-h-[600px] overflow-y-auto">
            <h2 className="mb-4 font-display text-2xl font-bold text-ak-navy-900">{editingId ? 'Edit product' : 'New product'}</h2>
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700">
                Category
                <select value={form.categoryId} onChange={(event) => setForm((current) => ({ ...current, categoryId: Number(event.target.value) }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" required>
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Brand
                <input value={form.brand ?? ''} onChange={(event) => setForm((current) => ({ ...current, brand: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" required />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Name
                <input value={form.name ?? ''} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" required />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                SKU
                <input value={form.sku ?? ''} onChange={(event) => setForm((current) => ({ ...current, sku: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" required />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Short description
                <input value={form.shortDescription ?? ''} onChange={(event) => setForm((current) => ({ ...current, shortDescription: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" required />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Description
                <textarea value={form.description ?? ''} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" rows={4} required />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Price (optional)
                <input type="number" step="0.01" value={form.price ?? ''} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value ? Number(event.target.value) : null }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
              </label>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-700">Specifications</span>
                  <button type="button" onClick={addSpec} className="text-xs text-ak-blue font-semibold">+ Add spec</button>
                </div>
                {form.specs.map((spec, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      placeholder="Label"
                      value={spec.label}
                      onChange={(e) => updateSpec(index, 'label', e.target.value)}
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                    <input
                      placeholder="Value"
                      value={spec.value}
                      onChange={(e) => updateSpec(index, 'value', e.target.value)}
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                    <button type="button" onClick={() => removeSpec(index)} className="text-red-600 font-semibold px-2">×</button>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-700">Accessories</span>
                  <button type="button" onClick={addAccessory} className="text-xs text-ak-blue font-semibold">+ Add accessory</button>
                </div>
                {form.accessories.map((acc, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      placeholder="Accessory name"
                      value={acc}
                      onChange={(e) => updateAccessory(index, e.target.value)}
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                    <button type="button" onClick={() => removeAccessory(index)} className="text-red-600 font-semibold px-2">×</button>
                  </div>
                ))}
              </div>

              <label className="block text-sm font-semibold text-slate-700">
                Sort order
                <input type="number" value={form.sortOrder ?? 0} onChange={(event) => setForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Images
                <input type="file" accept="image/*" multiple onChange={(event) => setImages(Array.from(event.target.files || []))} className="mt-2 block w-full text-sm font-normal" />
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
                <button type="submit" disabled={isSaving} className="rounded-lg bg-ak-blue px-5 py-3 font-bold text-white disabled:opacity-60">{isSaving ? 'Saving...' : editingId ? 'Update product' : 'Create product'}</button>
                {editingId !== null && <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 px-5 py-3 font-bold text-slate-700">Cancel</button>}
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
