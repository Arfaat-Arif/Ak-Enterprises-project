import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { ROUTES } from '../config/routes.config';
import styles from './StaticPage.module.css';

export function NotFoundPage() {
  return (
    <section className={styles.notFound}>
      <div className={`container ${styles.notFoundInner}`}>
        <p className={styles.notFoundCode}>404</p>
        <h1>Page not found</h1>
        <p className={styles.notFoundCopy}>
          The page you're looking for doesn't exist or may have been moved. Head back to the homepage or browse our
          product catalog.
        </p>
        <div className={styles.notFoundActions}>
          <Link to={ROUTES.home}>
            <Button variant="primary">Back to Home</Button>
          </Link>
          <Link to={ROUTES.products}>
            <Button variant="outline">Browse Products</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
