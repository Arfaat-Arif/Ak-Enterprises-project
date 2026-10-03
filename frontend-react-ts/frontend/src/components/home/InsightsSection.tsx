import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const INSIGHTS = [
    { type: 'Field note', date: '06.08.2026', title: 'Planning resilient radio coverage for large sites', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=85' },
    { type: 'Procurement', date: '28.07.2026', title: 'What to include in a communication equipment RFQ', image: 'https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=1000&q=85' },
    { type: 'Technology', date: '11.07.2026', title: 'From handheld radios to connected operations', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=85' },
];

export function InsightsSection() {
    return (
        <section className="bg-white py-24 sm:py-32">
            <div className="container-ak">
                <div className="mb-12"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-ak-blue">Ideas and updates</p><h2 className="font-display text-5xl font-bold leading-[0.95] text-ak-navy-900 sm:text-6xl">Latest insights</h2></div>
                <div className="grid gap-6 md:grid-cols-3">
                    {INSIGHTS.map(({ type, date, title, image }, index) => (
                        <motion.article key={title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ delay: index * 0.08, duration: 0.5 }} className="group border-b border-black/10 pb-6">
                            <div className="aspect-[4/3] overflow-hidden bg-[#eeeeea]"><img src={image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div>
                            <div className="flex items-center justify-between pt-5 text-xs font-bold uppercase tracking-[0.16em]"><span className="text-ak-blue">{type}</span><time className="text-slate-400">{date}</time></div>
                            <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-ak-navy-900 group-hover:text-ak-blue">{title}</h3>
                            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 group-hover:text-ak-blue">Read more <ArrowUpRight size={16} /></span>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
