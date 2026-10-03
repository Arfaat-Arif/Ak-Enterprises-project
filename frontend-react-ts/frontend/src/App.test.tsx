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

function mockPage(exportName: string, label: string) {
  const Page = () => <div>{label}</div>;
  return { [exportName]: Page, default: Page };
}

vi.mock('./pages/ProductsPage', () => mockPage('ProductsPage', 'Products Page'));
vi.mock('./pages/ContactPage', () => mockPage('ContactPage', 'Contact Page'));
vi.mock('./pages/AboutPage', () => mockPage('AboutPage', 'About Page'));
vi.mock('./pages/ProductDetailPage', () => mockPage('ProductDetailPage', 'Product Detail'));
vi.mock('./pages/SecuritySolutionsPage', () => mockPage('SecuritySolutionsPage', 'Security Solutions'));
vi.mock('./pages/NotFoundPage', () => mockPage('NotFoundPage', 'Not Found'));

vi.mock('./components/admin/AdminLayout', () => mockPage('AdminLayout', 'Admin Layout'));
vi.mock('./pages/AdminLoginPage', () => mockPage('AdminLoginPage', 'Admin Login'));
vi.mock('./pages/AdminDashboardPage', () => mockPage('AdminDashboardPage', 'Admin Dashboard'));
vi.mock('./pages/AdminInquiriesPage', () => mockPage('AdminInquiriesPage', 'Admin Inquiries'));
vi.mock('./pages/AdminNewsletterSubscribersPage', () => mockPage('AdminNewsletterSubscribersPage', 'Admin Newsletter'));
vi.mock('./pages/AdminNavigationPage', () => mockPage('AdminNavigationPage', 'Admin Navigation'));
vi.mock('./pages/AdminSettingsPage', () => mockPage('AdminSettingsPage', 'Admin Settings'));
vi.mock('./pages/AdminHeroPage', () => mockPage('AdminHeroPage', 'Admin Hero'));
vi.mock('./pages/AdminBrandsPage', () => mockPage('AdminBrandsPage', 'Admin Brands'));
vi.mock('./pages/AdminIndustriesPage', () => mockPage('AdminIndustriesPage', 'Admin Industries'));
vi.mock('./pages/AdminServicesPage', () => mockPage('AdminServicesPage', 'Admin Services'));
vi.mock('./pages/AdminCategoriesPage', () => mockPage('AdminCategoriesPage', 'Admin Categories'));
vi.mock('./pages/AdminProductsPage', () => mockPage('AdminProductsPage', 'Admin Products'));
vi.mock('./pages/AdminCaseStudiesPage', () => mockPage('AdminCaseStudiesPage', 'Admin Case Studies'));
vi.mock('./pages/AdminInsightsPage', () => mockPage('AdminInsightsPage', 'Admin Insights'));
vi.mock('./pages/AdminTrustStatsPage', () => mockPage('AdminTrustStatsPage', 'Admin Trust Stats'));
vi.mock('./pages/AdminFooterLinksPage', () => mockPage('AdminFooterLinksPage', 'Admin Footer Links'));
vi.mock('./pages/AdminSocialLinksPage', () => mockPage('AdminSocialLinksPage', 'Admin Social Links'));
vi.mock('./pages/AdminPageContentPage', () => mockPage('AdminPageContentPage', 'Admin Page Content'));

describe('App', () => {
  it('renders the site name without crashing', async () => {
    const { getAllByText } = render(<App />);
    await waitFor(() => expect(getAllByText(/A\.K Enterprises/i).length).toBeGreaterThan(0));
  });
});
