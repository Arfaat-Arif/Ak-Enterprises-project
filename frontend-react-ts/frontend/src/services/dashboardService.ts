import { apiClient } from './apiClient';

export interface DashboardStats {
  products: number;
  categories: number;
  services: number;
  brands: number;
  industries: number;
  caseStudies: number;
  insights: number;
  trustStats: number;
  inquiries: number;
  newsletterSubscribers: number;
}

interface DashboardStatsResponse {
  data: DashboardStats;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await apiClient.get<DashboardStatsResponse>('/admin/dashboard/stats');
  return data.data;
}
