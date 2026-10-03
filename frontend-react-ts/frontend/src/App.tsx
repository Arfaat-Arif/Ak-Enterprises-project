import { lazy, Suspense, type ComponentType } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AuthProvider } from './context/AuthContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { ProductFilterProvider } from './context/ProductFilterContext';
import { HomePage } from './pages/HomePage';
import { ROUTES } from './config/routes.config';
import './App.css';

function lazyNamed<TModule>(
  factory: () => Promise<TModule>,
  exportName: keyof TModule & string,
) {
  return lazy(async () => {
    const module = await factory();
    return { default: module[exportName] as ComponentType };
  });
}

// Public pages — Home stays eager for first paint; other public routes split.
const ProductsPage = lazyNamed(() => import('./pages/ProductsPage'), 'ProductsPage');
const ContactPage = lazyNamed(() => import('./pages/ContactPage'), 'ContactPage');
const AboutPage = lazyNamed(() => import('./pages/AboutPage'), 'AboutPage');
const ProductDetailPage = lazyNamed(() => import('./pages/ProductDetailPage'), 'ProductDetailPage');
const SecuritySolutionsPage = lazyNamed(() => import('./pages/SecuritySolutionsPage'), 'SecuritySolutionsPage');
const NotFoundPage = lazyNamed(() => import('./pages/NotFoundPage'), 'NotFoundPage');

// Admin shell + pages — keep out of the public entry chunk.
const AdminLayout = lazyNamed(() => import('./components/admin/AdminLayout'), 'AdminLayout');
const AdminLoginPage = lazyNamed(() => import('./pages/AdminLoginPage'), 'AdminLoginPage');
const AdminDashboardPage = lazyNamed(() => import('./pages/AdminDashboardPage'), 'AdminDashboardPage');
const AdminInquiriesPage = lazyNamed(() => import('./pages/AdminInquiriesPage'), 'AdminInquiriesPage');
const AdminNewsletterSubscribersPage = lazyNamed(
  () => import('./pages/AdminNewsletterSubscribersPage'),
  'AdminNewsletterSubscribersPage',
);
const AdminNavigationPage = lazyNamed(() => import('./pages/AdminNavigationPage'), 'AdminNavigationPage');
const AdminSettingsPage = lazyNamed(() => import('./pages/AdminSettingsPage'), 'AdminSettingsPage');
const AdminHeroPage = lazyNamed(() => import('./pages/AdminHeroPage'), 'AdminHeroPage');
const AdminBrandsPage = lazyNamed(() => import('./pages/AdminBrandsPage'), 'AdminBrandsPage');
const AdminIndustriesPage = lazyNamed(() => import('./pages/AdminIndustriesPage'), 'AdminIndustriesPage');
const AdminServicesPage = lazyNamed(() => import('./pages/AdminServicesPage'), 'AdminServicesPage');
const AdminCategoriesPage = lazyNamed(() => import('./pages/AdminCategoriesPage'), 'AdminCategoriesPage');
const AdminProductsPage = lazyNamed(() => import('./pages/AdminProductsPage'), 'AdminProductsPage');
const AdminCaseStudiesPage = lazyNamed(() => import('./pages/AdminCaseStudiesPage'), 'AdminCaseStudiesPage');
const AdminInsightsPage = lazyNamed(() => import('./pages/AdminInsightsPage'), 'AdminInsightsPage');
const AdminTrustStatsPage = lazyNamed(() => import('./pages/AdminTrustStatsPage'), 'AdminTrustStatsPage');
const AdminFooterLinksPage = lazyNamed(() => import('./pages/AdminFooterLinksPage'), 'AdminFooterLinksPage');
const AdminSocialLinksPage = lazyNamed(() => import('./pages/AdminSocialLinksPage'), 'AdminSocialLinksPage');
const AdminPageContentPage = lazyNamed(() => import('./pages/AdminPageContentPage'), 'AdminPageContentPage');

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f7f5]">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-ak-blue border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-600">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <SiteSettingsProvider>
        <ProductFilterProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/admin/settings" element={<AdminSettingsPage />} />
                  <Route path="/admin/navigation" element={<AdminNavigationPage />} />
                  <Route path="/admin/hero" element={<AdminHeroPage />} />
                  <Route path="/admin/brands" element={<AdminBrandsPage />} />
                  <Route path="/admin/industries" element={<AdminIndustriesPage />} />
                  <Route path="/admin/services" element={<AdminServicesPage />} />
                  <Route path="/admin/inquiries" element={<AdminInquiriesPage />} />
                  <Route path="/admin/newsletter-subscribers" element={<AdminNewsletterSubscribersPage />} />
                  <Route path="/admin/categories" element={<AdminCategoriesPage />} />
                  <Route path="/admin/products" element={<AdminProductsPage />} />
                  <Route path="/admin/case-studies" element={<AdminCaseStudiesPage />} />
                  <Route path="/admin/insights" element={<AdminInsightsPage />} />
                  <Route path="/admin/trust-stats" element={<AdminTrustStatsPage />} />
                  <Route path="/admin/footer-links" element={<AdminFooterLinksPage />} />
                  <Route path="/admin/social-links" element={<AdminSocialLinksPage />} />
                  <Route path="/admin/page-content" element={<AdminPageContentPage />} />
                </Route>
                <Route element={<Layout />}>
                  <Route path={ROUTES.home} element={<HomePage />} />
                  <Route path={ROUTES.about} element={<AboutPage />} />
                  <Route path={ROUTES.products} element={<ProductsPage />} />
                  <Route path="/products/:slug" element={<ProductDetailPage />} />
                  <Route path={ROUTES.securitySolutions} element={<SecuritySolutionsPage />} />
                  <Route path={ROUTES.contact} element={<ContactPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ProductFilterProvider>
      </SiteSettingsProvider>
    </AuthProvider>
  );
}

export default App;
