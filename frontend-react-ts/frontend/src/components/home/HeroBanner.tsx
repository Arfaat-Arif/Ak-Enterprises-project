import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown, Shield, Radio, Zap } from 'lucide-react';
import { Badge } from '../ui/badge';
import { getHeroSections } from '../../services/heroService';
import type { HeroSection } from '../../types/hero.types';

const PILLARS = [
  { icon: Radio, label: 'Two-Way Radios', sub: 'Motorola · Hytera · ICOM' },
  { icon: Shield, label: 'Security Systems', sub: 'CCTV & Access Control' },
  { icon: Zap, label: 'Govt. Contractor', sub: 'Registered Supplier' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut', delay } as any,
  }),
};

export function HeroBanner() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const [hero, setHero] = useState<HeroSection | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getHeroSections()
      .then((sections) => {
        setHero(sections[0] ?? null);
        setError(null);
      })
      .catch(() => setError('Unable to load hero content.'));
  }, []);

  const backgroundVideo = useMemo(() => hero?.backgroundVideoUrl ?? '/video/merge 1.mp4', [hero]);

  if (error) {
    return <section className="relative min-h-[50vh] flex items-center justify-center bg-ak-navy-950 text-white">{error}</section>;
  }

  if (!hero) {
    return <section className="relative min-h-[50vh] flex items-center justify-center bg-ak-navy-950 text-white">Loading hero...</section>;
  }

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden bg-ak-navy-950"
    >
      {backgroundVideo ? (
        <video
          src={backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      ) : hero.backgroundImageUrl ? (
        <img src={hero.backgroundImageUrl} alt={hero.title} className="absolute inset-0 w-full h-full object-cover z-0" />
      ) : null}
      <div className="absolute inset-0 bg-slate-950/70" />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ak-blue/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <motion.div style={{ y, opacity }} className="relative z-10 container-ak pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="flex justify-center mb-8"
          >
            <Badge variant="default" className="px-4 py-1.5 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-ak-blue animate-pulse" />
              {hero.badge ?? 'A.K. Enterprises'}
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="font-display font-bold tracking-tight text-3xl sm:text-5xl text-white mb-6 leading-[0.95]"
          >
            {(() => {
              const titleWords = hero.title.trim().split(/\s+/).filter(Boolean);
              const titleLead =
                titleWords.length > 2
                  ? titleWords.slice(0, 2).join(' ')
                  : titleWords.slice(0, -1).join(' ');
              const titleAccent =
                titleWords.length > 2
                  ? titleWords.slice(2).join(' ')
                  : (titleWords[titleWords.length - 1] ?? hero.title);
              return (
                <>
                  {titleLead ? <>{titleLead}{' '}</> : null}
                  <span className="text-gradient-blue">{titleAccent}</span>
                </>
              );
            })()}
            <br />
            {hero.description ? hero.description.split(' ').slice(0, 3).join(' ') : 'Built for the'}{' '}
            <span className="relative inline-block">
              <span className="text-gradient-white">{hero.description ? hero.description.split(' ').slice(3, 5).join(' ') || 'Field' : 'Field'}</span>
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-ak-blue to-ak-cyan"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
              />
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto mb-10"
          >
            {hero.description}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            {hero.primaryButtonText && hero.primaryButtonUrl ? (
              <Link
                to={hero.primaryButtonUrl.startsWith('http') ? hero.primaryButtonUrl : hero.primaryButtonUrl}
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-ak-blue hover:bg-ak-blue-dark text-white font-display font-bold uppercase tracking-widest text-sm rounded-lg shadow-glow-blue hover:shadow-glow-blue transition-all duration-200 active:scale-95"
              >
                {hero.primaryButtonText}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            ) : null}
            {hero.secondaryButtonText && hero.secondaryButtonUrl ? (
              <Link
                to={hero.secondaryButtonUrl.startsWith('http') ? hero.secondaryButtonUrl : hero.secondaryButtonUrl}
                className="inline-flex items-center gap-2 px-7 py-3.5 glass hover:bg-white/10 text-slate-900 hover:text-slate-900 font-display font-bold uppercase tracking-widest text-sm rounded-lg transition-all duration-200 active:scale-95"
              >
                {hero.secondaryButtonText}
              </Link>
            ) : null}
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.5}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto"
          >
            {PILLARS.map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="glass rounded-xl p-4 flex flex-col items-center gap-2 text-center shine-overlay group hover:bg-white/5 transition-colors duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-ak-blue/15 border border-ak-blue/20 flex items-center justify-center mb-1 group-hover:bg-ak-blue/25 transition-colors">
                  <Icon size={16} className="text-ak-blue" />
                </div>
                <span className="font-display font-bold text-slate-900 text-sm uppercase tracking-wide">{label}</span>
                <span className="text-slate-700 text-xs">{sub}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <span className="text-[0.65rem] uppercase tracking-[0.2em] font-semibold">Scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}
