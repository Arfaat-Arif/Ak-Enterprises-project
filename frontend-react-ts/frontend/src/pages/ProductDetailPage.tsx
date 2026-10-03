import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { getProductBySlug } from '../services/productService';
import { Loader } from '../components/common/Loader';
import { ErrorState } from '../components/common/ErrorState';
import { SafeImage } from '../components/common/SafeImage';
import { QuoteRequestForm } from '../components/forms/QuoteRequestForm';
import { ROUTES } from '../config/routes.config';
import { formatPrice } from '../utils/formatters';
import styles from './ProductDetailPage.module.css';

type Tab = 'overview' | 'specs' | 'accessories';

export function ProductDetailPage() {
  const { slug = '' } = useParams();
  const { data: product, loading, error, refetch } = useFetch(() => getProductBySlug(slug), [slug]);
  const [activeImage, setActiveImage] = useState(0);
  const [tab, setTab] = useState<Tab>('overview');

  if (loading) return <Loader label="Loading product…" />;
  if (error) return <ErrorState message="Couldn't load this product." onRetry={refetch} />;
  if (!product) {
    return (
      <div className={`container ${styles.notFound}`}>
        <h2>Product not found</h2>
        <p>
          <Link to={ROUTES.products}>← Back to all products</Link>
        </p>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : [{ id: 0, url: '', alt: product.name, sortOrder: 0 }];

  return (
    <div className={`container ${styles.page}`}>
      <p className={styles.breadcrumb}>
        <Link to={ROUTES.products}>Products</Link> / <span>{product.brand}</span>
      </p>

      <div className={styles.top}>
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            {images[activeImage].url ? (
              <SafeImage
                src={images[activeImage].url}
                alt={images[activeImage].alt}
                fallbackSrc="/images/placeholder-product.svg"
                fallbackClassName={styles.imagePlaceholder}
              />
            ) : (
              <div className={styles.imagePlaceholder} aria-hidden="true" />
            )}
          </div>
          {images.length > 1 && (
            <div className={styles.thumbs}>
              {images.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  className={i === activeImage ? styles.thumbActive : styles.thumb}
                  onClick={() => setActiveImage(i)}
                  aria-label={`Show image ${i + 1}`}
                >
                  {img.url && (
                    <SafeImage
                      src={img.url}
                      alt=""
                      fallbackSrc="/images/placeholder-product.svg"
                      fallbackClassName={styles.thumbPlaceholder}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.info}>
          <span className={styles.brand}>{product.brand}</span>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.sku}>SKU: {product.sku}</p>
          <p className={styles.desc}>{product.shortDescription}</p>
          <p className={styles.price}>{formatPrice(product.price)}</p>
          <QuoteRequestForm productId={product.id} productName={product.name} />
        </div>
      </div>

      <div className={styles.tabs}>
        <div className={styles.tabList} role="tablist">
          <button
            role="tab"
            aria-selected={tab === 'overview'}
            className={tab === 'overview' ? styles.tabActive : styles.tabButton}
            onClick={() => setTab('overview')}
          >
            Overview
          </button>
          <button
            role="tab"
            aria-selected={tab === 'specs'}
            className={tab === 'specs' ? styles.tabActive : styles.tabButton}
            onClick={() => setTab('specs')}
          >
            Specifications
          </button>
          <button
            role="tab"
            aria-selected={tab === 'accessories'}
            className={tab === 'accessories' ? styles.tabActive : styles.tabButton}
            onClick={() => setTab('accessories')}
          >
            Accessories
          </button>
        </div>

        <div className={styles.tabPanel}>
          {tab === 'overview' && <p>{product.description}</p>}

          {tab === 'specs' && (
            <table className={styles.specTable}>
              <tbody>
                {product.specs.map((spec) => (
                  <tr key={spec.label}>
                    <th>{spec.label}</th>
                    <td>{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === 'accessories' && (
            <ul className={styles.accessoryList}>
              {product.accessories.map((acc) => (
                <li key={acc}>{acc}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
