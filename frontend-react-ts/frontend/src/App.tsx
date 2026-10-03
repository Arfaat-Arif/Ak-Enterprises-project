import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AuthProvider } from './context/AuthContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { ProductFilterProvider } from './context/ProductFilterContext';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SecuritySolutionsPage } from './pages/SecuritySolutionsPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminNavigationPage } from './pages/AdminNavigationPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';
import { AdminHeroPage } from './pages/AdminHeroPage';
import { AdminBrandsPage } from './pages/AdminBrandsPage';
import { AdminIndustriesPage } from './pages/AdminIndustriesPage';
import { AdminServicesPage } from './pages/AdminServicesPage';
import { AdminCategoriesPage } from './pages/AdminCategoriesPage';
import { AdminProductsPage } from './pages/AdminProductsPage';
import { ROUTES } from './config/routes.config';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <SiteSettingsProvider>
        <ProductFilterProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
              <Route path="/admin/navigation" element={<AdminNavigationPage />} />
              <Route path="/admin/hero" element={<AdminHeroPage />} />
              <Route path="/admin/brands" element={<AdminBrandsPage />} />
              <Route path="/admin/industries" element={<AdminIndustriesPage />} />
              <Route path="/admin/services" element={<AdminServicesPage />} />
              <Route path="/admin/categories" element={<AdminCategoriesPage />} />
              <Route path="/admin/products" element={<AdminProductsPage />} />
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
          </BrowserRouter>
        </ProductFilterProvider>
      </SiteSettingsProvider>
    </AuthProvider>
  );
}

export default App;
