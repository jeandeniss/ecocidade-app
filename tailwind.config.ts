import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'eco': {
          'leaf': '#2E8B57',     // Forest green
          'moss': '#3B7A57',     // Sage
          'pine': '#01796F',     // Deep pine
          'sprout': '#98FF98',   // Mint
          'forest': '#228B22',   // Forest green
          'earth': '#8B4513',    // Earth brown
          'sand': '#F4A460',     // Sandy brown
          'sky': '#87CEEB',      // Sky blue
          'sunset': '#FFA07A',   // Light salmon
          'wheat': '#F5DEB3',    // Wheat
        },
      },
      backgroundImage: {
        'eco-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M30 0c16.569 0 30 13.431 30 30 0 16.569-13.431 30-30 30C13.431 60 0 46.569 0 30 0 13.431 13.431 0 30 0zm0 5C16.215 5 5 16.215 5 30c0 13.785 11.215 25 25 25s25-11.215 25-25C55 16.215 43.785 5 30 5z\" fill=\"%234CAF50\" fill-opacity=\"0.05\"/%3E%3C/svg%3E')",
        'leaf-pattern': "url('data:image/svg+xml,%3Csvg width=\"44\" height=\"44\" viewBox=\"0 0 44 44\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M22 0c12.15 0 22 9.85 22 22s-9.85 22-22 22S0 34.15 0 22 9.85 0 22 0zm0 2C10.95 2 2 10.95 2 22s8.95 20 20 20 20-8.95 20-20S33.05 2 22 2zm0 2c9.94 0 18 8.06 18 18s-8.06 18-18 18S4 31.94 4 22 12.06 4 22 4z\" fill=\"%234CAF50\" fill-opacity=\"0.05\"/%3E%3C/svg%3E')",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'wave': 'wave 2s ease-in-out infinite',
        'grow': 'grow 1.5s ease-in-out infinite',
      },
      boxShadow: {
        'eco': '0 4px 6px -1px rgba(46, 139, 87, 0.1), 0 2px 4px -1px rgba(46, 139, 87, 0.06)',
      },
      borderRadius: {
        'eco': '1rem',
      },
    },
  },
  plugins: [],
}

export default config