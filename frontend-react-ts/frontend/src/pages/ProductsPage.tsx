import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductFilters } from '../components/products/ProductFilters';
import { ProductGrid } from '../components/products/ProductGrid';
import { SectionHeading } from '../components/common/SectionHeading';
import styles from './ProductsPage.module.css';

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState<string | null>(searchParams.get('category'));
  const [search, setSearch] = useState('');

  const { data: products, loading, error, refetch } = useProducts({
    category: category ?? undefined,
    search: search || undefined,
  });

  // Keep the URL in sync so a category link (e.g. from the homepage) can
  // deep-link straight into a filtered view, and the filtered view is
  // shareable/bookmarkable.
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (category) next.set('category', category);
    else next.delete('category');
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return (
    <div className={`container-ak ${styles.page}`}>
      <div className="mb-8 w-full px-4 text-center sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Catalog" title="Products" align="center" />
      </div>
      <div className={styles.layout}>
        <ProductFilters selectedCategory={category} onCategoryChange={setCategory} onSearchChange={setSearch} />
        <div>
          <ProductGrid products={products} loading={loading} error={error} onRetry={refetch} />
        </div>
      </div>
    </div>
  );
}
