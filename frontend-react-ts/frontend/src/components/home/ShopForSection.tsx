import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Radio, Shield } from 'lucide-react';
import { ROUTES } from '../../config/routes.config';

const PANELS = [
  {
    eyebrow: 'Shop for',
    title: 'Handheld & Portable Radios',
    description: 'Military-grade communication devices for field operations, public safety and enterprise deployments.',
    items: ['Motorola DP Series', 'Hytera PD Series', 'ICOM IC-Series', 'Baofeng UV Series'],
    categorySlug: 'hand-held-radios',
    icon: Radio,
    accent: '#00A878',
    gradient: 'from-ak-blue/20 via-ak-navy-900 to-ak-navy-950',
  },
  {
    eyebrow: 'Shop for',
    title: 'Base Stations & Repeaters',
    description: 'Infrastructure-grade equipment for extended coverage across large facilities and remote areas.',
    items: ['Base Stations', 'Vehicle-Mounted Radios', 'Repeaters & Amplifiers', 'Antennas & Cabling'],
    categorySlug: 'base-vehicle-stations',
    icon: Shield,
    accent: '#10b981',
    gradient: 'from-emerald-900/30 via-ak-navy-900 to-ak-navy-950',
  },
];

export function ShopForSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

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
          {PANELS.map((panel, i) => {
            const Icon = panel.icon;
            return (
              <motion.div
                key={panel.title}
                initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.15, ease: 'easeOut' }}
                className="relative overflow-hidden bg-[#242424] border border-black/10 group"
              >
                {/* Glow spot */}
                <div
                  className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
                  style={{ background: panel.accent }}
                />

                <div className="relative p-8 sm:p-10 flex flex-col gap-6">
                  {/* Icon badge */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${panel.accent}18`, border: `1px solid ${panel.accent}30` }}
                  >
                    <Icon size={24} style={{ color: panel.accent }} />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: panel.accent }}>
                      {panel.eyebrow}
                    </p>
                    <h3 className="font-display font-bold text-white text-3xl sm:text-4xl mb-3 leading-tight">
                      {panel.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                      {panel.description}
                    </p>
                  </div>

                  {/* Item list */}
                  <ul className="grid grid-cols-2 gap-2">
                    {panel.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: panel.accent }} />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    to={`${ROUTES.products}?category=${panel.categorySlug}`}
                    className="inline-flex items-center gap-2 font-display font-bold uppercase tracking-widest text-sm transition-all duration-200 group/link"
                    style={{ color: panel.accent }}
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
