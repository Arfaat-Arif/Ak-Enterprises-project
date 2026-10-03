import { apiClient } from './apiClient';
import type { Product, ProductPayload } from '../types/product.types';
import type { ApiItemResponse, ApiListResponse } from '../types/api.types';

export interface ProductQuery {
  category?: string;
  search?: string;
  featured?: boolean;
  page?: number;
}

// ─── Public API ─────────────────────────────────────────────────────────────

export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  const { data } = await apiClient.get<ApiListResponse<Product>>('/products', {
    params: {
      category: query.category,
      search: query.search,
      featured: query.featured ? 1 : undefined,
      page: query.page,
    },
  });
  return data.data;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data } = await apiClient.get<ApiItemResponse<Product>>(`/products/${slug}`);
    return data.data;
  } catch (err: unknown) {
    // 404 = product truly not found; surface that as null
    if (err && typeof err === 'object' && 'response' in err) {
      const axiosErr = err as { response?: { status?: number } };
      if (axiosErr.response?.status === 404) return null;
    }
    throw err;
  }
}

// ─── Admin API ───────────────────────────────────────────────────────────────

export async function getAdminProducts(query: ProductQuery = {}): Promise<Product[]> {
  const { data } = await apiClient.get<ApiListResponse<Product>>('/admin/products', {
    params: {
      category: query.category,
      search: query.search,
      page: query.page,
    },
  });
  return data.data;
}

export async function getAdminProduct(id: number): Promise<Product> {
  const { data } = await apiClient.get<{ data: Product }>(`/admin/products/${id}`);
  return data.data;
}

function toProductFormData(payload: ProductPayload, asUpdate = false): FormData {
  const fd = new FormData();
  if (asUpdate) fd.append('_method', 'PUT');
  fd.append('category_id', String(payload.categoryId));
  fd.append('brand', payload.brand);
  fd.append('name', payload.name);
  fd.append('sku', payload.sku);
  fd.append('short_description', payload.shortDescription);
  fd.append('description', payload.description);
  fd.append('specs', JSON.stringify(payload.specs ?? []));
  fd.append('accessories', JSON.stringify(payload.accessories ?? []));
  if (payload.price != null) fd.append('price', String(payload.price));
  fd.append('is_featured', payload.isFeatured ? '1' : '0');
  fd.append('is_active', payload.isActive ? '1' : '0');
  fd.append('sort_order', String(payload.sortOrder ?? 0));
  if (payload.images) {
    payload.images.forEach((img) => fd.append('images[]', img));
  }
  return fd;
}

export async function createAdminProduct(payload: ProductPayload): Promise<Product> {
  const { data } = await apiClient.post<{ data: Product }>(
    '/admin/products',
    toProductFormData(payload),
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data.data;
}

export async function updateAdminProduct(id: number, payload: ProductPayload): Promise<Product> {
  const { data } = await apiClient.post<{ data: Product }>(
    `/admin/products/${id}`,
    toProductFormData(payload, true),
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data.data;
}

export async function deleteAdminProductImage(productId: number, imageId: number): Promise<void> {
  await apiClient.delete(`/admin/products/${productId}/images/${imageId}`);
}

export async function deleteAdminProduct(id: number): Promise<void> {
  await apiClient.delete(`/admin/products/${id}`);
}
