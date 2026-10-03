import { apiClient } from './apiClient';
import type { PaginatedNewsletterSubscribers } from '../types/newsletterSubscriber.types';

export async function getAdminNewsletterSubscribers(page = 1): Promise<PaginatedNewsletterSubscribers> {
  const { data } = await apiClient.get<PaginatedNewsletterSubscribers>('/admin/newsletter-subscribers', {
    params: { page },
  });
  return data;
}
