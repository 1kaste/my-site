/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-primary': 'var(--color-brand-primary)',
        'brand-secondary': 'var(--color-brand-secondary)',
        'custom-light-bg': 'var(--color-bg-light)',
        'custom-dark-bg': 'var(--color-bg-dark)',
        'custom-text-base': 'var(--color-text-base)',
        'custom-heading': 'var(--color-heading)',
        'glow-color': 'var(--color-glow)',
      },
    },
  },
  plugins: [],
}
