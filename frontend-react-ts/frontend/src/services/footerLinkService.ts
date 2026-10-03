import { apiClient } from './apiClient';
import type { FooterLink, FooterLinkPayload } from '../types/footerLink.types';
import type { ApiListResponse } from '../types/api.types';

// ─── Public API ─────────────────────────────────────────────────────────────

export async function getFooterLinks(): Promise<FooterLink[]> {
  const { data } = await apiClient.get<ApiListResponse<FooterLink>>('/footer-links');
  return data.data;
}

// ─── Admin API ───────────────────────────────────────────────────────────────

export async function getAdminFooterLinks(): Promise<FooterLink[]> {
  const { data } = await apiClient.get<ApiListResponse<FooterLink>>('/admin/footer-links');
  return data.data;
}

export async function getAdminFooterLink(id: number): Promise<FooterLink> {
  const { data } = await apiClient.get<{ data: FooterLink }>(`/admin/footer-links/${id}`);
  return data.data;
}

export async function createAdminFooterLink(payload: FooterLinkPayload): Promise<FooterLink> {
  const { data } = await apiClient.post<{ data: FooterLink }>('/admin/footer-links', payload);
  return data.data;
}

export async function updateAdminFooterLink(id: number, payload: FooterLinkPayload): Promise<FooterLink> {
  const { data } = await apiClient.put<{ data: FooterLink }>(`/admin/footer-links/${id}`, payload);
  return data.data;
}

export async function deleteAdminFooterLink(id: number): Promise<void> {
  await apiClient.delete(`/admin/footer-links/${id}`);
}
