import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '../../config/routes.config';

const BENEFITS = ['Specification-led procurement', 'Deployment support from field to control room', 'Warranty and spare-parts coordination'];

export function TechnologySection() {
    return (
        <section className="bg-white py-24 sm:py-32">
            <div className="container-ak">
                <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
                    <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }} className="relative min-h-[460px] overflow-hidden bg-[#101010]">
                        <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=85" alt="Operations team coordinating technology systems" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-65" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#101010] via-transparent to-ak-blue/20" />
                        <div className="absolute bottom-6 left-6 border-l-2 border-ak-blue pl-4 text-white sm:bottom-10 sm:left-10">
                            <p className="text-xs uppercase tracking-[0.2em] text-ak-blue-light">Operational confidence</p>
                            <p className="mt-2 font-display text-2xl font-bold">Connect every critical moment.</p>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6, delay: 0.1 }}>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-ak-blue">Beyond the equipment</p>
                        <h2 className="font-display text-5xl font-bold leading-[0.95] text-ak-navy-900 sm:text-6xl">Technology that keeps you connected</h2>
                        <p className="mt-7 max-w-lg text-base leading-8 text-slate-600">A dependable deployment is more than a device. We help procurement and operations teams select, configure and support communication infrastructure that performs when the environment changes.</p>
                        <ul className="mt-8 space-y-4">
                            {BENEFITS.map((benefit) => <li key={benefit} className="flex items-center gap-3 text-sm font-medium text-ak-navy-900"><span className="flex h-6 w-6 items-center justify-center bg-[#e6f6f1] text-ak-blue"><Check size={14} /></span>{benefit}</li>)}
                        </ul>
                        <Link to={ROUTES.about} className="mt-9 inline-flex items-center gap-2 border-b-2 border-ak-blue pb-2 text-sm font-bold uppercase tracking-[0.16em] text-ak-navy-900 transition-colors hover:text-ak-blue">Our approach <ArrowRight size={16} /></Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
