import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-teal':      '#2C444D',
        'celestial-teal': '#5A7C83',
        'warm-cream':     '#F2E6D8',
        'soft-beige':     '#CCB68E',
        'muted-sand':     '#C7B8A4',
        'mystic-ember':   '#8B4A2B',
        'herbal-gold':    '#D4B27F',
        'text-main':      '#1F2A30',
        'text-muted':     '#6B7C82',
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
        card:    '0 4px 24px rgba(44, 68, 77, 0.10)',
        'card-lg': '0 8px 40px rgba(44, 68, 77, 0.14)',
        glow:    '0 0 0 3px rgba(90, 124, 131, 0.20)',
      },
    },
  },
  plugins: [],
};

export default config;
