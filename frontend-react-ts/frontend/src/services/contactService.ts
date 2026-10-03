import { apiClient } from './apiClient';
import type { InquiryPayload } from '../types/api.types';

export async function submitInquiry(payload: InquiryPayload): Promise<void> {
  await apiClient.post('/inquiries', payload);
}
