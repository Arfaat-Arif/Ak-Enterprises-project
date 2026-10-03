import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Users, Package, Clock } from 'lucide-react';

interface Stat {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  sub: string;
}

const STATS: Stat[] = [
  { icon: Package, value: 500, suffix: '+', label: 'Products Available', sub: 'Across all categories' },
  { icon: Users, value: 200, suffix: '+', label: 'Enterprise Clients', sub: 'Government & private sector' },
  { icon: Award, value: 15, suffix: '+', label: 'Years Experience', sub: 'In telecom supply chain' },
  { icon: Clock, value: 99, suffix: '%', label: 'Order Fulfilment', sub: 'On-time delivery rate' },
];

function AnimatedCounter({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = value / (duration / step);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span className="font-display font-bold text-4xl text-ak-navy-900 tabular-nums">
      {count}
      <span className="text-ak-blue">{suffix}</span>
    </span>
  );
}

export function TrustBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative py-20 bg-[#ebece9] overflow-hidden border-y border-black/10">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ak-blue/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Background grid */}
      <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />

      <div className="container-ak relative z-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-xs text-ak-blue uppercase tracking-[0.2em] font-semibold mb-2">
            Our network
          </p>
          <h2 className="font-display font-bold text-ak-navy-900 text-3xl sm:text-4xl">
            Trusted by Government & Enterprise
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map(({ icon: Icon, value, suffix, label, sub }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
              className="relative bg-white border border-black/10 rounded-none p-6 overflow-hidden group hover:shadow-lg transition-shadow duration-300 shine-overlay"
            >
              {/* Icon */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-ak-blue/10 border border-ak-blue/20 flex items-center justify-center flex-shrink-0 group-hover:bg-ak-blue/20 transition-colors duration-300">
                  <Icon size={18} className="text-ak-blue" />
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-ak-blue/20 to-transparent" />
              </div>

              {/* Counter */}
              <AnimatedCounter value={value} suffix={suffix} inView={inView} />

              {/* Label */}
              <div className="mt-1">
                <p className="text-ak-navy-900 font-semibold text-sm mt-1">{label}</p>
                <p className="text-slate-500 text-xs mt-0.5">{sub}</p>
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-ak-blue/5 to-transparent rounded-bl-3xl" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
