import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats, type DashboardStats } from '../services/dashboardService';
import { Package, FolderTree, Shield, Globe, Layers, FileText, Newspaper, BarChart3, MessageSquare, Mail } from 'lucide-react';
import { getApiErrorMessage } from '../utils/apiError';

const statCards = [
  { key: 'products', label: 'Products', icon: Package, color: 'bg-ak-blue' },
  { key: 'categories', label: 'Categories', icon: FolderTree, color: 'bg-emerald-500' },
  { key: 'services', label: 'Services', icon: Shield, color: 'bg-purple-500' },
  { key: 'brands', label: 'Brands', icon: Globe, color: 'bg-orange-500' },
  { key: 'industries', label: 'Industries', icon: Layers, color: 'bg-cyan-500' },
  { key: 'caseStudies', label: 'Case Studies', icon: FileText, color: 'bg-pink-500' },
  { key: 'insights', label: 'Insights', icon: Newspaper, color: 'bg-indigo-500' },
  { key: 'trustStats', label: 'Trust Stats', icon: BarChart3, color: 'bg-rose-500' },
  { key: 'inquiries', label: 'Inquiries', icon: MessageSquare, color: 'bg-amber-500' },
  { key: 'newsletterSubscribers', label: 'Newsletter', icon: Mail, color: 'bg-teal-500' },
] as const;

const quickLinks = [
  { label: 'Products', to: '/admin/products' },
  { label: 'Services', to: '/admin/services' },
  { label: 'Inquiries', to: '/admin/inquiries' },
  { label: 'Settings', to: '/admin/settings' },
] as const;

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadStats();
  }, []);

  async function loadStats() {
    setIsLoading(true);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to load dashboard statistics.'));
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-ak-blue border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadStats}
            className="px-4 py-2 bg-ak-blue text-white rounded-lg hover:bg-ak-blue-dark transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-ak-navy-900">Dashboard</h1>
        <p className="text-slate-500">Overview of your website content</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          const value = stats?.[card.key] ?? 0;
          let to = `/admin/${card.key}`;
          if (card.key === 'caseStudies') to = '/admin/case-studies';
          if (card.key === 'trustStats') to = '/admin/trust-stats';
          if (card.key === 'newsletterSubscribers') to = '/admin/newsletter-subscribers';
          if (card.key === 'inquiries') to = '/admin/inquiries';
          return (
            <Link
              key={card.key}
              to={to}
              className="bg-white border border-black/10 rounded-xl p-6 hover:shadow-lg hover:border-ak-blue/30 transition-all duration-200 group"
            >
              <div className={`w-12 h-12 rounded-lg ${card.color} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={24} className={card.key === 'newsletterSubscribers' ? 'text-teal-600' : `text-${card.color.replace('bg-', '')}-600`} />
              </div>
              <p className="text-3xl font-display font-bold text-ak-navy-900 mb-1">{value}</p>
              <p className="text-sm text-slate-500">{card.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="bg-white border border-black/10 rounded-xl p-6">
        <h2 className="font-display font-bold text-lg text-ak-navy-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-4 py-3 bg-[#f7f7f5] border border-black/10 rounded-lg text-center text-sm font-medium text-ak-navy-900 hover:bg-ak-blue hover:text-white hover:border-ak-blue transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
