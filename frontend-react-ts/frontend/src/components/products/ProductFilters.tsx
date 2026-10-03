import { useState, useEffect } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useDebounce } from '../../hooks/useDebounce';
import styles from './ProductFilters.module.css';

interface ProductFiltersProps {
  selectedCategory: string | null;
  onCategoryChange: (slug: string | null) => void;
  onSearchChange: (term: string) => void;
}

export function ProductFilters({ selectedCategory, onCategoryChange, onSearchChange }: ProductFiltersProps) {
  const { data: categories } = useCategories();
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput);

  useEffect(() => {
    onSearchChange(debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <aside className={`${styles.filters} bg-white border border-black/10 shadow-sm`}>
      <div className={styles.group}>
        <label htmlFor="product-search" className={styles.label}>
          Search
        </label>
        <input
          id="product-search"
          type="search"
          placeholder="Search by name or brand…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.group}>
        <span className={styles.label}>Category</span>
        <ul className={styles.list}>
          <li>
            <button
              type="button"
              className={selectedCategory === null ? styles.active : styles.item}
              onClick={() => onCategoryChange(null)}
            >
              All Products
            </button>
          </li>
          {categories?.map((category) => (
            <li key={category.id}>
              <button
                type="button"
                className={selectedCategory === category.slug ? styles.active : styles.item}
                onClick={() => onCategoryChange(category.slug)}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
