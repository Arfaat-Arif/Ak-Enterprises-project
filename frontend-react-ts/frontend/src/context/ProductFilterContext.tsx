import { useMemo, useState, type ReactNode } from 'react';
import { ProductFilterContext, type ProductFilterValue } from './productFilter.context';

export function ProductFilterProvider({ children }: { children: ReactNode }) {
  const [category, setCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const value = useMemo<ProductFilterValue>(
    () => ({
      category,
      search,
      setCategory,
      setSearch,
      reset: () => {
        setCategory(null);
        setSearch('');
      },
    }),
    [category, search]
  );

  return <ProductFilterContext.Provider value={value}>{children}</ProductFilterContext.Provider>;
}
