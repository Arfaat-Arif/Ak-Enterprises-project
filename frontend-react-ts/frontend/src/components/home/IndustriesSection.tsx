import { ArrowUpRight, ShieldCheck, RadioTower, Factory, Landmark, Truck, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { getIndustries } from '../../services/industryService';
import type { Industry } from '../../types/industry.types';

function IndustryDestination({ url, children }: { url: string | null; children: ReactNode }) {
    if (!url) {
        return <>{children}</>;
    }

    const className = 'block h-full';
    const isExternal = /^https?:\/\//i.test(url);

    if (isExternal) {
        return (
            <a href={url} target="_blank" rel="noreferrer" className={className}>
                {children}
            </a>
        );
    }

    return (
        <Link to={url} className={className}>
            {children}
        </Link>
    );
}

const FALLBACK_ICONS = {
    ShieldCheck,
    RadioTower,
    Factory,
    Landmark,
    Truck,
    Flame,
};

export function IndustriesSection() {
    const [industries, setIndustries] = useState<Industry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        void getIndustries()
            .then((data) => {
                setIndustries(data);
                setError(null);
            })
            .catch(() => {
                setError('Unable to load industries right now.');
                setIndustries([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <section className="bg-[#f7f7f5] py-24 sm:py-32">
                <div className="container-ak">
                    <p className="text-sm text-slate-500">Loading industries...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="bg-[#f7f7f5] py-24 sm:py-32">
                <div className="container-ak">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            </section>
        );
    }

    if (industries.length === 0) {
        return (
            <section className="bg-[#f7f7f5] py-24 sm:py-32">
                <div className="container-ak">
                    <p className="text-sm text-slate-500">No industries available.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-[#f7f7f5] py-24 sm:py-32">
            <div className="container-ak">
                <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end md:text-left">
                    <div className="max-w-2xl">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-ak-blue">Industry expertise</p>
                        <h2 className="font-display text-5xl font-bold leading-[0.95] text-ak-navy-900 sm:text-6xl">Solutions across industries</h2>
                    </div>
                    <p className="max-w-sm text-sm leading-7 text-slate-600 md:text-right">Purpose-built communication and security systems for the environments where reliability is non-negotiable.</p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {industries.map((industry, index) => {
                        const IconComponent = industry.icon && industry.icon in FALLBACK_ICONS ? FALLBACK_ICONS[industry.icon as keyof typeof FALLBACK_ICONS] : ShieldCheck;

                        const description = industry.shortDescription ?? industry.description;

                        return (
                            <motion.article key={industry.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ delay: index * 0.05, duration: 0.5 }} className="group relative min-h-[290px] overflow-hidden bg-[#242424] flex flex-col">
                                <IndustryDestination url={industry.url}>
                                    {industry.imageUrl ? (
                                        <img src={industry.imageUrl} alt={industry.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-85" />
                                    ) : null}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
                                    <div className="relative flex h-full min-h-[290px] flex-col justify-end p-6 text-white sm:p-7">
                                        <IconComponent size={22} className="mb-auto text-ak-blue-light" aria-hidden="true" />
                                        <div>
                                            <h3 className="font-display text-3xl font-bold text-white drop-shadow-md">{industry.name}</h3>
                                            {description ? (
                                                <p className="mt-2 max-w-xs text-sm leading-6 text-white/75">{description}</p>
                                            ) : null}
                                            <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ak-blue-light">Explore <ArrowUpRight size={15} /></span>
                                        </div>
                                    </div>
                                </IndustryDestination>
                            </motion.article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
