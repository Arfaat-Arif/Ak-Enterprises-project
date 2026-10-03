import type { Product } from '../../types/product.types';
import { ProductCard } from './ProductCard';
import { Loader } from '../common/Loader';
import { ErrorState } from '../common/ErrorState';
import styles from './ProductGrid.module.css';

interface ProductGridProps {
  products: Product[] | null;
  loading: boolean;
  error: unknown;
  onRetry?: () => void;
}

export function ProductGrid({ products, loading, error, onRetry }: ProductGridProps) {
  if (loading) return <Loader label="Loading products…" />;
  if (error) return <ErrorState message="Couldn't load products." onRetry={onRetry} />;
  if (!products || products.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No products match those filters yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
