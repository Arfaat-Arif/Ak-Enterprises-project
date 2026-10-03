import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes.config';

const CASES = [
    { label: 'Public safety', title: 'A clearer line between dispatch and response', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=85' },
    { label: 'Industrial operations', title: 'Communication built for complex facilities', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1400&q=85' },
];

export function CaseStudiesSection() {
    return (
        <section className="bg-[#eeeeea] py-24 sm:py-32">
            <div className="container-ak">
                <div className="mb-12 flex items-end justify-between gap-5">
                    <div>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-ak-blue">In the field</p>
                        <h2 className="font-display text-5xl font-bold leading-[0.95] text-ak-navy-900 sm:text-6xl">Built around real work</h2>
                    </div>
                    <Link to={ROUTES.contact} className="hidden items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-ak-navy-900 hover:text-ak-blue sm:flex">Start a conversation <ArrowRight size={16} /></Link>
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                    {CASES.map(({ label, title, image }, index) => (
                        <motion.article key={title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ delay: index * 0.1, duration: 0.6 }} className="group bg-white">
                            <div className="aspect-[16/9] overflow-hidden"><img src={image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div>
                            <div className="border-t-2 border-transparent p-7 transition-colors group-hover:border-ak-blue sm:p-9"><p className="text-xs font-bold uppercase tracking-[0.18em] text-ak-blue">{label}</p><h3 className="mt-3 max-w-lg font-display text-3xl font-bold leading-tight text-ak-navy-900">{title}</h3><span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 group-hover:text-ak-blue">View case study <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></span></div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
