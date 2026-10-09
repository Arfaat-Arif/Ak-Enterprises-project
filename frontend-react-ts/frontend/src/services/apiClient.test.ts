import { describe, expect, it } from 'vitest';
import type { AxiosAdapter } from 'axios';
import { API_CONFIG } from '../config/api.config';
import { apiClient } from './apiClient';

describe('apiClient upload timeout', () => {
  it('extends only requests whose FormData contains a file', async () => {
    const observedTimeouts: number[] = [];
    const adapter: AxiosAdapter = async (config) => {
      observedTimeouts.push(config.timeout ?? 0);
      return {
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    };

    const imageForm = new FormData();
    imageForm.append('image', new File(['image'], 'small.png', { type: 'image/png' }));
    await apiClient.post('/upload', imageForm, { adapter });

    const textForm = new FormData();
    textForm.append('name', 'Example');
    await apiClient.post('/update', textForm, { adapter });
    await apiClient.get('/health', { adapter });

    expect(observedTimeouts).toEqual([
      API_CONFIG.uploadTimeout,
      API_CONFIG.timeout,
      API_CONFIG.timeout,
    ]);
  });
});
