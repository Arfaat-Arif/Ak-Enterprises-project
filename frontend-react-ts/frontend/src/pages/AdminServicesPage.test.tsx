import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AdminServicesPage } from './AdminServicesPage';
import * as serviceService from '../services/serviceService';
import * as authHook from '../hooks/useAuth';

vi.mock('../services/serviceService', () => ({
  getAdminServices: vi.fn(),
  createAdminService: vi.fn(),
  updateAdminService: vi.fn(),
  deleteAdminService: vi.fn(),
}));

vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('AdminServicesPage', () => {
  beforeEach(() => {
    vi.mocked(authHook.useAuth).mockReturnValue({
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    });
  });

  it('renders service list and allows creating new service', async () => {
    vi.mocked(serviceService.getAdminServices).mockResolvedValue([
      {
        id: 1,
        name: 'CCTV Surveillance Systems',
        slug: 'cctv-surveillance-systems',
        shortDescription: 'CCTV short desc',
        description: 'Point 1\nPoint 2',
        imageUrl: null,
        icon: 'ShieldCheck',
        url: null,
        sortOrder: 1,
        isFeatured: true,
        isActive: true,
      },
    ]);
    vi.mocked(serviceService.createAdminService).mockResolvedValue({
      id: 2,
      name: 'Perimeter Security',
      slug: 'perimeter-security',
      shortDescription: 'Perimeter desc',
      description: 'Sensor 1',
      imageUrl: null,
      icon: 'ShieldCheck',
      url: null,
      sortOrder: 2,
      isFeatured: false,
      isActive: true,
    });

    render(
      <BrowserRouter>
        <AdminServicesPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('CCTV Surveillance Systems')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/^Name/i), {
      target: { value: 'Perimeter Security' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Create service/i }));

    await waitFor(() => {
      expect(serviceService.createAdminService).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Perimeter Security' })
      );
    });
  });
});
