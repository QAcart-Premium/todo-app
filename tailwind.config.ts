import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3f51b5',
        'card-bg': '#222c36',
        'completed-bg': '#214C61',
        'page-bg': '#171e26',
      },
      fontFamily: {
        mono: ['Inconsolata', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
