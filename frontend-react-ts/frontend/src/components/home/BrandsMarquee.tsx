import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { getBrands } from '../../services/brandService';
import type { Brand } from '../../types/brand.types';

export function BrandsMarquee() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    void getBrands().then(setBrands).catch(() => setBrands([]));
  }, []);

  const marqueeBrands = brands.length > 0 ? [...brands, ...brands] : [];

  return (
    <section ref={ref} className="relative py-16 bg-white overflow-hidden border-b border-black/10">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="container-ak text-center mb-8"
      >
        <p className="text-xs text-slate-500 uppercase tracking-[0.2em] font-semibold">
          Authorized Distributor
        </p>
      </motion.div>

      <div className="flex overflow-hidden select-none">
        <motion.div
          className="flex gap-6 pr-6 flex-shrink-0"
          animate={marqueeBrands.length > 0 ? { x: ['0%', '-50%'] } : {}}
          transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
        >
          {marqueeBrands.map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="flex items-center justify-center flex-shrink-0 px-8 py-3.5 border border-black/10 bg-[#f7f7f5] hover:border-ak-blue transition-colors duration-200 cursor-default"
              style={{ minWidth: '160px' }}
            >
              <span className="font-display font-bold text-slate-500 hover:text-ak-blue text-sm uppercase tracking-widest transition-colors duration-200">
                {brand.name.toUpperCase()}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
