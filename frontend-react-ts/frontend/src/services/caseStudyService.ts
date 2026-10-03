import { apiClient } from './apiClient';
import type { CaseStudy, CaseStudyPayload } from '../types/caseStudy.types';
import type { ApiListResponse } from '../types/api.types';

// ─── Public API ─────────────────────────────────────────────────────────────

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const { data } = await apiClient.get<ApiListResponse<CaseStudy>>('/case-studies');
  return data.data;
}

// ─── Admin API ───────────────────────────────────────────────────────────────

export async function getAdminCaseStudies(): Promise<CaseStudy[]> {
  const { data } = await apiClient.get<ApiListResponse<CaseStudy>>('/admin/case-studies');
  return data.data;
}

export async function getAdminCaseStudy(id: number): Promise<CaseStudy> {
  const { data } = await apiClient.get<{ data: CaseStudy }>(`/admin/case-studies/${id}`);
  return data.data;
}

function toCaseStudyFormData(payload: CaseStudyPayload, asUpdate = false): FormData {
  const fd = new FormData();
  if (asUpdate) fd.append('_method', 'PUT');
  fd.append('title', payload.title);
  fd.append('slug', payload.slug);
  fd.append('client_name', payload.clientName);
  fd.append('summary', payload.summary);
  fd.append('description', payload.description);
  fd.append('url', payload.url);
  fd.append('sort_order', String(payload.sortOrder));
  fd.append('is_featured', payload.isFeatured ? '1' : '0');
  fd.append('is_active', payload.isActive ? '1' : '0');
  if (payload.image) fd.append('image', payload.image);
  return fd;
}

export async function createAdminCaseStudy(payload: CaseStudyPayload): Promise<CaseStudy> {
  const { data } = await apiClient.post<{ data: CaseStudy }>(
    '/admin/case-studies',
    toCaseStudyFormData(payload),
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data.data;
}

export async function updateAdminCaseStudy(id: number, payload: CaseStudyPayload): Promise<CaseStudy> {
  const { data } = await apiClient.post<{ data: CaseStudy }>(
    `/admin/case-studies/${id}`,
    toCaseStudyFormData(payload, true),
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data.data;
}

export async function deleteAdminCaseStudy(id: number): Promise<void> {
  await apiClient.delete(`/admin/case-studies/${id}`);
}
