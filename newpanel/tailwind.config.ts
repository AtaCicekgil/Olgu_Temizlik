import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        primary: { DEFAULT: '#2563eb', light: '#eff6ff', dark: '#1d4ed8' },
        success: { DEFAULT: '#16a34a', light: '#f0fdf4' },
        warn:    { DEFAULT: '#d97706', light: '#fffbeb' },
        danger:  { DEFAULT: '#dc2626', light: '#fef2f2' },
      },
      borderRadius: { xl: '16px', '2xl': '20px' },
    },
  },
  plugins: [],
} satisfies Config
