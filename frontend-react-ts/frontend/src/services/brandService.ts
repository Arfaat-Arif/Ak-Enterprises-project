import { apiClient } from './apiClient';
import type { Brand, BrandPayload } from '../types/brand.types';
import type { ApiListResponse } from '../types/api.types';

export async function getBrands(): Promise<Brand[]> {
    const { data } = await apiClient.get<ApiListResponse<Brand>>('/brands');
    return data.data;
}

export async function getAdminBrands(): Promise<Brand[]> {
    const { data } = await apiClient.get<ApiListResponse<Brand>>('/admin/brands');
    return data.data;
}

export async function createAdminBrand(payload: BrandPayload): Promise<Brand> {
    const formData = new FormData();
    formData.append('name', payload.name);
    if (payload.websiteUrl) formData.append('website_url', payload.websiteUrl);
    formData.append('sort_order', String(payload.sortOrder ?? 0));
    formData.append('is_featured', String(Boolean(payload.isFeatured ?? false)));
    formData.append('is_active', String(Boolean(payload.isActive ?? true)));
    if (payload.logo) formData.append('logo', payload.logo);

    const { data } = await apiClient.post<{ data: Brand }>('/admin/brands', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data.data;
}

export async function updateAdminBrand(id: number, payload: BrandPayload): Promise<Brand> {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('name', payload.name);
    if (payload.websiteUrl) formData.append('website_url', payload.websiteUrl);
    formData.append('sort_order', String(payload.sortOrder ?? 0));
    formData.append('is_featured', String(Boolean(payload.isFeatured ?? false)));
    formData.append('is_active', String(Boolean(payload.isActive ?? true)));
    if (payload.logo) formData.append('logo', payload.logo);

    const { data } = await apiClient.post<{ data: Brand }>(`/admin/brands/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data.data;
}

export async function deleteAdminBrand(id: number): Promise<void> {
    await apiClient.delete(`/admin/brands/${id}`);
}
