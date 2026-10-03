import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';
import { Menu, X, Home, Settings, List, Star, Globe, Layers, Shield, FolderTree, Package, FileText, Newspaper, BarChart3, Link2, Share2, MessageSquare, Mail, LogOut, FileStack } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: Home },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
  { label: 'Navigation', to: '/admin/navigation', icon: List },
  { label: 'Hero', to: '/admin/hero', icon: Star },
  { label: 'Brands', to: '/admin/brands', icon: Globe },
  { label: 'Industries', to: '/admin/industries', icon: Layers },
  { label: 'Services', to: '/admin/services', icon: Shield },
  { label: 'Categories', to: '/admin/categories', icon: FolderTree },
  { label: 'Products', to: '/admin/products', icon: Package },
  { label: 'Case Studies', to: '/admin/case-studies', icon: FileText },
  { label: 'Insights', to: '/admin/insights', icon: Newspaper },
  { label: 'Trust Stats', to: '/admin/trust-stats', icon: BarChart3 },
  { label: 'Footer Links', to: '/admin/footer-links', icon: Link2 },
  { label: 'Social Links', to: '/admin/social-links', icon: Share2 },
  { label: 'Page Content', to: '/admin/page-content', icon: FileStack },
  { label: 'Inquiries', to: '/admin/inquiries', icon: MessageSquare },
  { label: 'Newsletter', to: '/admin/newsletter-subscribers', icon: Mail },
] as const;

export function AdminLayout() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // navigate() during render is ignored by React Router and left a blank white page.
  // Declarative <Navigate /> is the correct unauthenticated redirect.
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  async function handleLogout() {
    await logout();
    navigate('/admin/login', { replace: true });
  }

  function isActive(to: string): boolean {
    if (to === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(to);
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] flex">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-black/10 rounded-lg shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-black/10 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-black/10 flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-xl text-ak-navy-900">Admin Panel</h2>
              <p className="text-sm text-slate-500">A.K. Enterprises</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-[#f7f7f5] rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.to);
                return (
                  <li key={item.to}>
                    <button
                      onClick={() => {
                        navigate(item.to);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? 'bg-ak-blue text-white'
                          : 'text-slate-700 hover:bg-[#f7f7f5]'
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-black/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-0">
        <Outlet />
      </main>
    </div>
  );
}
