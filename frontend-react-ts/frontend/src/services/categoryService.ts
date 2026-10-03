import { apiClient } from './apiClient';
import type { Category, CategoryPayload, CategoryType } from '../types/category.types';
import type { ApiListResponse } from '../types/api.types';

// ─── Public API ─────────────────────────────────────────────────────────────

export async function getCategories(type?: CategoryType): Promise<Category[]> {
  const { data } = await apiClient.get<ApiListResponse<Category>>('/categories', {
    params: type ? { type } : undefined,
  });
  return data.data;
}

export async function getFeaturedCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<ApiListResponse<Category>>('/categories/featured');
  return data.data;
}

// ─── Admin API ───────────────────────────────────────────────────────────────

export async function getAdminCategories(type?: CategoryType): Promise<Category[]> {
  const { data } = await apiClient.get<ApiListResponse<Category>>('/admin/categories', {
    params: type ? { type } : undefined,
  });
  return data.data;
}

export async function getAdminCategory(id: number): Promise<Category> {
  const { data } = await apiClient.get<{ data: Category }>(`/admin/categories/${id}`);
  return data.data;
}

function toCategoryFormData(payload: CategoryPayload, asUpdate = false): FormData {
  const fd = new FormData();
  if (asUpdate) fd.append('_method', 'PUT');
  fd.append('name', payload.name);
  fd.append('type', payload.type);
  fd.append('is_featured', payload.isFeatured ? '1' : '0');
  fd.append('is_active', payload.isActive ? '1' : '0');
  fd.append('sort_order', String(payload.sortOrder ?? 0));
  if (payload.image) fd.append('image', payload.image);
  return fd;
}

export async function createAdminCategory(payload: CategoryPayload): Promise<Category> {
  const { data } = await apiClient.post<{ data: Category }>(
    '/admin/categories',
    toCategoryFormData(payload),
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data.data;
}

export async function updateAdminCategory(id: number, payload: CategoryPayload): Promise<Category> {
  const { data } = await apiClient.post<{ data: Category }>(
    `/admin/categories/${id}`,
    toCategoryFormData(payload, true),
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data.data;
}

export async function deleteAdminCategory(id: number): Promise<void> {
  await apiClient.delete(`/admin/categories/${id}`);
}
