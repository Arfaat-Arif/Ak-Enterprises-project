import { ArrowUpRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { getInsights } from '../../services/insightService';
import { Loader } from '../common/Loader';
import { ErrorState } from '../common/ErrorState';

export function InsightsSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const inView = useInView(sectionRef, { once: true, margin: '200px 0px' });
    const { data: insights, loading, error, refetch } = useFetch(
        () => getInsights(),
        [],
        { enabled: inView },
    );

    if (!inView || loading) return (
        <section ref={sectionRef} className="bg-white py-24 sm:py-32">
            <div className="container-ak">
                <div className="mb-12"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-ak-blue">Ideas and updates</p><h2 className="font-display text-5xl font-bold leading-[0.95] text-ak-navy-900 sm:text-6xl">Latest insights</h2></div>
                {inView ? <Loader label="Loading insights..." /> : null}
            </div>
        </section>
    );

    if (error) return (
        <section ref={sectionRef} className="bg-white py-24 sm:py-32">
            <div className="container-ak">
                <div className="mb-12"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-ak-blue">Ideas and updates</p><h2 className="font-display text-5xl font-bold leading-[0.95] text-ak-navy-900 sm:text-6xl">Latest insights</h2></div>
                <ErrorState message="Couldn't load insights." onRetry={refetch} />
            </div>
        </section>
    );

    if (!insights || insights.length === 0) return (
        <section ref={sectionRef} className="bg-white py-24 sm:py-32">
            <div className="container-ak">
                <div className="mb-12"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-ak-blue">Ideas and updates</p><h2 className="font-display text-5xl font-bold leading-[0.95] text-ak-navy-900 sm:text-6xl">Latest insights</h2></div>
                <p className="text-slate-600">No insights available yet.</p>
            </div>
        </section>
    );

    const insightsData = insights.map(insight => ({
        type: insight.author || 'Insight',
        date: insight.publishedAt ? new Date(insight.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '',
        title: insight.title,
        image: insight.imageUrl || '/images/placeholder-panel.svg',
    }));

    return (
        <section ref={sectionRef} className="bg-white py-24 sm:py-32">
            <div className="container-ak">
                <div className="mb-12"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-ak-blue">Ideas and updates</p><h2 className="font-display text-5xl font-bold leading-[0.95] text-ak-navy-900 sm:text-6xl">Latest insights</h2></div>
                <div className="grid gap-6 md:grid-cols-3">
                    {insightsData.map(({ type, date, title, image }, index) => (
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
