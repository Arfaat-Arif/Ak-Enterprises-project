import { Link } from 'react-router-dom';
import type { Category } from '../../types/category.types';
import { SafeImage } from '../common/SafeImage';
import { ROUTES } from '../../config/routes.config';
import styles from './CategoryCard.module.css';

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link to={`${ROUTES.products}?category=${category.slug}`} className={styles.card}>
      <SafeImage
        src={category.imageUrl ?? undefined}
        alt={category.name}
        className={styles.image}
        fallbackSrc="/images/placeholder-category.svg"
        fallbackClassName={styles.imageFallback}
      />
      <div className={styles.caption}>
        <span className={styles.eyebrow}>Top Collections</span>
        <span className={styles.name}>{category.name}</span>
      </div>
    </Link>
  );
}
