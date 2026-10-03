import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import App from './App';

vi.mock('./services/siteSettingsService', () => ({
  getSiteSettings: vi.fn().mockResolvedValue({
    id: 1,
    siteName: 'A.K Enterprises',
    tagline: 'Deals in Telecom Equipment, CCTV Security System & General Order Supplier',
    subTagline: 'Govt. Contractor General Order Supplier',
    logoUrl: null,
    faviconUrl: null,
    contactEmail: 'info@akenterprisessec.org',
    contactPhone: '+92 300 0000000',
    address: null,
    businessHours: null,
  }),
}));

describe('App', () => {
  it('renders the site name without crashing', async () => {
    const { getAllByText } = render(<App />);
    // Appears in both the header brand mark and the footer copyright line.
    await waitFor(() => expect(getAllByText(/A\.K Enterprises/i).length).toBeGreaterThan(0));
  });
});
