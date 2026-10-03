export type CategoryType = 'brand' | 'product_type' | 'security';

export interface Category {
  id: number;
  name: string;
  slug: string;
  type: CategoryType;
  imageUrl: string | null;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface CategoryPayload {
  name: string;
  type: CategoryType;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  image?: File;
}
