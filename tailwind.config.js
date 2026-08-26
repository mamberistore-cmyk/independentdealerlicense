/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfcf9',
          100: '#faf7f0',
          200: '#f3ede0',
          300: '#e8dfcc',
        },
        ink: {
          DEFAULT: '#23272f',
          soft: '#3a3f4b',
          muted: '#6b7280',
        },
        navy: {
          DEFAULT: '#1e3a5f',
          light: '#2b4c7e',
          dark: '#16293f',
        },
        clay: {
          DEFAULT: '#c06f4f',
          light: '#e2a184',
          soft: '#f6e6dd',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'Georgia', 'Cambria', 'serif'],
      },
      maxWidth: {
        prose: '700px',
        wrap: '1120px',
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(30, 41, 59, 0.08), 0 8px 28px -12px rgba(30, 41, 59, 0.14)',
        lift: '0 6px 16px -6px rgba(30, 41, 59, 0.14), 0 16px 40px -20px rgba(30, 41, 59, 0.22)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-680px 0' },
          '100%': { backgroundPosition: '680px 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        shimmer: 'shimmer 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
