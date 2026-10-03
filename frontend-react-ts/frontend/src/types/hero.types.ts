export interface HeroSection {
    id: number;
    title: string;
    description: string | null;
    badge: string | null;
    backgroundImageUrl: string | null;
    backgroundVideoUrl: string | null;
    primaryButtonText: string | null;
    primaryButtonUrl: string | null;
    secondaryButtonText: string | null;
    secondaryButtonUrl: string | null;
    sortOrder: number;
    isActive: boolean;
}

export interface HeroSectionPayload {
    title: string;
    description?: string | null;
    badge?: string | null;
    primaryButtonText?: string | null;
    primaryButtonUrl?: string | null;
    secondaryButtonText?: string | null;
    secondaryButtonUrl?: string | null;
    sortOrder?: number;
    isActive?: boolean;
    backgroundImage?: File;
    backgroundVideo?: File;
}
