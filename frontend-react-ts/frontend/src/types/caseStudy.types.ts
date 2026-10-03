export interface CaseStudy {
  id: number;
  title: string;
  slug: string;
  clientName: string | null;
  summary: string | null;
  description: string | null;
  imageUrl: string | null;
  url: string | null;
  sortOrder: number;
  isFeatured: boolean;
  isActive: boolean;
}

export interface CaseStudyPayload {
  title: string;
  slug: string;
  clientName: string;
  summary: string;
  description: string;
  url: string;
  sortOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  image?: File;
}
