import { apiClient } from './apiClient';
import type { SiteSettings } from '../types/siteSettings.types';

interface SiteSettingsResponse {
    data: SiteSettings;
}

export interface SiteSettingsForm {
    siteName: string;
    tagline: string;
    subTagline: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    businessHours: string;
    logo?: File;
    favicon?: File;
}

export async function getSiteSettings(): Promise<SiteSettings> {
    const { data } = await apiClient.get<SiteSettingsResponse>('/settings');
    return data.data;
}

export async function getAdminSiteSettings(): Promise<SiteSettings> {
    const { data } = await apiClient.get<SiteSettingsResponse>('/admin/settings');
    return data.data;
}

export async function updateAdminSiteSettings(form: SiteSettingsForm): Promise<SiteSettings> {
    const payload = new FormData();
    payload.append('_method', 'PUT');
    payload.append('site_name', form.siteName);
    payload.append('tagline', form.tagline);
    payload.append('sub_tagline', form.subTagline);
    payload.append('contact_email', form.contactEmail);
    payload.append('contact_phone', form.contactPhone);
    payload.append('address', form.address);
    payload.append('business_hours', form.businessHours);
    if (form.logo) payload.append('logo', form.logo);
    if (form.favicon) payload.append('favicon', form.favicon);

    const { data } = await apiClient.post<SiteSettingsResponse>('/admin/settings', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
}
