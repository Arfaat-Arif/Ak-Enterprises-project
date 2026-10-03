export interface SiteSettings {
    id: number;
    siteName: string;
    tagline: string | null;
    subTagline: string | null;
    logoUrl: string | null;
    faviconUrl: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    address: string | null;
    businessHours: string | null;
}
