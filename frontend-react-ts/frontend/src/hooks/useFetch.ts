import { useEffect, useState, useCallback } from 'react';
import type { ApiError } from '../types/api.types';

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

/**
 * Wraps any async fetcher function with loading/error/data state so
 * components never hand-roll their own useEffect + try/catch.
 *
 * deps mirrors useEffect's dependency array — pass whatever the fetcher
 * closes over (e.g. a slug or filter) so it re-runs when that changes.
 */
export function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[] = []): UseFetchState<T> & { refetch: () => void } {
  const [state, setState] = useState<UseFetchState<T>>({ data: null, loading: true, error: null });
  const [reloadToken, setReloadToken] = useState(0);

  const refetch = useCallback(() => setReloadToken((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetcher()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((error: ApiError) => {
        if (!cancelled) setState({ data: null, loading: false, error });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadToken]);

  return { ...state, refetch };
}
