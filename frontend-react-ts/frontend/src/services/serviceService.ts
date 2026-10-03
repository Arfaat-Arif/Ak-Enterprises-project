import { apiClient } from './apiClient';
import type { ApiListResponse } from '../types/api.types';
import type { Service, ServicePayload } from '../types/service.types';

export async function getServices(): Promise<Service[]> {
    const { data } = await apiClient.get<ApiListResponse<Service>>('/services');
    return data.data;
}

export async function getAdminServices(): Promise<Service[]> {
    const { data } = await apiClient.get<ApiListResponse<Service>>('/admin/services');
    return data.data;
}

export async function getAdminService(id: number): Promise<Service> {
    const { data } = await apiClient.get<{ data: Service }>(`/admin/services/${id}`);
    return data.data;
}

function toFormData(payload: ServicePayload, asUpdate = false): FormData {
    const formData = new FormData();
    if (asUpdate) formData.append('_method', 'PUT');
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
    return formData;
}

export async function createAdminService(payload: ServicePayload): Promise<Service> {
    const { data } = await apiClient.post<{ data: Service }>('/admin/services', toFormData(payload), {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data.data;
}

export async function updateAdminService(id: number, payload: ServicePayload): Promise<Service> {
    const { data } = await apiClient.post<{ data: Service }>(`/admin/services/${id}`, toFormData(payload, true), {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data.data;
}

export async function deleteAdminService(id: number): Promise<void> {
    await apiClient.delete(`/admin/services/${id}`);
}
