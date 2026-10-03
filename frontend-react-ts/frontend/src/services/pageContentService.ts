import { apiClient } from './apiClient';
import type { PageContentMap } from '../types/pageContent.types';

// ─── Public API ─────────────────────────────────────────────────────────────

export async function getPageContent(pageKey: string): Promise<PageContentMap> {
  const { data } = await apiClient.get<{ data: PageContentMap }>(`/page-content/${pageKey}`);
  return data.data;
}

// ─── Admin API ───────────────────────────────────────────────────────────────

import type { PageContent, PageContentPayload } from '../types/pageContent.types';
import type { ApiListResponse } from '../types/api.types';

export async function getAdminPageContents(): Promise<PageContent[]> {
  const { data } = await apiClient.get<ApiListResponse<PageContent>>('/admin/page-content');
  return data.data;
}

export async function getAdminPageContent(id: number): Promise<PageContent> {
  const { data } = await apiClient.get<{ data: PageContent }>(`/admin/page-content/${id}`);
  return data.data;
}

export async function createAdminPageContent(payload: PageContentPayload): Promise<PageContent> {
  const { data } = await apiClient.post<{ data: PageContent }>('/admin/page-content', payload);
  return data.data;
}

export async function updateAdminPageContent(id: number, payload: PageContentPayload): Promise<PageContent> {
  const { data } = await apiClient.put<{ data: PageContent }>(`/admin/page-content/${id}`, payload);
  return data.data;
}

export async function deleteAdminPageContent(id: number): Promise<void> {
  await apiClient.delete(`/admin/page-content/${id}`);
}
