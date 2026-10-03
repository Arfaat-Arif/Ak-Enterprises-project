import { apiClient } from './apiClient';
import type { Insight, InsightPayload } from '../types/insight.types';
import type { ApiListResponse } from '../types/api.types';

// ─── Public API ─────────────────────────────────────────────────────────────

export async function getInsights(): Promise<Insight[]> {
  const { data } = await apiClient.get<ApiListResponse<Insight>>('/insights');
  return data.data;
}

// ─── Admin API ───────────────────────────────────────────────────────────────

export async function getAdminInsights(): Promise<Insight[]> {
  const { data } = await apiClient.get<ApiListResponse<Insight>>('/admin/insights');
  return data.data;
}

export async function getAdminInsight(id: number): Promise<Insight> {
  const { data } = await apiClient.get<{ data: Insight }>(`/admin/insights/${id}`);
  return data.data;
}

function toInsightFormData(payload: InsightPayload, asUpdate = false): FormData {
  const fd = new FormData();
  if (asUpdate) fd.append('_method', 'PUT');
  fd.append('title', payload.title);
  fd.append('slug', payload.slug);
  fd.append('excerpt', payload.excerpt);
  fd.append('content', payload.content);
  if (payload.publishedAt) fd.append('published_at', payload.publishedAt);
  fd.append('author', payload.author);
  fd.append('sort_order', String(payload.sortOrder));
  fd.append('is_featured', payload.isFeatured ? '1' : '0');
  fd.append('is_active', payload.isActive ? '1' : '0');
  if (payload.image) fd.append('image', payload.image);
  return fd;
}

export async function createAdminInsight(payload: InsightPayload): Promise<Insight> {
  const { data } = await apiClient.post<{ data: Insight }>(
    '/admin/insights',
    toInsightFormData(payload),
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data.data;
}

export async function updateAdminInsight(id: number, payload: InsightPayload): Promise<Insight> {
  const { data } = await apiClient.post<{ data: Insight }>(
    `/admin/insights/${id}`,
    toInsightFormData(payload, true),
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data.data;
}

export async function deleteAdminInsight(id: number): Promise<void> {
  await apiClient.delete(`/admin/insights/${id}`);
}
