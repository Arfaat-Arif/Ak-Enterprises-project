export interface Service {
    id: number;
    name: string;
    slug: string;
    shortDescription: string | null;
    description: string | null;
    imageUrl: string | null;
    icon: string | null;
    url: string | null;
    sortOrder: number;
    isFeatured: boolean;
    isActive: boolean;
}

export interface ServicePayload {
    name: string;
    slug?: string;
    shortDescription?: string | null;
    description?: string | null;
    icon?: string | null;
    url?: string | null;
    sortOrder?: number;
    isFeatured?: boolean;
    isActive?: boolean;
    image?: File;
}
