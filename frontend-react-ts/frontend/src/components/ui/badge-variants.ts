import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold font-body uppercase tracking-widest transition-colors',
    {
        variants: {
            variant: {
                default: 'bg-ak-blue/15 text-ak-blue border border-ak-blue/30',
                secondary: 'bg-white/5 text-slate-300 border border-white/10',
                success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
                warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
                outline: 'border border-ak-blue text-ak-blue',
                glow: 'bg-ak-blue text-white shadow-glow-blue-sm',
            },
        },
        defaultVariants: { variant: 'default' },
    }
);
