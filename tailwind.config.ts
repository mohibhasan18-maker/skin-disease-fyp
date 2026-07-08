module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4edea3',
        secondary: '#89ceff',
        accent: '#10b981',
        background: '#0b1326',
        surface: {
          DEFAULT: '#0b1326',
          low: '#131b2e',
          high: '#222a3d',
          highest: '#2d3449',
        },
        foreground: '#dae2fd',
        'on-background': '#dae2fd',
        'on-primary': '#003824',
        'on-secondary': '#00344d',
        'on-surface': '#dae2fd',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Manrope', 'sans-serif'],
        body: ['var(--font-body)', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(45, 52, 73, 0.6) 0%, rgba(23, 31, 51, 0.6) 100%)',
        'medical-glow': 'radial-gradient(circle at 50% 50%, rgba(137, 206, 255, 0.15) 0%, transparent 70%)',
      },
      borderRadius: {
        'xl': '1.5rem',
      },
      ringColor: {
        secondary: '#89ceff',
      },
    },
  },
  plugins: [],
};
