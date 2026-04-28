import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-teal':      'rgb(var(--rgb-deep-teal) / <alpha-value>)',
        'celestial-teal': 'rgb(var(--rgb-celestial-teal) / <alpha-value>)',
        'warm-cream':     'rgb(var(--rgb-warm-cream) / <alpha-value>)',
        'soft-beige':     'rgb(var(--rgb-soft-beige) / <alpha-value>)',
        'muted-sand':     'rgb(var(--rgb-muted-sand) / <alpha-value>)',
        'mystic-ember':   'rgb(var(--rgb-mystic-ember) / <alpha-value>)',
        'herbal-gold':    'rgb(var(--rgb-herbal-gold) / <alpha-value>)',
        'text-main':      'rgb(var(--rgb-text-main) / <alpha-value>)',
        'text-muted':     'rgb(var(--rgb-text-muted) / <alpha-value>)',
      },
      keyframes: {
        'spin-gear': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        'spin-gear-reverse': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(-360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-right': {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'spin-gear':         'spin-gear 2s linear infinite',
        'spin-gear-reverse': 'spin-gear-reverse 1.4s linear infinite',
        float:               'float 3.5s ease-in-out infinite',
        'fade-up':           'fade-up 0.35s ease-out both',
        'slide-right':       'slide-right 0.35s ease-out both',
      },
      boxShadow: {
        card:    '0 4px 24px rgb(var(--rgb-deep-teal) / 0.10)',
        'card-lg': '0 8px 40px rgb(var(--rgb-deep-teal) / 0.14)',
        glow:    '0 0 0 3px rgb(var(--rgb-celestial-teal) / 0.20)',
      },
    },
  },
  plugins: [],
};

export default config;
