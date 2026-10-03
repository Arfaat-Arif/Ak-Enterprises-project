export interface ProductImage {
  id: number;
  url: string;
  alt: string;
  sortOrder: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: number;
  categoryId: number;
  categorySlug: string;
  brand: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  specs: ProductSpec[];
  accessories: string[];
  price: number | null;
  images: ProductImage[];
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface ProductPayload {
  categoryId: number;
  brand: string;
  name: string;
  sku: string;
  shortDescription: string;
  description: string;
  specs: ProductSpec[];
  accessories: string[];
  price: number | null;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  images?: File[];
}
