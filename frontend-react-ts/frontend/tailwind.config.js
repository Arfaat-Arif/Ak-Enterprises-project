/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // AK Enterprises Brand
        'ak-navy': {
          950: '#03090F',
          900: '#0a1a2b',
          800: '#0e2338',
          700: '#16324d',
          600: '#2b4a63',
        },
        'ak-blue': {
          DEFAULT: '#00A878',
          dark: '#008461',
          light: '#55D9AE',
          glow: '#22C894',
        },
        'ak-cyan': '#00D4FF',
        'ak-steel': '#4d6d87',
        border: 'rgba(255,255,255,0.08)',
        input: 'rgba(255,255,255,0.06)',
        ring: '#00A878',
        background: '#03090F',
        foreground: '#F1F5F9',
        primary: {
          DEFAULT: '#00A878',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#0e2338',
          foreground: '#94a3b8',
        },
        muted: {
          DEFAULT: '#0e2338',
          foreground: '#94a3b8',
        },
        accent: {
          DEFAULT: '#00A878',
          foreground: '#ffffff',
        },
        card: {
          DEFAULT: 'rgba(14,35,56,0.6)',
          foreground: '#F1F5F9',
        },
      },
      fontFamily: {
        display: ['Manrope', 'Segoe UI', 'sans-serif'],
        body: ['Manrope', 'Segoe UI', 'sans-serif'],
        sans: ['Manrope', 'Segoe UI', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.7s ease-out forwards',
        'slide-left': 'slideLeft 0.6s ease-out forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee 30s linear infinite reverse',
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'counter': 'counterUp 2s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,115,207,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0,115,207,0.6), 0 0 80px rgba(0,115,207,0.2)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        counterUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        lg: '8px',
        md: '6px',
        sm: '4px',
      },
      boxShadow: {
        'glow-blue': '0 0 30px rgba(0,115,207,0.4)',
        'glow-blue-sm': '0 0 15px rgba(0,115,207,0.3)',
        'card-dark': '0 4px 24px rgba(0,0,0,0.4)',
        'card-dark-hover': '0 12px 40px rgba(0,0,0,0.5)',
        'glass': '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
    },
  },
  plugins: [],
};
