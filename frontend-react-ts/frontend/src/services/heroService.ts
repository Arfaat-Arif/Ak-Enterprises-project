import { apiClient } from './apiClient';
import type { HeroSection, HeroSectionPayload } from '../types/hero.types';
import type { ApiListResponse } from '../types/api.types';

export async function getHeroSections(): Promise<HeroSection[]> {
    const { data } = await apiClient.get<ApiListResponse<HeroSection>>('/hero');
    return data.data;
}

export async function getAdminHeroSections(): Promise<HeroSection[]> {
    const { data } = await apiClient.get<ApiListResponse<HeroSection>>('/admin/hero');
    return data.data;
}

export async function createAdminHeroSection(payload: HeroSectionPayload): Promise<HeroSection> {
    const formData = new FormData();
    formData.append('_method', 'POST');
    formData.append('title', payload.title);
    if (payload.description) formData.append('description', payload.description);
    if (payload.badge) formData.append('badge', payload.badge);
    if (payload.primaryButtonText) formData.append('primary_button_text', payload.primaryButtonText);
    if (payload.primaryButtonUrl) formData.append('primary_button_url', payload.primaryButtonUrl);
    if (payload.secondaryButtonText) formData.append('secondary_button_text', payload.secondaryButtonText);
    if (payload.secondaryButtonUrl) formData.append('secondary_button_url', payload.secondaryButtonUrl);
    formData.append('sort_order', String(payload.sortOrder ?? 0));
    formData.append('is_active', String(payload.isActive ?? true));
    if (payload.backgroundImage) formData.append('background_image', payload.backgroundImage);
    if (payload.backgroundVideo) formData.append('background_video', payload.backgroundVideo);

    const { data } = await apiClient.post<{ data: HeroSection }>('/admin/hero', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data.data;
}

export async function updateAdminHeroSection(id: number, payload: HeroSectionPayload): Promise<HeroSection> {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('title', payload.title);
    if (payload.description) formData.append('description', payload.description);
    if (payload.badge) formData.append('badge', payload.badge);
    if (payload.primaryButtonText) formData.append('primary_button_text', payload.primaryButtonText);
    if (payload.primaryButtonUrl) formData.append('primary_button_url', payload.primaryButtonUrl);
    if (payload.secondaryButtonText) formData.append('secondary_button_text', payload.secondaryButtonText);
    if (payload.secondaryButtonUrl) formData.append('secondary_button_url', payload.secondaryButtonUrl);
    formData.append('sort_order', String(payload.sortOrder ?? 0));
    formData.append('is_active', String(payload.isActive ?? true));
    if (payload.backgroundImage) formData.append('background_image', payload.backgroundImage);
    if (payload.backgroundVideo) formData.append('background_video', payload.backgroundVideo);

    const { data } = await apiClient.post<{ data: HeroSection }>(`/admin/hero/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data.data;
}

export async function deleteAdminHeroSection(id: number): Promise<void> {
    await apiClient.delete(`/admin/hero/${id}`);
}
