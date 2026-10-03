import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Radio, Shield } from 'lucide-react';
import { ROUTES } from '../../config/routes.config';
import { getCategories } from '../../services/categoryService';
import type { Category } from '../../types/category.types';

const ICON_MAP: Record<string, React.ElementType> = {
  'hand-held-radios': Radio,
  'base-vehicle-stations': Shield,
  'cctv-security': Shield,
  'accessories': Radio,
};

const ACCENT_MAP: Record<string, string> = {
  'hand-held-radios': '#00A878',
  'base-vehicle-stations': '#10b981',
  'cctv-security': '#10b981',
  'accessories': '#f59e0b',
};

export function ShopForSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getCategories()
      .then((data) => {
        setCategories(data.slice(0, 2));
        setError(null);
      })
      .catch(() => {
        setError('Unable to load categories.');
        setCategories([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section ref={ref} className="relative py-24 bg-white overflow-hidden border-y border-black/10">
        <div className="container-ak">
          <p className="text-sm text-slate-500">Loading categories...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section ref={ref} className="relative py-24 bg-white overflow-hidden border-y border-black/10">
        <div className="container-ak">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section ref={ref} className="relative py-24 bg-white overflow-hidden border-y border-black/10">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="container-ak relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p className="text-xs text-slate-500 uppercase tracking-[0.2em] font-semibold mb-2">
            Product Categories
          </p>
          <h2 className="font-display font-bold text-ak-navy-900 text-4xl sm:text-5xl">
            Shop by Solution
          </h2>
        </motion.div>

        {/* Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categories.map((category, i) => {
            const Icon = ICON_MAP[category.slug] || Radio;
            const accent = ACCENT_MAP[category.slug] || '#00A878';
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.15, ease: 'easeOut' }}
                className="relative overflow-hidden bg-[#242424] border border-black/10 group"
              >
                {/* Glow spot */}
                <div
                  className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
                  style={{ background: accent }}
                />

                <div className="relative p-8 sm:p-10 flex flex-col gap-6">
                  {/* Icon badge */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
                  >
                    <Icon size={24} style={{ color: accent }} />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: accent }}>
                      Shop for
                    </p>
                    <h3 className="font-display font-bold text-white text-3xl sm:text-4xl mb-3 leading-tight">
                      {category.name}
                    </h3>
                  </div>

                  {/* CTA */}
                  <Link
                    to={`${ROUTES.products}?category=${category.slug}`}
                    className="inline-flex items-center gap-2 font-display font-bold uppercase tracking-widest text-sm transition-all duration-200 group/link"
                    style={{ color: accent }}
                  >
                    Browse Category
                    <ArrowRight size={15} className="group-hover/link:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
