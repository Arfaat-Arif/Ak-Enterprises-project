import { useContext } from 'react';
import { ProductFilterContext } from '../context/productFilter.context';

export function useProductFilter() {
    const ctx = useContext(ProductFilterContext);
    if (!ctx) throw new Error('useProductFilter must be used within a ProductFilterProvider');
    return ctx;
}
