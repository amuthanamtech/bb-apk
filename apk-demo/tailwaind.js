/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dynamic: 'purple',
        dynamic1: '#EC4899',
        hover: '#D1D5DB'
      },
      fontSize: {
        st: '10px',
        xs: '11px',
        sm: '13px',
        base: '16px',
        lg: '30px',
        big: '60px',
        xl: '20px',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '6xl': '4rem',
        '9':'8rem'
      },
      spacing: {
        xxs: 'var(--spacing-xxs)',
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
        xxl: 'var(--spacing-xxl)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      maxWidth: {
        '5xl': '64rem', // 1024px
        '6xl': '72rem', // 1152px
        '7xl': '130rem',
        '8xl': '160rem', // 1280px
        'screen': '180rem',
      },
      keyframes: {
        sparkle: {
          "0%, 100%": { opacity: "0.75", scale: "0.9" },
          "50%": { opacity: "1", scale: "1" },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-bottom': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        sparkle: "sparkle 2s ease-in-out infinite",
        'fade-in': "fade-in 0.5s ease-in",
        'fade-out': "fade-out 0.5s ease-out",
        'slide-down': "slide-down 0.3s ease-out",
        'slide-up': "slide-up 0.3s ease-out",
        'fade-in-up': "fade-in-up 0.5s ease-out",
        'slide-in-left': "slide-in-left 0.3s ease-out",
        'slide-in-bottom': "slide-in-bottom 0.3s ease-out",
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      backfaceVisibility: {
        'hidden': 'hidden',
      },
      perspective: {
        '1000': '1000px',
      },
      rotate: {
        'y-180': 'rotateY(180deg)',
      }
    },
  },
  plugins: [],
};
