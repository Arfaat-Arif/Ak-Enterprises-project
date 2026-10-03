import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES } from '../../config/routes.config';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { cn } from '../../lib/utils';
import { getNavigation } from '../../services/navigationService';
import type { NavigationItem } from '../../types/navigation.types';

export function Header() {
  const { settings } = useSiteSettings();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [productsOpen, setProductsOpen] = useState(false);

  useEffect(() => {
    void getNavigation()
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  const isExternalLink = (url: string) => /^https?:\/\//i.test(url) || url.startsWith('mailto:');

  const renderNode = (item: NavigationItem, mobile = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const content = (
      <>
        {item.label}
        {hasChildren && !mobile && <ChevronDown size={14} className={cn('transition-transform duration-200', productsOpen && 'rotate-180')} />}
      </>
    );

    if (hasChildren) {
      if (mobile) {
        return (
          <div key={item.id} className="space-y-1">
            <div className="px-4 py-3 text-sm font-semibold text-slate-700">{item.label}</div>
            <div className="pl-4 space-y-1">
              {item.children.map((child) => renderNode(child, true))}
            </div>
          </div>
        );
      }

      return (
        <div
          key={item.id}
          className="relative"
          onMouseEnter={() => setProductsOpen(true)}
          onMouseLeave={() => setProductsOpen(false)}
        >
          <button type="button" className="flex items-center gap-1 px-4 py-2 rounded-lg text-slate-700 hover:text-ak-blue hover:bg-ak-blue/5 font-body text-sm font-medium transition-all duration-200">
            {content}
          </button>

          <AnimatePresence>
            {productsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-2 w-56 glass rounded-xl shadow-card-dark overflow-hidden"
              >
                {item.children.map((child) => (
                  isExternalLink(child.url) ? (
                    <a
                      key={child.id}
                      href={child.url}
                      target={child.openInNewTab ? '_blank' : undefined}
                      rel={child.openInNewTab ? 'noreferrer' : undefined}
                      className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-ak-blue hover:bg-ak-blue/5 text-sm transition-colors duration-150"
                    >
                      {child.label}
                    </a>
                  ) : (
                    <Link
                      key={child.id}
                      to={child.url}
                      className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:text-ak-blue hover:bg-ak-blue/5 text-sm transition-colors duration-150"
                    >
                      {child.label}
                    </Link>
                  )
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    if (isExternalLink(item.url)) {
      return (
        <a
          key={item.id}
          href={item.url}
          target={item.openInNewTab ? '_blank' : undefined}
          rel={item.openInNewTab ? 'noreferrer' : undefined}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 font-body',
            mobile ? 'block text-slate-700 hover:text-ak-blue hover:bg-ak-blue/5' : 'text-slate-700 hover:text-ak-blue hover:bg-ak-blue/5'
          )}
        >
          {item.label}
        </a>
      );
    }

    return (
      <NavLink
        key={item.id}
        to={item.url}
        end={item.url === ROUTES.home}
        className={({ isActive }) =>
          cn(
            mobile ? 'px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150' : 'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 font-body',
            isActive
              ? 'text-ak-blue bg-ak-blue/10'
              : 'text-slate-700 hover:text-ak-blue hover:bg-ak-blue/5'
          )
        }
      >
        {item.label}
      </NavLink>
    );
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        'bg-white/95 backdrop-blur-xl border-b border-black/10 shadow-sm'
      )}
    >
      <div className="container-ak">
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <Link to={ROUTES.home} className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-ak-blue shadow-glow-blue-sm transition-all duration-300 group-hover:shadow-glow-blue">
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.siteName} className="h-full w-full rounded-lg object-contain" />
              ) : (
                <span className="font-display font-bold text-white text-lg tracking-tight">
                  {settings?.siteName?.slice(0, 2).toUpperCase()}
                </span>
              )}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/10 to-transparent" />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-display font-bold text-ak-navy-900 text-xl tracking-tight">
                {settings?.siteName}
              </span>
              <span className="text-[0.65rem] text-slate-500 uppercase tracking-widest font-bold">
                {settings?.subTagline}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {items.map((item) => renderNode(item, false))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <button type="button" aria-label="Search products" className="p-2 text-slate-700 transition-colors hover:text-ak-blue">
              <Search size={18} />
            </button>
            <Link
              to={ROUTES.contact}
              className="px-5 py-2.5 text-sm font-display font-bold uppercase tracking-widest text-white bg-ak-blue hover:bg-ak-blue-dark rounded-lg shadow-glow-blue-sm hover:shadow-glow-blue transition-all duration-200 active:scale-95"
            >
              Get Quote
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-black/10 text-ak-navy-900"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X size={20} />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu size={20} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden bg-white border-t border-black/10"
          >
            <nav className="container-ak py-4 flex flex-col gap-1">
              {items.map((item) => renderNode(item, true))}
              <Link
                to={ROUTES.contact}
                onClick={() => setOpen(false)}
                className="mt-3 px-4 py-3 text-center font-display font-bold uppercase tracking-widest text-white bg-ak-blue rounded-lg shadow-glow-blue-sm"
              >
                Get a Quote
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
