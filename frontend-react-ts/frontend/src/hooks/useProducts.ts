import { useFetch } from './useFetch';
import { getProducts, type ProductQuery } from '../services/productService';

export function useProducts(query: ProductQuery = {}) {
  return useFetch(() => getProducts(query), [query.category, query.search, query.featured, query.page]);
}
