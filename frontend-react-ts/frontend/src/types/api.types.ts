export interface PaginationMeta {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

export interface ApiListResponse<T> {
  data: T[];
  meta?: PaginationMeta;
}

export interface ApiItemResponse<T> {
  data: T;
}

export interface InquiryPayload {
  productId?: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}

export interface NewsletterPayload {
  email: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
