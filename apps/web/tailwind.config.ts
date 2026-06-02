import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    '../auth/app/**/*.{ts,tsx}',
    '../auth/components/**/*.{ts,tsx}',
    '../auth/lib/**/*.{ts,tsx}',
    '../app/app/**/*.{ts,tsx}',
    '../app/components/**/*.{ts,tsx}',
    '../app/lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        void: {
          '0': '#000000',
          '50': '#0C0C0C',
          '100': '#141414',
          '150': '#1C1C1C',
          '200': '#1E1E1E',
          '300': '#2C2C2C',
          '400': '#3A3A3A',
          '500': '#555555',
          '600': '#707070',
          '700': '#909090',
          '800': '#B0B0B0',
          '900': '#D0D0D0',
          '950': '#F0F0F0',
        },
        charge: {
          DEFAULT: '#CCFF00',
          hover: '#B8E600',
          dark: '#99CC00',
          dim: 'rgba(204,255,0,0.08)',
          border: 'rgba(204,255,0,0.2)',
          glow: '0 0 40px rgba(204,255,0,0.12)',
        },
        pass: { DEFAULT: '#4ADE80', dim: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.2)' },
        flag: { DEFAULT: '#F59E0B', dim: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
        stop: { DEFAULT: '#F87171', dim: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' }
      },
      fontFamily: {
        serif: ['var(--font-instrument)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'Menlo', 'monospace']
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '1.4', letterSpacing: '0.06em' }],
        'xs':  ['11px', { lineHeight: '1.4', letterSpacing: '0.04em' }],
        'sm':  ['12px', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'base':['13px', { lineHeight: '1.5' }],
        'md':  ['14px', { lineHeight: '1.5' }],
        'lg':  ['15px', { lineHeight: '1.5' }],
        'xl':  ['16px', { lineHeight: '1.5' }],
        '2xl': ['18px', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        '3xl': ['22px', { lineHeight: '1.3', letterSpacing: '-0.015em' }],
        '4xl': ['28px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        '5xl': ['36px', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        '6xl': ['48px', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        '7xl': ['60px', { lineHeight: '1.02', letterSpacing: '-0.035em' }],
        '8xl': ['72px', { lineHeight: '1.0',  letterSpacing: '-0.04em' }],
        '9xl': ['88px', { lineHeight: '0.98', letterSpacing: '-0.045em' }]
      },
      borderRadius: {
        'xs': '2px',
        'sm': '4px',
        DEFAULT: '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'pill': '9999px'
      },
      boxShadow: {
        'card': '0 0 0 1px rgba(255,255,255,0.04)',
        'card-hover': '0 0 0 1px rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.8)',
        'overlay': '0 0 0 1px rgba(255,255,255,0.06), 0 24px 64px rgba(0,0,0,0.9)',
        'charge': '0 0 40px rgba(204,255,0,0.12), 0 0 80px rgba(204,255,0,0.05)',
        'charge-sm': '0 0 20px rgba(204,255,0,0.15)'
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fadeIn 0.4s ease both',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'pulse-charge': 'pulseCharge 3s ease-in-out infinite',
        'pulse-soft': 'pulseCharge 3s ease-in-out infinite',
        'blink': 'blink 1.2s step-end infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scanLine 4s linear infinite'
      },
      keyframes: {
        fadeUp: { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        shimmer: { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } },
        pulseCharge: { '0%,100%': { opacity: '0.4', transform: 'scale(1)' }, '50%': { opacity: '1', transform: 'scale(1.05)' } },
        blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
        float: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        scanLine: { from: { top: '-5%' }, to: { top: '105%' } }
      }
    }
  },
  plugins: [],
}

export default config;
