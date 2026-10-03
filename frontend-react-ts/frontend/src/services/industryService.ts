import { apiClient } from './apiClient';
import type { ApiListResponse } from '../types/api.types';
import type { Industry, IndustryPayload } from '../types/industry.types';

export async function getIndustries(): Promise<Industry[]> {
    const { data } = await apiClient.get<ApiListResponse<Industry>>('/industries');
    return data.data;
}

export async function getAdminIndustries(): Promise<Industry[]> {
    const { data } = await apiClient.get<ApiListResponse<Industry>>('/admin/industries');
    return data.data;
}

export async function createAdminIndustry(payload: IndustryPayload): Promise<Industry> {
    const formData = new FormData();
    formData.append('name', payload.name);
    if (payload.slug) formData.append('slug', payload.slug);
    if (payload.shortDescription) formData.append('short_description', payload.shortDescription);
    if (payload.description) formData.append('description', payload.description);
    if (payload.icon) formData.append('icon', payload.icon);
    if (payload.url) formData.append('url', payload.url);
    formData.append('sort_order', String(payload.sortOrder ?? 0));
    formData.append('is_featured', payload.isFeatured ? '1' : '0');
    formData.append('is_active', (payload.isActive ?? true) ? '1' : '0');
    if (payload.image) formData.append('image', payload.image);

    const { data } = await apiClient.post<{ data: Industry }>('/admin/industries', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data.data;
}

export async function updateAdminIndustry(id: number, payload: IndustryPayload): Promise<Industry> {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('name', payload.name);
    if (payload.slug) formData.append('slug', payload.slug);
    if (payload.shortDescription) formData.append('short_description', payload.shortDescription);
    if (payload.description) formData.append('description', payload.description);
    if (payload.icon) formData.append('icon', payload.icon);
    if (payload.url) formData.append('url', payload.url);
    formData.append('sort_order', String(payload.sortOrder ?? 0));
    formData.append('is_featured', payload.isFeatured ? '1' : '0');
    formData.append('is_active', (payload.isActive ?? true) ? '1' : '0');
    if (payload.image) formData.append('image', payload.image);

    const { data } = await apiClient.post<{ data: Industry }>(`/admin/industries/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data.data;
}

export async function deleteAdminIndustry(id: number): Promise<void> {
    await apiClient.delete(`/admin/industries/${id}`);
}
