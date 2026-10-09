import axios, { AxiosError } from 'axios';
import { API_CONFIG } from '../config/api.config';
import type { ApiError } from '../types/api.types';

export const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    Accept: 'application/json',
  },
});

// Attach the admin token (if present) to every request. The public site
// never sets this — only the /admin login flow does — so this is a no-op
// for regular visitors.
apiClient.interceptors.request.use((config) => {
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    let containsFile = false;
    config.data.forEach((value) => {
      if (typeof value !== 'string') containsFile = true;
    });

    if (containsFile) config.timeout = API_CONFIG.uploadTimeout;
  }

  const token = typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function'
    ? localStorage.getItem('admin_token')
    : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize every failure into the same ApiError shape so components never
// have to know whether axios, the network, or Laravel's validation layer
// produced the error.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const normalized: ApiError = error.response?.data ?? {
      message: error.message || 'Something went wrong. Please try again.',
    };
    return Promise.reject(normalized);
  }
);
