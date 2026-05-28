import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base:    '#0C0906',   // page background
          surface: '#161209',   // card / elevated surface
          lift:    '#1E1710',   // hover lifted surface
        },
        gold:  { DEFAULT: '#C4882C', light: '#E8A84E', muted: '#7A5518' },
        cream: { DEFAULT: '#F0E8D8', muted: '#9A8A72', ghost: '#5A4E3E' },
        green: { DEFAULT: '#3D6B56', light: '#5D9B7E' },
        danger: '#C44830',
        border: { warm: '#2C2418', accent: 'rgba(196,136,44,0.25)' }
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans:  ['var(--font-dm-sans)', 'DM Sans', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'marquee': 'marquee 40s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
