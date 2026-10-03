import { createContext } from 'react';

export interface ProductFilterValue {
    category: string | null;
    search: string;
    setCategory: (category: string | null) => void;
    setSearch: (search: string) => void;
    reset: () => void;
}

export const ProductFilterContext = createContext<ProductFilterValue | undefined>(undefined);
