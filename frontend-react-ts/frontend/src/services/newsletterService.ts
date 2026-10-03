import { apiClient } from './apiClient';
import type { NewsletterPayload } from '../types/api.types';

export async function subscribeToNewsletter(payload: NewsletterPayload): Promise<void> {
  await apiClient.post('/newsletter/subscribe', payload);
}
