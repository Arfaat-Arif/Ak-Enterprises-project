export interface Inquiry {
  id: number;
  productId: number | null;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
  product?: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface PaginatedInquiries {
  data: Inquiry[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    to: number | null;
    last_page: number;
    total: number;
  };
}
