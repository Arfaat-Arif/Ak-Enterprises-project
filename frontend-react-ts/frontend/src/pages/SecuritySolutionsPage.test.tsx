import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { SecuritySolutionsPage } from './SecuritySolutionsPage';
import * as serviceService from '../services/serviceService';

vi.mock('../services/serviceService', () => ({
  getServices: vi.fn(),
}));

describe('SecuritySolutionsPage', () => {
  it('renders loading state and then dynamic services from API', async () => {
    vi.mocked(serviceService.getServices).mockResolvedValueOnce([
      {
        id: 1,
        name: 'CCTV Surveillance Systems',
        slug: 'cctv-surveillance-systems',
        shortDescription: 'Design and supply of IP and analog CCTV systems for offices.',
        description: 'HD & 4K IP cameras\nNVR/DVR sizing',
        imageUrl: null,
        icon: null,
        url: null,
        sortOrder: 1,
        isFeatured: true,
        isActive: true,
      },
      {
        id: 2,
        name: 'Access Control',
        slug: 'access-control',
        shortDescription: 'Biometric access control systems.',
        description: 'Door controllers\nVisitor management',
        imageUrl: null,
        icon: null,
        url: null,
        sortOrder: 2,
        isFeatured: true,
        isActive: true,
      },
    ]);

    render(<SecuritySolutionsPage />);

    expect(screen.getByText(/Loading security solutions\.\.\./i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('CCTV Surveillance Systems')).toBeInTheDocument();
      expect(screen.getByText('Access Control')).toBeInTheDocument();
      expect(screen.getByText('HD & 4K IP cameras')).toBeInTheDocument();
      expect(screen.getByText('Door controllers')).toBeInTheDocument();
    });
  });

  it('renders error state when API fails', async () => {
    vi.mocked(serviceService.getServices).mockRejectedValueOnce(new Error('Network error'));

    render(<SecuritySolutionsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Unable to load security solutions right now\./i)).toBeInTheDocument();
    });
  });

  it('renders empty state when API returns no services', async () => {
    vi.mocked(serviceService.getServices).mockResolvedValueOnce([]);

    render(<SecuritySolutionsPage />);

    await waitFor(() => {
      expect(screen.getByText(/No security solutions available\./i)).toBeInTheDocument();
    });
  });
});
