// Central place for anything environment-driven. Never hardcode the API
// base URL inside a component or service — read it from here so switching
// from local Laravel (php artisan serve) to a staging/production API is a
// one-line .env change, not a code change.

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api',
  timeout: 10000,
  uploadTimeout: 60000,
} as const;
