import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';
import { ROUTES } from '../../config/routes.config';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export function CTABanner() {
  const { settings } = useSiteSettings();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="relative py-24 overflow-hidden bg-ak-navy-950">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      {/* Main glow orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-ak-blue/10 blur-[100px] pointer-events-none"
        animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ak-blue/30 to-transparent" />

      <div className="container-ak relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-3xl mx-auto"
        >
          <p className="text-xs text-ak-blue uppercase tracking-[0.2em] font-semibold font-display mb-4">
            Ready to Deploy?
          </p>
          <h2 className="font-display font-bold text-white mb-6 leading-tight" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
            Get a Customized Quote for Your{' '}
            <span className="text-gradient-blue">Project</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Whether you're equipping a government fleet or securing a facility, our team
            will spec the right equipment, configure it for your environment, and support
            deployment end-to-end.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Link
              to={ROUTES.contact}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-ak-blue hover:bg-ak-blue-dark text-white font-display font-bold uppercase tracking-widest text-sm rounded-xl shadow-glow-blue hover:shadow-glow-blue transition-all duration-200 active:scale-95 animate-glow-pulse"
            >
              Request a Quote
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={settings?.contactEmail ? `mailto:${settings.contactEmail}` : undefined}
              className="group inline-flex items-center gap-2 px-8 py-4 border border-white/30 hover:border-ak-blue text-white font-display font-bold uppercase tracking-widest text-sm rounded-lg transition-all duration-200 active:scale-95"
            >
              <Mail size={16} className="text-ak-blue" />
              Email Us
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            {['Government Registered', 'Authorized Distributor', 'After-Sales Support', 'Bulk Pricing Available'].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-ak-blue" />
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
