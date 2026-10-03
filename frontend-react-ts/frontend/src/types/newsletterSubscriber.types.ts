export interface NewsletterSubscriber {
  id: number;
  email: string;
  subscribedAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedNewsletterSubscribers {
  data: NewsletterSubscriber[];
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
