import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Users, Package, Clock } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import { getTrustStats } from '../../services/trustStatService';
import { Loader } from '../common/Loader';
import { ErrorState } from '../common/ErrorState';

interface Stat {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  sub: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  'product': Package,
  'products': Package,
  'client': Users,
  'clients': Users,
  'customer': Users,
  'customers': Users,
  'year': Award,
  'years': Award,
  'experience': Award,
  'order': Clock,
  'orders': Clock,
  'delivery': Clock,
  'fulfilment': Clock,
};

function getIconForLabel(label: string): React.ElementType {
  const lowerLabel = label.toLowerCase();
  for (const [key, icon] of Object.entries(ICON_MAP)) {
    if (lowerLabel.includes(key)) return icon;
  }
  return Award;
}

function getSubForLabel(label: string): string {
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes('product')) return 'Across all categories';
  if (lowerLabel.includes('client') || lowerLabel.includes('customer')) return 'Government & private sector';
  if (lowerLabel.includes('year') || lowerLabel.includes('experience')) return 'In telecom supply chain';
  if (lowerLabel.includes('order') || lowerLabel.includes('delivery') || lowerLabel.includes('fulfilment')) return 'On-time delivery rate';
  return '';
}

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
  const inView = useInView(ref, { once: true, margin: '200px 0px' });
  const { data: trustStats, loading, error, refetch } = useFetch(
    () => getTrustStats(),
    [],
    { enabled: inView },
  );

  if (!inView || loading) {
    return (
      <section ref={ref} className="relative py-20 bg-[#ebece9] overflow-hidden border-y border-black/10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ak-blue/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
        <div className="container-ak relative z-10">
          <div className="text-center mb-12">
            <p className="text-xs text-ak-blue uppercase tracking-[0.2em] font-semibold mb-2">Our network</p>
            <h2 className="font-display font-bold text-ak-navy-900 text-3xl sm:text-4xl">Trusted by Government & Enterprise</h2>
          </div>
          {inView ? <Loader label="Loading statistics..." /> : null}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section ref={ref} className="relative py-20 bg-[#ebece9] overflow-hidden border-y border-black/10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ak-blue/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
        <div className="container-ak relative z-10">
          <div className="text-center mb-12">
            <p className="text-xs text-ak-blue uppercase tracking-[0.2em] font-semibold mb-2">Our network</p>
            <h2 className="font-display font-bold text-ak-navy-900 text-3xl sm:text-4xl">Trusted by Government & Enterprise</h2>
          </div>
          <ErrorState message="Couldn't load statistics." onRetry={refetch} />
        </div>
      </section>
    );
  }

  if (!trustStats || trustStats.length === 0) {
    return (
      <section ref={ref} className="relative py-20 bg-[#ebece9] overflow-hidden border-y border-black/10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ak-blue/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none" />
        <div className="container-ak relative z-10">
          <div className="text-center mb-12">
            <p className="text-xs text-ak-blue uppercase tracking-[0.2em] font-semibold mb-2">Our network</p>
            <h2 className="font-display font-bold text-ak-navy-900 text-3xl sm:text-4xl">Trusted by Government & Enterprise</h2>
          </div>
          <p className="text-slate-600 text-center">No statistics available yet.</p>
        </div>
      </section>
    );
  }

  const stats: Stat[] = trustStats.map(stat => ({
    icon: getIconForLabel(stat.label),
    value: stat.value,
    suffix: stat.suffix || '',
    label: stat.label,
    sub: getSubForLabel(stat.label),
  }));

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
          {stats.map(({ icon: Icon, value, suffix, label, sub }, i) => (
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
