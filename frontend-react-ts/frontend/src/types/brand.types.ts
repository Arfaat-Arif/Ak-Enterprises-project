export interface Brand {
    id: number;
    name: string;
    logoUrl: string | null;
    websiteUrl: string | null;
    sortOrder: number;
    isFeatured: boolean;
    isActive: boolean;
}

export interface BrandPayload {
    name: string;
    websiteUrl?: string | null;
    sortOrder?: number;
    isFeatured?: boolean;
    isActive?: boolean;
    logo?: File;
}
