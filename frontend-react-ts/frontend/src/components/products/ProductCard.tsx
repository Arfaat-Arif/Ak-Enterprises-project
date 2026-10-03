import { Link } from 'react-router-dom';
import type { Product } from '../../types/product.types';
import { SafeImage } from '../common/SafeImage';
import { ROUTES } from '../../config/routes.config';
import { formatPrice } from '../../utils/formatters';
import styles from './ProductCard.module.css';

export function ProductCard({ product }: { product: Product }) {
  const primaryImage = product.images[0];

  return (
    <Link to={ROUTES.productDetail(product.slug)} className={styles.card}>
      <div className={styles.imageWrap}>
        {primaryImage ? (
          <SafeImage
            src={primaryImage.url}
            alt={primaryImage.alt}
            className={styles.image}
            fallbackSrc="/images/placeholder-product.svg"
            fallbackClassName={styles.imagePlaceholder}
          />
        ) : (
          <div className={styles.imagePlaceholder} aria-hidden="true" />
        )}
        <span className={styles.brandBadge}>{product.brand}</span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.desc}>{product.shortDescription}</p>
        <div className={styles.footer}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          <span className={styles.cta}>View details →</span>
        </div>
      </div>
    </Link>
  );
}
