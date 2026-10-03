import type { ApiError } from '../types/api.types';

/**
 * Extract a user-facing message from apiClient rejections.
 * apiClient rejects plain ApiError objects, not Error instances.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'message' in error) {
    const apiError = error as ApiError;
    if (apiError.errors) {
      const firstFieldErrors = Object.values(apiError.errors)[0];
      if (Array.isArray(firstFieldErrors) && firstFieldErrors[0]) {
        return firstFieldErrors[0];
      }
    }
    if (typeof apiError.message === 'string' && apiError.message.trim()) {
      return apiError.message;
    }
  }
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return fallback;
}
