import { apiClient } from './apiClient';
import type { TrustStat, TrustStatPayload } from '../types/trustStat.types';
import type { ApiListResponse } from '../types/api.types';

// ─── Public API ─────────────────────────────────────────────────────────────

export async function getTrustStats(): Promise<TrustStat[]> {
  const { data } = await apiClient.get<ApiListResponse<TrustStat>>('/trust-stats');
  return data.data;
}

// ─── Admin API ───────────────────────────────────────────────────────────────

export async function getAdminTrustStats(): Promise<TrustStat[]> {
  const { data } = await apiClient.get<ApiListResponse<TrustStat>>('/admin/trust-stats');
  return data.data;
}

export async function getAdminTrustStat(id: number): Promise<TrustStat> {
  const { data } = await apiClient.get<{ data: TrustStat }>(`/admin/trust-stats/${id}`);
  return data.data;
}

export async function createAdminTrustStat(payload: TrustStatPayload): Promise<TrustStat> {
  const { data } = await apiClient.post<{ data: TrustStat }>('/admin/trust-stats', payload);
  return data.data;
}

export async function updateAdminTrustStat(id: number, payload: TrustStatPayload): Promise<TrustStat> {
  const { data } = await apiClient.put<{ data: TrustStat }>(`/admin/trust-stats/${id}`, payload);
  return data.data;
}

export async function deleteAdminTrustStat(id: number): Promise<void> {
  await apiClient.delete(`/admin/trust-stats/${id}`);
}
