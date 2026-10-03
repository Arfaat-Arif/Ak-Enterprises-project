import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-display font-bold uppercase tracking-widest text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ak-blue focus-visible:ring-offset-2 focus-visible:ring-offset-ak-navy-900 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                primary: 'bg-ak-blue text-white hover:bg-ak-blue-dark shadow-glow-blue-sm hover:shadow-glow-blue active:scale-[0.98]',
                secondary: 'bg-ak-navy-700 text-white border border-white/10 hover:bg-ak-navy-600 hover:border-white/20',
                outline: 'border border-ak-blue text-ak-blue bg-transparent hover:bg-ak-blue hover:text-white',
                ghost: 'text-slate-300 hover:text-white hover:bg-white/5',
                glow: 'bg-ak-blue text-white animate-glow-pulse hover:bg-ak-blue-dark shadow-glow-blue active:scale-[0.98]',
                glass: 'bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-white/20',
            },
            size: {
                sm: 'h-8 px-4 text-xs',
                md: 'h-11 px-6 text-sm',
                lg: 'h-13 px-8 text-base',
                xl: 'h-14 px-10 text-lg',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: { variant: 'primary', size: 'md' },
    }
);
