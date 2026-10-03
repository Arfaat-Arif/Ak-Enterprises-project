export interface Insight {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  imageUrl: string | null;
  publishedAt: string | null;
  author: string | null;
  sortOrder: number;
  isFeatured: boolean;
  isActive: boolean;
}

export interface InsightPayload {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string | null;
  author: string;
  sortOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  image?: File;
}
