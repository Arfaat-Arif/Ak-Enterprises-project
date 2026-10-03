import { apiClient } from './apiClient';
import type { SocialLink, SocialLinkPayload } from '../types/socialLink.types';
import type { ApiListResponse } from '../types/api.types';

// ─── Public API ─────────────────────────────────────────────────────────────

export async function getSocialLinks(): Promise<SocialLink[]> {
  const { data } = await apiClient.get<ApiListResponse<SocialLink>>('/social-links');
  return data.data;
}

// ─── Admin API ───────────────────────────────────────────────────────────────

export async function getAdminSocialLinks(): Promise<SocialLink[]> {
  const { data } = await apiClient.get<ApiListResponse<SocialLink>>('/admin/social-links');
  return data.data;
}

export async function getAdminSocialLink(id: number): Promise<SocialLink> {
  const { data } = await apiClient.get<{ data: SocialLink }>(`/admin/social-links/${id}`);
  return data.data;
}

export async function createAdminSocialLink(payload: SocialLinkPayload): Promise<SocialLink> {
  const { data } = await apiClient.post<{ data: SocialLink }>('/admin/social-links', payload);
  return data.data;
}

export async function updateAdminSocialLink(id: number, payload: SocialLinkPayload): Promise<SocialLink> {
  const { data } = await apiClient.put<{ data: SocialLink }>(`/admin/social-links/${id}`, payload);
  return data.data;
}

export async function deleteAdminSocialLink(id: number): Promise<void> {
  await apiClient.delete(`/admin/social-links/${id}`);
}
