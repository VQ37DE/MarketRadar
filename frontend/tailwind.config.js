export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'] },
      colors: {
        radar: {
          bg: '#0d0d0d',
          panel: '#1a1a1a',
          line: '#2a2a2a',
          green: '#36d399',
          amber: '#f4c430',
          red: '#ff5c5c',
          cyan: '#38bdf8',
        },
      },
      animation: { 'slide-fade': 'slideFade 420ms ease-out both' },
      keyframes: {
        slideFade: {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
