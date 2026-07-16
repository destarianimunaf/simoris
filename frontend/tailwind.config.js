/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f3f6fa',
          100: '#e3e9f2',
          400: '#5b729c',
          600: '#2c4c7c',
          800: '#1a3157',
          900: '#14264a',
        },
        segel: '#c98a2e',
        paper: '#f8f6f1',
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,38,74,0.06), 0 8px 24px -12px rgba(20,38,74,0.18)',
      },
    },
  },
  plugins: [],
}
