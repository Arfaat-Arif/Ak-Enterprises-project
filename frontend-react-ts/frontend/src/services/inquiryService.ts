import { apiClient } from './apiClient';
import type { PaginatedInquiries } from '../types/inquiry.types';

export async function getAdminInquiries(page = 1): Promise<PaginatedInquiries> {
  const { data } = await apiClient.get<PaginatedInquiries>('/admin/inquiries', {
    params: { page },
  });
  return data;
}
