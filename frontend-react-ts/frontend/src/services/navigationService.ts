import { apiClient } from './apiClient';
import type { NavigationItem, NavigationItemPayload } from '../types/navigation.types';
import type { ApiListResponse } from '../types/api.types';

export async function getNavigation(): Promise<NavigationItem[]> {
  const { data } = await apiClient.get<ApiListResponse<NavigationItem>>('/navigation');
  return data.data;
}

export async function getAdminNavigation(): Promise<NavigationItem[]> {
  const { data } = await apiClient.get<ApiListResponse<NavigationItem>>('/admin/navigation');
  return data.data;
}

export async function createAdminNavigation(payload: NavigationItemPayload): Promise<NavigationItem> {
  const { data } = await apiClient.post<{ data: NavigationItem }>('/admin/navigation', payload);
  return data.data;
}

export async function updateAdminNavigation(id: number, payload: NavigationItemPayload): Promise<NavigationItem> {
  const { data } = await apiClient.put<{ data: NavigationItem }>(`/admin/navigation/${id}`, payload);
  return data.data;
}

export async function deleteAdminNavigation(id: number): Promise<void> {
  await apiClient.delete(`/admin/navigation/${id}`);
}
