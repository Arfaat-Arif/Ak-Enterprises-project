import { useFetch } from './useFetch';
import { getCategories, getFeaturedCategories } from '../services/categoryService';
import type { CategoryType } from '../types/category.types';

export function useCategories(type?: CategoryType) {
  return useFetch(() => getCategories(type), [type]);
}

export function useFeaturedCategories() {
  return useFetch(() => getFeaturedCategories(), []);
}
