import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Radio, Shield, Antenna, Settings } from 'lucide-react';
import { useFeaturedCategories } from '../../hooks/useCategories';
import { ROUTES } from '../../config/routes.config';

const ICON_MAP: Record<string, React.ElementType> = {
  'hand-held-radios': Radio,
  'cctv-security': Shield,
  'base-vehicle-stations': Antenna,
  'accessories': Settings,
};

const ACCENT_MAP: Record<string, string> = {
  'hand-held-radios': '#00A878',
  'cctv-security': '#10b981',
  'base-vehicle-stations': '#2F7F67',
  'accessories': '#f59e0b',
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } as any },
};

export function TopCollections() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { data: categories } = useFeaturedCategories();

  if (!categories || categories.length === 0) {
    return null;
  }

  const displayItems = categories.map((c) => ({
    ...c,
    icon: ICON_MAP[c.slug] || Radio,
    accentColor: ACCENT_MAP[c.slug] || '#00A878',
  }));

  return (
    <section ref={ref} className="relative py-24 bg-[#f7f7f5] overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      <div className="container-ak relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <p className="text-xs text-ak-blue uppercase tracking-[0.2em] font-semibold font-display mb-2">
              Shop by Category
            </p>
            <h2 className="font-display font-bold text-ak-navy-900 text-4xl sm:text-5xl">
              Top Collections
            </h2>
          </div>
          <Link
            to={ROUTES.products}
            className="group flex items-center gap-2 text-sm text-slate-400 hover:text-ak-blue transition-colors font-medium"
          >
            View All
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {displayItems.map((item) => {
            const Icon = item.icon;
            const accentColor = item.accentColor;
            return (
              <motion.div key={item.id} variants={cardVariants}>
                <Link
                  to={`${ROUTES.products}?category=${item.slug}`}
                  className="group block bg-white border border-black/10 overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 shine-overlay h-full"
                >
                  {/* Color top bar */}
                  <div
                    className="h-1 w-full transition-all duration-300 group-hover:h-1.5"
                    style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
                  />

                  <div className="p-6 flex flex-col gap-4">
                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}25` }}
                    >
                      {Icon && <Icon size={20} style={{ color: accentColor }} />}
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-ak-navy-900 text-xl mb-1 group-hover:text-ak-blue transition-all">
                        {item.name}
                      </h3>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center gap-2 text-xs font-display font-bold uppercase tracking-widest transition-colors duration-200" style={{ color: accentColor }}>
                      Explore
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
