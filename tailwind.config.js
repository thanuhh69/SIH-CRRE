/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        college: {
          dark: '#081c34',
          navy: '#0b2545',
          blue: '#134074',
          accent: '#1d5796',
          light: '#eef4f8',
          gold: '#c59b27',
          goldLight: '#f4e095',
          notice: '#fffdf0',
          border: '#d0dfeb',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-cinzel)', 'Georgia', 'serif'],
      },
      boxShadow: {
        'college': '0 4px 14px 0 rgba(11, 37, 69, 0.08)',
        'college-lg': '0 10px 25px -3px rgba(11, 37, 69, 0.12), 0 4px 6px -2px rgba(11, 37, 69, 0.05)',
      }
    },
  },
  plugins: [],
};
